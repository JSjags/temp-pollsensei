import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CriteriaState {
  selectedCriteria: {
    [tab: string]: {
      [section: string]: {
        required: boolean;
        values: string[];
      };
    };
  };
}

interface CriteriaPayload {
  tab: string;
  section: string;
  criteria: string;
  required: boolean;
}

interface RemoveCriteriaPayload {
  tab: string;
  section: string;
  criteria: string;
}

const initialState: CriteriaState = {
  selectedCriteria: {
    personalInfo: {},
    geographicInfo: {},
    educationEmployment: {},
    healthLifestyle: {},
    technologyMedia: {},
    housingLiving: {},
    mobilityTravel: {},
  },
};

const criteriaSlice = createSlice({
  name: "criteria",
  initialState,
  reducers: {
    addCriteria: (state, action: PayloadAction<CriteriaPayload>) => {
      const { tab, section, criteria, required } = action.payload;

      state.selectedCriteria[tab] ??= {};
      state.selectedCriteria[tab][section] ??= { required: false, values: [] };

      state.selectedCriteria[tab][section].required = required;

      if (criteria) {
        const criteriaArray = criteria.split(",").filter(Boolean);
        criteriaArray.forEach((criterion) => {
          if (
            !state.selectedCriteria[tab][section].values.includes(criterion)
          ) {
            state.selectedCriteria[tab][section].values.push(criterion);
          }
        });
      }
    },

    removeCriteria: (state, action: PayloadAction<RemoveCriteriaPayload>) => {
      const { tab, section, criteria } = action.payload;

      if (state.selectedCriteria[tab]?.[section]) {
        state.selectedCriteria[tab][section].values = state.selectedCriteria[
          tab
        ][section].values.filter((item) => item !== criteria);

        if (state.selectedCriteria[tab][section].values.length === 0) {
          delete state.selectedCriteria[tab][section];
        }
        if (Object.keys(state.selectedCriteria[tab]).length === 0) {
          delete state.selectedCriteria[tab];
        }
      }
    },
    clearCriteria: (state) => {
      state.selectedCriteria = { ...initialState.selectedCriteria };
    },
  },
});

export const { addCriteria, removeCriteria, clearCriteria } =
  criteriaSlice.actions;

export default criteriaSlice.reducer;
