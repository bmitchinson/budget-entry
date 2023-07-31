import type { DocumentData, DocumentReference } from "firebase/firestore";

export interface Purchase {
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface PurchaseWRef extends Purchase {
  ref: DocumentReference<unknown, DocumentData>;
}
