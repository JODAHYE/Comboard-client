import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CommentType } from "../types/dataType";

interface commentState {
  commentList: CommentType[];
}

const initialState: commentState = {
  commentList: [],
};
export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    commentListInit: (state) => {
      state.commentList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCommentList.fulfilled, (state, action) => {
      state.commentList = action.payload;
    });
  },
});
export const getCommentList = createAsyncThunk(
  "comment/getCommentList",
  async (postId: string) => {
    const response = await axios.get(`/comment/list`, {
      params: {
        postId,
      },
    });
    const data = response.data.commentList;
    return data;
  }
);

export const { commentListInit } = commentSlice.actions;
export default commentSlice.reducer;
