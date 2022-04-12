import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { BoardType } from "../types/dataType";
const cookies = new Cookies();

interface BoardState {
  createList: BoardType[];
  currentBoard: BoardType;
}

const initialState: BoardState = {
  createList: [],
  currentBoard: {
    _id: "",
    master: "",
    access: "",
    create_date: 0,
    title: "",
    postCount: 0,
  },
};
export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    board_init: (state, action: PayloadAction) => {
      state.currentBoard = {
        _id: "",
        master: "",
        access: "",
        create_date: 0,
        postCount: 0,
        title: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCreateList.fulfilled, (state, action) => {
      state.createList = action.payload.list;
    });

    builder.addCase(getCurrentBoard.fulfilled, (state, action) => {
      state.currentBoard = action.payload.board;
    });
  },
});
export const getCurrentBoard = createAsyncThunk(
  "board/getCurrentBoard",
  async (boardId: string, thunkAPI) => {
    const response = await axios.get(`/board/${boardId}`);
    const data = await response.data;
    return data;
  }
);

export const getCreateList = createAsyncThunk(
  "board/getCreateList",
  async () => {
    const response = await axios.get(`/user/board/created_list`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = response.data;
    return data;
  }
);
export const { board_init } = boardSlice.actions;
export default boardSlice.reducer;
