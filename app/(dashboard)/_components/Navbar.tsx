'use client'
import React from 'react'
import MobileSIdebar from './MobileSIdebar'
import NavbarRoutes from '@/components/navbar-routes'

const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-gray-100 shadow-sm'>
        <MobileSIdebar />
        <NavbarRoutes/>
    </div>
  )
}

export default Navbar