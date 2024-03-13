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
  purchaseDatetime: Timestamp;
  description: string;
  entryDatetime: Timestamp;
}

export type WithFirebaseDocumentRef<T> = T & { ref: FirebaseDocumentRef };
