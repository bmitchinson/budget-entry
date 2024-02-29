import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
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
  PurchaseWRef,
  fbReference,
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
      LiveSubscription<PurchaseWRef[]>
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

  // refactor: can I integrate get() into each method and make each method static?
  // To change: Database.get().getPurchases() -> Database.getPurchases()
  // todo -> rename to getInstance and make `private static`
  public static get(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  get usingFirebaseEmulator() {
    return this.useFirebaseEmulator;
  }

  public getPurchases(): writable<LiveSubscription<PurchaseWRef[]>> {
    return this.subscriptions.purchases;
  }

  public async getPurchase(
    docRef: fbReference
  ): Promise<PurchaseWRef | undefined> {
    return getDoc<PurchaseWRef>(docRef).then((doc) => ({
      ...doc.data(),
      ref: doc.ref,
    }));
  }

  public async addPurchase(purchase: Purchase): Promise<void> {
    await addDoc(
      collection(this.db, "purchases"),
      this.purchaseToFBPurchase(purchase)
    );
  }

  public async updatePurchase(
    docRef: fbReference,
    purchase: Purchase
  ): Promise<void> {
    // todo: this should not effect entry time
    // that might be happening, and that's why the past purchase list shifts?
    await updateDoc(docRef, this.purchaseToFBPurchase(purchase));
  }

  public async deletePurchase(docRef: fbReference): Promise<void> {
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
