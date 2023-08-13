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
} from "firebase/firestore";
import type { Purchase, fbReference } from "./DatabaseTypes";

export class Database {
  private static instance: Database;
  private app: FirebaseApp;
  private db: Firestore;

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = initializeFirestore(this.app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  }

  public static get(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public get purchasesCollection() {
    return collection(this.db, "purchases");
  }

  public async deletePurchase(docRef: fbReference) {
    deleteDoc(docRef);
  }

  public async addPurchase(purchase: Purchase) {
    addDoc(this.purchasesCollection, this.purchaseToFBPurchase(purchase));
  }

  public async updatePurchase(docRef: fbReference, purchase: Purchase) {
    // todo: this should effect entry time
    // note: that might already be happening, and that's why the past purchase
    // list shifts?
    updateDoc(docRef, this.purchaseToFBPurchase(purchase));
  }

  public async getPurchase(docRef: fbReference) {
    return getDoc(docRef).then((doc) => doc.data());
  }

  private purchaseToFBPurchase(purchase: Purchase) {
    return {
      amount: parseFloat(purchase.amount),
      category: purchase.category,
      date: purchase.date,
      description: purchase.description,
      entryTime: purchase.entryTime,
    };
  }
}
