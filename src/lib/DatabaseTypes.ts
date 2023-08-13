import type {
  DocumentData,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";

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

export type fbReference = DocumentReference<unknown, DocumentData>;
