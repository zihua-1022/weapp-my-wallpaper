import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProfileImg } from "@assets/img/profile";

interface IProfileState {
  avatar?: string;
  nickName: string;
  gender?: number;
  token?: string;
  userId: string;
  component?: React.FC;
}

export const initialState: IProfileState = {
  avatar: getProfileImg("defaultAvatar"),
  nickName: "",
  gender: 0,
  token: "",
  userId: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IProfileState>) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setUserInfo } = profileSlice.actions;

export default profileSlice.reducer;
