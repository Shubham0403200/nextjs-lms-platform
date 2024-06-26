import { IconBadge } from '@/components/icon-badge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { Bold, CircleDollarSign, File, LayoutDashboardIcon, ListChecks } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import TitleForm from './_components/title-form'
import DescriptionForm from './_components/description-form'
import {ImageForm} from './_components/image-form'
import { CategoryForm } from './_components/category-form'
import PriceForm from './_components/price-form'
import AttachmentForm from './_components/attachment-form'
import ChaptersForm from './_components/chapters-form'
import Banner from '@/components/banner'
import CourseAction from './_components/course-actions'

const CourseIdPage = async ({params} : {
    params: {courseId: string}
}) => {

    const { userId} = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title, 
        course.description, 
        course.imageUrl,
        course.price, 
        course.categoryId,
        course.attachments,
        course.chapters.some(chapter => chapter.isPublished)
    ]

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`  

    const isComplete = requiredFields.every(Boolean)

  return (
    <>
        {!course.isPublished && (
            <Banner 
                label='This course is unpublished. It wont be visible to the students!'
                variant={'warning'}
            />
        )}
        <div className='p-4'>
            <div className="flex items-center justify-between">
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium text-slate-900'>
                        Course Setup
                    </h1>
                    <span className='text-sm text-slate-700 '>
                        Complete All Fields {completionText}
                    </span>
                </div>
                <CourseAction 
                    disabled={!isComplete}
                    courseId={params.courseId}
                    isPublished={course.isPublished}
                />                
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 '>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge size='sm' icon={LayoutDashboardIcon}/>
                        <h2 className='text-xl font-medium'>
                            Customize your Course
                        </h2>
                    </div>
                    <TitleForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm 
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </div>
                <div className='space-y-6'>
                    <div>
                        <div className='flex items-center gap-x-2 '>
                            <IconBadge icon={ListChecks} size='sm' />
                            <h2 className='text-xl font-medium'>
                                Course Chapters
                            </h2>
                        </div>
                        <ChaptersForm 
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={CircleDollarSign} size={"sm"} />
                            <h2 className='font-medium text-xl'>
                                Sell Your Course
                            </h2>
                        </div>
                        <PriceForm 
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={File} size={"sm"} />
                            <h2 className='font-medium text-xl'>
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm 
                            initialData={course}

                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CourseIdPage