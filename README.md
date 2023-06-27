## 💸 Budget Entry

A digital checkbook app designed for fast mobile data entry.
Built with SvelteKit and capacitor.

As soon as the app is open, you're given a keypad for price entry while on
the go. Categorization and a line item title as well.

## Why

YNAB and Mint use "Plaid" to connect to bank accounts
and parse / categorize automatically, but I'd rather manage the data more simply
and on my own away from Intuit. Plus, plaid doesn't connect to my bank.

### Links:

- Package init: https://ionic.io/blog/cross-platform-sveltekit-capacitor-application-yes-its-possible
- Svelte Forms Lib (Like Formik) https://svelte-forms-lib-sapper-docs.vercel.app/basic
- Firebase offline syncing: https://firebase.google.com/docs/firestore/manage-data/enable-offline

## Current Features

- Instant iOS app startup time

## Soon

- Categorization
- Editing / deleting past entries
- Firestore syncing with offline sync support
- User login instead of building with Firebase credentials
- Spending category view
  - Data export
  - View 1 week, 2 weeks, month, all time.
- Available on a website / PWA
- Any styling / cool CSS

## Potential future goals

- Modifying any past entry
- Category configuration
- View spending across categories
