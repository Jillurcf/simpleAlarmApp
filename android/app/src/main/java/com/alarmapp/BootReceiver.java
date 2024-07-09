package com.alarmapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
            long timeInMillis = prefs.getLong("alarmTimeInMillis", -1);
            String message = prefs.getString("alarmMessage", "");

            if (timeInMillis > 0) {
                Intent serviceIntent = new Intent(context, AlarmSchedulingService.class);
                serviceIntent.putExtra("timeInMillis", timeInMillis);
                serviceIntent.putExtra("message", message);
                context.startService(serviceIntent);
            }
        }
    }
}
