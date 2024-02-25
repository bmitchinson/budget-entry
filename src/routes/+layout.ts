export const prerender = true; // https://kit.svelte.dev/docs/page-options#prerender
export const ssr = false; // https://kit.svelte.dev/docs/page-options#ssr
/*
"If you add export const ssr = false to your root +layout.js, your entire app 
will only be rendered on the client — which essentially means you turn your app
into an SPA."
*/
// ^ this is what we want for PWA / Capacitor 👍🏼
