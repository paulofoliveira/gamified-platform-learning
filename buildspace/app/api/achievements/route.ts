import { db } from "@/db/drizzle";
import { userAchievements, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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

        const allAchievements = await db.query.achievements.findMany();
        const userAchievementsList = await db.query.userAchievements.findMany({
            where: eq(userAchievements.userId, dbUser.id)
        });

        const earnedAchievementsIds = new Set(userAchievementsList.map(ua => ua.achievementId));
        const achievementsWithStatus = allAchievements.map(a => ({
            ...a,
            earned: earnedAchievementsIds.has(a.id),
            earnedAt: userAchievementsList.find(ua => ua.achievementId === a.id)?.earnedAt
        }));

        return NextResponse.json(achievementsWithStatus);

    } catch (error) {
        console.log("[ACHIEVEMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}