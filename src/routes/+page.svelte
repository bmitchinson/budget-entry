<script lang="ts">
  import Form from "../components/entry/EntryForm.svelte";
  import PastPurchases from "../components/purchases/PastPurchases.svelte";
  import { purchaseBeingEdited } from "../lib/Stores";

  import "../global.scss";
  import { Capacitor } from "@capacitor/core";

  let debugClicks = 0;

  const debugClick = () => {
    debugClicks++;
    if (debugClicks == 3) {
      const info = {
        purchaseBeingEditedId: $purchaseBeingEdited?.id,
        purchaseBeingEditedDescription: $purchaseBeingEdited?.description,
      };
      if (Capacitor.isNativePlatform()) {
        alert(JSON.stringify(info));
      } else {
        console.log("DEBUG INFO", info);
      }
      debugClicks = 0;
    }
  };

  (window as any).toggleTestDB = () => {
    if (localStorage.getItem("isPlaywright") == "true") {
      localStorage.removeItem("isPlaywright");
      console.log("Test DB disabled");
    } else {
      localStorage.setItem("isPlaywright", "true");
      console.log("Test DB enabled");
    }
  };
</script>

<div class="container-h">
  <div class="container-v">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <h1 class="emoji" on:click={debugClick} data-testid="money-icon">💸</h1>
    <Form />
    <div class="space" />
    <PastPurchases />
  </div>
</div>

<style lang="scss">
  .container-h {
    width: 100vw;
    padding-top: 5em;
    display: flex;
    justify-content: center;
  }
  .container-v {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .space {
    height: 3em;
  }
  .emoji {
    cursor: default;
    scale: 2;
  }
</style>
