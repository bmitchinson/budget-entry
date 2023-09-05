import type { fbReference } from "./DatabaseTypes";
import { writable } from "svelte/store";

// refactor: get rid of the fbReference, use purchaseWRef instead
export const purchaseBeingEdited: writable<undefined | fbReference> =
  writable(undefined);
