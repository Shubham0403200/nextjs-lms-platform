"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { File, ImageIcon, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1), 
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null)

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
        toast.success("Attachments Added Successfully!");
        setIsEditing(false);
        router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  const onDelete = async (id: string) => {
    try {
        setDeleting(id);
        await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
        toast.success("Attachment Removed Successfully ")
        router.refresh();

    } catch (error) {
        toast.error("Something Went Wrong!");
    } 
  } 

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between ">
        Course Attachments
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>} 
          {!isEditing && (
            <>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Add a file
            </>
          )}
        </Button>
      </div>
      <div className="">
        {!isEditing && (
            <>
                {initialData.attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic ">
                        No Attachments Yet
                    </p>
                )}
                {initialData.attachments.length > 0 && (
                    <div className='space-y-2'>
                        {initialData.attachments.map((attach) => (
                            <div key={attach.id} className="flex items-center border-sky-200 p-3 w-full bg-sky-200 text-sky-800 rounded-md ">
                                <File className='h-4 w-4 shrink mr-2' />
                                <p className="text-xs line-clamp-1 ">
                                    {attach.name}
                                </p>
                                {deleting === attach.id && (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin"  />
                                    </div>
                                )}
                                {deleting !== attach.id && (
                                    <button onClick={() => onDelete(attach.id)}  className="ml-auto hover:opacity-75 transition-all" >
                                        <X className="h-4 w-4"  />
                                    </button>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
        {isEditing && (
            <div>
                <FileUpload 
                    endpoint="courseAttachment"
                    onChange={(url) => {
                        if(url) {
                            onSubmit({url: url})
                        }
                    }}
                />
                <div className="text-sm text-muted-foreground mt-4 ">
                    Add Something your students might need to complete this course
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentForm;
