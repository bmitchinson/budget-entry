import { firebaseConfig } from "./config";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeFirestore,
  collection,
  persistentLocalCache,
  persistentMultipleTabManager,
  addDoc,
  deleteDoc,
  Firestore,
  updateDoc,
  getDoc,
  getFirestore,
  connectFirestoreEmulator,
  onSnapshot,
  query,
  orderBy,
  limit,
  type Unsubscribe,
  DocumentSnapshot,
} from "firebase/firestore";
import type {
  LiveSubscription,
  Purchase,
  FirebaseDocumentRef,
  WithFirebaseDocumentRef,
} from "./DatabaseTypes";
import { get, writable } from "svelte/store";
import { logInfo } from "./Logging";

// refactor: after new collections are added this will be huge.
// How can I split up collections into their own respective classes?
// generic operations?

const initialEmptyStore = { data: undefined, error: undefined };

const runningInTest = typeof window == "undefined";

export class Database {
  private static instance: Database;
  private app: FirebaseApp;
  private db: Firestore;
  private useFirebaseEmulator: Boolean;

  private subscriptions = {
    purchases: writable(initialEmptyStore) as writable<
      LiveSubscription<WithFirebaseDocumentRef<Purchase>[]>
    >,
  };

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.useFirebaseEmulator = !!(
      runningInTest || localStorage.getItem("useFBEmulator")
    );

    if (this.useFirebaseEmulator) {
      logInfo("using firebase emulator");
      this.db = getFirestore();
      connectFirestoreEmulator(this.db, "localhost", 8080);
    } else {
      logInfo("using real firebase");
      this.db = initializeFirestore(this.app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    }

    this.initializePurchasesSubscription();
  }

  public static get(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  get usingFirebaseEmulator() {
    return this.useFirebaseEmulator;
  }

  public getPurchases(): writable<
    LiveSubscription<WithFirebaseDocumentRef<Purchase>>
  > {
    return this.subscriptions.purchases;
  }

  public async getPurchase(docRef: FirebaseDocumentRef) {
    return getDoc(docRef).then(this.returnDocIfExists);
  }

  private returnDocIfExists(
    doc: DocumentSnapshot
  ): WithFirebaseDocumentRef<Purchase> | undefined {
    return doc.exists() ? { ...doc.data(), ref: doc.ref } : undefined;
  }

  public async addPurchase(purchase: Purchase): Promise<void> {
    await addDoc(collection(this.db, "purchases"), purchase);
  }

  public async updatePurchase(
    docRef: FirebaseDocumentRef,
    purchase: Purchase
  ): Promise<void> {
    // https://github.com/firebase/firebase-js-sdk/issues/5853#issuecomment-1304427284
    // not sure why I need to spread
    await updateDoc(docRef, { ...purchase });
  }

  public async deletePurchase(docRef: FirebaseDocumentRef): Promise<void> {
    await deleteDoc(docRef);
  }

  private initializePurchasesSubscription() {
    onSnapshot(
      // todo-postshadcn: date needs to become purchaseTime
      // want to sort by date, not entry. Date isn't specific enough to sort.
      // todo-postshadcn: get all within timespan from UI, instead of limiting to 15
      query(collection(this.db, "purchases"), orderBy("entryTime"), limit(15)),
      (snapshot) => {
        this.subscriptions.purchases.set({
          data: snapshot.docs.map((doc) => ({
            ...doc.data(),
            ref: doc.ref,
          })),
        });
      },
      (error) => {
        this.subscriptions.purchases.set({
          error,
        });
      }
    );
  }
}
