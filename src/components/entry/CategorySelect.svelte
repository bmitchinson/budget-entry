<script lang="ts">
  import Svelecte from "svelecte";

  export let selectedCategory: String;

  export const clear = () => {
    const input = <HTMLInputElement>document.getElementById("category-select");
    input.value = "";
  };

  const categoryChoices = ["Gas", "Grocery", "Date Night"];
</script>

<label for="category">Category</label>
<Svelecte
  options={categoryChoices}
  bind:value={selectedCategory}
  placeholder=""
  inputId="category-input"
/>
