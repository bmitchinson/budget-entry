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
} from "firebase/firestore";
import type { Purchase } from "./DatabaseTypes";

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

  public async deletePurchase(
    docRef: DocumentReference<unknown, DocumentData>
  ) {
    deleteDoc(docRef);
  }

  public async addPurchase(purchase: Purchase) {
    addDoc(this.purchasesCollection, {
      amount: parseFloat(purchase.amount),
      category: purchase.category,
      date: purchase.date,
      description: purchase.description,
      entryTime: purchase.entryTime,
    });
  }
}
