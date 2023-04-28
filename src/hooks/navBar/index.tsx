import { useState, ChangeEventHandler } from "react";

export interface INavBarProps {
  totalHeight: number; // 总高度
  statusBarHeight: number; // 状态栏高度
  navBarHeight: number; // 导航栏高度
  windowWidth: number;
  navStyle: string;
  navOpacity: number;
  navInpWid: number;
  navRemain: number;
  widRemain: number;
  scrollTop: number;
  imgOpacity: number;
}
type TChange = (name: keyof INavBarProps, value: string | number) => void;
type TNavBar = (vals: INavBarProps) => void;

type TUseNavBar = [INavBarProps, TChange, TNavBar, () => void];

const UseNavBar = (initialValues: INavBarProps): TUseNavBar => {
  const [styleVal, setStyleVal] = useState<INavBarProps>(initialValues);

  const handleChange: TChange = (name, val) => {
    setStyleVal((prevalues) => ({
      ...prevalues,
      [name]: val,
    }));
  };

  const SetNavBar: TNavBar = (vals) => {
    setStyleVal((prevalues) => ({
      ...prevalues,
      ...vals,
    }));
  };
  const resetNavBar = () => {
    setStyleVal(initialValues);
  };

  return [styleVal, handleChange, SetNavBar, resetNavBar];
};

export default UseNavBar;
