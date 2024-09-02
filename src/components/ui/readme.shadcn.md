I wish these components were just in a normal library?
All components in /ui were added from shadcn-svelte

- Benefit is keeping them in your repo "makes them customizable"
- Scenario: You add button, customize it, then add a datepicker. That datepicker
  needs the newest button, you upgrade it's erased.

With that ^ in mind, try not to change any of the files in UI I guess.

Aside from the import of utils from

- `import { cn } from "$lib/utils/shadcnUtils";`
  to
- `import { cn } from "$lib/utils/shadcnUtils";`

Wish the utils file from shadcn wasn't named so generically, or was
configurable. That import rename will need to be done every time a component
is added or updated ...
