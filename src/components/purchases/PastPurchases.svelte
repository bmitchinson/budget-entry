<script lang="ts">
  import {
    onSnapshot,
    query,
    FirestoreError,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { onDestroy } from "svelte";
  import type { PurchaseWRef, Purchase } from "../../lib/DatabaseTypes";
  import { Database } from "../../lib/Database";

  let purchaseList: undefined | PurchaseWRef[] = undefined;
  let purchaseListError: undefined | FirestoreError = undefined;

  const unsubPurchasesSnapshot = onSnapshot(
    query(Database.get().purchasesCollection, orderBy("entryTime"), limit(15)),
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
          <button on:click={() => Database.get().deletePurchase(purchase.ref)}
            >delete</button
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
