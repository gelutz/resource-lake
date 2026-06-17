import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Database schema. Add tables here; Convex pushes changes on `npx convex dev`.
export default defineSchema({
	// App-level user profiles. Identity/credentials live in Clerk, NOT here.
	// `subject` is the Clerk user id taken from the verified JWT (`sub` claim).
	users: defineTable({
		subject: v.string(),
		name: v.optional(v.string()),
		email: v.optional(v.string()),
	}).index("by_subject", ["subject"]),
});
