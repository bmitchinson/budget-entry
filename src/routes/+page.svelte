<script lang="ts">
  import "../global.scss";

  import Form from "../components/entry/EntryForm.svelte";
  import PastPurchases from "../components/purchases/PastPurchases.svelte";

  import { debugClick } from "../lib/Debug";
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
