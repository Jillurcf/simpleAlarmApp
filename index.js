/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';

// Must be outside of any component lifecycle but in the same file
PushNotification.configure({
  // Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
