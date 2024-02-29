<script lang="ts">
  import { createForm } from "svelte-forms-lib";
  import { App } from "@capacitor/app";
  import CategorySelect from "./CategorySelect.svelte";
  import { Database } from "../../lib/Database";
  import { Timestamp } from "firebase/firestore";
  import { purchaseBeingEdited } from "../../lib/Stores";
  import type { Purchase, FirebaseDocumentRef } from "../../lib/DatabaseTypes";

  App.addListener("appStateChange", ({ isActive }) => {
    isActive && document.getElementById("amount")?.focus();
  });

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const selectedDate = `${today.getFullYear()}-${month}-${day}`;

  const { form, handleChange, handleSubmit, handleReset } = createForm({
    initialValues: {
      amount: 0,
      category: "",
      date: selectedDate,
      description: "",
    },
    onSubmit: (formData) => {
      const entryTime = Timestamp.fromDate(new Date());
      const purchase: Purchase = {
        ...formData,
        amount: formData.amount || 0,
        entryTime,
      };
      if ($purchaseBeingEdited) {
        Database.get()
          .updatePurchase($purchaseBeingEdited, purchase)
          .then(() => {
            purchaseBeingEdited.set(undefined);
            handleReset();
          });
      } else {
        Database.get()
          .addPurchase(purchase)
          .then(() => {
            handleReset();
          });
      }
    },
  });

  purchaseBeingEdited.subscribe((purchaseRef: FirebaseDocumentRef) => {
    if (purchaseRef) {
      Database.get()
        .getPurchase(purchaseRef)
        .then((purchase) => {
          if (purchase != undefined) {
            form.set({
              amount: purchase.amount,
              category: purchase.category,
              date: purchase.date,
              description: purchase.description,
            });
          }
        });
    } else {
      handleReset();
    }
  });
</script>

<div class="entry-form">
  <form on:submit={handleSubmit}>
    <div class="row-item space-between">
      <label for="amount">Amount</label>
      <!-- svelte-ignore a11y-autofocus -->
      <input
        id="amount"
        name="amount"
        type="number"
        step=".01"
        inputmode="decimal"
        autofocus
        on:change={handleChange}
        bind:value={$form.amount}
      />
    </div>

    <div class="row-item space-between">
      <label for="description">Description</label>
      <input
        id="description"
        name="description"
        on:change={handleChange}
        bind:value={$form.description}
      />
    </div>

    <div class="row-item space-between">
      <CategorySelect bind:selectedCategory={$form.category} />
    </div>

    <div class="row-item space-between">
      <label for="date">Date</label>
      <input
        id="date"
        name="date"
        type="date"
        on:change={handleChange}
        bind:value={$form.date}
      />
    </div>

    <div class="row-item center">
      {#if !$purchaseBeingEdited}
        <button type="submit">Submit</button>
        <button on:click|preventDefault={handleReset}>Reset</button>
      {:else}
        <button type="submit">Save Edit</button>
        <button
          on:click|preventDefault={() => {
            handleReset();
            purchaseBeingEdited.set(undefined);
          }}>Cancel</button
        >
      {/if}
    </div>
  </form>
</div>

<style lang="scss">
  .entry-form {
    font-size: 1.3rem;
  }
  button {
    padding: 1em 2em;
    -webkit-appearance: none;
  }
</style>
