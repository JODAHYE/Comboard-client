import { createSlice } from "@reduxjs/toolkit";
interface PostState {
  postCount: number;
}

const initialState: PostState = {
  postCount: -1,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default postSlice.reducer;
