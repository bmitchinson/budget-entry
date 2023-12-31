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

export type fbReference = DocumentReference;

export interface Purchase {
  amount: number;
  category: string;
  date: string;
  description: string;
  entryTime: Timestamp;
}

export interface PurchaseWRef extends Purchase {
  ref: fbReference;
}
