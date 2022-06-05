import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import ALertAPI from "../lib/api/AlertAPI";
import UserAPI from "../lib/api/UserAPI";
import { BoardType } from "../types/dataType";

const cookies = new Cookies();

export interface UserState {
  objectId: string;
  email: string;
  nickname: string;
  is_auth: boolean;
  like_post: string[];
  dislike_post: string[];
  scrap_post: string[];
  bookmark: string[];
  profileImage: string;
  bookmarkBoardList: BoardType[];
  postLock?: boolean;
  alertCount: number;
  kakaoAccessToken?: string;
  loginLoading: boolean;
}

const initialState: UserState = {
  objectId: "",
  email: "",
  nickname: "",
  is_auth: cookies.get("accessToken") ? true : false,
  like_post: [],
  dislike_post: [],
  scrap_post: [],
  bookmark: [],
  profileImage: "",
  bookmarkBoardList: [],
  postLock: undefined,
  alertCount: 0,
  kakaoAccessToken: "",
  loginLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<object>) => {
      UserAPI.signUp(action.payload).then((data) => {
        if (data.success) {
          alert(data.msg);
          return window.location.reload();
        } else {
          return alert(data.msg);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(auth.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.profileImage = action.payload.profileImage;
      state.is_auth = action.payload.isAuth;
      state.loginLoading = false;
      state.objectId = action.payload.objectId;
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
      state.like_post = action.payload.like_post;
      state.dislike_post = action.payload.dislike_post;
      state.scrap_post = action.payload.scrap_post;
      state.bookmark = action.payload.bookmark;
      state.postLock = action.payload.postLock;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.kakaoAccessToken = "";
      window.location.reload();
    });
    builder.addCase(getBookmarkList.fulfilled, (state, action) => {
      state.bookmarkBoardList = action.payload;
    });
    builder.addCase(getAlertCount.fulfilled, (state, action) => {
      state.alertCount = action.payload;
    });
    builder.addCase(login.pending, (state, action) => {
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loginLoading = false;
    });
    builder.addCase(kakaoLogin.pending, (state, action) => {
      state.loginLoading = true;
    });
    builder.addCase(kakaoLogin.fulfilled, (state, action) => {
      state.kakaoAccessToken = action.payload.kakaoAccessToken;
    });
  },
});

export const login = createAsyncThunk(
  "user/login",
  async (info: object, thunkAPI) => {
    const data = await UserAPI.login(info);
    if (!data.success) {
      return alert(data.msg);
    }
    cookies.set("accessToken", data.accessToken, {
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    thunkAPI.dispatch(auth());
    thunkAPI.dispatch(getAlertCount());
  }
);

export const kakaoLogin = createAsyncThunk(
  "user/kakaoLogin",
  async (code: string, thunkAPI) => {
    const data = await UserAPI.kakaoLogin(code);
    cookies.set("accessToken", data.accessToken, {
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    thunkAPI.dispatch(auth());
    thunkAPI.dispatch(getAlertCount());
    return data;
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (kakaoAccessToken: string | undefined) => {
    const data = await UserAPI.logout(kakaoAccessToken);
    cookies.set("accessToken", "", {
      path: "/",
      maxAge: 0,
    });
    return data;
  }
);

export const auth = createAsyncThunk("user/auth", async () => {
  if (!cookies.get("accessToken")) return;
  const data = await UserAPI.auth();
  return data;
});

export const getBookmarkList = createAsyncThunk(
  "user/getBookmarkList",
  async () => {
    const data = await UserAPI.getBookmarkList();
    return data;
  }
);

export const getAlertCount = createAsyncThunk("user/alertCount", async () => {
  const data = ALertAPI.getAlertCount();
  return data;
});

export const { signup } = userSlice.actions;

export default userSlice.reducer;
