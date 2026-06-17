import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
// Database schema. Add tables here; Convex pushes changes on `npx convex dev`.
export default defineSchema({
    users: defineTable({
        id: v.string(),
        name: v.string(),
    }),
});
