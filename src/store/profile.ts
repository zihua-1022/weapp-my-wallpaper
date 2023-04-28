import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type TProfile = {
//   avatar: string;
//   nickname: string;
//   gender: number;
// };

interface IProfileState {
  avatar: string;
  nickname: string;
  gender?: number;
  token: string;
  user_id: string;
  component?: React.FC;
}

const initialState: IProfileState = {
  avatar:
    "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
  nickname: "",
  gender: 0,
  token: "",
  user_id: "",
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
