"use client"


import Milestones from '@/components/survey/Milestones';
import { useFetchASurveyQuery } from '@/services/survey.service';
import { useParams } from 'next/navigation';


export default function SingleSurvey () {
  const params = useParams();
  const {data } = useFetchASurveyQuery(params.id)

  console.log(data?.data)

  return (
    <div>
      <Milestones stage='0' />
    </div>
  )
}

