"use client"

import React from 'react'
import {
    AlertDialog, AlertDialogAction, AlertDialogTitle,AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription, AlertDialogTrigger, AlertDialogCancel
} from "@/components/ui/alert-dialog"

interface AlertProps {
    children: React.ReactNode;
    onConfirm: () => void;
}

const ConfirmModal = ({children, onConfirm} : AlertProps) => {
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent >
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you Sure? 
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone ? 
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm} >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal