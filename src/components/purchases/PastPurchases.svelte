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
    <table>
      {#each purchaseList as purchase}
        <tr>
          <th>"{purchase.description}"</th>
          <th>${purchase.amount.toFixed(2)}</th>
          <th>{purchase.category}</th>
          <th
            ><button
              on:click={() => Database.get().deletePurchase(purchase.ref)}
              >x</button
            ></th
          >
        </tr>
      {/each}
    </table>
  {:else if purchaseListError}
    <p>Error loading purchases</p>
  {:else}
    <p>...loading purchases</p>
  {/if}
</div>

<style lang="scss">
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 0.5em;
  }
</style>
