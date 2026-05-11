import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

async function initFirebase() {
  try {
    // We try to import the config. If it fails (file doesn't exist), we handle gracefully.
    // @ts-ignore
    const firebaseConfig = await import('./firebase-applet-config.json');
    
    app = initializeApp(firebaseConfig.default || firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    storage = getStorage(app);

    // Test connection as per guidelines
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (e) {
      console.warn("Connection test failed (expected if rules not set yet)", e);
    }
  } catch (error) {
    console.error("Firebase configuration missing or invalid. Please run the set_up_firebase tool.", error);
  }
}

initFirebase();

export { db, auth, storage };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
