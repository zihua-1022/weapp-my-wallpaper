import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITabBarState {
  currentTab: number;
  tabs: {
    key?: number;
    pagePath: string;
    text?: string;
    iconPath: string;
    selectedIconPath: string;
    component?: React.FC;
  }[];
}

const initialState: ITabBarState = {
  currentTab: 0,
  tabs: [],
};

export const tabBarSlice = createSlice({
  name: "tabBar",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<number>) => {
      state.currentTab = action.payload;
    },
    setTabs: (state, action: PayloadAction<ITabBarState["tabs"]>) => {
      state.tabs = action.payload;
    },
  },
});

export const { setCurrentTab, setTabs } = tabBarSlice.actions;

export default tabBarSlice.reducer;
