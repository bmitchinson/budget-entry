<script>
  import { createForm, Field } from "svelte-forms-lib";
  import { onMount } from "svelte";
  import { App } from "@capacitor/app";

  const { form, handleChange, handleSubmit } = createForm({
    initialValues: {
      price: "",
      // category: "",
      description: "",
      // datetime: new Date(),
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });
  onMount(() => {
    document.getElementById("price")?.focus();
    App.addListener("appStateChange", ({ isActive }) => {
      isActive && document.getElementById("price")?.focus();
    });
  });
</script>

<div class="container-h">
  <div class="container-v">
    <h1>Budget Entry</h1>

    <div class="entry-form">
      <form on:submit={handleSubmit}>
        <div class="row-item">
          <label for="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            step=".01"
            inputmode="decimal"
            on:change={handleChange}
            bind:value={$form.price}
          />
        </div>

        <div class="row-item">
          <label for="description">Description</label>
          <input
            id="description"
            name="description"
            on:change={handleChange}
            bind:value={$form.description}
          />
        </div>
        <div class="row-item center">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</div>

<style lang="scss">
  .container-h {
    width: 100vw;
    padding-top: 5em;
    display: flex;
    justify-content: center;
  }
  .container-v {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .row-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    label {
      margin-right: 1em;
    }
  }
  .center {
    justify-content: center;
  }
  .entry-form {
    font-size: 1.3rem;
  }
  button {
    padding: 1em 2em;
    -webkit-appearance: none;
  }
</style>
