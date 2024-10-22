import { formatDate, formatTo12Hour } from '@/lib/helpers';
import React from 'react';
import Skeleton from 'react-loading-skeleton'


interface UserDetails {
    respondent_name: string;
    status: string;
    createdAt: string;
    time: string;
    country: string;
    respondent_email: string;
    answers: any[]; 
}

interface RespondentDetailsProps {
  data? : UserDetails;
  validCount?:number; 
  isLoading?: boolean;
}

const RespondentDetails: React.FC<RespondentDetailsProps> = ({
  data,
  validCount,
  isLoading = false,
}) => {
  return (
    // <div className="border rounded-lg p-4 shadow-sm bg-white mt-4">
    //   <div className="grid grid-cols-2 gap-y-4 text-sm">
    //     <div className="flex gap-5">
    //       <span className="font-semibold text-gray-600">Respondent:</span>
    //       <span>{data?.respondent_name}</span>
    //     </div>
    //     <div className="flex gap-5">
    //       <span className="font-semibold text-gray-600">Status:</span>
    //       <span>{`${validCount} / ${data?.answers?.length}`}</span>
    //     </div>
    //     <div className="flex gap-5">
    //       <span className="font-semibold text-gray-600">Date:</span>
    //       <span>{data?.createdAt && formatDate(data.createdAt)}</span>
    //     </div>
    //     <div className="flex gap-5">
    //       <span className="font-semibold text-gray-600">Time:</span>
    //       <span>{data?.createdAt && formatTo12Hour(data.createdAt)}</span>
    //     </div>
    //     <div className="flex gap-5">
    //       <span className="font-semibold text-gray-600">Country:</span>
    //       <span>{data?.country ? data?.country : "Not provided"}</span>
    //     </div>
    //     <div className="flex gap-5">
    //       <span className="font-semibold text-gray-600">Email:</span>
    //       <span>{data?.respondent_email}</span>
    //     </div>
    //   </div>
    // </div>
    <div className="border rounded-lg p-4 shadow-sm bg-white mt-4">
    <div className="grid grid-cols-2 gap-y-4 text-sm">
      <div className="flex gap-5">
        <span className="font-semibold text-gray-600">Respondent:</span>
        <span>{isLoading ? <Skeleton width={150} /> : data?.respondent_name}</span>
      </div>
      <div className="flex gap-5">
        <span className="font-semibold text-gray-600">Status:</span>
        <span>{isLoading ? <Skeleton width={50} /> : `${validCount} / ${data?.answers?.length}`}</span>
      </div>
      <div className="flex gap-5">
        <span className="font-semibold text-gray-600">Date:</span>
        <span>{isLoading ? <Skeleton width={100} /> : data?.createdAt && formatDate(data.createdAt)}</span>
      </div>
      <div className="flex gap-5">
        <span className="font-semibold text-gray-600">Time:</span>
        <span>{isLoading ? <Skeleton width={80} /> : data?.createdAt && formatTo12Hour(data.createdAt)}</span>
      </div>
      <div className="flex gap-5">
        <span className="font-semibold text-gray-600">Country:</span>
        <span>{isLoading ? <Skeleton width={100} /> : data?.country ? data?.country : "Not provided"}</span>
      </div>
      <div className="flex gap-5">
        <span className="font-semibold text-gray-600">Email:</span>
        <span>{isLoading ? <Skeleton width={180} /> : data?.respondent_email}</span>
      </div>
    </div>
  </div>
  );
};

export default RespondentDetails;
