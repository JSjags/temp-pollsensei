import { formatDate, formatTo12Hour } from '@/lib/helpers';
import React from 'react';

interface UserDetails {
    respondent_name: string;
    status: string;
    createdAt: string;
    time: string;
    country: string;
    respondent_email: string;
}

interface RespondentDetailsProps {
  data? : UserDetails;
}

const RespondentDetails: React.FC<RespondentDetailsProps> = ({
  data
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mt-4">
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <div className="flex gap-5">
          <span className="font-semibold text-gray-600">Respondent:</span>
          <span>{data?.respondent_name}</span>
        </div>
        <div className="flex gap-5">
          <span className="font-semibold text-gray-600">Status:</span>
          <span>{data?.status}</span>
        </div>
        <div className="flex gap-5">
          <span className="font-semibold text-gray-600">Date:</span>
          <span>{data?.createdAt && formatDate(data.createdAt)}</span>
        </div>
        <div className="flex gap-5">
          <span className="font-semibold text-gray-600">Time:</span>
          <span>{data?.createdAt && formatTo12Hour(data.createdAt)}</span>
        </div>
        <div className="flex gap-5">
          <span className="font-semibold text-gray-600">Country:</span>
          <span>{data?.country}</span>
        </div>
        <div className="flex gap-5">
          <span className="font-semibold text-gray-600">Email:</span>
          <span>{data?.respondent_email}</span>
        </div>
      </div>
    </div>
  );
};

export default RespondentDetails;
