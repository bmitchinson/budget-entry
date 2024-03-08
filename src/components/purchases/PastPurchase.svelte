<script lang="ts">
  import { get } from "svelte/store";
  import { Database } from "../../lib/Database";
  import type {
    Purchase,
    WithFirebaseDocumentRef,
  } from "../../lib/DatabaseTypes";
  import { purchaseBeingEdited } from "../../lib/Stores";
  import { purchaseAskingToConfirmDelete } from "../../lib/Stores";

  export let index: number;
  export let purchase: WithFirebaseDocumentRef<Purchase>;
  export let isUnderEdit: boolean;

  let deleteConfirmationActive: boolean;

  $: {
    deleteConfirmationActive =
      $purchaseAskingToConfirmDelete?.id === purchase.ref.id;
  }
</script>

<tr data-testid="purchase-list-item-{index}">
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
      }}>{isUnderEdit ? "editing" : "edit"}</button
    ></th
  >
  <th
    class="text-center button-cell"
    data-testid="delete-item-{index}"
    class:under-edit={isUnderEdit}
    ><button
      on:click={() => {
        if (deleteConfirmationActive) {
          if (isUnderEdit) purchaseBeingEdited.set(undefined);
          purchaseAskingToConfirmDelete.set(undefined);
          Database.get().deletePurchase(purchase.ref);
        } else {
          purchaseAskingToConfirmDelete.set(purchase.ref);
          console.log(
            purchase.ref.id +
              " set conf to " +
              get(purchaseAskingToConfirmDelete)?.id
          );
        }
      }}>{deleteConfirmationActive ? "confirm" : "delete"}</button
    ></th
  >
</tr>

<style lang="scss">
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
    width: 5em;
  }
</style>
