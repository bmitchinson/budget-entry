<script lang="ts">
  import { get } from "svelte/store";
  import { Database } from "$lib/Database";
  import { purchaseBeingEdited } from "$lib/Stores";
  import PastPurchase from "./PastPurchase.svelte";

  const purchases = Database.get().getPurchasesStore();
</script>

<!-- todo: not sure if query or here but, order not clear anymore. should be purchaseTime order. -->
<div class={"center purchase-list"}>
  {#if $purchases.data && !$purchases.error}
    <table>
      {#each $purchases.data as purchase, index}
        <PastPurchase
          {index}
          {purchase}
          isUnderEdit={purchase.ref.id === $purchaseBeingEdited?.ref.id}
        />
      {/each}
    </table>
  {:else if $purchases.error}
    <p>Error loading purchases</p>
  {:else}
    <p>...loading purchases</p>
  {/if}
</div>

<style>
  .purchase-list {
    height: 11.5em;
    overflow: auto;
  }
</style>
