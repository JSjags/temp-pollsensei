import { transformSurveySkipLogic } from "./SkipLogicEditor";

// Test survey data based on the user's example
const testSurveyData = {
  _id: "688c6ef4c1f4639c2cd2fe4a",
  sections: [
    {
      questions: [
        {
          _id: "688c6ef4c1f4639c2cd2fe35",
          question:
            "How familiar are you with Artificial Intelligence (AI) and Human Intelligence (HI)?",
          question_type: "likert_scale",
          options: [
            "Very Unfamiliar",
            "Unfamiliar",
            "Neutral",
            "Familiar",
            "Very Familiar",
          ],
          skip_logic: [],
        },
        {
          _id: "688c6ef4c1f4639c2cd2fe36",
          question:
            "Which do you believe has more potential for future development: AI or HI?",
          question_type: "single_choice",
          options: ["AI", "HI"],
          skip_logic: [
            {
              logic_type: "display_logic",
              condition: {
                logical_operator: "and",
                rules: [
                  {
                    source_id: "688c6ef4c1f4639c2cd2fe35",
                    operator: "equals",
                    value: "Neutral",
                    _id: "688c6fb3c1f4639c2cd2fe80",
                  },
                ],
                action: {
                  type: "hide",
                  target_type: "question",
                  target_id: "688c6ef4c1f4639c2cd2fe35",
                },
              },
              _id: "688c6fb3c1f4639c2cd2fe7f",
            },
          ],
        },
        {
          _id: "688c6ef4c1f4639c2cd2fe37",
          question: "Rate your trust in AI technology:",
          question_type: "star_rating",
          options: ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"],
          skip_logic: [],
        },
        {
          _id: "688c6ef4c1f4639c2cd2fe38",
          question:
            "How comfortable are you with the idea of AI replacing human tasks?",
          question_type: "likert_scale",
          options: [
            "Very Uncomfortable",
            "Uncomfortable",
            "Neutral",
            "Comfortable",
            "Very Comfortable",
          ],
          skip_logic: [
            {
              logic_type: "display_logic",
              condition: {
                logical_operator: "and",
                rules: [
                  {
                    source_id: "688c6ef4c1f4639c2cd2fe36",
                    operator: "equals",
                    value: "HI",
                    _id: "688c6fb3c1f4639c2cd2fe84",
                  },
                ],
                action: {
                  type: "show",
                  target_type: "question",
                  target_id: "688c6ef4c1f4639c2cd2fe35",
                },
              },
              _id: "688c6fb3c1f4639c2cd2fe83",
            },
          ],
        },
        {
          _id: "688c6ef4c1f4639c2cd2fe39",
          question:
            "In your opinion, which field benefits more from AI advancements: Healthcare or Finance?",
          question_type: "single_choice",
          options: ["Healthcare", "Finance"],
          skip_logic: [
            {
              logic_type: "skip_logic",
              condition: {
                logical_operator: "and",
                rules: [
                  {
                    source_id: "688c6ef4c1f4639c2cd2fe39",
                    operator: "notEquals",
                    value: "Familiar",
                    _id: "688c6fb3c1f4639c2cd2fe87",
                  },
                ],
                action: {
                  type: "jump_to",
                  target_type: "question",
                  target_id: "688c6ef4c1f4639c2cd2fe3e",
                },
              },
              _id: "688c6fb3c1f4639c2cd2fe86",
            },
          ],
        },
        {
          _id: "688c6ef4c1f4639c2cd2fe3e",
          question:
            "Which do you think is more adaptable to changing circumstances: AI or HI?",
          question_type: "single_choice",
          options: ["AI", "HI"],
          skip_logic: [
            {
              logic_type: "skip_logic",
              condition: {
                logical_operator: "and",
                rules: [
                  {
                    source_id: "688c6ef4c1f4639c2cd2fe3e",
                    operator: "equals",
                    value: "AI",
                    _id: "688c6fb3c1f4639c2cd2fe8e",
                  },
                ],
                action: {
                  type: "end_survey",
                  target_type: "question",
                  target_id: "688c6ef4c1f4639c2cd2fe3e",
                },
              },
              _id: "688c6fb3c1f4639c2cd2fe8d",
            },
          ],
        },
      ],
    },
  ],
};

// Test the transformation
const transformedSkipLogic = transformSurveySkipLogic(testSurveyData);

console.log(
  "Transformed Skip Logic:",
  JSON.stringify(transformedSkipLogic, null, 2)
);

// Expected output should show:
// 1. Proper mapping of source_id to sectionIndex and questionIndex
// 2. Proper mapping of target_id to sectionIndex and questionIndex
// 3. Correct action types (hide, show, jump_to, end_survey)
// 4. Correct conditions with proper operators and values

export { testSurveyData, transformedSkipLogic };
