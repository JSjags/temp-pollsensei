import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  feature: string;
}

const initialState: ModalState = {
  isOpen: false,
  feature: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.feature = action.payload;
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.feature = "";
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
