// BackgroundTask.js
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';

const BackgroundTask = async () => {
  // Load and play sound
  const alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    alarmSound.play((success) => {
      if (success) {
        console.log('Sound played successfully');
      } else {
        console.log('Sound playback failed');
      }
    });
  });
};

export default BackgroundTask;
