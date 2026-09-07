const admin = require("firebase-admin");
const serviceAccount = require("../../firebase.json");

const firebaseNotificationConnect = () => {
    try {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        console.log("Firebase notification system initialized")
        Logger.info("Firebase notification system initialized");
    } catch (error) {
        throw new Error("Firebase notification error: ", error.message);
    }
};

module.exports = firebaseNotificationConnect;