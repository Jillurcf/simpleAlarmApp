import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Platform,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import moment from 'moment-timezone';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);
  const [sound, setSound] = useState(null);

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
        soundName: 'alarm.mp3',
        importance: 4,
        vibrate: true,
      },
      created => {
        if (created) {
          console.log('Notification channel created successfully');
        } else {
          console.log('Notification channel already exists or failed to create');
        }
      }
    );

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

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
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (notificationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'You must grant notification permission to set alarms.'
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
        'You must grant notification permission to set alarms.'
      );
      return;
    }

    // Adjust for 'Asia/Dhaka' time zone (UTC+6)
    const notificationMoment = moment(date).tz('Asia/Dhaka');
    const notificationDate = notificationMoment.toDate();

    PushNotification.localNotificationSchedule({
      channelId: 'alarm-channel',
      title: 'Alarm',
      message: 'Wake up! It is time to start your day',
      date: notificationDate,
      allowWhileIdle: true,
      soundName: 'alarm.mp3',
    });

    // Calculate delay for playing sound
    const now = moment().tz('Asia/Dhaka');
    const delayInMillis = notificationMoment.diff(now);

    // Schedule playing sound after delay
    setTimeout(() => {
      playSound();
    }, delayInMillis);

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
      <Button title="Set Alarm" onPress={handleSetAlarm} />
      {alarmSet && (
        <Text style={styles.message}>
          Alarm set for {moment(date).tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss')}
        </Text>
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
});

export default App;
