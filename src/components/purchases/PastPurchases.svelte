<script lang="ts">
  import { onSnapshot, query, FirestoreError } from "firebase/firestore";
  import { onDestroy } from "svelte";
  import type { PurchaseWRef, Purchase } from "../../lib/DatabaseTypes";
  import { Database } from "../../lib/Database";

  let purchaseList: undefined | PurchaseWRef[] = undefined;
  let purchaseListError: undefined | FirestoreError = undefined;

  const unsubPurchasesSnapshot = onSnapshot(
    // could modify this query to be X recent, to avoid querying entire collection
    query(Database.get().purchasesCollection),
    (snapshot) => {
      purchaseList = snapshot.docs.map((doc) => ({
        ...(doc.data() as Purchase),
        ref: doc.ref,
      }));
    },
    (error) => {
      purchaseListError = error;
    }
  );

  onDestroy(() => {
    unsubPurchasesSnapshot();
  });
</script>

<div class={"center"}>
  {#if purchaseList}
    <ul>
      {#each purchaseList as purchase}
        <li>
          <p>{purchase.description}: ${purchase.amount}</p>
          <button
            on:click={() =>
              Database.get()
                .deletePurchase(purchase.ref)
                .then(() => console.log("todo: clear form"))}>delete</button
          >
        </li>
      {/each}
    </ul>
  {:else if purchaseListError}
    <p>Error loading purchases</p>
  {:else}
    <p>...loading purchases</p>
  {/if}
</div>
