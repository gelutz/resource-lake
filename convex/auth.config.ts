// Tells Convex to trust JWTs minted by your Clerk instance.
//
// CLERK_JWT_ISSUER_DOMAIN comes from Clerk: it is the "Issuer" URL of the
// JWT template you create (named exactly "convex"). Set it on the Convex
// deployment with:  npx convex env set CLERK_JWT_ISSUER_DOMAIN <issuer-url>
export default {
	providers: [
		{
			domain: process.env.CLERK_FRONTEND_API_URL,
			applicationID: "convex",
		},
	],
};
