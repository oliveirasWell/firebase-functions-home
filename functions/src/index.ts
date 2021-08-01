import * as functions from 'firebase-functions'

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

// Keep this to do a sanity check
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

export const saveTemperatures = functions.database
  .ref('/home/1/temperature')
  .onWrite(async (change, context) => {

    // Exit when the data is deleted.
    if (!change.after.exists()) {
      return null
    }

    // Grab the current value of what was written to the Realtime Database.
    const original = change.after.val()
    const updated = change.before.val()
    const snap = await change.after.ref?.parent?.child("data").once("value")

    console.debug(original)
    console.debug(updated)
    console.debug(snap)

    return change.after.ref?.parent?.child("temperature_history").push({ temperature: original, data: snap?.val() })

  })


