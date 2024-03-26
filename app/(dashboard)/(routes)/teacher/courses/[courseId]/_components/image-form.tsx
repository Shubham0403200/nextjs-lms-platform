"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ImageIcon, PencilIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imagrUrl: z.string().min(1, {
    message: "Please Enter the correct thumbnail first!",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.patch(`/api/courses/${courseId}`, values);
        toast.success("Course Updated Successfully!");
        setIsEditing(false);
        router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between ">
        Course Thumbnail
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>} 
          {!isEditing && !initialData.imageUrl && (
            <>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl &&
            <>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit thumbnail
            </>
          }
        </Button>
      </div>
      <div className="">
        {!isEditing && (
            !initialData.imageUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md  ">
                    <ImageIcon  className="h-10 w-10 text-slate-500" />
                </div>
            )  : (
                <div className="relative aspect-video mt-2 ">
                    <Image 
                        alt="upload"
                        fill
                        className="object-cover rounded-md"
                        src={initialData.imageUrl}
                    />
                </div>
            )
        )}
        {isEditing && (
            <div>
                <FileUpload 
                    endpoint="courseImage"
                    onChange={(url) => {
                        if(url) {
                            onSubmit({imageUrl: url})
                        }
                    }}
                />
                <div className="text-sm text-muted-foreground mt-4 ">
                    16:9 aspect ratio recommended
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageForm;
