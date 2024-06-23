import React from 'react';
import { View, Button, Text } from 'react-native';
import PushNotification from 'react-native-push-notification';

const AlarmClock = () => {
  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      title: 'Wake Up!',
      message: 'Time to get up and start your day.',
      date: new Date(Date.now() + 10 * 1000), // 10 seconds from now
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Set Alarm" onPress={scheduleNotification} />
      <Text>dfdfdfd</Text>
    </View>
  );
};

export default AlarmClock;
