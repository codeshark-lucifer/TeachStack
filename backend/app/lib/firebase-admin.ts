import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getDatabase, Database } from "firebase-admin/database";

let app: App;
let db: Database;

function getAdminApp() {
  if (app) return app;

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  if (!serviceAccount.privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing or empty. Please check your environment variables.");
  }

  if (!process.env.FIREBASE_DATABASE_URL) {
    throw new Error("FIREBASE_DATABASE_URL is missing. Please check your environment variables.");
  }

  app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert(serviceAccount as any),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });

  return app;
}

export const getAdminDb = () => {
  if (!db) {
    db = getDatabase(getAdminApp());
  }
  return db;
};