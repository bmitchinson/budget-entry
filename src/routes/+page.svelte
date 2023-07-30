<script lang="ts">
  import Form from "../components/entry/EntryForm.svelte";
  import PastPurchases from "../components/purchases/PastPurchases.svelte";

  import "../global.scss";
</script>

<div class="container-h">
  <div class="container-v">
    <h1>Budget Entry</h1>
    <Form />
    <PastPurchases />
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
</style>
