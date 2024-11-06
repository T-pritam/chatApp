import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  activityTimeout: 10000,
})

// export function setupPusherConnection(): void {
//   // Track inactivity timer
//   let inactivityTimer: NodeJS.Timeout;

//   // Resets the inactivity timer on user interaction
//   const resetInactivityTimer = () => {
//     clearTimeout(inactivityTimer);
//     inactivityTimer = setTimeout(() => {
//       pusherClient.disconnect(); // Disconnect after 10 seconds of inactivity
//     }, 10000); // 10 seconds
//   };

//   // Event listener for user actions to reset the inactivity timer
//   ['mousemove', 'keydown', 'click'].forEach((event) => {
//     document.addEventListener(event, resetInactivityTimer);
//   });

//   // Handles connection based on tab visibility
//   const handleVisibilityChange = () => {
//     if (document.hidden) {
//       pusherClient.disconnect(); // Disconnect when the tab is hidden
//     } else {
//       pusherClient.connect(); // Reconnect when tab becomes visible
//       resetInactivityTimer(); // Restart inactivity timer on returning
//     }
//   };

//   // Attach the visibility change event listener
//   document.addEventListener('visibilitychange', handleVisibilityChange);

//   // Disconnect on page unload or refresh
//   window.addEventListener('beforeunload', () => {
//     pusherClient.disconnect();
//   });

//   // Initialize the inactivity timer
//   resetInactivityTimer();
// }