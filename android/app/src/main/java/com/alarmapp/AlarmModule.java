package com.alarmapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Calendar;

public class AlarmModule extends ReactContextBaseJavaModule {
    private static final String TAG = "AlarmModule";
    private ReactApplicationContext reactContext;

    public AlarmModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "AlarmModule";
    }

    @ReactMethod
    public void setAlarm(int seconds) {
        Intent alarmIntent = new Intent(reactContext, AlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(reactContext, 0, alarmIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager != null) {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + seconds * 1000, pendingIntent);
        }
    }

}


