"use client"

import { useConfettiStore } from '@/hooks/use-confetti'
import React from 'react'
import ReactConfetti from "react-confetti"

const ConfettiProvider = () => {

    const confetti = useConfettiStore();

    if(!confetti.isOpen) return null;

  return (
    <ReactConfetti 
        numberOfPieces={400}
        recycle={false}
        onConfettiComplete={() => confetti.onClose}
        className='pointer-events-none z-[100]'
    />
  )
}

export default ConfettiProvider