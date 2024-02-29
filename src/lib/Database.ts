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

  public async getPurchase(
    docRef: FirebaseDocumentRef
  ): Promise<WithFirebaseDocumentRef<Purchase> | undefined> {
    return getDoc<Purchase>(docRef).then((doc): String => {
      if (!doc.exists()) {
        return undefined;
      }
      return {
        ...doc.data(),
        ref: doc.ref,
      };
    });
  }

  public async addPurchase(purchase: Purchase): Promise<void> {
    await addDoc(
      collection(this.db, "purchases"),
      this.purchaseToFBPurchase(purchase)
    );
  }

  public async updatePurchase(
    docRef: FirebaseDocumentRef,
    purchase: Purchase
  ): Promise<void> {
    // todo: this should not effect entry time
    // that might be happening, and that's why the past purchase list shifts?
    await updateDoc(docRef, this.purchaseToFBPurchase(purchase));
  }

  public async deletePurchase(docRef: FirebaseDocumentRef): Promise<void> {
    await deleteDoc(docRef);
  }

  private purchaseToFBPurchase(purchase: Purchase) {
    return {
      ...purchase,
      amount: parseFloat(purchase.amount),
    };
  }

  private initializePurchasesSubscription() {
    onSnapshot(
      // TODO: date needs to become purchaseTime
      // want to sort by date, not entry. Date isn't specific enough to sort.
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
