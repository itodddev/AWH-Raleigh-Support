/* eslint no-unused-vars: "off" */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkUserName = functions.https.onCall((data, context) => {

  const ref = admin.firestore().collection('users').doc(data.slug)
  return ref.get().then(doc => {
    return { unique: !doc.exists }
  }).catch(err => {
    console.log(err)
    throw new functions.https.HttpsError('failed to connect')
  })
})

exports.addAdminRole = functions.https.onCall((data, context) => {
  // get user and add custom claim (admin)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} is now an admin`
    }
  }).catch(err => {
    return err
  })
})

exports.removeAdminRole = functions.https.onCall((data, context) => {
  // get user and add custom claim (admin)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: false
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} is not admin`
    }
  }).catch(err => {
    return err
  })
})
