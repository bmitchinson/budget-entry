import type {
  FirebaseDocumentRef,
  Purchase,
  WithFirebaseDocumentRef,
} from "./DatabaseTypes";
import { writable, type Writable } from "svelte/store";

export const purchaseBeingEdited: Writable<
  undefined | WithFirebaseDocumentRef<Purchase>
> = writable(undefined);
