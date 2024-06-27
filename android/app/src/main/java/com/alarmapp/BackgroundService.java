package com.alarmapp;

import android.content.Intent;
import android.os.Bundle;

import android.app.Service;
import android.os.IBinder;
import android.util.Log;



import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class BackgroundService extends HeadlessJsTaskService {

 
@Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("BackgroundService", "Background service is running");
        return super.onStartCommand(intent, flags, startId);
    }



    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        WritableMap params = Arguments.createMap();

        if (extras != null) {
            // Example: Copying all extras from Bundle to WritableMap
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                if (value instanceof String) {
                    params.putString(key, (String) value);
                } else if (value instanceof Integer) {
                    params.putInt(key, (Integer) value);
                } else if (value instanceof Double) {
                    params.putDouble(key, (Double) value);
                } else if (value instanceof Float) {
                    params.putDouble(key, (Float) value);
                } else if (value instanceof Boolean) {
                    params.putBoolean(key, (Boolean) value);
                } else {
                    params.putString(key, String.valueOf(value));
                }
            }
        }

        // Configure the task with appropriate parameters
        return new HeadlessJsTaskConfig(
                "BackgroundService", // Task name (must match your registered task name)
                params, // Parameters to pass to the task
                5000, // Timeout for the task in milliseconds (adjust as needed)
                true // Allow task to continue in foreground (if needed)
        );
    }



    
}
