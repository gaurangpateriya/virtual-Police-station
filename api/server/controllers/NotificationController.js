import { Expo } from 'expo-server-sdk';

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
const expo = new Expo();

class NotificationController {
  static async sendNotification(usersNotifToken, title, body, data) {
    try {
      // Create the messages that you want to send to clients
      const messages = usersNotifToken.map((pushToken) => {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
          console.log(`Push token ${pushToken} is not a valid Expo push token`);
          return null;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        return {
          to: pushToken, sound: 'default', title, body, data,
        };
      });

      // The Expo push notification service accepts batches of notifications so
      // that you don't need to send 1000 requests to send 1000 notifications. We
      // recommend you batch your notifications to reduce the number of requests
      // and to compress them (notifications with similar content will get
      // compressed).
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];

      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let i = 0; i < chunks.length; i += 1) {
        const chunk = chunks[i];
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          // console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.log(error);
        }
      }

      // Later, after the Expo push notification service has delivered the
      // notifications to Apple or Google (usually quickly, but allow the the service
      // up to 30 minutes when under load), a "receipt" for each notification is
      // created. The receipts will be available for at least a day; stale receipts
      // are deleted.
      //
      // The ID of each receipt is sent back in the response "ticket" for each
      // notification. In summary, sending a notification produces a ticket, which
      // contains a receipt ID you later use to get the receipt.
      //
      // The receipts may contain error codes to which you must respond. In
      // particular, Apple or Google may block apps that continue to send
      // notifications to devices that have blocked notifications or have uninstalled
      // your app. Expo does not control this policy and sends back the feedback from
      // Apple and Google so you can handle it appropriately.
      const receiptIds = [];
      tickets.forEach((ticket) => {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
          receiptIds.push(ticket.id);
        }
      });

      const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

      // Like sending notifications, there are different strategies you could use
      // to retrieve batches of receipts from the Expo service.
      for (let i = 0; i < receiptIdChunks.length; i += 1) {
        const chunk = receiptIdChunks[i];
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          // console.log('receipst', receipts);

          // The receipts specify whether Apple or Google successfully received the
          // notification and information about an error, if one occurred.
          Object.keys(receipts).forEach((receiptId) => {
            const { status, message, details } = receipts[receiptId];
            if (status === 'error') {
              console.log(`There was an error sending a notification: ${message}`);

              if (details) {
                // The error codes are listed in the Expo documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                // You must handle the errors appropriately.
                console.log('The error is', details);
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log('error in sendNotification in NotificationController.js', error);
    }
  }
}

export default NotificationController;
