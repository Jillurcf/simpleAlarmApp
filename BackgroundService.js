import { NativeEventEmitter, NativeModules } from 'react-native';

// Destructure the RNPushNotification module from NativeModules
const { RNPushNotification } = NativeModules;
let pushNotificationEmitter;

if (RNPushNotification) {
  // Check if addListener exists and is a function
  if (typeof RNPushNotification.addListener !== 'function') {
    RNPushNotification.addListener = () => {
      console.warn('RNPushNotification.addListener is not implemented');
    };
  }

  // Check if removeListeners exists and is a function
  if (typeof RNPushNotification.removeListeners !== 'function') {
    RNPushNotification.removeListeners = () => {
      console.warn('RNPushNotification.removeListeners is not implemented');
    };
  }

  // Instantiate the event emitter with the RNPushNotification module
  pushNotificationEmitter = new NativeEventEmitter(RNPushNotification());
} else {
  console.log('RNPushNotification is not defined.');
}

export default pushNotificationEmitter;
