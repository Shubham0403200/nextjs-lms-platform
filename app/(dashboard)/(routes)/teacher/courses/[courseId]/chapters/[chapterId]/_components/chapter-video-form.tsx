"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PencilIcon, PlusCircle, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import  MuxPlayer from "@mux/mux-player-react"
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: Chapter  & {muxData?: MuxData | null};
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
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
        Chapter Videos
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>} 
          {!isEditing && !initialData.videoUrl && (
            <>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Add video
            </>
          )}
          {!isEditing && initialData.videoUrl &&
            <>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Video
            </>
          }
        </Button>
      </div>
      <div className="">
        {!isEditing && (
            !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md  ">
                    <VideoIcon className="h-10 w-10 text-slate-500" />
                </div>
            )  : (
                <div className="relative aspect-video mt-2 ">
                    <MuxPlayer
                      playbackId={initialData?.muxData?.playbackId || ""}
                    />
                </div>
            )
        )}
        {isEditing && (
            <div>
                <FileUpload 
                    endpoint="chapterVideo"
                    onChange={(url) => {
                        if(url) {
                            onSubmit({videoUrl: url})
                        }
                    }}
                />
                <div className="text-sm text-muted-foreground mt-4 ">
                    Upload this Chapters&apos;s video
                </div>
            </div>
        )}
        {initialData.videoUrl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2" >
                VIdeos can take a few minute to process. Refresh the page if the video does not appear!
            </div>
        )}
      </div>
    </div>
  );
};

export default ChapterVideoForm;
