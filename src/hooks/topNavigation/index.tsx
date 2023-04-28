import { useState, ChangeEventHandler } from "react";

interface InavigationProps {
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
type HandleChange = (
  name: keyof InavigationProps,
  value: string | number
) => void;
type SetNavigation = (vals: InavigationProps) => void;

type UseNavigation = [
  InavigationProps,
  HandleChange,
  SetNavigation,
  () => void
];

const useTopNavigation = (initialValues: InavigationProps): UseNavigation => {
  const [value, setValues] = useState<InavigationProps>(initialValues);

  const handleChange: HandleChange = (name, val) => {
    setValues((prevvalues) => ({
      ...prevvalues,
      [name]: val,
    }));
  };

  const setNavigation: SetNavigation = (vals) => {
    setValues((prevvalues) => ({
      ...prevvalues,
      ...vals,
    }));
  };
  const resetNavigation = () => {
    setValues(initialValues);
  };

  return [value, handleChange, setNavigation, resetNavigation];
};

export default useTopNavigation;
