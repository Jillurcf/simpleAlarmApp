package com.alarmapp;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

public class AlarmSchedulingService extends IntentService {

    public AlarmSchedulingService() {
        super("AlarmSchedulingService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            Bundle extras = intent.getExtras();
            if (extras != null) {
                long timeInMillis = extras.getLong("timeInMillis");
                String message = extras.getString("message");

                ReactApplicationContext reactContext = new ReactApplicationContext(this);
                AlarmSchedulerModule alarmScheduler = new AlarmSchedulerModule(reactContext);
                alarmScheduler.scheduleAlarm(timeInMillis, message);
            }
        }
    }
}
