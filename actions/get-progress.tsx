import { db } from "@/lib/db";

export const getProgress = async (
    userId: string, courseId: string
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        })

        const publishedChaptersId = publishedChapters.map((chapter) => chapter.id);

        const valid = await db.userProgress.count({
            where: {
                userId: userId, 
                chapterId: {
                    in: publishedChaptersId
                },
                isCompleted: true,
            }
        })

        const progressPercentage = (valid / publishedChaptersId.length) * 100;

        return progressPercentage;

    } catch (error) {
        console.log("error: ", error);
        return 0;
    }
}