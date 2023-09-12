import React, { useState, PropsWithChildren, useEffect } from "react";
import { View, Picker, Image } from "@tarojs/components";
import { ICategoryResult } from "@/api/model/categoryModel";

import styles from "./index.module.less";

interface ISelectProps {
  label?: string;
  options: ICategoryResult[];
  selectedOption: ICategoryResult;
  setSelectedOption: Function;
  onSearch?: (keyword: string) => void;
}

const Select: React.FC<ISelectProps & PropsWithChildren> = ({
  label = "图片所属分类",
  options,
  selectedOption,
  setSelectedOption,
  children,
}) => {
  // const [options, setOptions] = useState<ICategoryResult[]>([]);
  // const [selectedOption, setSelectedOption] = useState<ICategoryResult>(
  //   options[4]
  // );

  const onPickerChange = (e) => {
    const index = e.detail.value; // 获取选中的索引
    setSelectedOption(options[index]); // 根据索引获取选中的选项
  };

  return (
    <View className={styles.select}>
      <Picker
        mode="selector"
        range={options}
        rangeKey="categoryName"
        onChange={onPickerChange}
      >
        <View>{label}</View>
        <View className={styles["picker-container"]}>
          当前选择：{selectedOption.categoryName}
        </View>
      </Picker>
    </View>
  );
};

export default Select;
