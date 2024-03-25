<script lang="ts">
  import { format } from "date-fns";
  import { Database } from "../../lib/Database";
  import { clickoutside } from "@svelte-put/clickoutside";
  import type {
    Purchase,
    WithFirebaseDocumentRef,
  } from "../../lib/DatabaseTypes";
  import { purchaseBeingEdited } from "../../lib/Stores";
  import { purchaseAskingToConfirmDelete } from "../../lib/Stores";

  export let index: number;
  export let purchase: WithFirebaseDocumentRef<Purchase>;
  export let isUnderEdit: boolean;

  const dateDisplayFormat = "M/d - h:mmaaaaa";

  let deleteConfirmationActive: boolean;

  $: {
    deleteConfirmationActive =
      $purchaseAskingToConfirmDelete?.id === purchase.ref.id;
  }

  const cancelDeleteConfirmation = () => {
    deleteConfirmationActive && purchaseAskingToConfirmDelete.set(undefined);
  };
</script>

<tr data-testid="purchase-list-item-{index}">
  <th class="text-center" class:under-edit={isUnderEdit}
    >{format(purchase.purchaseDatetime.toDate(), dateDisplayFormat)}</th
  >
  <th class="text-left" class:under-edit={isUnderEdit}
    >{purchase.description}</th
  >
  <th class="text-right" class:under-edit={isUnderEdit}
    >${purchase.amount.toFixed(2)}</th
  >
  <th class="text-center" class:under-edit={isUnderEdit}>{purchase.category}</th
  >
  <th class="table-spacer" />
  <th class="text-center button-cell" class:under-edit={isUnderEdit}
    ><button
      data-testid="edit-{index}"
      on:click={() => {
        purchaseBeingEdited.set(purchase);
      }}>📝</button
    ></th
  >
  <th
    class="text-center button-cell"
    data-testid="delete-item-{index}"
    class:under-edit={isUnderEdit}
    use:clickoutside
    on:clickoutside={cancelDeleteConfirmation}
    ><button
      on:click={() => {
        if (deleteConfirmationActive) {
          if (isUnderEdit) purchaseBeingEdited.set(undefined);
          purchaseAskingToConfirmDelete.set(undefined);
          Database.get().deletePurchase(purchase.ref);
        } else {
          purchaseAskingToConfirmDelete.set(purchase.ref);
        }
      }}>{deleteConfirmationActive ? "✅" : "🗑️"}</button
    ></th
  >
</tr>

<style>
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

  .under-edit {
    background-color: bisque;
  }

  th {
    border: 1px solid #dddddd;
    padding: 0.5em;
    /* width: 5em; */
  }
</style>
