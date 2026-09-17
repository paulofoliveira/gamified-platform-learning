import { db } from "@/db/drizzle";
import { enrollments, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants";
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

        // Get all courses with enrollment status

        const allCourses = await db.query.courses.findMany({
            with: {
                lessons: true,
                enrollments: {
                    where: eq(enrollments.userId, dbUser.id)
                }
            }
        });

        const formattedCourses = allCourses.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            tumbinail: c.thumbnail,
            duration: c.duration,
            points: c.points,
            totalLessons: c.lessons.length,
            enrolled: c.enrollments.length > 0,
            progress: 0 // Calculate from completed lessons if needed
        }));

        return NextResponse.json(formattedCourses);
    } catch (error) {
        console.log("[COURSES_GET]", error);
        return NextResponse.json([]);
    }
}