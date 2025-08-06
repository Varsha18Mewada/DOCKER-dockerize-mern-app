import React from 'react';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  id: localStorage.getItem('userId') || null,
  userName: localStorage.getItem('userName') || '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.userName = action.payload.userName;
    },
    logoutSuccess(state) {
      state.token = null;
      state.id = null;
      state.userName = '';
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
