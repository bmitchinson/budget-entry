<script lang="ts">
  import { Database } from "../../lib/Database";
  import { purchaseBeingEdited } from "../../lib/Stores";

  const purchases = Database.get().getPurchases();
</script>

<div class={"center purchases-list"}>
  {#if $purchases.data && !$purchases.error}
    <table>
      <!-- todo: the purchase being edited should be signified here somehow -->
      {#each $purchases.data as purchase}
        <tr>
          <th class="text-left">"{purchase.description}"</th>
          <th class="text-right">${purchase.amount.toFixed(2)}</th>
          <th class="text-center">{purchase.category}</th>
          <th class="table-spacer" />
          <th class="text-center button-cell"
            ><button
              on:click={() => {
                purchaseBeingEdited.set(purchase.ref);
              }}>Edit</button
            ></th
          >
          <th class="text-center button-cell"
            ><button
              on:click={() => {
                const confirmed = window.confirm(
                  `Delete ${purchase.amount}: ${purchase.description}?}`
                );
                if (confirmed) {
                  Database.get().deletePurchase(purchase.ref);
                  purchaseBeingEdited.set(undefined);
                }
              }}>x</button
            ></th
          >
        </tr>
      {/each}
    </table>
  {:else if $purchases.error}
    <p>Error loading purchases</p>
  {:else}
    <p>...loading purchases</p>
  {/if}
</div>

<style lang="scss">
  .purchases-list {
    height: 11.5em;
    overflow: auto;
  }

  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .button-cell {
    width: 1em;
  }
  .table-spacer {
    width: 0.5em;
    border: none;
  }

  th {
    border: 1px solid #dddddd;
    padding: 0.5em;
    width: 5em;
  }
</style>
