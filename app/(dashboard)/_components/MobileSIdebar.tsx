import { MenuIcon } from 'lucide-react'
import React from 'react'
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import Sidebar from './Sidebar'

const MobileSIdebar = () => {
  return (
    <Sheet>
        <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition cursor-pointer'>
            <MenuIcon className='h-6 w-6 text-muted-foreground'/>
        </SheetTrigger>
        <SheetContent side='left' className='p-0 bg-white' >
            <Sidebar />
        </SheetContent>
    </Sheet>
  )
}

export default MobileSIdebar