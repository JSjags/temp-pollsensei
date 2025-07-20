'use client'
import React from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useOnboardingStore } from "../stores";
import {
  useReportCategory,
  useReportInterests,
} from "../queries/useCategories";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DefaultIcon,
  EnthusiastIcon,
  LearnerIcon,
  ResearcherIcon,
  ReviewerIcon,
  StudentIcon,
  WriterIcon,
} from "../assets";
import { stepOrder } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePostOnboard } from "../queries/usePostOnboard";
import { LoadingSpinner } from "@/components/shop/components/dialogs/BuyPollcoins/CheckoutDialog";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const categoryIcons: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Researcher: ResearcherIcon,
  Student: StudentIcon,
  Learner: LearnerIcon,
  Writer: WriterIcon,
  Reviewer: ReviewerIcon,
  Enthusiast: EnthusiastIcon,
};

export default function Onboarding() {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  const step = useOnboardingStore((state) => state.step);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const { data: categories, isLoading: categoriesLoading } =
    useReportCategory();
  const { data: interests, isLoading: interestsLoading } = useReportInterests();
  const { mutate, isPending: submitting } = usePostOnboard();
  const currentStepIndex = stepOrder.indexOf(step);
  const totalSteps = stepOrder.length;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  const setStep = useOnboardingStore((state) => state.setStep);
  const selectedCategories = useOnboardingStore(
    (state) => state.selectedCategories
  );

  const toggleCategory = useOnboardingStore((state) => state.toggleCategory);
  const selectedInterests = useOnboardingStore(
    (state) => state.selectedInterests
  );
  const toggleInterest = useOnboardingStore((state) => state.toggleInterest);

  const isBackDisabled = currentStepIndex === 0;

  const isNextDisabled =
    (step === "category" && selectedCategories.length === 0) ||
    (step === "interests" && selectedInterests.length < 5);

  const handleSubmit = () => {
    mutate(
      {
        categories: selectedCategories,
        fields_of_interest: selectedInterests,
        accepted_terms: true,
      },
      {
        onSuccess: (res) => {
          toast.success("Onboarding completed successfully!");
          console.log("✅ Onboarding submitted:", res);
          setStep("finish");
          // Wait a short moment before navigating (optional)
          setTimeout(() => {
            router.push("/reports");
          }, 1500); // optional delay for loading dialog effect
          // Redirect, show toast, etc.
        },
        onError: (error) => {
          console.error("❌ Failed to submit onboarding:", error);
          // Show toast or error message
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-7 items-center justify-center h-full w-full relative pb-16">
      {step !== "finish" && (
        <>
          <h1 className="text-2xl">Welcome, {user?.name.split(" ")[0]}!</h1>
          <div className="w-full max-w-4xl px-4">
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-tertiary h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-right mt-1 text-gray-500">
              Step {currentStepIndex + 1} of {totalSteps}
            </p>
          </div>
        </>
      )}

      <div className="relative w-full">
        <AnimatePresence mode="wait">
          {step === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center justify-center flex-col text-center gap-7 text-sec-text w-full"
            >
              <Heading
                title="How do you identify as?"
                description="        We will need you to provide the following information in order to help
        us tailor your report feed to your preferences. This is a one-time ask."
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full">
                {categoriesLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <CartegoryCardSkeleton key={index} />
                    ))
                  : categories?.map((category) => (
                      <CategoryCard
                        key={category._id}
                        Icon={categoryIcons[category.name] || DefaultIcon}
                        name={category.name}
                        isSelected={selectedCategories.includes(category._id)}
                        onClick={() => toggleCategory(category._id)}
                      />
                    ))}
              </div>
            </motion.div>
          )}

          {step === "interests" && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center text-center gap-4"
            >
              <Heading
                title="Select your fields of interest. Please select a minimum of 5"
                description="We will need you to provide the following information in other to help us tailor your report feed to your preferences. This is a one time ask."
              />

              <div className="flex items-center justify-end w-full">
                <p className="text-sm text-sec-text">
                  {selectedInterests.length} of 10 interests selected (min. 5)
                </p>
              </div>

              <div className="flex items-center justify-center flex-wrap gap-6 mt-6">
                {interestsLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <p>loading</p>
                      </div>
                    ))
                  : interests?.map((interest) => (
                      <div
                        onClick={() => toggleInterest(interest._id)}
                        key={interest._id}
                        className={cn(
                          "border p-4 rounded-full w-fit bg-[#EEEFF0] cursor-pointer transition-all duration-150 hover:opacity-90 flex items-center justify-center",
                          {
                            "bg-tertiary text-white":
                              selectedInterests.includes(interest._id),
                          }
                        )}
                      >
                        <p>{interest.name}</p>
                      </div>
                    ))}
              </div>
            </motion.div>
          )}

          {step === "finish" && (
            <motion.div
              key="finish"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center text-center gap-4"
            >
              <LastStep />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-11 justify-center w-full mt-16 max-md:fixed bottom-0 max-md:bg-white p-4">
        <Button
          onClick={prevStep}
          disabled={isBackDisabled}
          variant="outline"
          className="rounded-md w-[167px] max-md:w-full"
        >
          Back
        </Button>

        <Button
          // onClick={() => {
          //   if (step === "finish") {
          //     handleSubmit();
          //   } else {
          //     nextStep();
          //   }
          // }}
          onClick={step === "interests" ? handleSubmit : nextStep}
          disabled={isNextDisabled || submitting}
          variant="gradient"
          className="rounded-md w-[167px] max-md:w-full gap-2"
        >
          {submitting && <LoadingSpinner />}
          {step === "interests" ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}

type CategoryCardProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
};

function CategoryCard({ Icon, name, isSelected, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer flex flex-col w-full min-w-[167px] h-[150px] text-sec-text justify-center items-center gap-2 p-4 px-10 border-[2px] rounded-lg transition-colors duration-150 relative",
        {
          "border-tertiary text-tertiary": isSelected,
        }
      )}
    >
      <Icon className="w-[60px] h-[60px]" />
      <span>{name}</span>

      {isSelected && (
        <Image
          src={"/assets/report/check.svg"}
          alt="Selected"
          width={24}
          height={24}
          className="absolute top-2 right-2"
        />
      )}
    </div>
  );
}

function CartegoryCardSkeleton() {
  return (
    <div className="flex flex-col w-full h-[150px] gap-2 p-4 border-[2px] rounded-lg items-center justify-center">
      <Skeleton className="h-[60px] w-[60px] mb-2" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

function Heading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-center flex-col max-w-[670px] text-center gap-7 text-sec-text">
      <p className="text-xl font-bold">{title}</p>
      <p>{description}</p>
    </div>
  );
}

function LastStep() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="grid grid-cols-3 gap-4 w-full max-md:grid-cols-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col w-full h-[150px] gap-2 p-4 border-[2px] rounded-lg"
          >
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
        ))}
      </div>

      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[1000000]" />
          <Dialog.Content
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            className="max-w-2xl w-full z-[100000000] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <svg
                className="animate-spin"
                width="232"
                height="231"
                viewBox="0 0 232 231"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect
                  x="0.5"
                  width="231"
                  height="231"
                  fill="url(#pattern0_12988_121909)"
                />
                <defs>
                  <pattern
                    id="pattern0_12988_121909"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_12988_121909"
                      transform="scale(0.00195312)"
                    />
                  </pattern>
                  <image
                    id="image0_12988_121909"
                    width="512"
                    height="512"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>

              <div className="flex flex-col items-center justify-center gap-2.5">
                <p className="text-tertiary text-xl">Preparing your feed...</p>
                <p className="text-sec-text text-lg max-w-[340px] text-pretty text-center">
                  Please be patient while we make your preferences.
                </p>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
