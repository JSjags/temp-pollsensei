"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { InviteMemberDialog } from "@/components/survey/InviteMemberDialog";
import { CollaboratorsList } from "@/components/survey/CollaboratorsList";
import { useQuery } from "@tanstack/react-query";
import { collaboratorsApi } from "@/services/collaborators";
import { useParams } from "next/navigation";
import { CollaboratorSkeleton } from "@/components/survey/CollaboratorSkeleton";
import Image from "next/image";
import { teamIcon } from "@/assets/images";

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
    collectEmail: true,
    collectNames: false,
    allowEdit: true,
    emailNotifications: true,
  });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const { data: collaborators, isLoading } = useQuery({
    queryKey: ["collaborators", surveyId],
    queryFn: () => collaboratorsApi.fetchAll(surveyId),
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving settings:", settings);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
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
                  defaultValue="CareConnect: Your Voice Matters"
                />
              </motion.div>

              <motion.div
                variants={fadeInUpVariant}
                custom={1}
                className="space-y-2"
              >
                <Label htmlFor="language">Language</Label>
                <Input id="language" defaultValue="English" />
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
                        <span>PREMIUM</span>
                        <Star className="h-3 w-3 fill-purple-600" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get localized insights. Limit survey responses to
                      participants from designated geographic areas
                    </p>
                  </div>
                  <Switch disabled />
                </motion.div>

                {[
                  {
                    title: "Collect email addresses",
                    description:
                      "We will collect email addresses of respondents when they are about to fill your survey.",
                    setting: "collectEmail",
                    index: 4,
                  },
                  {
                    title: "Collect names of respondents",
                    description:
                      "We will collect names of respondents when they are about to fill your survey.",
                    setting: "collectNames",
                    index: 5,
                  },
                  {
                    title: "Allow survey edit",
                    description:
                      "Respondents can edit their responses after they have filled the survey. Note that users have a 30 minutes window to edit responses.",
                    setting: "allowEdit",
                    index: 6,
                  },
                  {
                    title: "Receive email notifications",
                    description:
                      "Receive email notifications when your survey is filled.",
                    setting: "emailNotifications",
                    index: 7,
                  },
                ].map(({ title, description, setting, index }) => (
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
                        checked={settings[setting as keyof typeof settings]}
                        onCheckedChange={() =>
                          handleSettingChange(setting as keyof typeof settings)
                        }
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeInUpVariant}
                custom={8}
                className="flex justify-end gap-4 pt-6"
              >
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </motion.div>
            </motion.div>
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
      />
    </div>
  );
};

export default SettingsPage;
