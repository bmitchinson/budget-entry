<script lang="ts">
  import "../global.pcss";

  import EntryForm from "$components/entry/EntryForm.svelte";

  import { debugClick } from "$lib/Debug";
  import PastPurchasesList from "$components/purchases/PastPurchasesList.svelte";
  import NewEntryForm from "$components/entry/NewEntryForm.svelte";

  export let data;
</script>

<div class="container-h">
  <div class="container-v">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <h1 class="emoji" on:click={debugClick} data-testid="money-icon">💸</h1>
    <NewEntryForm superValidatedForm={data.form} />
    <div class="space" />
    <PastPurchasesList />
  </div>
</div>

<style>
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
    user-select: none;
    scale: 3;
    margin-bottom: 1.5em;
  }
</style>
