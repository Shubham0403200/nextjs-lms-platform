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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[]};
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:  {
      title: "",
    } 
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.post(`/api/courses/${courseId}/chapters`, values);
        toast.success("Chapter Created Successfully!");
        toggleCreating();
        router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="h-full w-full top-0 right-0 flex items-center bg-slate-500/20 rounded-md justify-center relative ">
          <Loader2 className='h-6 w-6 text-sky-700 animate-spin' />
        </div>
      )}
      <div className="font-medium flex items-center justify-between ">
        Course Chapters
        <Button onClick={toggleCreating} variant={"ghost"}>
          {isCreating ? <>Cancel</> : 
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a Chapter
            </>
          }
        </Button>
      </div>
      <div className="">
        {isCreating && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4 "
                >
                    <FormField 
                        control={form.control}
                        name='title'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        disabled={isSubmitting}
                                        placeholder="eg: `Introduction to the course`"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                        <Button disabled={!isValid || isSubmitting} type="submit" >
                            Create
                        </Button>
                </form>
            </Form>
        )}
        {!isCreating && (
            <div className={cn(
                "text-sm mt-2",
                !initialData.chapters.length && "text-slate-500 italic"
            )}>
                {!initialData.chapters.length && "No CHapters"}
                <ChaptersList 
                    onEdit={onEdit}
                    onReorder={onReorder}
                    items={initialData.chapters || []}
                />
            </div>
        )}
        {!isCreating &&  (
            <p className="text-xs text-muted-foreground mt-4">
                Drag and Drop to re-order the chapters
            </p>
        )}
      </div>
    </div>
  );
};

export default ChaptersForm;
