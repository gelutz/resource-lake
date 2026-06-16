import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Sample authenticated query: returns the signed-in user's messages.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      // Not signed in (or token not yet attached): return nothing.
      return [];
    }
    return await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

// Sample authenticated mutation: inserts a message for the signed-in user.
export const send = mutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.insert("messages", { userId: identity.subject, body });
  },
});
