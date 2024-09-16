import { paper_1 } from '@/assets/images'
import Image from 'next/image'
import React from 'react'

const NoResponse = () => {
  return (
    <div className='flex flex-col text-center items-center'>
      <Image src={paper_1} alt='no response'   width={60} height={24} />
      <h2 className='font-medium text-[1.5rem]'>No responses recorded yet</h2>
      <p className='text-[1.25rem] text-[#7A8699] '>Share your survey with people in order to get responses</p>
    </div>
  )
}

export default NoResponse
