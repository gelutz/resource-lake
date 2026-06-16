// Production / default environment.
// Fill these after running `npx convex dev` and creating your Clerk app.
export const environment = {
  production: true,
  // From `.env.local` (CONVEX_URL) — e.g. https://your-app-123.convex.cloud
  convexUrl: 'https://YOUR-DEPLOYMENT.convex.cloud',
  // Clerk Publishable Key — pk_live_... or pk_test_...
  clerkPublishableKey: 'pk_test_YOUR_KEY',
};
