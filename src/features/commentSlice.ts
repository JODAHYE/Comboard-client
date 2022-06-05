import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CommentAPI from "../lib/api/CommentAPI";
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
    const data = await CommentAPI.getCommentList(postId);
    return data;
  }
);

export const { commentListInit } = commentSlice.actions;

export default commentSlice.reducer;
