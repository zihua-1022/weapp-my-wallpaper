import React, { PropsWithChildren } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";

import styles from "./index.module.less";

export type TLoadingProps = {
  style?: {
    top: {};
    bottom: {};
    left: {};
    right: {};
    front: {};
    back: {};
  };
  containerStyle?: {};
};

const Loading: React.FC<TLoadingProps & PropsWithChildren> = ({
  style,
  containerStyle,
  children,
}) => {
  return (
    <View style={containerStyle} className={styles["loading-container"]}>
      <View className={classNames(styles["cube-box"])}>
        <View className={classNames(styles.top, styles.inner)}>1</View>
        <View className={classNames(styles.bottom, styles.inner)}>2</View>
        <View className={classNames(styles.left, styles.inner)}>3</View>
        <View className={classNames(styles.right, styles.inner)}>4</View>
        <View className={classNames(styles.front, styles.inner)}>5</View>
        <View className={classNames(styles.back, styles.inner)}>6</View>
      </View>
    </View>
  );
};
export default Loading;
