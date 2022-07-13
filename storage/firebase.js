const admin = require('firebase-admin')
const firebaseServiceKey = require('../firebaseServiceKey.json')

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceKey),
  storageBucket: 'chocu-93e07.appspot.com'
})
// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
  bucket
}
