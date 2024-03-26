"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormMessage,
  FormItem,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:  {
        isFree: !!initialData.isFree,
    } 
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
        toast.success("Chapter Updated Successfully!");
        setIsEditing(false);
        router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between ">
        Chapter Access
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? <>Cancel</> : 
            <>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </>
          }
        </Button>
      </div>
      <div className="">
        {!isEditing && (
            <p className={cn(
                "text-sm mt-2",
                !initialData.isFree && "text-slate-500 italic"
            )}>
                {initialData.isFree ? (
                    "This chapter is free for preview"
                ): (
                    "This chapter is not free"
                )}
            </p>
        )}
        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4 "
                >
                    <FormField 
                        control={form.control}
                        name='isFree'
                        render={({field}) => (
                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3 ">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormDescription>
                                        Check this box if you want to make this chapter free for preview
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center gap-x-2'>
                        <Button disabled={!isValid || isSubmitting} type="submit" >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        )}
      </div>
    </div>
  );
};

export default ChapterAccessForm;
