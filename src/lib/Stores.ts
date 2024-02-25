import type { fbReference } from "./DatabaseTypes";
import { writable } from "svelte/store";

// refactor: get rid of the fbReference, use purchaseWRef instead
// (so that this store gives any type hints)
export const purchaseBeingEdited: writable<undefined | fbReference> =
  writable(undefined);
