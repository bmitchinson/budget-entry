<script lang="ts">
  import Form from "../components/entry/EntryForm.svelte";
  import PastPurchases from "../components/purchases/PastPurchases.svelte";
  import { purchaseBeingEdited } from "../lib/stores/EntryStore";

  import "../global.scss";

  let debugClicks = 0;

  const debugClick = () => {
    debugClicks++;
    if (debugClicks == 3) {
      const info = {
        purchaseBeingEditedId: $purchaseBeingEdited?.id,
        purchaseBeingEditedDescription: $purchaseBeingEdited?.description,
      };
      console.log(info);
      debugClicks = 0;
    }
  };
</script>

<div class="container-h">
  <div class="container-v">
    <h1 class="emoji" on:click={debugClick}>💸</h1>
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
