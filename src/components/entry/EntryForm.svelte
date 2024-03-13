<script lang="ts">
  import { createForm } from "svelte-forms-lib";
  import { App } from "@capacitor/app";
  import CategorySelect from "./CategorySelect.svelte";
  import { Database } from "../../lib/Database";
  import { Timestamp } from "firebase/firestore";
  import {
    purchaseAskingToConfirmDelete,
    purchaseBeingEdited,
  } from "../../lib/Stores";
  import type { Purchase } from "../../lib/DatabaseTypes";
  import {
    datetimeToTimestamp,
    initialDatetimeString,
    timestampToDatetimeString,
  } from "../../lib/utils/DateUtils";

  App.addListener("appStateChange", ({ isActive }) => {
    isActive && document.getElementById("amount")?.focus();
  });

  console.log("Initial Datetime String from app: ", initialDatetimeString);

  const { form, handleChange, handleSubmit, handleReset } = createForm({
    initialValues: {
      amount: "",
      category: "",
      purchaseDatetime: initialDatetimeString,
      description: "",
    },
    onSubmit: (formData) => {
      const entryTime = Timestamp.fromDate(new Date());
      const purchase: Purchase = {
        ...formData,
        purchaseDatetime: datetimeToTimestamp(formData.purchaseDatetime),
        amount: parseFloat(formData.amount) || 0,
        entryDatetime: entryTime,
      };
      if ($purchaseBeingEdited) {
        Database.get()
          .updatePurchase($purchaseBeingEdited.ref, purchase)
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

  purchaseBeingEdited.subscribe((purchase) => {
    if (purchase) {
      form.set({
        amount: purchase.amount.toString(),
        category: purchase.category,
        purchaseDatetime: timestampToDatetimeString(purchase.purchaseDatetime),
        description: purchase.description,
      });
    } else {
      handleReset();
    }
  });

  purchaseAskingToConfirmDelete.subscribe((purchaseRef) => {
    if (purchaseRef == undefined) {
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
        data-testid="amount-input"
        on:change={handleChange}
        bind:value={$form.amount}
      />
    </div>

    <div class="row-item space-between">
      <label for="description">Description</label>
      <input
        id="description"
        name="description"
        data-testid="description-input"
        on:change={handleChange}
        bind:value={$form.description}
      />
    </div>

    <div class="row-item space-between">
      <CategorySelect bind:selectedCategory={$form.category} />
    </div>

    <div class="row-item space-between">
      <label for="datetime">Date/Time</label>
      <input
        id="datetime"
        name="datetime"
        type="datetime-local"
        data-testid="datetime-input"
        on:change={handleChange}
        bind:value={$form.purchaseDatetime}
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
          }}>Cancel Edit</button
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
