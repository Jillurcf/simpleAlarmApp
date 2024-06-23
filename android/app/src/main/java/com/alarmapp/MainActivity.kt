package com.alarmapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint




class MainActivity : ReactActivity() {
    
    

    override fun getMainComponentName(): String? {
        return "AlarmApp"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            mainComponentName!!,
            DefaultNewArchitectureEntryPoint.fabricEnabled
        )
    }
}

