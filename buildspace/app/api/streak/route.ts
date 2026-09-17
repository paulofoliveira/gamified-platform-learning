import { db } from "@/db/drizzle";
import { progress, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const STREAK_GET_DEFAULT_RESPONSE: NextResponse<any> = NextResponse.json({
    currentStreak: 0,
    longestStreak: 0
});

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let dbUser = await db.query.users.findFirst({
            where: eq(users.clerkId, userId)
        });

        if (!dbUser) {
            return STREAK_GET_DEFAULT_RESPONSE;
        }

        // Calculate today's progress

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all completed lessons

        const completedLessons = await db.query.progress.findMany({
            where: and(
                eq(progress.userId, dbUser.id),
                eq(progress.completed, true)
            )
        });

        const completedDates = new Set<string>();
        completedLessons.forEach(l => {
            if (l.completedAt) {
                const date = new Date(l.completedAt);
                date.setHours(0, 0, 0, 0);
                completedDates.add(date.toISOString());
            }
        });

        // Calculate current streak

        let currentStreak = 0;
        let longestStreak = 0;
        let checkDate = new Date(today);

        while (true) {
            const dateStr = checkDate.toISOString();
            if (completedDates.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
            else { break; }
        }

        // Update user's streak in db

        if (currentStreak !== dbUser.currentStreak) {
            longestStreak = Math.max(currentStreak, dbUser.longestStreak);
            await db.update(users).set({
                currentStreak: currentStreak,
                longestStreak: longestStreak
            }).where(eq(users.id, dbUser.id));
        }
        return NextResponse.json({
            currentStreak,
            longestStreak
        });

    } catch (error) {
        console.log("[STREAK_GET]", error);
        return STREAK_GET_DEFAULT_RESPONSE;
    }

}