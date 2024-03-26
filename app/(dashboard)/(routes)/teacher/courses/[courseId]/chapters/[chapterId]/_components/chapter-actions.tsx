"use client"
import ConfirmModal from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({
    chapterId, courseId, disabled, isPublished
}: ChapterActionsProps) => {

    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const onClick = async () => {
        try {
             setLoading(true);
             if (isPublished) {
                 await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                 toast.success("Chapter unpublished successfully!");
             } else { 
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter published successfully!");

             }
             router.refresh();
        } catch (error) {
            console.log("error deleting chapter: ", error);
            toast.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    }


    const onDelete = async () => {
        try {
             setLoading(true);
             await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
             toast.success("Chapter Deleted!");
             router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            console.log("error deleting chapter: ", error);
            toast.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className='flex items-center gap-x-2'>
        <Button
            onClick={onClick}
            disabled={disabled || loading}
            variant={"outline"}
            size='sm'
        >
            {isPublished ? "unPublish" : "Publish"}
        </Button>
        <ConfirmModal onConfirm={onDelete} >
            <Button size='sm' disabled={loading} >
                <TrashIcon className='h-4 w-4'/>
            </Button>
        </ConfirmModal>
    </div>
  )
}

export default ChapterActions