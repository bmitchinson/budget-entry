import type { DocumentReference } from "firebase/firestore";

export interface Purchase {
  amount: number;
  date: Date;
  description: string;
  category: string;
}

export interface PurchaseWRef extends Purchase {
  ref: DocumentReference;
}
