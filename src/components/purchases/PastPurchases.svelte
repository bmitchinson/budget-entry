<script lang="ts">
  import { initializeApp } from "firebase/app";
  import {
    getFirestore,
    collection,
    getDocs,
    Firestore,
    deleteDoc,
    DocumentReference,
    onSnapshot,
    addDoc,
  } from "firebase/firestore";
  import { firebaseConfig } from "../../lib/config";

  // https://firebase.google.com/docs/web/pwa#access_your_app_data_offline
  //   firebase.firestore().enablePersistence().then(() => {
  //   const firestore = app.firestore();
  //   // Use Cloud Firestore ...
  // });

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const purchasesCol = collection(db, "purchases");

  let purchaseList = undefined; // todo: type this
  let purchaseListError = undefined; // todo: type this
  getDocs(purchasesCol)
    .then((querySnapshot) => {
      purchaseList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        ref: doc.ref,
      }));
    })
    .catch((error) => {
      purchaseListError = error;
      console.log("Error getting purchase list", purchaseListError);
    });

  // This does an initial run and will replace the get
  // const unsubPurchasesSnapshot = onSnapshot()

  // async function deletePurchase(docRef: DocumentReference) {
  //   console.log("deleting:" + docRef.id);
  //   return deleteDoc(docRef).then(() => {
  //     console.log("deleted:" + docRef.id);
  //     // todo: how to update the purchaseList?
  //     // purchaseList. // delete from purchaseList
  //   });
  // }

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
        <!-- <button on:click={() => deletePurchase(purchase.ref)}>delete</button> -->
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
