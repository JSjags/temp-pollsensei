"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectCriteria from "@/subpages/filter-respondents/SelectCriteria";
import ScreenerSurvey from "@/subpages/filter-respondents/ScreenerSurvey";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setPurchaseDialog,
  setSurveyDialog,
  setFilterBy,
  setQualifyingTemplateId,
  setScreenerId,
} from "@/redux/slices/buyRespondentDialogSlice";
// import { resetQuestion, deleteQuestion } from "@/redux/slices/questions.slice";
// import { resetSurvey, deleteSection } from "@/redux/slices/survey.slice";
import BuyRespondent from "@/components/shop/components/dialogs/BuyRespondent/BuyRespondent";
import { FilterPaidRespondent } from "@/services/api/apiRequest";
import { toast } from "react-toastify";
import { createScreenerSurvey } from "@/redux/slices/questions.slice";
import {
  proceedToPurchase,
  setQuickSurveyQualifyingTemplateId,
  setQuickSurveyScreenerId,
} from "@/redux/slices/quickSurveySlice";
import BuyQuickSurveyRespondent from "@/components/survey/BuyQuickSurveyRespondent";

const FilterRespondents = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("selectCriteria");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState(
    sessionStorage.getItem("allowFilterRespondentsAccess") === "true"
  );

  const selectedCriteria = useSelector(
    (state: RootState) => state.criteria.selectedCriteria
  );

  const questions = useSelector(
    (state: RootState) => state?.question?.questions
  );
  const survey = useSelector((state: RootState) => state.survey);
  const sectionTopic = useSelector((state: RootState) => state?.survey?.topic);
  const sectionDescription = useSelector(
    (state: RootState) => state?.survey?.description
  );

  const {
    quickSurveyId,
    surveyId,
    showQuickSurveyFlow,
    quickSurveyScreenerId,
    quickSurveyQualifyingTemplateId,
  } = useSelector((state: RootState) => state.quickSurvey);

  const handleSaveAndContinue = useCallback(async () => {
    setIsLoading(true);

    const payload = {
      qualifyingCriteria: Object.entries(selectedCriteria).map(
        ([section, fields]) => ({
          section,
          fields: Object.entries(fields).map(([fieldName, values]) => ({
            fieldName,
            required: values.required || true,
            values: values.values || [],
          })),
        })
      ),
    };

    try {
      const response = await FilterPaidRespondent(payload);
      dispatch(setFilterBy("qualifyingCriteria"));
      dispatch(setQualifyingTemplateId(response?._id));
      dispatch(setPurchaseDialog(true));
      // console.log({ response });
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error encountered while saving criteria, please try again."
      );
      console.error("Error saving criteria:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCriteria, dispatch]);

  const handleCreateScreenerSurvey = useCallback(async () => {
    setIsLoading(true);

    const payload = {
      title: survey.topic.length ? survey.topic : "Untitled Survey",
      description: sectionDescription.length ? sectionDescription : "",
      sections: [
        {
          sectionTitle: sectionTopic.length ? sectionTopic : "Untitled Section",
          sectionDescription: sectionDescription.length
            ? sectionDescription
            : "",
          questions: questions.map((question: any) => ({
            question: question.question,
            description: question.description || question.question,
            question_type: question.question_type,
            is_required: question.is_required || false,
            options: question.options || [],
          })),
        },
      ],
      theme: "default",
      headerText: {
        name: "Helvetica",
        size: 24,
      },
      questionText: {
        name: "Helvetica",
        size: 18,
      },
      bodyText: {
        name: "Helvetica",
        size: 16,
      },
      colorTheme: "blue",
      logoUrl: "",
    };

    try {
      const response = await dispatch(
        createScreenerSurvey({ payload }) as any
      ).unwrap();
      // console.log({ response });
      dispatch(setFilterBy("screenerSurvey"));
      dispatch(setScreenerId(response?._id));
      dispatch(setPurchaseDialog(true));
      // dispatch(resetQuestion());
      // dispatch(resetSurvey());
    } catch (error: any) {
      console.error("Failed to save and continue:", error);
      toast.error(
        error.message || "Error encountered while creating survey screener."
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, questions, survey, sectionDescription, sectionTopic]);

  const handleQuickSurveyQualifyingTemplate = useCallback(async () => {
    setIsLoading(true);

    const payload = {
      qualifyingCriteria: Object.entries(selectedCriteria).map(
        ([section, fields]) => ({
          section,
          fields: Object.entries(fields).map(([fieldName, values]) => ({
            fieldName,
            required: values.required || true,
            values: values.values || [],
          })),
        })
      ),
    };

    try {
      const response = await FilterPaidRespondent(payload);
      dispatch(setFilterBy("qualifyingCriteria"));
      dispatch(setQuickSurveyQualifyingTemplateId(response?._id));
      dispatch(proceedToPurchase());
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error encountered while saving criteria, please try again."
      );
      console.error("Error saving criteria:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCriteria, dispatch]);

  const handleCreateQuickSurveyScreener = useCallback(async () => {
    setIsLoading(true);

    const payload = {
      title: survey.topic.length ? survey.topic : "Untitled Survey",
      description: sectionDescription.length ? sectionDescription : "",
      sections: [
        {
          sectionTitle: sectionTopic.length ? sectionTopic : "Untitled Section",
          sectionDescription: sectionDescription.length
            ? sectionDescription
            : "",
          questions: questions.map((question: any) => ({
            question: question.question,
            description: question.description || question.question,
            question_type: question.question_type,
            is_required: question.is_required || false,
            options: question.options || [],
          })),
        },
      ],
      theme: "default",
      headerText: {
        name: "Helvetica",
        size: 24,
      },
      questionText: {
        name: "Helvetica",
        size: 18,
      },
      bodyText: {
        name: "Helvetica",
        size: 16,
      },
      colorTheme: "blue",
      logoUrl: "",
    };

    try {
      const response = await dispatch(
        createScreenerSurvey({ payload }) as any
      ).unwrap();
      dispatch(setFilterBy("screenerSurvey"));
      dispatch(setQuickSurveyScreenerId(response?._id));
      dispatch(proceedToPurchase());
    } catch (error: any) {
      console.error("Failed to save and continue:", error);
      toast.error(
        error.message || "Error encountered while creating survey screener."
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, questions, survey, sectionDescription, sectionTopic]);

  const handleCloseTab = useCallback(() => {
    if (quickSurveyId) {
      router.push("/surveys/survey-list");
    } else {
      router.push("/shop");
    }
  }, [router, quickSurveyId]);

  const handleMainButtonClick = useCallback(() => {
    if (quickSurveyId) {
      if (activeTab === "selectCriteria") {
        handleQuickSurveyQualifyingTemplate();
      } else {
        handleCreateQuickSurveyScreener();
      }
    } else {
      if (activeTab === "selectCriteria") {
        handleSaveAndContinue();
      } else {
        handleCreateScreenerSurvey();
      }
    }
  }, [
    activeTab,
    quickSurveyId,
    handleSaveAndContinue,
    handleCreateScreenerSurvey,
    handleQuickSurveyQualifyingTemplate,
    handleCreateQuickSurveyScreener,
  ]);

  useEffect(() => {
    const access =
      sessionStorage.getItem("allowFilterRespondentsAccess") === "true";
    setHasAccess(access);

    if (access || quickSurveyId) {
      setIsInitialized(true);
      return;
    }

    // Otherwise redirect based on context
    if (location.pathname.includes("/shop")) {
      router.push("/shop");
    } else {
      router.push("/surveys/survey-list");
    }
  }, [router, quickSurveyId]);

  // useEffect(() => {
  //   setIsInitialized(true);
  // }, []);

  const totalCriteria = Object.values(selectedCriteria).reduce((acc, tab) => {
    return (
      acc +
      Object.values(tab).filter(
        (section: { required: boolean; values: string[] }) =>
          section.values.length > 0
      ).length
    );
  }, 0);

  if (!isInitialized || !hasAccess) {
    return null;
  }

  return (
    <div className="w-full h-auto relative">
      <Tabs
        className="w-full h-auto"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full bg-white flex items-center justify-center gap-5 py-1">
          <TabsTrigger
            value="selectCriteria"
            className="w-1/2 lg:w-fit data-[state=active]:text-black text-[#666666] text-base data-[state=active]:border-b-2 data-[state=active]:border-[#5B03B2] text-center rounded-none"
          >
            Select Criteria
          </TabsTrigger>
          <TabsTrigger
            value="screenerSurvey"
            className="w-1/2 lg:w-fit data-[state=active]:text-black text-[#666666] text-base data-[state=active]:border-b-2 data-[state=active]:border-[#5B03B2] text-center rounded-none"
          >
            Screener Survey
          </TabsTrigger>
        </TabsList>
        <TabsContent value="selectCriteria">
          <SelectCriteria />
        </TabsContent>
        <TabsContent value="screenerSurvey">
          <ScreenerSurvey />
        </TabsContent>
      </Tabs>

      <BuyRespondent />
      {(quickSurveyScreenerId || quickSurveyQualifyingTemplateId) && (
        <BuyQuickSurveyRespondent surveyId={surveyId} />
      )}

      <div className="w-full flex items-center justify-center gap-5 bg-white py-3 px-10 lg:px-0 fixed bottom-0 z-[10000]">
        <Button
          size="default"
          variant="outline"
          className="w-full md:w-[300px] bg-transparent border-[#A9A9B1] rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all text-black"
          onClick={handleCloseTab}
        >
          Cancel
        </Button>
        <Button
          size="default"
          className="w-full md:w-[300px] bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] shadow-[-5px_5px_10px_#563BFF42] hover:bg-purple-700 rounded-md text-xs md:text-sm p-4 hover:scale-x-105 transition-all"
          type="button"
          onClick={handleMainButtonClick}
          disabled={
            activeTab === "selectCriteria"
              ? isLoading || totalCriteria <= 0
              : isLoading || questions?.length <= 0
          }
        >
          {isLoading ? "Loading..." : "Save and Continue"}
        </Button>
      </div>
    </div>
  );
};

export default FilterRespondents;
