import React, { PropsWithChildren, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import Card from "@components/Card";
import { IPcImgResult } from "@/api/model/computerModel";
import { getImg } from "@assets/img";

import styles from "./index.module.less";

export type TAboutUsProps = PropsWithChildren & {};

const AboutUs: React.FC<TAboutUsProps> = () => {
  return (
    <View className={styles["about-us"]}>
      <CustomNavBar isShowLogo={false} titleText="关于我们" />
      <View className={styles["about-us-main"]}>
        <View className={styles.content}>
          <Image
            className={`${styles.logo} ${styles.space}`}
            src={getImg("logo")}
            mode="aspectFit"
          ></Image>
          <View className={`${styles.title} ${styles.space}`}>Zhua 头像</View>
          <View className={`${styles.desc} ${styles.space}`}>
            探索壁纸/头像美学之境 · 精选极致锁屏桌面
          </View>
          <View className={`${styles.desc} ${styles.space}`}>
            Version 1.6.3
          </View>
        </View>
        <View className={styles.footer}>
          免责声明：本小程序内容来自用户投稿，如涉及版权问题，请随时联系告知我们，谢谢！
        </View>
      </View>
    </View>
  );
};
export default AboutUs;
