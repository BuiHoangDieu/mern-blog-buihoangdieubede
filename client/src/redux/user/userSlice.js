import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signInFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    deleteError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    signOutError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFaliure,
  updateStart,
  updateError,
  updateSuccess,
  deleteStart,
  deleteSuccess,
  deleteError,
  signOutError,
  signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
