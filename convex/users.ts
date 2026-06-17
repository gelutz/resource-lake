import { mutation, query } from "./_generated/server";

/**
 * The profile row for the currently authenticated user, or null when signed
 * out / not yet stored. Drives "am I logged in?" in the UI.
 */
export const current = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return null;
		return await ctx.db
			.query("users")
			.withIndex("by_subject", (q) => q.eq("subject", identity.subject))
			.unique();
	},
});

/**
 * Idempotently create-or-update the profile for the signed-in Clerk user.
 * Call this once the Convex client is authenticated (see app.config.ts).
 * Safe to call on every sign-in: it inserts the first time, refreshes after.
 */
export const store = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("store called without authentication");

		const existing = await ctx.db
			.query("users")
			.withIndex("by_subject", (q) => q.eq("subject", identity.subject))
			.unique();

		if (existing) {
			// Keep name/email in sync if they changed in Clerk.
			if (
				existing.name !== identity.name ||
				existing.email !== identity.email
			) {
				await ctx.db.patch(existing._id, {
					name: identity.name,
					email: identity.email,
				});
			}
			return existing._id;
		}

		return await ctx.db.insert("users", {
			subject: identity.subject,
			name: identity.name,
			email: identity.email,
		});
	},
});
