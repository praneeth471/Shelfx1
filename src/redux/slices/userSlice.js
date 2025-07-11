import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    buy: null,
  };
  
  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setBuyerDetails: (state, action) => {
        state.buy = action.payload;
      },
    },
  });
  
  export const {
    setBuyerDetails,
  } = userSlice.actions;
  
  export default userSlice.reducer;
  