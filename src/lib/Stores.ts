import type {
  FirebaseDocumentRef,
  Purchase,
  WithFirebaseDocumentRef,
} from "./DatabaseTypes";
import { writable, type Writable } from "svelte/store";

// refactor: get rid of the fbReference, use purchaseWRef instead
// (so that this store gives any type hints)
export const purchaseBeingEdited: Writable<
  undefined | WithFirebaseDocumentRef<Purchase>
> = writable(undefined);
