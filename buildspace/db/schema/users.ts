// Defines the "users" table, storing user profile, authentication and gamification data

import { relations, sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { userAchievements } from "./achievements";
import { enrollments } from "./enrollments";
import { progress } from "./progress";

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
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastActive: timestamp("last_active"),

},
    (table) => {
        return {
            clerkIdIndex: uniqueIndex("nci_users_clerk_id").on(table.clerkId),
            emailIndex: uniqueIndex("nci_users_email").on(table.email),
            userNameIndex: uniqueIndex("nci_users_user_name").on(table.userName),
        }
    })

// Sets up the relations: a user can have many
// enrollments, achievements, and progress records.
export const usersRelations = relations(users, ({ many }) => ({
    enrollments: many(enrollments),
    achievements: many(userAchievements),
    progress: many(progress),
}));