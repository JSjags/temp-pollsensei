import Link from 'next/link'
import React from 'react'
import { RiArrowRightLine } from 'react-icons/ri'

interface ResourceActionsProps{
  onClick: () => void;
}

const ResourceActions:React.FC<ResourceActionsProps> = ({onClick}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-center px-5 md:px-20 my-24 items-center gap-5 mb-">
    <Link href={"resource-hub/articles"}>
      <div
        className={`rounded-lg border cursor-pointer bg-[#FFFFFF] p-4 md:p-8 w-full md:w-96`}
      >
        <h4 className="font-semibold flex items-center justify-between text-[1.25rem] mb-2">
          Articles
        </h4>
        <p className="text-sm text-[#5E5E6B] ">
        Have Questions on how to use PollSensei. Browse our in-depth articles to get started.
        </p>
      </div>
    </Link>
    <Link href={"resource-hub/tutorials"}>
      <div
        className={`rounded-lg border cursor-pointer bg-[#FFFFFF] p-4 md:p-8 w-full md:w-96`}
      >
        <h4 className="font-semibold flex items-center justify-between text-[1.25rem] mb-2">
          Tutorials
        </h4>
        <p className="text-sm text-[#5E5E6B] ">
        Watch helpful Video tutorials to help you understand PollSensei better.
        </p>
 
      </div>
    </Link>
    <span onClick={onClick} >
      <div
        className={`rounded-lg border cursor-pointer bg-[#FFFFFF] p-4 md:p-8 w-full md:w-96`}
      >
        <h4 className="font-semibold flex items-center justify-between text-[1.25rem] mb-2">
          Live Chat
        </h4>
        <p className="text-sm text-[#5E5E6B] ">
        Easily find answers to your questions by chatting with our 24/7 support team
        </p>
 
      </div>
    </span>
  </div>
  )
}

export default ResourceActions
