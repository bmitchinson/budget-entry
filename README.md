## 💸 Budget Entry

A digital checkbook app designed for fast mobile data entry.
Built with SvelteKit and Capacitor.

Immediately on app launch you're given a keypad for price entry + quick
categorization.

## Why

Don't give up your all your financial data just to see a inaccurate
auto-generated categorization table.

## Links:

- Package init: https://ionic.io/blog/cross-platform-sveltekit-capacitor-application-yes-its-possible
- Svelte Forms Lib (Like Formik) https://svelte-forms-lib-sapper-docs.vercel.app/basic
- Firebase offline syncing: https://firebase.google.com/docs/firestore/manage-data/enable-offline

## Testing

- Playwright high level e2e tests
  - Tests reuse some application code to modify database for scenarios
- Tests spin up a local firebase emulator to use
  - Setting a key of "useFBEmulator" in your localstorage will enable emulator
    usage over a remove firestore instance.
- Clicking the money emoji 3 times will display debug information in your
  console log, or fire an alert dialog if on mobile

## SSR?

- SPA, no ssr-rendering, all pre-rendered to work with Capacitor
- Details in +layout.ts

### Revisited 3/8

- Still want to track spending within a paycheck (date range + budget) + categorize + track account + export csv for date range
