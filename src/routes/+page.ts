import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { initialDatetimeString } from "../lib/utils/DateUtils";
import { formSchema, initialFormValues } from "$components/entry/formSchema";

export const load = async () => {
  const form = await superValidate(initialFormValues(), zod(formSchema));

  return { form };
};
