package com.alarmapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;



public class AlarmManagerModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    AlarmManagerModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "AlarmManager";
    }

    @ReactMethod
    public void setAlarm(int hour, int minute) {
        AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(reactContext, AlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(reactContext, 0, intent, 0);

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);

        if (alarmManager != null) {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            Log.d("AlarmManager", "Alarm set for " + hour + ":" + minute);
        }
    }

    @ReactMethod
    public void cancelAlarm() {
        AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(reactContext, AlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(reactContext, 0, intent, 0);

        if (alarmManager != null) {
            alarmManager.cancel(pendingIntent);
            Log.d("AlarmManager", "Alarm canceled");
        }
    }
}
