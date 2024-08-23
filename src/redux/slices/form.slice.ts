import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  isFormOpen: boolean;
}

const initialState: FormState = {
  isFormOpen: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    toggleForm: (state: FormState) => {
      state.isFormOpen = !state.isFormOpen;
    },
    openForm: (state: FormState) => {
      state.isFormOpen = true;
    },
    closeForm: (state: FormState) => {
      state.isFormOpen = false;
    },
  },
});

export const { toggleForm, openForm, closeForm } = formSlice.actions;
export default formSlice.reducer;
