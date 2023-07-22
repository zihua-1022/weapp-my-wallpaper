import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPcImgResult } from "@/api/model/computerModel";

interface ICategoryState {
  id: number | null;
  cid: number | null;
  categoryName: string;
  imgDesc?: string;
  imgName: string;
  imgResolution: string;
  path: string;
}

export const initialState: IPcImgResult[] = [];

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryInfo: (state, action: PayloadAction<IPcImgResult[]>) => {
      state = [...action.payload];
      return state;
    },
  },
});

export const { setCategoryInfo } = categorySlice.actions;

export default categorySlice.reducer;
