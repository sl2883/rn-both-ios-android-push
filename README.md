**CleverTap React native integration**
--
- Installing the React Native SDK
```
npm install --save clevertap-react-native
```

**Android**
- Connecting to CleverTap backend
In you AndroidManifest file, add the mapping of clevertap account information inside the 'application' tag
```java
<meta-data
	android:name="CLEVERTAP_ACCOUNT_ID"
	android:value="**Your CleverTap Account ID**"/>
<meta-data
	android:name="CLEVERTAP_TOKEN"
	android:value="**Your CleverTap Account Token**"/>
```
- Map your CleverTap account region 
```java
<meta-data
	android:name="CLEVERTAP_REGION"
	android:value="us1"/>
```
- Enable default app lifecycle tracking
In your android/app/src/[...]/MainApplication.java file, add the following snippet
```java
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.react.CleverTapPackage;
import com.clevertap.android.sdk.CleverTapAPI;
```
Also update the onCreate function
```java
@Override
public  void onCreate() {
	ActivityLifecycleCallback.register(this);
	super.onCreate();
	SoLoader.init(this, /* native exopackage */  false);
	initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
}
```
- Enabling push notifications
In the CleverTap dashboard, make sure to update the Sender ID and FCM keys (to be fetched from your Firebase project). 
Also, make sure you've followed the steps provided by Firebase to integrate your android app with firebase. This includes
-- Having the google-services.json file in your android app folder.
-- Updating the gradle files to include firebase dependency 

If you're going with the default CleverTap integration, add the Clevertap's Firebase Service class as a listener in your AndroidManifest file.

```java
<service android:name="com.clevertap.android.sdk.pushnotification.fcm.FcmMessageListenerService">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```
If you're using a customer Firebase Messaging class, map the listener to that class in the manifest file.

```java
<service  android:name="com.rnpush.MyFirebaseMessagingService">
	<intent-filter>
		<action android:name="com.google.firebase.MESSAGING_EVENT"/>
	</intent-filter>
</service>
```
If using a custom Firebase Messaging Class, update the class to connect with Clevertap to render the CleverTap notifications as well as to pass on the tokens.
```java
package  com.rnpush;

import  android.os.Bundle;
import  android.util.Log;
import  com.clevertap.android.sdk.CleverTapAPI;
import  com.clevertap.android.sdk.pushnotification.NotificationInfo;
import  com.google.firebase.messaging.FirebaseMessagingService;
import  com.google.firebase.messaging.RemoteMessage;
import  java.util.Map;

public  class MyFirebaseMessagingService extends FirebaseMessagingService {

@Override

public  void onMessageReceived(RemoteMessage message){
	try {
		if (message.getData().size() >  0) {
			Bundle extras =  new Bundle();
			for (Map.Entry<String, String> entry : message.getData().entrySet()) {
				extras.putString(entry.getKey(), entry.getValue());
			}

			Log.e("TAG","onReceived Mesaage Called");

			NotificationInfo info = CleverTapAPI.getNotificationInfo(extras);

			if (info.fromCleverTap) {
				CleverTapAPI.createNotification(getApplicationContext(), extras);
			}
			else {
				super.onMessageReceived(message);
			}
		}
	} catch (Throwable t) {
		Log.d("MYFCMLIST", "Error parsing FCM message", t);
	}
}

@Override
public  void onNewToken(String token) {
	CleverTapAPI.getDefaultInstance(this).pushFcmRegistrationId(token,true);
	}
}
```

- Ensure that Firebase dependency is to the latest version. In your app's build.gradle file, you have the following
```java
implementation 'com.google.firebase:firebase-messaging:20.2.4'
```

In your main React native App.js, create a notification channel (required for Android 0 and above)
```javascript
CleverTapReact.createNotificationChannel(channelId,channelName,channelDescription,importance,showBadge);
//CleverTap.createNotificationChannel("generic","generic","generic",3,true);
``` 
Or, you can create channel in your MainApplication.java
```java
CleverTapAPI.createNotificationChannel(getApplicationContext(), "generic", "generic", "generic", 3, true);
```

You can also send the tokens to CleverTap from you App.js class. 
```java

const CleverTap = require('clevertap-react-native');
import { firebase } from  '@react-native-firebase/messaging';


this.checkPermission();

checkPermission =  async () => {
	const enabled =  await firebase.messaging().hasPermission();
	if (enabled) {
		if(Platform.OS ===  'android') {
			this.getFcmToken();
		}
	} else {
		//this.requestPermission();
	}
}

getFcmToken =  async () => {
	const fcmToken =  await firebase.messaging().getToken();
	if (fcmToken) {
		console.log(fcmToken);
		CleverTap.setPushToken(fcmToken, CleverTap.FCM);	
		//await this.CleverTap.setPushTokenAsString(fcmToken, CleverTap.FCM);
	} else {
	}
}
```

To get notification button clicks, add
```java
<service
    android:name="com.clevertap.android.sdk.pushnotification.CTNotificationIntentService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.clevertap.PUSH_EVENT" />
    </intent-filter>
</service>
```

And for push amplifications
```java
<meta-data
    android:name="CLEVERTAP_BACKGROUND_SYNC"
    android:value="1"/>
```

**ios**

- In your Podfile
```swift
target 'YOUR_TARGET_NAME' do
	use_frameworks!
	pod 'clevertap-react-native', :path =>'../node_modules/clevertap-react-native'
end
```

From your terminal, run pod install from the xcode folder.

- Add CT Credentials in Info.plist
-- CleverTapAccountID
-- CleverTapToken
-- CleverTapRegion
- In your AppDelegate

```swift
[CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
[[CleverTapReactManager sharedInstance] applicationDidLaunchWithOptions:launchOptions];
[CleverTap setDebugLevel:3];
[self registerForPush];

-(void) registerForPush {
	UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
center.delegate = self;
	[center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error){
		if(!error) {
			dispatch_async(dispatch_get_main_queue(), ^{
			[[UIApplication sharedApplication] registerForRemoteNotifications];
		});
	}
	}];
}
```

In your react code, you can also perform the following to request permission and send the APNS token to CleverTap.

```javascript
CleverTapReact.registerForPush();
```
Or, get the apns token from Firebase messaging service and send it manually

```javascript
this.checkPermission();

checkPermission =  async () => {
	const enabled =  await firebase.messaging().hasPermission();
	if (enabled) {
		if (Platform.OS ===  'ios') {
			this.getAPNSToken();
		}
	} else {
	//this.requestPermission();
	}
}

getAPNSToken =  async () => {
	const apnsToken =  await firebase.messaging().getAPNSToken();
	if( apnsToken) {
	console.log(apnsToken);
	CleverTap.setPushToken(apnsToken, "APNS");
	}
}
```