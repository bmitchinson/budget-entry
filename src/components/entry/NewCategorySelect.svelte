<script lang="ts">
  import { Check } from "lucide-svelte";
  import { ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$components/ui/command/index";
  import * as Popover from "$components/ui/popover/index";
  import { Button } from "$components/ui/button/index";
  import { cn } from "$lib/utils/shadecnUtils";
  import { tick } from "svelte";

  const categories = [
    {
      value: "Date Night",
      label: "Date Night",
    },
    {
      value: "Gas",
      label: "Gas",
    },
    {
      value: "Grocery",
      label: "Grocery",
    },
  ];

  let open = false;
  export let value = "";

  $: selectedValue =
    categories.find((f) => f.value === value)?.label ?? "Select Category";

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[200px] justify-between"
    >
      {selectedValue}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Select Category..." />
      <Command.Empty>No Category found.</Command.Empty>
      <Command.Group>
        {#each categories as category}
          <Command.Item
            value={category.value}
            onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                value !== category.value && "text-transparent"
              )}
            />
            {category.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
