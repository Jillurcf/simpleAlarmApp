/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';
import BackgroundService from './BackgroundService';
import BackgroundTask from "./BackgroundTask";
// Must be outside of any component lifecycle but in the same file
PushNotification.configure({
  // Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
    // Process the notification
    if(notification.userInfo && notification.userInfo.action === 'PLAY_ALARM') {
      console.log("23, index.js-notified")
    }
    // Call the notification handler
    notification.finish(PushNotification.FetchResult.NoData)
  },
  requestPermissions: Platform.OS === 'ios',
  popInitialNotification: true,
  requestPermissions: true,
});
BackgroundTask;
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('BackgroundService', () => BackgroundService)