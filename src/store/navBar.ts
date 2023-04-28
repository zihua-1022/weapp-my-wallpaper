import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface INavBarState {
  totalHeight: number; // 总高度
  statusBarHeight: number; // 状态栏高度
  navBarHeight: number; // 导航栏高度
  windowWidth: number;
  windowHeight: number;
  navStyle?: string;
  navOpacity?: number;
  navInpWid?: number;
  navRemain?: number;
  widRemain?: number;
  scrollTop?: number;
  imgOpacity?: number;
}

const initialState: INavBarState = {
  totalHeight: 80, // 总高度
  statusBarHeight: 25, // 状态栏高度
  navBarHeight: 45, // 导航栏高度
  windowWidth: 375,
  windowHeight: 667,
  navStyle: "",
  navOpacity: 0,
  navInpWid: 0,
  navRemain: 0,
  widRemain: 0,
  scrollTop: 0,
  imgOpacity: 1,
};

export const navBarSlice = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    SetNavBar: (state, action: PayloadAction<INavBarState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { SetNavBar } = navBarSlice.actions;

export default navBarSlice.reducer;
