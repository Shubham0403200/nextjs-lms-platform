import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import Mux from "@mux/mux-node";
import { isTeacher } from "@/lib/teacher";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }, 
      include: {
        chapters: {
            include: {
                muxData: true,
            }
        }
      }
    });

    if (!ownCourse) {
      return new NextResponse("Not Found", { status: 404 });
    }

    for (const chapter of ownCourse.chapters) {
        if (chapter.muxData?.assetId) {
            await Video.Assets.del(chapter.muxData.assetId);    
        }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId
      }
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function PATCH(
        req: Request,
        {params} : {params: {courseId: string}}
    ) {
    try {
        const { userId} = auth();
        const { courseId } = params; 
        const values = await req.json();
        if(!userId || !isTeacher(userId)) {
            return new NextResponse("unauthorized!", {status: 401})
        }
        const course = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(course);

    } catch (error) {
        console.log("patch courseID error: ", error)
        return new NextResponse("Something went wrong!", {status: 500})
    }
}