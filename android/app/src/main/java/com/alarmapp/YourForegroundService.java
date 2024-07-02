import com.alarmapp.R;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class YourForegroundService extends Service {

    @Override
    public void onCreate() {
        super.onCreate();

        // Create a notification for the foreground service
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, "foreground-service-channel")
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle("Foreground Service")
                .setContentText("Foreground service is running")
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        // Start the foreground service
        startForeground(1, notificationBuilder.build());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Handle service start
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
