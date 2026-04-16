import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (error) {
    throw new Error(`Invalid FIREBASE_SERVICE_ACCOUNT_JSON: expected valid JSON. ${error.message}`);
  }
} else {
  try {
    serviceAccount = require('../firebase-service-account.json');
  } catch (error) {
    throw new Error('Missing ../firebase-service-account.json. Provide that file or set FIREBASE_SERVICE_ACCOUNT_JSON.');
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin, db };
