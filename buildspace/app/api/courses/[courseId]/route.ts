import { db } from "@/db/drizzle";
import { courses, enrollments, lessons, progress, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {

    try {

        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        let dbUser = await db.query.users.findFirst({
            where: eq(users.clerkId, userId)
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Get course with lesson

        const course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId),
            with: {
                lessons: {
                    orderBy: (lessons, { asc }) => [asc(lessons.order)]
                }
            }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const enrollment = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.userId, dbUser.id),
                eq(enrollments.courseId, courseId)
            )
        });

        // Get progress for each lesson if enrolled
        let lessonsWithProgress = course.lessons;

        if (enrollment) {
            const lessonIds = course.lessons.map(l => l.id);
            const userProgress = await db.query.progress.findMany({
                where: and(
                    eq(progress.userId, dbUser.id),
                    inArray(progress.lessonId, lessonIds),
                ),
            });

            lessonsWithProgress = course.lessons.map((lesson) => ({
                ...lesson,
                completed: userProgress.some(p => p.lessonId === lesson.id && p.completed)
            }));
        } else {
            lessonsWithProgress = course.lessons.map((lesson) => ({
                ...lesson,
                completed: false,
            }));
        }

        return NextResponse.json({
            ...course,
            lessons: lessonsWithProgress,
            enrolled: !!enrollment,
            completed: enrollment?.completed || false
        });

    } catch (error) {
        console.log("[COURSE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}