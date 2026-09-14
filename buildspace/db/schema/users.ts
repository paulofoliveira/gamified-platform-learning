// Defines the "users" table, storing user profile, authentication and gamification data

import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    userName: text("user_name").unique(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Gamification

    points: integer("points").default(0).notNull(),
    level: integer("level").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),

})