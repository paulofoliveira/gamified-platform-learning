import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
            return new NextResponse("User not found", { status: 404 });
        }

        // Get top 100 users by points

        const leaderboardEntries = await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                userName: true,
                avatarUrl: true,
                points: true,
                level: true,
                currentStreak: true
            },
            orderBy: [desc(users.points)]
        });

        const entriesWithRank = leaderboardEntries.map((e, i) => ({
            ...e,
            rank: i + 1
        }));

        let userRank = null;
        let userPoints = 0;
        let userLevel = 1;
        let userStreak = 0;

        if (dbUser) {
            userRank = entriesWithRank.findIndex(e => e.id === dbUser.id) + 1;
            userPoints = dbUser.points;
            userLevel = dbUser.level;
        }

        return NextResponse.json({
            entries: entriesWithRank,
            userRank: userRank || null,
            userPoints,
            userLevel,
            userStreak,
            totalUsers: leaderboardEntries.length
        });

    } catch (error) {
        console.log("[LEADERBOARD_GET]", error);
        return NextResponse.json({
            entries: [],
            userRank: null,
            userPoints: 0,
            userLevel: 1,
            userStreak: 0,
            totalUsers: 0
        });
    }
}