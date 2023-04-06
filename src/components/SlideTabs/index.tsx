import React, { PropsWithChildren, useState } from "react";
import classNames from "classnames";
import {
  Swiper,
  SwiperItem,
  ScrollView,
  View,
  Image,
  Text,
} from "@tarojs/components";
// import Swiper from "../Swiper";
import img1 from "@assets/img/kobe.png";

import styles from "./index.module.less";

export type IImgProps = {
  id: string;
  path: string;
  desc?: string;
  tag?: string;
  alt?: string;
};

export interface ISlideTabsProps {
  dataSource: IImgProps[];
  activeTabKey: string;
  changeTab: (tabKey: number) => void;
  style?: {};
  config?: {};
}

const SlideTabs: React.FC<ISlideTabsProps & PropsWithChildren> = (props) => {
  const { activeTabKey, dataSource, changeTab, children } = props;

  return (
    <View className={styles["slide-tabs"]}>
      {/* <!-- tabBar选项卡 --> */}

      <ScrollView
        className={styles["slide-box"]}
        enhanced
        // paging-enabled
        fast-deceleration
        scrollX
        scrollWithAnimation
        scroll-into-view={activeTabKey}
      >
        {dataSource.length &&
          dataSource.map((item, index) => {
            return (
              <View
                className={styles["slide-tabs-item"]}
                key={item.id}
                id={item.id}
                onClick={() => changeTab(index)}
              >
                {/* <View
              id="idScrollLeft"
              className="padding_lr_20 {{index===0?'padding_l_40':''}} {{index===LR_tabBar.length-1?'padding_r_40':''}}"
              style="white-space: nowrap;"
            >
            </View> */}
                <Image
                  className={styles["slide-tabs-img"]}
                  mode="aspectFill"
                  src={item.path}
                />
                <Text
                  className={classNames(
                    item.id === activeTabKey ? styles["slide-tabs-active"] : "",
                    styles["slide-tabs-text"]
                  )}
                >
                  {item.tag}
                </Text>
              </View>
            );
          })}
      </ScrollView>
      {/* <!-- 返回顶部 --> */}
      {/* <View className="position_fixed z_index_5 bottom_160 right_36">
        <backToTop width='86' height='86' wx:if="{{scrollTop}}"></backToTop>
      </View> */}
      {children}
    </View>
  );
};

export default SlideTabs;
