"use client";

import React, { Fragment, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { Checkbox } from "../ui/shadcn-checkbox";
import { Button } from "../ui/button";
import { X, Library } from "lucide-react";
import { cn, extractMongoId, getUniqueVariables } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTests,
  getSingleSurvey,
  getSurveyTestsLibrary,
  getSurveyVariableNames,
  runTest,
} from "@/services/analysis";
import { usePathname, useRouter } from "next/navigation";
import AnalysisLoadingScreen, {
  LoadingOverlay,
  Spinner,
} from "../loaders/page-loaders/AnalysisPageLoader";
import AnalysisErrorComponent from "../loaders/page-loaders/AnalysisError";
import Loading from "../primitives/Loader";
import { toast } from "react-toastify";
import AnalysisReport from "./AnalysisReport";
import { AnimatePresence, motion } from "framer-motion";
import SenseiMaster from "../sensei-master/SenseiMaster";
import DataVisualizationComponent from "../charts/DataVisualization";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { RxDragHandleDots2 } from "react-icons/rx";

// Springy Animation Variants for the mascot
const mascotVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export interface Variable {
  id: string;
  name: string;
}

export interface Test {
  id: string;
  name: string;
  variables: Variable[];
  category: String;
}

export interface TVariableType {
  question: string;
  slug: string;
  display_name: string;
  type: string;
}

export interface TestLibraryFormatted {
  survey_id: string;
  variable_id: string;
  data: {
    test_name: string;
    test_variables: string[];
  }[];
}

const VARIABLE_TYPE = "VARIABLE";
const initialVariables: Variable[] = [
  { id: "1", name: "Population" },
  { id: "2", name: "Land Mass" },
  { id: "3", name: "Age distribution" },
  { id: "4", name: "Work Experience" },
  { id: "5", name: "Accommodation type" },
  { id: "6", name: "Gender" },
  { id: "7", name: "Profession" },
  { id: "8", name: "Marital Status" },
  { id: "9", name: "Educational Status" },
  { id: "10", name: "Region" },
  { id: "11", name: "Ethnicity" },
  { id: "12", name: "Industry" },
  { id: "13", name: "Income" },
  { id: "14", name: "Health Status" },
  { id: "15", name: "Employment Status" },
];

const hasVariablesInTestsLibrary = (testsLibrary: Test[]) => {
  return (
    testsLibrary.length > 0 &&
    testsLibrary.some((test) => test.variables.length > 0)
  );
};

const formatTestsLibrary = (
  testsLibrary: Test[],
  surveyId: string,
  variableId: string
): TestLibraryFormatted => {
  return {
    survey_id: surveyId,
    variable_id: variableId,
    data: testsLibrary.map((test) => ({
      test_name: test.name,
      test_variables: test.variables.map((variable) => variable.id),
    })),
  };
};

// Utility function to convert a test name to camelCase (for the 'id' field)
const toCamelCase = (str: string): string => {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^./, (chr) => chr.toLowerCase());
};

export default function DragAndDropPage() {
  const router = useRouter();
  const path = usePathname();
  const [variables, setVariables] = useState(initialVariables);
  const [testsLibrary, setTestsLibrary] = useState<Test[]>([]);
  const [testLibrary, setTestLibrary] = useState<Test[]>([]);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  // Extract surveyId regardless of path
  const surveyId = extractMongoId(path);

  const getSurvey = useQuery({
    queryKey: ["get-survey"],
    queryFn: () => getSingleSurvey({ surveyId: surveyId! }),
  });

  const variablesQuery = useQuery({
    queryKey: ["survey-variables"],
    queryFn: () => getSurveyVariableNames({ surveyId: surveyId! }),
    enabled: surveyId !== undefined,
  });

  const testsLibraryQuery = useQuery({
    queryKey: ["tests-library"],
    queryFn: () => getSurveyTestsLibrary(),
    enabled: variablesQuery.isSuccess,
  });

  const createTestsQuery = useQuery({
    queryKey: ["create-test"],
    queryFn: () => createTests({ surveyId: variablesQuery.data.variable_id! }),
    enabled: testsLibraryQuery.isSuccess,
  });

  const runTestMutation = useMutation({
    mutationKey: ["create-test"],
    mutationFn: () =>
      runTest({
        testData: formatTestsLibrary(
          testsLibrary,
          surveyId!,
          variablesQuery.data.variable_id!
        ),
      }),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Analysis conducted successfully");
      setShowReport(true);
    },
    onError: (error) => {
      console.log(error);
      if ((error as any).response?.data?.message === "Unable to run test") {
        setShowErrorDialog(true);
      }
    },
  });

  console.log(runTestMutation);

  // Drag and Drop Handlers
  const handleDrop = (variable: Variable, testId: string) => {
    const test = testsLibrary.find((t) => t.id === testId);
    if (test && !test.variables.some((v) => v.id === variable.id)) {
      setTestsLibrary(
        update(testsLibrary, {
          [testsLibrary.findIndex((t) => t.id === testId)]: {
            variables: { $push: [variable] },
          },
        })
      );
    }
  };

  const handleRemoveVariable = (testId: string, variableId: string) => {
    const testIndex = testsLibrary.findIndex((test) => test.id === testId);
    const updatedVariables = testsLibrary[testIndex].variables.filter(
      (v) => v.id !== variableId
    );
    setTestsLibrary(
      update(testsLibrary, {
        [testIndex]: {
          variables: { $set: updatedVariables },
        },
      })
    );
  };

  const toggleTest = (testId: string) => {
    const test = testLibrary.find((t) => t.id === testId);
    if (!test) return;

    setTestsLibrary((prev) => {
      const isSelected = prev.some((t) => t.id === testId);
      if (isSelected) {
        // When removing a test, add its variables back to the available variables
        const removedTest = prev.find((t) => t.id === testId);
        if (removedTest) {
          setVariables((prevVariables) => {
            const newVariables = removedTest.variables.filter(
              (newVar) =>
                !prevVariables.some((prevVar) => prevVar.id === newVar.id)
            );
            return [...prevVariables, ...newVariables];
          });
        }
        return prev.filter((t) => t.id !== testId);
      } else {
        // When adding a test back, keep its previous variables
        const existingTest = testLibrary.find((t) => t.id === testId);
        return [
          ...prev,
          { ...existingTest!, variables: existingTest!.variables },
        ];
      }
    });
  };

  useEffect(() => {
    if (variablesQuery.isSuccess) {
      setVariables(
        variablesQuery.data?.data.map((v: TVariableType) => ({
          id: v.slug,
          name: v.display_name,
        }))
      );
    }
  }, [variablesQuery.isSuccess]);

  useEffect(() => {
    if (testsLibraryQuery.isSuccess) {
      // Function to format the data
      const formatTests = () => {
        const formattedData: Test[] = [];
        const allowedTests = [
          // "T-tests",
          // "Correlation Analysis",
          "Wilcoxon Signed-Rank Test",
          "Kruskal-Wallis Test",
          "Chi-Square Test",
          // "Spearman's Rank Correlation",
          "Mann-Whitney U Test",
          "Sentiment Analysis",
          // "Thematic Analysis",
          "Word Frequency Analysis",
        ];

        for (const category in testsLibraryQuery.data) {
          const tests = testsLibraryQuery.data[category];
          tests.forEach((testName: string) => {
            if (allowedTests.includes(testName)) {
              const formattedTest = {
                id: toCamelCase(testName),
                name: testName,
                variables: [],
                category,
              };
              formattedData.push(formattedTest);
            }
          });
        }

        // Set the formatted data into the state
        setTestLibrary(formattedData);
      };

      // Call the function on component mount
      formatTests();
    }
  }, [testsLibraryQuery.isSuccess]);

  useEffect(() => {
    if (createTestsQuery.isSuccess) {
      console.log(createTestsQuery.data);
      const allowedTests = [
        // "T-tests",
        // "Correlation Analysis",
        "Wilcoxon Signed-Rank Test",
        "Kruskal-Wallis Test",
        "Chi-Square Test",
        // "Spearman's Rank Correlation",
        "Mann-Whitney U Test",
        "Sentiment Analysis",
        // "Thematic Analysis",
        "Word Frequency Analysis",
      ];

      const updatedTestLibrary = createTestsQuery.data.data
        .filter((tC: any) => allowedTests.includes(Object.keys(tC)[0]))
        .map((tC: any) => {
          const testName = Object.keys(tC)[0];
          return {
            id: toCamelCase(testName),
            name: testName,
            variables: (Object as any).values(tC)[0].map((c: string) => ({
              id: c,
              name: c,
            })),
            category: testLibrary.find(
              (item) => item.id === toCamelCase(testName)
            )?.category,
          };
        });

      const remainingEmptyTests = testLibrary
        .filter(
          (test) =>
            !updatedTestLibrary.some(
              (updatedTest: any) => updatedTest.id === test.id
            )
        )
        .map((test) => ({ ...test, variables: [] }));
      setTestLibrary([...updatedTestLibrary, ...remainingEmptyTests]);
      setTestsLibrary(updatedTestLibrary);

      // Update variables
      const allVariables = updatedTestLibrary.flatMap(
        (test: any) => test.variables
      );

      console.log(allVariables);
    }
  }, [createTestsQuery.isSuccess]);

  // Check if survey has less than 3 responses
  if (getSurvey.isSuccess && getSurvey.data?.response_count < 10) {
    return (
      <Dialog
        open={true}
        onOpenChange={() => router.push(`/surveys/${surveyId}`)}
      >
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-48 h-48">
              <img
                src="/assets/analysis/no-data.svg"
                alt="Insufficient Data"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-3">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Not Enough Responses
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Your survey needs at least 10 responses before we can perform
                any analysis. Currently you have{" "}
                {getSurvey.data?.response_count || 0} responses.
                <div className="mt-4 text-sm">
                  Share your survey to collect more responses and unlock
                  powerful insights!
                </div>
              </DialogDescription>
            </div>
            <DialogFooter>
              <Button
                onClick={() => router.push(`/surveys/${surveyId}`)}
                className="w-full sm:w-auto auth-btn"
              >
                Return to Survey
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return !showReport ? (
    <Fragment>
      {(variablesQuery.isLoading || testsLibraryQuery.isLoading) && (
        <AnalysisLoadingScreen />
      )}
      {variablesQuery.isError && <AnalysisErrorComponent />}
      {variablesQuery.isSuccess && (
        <>
          {/* Keep the error dialog the same */}

          {runTestMutation.isPending && (
            <LoadingOverlay
              title="Analyzing Survey"
              subtitle="Hold on! Let PollSensei cook."
            />
          )}

          {/* Sensei Master */}
          <AnimatePresence>
            <motion.div
              key="senseiMaster"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mascotVariants}
              className="bg-blue-500 z-[1000000] fixed top-0 left-0"
            >
              <SenseiMaster type={"analysis"} />
            </motion.div>
          </AnimatePresence>
          <DndProvider backend={HTML5Backend}>
            <div className="p-4 max-w-7xl mx-auto">
              {/* Variables Found Section */}
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="bg-[#F5EDF8] rounded-md p-4 text-center min-w-[120px]">
                      <p className="text-3xl font-bold">{variables.length}</p>
                      <p className="text-sm mt-1">Variables</p>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-3">
                        Variables Found
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {variables.map((variable) => (
                          <VariableItem
                            key={variable.id}
                            variable={variable}
                            testsLibrary={testsLibrary}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Content */}
                <div className="flex-1">
                  {/* Test Zones Grid */}
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Selected Tests</h2>
                    <div className="flex gap-3">
                      <Button
                        disabled={!hasVariablesInTestsLibrary(testsLibrary)}
                        className="auth-btn"
                        onClick={() => runTestMutation.mutate()}
                      >
                        Start Analysis
                      </Button>

                      <Button
                        variant="outline"
                        className="flex gap-2 lg:hidden"
                      >
                        <Sheet>
                          <SheetTrigger asChild>
                            <div className="flex items-center">
                              <Library className="h-4 w-4" />
                              <span className="hidden sm:inline ml-2">
                                Test Library
                              </span>
                            </div>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-">
                            <SheetHeader>
                              <SheetTitle>Available Tests</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                              {Object.entries(
                                testLibrary.reduce((acc, test) => {
                                  if (!acc[test.category as any])
                                    acc[test.category as any] = [];
                                  acc[test.category as any].push(test);
                                  return acc;
                                }, {} as Record<string, typeof testLibrary>)
                              ).map(([category, tests], i) => (
                                <div key={category} className="mb-6">
                                  <h3 className="font-bold mb-3">{category}</h3>
                                  <div className="space-y-2">
                                    {tests.map((test) => (
                                      <div
                                        key={test.id}
                                        className="flex items-start"
                                      >
                                        <Checkbox
                                          id={`sheet-${test.id}`}
                                          checked={testsLibrary.some(
                                            (t) => t.id === test.id
                                          )}
                                          onCheckedChange={() =>
                                            toggleTest(test.id)
                                          }
                                          className="mr-2 mt-1 data-[state=checked]:bg-purple-800 data-[state=checked]:border-purple-800"
                                        />
                                        <label
                                          htmlFor={`sheet-${test.id}`}
                                          className="text-sm"
                                        >
                                          {test.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </SheetContent>
                        </Sheet>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(createTestsQuery.fetchStatus === "paused" ||
                      createTestsQuery.isLoading) && (
                      <div className="col-span-full flex justify-center">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Spinner />
                          </motion.div>
                          <h2 className="mt-4 text-xl font-semibold">
                            Generating Tests
                          </h2>
                          <p className="mt-2 text-sm text-gray-500">
                            Please wait...
                          </p>
                        </motion.div>
                      </div>
                    )}

                    {!createTestsQuery.isLoading &&
                      !testsLibraryQuery.isLoading &&
                      !variablesQuery.isLoading && (
                        <>
                          {testsLibrary.length === 0 &&
                          (createTestsQuery.fetchStatus !== "paused" ||
                            !createTestsQuery.isLoading) ? (
                            <div className="col-span-full">
                              <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                                  Let's Start Your Analysis Journey!
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                  Select tests from the Test Library on the
                                  right and drag variables into them. Each test
                                  will help you uncover different insights from
                                  your survey data.
                                </p>
                                <div className="flex flex-col gap-4 max-w-md mx-auto text-left bg-gray-50 p-4 rounded-lg">
                                  <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 p-2 rounded-full">
                                      <Library className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-800">
                                        1. Choose Your Tests
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Select from our curated list of
                                        statistical and analytical tests
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 p-2 rounded-full">
                                      <RxDragHandleDots2 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-800">
                                        2. Drag Variables
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Drag and drop variables from above into
                                        your selected tests
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            testsLibrary.map((test) => (
                              <TestZone
                                key={test.id}
                                test={test}
                                onDrop={(variable: Variable) =>
                                  handleDrop(variable, test.id)
                                }
                                onRemoveVariable={handleRemoveVariable}
                                toggleTest={toggleTest}
                              />
                            ))
                          )}
                        </>
                      )}
                  </div>
                </div>

                {/* Permanent Test Library for larger screens */}
                <div className="hidden lg:block w-80 bg-white p-4 rounded-lg border border-[#BDBDBD] h-fit sticky top-4">
                  <h2 className="font-semibold mb-4">Test Library</h2>
                  <div className="space-y-6">
                    {Object.entries(
                      testLibrary.reduce((acc, test) => {
                        if (!acc[test.category as any])
                          acc[test.category as any] = [];
                        acc[test.category as any].push(test);
                        return acc;
                      }, {} as Record<string, typeof testLibrary>)
                    ).map(([category, tests]) => (
                      <div key={category}>
                        <h3 className="font-bold mb-3">{category}</h3>
                        <div className="space-y-2">
                          {tests.map((test) => (
                            <div key={test.id} className="flex items-start">
                              <Checkbox
                                id={test.id}
                                checked={testsLibrary.some(
                                  (t) => t.id === test.id
                                )}
                                onCheckedChange={() => toggleTest(test.id)}
                                className="mr-2 mt-1 data-[state=checked]:bg-purple-800 data-[state=checked]:border-purple-800"
                              />
                              <label htmlFor={test.id} className="text-sm">
                                {test.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DndProvider>
        </>
      )}
    </Fragment>
  ) : (
    <>
      {runTestMutation.isPending && (
        <LoadingOverlay
          title="Regenerating analysis"
          subtitle="Hold on! Let PollSensei cook."
        />
      )}
      {console.log(runTestMutation)}
      {runTestMutation.isSuccess && (
        <DataVisualizationComponent
          data={runTestMutation?.data ?? {}}
          survey={getSurvey.data}
          rerunTests={() => runTestMutation.mutate()}
        />
      )}
      <AnimatePresence>
        <motion.div
          key="senseiMaster"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mascotVariants}
          className="bg-blue-500 z-[1000000] fixed top-0 left-0"
        >
          <SenseiMaster type={"analysis"} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Variable Item Component (Draggable)
function VariableItem({
  variable,
  testsLibrary,
}: {
  variable: Variable;
  testsLibrary: Test[];
}) {
  const [, drag] = useDrag({
    type: VARIABLE_TYPE,
    item: variable,
  });

  return (
    <div
      ref={drag as any}
      className={cn(
        "px-3 py-1 text-sm cursor-pointer rounded-full transition-colors",
        getUniqueVariables(testsLibrary).some((v) => v.id === variable.id)
          ? "bg-[#5B03B2] hover:bg-[#490390] text-white"
          : "bg-[#7D83981F] hover:bg-[#7D83982F] text-[#5B03B2]"
      )}
    >
      {variable.name}
    </div>
  );
}

// Test Zone Component (Droppable)
function TestZone({
  test,
  onDrop,
  onRemoveVariable,
  toggleTest,
}: {
  test: Test;
  onDrop: (variable: Variable) => void;
  onRemoveVariable: (testId: string, variableId: string) => void;
  toggleTest: (testId: string) => void;
}) {
  const [, drop] = useDrop({
    accept: VARIABLE_TYPE,
    drop: (item: Variable) => onDrop(item),
  });

  return (
    <div
      ref={drop as any}
      className="p-4 rounded-lg border border-[#BDBDBD] bg-white min-h-[200px] transition-shadow hover:shadow-md"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold line-clamp-2">{test.name}</h3>
        <button
          onClick={() => toggleTest(test.id)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X strokeWidth={2} className="size-4" />
        </button>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {test.variables.map((variable) => (
          <div
            key={variable.id}
            className="flex items-center bg-[#5B03B2] rounded-full text-white px-3 py-1 text-sm gap-1"
          >
            <span className="line-clamp-1">
              {variable.name.split("_").join(" ")}
            </span>
            <button
              onClick={() => onRemoveVariable(test.id, variable.id)}
              className="hover:bg-[#490390] rounded-full p-1"
            >
              <X strokeWidth={2} className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
