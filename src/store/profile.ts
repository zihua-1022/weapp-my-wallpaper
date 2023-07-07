import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DefaultAvatar from "@assets/img/defaultAvatar.jpg";

interface IProfileState {
  avatar?: string;
  nickName: string;
  gender?: number;
  token?: string;
  userId?: string;
  component?: React.FC;
}

export const initialState: IProfileState = {
  // avatar:
  //   "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
  avatar: DefaultAvatar,
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
