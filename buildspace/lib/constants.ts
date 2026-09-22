import { NextResponse } from "next/server";

export const USER_NOT_FOUND_RESPONSE: NextResponse = new NextResponse("User not found", { status: 404 });