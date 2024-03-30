import { z } from "zod";
import { initialDatetimeString } from "$lib/utils/DateUtils";

// refactor: rename this file

export const initialFormValues = () => ({
  amount: 0,
  // category: "",
  // purchaseDatetime: initialDatetimeString(),
  // description: "",
});

export const formSchema = z.object({
  amount: z.number().nonnegative(),
  // category: z.string(),
  // purchaseDatetime: z.string(),
  // description: z.string(),
});
// .required();

export type FormSchema = ReturnType<typeof initialFormValues>;
