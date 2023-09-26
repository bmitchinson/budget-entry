<script lang="ts">
  import { createForm } from "svelte-forms-lib";
  import { App } from "@capacitor/app";
  import CategorySelect from "./CategorySelect.svelte";
  import { Database } from "../../lib/Database";
  import { Timestamp } from "firebase/firestore";
  import { purchaseBeingEdited } from "../../lib/Stores";
  import type { fbReference } from "../../lib/DatabaseTypes";

  App.addListener("appStateChange", ({ isActive }) => {
    isActive && document.getElementById("amount")?.focus();
  });

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const selectedDate = `${today.getFullYear()}-${month}-${day}`;

  const { form, handleChange, handleSubmit, handleReset } = createForm({
    initialValues: {
      amount: undefined,
      category: "",
      date: selectedDate,
      description: "",
    },
    onSubmit: (purchase) => {
      const entryTime = Timestamp.fromDate(new Date());
      if ($purchaseBeingEdited) {
        // note: why is using $ not typed?
        Database.get()
          .updatePurchase($purchaseBeingEdited, {
            ...purchase,
            amount: purchase.amount || 0,
            entryTime,
          })
          .then(() => {
            purchaseBeingEdited.set(undefined);
            handleReset();
          });
      } else {
        Database.get()
          .addPurchase({
            ...purchase,
            amount: purchase.amount || 0,
            entryTime,
          })
          .then(() => {
            handleReset();
          });
      }
    },
  });

  purchaseBeingEdited.subscribe((purchaseRef: fbReference) => {
    if (purchaseRef) {
      Database.get()
        .getPurchase(purchaseRef)
        .then((purchase) => {
          form.set({
            amount: (purchase as any).amount,
            category: (purchase as any).category,
            date: (purchase as any).date,
            description: (purchase as any).description,
          });
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
