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
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Please Enter the description first!",
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:  {
      description: initialData?.description || "",
    } 
  });

  const { isSubmitting, isValid } = form.formState;
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
        Course Description
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? <>Cancel</> : 
            <>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit description
            </>
          }
        </Button>
      </div>
      <div className="">
        {!isEditing && (
            <p className={cn(
                "text-sm mt-2",
                !initialData.description && "text-slate-500 italic"
            )}>{initialData.description || "No description"}</p>
        )}
        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4 "
                >
                    <FormField 
                        control={form.control}
                        name='description'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea 
                                        disabled={isSubmitting}
                                        placeholder="eg: `This course is about....`"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
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

export default DescriptionForm;
