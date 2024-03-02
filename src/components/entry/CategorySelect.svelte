<script lang="ts">
  import Svelecte from "svelecte";

  const categoryChoices = [
    { category: "Gas" },
    { category: "Grocery" },
    { category: "Date Night" },
  ];

  export let selectedCategory: string = "";

  export const clear = () => {
    selectedCategory = "";
  };
</script>

<label for="category">Category</label>
<Svelecte
  options={categoryChoices}
  bind:value={selectedCategory}
  placeholder=""
  inputId="category-input"
  labelField="category"
/>
