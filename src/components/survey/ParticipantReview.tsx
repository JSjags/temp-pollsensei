"use client";
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineEye } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import participantAvatar from "@/assets/images/participant.png";
import ParticipantInfoRow from "@/components/survey/ParticipantInfoRow";
import { fetchParticipantById } from "@/services/api/apiRequest";
import { useQuery } from "@tanstack/react-query";
import { APP_KEYS } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import ScreenerSurveyResponse from "@/components/survey/ScreenerSurveyResponse";
import { useQueryClient } from "@tanstack/react-query";

interface ParticipantReviewProps {
  participantID: string;
  applicationID: string;
  participantResponses: any[];
  setIsParticipantReview: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchParticipants: any;
  onReviewParticipant: (
    applicationIds: string[],
    status: string
  ) => Promise<boolean>;
  response: boolean;
  getStatus: (participantID: string) => React.ReactNode;
}

const ParticipantReview: FC<ParticipantReviewProps> = ({
  participantID,
  applicationID,
  participantResponses,
  setIsParticipantReview,
  setIsReviewDialogOpen,
  refetchParticipants,
  onReviewParticipant,
  response,
  getStatus,
}) => {
  const queryClient = useQueryClient();
  const [reviewScrenerResponse, setReviewScrenerResponse] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: participantData, isLoading: loadingParticipant } = useQuery({
    queryKey: [...[APP_KEYS.PARTICIPANT_BY_ID], participantID],
    queryFn: () => fetchParticipantById(participantID),
    enabled: !!participantID,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // console.log({ participantData });

  const handleReviewParticipant = async (status: string) => {
    try {
      setIsLoading(true);
      const success = await onReviewParticipant([applicationID], status);
      if (success) {
        await refetchParticipants();
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: [...[APP_KEYS.APPLICATION_SURVEYS]],
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStatus(participantID);
  }, [getStatus, participantID]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <Button
        variant="default"
        size="default"
        className="text-[rgb(93,93,93)] bg-transparent hover:bg-transparent flex items-center gap-2 text-sm w-fit p-0"
        type="button"
        onClick={() => setIsParticipantReview(false)}
      >
        <FaArrowLeftLong className="text-sm lg:text-lg text-[#5D5D5D]" /> Back{" "}
      </Button>
      {loadingParticipant ? (
        <div className="w-full h-[70vh] overflow-y-auto flex flex-col gap-5 items-center">
          <div className="w-full h-auto flex gap-5">
            <div className="bg-[#FAFAFC] rounded-lg w-full flex gap-3 p-5">
              <Skeleton className="h-[100px] w-full" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full h-auto flex gap-5">
              <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[60%] flex gap-3 p-5">
                <Skeleton className="h-[100px] w-full" />
              </div>
              <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[40%] flex gap-3 p-5">
                <Skeleton className="h-[100px] w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="w-full flex items-center justify-between">
            {!reviewScrenerResponse && (
              <div className="w-auto flex items-center gap-5">
                <h1 className="font-bold text-xl">Participant Review</h1>
                <div
                  className={`text-sm font-semibold border-2 rounded-3xl px-5 py-1 capitalize ${
                    getStatus(participantID) === "pending"
                      ? "text-[#F29109] border-[#F29109] bg-[#FFF8EE]"
                      : getStatus(participantID) === "approved"
                      ? "text-[#009E10] border-[#009E10] bg-[#FFF8EE]"
                      : "text-[#E50300] border-[#E50300] bg-[#FFF8EE]"
                  }`}
                >
                  {getStatus(participantID) === "pending"
                    ? "pending"
                    : getStatus(participantID) === "approved"
                    ? "approved"
                    : "rejected"}
                </div>
              </div>
            )}

            {!reviewScrenerResponse && (
              <Button
                variant="outline"
                size="default"
                className="border-[#AAAAAA] flex items-center gap-2 text-[#7D8398] text-sm w-fit"
                type="button"
                onClick={() => setReviewScrenerResponse(true)}
              >
                <AiOutlineEye className="text-sm lg:text-lg text-[#5B03B2]" />
                Review screener survey
              </Button>
            )}
          </div>
          {!reviewScrenerResponse ? (
            <div className="h-[70vh] overflow-y-auto w-full flex flex-col gap-5">
              <div className="w-full h-auto flex flex-col gap-5">
                <div className="w-full h-auto flex flex-col lg:flex-row gap-5">
                  <div className="bg-[#FAFAFC] rounded-lg w-full flex justify-between gap-3 p-5">
                    <div className="flex-1 flex flex-col gap-3 items-center justify-start">
                      <Image
                        src={participantAvatar}
                        alt="participants"
                        width={100}
                        height={100}
                      />
                      <h2 className="text-base text-[#5B03B2] font-extrabold">
                        #User{participantID.slice(0, 6)}
                      </h2>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="Age Group"
                        value={participantData?.personalInfo?.ageGroup}
                      />
                      <ParticipantInfoRow
                        label="Gender"
                        value={participantData?.personalInfo?.gender}
                      />
                      <ParticipantInfoRow
                        label="Status"
                        value={participantData?.personalInfo?.maritalStatus}
                      />
                      <ParticipantInfoRow
                        label="Education"
                        value={
                          participantData?.educationEmployment?.educationLevel
                        }
                      />
                      <ParticipantInfoRow
                        label="Children/Dependents"
                        value={participantData?.personalInfo?.children}
                      />
                      <ParticipantInfoRow
                        label="Occupation"
                        value={participantData?.educationEmployment?.jobRole}
                      />
                      <ParticipantInfoRow
                        label="Languages"
                        value={participantData?.geographicInfo?.languages}
                      />
                      <ParticipantInfoRow
                        label="Ethnicity"
                        value={participantData?.geographicInfo?.ethnicity}
                      />
                      <ParticipantInfoRow
                        label="Religion"
                        value={participantData?.geographicInfo?.religion}
                      />
                      <ParticipantInfoRow
                        label="Pets"
                        value={participantData?.personalInfo?.pets}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-auto flex flex-col lg:flex-row gap-5">
                  <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[50%] flex flex-col gap-3 p-5">
                    <h3 className="text-sm text-[#1D2254] font-bold">
                      Education & Employment
                    </h3>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="Job"
                        value={participantData?.educationEmployment?.jobRole}
                      />
                      <ParticipantInfoRow
                        label="industry"
                        value={participantData?.educationEmployment?.industry}
                      />
                      <ParticipantInfoRow
                        label="employment status"
                        value={
                          participantData?.educationEmployment?.employmentStatus
                        }
                      />
                      <ParticipantInfoRow
                        label="education"
                        value={
                          participantData?.educationEmployment?.educationLevel
                        }
                      />
                      <ParticipantInfoRow
                        label="income range"
                        value={
                          participantData?.educationEmployment?.incomeRange
                        }
                      />
                      <ParticipantInfoRow
                        label="Avg work hours weekly"
                        value={
                          participantData?.educationEmployment?.workingHours
                        }
                      />
                      <ParticipantInfoRow
                        label="Tech savvy"
                        value={participantData?.educationEmployment?.techSavvy}
                      />
                    </div>
                  </div>
                  <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[50%] flex flex-col gap-3 p-5">
                    <h3 className="text-sm text-[#1D2254] font-bold">
                      Geographic Data
                    </h3>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="country"
                        value={participantData?.geographicInfo?.nationality}
                      />
                      <ParticipantInfoRow
                        label="region"
                        value={participantData?.geographicInfo?.region}
                      />
                      <ParticipantInfoRow
                        label="ethnicity"
                        value={participantData?.geographicInfo?.ethnicity}
                      />
                      <ParticipantInfoRow
                        label="languages"
                        value={participantData?.geographicInfo?.languages}
                      />
                      <ParticipantInfoRow
                        label="settlement type"
                        value={participantData?.geographicInfo?.currentLocation}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-auto flex flex-col lg:flex-row gap-5">
                  <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[40%] flex flex-col gap-3 p-5">
                    <h3 className="text-sm text-[#1D2254] font-bold">
                      Health & Lifestyle Markers
                    </h3>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="overall health status"
                        value={participantData?.healthLifestyle?.overallHealth}
                      />
                      <ParticipantInfoRow
                        label="health insurance type"
                        value={
                          participantData?.healthLifestyle?.healthInsurance
                        }
                      />
                      <ParticipantInfoRow
                        label="Engagement in regular physical activity"
                        value={
                          participantData?.healthLifestyle?.physicalActivity
                        }
                      />
                      <ParticipantInfoRow
                        label="Dietary restrictions or preferences"
                        value={
                          participantData?.healthLifestyle?.dietaryRestrictions
                        }
                      />
                      <ParticipantInfoRow
                        label="Smoking or use of tobacco products"
                        value={participantData?.healthLifestyle?.tobaccoUse}
                      />
                      <ParticipantInfoRow
                        label="Alcohol consumption"
                        value={participantData?.healthLifestyle?.alcoholUse}
                      />
                      <ParticipantInfoRow
                        label="Average Hours of sleep per night"
                        value={participantData?.healthLifestyle?.sleepHours}
                      />
                    </div>
                  </div>
                  <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[60%] flex flex-col gap-3 p-5">
                    <h3 className="text-sm text-[#1D2254] font-bold">
                      Technology & Media Usage
                    </h3>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="Social media platforms"
                        value={
                          participantData?.technologyMedia?.socialMediaPlatforms
                        }
                      />
                      <ParticipantInfoRow
                        label="Frequency of use of Internet"
                        value={participantData?.technologyMedia?.internetUsage}
                      />
                      <ParticipantInfoRow
                        label="Gadgets"
                        value={participantData?.technologyMedia?.internetAccess}
                      />
                      <ParticipantInfoRow
                        label="Frequency of Social media usage"
                        value={
                          participantData?.technologyMedia?.socialMediaUsage
                        }
                      />
                      <ParticipantInfoRow
                        label="Most popular content engaged"
                        value={
                          participantData?.technologyMedia?.contentEngagement
                        }
                      />
                      <ParticipantInfoRow
                        label="Internet browser used"
                        value={
                          participantData?.technologyMedia?.internetBrowsers
                        }
                      />
                      <ParticipantInfoRow
                        label="Computer operating system(s)"
                        value={participantData?.technologyMedia?.computerOS}
                      />
                      <ParticipantInfoRow
                        label="Smartphone operating system(s)"
                        value={participantData?.technologyMedia?.smartphoneOS}
                      />
                      <ParticipantInfoRow
                        label="Tablet operating system(s)"
                        value={participantData?.technologyMedia?.tabletOS}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-auto flex flex-col lg:flex-row gap-5">
                  <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[50%] flex flex-col gap-3 p-5">
                    <h3 className="text-sm text-[#1D2254] font-bold">
                      Housing & Living Situation
                    </h3>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="Current living arrangement"
                        value={
                          participantData?.housingLiving?.livingArrangement
                        }
                      />
                      <ParticipantInfoRow
                        label="Owner/Rent"
                        value={participantData?.housingLiving?.homeOwnership}
                      />
                      <ParticipantInfoRow
                        label="People living in your household"
                        value={participantData?.housingLiving?.householdSize}
                      />
                    </div>
                  </div>
                  <div className="bg-[#FAFAFC] rounded-lg w-full lg:w-[50%] flex flex-col gap-3 p-5">
                    <h3 className="text-sm text-[#1D2254] font-bold">
                      Mobility & Travel
                    </h3>
                    <div className="flex-1 flex flex-col gap-1">
                      <ParticipantInfoRow
                        label="Means of commuting"
                        value={participantData?.mobilityTravel?.commute}
                      />
                      <ParticipantInfoRow
                        label="Frequency of out-of-town/Intercity travel"
                        value={participantData?.mobilityTravel?.travelFrequency}
                      />
                      <ParticipantInfoRow
                        label="Ownership of a vehilce"
                        value={
                          participantData?.mobilityTravel?.vehicleOwnership
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ScreenerSurveyResponse
              participantResponses={participantResponses as any}
            />
          )}
          <div className="w-full flex items-center justify-start gap-5 bg-white py-3 px-10 lg:px-0">
            <Button
              variant="default"
              size="sm"
              className="w-[100px] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
              type="button"
              onClick={() => handleReviewParticipant("approved")}
              disabled={isLoading || getStatus(participantID) !== "pending"}
            >
              {isLoading ? "Loading..." : "Accept"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-[100px] bg-transparent border border-[#E50300] hover:bg-transparent rounded-md text-xs md:text-sm p-4 text-[#E50300] hover:scale-x-105 transition-all"
              type="button"
              onClick={() => handleReviewParticipant("rejected")}
              disabled={isLoading || getStatus(participantID) !== "pending"}
            >
              Reject
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default ParticipantReview;
