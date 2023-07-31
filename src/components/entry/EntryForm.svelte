<script lang="ts">
  import { createForm } from "svelte-forms-lib";
  import { onMount } from "svelte";
  import { App } from "@capacitor/app";
  import Autocomplete from "./CategorySelect.svelte";
  import { Database } from "../../lib/Database";

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const selectedDate = `${today.getFullYear()}-${month}-${day}`;

  let clearCategoryField: () => void;

  const { form, handleChange, handleSubmit, handleReset } = createForm({
    initialValues: {
      amount: 0,
      category: "",
      date: selectedDate,
      description: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values));
      handleReset();
      clearCategoryField();
    },
  });

  onMount(() => {
    document.getElementById("amount")?.focus();
    App.addListener("appStateChange", ({ isActive }) => {
      isActive && document.getElementById("amount")?.focus();
    });
  });
</script>

<div class="entry-form">
  <form on:submit={handleSubmit}>
    <div class="row-item space-between">
      <label for="amount">amount</label>
      <input
        id="amount"
        name="amount"
        type="number"
        step=".01"
        inputmode="decimal"
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
      <Autocomplete
        bind:selectedCategory={$form.category}
        bind:clear={clearCategoryField}
      />
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
      <button
        on:click|preventDefault={() => Database.get().addPurchase($form)}
        type="submit">Submit</button
      >
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
