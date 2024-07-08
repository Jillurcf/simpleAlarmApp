import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Platform,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Alert,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import Video from 'react-native-video';
import moment from 'moment-timezone';
import BackgroundTimer from 'react-native-background-timer';
import RNForegroundService from '@supersami/rn-foreground-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';




const ScheduleVideo = require('./assets/appVideo.mp4');
const {width, height} = Dimensions.get('window');

const App = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);
  const [sound, setSound] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [timeOutId, setTimeOutId] = useState(null);

  useEffect(() => {
    // Load the sound file
    const alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      setSound(alarmSound);
    });

    // Create the notification channel
    PushNotification.createChannel(
      {
        channelId: 'alarm-channel',
        channelName: 'Alarm Channel',
        channelDescription: 'A channel for alarm notifications',
        playSound: true,
        allowWhileIdle: true,
        soundName: 'alarm.mp3',
        importance: 4,
        vibrate: true,
      },
      created => {
        if (created) {
          console.log('Notification channel created successfully');
        } else {
          console.log(
            'Notification channel already exists or failed to create',
          );
        }
      },
    );
    // Configure push notification
    PushNotification.configure({
      onNotification: function (notification) {
        handleNotification(notification);
      },
      popInitialNotification: true,
      requestAlarmPermission: Platform.OS === 'ios',
    });

    // Handle incoming notifications while app is in foreground
   
    loadAlarmSchedule();
    return () => {
      if (sound) {
        sound.release();
      }
     
    
    };
  }, []);

  const handleNotification = notification => {
    // display popup or take action based on the notification
    if (
      notification.channelId === 'alarm-channel' &&
      notification.userInfo.action === 'PLAY_ALARM'
    ) {
      showAlarmPopup();
    }
  };
  
   
  // setAlarm();
  
  
  const showAlarmPopup = () => {
    // display modal or alert
    Alert.alert(
      'Alarm',
      'wake up It is time to start your day',
      [
        {
          text: 'Cancel Alarm',
          onPress: cancelAlarm,
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
    playSound();
    setPlayVideo(true);
    setAlarmSet(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  const requestAlarmPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const notificationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (notificationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'You must grant notification permission to set alarms.',
          );
          return false;
        }
      }
      return true;
    }
    return true;
  };
 
// dsdsdldsdflddfjle
// const startAlarmService = async () => {
//   if (Platform.OS === 'android') {
//     await BackgroundService.start(
//       {
//         taskName: 'AlarmService',
//         taskTitle: 'Alarm Service',
//         taskDesc: 'Your alarm is running in the background',
//         taskIcon: {
//           name: 'ic_notification',
//           type: 'mipmap',
//         },
//         linkingURI: 'alarmapp://home', // Adjust this to your app's linking URI
//       },
//       async () => {
//         // Your alarm logic here
//         // For example, play the alarm sound using a library like react-native-sound
//         if (sound) {
//           sound.play((success) => {
//             if (success) {
//               console.log('Sound played successfully');
//             } else {
//               console.log('Sound playback failed');
//             }
//           });
//         } else {
//           console.log('Sound object is null');
//         }
//       }
//     );
//   }
// };





 
  const scheduleNotification = async () => {
    const permissionGranted = await requestAlarmPermission();
    if (!permissionGranted) {
      Alert.alert(
        'Permission Denied',
        'You must grant notification permission to set alarms.',
      );
      return;
    }

    // Adjust for 'Asia/Dhaka' time zone (UTC+6)
    const notificationMoment = moment(date).tz('Asia/Dhaka');
    const notificationDate = notificationMoment.toDate();

    // Save Schedule date to AsyncStorage
    try {
      await AsyncStorage.setItem(
        'alarmSchedule',
        notificationDate.toString(),
      );
      console.log('AlarmSchedule:', notificationDate.toString());
    } catch (error) {
      console.error('Error saving alarm schedule:', error);
    }

    PushNotification.localNotificationSchedule({
      channelId: 'alarm-channel',
      title: 'Alarm',
      message: 'Wake up! It is time to start your day',
      date: notificationDate,
      allowWhileIdle: true,
      id: 123,
      soundName: 'alarm.mp3',
      userInfo: {action: 'PLAY_ALARM'},
    });

   // Start foreground service on Android
  //  if (Platform.OS === 'android') {
  //   await startAlarmService();
  // }


    // strat foreground service
    if (Platform.OS === 'android') {
      RNForegroundService.start({
        id: 1,
        title: 'Alarm Service',
        message: 'Running',
        vibration: false,
      });
    }
    // Calculate delay for playing sound
    const now = moment().tz('Asia/Dhaka');
    const delayInMillis = notificationMoment.diff(now);

    // Schedule playing sound after delay
    const id = BackgroundTimer.setTimeout(() => {
      playSound();
      setPlayVideo(true);
    }, delayInMillis);
    setTimeOutId(id);
    setAlarmSet(true);
    console.log('Notification Date:', notificationDate);
  };

  const playSound = () => {
    if (sound) {
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Sound playback failed');
        }
      });
    } else {
      console.log('Sound object is null');
    }
  };

  const handleSetAlarm = async () => {
  
    await scheduleNotification();
    // AlarmModule.setAlarm();
  };

  const cancelAlarm = async () => {
    setAlarmSet(false);
    if (timeOutId) {
      BackgroundTimer.clearTimeout(timeOutId);
      setTimeOutId(null);
      setAlarmSet(false);
      if (sound) {
        sound.stop(() => {
          console.log('sound stop');
        });
      }
      if (Platform.OS === 'android') {
        RNForegroundService.stop();
      }
    }
    PushNotification.cancellAllLocalNotifications();

    // Remove schedule date from AsyncStorage
    try {
      await AsyncStorage.removeItem('alarmSchedule');
      console.log('Alarm schedule removed from local storage');
    } catch (error) {
      console.error(
        'eroor removing alarm sehcedule from local storage:',
        error,
      );
    }
  };

  const loadAlarmSchedule = async () => {
    try {
      const storedSchedule = await AsyncStorage.getItem('alarmSchedule');
      if (storedSchedule) {
        const scheduleDate = new Date(storedSchedule);
        setDate(scheduleDate);
        setAlarmSet(true);
        console.log('loadded alarm schedule from local storage:');
      }
    } catch (error) {
      console.error('error loading alarm schedule from local storage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm App</Text>
      <Button title="Pick a date/time" onPress={showDateTimePicker} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <View
        style={{flexDirection: 'row', gap: 5, paddingVertical: height * 0.02}}>
        <Button title="Set Alarm" onPress={handleSetAlarm} />
        <Button title="Cancel Alarm" onPress={cancelAlarm} />
      </View>
      {alarmSet && (
        <Text style={styles.message}>
          Alarm set for{' '}
          {moment(date).tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      )}
      {playVideo && (
        <Video
          source={ScheduleVideo}
          // source={{uri: '/assets/appVideo.mp4'}}
          style={styles.video}
          onEnd={() => setPlayVideo(false)}
          repeat={false}
          controls={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  video: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});

export default App;


