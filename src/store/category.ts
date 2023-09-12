import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPcImgResult } from "@/api/model/computerModel";

interface ICategoryState {
  mobile: IPcImgResult[];
  avatar: IPcImgResult[];
  // 电脑平板
  computer: IPcImgResult[];
  // 官方推荐
  official: IPcImgResult[];

  natural: IPcImgResult[];
  movies: IPcImgResult[];
}

export const initialState: ICategoryState = {
  mobile: [],
  avatar: [],
  computer: [],
  official: [],
  natural: [],
  movies: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setMobileCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state.mobile = [...action.payload];
      return state;
    },
    setAvatarCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state.avatar = [...action.payload];
      return state;
    },
    setComputerCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state.computer = [...action.payload];
      return state;
    },
    setOfficialCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state.official = [...action.payload];
      return state;
    },
    setNaturalCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state.natural = [...action.payload];
      return state;
    },
    setMoviesCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state.movies = [...action.payload];
      return state;
    },
  },
});

export const {
  setMobileCategoryInfo,
  setAvatarCategoryInfo,
  setComputerCategoryInfo,
  setOfficialCategoryInfo,
  setNaturalCategoryInfo,
  setMoviesCategoryInfo,
} = categorySlice.actions;

export default categorySlice.reducer;
