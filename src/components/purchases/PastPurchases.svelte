<script lang="ts">
  import { initializeApp } from "firebase/app";
  import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    query,
    deleteDoc,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
  } from "firebase/firestore";
  import { firebaseConfig } from "../../lib/config";
  import { onDestroy } from "svelte";

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  const purchasesCol = collection(db, "purchases");

  let purchaseList = undefined; // todo: type this
  let purchaseListError = undefined; // todo: type this

  // could modify this query to be X recent, to avoid querying entire collection
  const unsubPurchasesSnapshot = onSnapshot(query(purchasesCol), (snapshot) => {
    purchaseList = snapshot.docs.map((doc) => ({
      ...doc.data(),
      ref: doc.ref,
    }));
  });

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
