import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
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
      axios
        .post("https://comboard.herokuapp.com/user/signup", action.payload)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.msg);
            return window.location.reload();
          } else {
            return alert(res.data.msg);
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
    const response = await axios.post(`/user/login`, info);
    if (!response.data.success) {
      return alert(response.data.msg);
    }
    cookies.set("accessToken", response.data.accessToken, {
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
    const response = await axios.post(`/user/kakaologin`, {
      code,
    });
    cookies.set("accessToken", response.data.accessToken, {
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    thunkAPI.dispatch(auth());
    thunkAPI.dispatch(getAlertCount());
    const data = response.data;
    return data;
  }
);
export const logout = createAsyncThunk(
  "user/logout",
  async (kakaoAccessToken: string | undefined) => {
    axios.get(`/user/logout`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        kakaoAccessToken: kakaoAccessToken,
      },
    });
    cookies.set("accessToken", "", {
      path: "/",
      maxAge: 0,
    });
  }
);
export const auth = createAsyncThunk("user/auth", async () => {
  if (!cookies.get("accessToken")) return;
  const response = await axios.get(`/user/auth`, {
    headers: {
      Authorization: cookies.get("accessToken"),
    },
  });
  return response.data;
});

export const getBookmarkList = createAsyncThunk(
  "user/getBookmarkList",
  async () => {
    const response = await axios.get(`/user/bookmark/list`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = response.data.bookmarkBoardList;
    return data;
  }
);
export const getAlertCount = createAsyncThunk("user/alertCount", async () => {
  const response = await axios.get(`/alert/count`, {
    headers: {
      Authorization: cookies.get("accessToken"),
    },
  });
  const data = response.data.count;
  return data;
});

export const { signup } = userSlice.actions;
export default userSlice.reducer;
