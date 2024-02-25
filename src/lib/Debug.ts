import { Capacitor } from "@capacitor/core";
import { purchaseBeingEdited } from "../lib/Stores";
import { get } from "svelte/store";
import { Database } from "./Database";

let debugClicks = 0;

export const debugClick = () => {
  debugClicks++;
  if (debugClicks == 3) {
    debugClicks = 0;
    showBuiltDebugMsg({
      purchaseBeingEditedId: get(purchaseBeingEdited)?.id,
      purchaseBeingEditedDescription: get(purchaseBeingEdited)?.description,
      usingFirebaseEmulator: Database.get().usingFirebaseEmulator,
    });
  }
};

const showBuiltDebugMsg = (info: any) => {
  if (Capacitor.isNativePlatform()) {
    alert(JSON.stringify(info));
  } else {
    console.log("DEBUG INFO", info);
  }
};
