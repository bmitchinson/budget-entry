import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { initialDatetimeString } from "../lib/utils/DateUtils";
import { formSchema, initialFormValues } from "$components/entry/formSchema";

// shade-todo: say thank you to this person + link
// https://github.com/huntabyte/shadcn-svelte/discussions/663#discussioncomment-8909677
export const load = async () => {
  const form = await superValidate(initialFormValues(), zod(formSchema));

  return { form };
};
