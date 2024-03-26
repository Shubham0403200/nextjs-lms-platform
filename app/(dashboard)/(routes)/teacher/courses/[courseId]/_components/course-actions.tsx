"use client"
import ConfirmModal from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti';
import axios from 'axios';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface CourseActionProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const CourseAction = ({
    courseId, disabled, isPublished
}: CourseActionProps) => {

    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const confetti = useConfettiStore();

    const onClick = async () => {
        try {
             setLoading(true);
             if (isPublished) {
                 await axios.patch(`/api/courses/${courseId}/unpublish`);
                 toast.success("Course unpublished successfully!");
             } else { 
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published successfully!");
                confetti.onOpen();
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
             await axios.delete(`/api/courses/${courseId}`);
             toast.success("Chapter Deleted!");
             router.push(`/teacher/courses`)
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

export default CourseAction