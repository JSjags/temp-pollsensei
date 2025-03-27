import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CriteriaState {
  selectedCriteria: {
    [tab: string]: {
      [section: string]: string[];
    };
  };
}

interface CriteriaPayload {
  tab: string;
  section: string;
  criteria: string;
}

// ✅ Initialize with all possible tabs to prevent undefined errors
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
      const { tab, section, criteria } = action.payload;

      // 🔄 Auto-initialize tab/section if not exists (safer than manual checks)
      state.selectedCriteria[tab] ??= {};
      state.selectedCriteria[tab][section] ??= [];

      // Avoid duplicates
      if (!state.selectedCriteria[tab][section].includes(criteria)) {
        state.selectedCriteria[tab][section].push(criteria);
      }
    },
    removeCriteria: (state, action: PayloadAction<CriteriaPayload>) => {
      const { tab, section, criteria } = action.payload;

      // 🛡️ Null-safe deletion
      if (state.selectedCriteria[tab]?.[section]) {
        state.selectedCriteria[tab][section] = state.selectedCriteria[tab][
          section
        ].filter((item) => item !== criteria);

        // Cleanup empty sections/tabs
        if (state.selectedCriteria[tab][section].length === 0) {
          delete state.selectedCriteria[tab][section];
        }
        if (Object.keys(state.selectedCriteria[tab]).length === 0) {
          delete state.selectedCriteria[tab];
        }
      }
    },
    // 💡 New: Reset a specific tab (useful when switching parent tabs)
    // resetTabCriteria: (state, action: PayloadAction<{ tab: string }>) => {
    //   const { tab } = action.payload;
    //   delete state.selectedCriteria[tab];
    // },
    clearCriteria: (state) => {
      state.selectedCriteria = { ...initialState.selectedCriteria }; // Keep structure
    },
  },
});

export const { addCriteria, removeCriteria, clearCriteria } =
  criteriaSlice.actions;

export default criteriaSlice.reducer;
