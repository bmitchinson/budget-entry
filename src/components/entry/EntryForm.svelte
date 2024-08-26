<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { formSchema, initialFormValues, type FormSchema } from "./formSchema";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Form from "$components/ui/form";
  import Input from "$components/ui/input/input.svelte";
  import type { FormInputEvent } from "$components/ui/input";
  import {
    purchaseAskingToConfirmDelete,
    purchaseBeingEdited,
  } from "../../lib/Stores";
  import { Database } from "../../lib/Database";
  import type { Purchase } from "../../lib/DatabaseTypes";
  import { Timestamp } from "firebase/firestore";
  import NewCategorySelect from "./CategorySelect.svelte";
  import { timestampToDatetimeString } from "../../lib/utils/DateUtils";

  export let superValidatedForm: SuperValidated<FormSchema>;

  // App.addListener("appStateChange", ({ isActive }) => {
  //   isActive && document.getElementById("amount")?.focus();
  // });

  // https://superforms.rocks/concepts/events
  const form = superForm(superValidatedForm, {
    SPA: true,
    validators: zod(formSchema),
    onUpdate({ form }) {
      if (form.valid) {
        const entryTime = Timestamp.fromDate(new Date());
        const purchase: Purchase = {
          amount: form.data.amount,
          category: form.data.category,
          purchaseDatetime: Timestamp.fromDate(new Date()),
          description: form.data.description,
          entryDatetime: entryTime,
        };
        if ($purchaseBeingEdited) {
          Database.get()
            .updatePurchase($purchaseBeingEdited.ref, purchase)
            .then(() => {
              purchaseBeingEdited.set(undefined);
              resetForm();
            });
        } else {
          Database.get().addPurchase(purchase).then(resetForm);
        }
      }
    },
  });

  const { form: formData, enhance } = form;

  const resetForm = () => ($formData = initialFormValues());

  purchaseBeingEdited.subscribe((purchase) => {
    if (purchase) {
      $formData.amount = purchase.amount;
      $formData.description = purchase.description;
      $formData.category = purchase.category;
      $formData.purchaseDatetime = timestampToDatetimeString(
        purchase.purchaseDatetime
      );
    } else {
      resetForm();
    }
  });

  purchaseAskingToConfirmDelete.subscribe((purchaseRef) => {
    if (purchaseRef == undefined) {
      resetForm();
    }
  });

  const inputEventToFloat = (e: FormInputEvent<InputEvent>) => {
    const { value } = e?.target as HTMLInputElement;
    $formData.amount = parseFloat(value) || 0;
  };
</script>

<!-- todo: new-shade-test: negative amount turns amount red -->

<!-- todo: new-shade-test: negative amount won't create new purchase -->

<!-- todo: new-shade-test: negative amount won't allow edit -->

<!-- https://github.com/huntabyte/shadcn-svelte/blob/main/apps/www/src/routes/(app)/examples/forms/account/account-form.svelte#L109 -->
<form method="POST" use:enhance>
  <Form.Field {form} name="amount">
    <Form.Control let:attrs>
      <div class="flex flex-col items-end space-y-2">
        <Form.FieldErrors />
        <div class="flex items-center justify-between space-x-2 max-width">
          <Form.Label>Amount</Form.Label>
          <div>
            <div style="max-width: 13em;">
              <Input
                on:input={inputEventToFloat}
                class=""
                bind:value={$formData.amount}
                type="number"
                step=".01"
                inputmode="decimal"
                data-testid="amount-input"
                {...attrs}
              />
            </div>
          </div>
        </div>
      </div>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <div class="flex flex-col items-end space-y-2">
        <Form.FieldErrors />
        <div class="flex items-center justify-between space-x-2">
          <Form.Label>Description</Form.Label>
          <div>
            <div style="max-width: 13em;">
              <Input
                class=""
                bind:value={$formData.description}
                type="text"
                inputmode="text"
                data-testid="description-input"
                {...attrs}
              />
            </div>
          </div>
        </div>
      </div>
    </Form.Control>
  </Form.Field>
  <Form.Field {form} name="category">
    <Form.Control>
      <div class="flex items-center justify-between space-y-2">
        <Form.Label>Category</Form.Label>
        <NewCategorySelect bind:value={$formData.category} />
      </div>
    </Form.Control>
  </Form.Field>

  <!-- https://www.shadcn-svelte.com/docs/components/date-picker#date-picker -->
  <!-- date only -->
  <Form.Field {form} name="purchaseDatetime">
    <Form.Control let:attrs>
      <div class="flex items-center justify-between space-y-2">
        <Form.Label>Date/Time</Form.Label>
        <Input
          {...attrs}
          type="datetime-local"
          bind:value={$formData.purchaseDatetime}
          data-testid="datetime-input"
        />
      </div>
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <div id="form-buttons" class="flex justify-center space-x-4">
    {#if $purchaseBeingEdited}
      <Form.Button type="submit">Save Edit</Form.Button>
      <Form.Button
        type="button"
        on:click={(event) => {
          event.stopPropagation();
          resetForm();
          purchaseBeingEdited.set(undefined);
        }}>Cancel Edit</Form.Button
      >
    {:else}
      <Form.Button type="submit">Submit</Form.Button>
      <Form.Button type="button" on:click={resetForm}>Reset</Form.Button>
    {/if}
  </div>
</form>

<style>
  #form-buttons {
    margin-top: 1em;
  }
</style>
