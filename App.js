import React, {Component} from 'react';
import { Text, View, Button, StyleSheet} from 'react-native';

const CleverTap = require('clevertap-react-native');
import { firebase } from '@react-native-firebase/messaging';

class App extends Component {

  constructor(props) {
    super(props);
    CleverTap.enableDeviceNetworkInfoReporting(true);
    CleverTap.setDebugLevel(3);

    CleverTap.createNotificationChannel("generic","generic","generic",3,true);
    this.checkPermission();
  }

  viewedEvent = () => {
    CleverTap.recordEvent('testEvent');
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
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
      //this.showAlert('Failed', 'No token received');
    }
  }

  onUserLogin = (profile) => {
    CleverTap.onUserLogin(profile);
  }

  loginEvent = () => {
    var profile = ({'Name': 'testUserA1', 'Identity': '423423', 'Email': 'dsad@fsdfsd.com', 'custom1': 123});
    onUserLogin(profile);
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