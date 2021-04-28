import React, {Component} from 'react';
import { Text, View, Button, StyleSheet} from 'react-native';

const CleverTap = require('clevertap-react-native');


class App extends Component {

  constructor(props) {
    super(props);
    CleverTap.enableDeviceNetworkInfoReporting(true);
    CleverTap.createNotificationChannel("generic","generic","generic",3,true);

  }

  viewedEvent = () => {
    CleverTap.recordEvent('testEvent');
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
          onPress={() => viewedEvent()}
          title="viewed"
        />
        <Button
          onPress={() => loginEvent()}
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