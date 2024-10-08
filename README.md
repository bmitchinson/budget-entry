## 💸 Budget Entry

A digital checkbook app designed for fast mobile data entry.
Built with SvelteKit and Capacitor.

Immediately on app launch you're given a keypad for price entry + quick
categorization.

## Why

Don't give up your all your financial data just to see a inaccurate
auto-generated categorization table. No login required.

## This idea made me stumble into the "local first" community

- [maggie appleton loficonf talk](https://maggieappleton.com/home-cooked-software)
- revisited annually: [robin sloan](https://www.robinsloan.com/notes/home-cooked-app/)
- https://biscuits.club/about built with https://github.com/a-type/verdant

## Links:

- Boilerplate guide used to start repo: https://ionic.io/blog/cross-platform-sveltekit-capacitor-application-yes-its-possible
- Svelte Forms Lib (Like Formik) https://svelte-forms-lib-sapper-docs.vercel.app/basic
- Firebase offline syncing: https://firebase.google.com/docs/firestore/manage-data/enable-offline

## Testing

- Required: `npm i -g firebase-cli`

  - Then: `node run firebase` to start emu.

- Playwright high level e2e tests
  - Tests reuse some application code to modify database for scenarios
- Tests spin up a local firebase emulator to use
  - Setting a key of "useFBEmulator" in your localstorage will enable emulator
    usage over a remote firestore instance.
- Clicking the money emoji 3 times will display debug information in your
  console log, or fire an alert dialog if on mobile

## SSR?

- SPA, no ssr-rendering, all pre-rendered to work with Capacitor
- Details in +layout.ts

### Next Up

- Replace firebase w tinybase (because firebase can't be offline only)
  - Use tinybase to store in sqlite
  - Add sqlite backup / restore
- TestFlight
  - Research OTA updates to the webapp instead of app updates
- Linting / formatting / bun
- CI/CD
- Track spending within a paycheck (date range + target, "X left")
  - Log these spending goals
- Pie graph of categories
  - Choosing sub topic shows most expensive sub categories / or purchases
- Category initialization
- Export data as CSV
- Spending timeline checklist
