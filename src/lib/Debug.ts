import { Capacitor } from "@capacitor/core";
import { purchaseBeingEdited } from "$lib/Stores";
import { get } from "svelte/store";
import { Database } from "./Database";
import { logDebug, logInfo } from "./Logging";

(window as any).toggleTestDB = () => {
  if (localStorage.getItem("useFBEmulator") == "true") {
    localStorage.removeItem("useFBEmulator");
    logInfo("Test DB disabled, need to reload page");
  } else {
    localStorage.setItem("useFBEmulator", "true");
    logInfo("Test DB enabled, need to reload page");
  }
};

let debugClicks = 0;

export const debugClick = () => {
  debugClicks++;
  if (debugClicks == 3) {
    debugClicks = 0;
    showBuiltDebugMsg({
      purchaseBeingEditedId: get(purchaseBeingEdited)?.ref.id,
      purchaseBeingEditedDescription: get(purchaseBeingEdited)?.description,
      usingFirebaseEmulator: Database.get().usingFirebaseEmulator,
    });
  }
};

const showBuiltDebugMsg = (info: any) => {
  if (Capacitor.isNativePlatform()) {
    alert(JSON.stringify(info));
  } else {
    logDebug("DEBUG INFO:", info);
  }
};

logInfo("toggleTestDB() will toggle db connection");
