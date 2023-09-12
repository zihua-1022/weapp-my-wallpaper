import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface INavBarState {
  totalHeight: number; // 总高度
  statusBarHeight: number; // 状态栏高度
  navBarHeight: number; // 导航栏高度
  windowWidth: number;
  windowHeight: number; // 状态栏+导航栏总高度
  navStyle?: string;
  navOpacity?: number;
  navInpWid?: number;
  navRemain?: number;
  widRemain?: number;
  scrollTop?: number;
  imgOpacity?: number;
  menuButton: {
    width: number;
    height: number;
    left: number;
  }; // 胶囊
}

const initialState: INavBarState = {
  totalHeight: 80, // 状态栏+导航栏总高度
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
  menuButton: {
    width: 0,
    height: 0,
    left: 0,
  },
};

export const navBarSlice = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    SetNavBar: (state, action: PayloadAction<INavBarState>) => {
      Object.assign(state, action.payload);
      return state;
    },
  },
});

export const { SetNavBar } = navBarSlice.actions;

export default navBarSlice.reducer;
