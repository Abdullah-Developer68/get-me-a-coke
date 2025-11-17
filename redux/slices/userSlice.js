import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetch: true, // after the profile has been updated the data needs to be reloaded in the user page
};

const userSlice = createSlice({
  name: "user", // creates action type prefix (unique for every slice) -> "user/trackProfile"
  initialState,
  // reducers: object containing reducer functions (Redux Toolkit auto-generates action creators)
  reducers: {
    // Reducer function (action creator 'fetchPhotos etc' is auto-generated)
    tellToFetchData: (state, action) => {
      // after the profile has been updated the data needs to be reloaded in the user page
      state.fetch = !state.fetch;
    },
  },
});

// export the following action creators
export const { tellToFetchData } = userSlice.actions;
// export these reducer object to notify the store
export default userSlice.reducer;

// Action creators are the "trigger" functions(generated automatically), reducer functions are the "handler" functions!
