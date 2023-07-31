<script lang="ts">
  import { initializeApp } from "firebase/app";
  import {
    collection,
    onSnapshot,
    addDoc,
    query,
    deleteDoc,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    DocumentReference,
    FirestoreError,
  } from "firebase/firestore";
  import { firebaseConfig } from "../../lib/config";
  import { onDestroy } from "svelte";
  import type { PurchaseWRef, Purchase } from "../../lib/DatabaseTypes";

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  const purchasesCol = collection(db, "purchases");

  let purchaseList: undefined | PurchaseWRef[] = undefined;
  let purchaseListError: undefined | FirestoreError = undefined;

  const unsubPurchasesSnapshot = onSnapshot(
    // could modify this query to be X recent, to avoid querying entire collection
    query(purchasesCol),
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

  async function deletePurchase(docRef: DocumentReference) {
    deleteDoc(docRef);
  }

  async function addPurchase() {
    addDoc(purchasesCol, {
      description: "test purchase",
      amount: 100,
      date: new Date(),
    });
  }
</script>

<div class={"center"}>
  {#if purchaseList}
    <ul>
      {#each purchaseList as purchase}
        <li>
          <p>{purchase.ref.id} - {purchase.description}</p>
        </li>
        <button on:click={() => deletePurchase(purchase.ref)}>delete</button>
      {/each}
    </ul>
    <div class="row-item center">
      <button on:click={() => addPurchase()}>add purchase</button>
    </div>
  {:else if purchaseListError}
    <p>Error loading purchases</p>
  {:else}
    <p>...loading purchases</p>
  {/if}
</div>
