import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadState {
  isUploadOpen: boolean;
}

const initialState: UploadState = {
  isUploadOpen: false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    toggleUpload: (state: UploadState) => {
      state.isUploadOpen = !state.isUploadOpen;
    },
    openUpload: (state: UploadState) => {
      state.isUploadOpen = true;
    },
    closeUpload: (state: UploadState) => {
      state.isUploadOpen = false;
    },
  },
});

export const { toggleUpload, openUpload, closeUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
