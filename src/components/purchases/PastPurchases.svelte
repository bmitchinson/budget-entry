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

<div class={"center purchases-list"}>
  {#if purchaseList}
    <table>
      {#each purchaseList as purchase}
        <tr>
          <th class="text-left">"{purchase.description}"</th>
          <th class="text-right">${purchase.amount.toFixed(2)}</th>
          <th class="text-center">{purchase.category}</th>
          <th class="table-spacer" />
          <th class="text-center button-cell"
            ><button on:click={() => {}}>Edit</button></th
          >
          <th class="text-center button-cell"
            ><button
              on:click={() => {
                window.confirm(`Delete ${purchase.description} purchase?`) &&
                  Database.get().deletePurchase(purchase.ref);
              }}>x</button
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
  .purchases-list {
    height: 11.5em;
    overflow: auto;
  }

  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .button-cell {
    width: 1em;
  }
  .table-spacer {
    width: 0.5em;
    border: none;
  }

  th {
    border: 1px solid #dddddd;
    padding: 0.5em;
    width: 5em;
  }
</style>
