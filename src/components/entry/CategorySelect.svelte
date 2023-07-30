<script lang="ts">
  import AutoComplete from "simple-svelte-autocomplete";

  export let selectedCategory: String;

  export const clear = () => {
    const input = <HTMLInputElement>document.getElementById("category-select");
    input.value = "";
  };

  const categoryChoices = ["Gas", "Grocery", "Date Night"];
</script>

<!-- is there a way fail validation if value isn't in item list?  -->
<!-- right now you can select, enter no match text, and it will submit the last entry selected -->
<!-- aka: entering no match text doesn't clear any existing selections -->

<label for="category">Category</label>
<AutoComplete
  items={categoryChoices}
  bind:selectedItem={selectedCategory}
  inputId="category-select"
  noInputStyles={true}
  hideArrow
  required
/>

<style lang="scss">
  :global(.autocomplete) {
    min-width: 0em !important;
    height: 1.2em !important;
  }
</style>
