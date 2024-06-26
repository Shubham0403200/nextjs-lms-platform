import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized!", {status: 401}); 
        }

        const course = await db.course.create({
            data: {
                userId,
                title
            }
        })

        return NextResponse.json(course);

    } catch (error) {
        console.log("Post Course Error: ", error);
        return new NextResponse("Internal Error!", {status: 500})
    }
}

export async function GET (req: Request , res: Response) {
    try {

    } catch (error) {
        console.log("GET course error: ", error);
    }
}