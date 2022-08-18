const {helper, utils} = require('../common')
const conn = require('../connection')
const {messaging} = require('firebase-admin')

const notify = {}

notify.send = ({
  notify_detail_id,
  notify_type,
  title,
  message,
  user_fcm_token
}) => {
  return new Promise((resolve, reject) => {
    const registrationToken = user_fcm_token

    messaging()
      .sendToDevice(
        registrationToken,
        {
          data: {
            notify_detail_id: JSON.stringify(notify_detail_id),
            notify_type,
            title,
            message
          },
          notification: {
            title,
            body: message
          }
        },
        {
          // Required for background/quit data-only messages on iOS
          contentAvailable: true,
          // Required for background/quit data-only messages on Android
          priority: 'high'
        }
      )
      .then((response) => {
        resolve(true)
        console.log('Successfully sent message:', response)
      })
      .catch((error) => {
        reject(error)
        console.log('Error sending message:', error)
      })
  })
}

module.exports = notify
