package com.alarmapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = YourNativeModule.NAME)
public class YourNativeModule extends ReactContextBaseJavaModule {

    public static final String NAME = "YourNativeModule";

    public YourNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void yourMethod(String param) {
        // Implement your native method logic here
    }
}
