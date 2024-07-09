package com.alarmapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;



 public class AlarmSchedulerModule extends ReactContextBaseJavaModule {

    public static ReactApplicationContext reactContext;

    public AlarmSchedulerModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }


    @Override
    public String getName() {
        return "AlarmScheduler";
    }

    @ReactMethod
    public void scheduleAlarm(double timeInMillis, String message) {
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext().getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(getReactApplicationContext(), AlarmReceiver.class);
        intent.putExtra("message", message);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(getReactApplicationContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, (long) timeInMillis, pendingIntent);
    }

    @ReactMethod
    public void cancelAlarm() {
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext().getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(getReactApplicationContext(), AlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(getReactApplicationContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        alarmManager.cancel(pendingIntent);
    }

    
}
