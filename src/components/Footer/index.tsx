import React, { PropsWithChildren } from "react";
import { View } from "@tarojs/components";

import styles from "./index.module.less";

export type TFooterProps = {
  hasMore: boolean;
  loading: boolean;
  containerStyle?: {};
};

const Footer: React.FC<TFooterProps & PropsWithChildren> = ({
  hasMore = true,
  loading,
  containerStyle,
}) => {
  return (
    <View style={containerStyle} className={styles["footer"]}>
      <>
        {!loading && (
          <View>
            {hasMore ? "———— 加载更多 ————" : "———— 你已到达世界的尽头 ————"}
          </View>
        )}
        {loading && (
          <View className={styles["footer-loading"]}>
            <View className={styles.container}>
              <View className={`${styles.top} ${styles.inner}`}></View>
              <View className={`${styles.bottom} ${styles.inner}`}></View>
              <View className={`${styles.left} ${styles.inner}`}></View>
              <View className={`${styles.right} ${styles.inner}`}></View>
              <View className={`${styles.front} ${styles.inner}`}></View>
              <View className={`${styles.back} ${styles.inner}`}></View>
            </View>
            <View className={styles.text}>加载中...</View>
          </View>
        )}
      </>
    </View>
  );
};
export default Footer;
