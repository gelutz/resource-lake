import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Database schema. Add tables here; Convex pushes changes on `npx convex dev`.
export default defineSchema({
  messages: defineTable({
    // The Clerk user id (subject) that created the row.
    userId: v.string(),
    body: v.string(),
  }).index("by_user", ["userId"]),
});
