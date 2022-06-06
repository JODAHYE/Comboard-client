import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  mainMenu: string;
  onPopup?: string;
  mypageMenu: string;
}

const initialState: MenuState = {
  mainMenu: "공개 게시판",
  onPopup: "",
  mypageMenu: "정보 수정",
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    mainMenuClick: (state, action: PayloadAction<string>) => {
      state.mainMenu = action.payload;
    },
    onPopupClick: (state, action: PayloadAction<string>) => {
      state.onPopup = action.payload;
    },
    mypageClick: (state, action: PayloadAction<string>) => {
      state.mypageMenu = action.payload;
    },
  },
});

export const { mainMenuClick, onPopupClick, mypageClick } = menuSlice.actions;

export default menuSlice.reducer;
