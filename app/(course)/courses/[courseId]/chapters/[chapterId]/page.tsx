import { getChapter } from '@/actions/get-chapter';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import { VideoPlayer } from './_components/video-player';
import CourseEnrollButton from './_components/course-enroll';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';
import { File } from 'lucide-react';
import { CourseProgressButton } from './_components/course-progress-button';

const ChapterIdPage = async (
    {params}: {params: {courseId: string; chapterId: string}}
    ) => {

    const { userId } = auth();
    if(!userId) return redirect("/");

    const {
        chapter, course, attachments, purchase, nextChapter, userProgress, muxData
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId
    });

    if(!course || !chapter) {
        return redirect("/")
    }

    const isBlocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div >
        {userProgress?.isCompleted && (
            <Banner 
                label='You already completed this chapter'
                variant={'success'}
            />
        )}
        {isBlocked && (
            <Banner 
                label='You need to purchase this course to watch this chapter!'
                variant={'warning'}
            />
        )}
        <div className='flex flex-col max-w-4xl mx-auto pb-20 ' >
            <div className="p-4">
                <VideoPlayer 
                    chapterId={params.chapterId}
                    courseId={params.courseId}
                    nextChapterId={nextChapter?.id}
                    title={chapter.title}
                    playbackId={muxData?.playbackId!}
                    isLocked={isBlocked}
                    completeOnEnd={completeOnEnd}
                />
            </div>
            <div>
                <div className='flex items-center p-4 flex-col md:flex-row justify-between  ' >
                    <h2 className='text-xl font-semibold mb-2 ' >
                        {chapter.title}
                    </h2>
                    {purchase ? (
                        <CourseProgressButton 
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                            nextChapterId={nextChapter?.id}
                            isCompleted={!!userProgress?.isCompleted}
                        />
                    ) : (
                        <CourseEnrollButton 
                            courseId={params.courseId}
                            price={course.price!}
                        />
                    )}
                </div>
                <Separator/>
                <div>
                    <Preview 
                        value={chapter.description!}
                    />
                </div>
                {!!attachments.length && (
                    <>
                        <Separator />
                        <div className='p-4' >
                            {attachments.map((a) => (
                                <a className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline ' key={a.id} href={a.url} target='_blank'  >
                                    <File  className='h-4 w-4 ml-2' />
                                    <p className='text-clamp-1' >
                                        {a.name}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default ChapterIdPage