import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs'
import { ArrowLeft, EyeIcon, LayoutDashboard, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterVideoForm from './_components/chapter-video-form';
import Banner from '@/components/banner';
import ChapterActions from './_components/chapter-actions';

const ChapterId = async ({params}: {
    params: {courseId: string, chapterId: string}
}) => {

    const {userId} = auth();

    if(!userId) {
        redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true
        }
    })

    if(!chapter) {
        redirect("/")
    }

    const requiredFields = [
        chapter.title, 
        chapter.description, 
        chapter.videoUrl,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`  

    const isComplete = requiredFields.every(Boolean);

  return (
    <>  
        {!chapter.isPublished  && (
            <Banner variant={"warning"} label='This chapter is not published! It wont be visible in the course'  />
        )}  
        <div className='p-4'>
            <div className="flex items-center justify-between">
                <div className='w-full'>
                    <Link href={`/teacher/courses/${params.courseId}`}  className='flex items-center transition text-sm hover:opacity-75 mb-6' >
                        <ArrowLeft  className='h-4 w-4 mr-2' />
                        Back
                    </Link>
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex flex-col gap-y-2'>
                            <h1 className='text-2xl font-medium'>
                                Chapter Setup Creation
                            </h1>
                            <span className='text-sm text-slate-700 '>
                                Complete All Fields {completionText}
                            </span>
                        </div>
                        <ChapterActions 
                            disabled={!isComplete}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                            isPublished={chapter.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 '>
                <div className='space-y-4'>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} size='sm' />
                        <h1 className="text-xl font-medium">
                            Customize your chapters
                        </h1>
                    </div>
                    <ChapterTitleForm 
                        initialData={chapter}
                        courseId={params.courseId}
                        chapterId={params.chapterId}
                    />
                    <ChapterDescriptionForm 
                        initialData={chapter}
                        courseId={params.courseId}
                        chapterId={params.chapterId}
                    />
                    <div>
                        <div className='flex items-center gap-x-2 '>
                            <IconBadge  icon={EyeIcon} size='sm' />
                            <h1 className='text-xl font-medium'>
                                Access Settings
                            </h1>
                        </div>
                        <ChapterAccessForm 
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge  icon={VideoIcon} size='sm' />
                        <h1 className='text-xl font-medium'>
                            Add Videos
                        </h1>
                    </div>
                    <ChapterVideoForm 
                        initialData={chapter}
                        courseId={params.courseId}
                        chapterId={params.chapterId}
                    />
                </div>
            </div>
        </div>
    </>
  )
}

export default ChapterId