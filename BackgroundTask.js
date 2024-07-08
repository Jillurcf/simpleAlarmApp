// // BackgroundTask.js

// import BackgroundTask from 'react-native-background-task';

// // Register a background task
// BackgroundTask.define(async () => {
//   // Your background task logic here
//   console.log("Running background task...");

//   // Make sure to call `BackgroundTask.finish()` to let the OS know the task is complete
//   BackgroundTask.finish();
// });

// // Optional: Set up a periodic task (runs approximately every 15 minutes)
// BackgroundTask.schedule({
//   period: 900, // 15 minutes in seconds (minimum allowed is 15 minutes)
// });

// // Start the background task (optional if using periodic task)
// BackgroundTask.start();
