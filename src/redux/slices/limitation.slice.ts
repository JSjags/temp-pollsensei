import { createSlice } from "@reduxjs/toolkit";

interface LimitationState {
  isLimited: boolean;
  message: string;
}

const initialState: LimitationState = {
  isLimited: false,
  message: "",
};

const limitationSlice = createSlice({
  name: "limitation",
  initialState,
  reducers: {
    setIsLimited: (state, action) => {
      state.isLimited = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setIsLimited, setMessage } = limitationSlice.actions;

export default limitationSlice.reducer;
