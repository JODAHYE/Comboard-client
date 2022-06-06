import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../features/menuSlice";
import userReducer from "../features/userSlice";
import boardReducer from "../features/boardSlice";
import commentReducer from "../features/commentSlice";
export const store = configureStore({
  reducer: {
    menu: menuReducer,
    user: userReducer,
    board: boardReducer,
    comment: commentReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
