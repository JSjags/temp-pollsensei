import React from 'react'
import IsLoadingModal from './IsLoadingModal'
import Image from 'next/image'
import { stars } from '@/assets/images'


interface IsGeneratingProps{
  isGeneratingSurveyLoading: boolean;
 
}

const IsGenerating:React.FC<IsGeneratingProps> = ({isGeneratingSurveyLoading}) => {
  return (
    <div>
      {
        isGeneratingSurveyLoading && (
          <IsLoadingModal openModal={isGeneratingSurveyLoading} modalSize={"lg"}>
          <div className="flex flex-col text-center gap-2">
            <Image src={stars} alt="stars" className={`h-8 w-auto animate-spin-slow`} />
            <h2 className="text-lg">Generating Questions for you</h2>
            <p className="text-sm">Hold on while we do the hard work for you.</p>
          </div>
        </IsLoadingModal>
        )
      }
    </div>
  )
}

export default IsGenerating
