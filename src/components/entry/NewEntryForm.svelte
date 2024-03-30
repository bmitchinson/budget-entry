<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { formSchema, initialFormValues, type FormSchema } from "./formSchema";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Form from "$components/ui/form";
  import Input from "$components/ui/input/input.svelte";
  import type { FormInputEvent } from "$components/ui/input";

  export let superValidatedForm: SuperValidated<FormSchema>;

  const form = superForm(superValidatedForm, {
    SPA: true,
    validators: zod(formSchema),
    // https://superforms.rocks/concepts/events#onresult
    onUpdate({ form }) {
      if (form.valid) {
        console.log("Valid Data! ", form.data);
      }
    },
  });

  const { form: formData, enhance } = form;

  formData.subscribe((data) => {
    console.log("Data subscription:", data);
  });

  const inputEventToFloat = (e: FormInputEvent<InputEvent>) => {
    const { value } = e?.target as HTMLInputElement;
    $formData.amount = parseFloat(value) || 0;
  };

  const resetForm = () => ($formData = initialFormValues());
</script>

<!-- shade-todo: clicking edit and then white space didn't disengage edit? -->

<!-- shade-test: negative amount turns amount red -->

<!-- shade-test: negative amount won't create new purchase -->

<!-- shade-test: negative amount won't edit -->

<!-- https://github.com/huntabyte/shadcn-svelte/blob/main/apps/www/src/routes/(app)/examples/forms/account/account-form.svelte#L109 -->
<form method="POST" use:enhance>
  <Form.Field {form} name="amount">
    <Form.Control let:attrs>
      <div class="flex flex-col items-center space-y-2">
        <div class="flex items-center space-x-2">
          <Form.Label>Amount</Form.Label>
          <div>
            <div style="max-width: 13em;">
              <Input
                on:input={inputEventToFloat}
                class=""
                value={$formData.amount}
                type="number"
                step=".01"
                inputmode="decimal"
                data-testid="amount-input"
                {...attrs}
              />
            </div>
          </div>
        </div>
        <Form.FieldErrors />
      </div>
    </Form.Control>
  </Form.Field>

  <!-- https://www.shadcn-svelte.com/docs/components/date-picker#date-picker -->
  <!-- date only -->
  <!-- <Form.Field {form} name="purchaseDatetime">
    <Form.Control let:attrs>
      <Form.Label>Date/Time</Form.Label>
      <Input {...attrs} bind:value={$formData.purchaseDatetime} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="category">
    <Form.Control let:attrs>
      <Form.Label>Category</Form.Label>
      <Input {...attrs} bind:value={$formData.category} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field> -->

  <div id="form-buttons" class="flex justify-center space-x-4">
    <Form.Button type="submit">Submit</Form.Button>
    <Form.Button type="button" on:click={resetForm}>Reset</Form.Button>
  </div>
</form>

<style>
  #form-buttons {
    margin-top: 1em;
  }
</style>
