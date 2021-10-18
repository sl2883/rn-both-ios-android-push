import React, {Component} from 'react';
import { Text, View, Button, Linking, StyleSheet, Alert} from 'react-native';

const CleverTap = require('clevertap-react-native');
import { firebase } from '@react-native-firebase/messaging';

class App extends Component {

  constructor(props) {
    super(props);
    CleverTap.enableDeviceNetworkInfoReporting(true);
    CleverTap.setDebugLevel(3);

    CleverTap.createNotificationChannel("generic","generic","generic",3,true);
    
    CleverTap.addListener(CleverTap.CleverTapProductConfigDidFetch, (event) => { 
      console.log(event);

      CleverTap.getProductConfigString('reward type', (err, res) => {
        console.log('PC reward type val in string :', res, err);
      });
      
      CleverTap.getNumber('price', (err, res) => {
          console.log('PC price val in number :', res, err);
      });
      
    });

    CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event) => { 
      console.log(event);
    });

    CleverTap.setDefaultsMap({'price': 100, 'reward type': 'Bronze'});
    CleverTap.fetchAndActivate();

    this.checkPermission();

    CleverTap.registerForPush()

    Linking.addEventListener('url', ({url}) => {
      console.log("[SuNNY] url rec: ", url)
    })

    const url = Linking.getInitialURL();
    if (url) {
      console.log("[SuNNY] url rec: ", url)
    }

  }

  viewedEvent = () => {
    CleverTap.recordEvent('testEvent');
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      if(Platform.OS === 'android') {
        this.getFcmToken();
      }
      else if (Platform.OS === 'ios') {
        this.getAPNSToken();
      }
    } else {
        //this.requestPermission();
    }
  }

  getFcmToken = async () => {
     const fcmToken = await firebase.messaging().getToken();
     
    if (fcmToken) {
      console.log(fcmToken);
      CleverTap.setPushToken(fcmToken, CleverTap.FCM);
       //await this.CleverTap.setPushTokenAsString(fcmToken, CleverTap.FCM);
    } else {
    }
  }

  getAPNSToken = async () => {
    const apnsToken = await firebase.messaging().getAPNSToken();
    if( apnsToken) {
      console.log(apnsToken);
      //this.showAlert('Failed', 'No token received');
      CleverTap.setPushToken(apnsToken, "APNS");
    }
  }

  onUserLogin = (profile) => {
    CleverTap.onUserLogin(profile);
  }

  loginEvent = () => {
    var RandomNumber = Math.floor(Math.random() * 100) + 1 ;
    var user = 'User MSG-Whatsapp ' + RandomNumber.toString();
    var phone = '+151094471' + RandomNumber.toString();
    var profile = ({'Name': user, 'Phone': phone, 'MSG-whatsapp': true, 'passing-msg-whatsapp-value': true, 'Identity': user, 'userId': 'User MSG-Whatsapp'});
    CleverTap.onUserLogin(profile);
    alert(user);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={this.viewedEvent}
          title="viewed"
        />
        <Button
          onPress={this.loginEvent}
          title="login"
        />
      </View>
    )
  }
}

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;