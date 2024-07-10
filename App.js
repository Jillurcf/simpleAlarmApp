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
import {NativeModules} from 'react-native';

const ScheduleVideo = require('./assets/appVideo.mp4');
const {width, height} = Dimensions.get('window');

const {AlarmScheduler} = NativeModules;
console.log("26", AlarmScheduler)

const App = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);
  const [sound, setSound] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [timeOutId, setTimeOutId] = useState(null);

  useEffect(() => {
    const alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      setSound(alarmSound);
    });

    PushNotification.createChannel(
      {
        channelId: 'alarm-channel',
        channelName: 'Alarm Channel',
        channelDescription: 'A channel for alarm notifications',
        playSound: true,
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

    PushNotification.configure({
      onNotification: function(notification) {
        handleNotification(notification);
        if (notification.userInfo && notification.userInfo.action === 'PLAY_ALARM') {
          showAlarmPopup();
        }
        notification.finish(PushNotification.FetchResult.NoData);
      },
      requestPermissions: Platform.OS === 'ios',
      popInitialNotification: true,
    });

    RNForegroundService.start({
      id: 1,
      title: 'Alarm Service',
      message: 'Running',
      vibration: false,
    });

    loadAlarmSchedule();
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const handleNotification = notification => {
    if (
      notification.channelId === 'alarm-channel' &&
      notification.userInfo?.action === 'PLAY_ALARM'
    ) {
      showAlarmPopup();
    }
  };

  const showAlarmPopup = () => {
    Alert.alert(
      'Alarm',
      'Wake up! It is time to start your day',
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

  const scheduleNotification = async () => {
    const permissionGranted = await requestAlarmPermission();
    if (!permissionGranted) {
      Alert.alert(
        'Permission Denied',
        'You must grant notification permission to set alarms.',
      );
      return;
    }

    const notificationMoment = moment(date).tz('Asia/Dhaka');
    const notificationDate = notificationMoment.toDate();

    try {
      await AsyncStorage.setItem('alarmSchedule', notificationDate.toString());
      console.log('164, ++AlarmSchedule:', notificationDate.toString());
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

    if (Platform.OS === 'android') {
      RNForegroundService.start({
        id: 1,
        title: 'Alarm Service',
        message: 'Running',
        vibration: false,
      });
    }

    const now = moment().tz('Asia/Dhaka');
    const delayInMillis = notificationMoment.diff(now);

    const id = BackgroundTimer.setTimeout(() => {
      playSound();
      setPlayVideo(true);
    }, delayInMillis);
    setTimeOutId(id);
    setAlarmSet(true);
    console.log('Notification Date:', notificationDate);
    return delayInMillis;
    // return notificationDate;
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
    const delay = await scheduleNotification();
 const currentDate = new Date();
 console.log("currentDate", currentDate)
 const timeInMillis = currentDate.getTime() + delay;
 console.log("", timeInMillis)
    AlarmScheduler.scheduleAlarm(timeInMillis, 'Wake up! It is time to start your day');
  };

  const cancelAlarm = async () => {
    setAlarmSet(false);
    if (timeOutId) {
      BackgroundTimer.clearTimeout(timeOutId);
      setTimeOutId(null);
      setAlarmSet(false);
      if (sound) {
        sound.stop(() => {
          console.log('Sound stopped');
        });
      }
      if (Platform.OS === 'android') {
        RNForegroundService.stop();
      }
    }
    PushNotification.cancelAllLocalNotifications();
    AlarmScheduler.cancelAlarm();
    try {
      await AsyncStorage.removeItem('alarmSchedule');
      console.log('Alarm schedule removed from local storage');
    } catch (error) {
      console.error('Error removing alarm schedule from local storage:', error);
    }
  };

  const loadAlarmSchedule = async () => {
    try {
      const storedSchedule = await AsyncStorage.getItem('alarmSchedule');
      if (storedSchedule) {
        const scheduleDate = new Date(storedSchedule);
        setDate(scheduleDate);
        setAlarmSet(true);
        console.log('Loaded alarm schedule from local storage:', scheduleDate);
      }
    } catch (error) {
      console.error('Error loading alarm schedule from local storage:', error);
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
      <View style={{flexDirection: 'row', gap: 5, paddingVertical: height * 0.02}}>
        <Button title="Set Alarm" onPress={handleSetAlarm} />
        <Button title="Cancel Alarm" onPress={cancelAlarm} />
      </View>
      {alarmSet && (
        <Text style={styles.message}>
          Alarm set for {moment(date).tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      )}
      {playVideo && (
        <Video
          source={ScheduleVideo}
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
