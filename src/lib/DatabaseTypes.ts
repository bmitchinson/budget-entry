import type {
  DocumentData,
  DocumentReference,
  FirestoreError,
  Timestamp,
} from "firebase/firestore";

export interface LiveSubscription<T> {
  data?: T;
  error?: FirestoreError;
}

export type FirebaseDocumentRef = DocumentReference;

export interface Purchase {
  amount: number;
  category: string;
  // refactor: purchaseDateTime
  date: string;
  description: string;
  // refactor: entryDateTime
  entryTime: Timestamp;
}

export type WithFirebaseDocumentRef<T> = T & { ref: FirebaseDocumentRef };
