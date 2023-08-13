import type { fbReference } from "../DatabaseTypes";
import { writable } from "svelte/store";
export const purchaseBeingEdited: writable<undefined | fbReference> =
  writable(undefined);
