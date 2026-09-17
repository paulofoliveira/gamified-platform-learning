import { db } from "@/db/drizzle";
import { courses, enrollments, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {

        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const dbUser = await db.query.users.findFirst({
            where: eq(users.clerkId, userId)
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        const { courseId } = await params;

        // Check if course exists

        const course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId)
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const existingEnrollment = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.userId, userId),
                eq(enrollments.courseId, courseId)
            )
        });

        if (existingEnrollment) {
            return NextResponse.json({
                message: "Already enrolled",
                enrolled: true
            });
        }

        const enrollment = await db.insert(enrollments).values({
            userId: userId,
            courseId: courseId,
            enrolledAt: new Date(),
            completed: false
        }).returning();

        return NextResponse.json({
            success: true,
            enrollment: enrollment[0],
            message: "Successfully enrolled in course"
        });

    } catch (error) {
        console.log("[ENROLL_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
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

        const { courseId } = await params;

        await db.delete(enrollments).where(
            and(
                eq(enrollments.userId, dbUser.id),
                eq(enrollments.courseId, courseId)
            )
        );

        return NextResponse.json({
            success: true,
            message: "Successfully deleted an enrolled course"
        });

    } catch (error) {
        console.log("[ENROLL_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}