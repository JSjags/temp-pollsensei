import { useParams } from 'next/navigation'
import React from 'react'

const EditSubmittedSurvey = () => {
  const params = useParams();
  console.log(params.id)
  return (
    <div>
      Feature coming soon...
    </div>
  )
}

export default EditSubmittedSurvey
