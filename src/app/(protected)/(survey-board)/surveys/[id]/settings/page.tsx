"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Edit3, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { InviteMemberDialog } from "@/components/survey/InviteMemberDialog";
import { CollaboratorsList } from "@/components/survey/CollaboratorsList";
import { useQuery, useMutation } from "@tanstack/react-query";
import { collaboratorsApi } from "@/services/collaborators";
import { useParams } from "next/navigation";
import { CollaboratorSkeleton } from "@/components/survey/CollaboratorSkeleton";
import Image from "next/image";
import { teamIcon } from "@/assets/images";
import { getSingleSurvey } from "@/services/analysis";
import { Skeleton } from "@/components/ui/skeleton";
import { getSurveySettings, updateSurveySettings } from "@/services/survey";
import { RegionSelectionDialog } from "@/components/survey/RegionSelectionDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { Axios, AxiosError, AxiosInstance } from "axios";

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const SettingsPage = () => {
  const params = useParams();
  const surveyId = params.id as string;
  const [settings, setSettings] = useState({
    collectEmail: false,
    collectNames: false,
    allowEdit: false,
    emailNotifications: false,
  });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isRegionDialogOpen, setIsRegionDialogOpen] = useState(false);
  const [isThresholdEditing, setIsThresholdEditing] = useState(false);
  const [formState, setFormState] = useState({
    language: "",
    availabile_regions: [] as string[],
    collect_email_addresses: false,
    collect_name_of_respondents: false,
    allow_survey_edit: false,
    receive_email_notification: false,
    response_threshold: 1000,
  });

  const {
    data: collaborators,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["collaborators", surveyId],
    queryFn: () => collaboratorsApi.fetchAll(surveyId),
  });

  const {
    data: surveySettings,
    isLoading: isSurveySettingsLoading,
    isSuccess: isSurveySettingsSuccess,
    isError: isSurveySettingsError,
    refetch: refetchSettings,
  } = useQuery<{
    regional_availability: {
      status: boolean;
      regions: string[];
    };
    survey_id: {
      _id: string;
      topic: string;
    };
    _id: string;
    language: string;
    collect_email_addresses: boolean;
    collect_name_of_respondents: boolean;
    allow_survey_edit: boolean;
    receive_email_notification: boolean;
    response_threshold: number;
  }>({
    queryKey: ["survey-settings", surveyId],
    queryFn: () => getSurveySettings({ surveyId }),
  });

  useEffect(() => {
    if (surveySettings) {
      setSettings({
        collectEmail: surveySettings.collect_email_addresses,
        collectNames: surveySettings.collect_name_of_respondents,
        allowEdit: surveySettings.allow_survey_edit,
        emailNotifications: surveySettings.receive_email_notification,
      });
      setFormState({
        language: surveySettings.language,
        availabile_regions: surveySettings.regional_availability.regions,
        collect_email_addresses: surveySettings.collect_email_addresses,
        collect_name_of_respondents: surveySettings.collect_name_of_respondents,
        allow_survey_edit: surveySettings.allow_survey_edit,
        receive_email_notification: surveySettings.receive_email_notification,
        response_threshold: surveySettings.response_threshold || 1000,
      });
    }
  }, [surveySettings]);

  const handleSettingChange = (setting: keyof typeof settings) => {
    const settingToFormStateMap = {
      collectEmail: "collect_email_addresses",
      collectNames: "collect_name_of_respondents",
      allowEdit: "allow_survey_edit",
      emailNotifications: "receive_email_notification",
    } as const;

    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    const formStateKey = settingToFormStateMap[setting];
    setFormState((prev) => ({
      ...prev,
      [formStateKey]: !prev[formStateKey],
    }));
  };

  const updateSettingsMutation = useMutation({
    mutationFn: (data: typeof formState) =>
      updateSurveySettings(surveySettings!._id, data),
    onSuccess: (data) => {
      toast.success("Survey settings updated successfully");
      refetchSettings();
    },
    onError: (error: AxiosError<{ message: string | string[] }>) => {
      console.error("Failed to update survey settings:", error);
      const errorMessage = error.response?.data?.message;
      toast.error(
        Array.isArray(errorMessage)
          ? errorMessage[0]
          : errorMessage || "Failed to update survey settings"
      );
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(formState);
  };

  const hasChanges = () => {
    if (!surveySettings) return false;
    return (
      JSON.stringify(formState) !==
      JSON.stringify({
        language: surveySettings.language,
        availabile_regions: surveySettings.regional_availability.regions,
        collect_email_addresses: surveySettings.collect_email_addresses,
        collect_name_of_respondents: surveySettings.collect_name_of_respondents,
        allow_survey_edit: surveySettings.allow_survey_edit,
        receive_email_notification: surveySettings.receive_email_notification,
        response_threshold: surveySettings.response_threshold || 1000,
      })
    );
  };

  console.log(surveySettings);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            {isSurveySettingsLoading && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4 pt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 pt-6">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            )}
            {isSurveySettingsSuccess && (
              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div
                  variants={fadeInUpVariant}
                  custom={0}
                  className="space-y-2"
                >
                  <Label htmlFor="surveyTitle">Survey title</Label>
                  <Input
                    id="surveyTitle"
                    defaultValue={surveySettings.survey_id.topic}
                    readOnly
                  />
                </motion.div>

                <motion.div
                  variants={fadeInUpVariant}
                  custom={1}
                  className="space-y-2"
                >
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    defaultValue={surveySettings.language}
                    readOnly
                  />
                </motion.div>

                <motion.div
                  variants={fadeInUpVariant}
                  custom={2}
                  className="space-y-4 pt-4"
                >
                  <motion.div
                    variants={fadeInUpVariant}
                    custom={3}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Regional Availability</h4>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.2 }}
                          className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-600 flex items-center gap-1"
                        >
                          <span>Pro plan</span>
                          <Star className="h-3 w-3 fill-purple-600" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get localized insights. Limit survey responses to
                        participants from designated geographic areas
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2 pt-2">
                        {formState.availabile_regions.map((region) => (
                          <Badge
                            key={region}
                            variant="secondary"
                            className="gap-1 bg-purple-100 hover:bg-purple-200"
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Switch
                      checked={formState.availabile_regions.length > 0}
                      onCheckedChange={() => setIsRegionDialogOpen(true)}
                    />
                  </motion.div>

                  {[
                    {
                      title: "Collect email addresses",
                      description:
                        "We will collect email addresses of respondents when they are about to fill your survey.",
                      setting: "collectEmail",
                      formKey: "collect_email_addresses",
                      index: 5,
                    },
                    {
                      title: "Collect names of respondents",
                      description:
                        "We will collect names of respondents when they are about to fill your survey.",
                      setting: "collectNames",
                      formKey: "collect_name_of_respondents",
                      index: 6,
                    },
                    {
                      title: "Allow survey edit",
                      description:
                        "Respondents can edit their responses after they have filled the survey. Note that users have a 30 minutes window to edit responses.",
                      setting: "allowEdit",
                      formKey: "allow_survey_edit",
                      index: 7,
                    },
                    {
                      title: "Receive email notifications",
                      description:
                        "Receive email notifications when your survey is filled.",
                      setting: "emailNotifications",
                      formKey: "receive_email_notification",
                      index: 8,
                    },
                  ].map(({ title, description, setting, formKey, index }) => (
                    <motion.div
                      key={setting}
                      variants={fadeInUpVariant}
                      custom={index}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-medium">{title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                      >
                        <Switch
                          checked={Boolean(
                            formState[formKey as keyof typeof formState]
                          )}
                          onCheckedChange={() =>
                            handleSettingChange(
                              setting as keyof typeof settings
                            )
                          }
                        />
                      </motion.div>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={fadeInUpVariant}
                    custom={4}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Response Threshold</h4>
                      <p className="text-sm text-muted-foreground">
                        Maximum number of responses allowed for this survey
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isThresholdEditing ? (
                        <Input
                          type="number"
                          value={formState.response_threshold}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              response_threshold: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-24"
                        />
                      ) : (
                        <span>{formState.response_threshold}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setIsThresholdEditing(!isThresholdEditing)
                        }
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fadeInUpVariant}
                  custom={9}
                  className="flex justify-end gap-4 pt-6"
                >
                  <Button
                    variant="outline"
                    disabled={updateSettingsMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges() || updateSettingsMutation.isPending}
                    className="bg-gradient-to-r from-[#5b03b2] to-[#9d50bb] hover:scale-105 transition-all"
                  >
                    {updateSettingsMutation.isPending ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
            {isSurveySettingsError && (
              <motion.div
                variants={fadeInUpVariant}
                custom={0}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                <div className="rounded-full bg-red-50 p-6 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-red-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Unable to load survey</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  There was an error fetching the survey details. Please try
                  again later or contact support if the problem persists.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </motion.div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="collaborators">
          <Card className="p-6">
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <CollaboratorSkeleton />
                  <CollaboratorSkeleton />
                  <CollaboratorSkeleton />
                </div>
              ) : collaborators?.length ? (
                <CollaboratorsList
                  collaborators={collaborators}
                  onRemove={(userId) =>
                    collaboratorsApi.remove({
                      survey_id: surveyId,
                      user_id: userId,
                    })
                  }
                  refetch={refetch}
                />
              ) : (
                <motion.div
                  variants={fadeInUpVariant}
                  custom={0}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <div className="rounded-full bg-gray-100 p-6 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-gray-400"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">No collaborators yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Invite team members to collaborate on this survey. They'll
                    be able to view and edit based on the permissions you grant
                    them.
                  </p>
                </motion.div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={() => setInviteDialogOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Send Invite
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        refetch={refetch}
      />
      <RegionSelectionDialog
        open={isRegionDialogOpen}
        onOpenChange={setIsRegionDialogOpen}
        selectedRegions={formState.availabile_regions}
        onRegionsChange={(regions) =>
          setFormState((prev) => ({ ...prev, availabile_regions: regions }))
        }
      />
    </div>
  );
};

export default SettingsPage;
