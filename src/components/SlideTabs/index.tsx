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
import { IImgResultModel } from "@/api/model/baseModel";
// import Swiper from "../Swiper";
// import img1 from "@assets/img/kobe.png";

import styles from "./index.module.less";

export type IImgProps = {
  id: number;
  name: string;
  desc?: string;
  size?: number;
  resolution: string;
  type: number;
  tags?: string;
  daily_recommend: number;
  is_hot?: number;
  path: string;
  alt?: string;
  style?: {};
};

export interface ISlideTabsProps {
  dataSource: IImgResultModel[];
  activeTabKey: string;
  changeTab: ({ detail: {} }) => void;
  style?: {};
  config?: {};
}

const SlideTabs: React.FC<ISlideTabsProps & PropsWithChildren> = (props) => {
  const { activeTabKey, dataSource, changeTab, children, style } = props;

  return (
    <View className={styles["slide-tabs"]}>
      <ScrollView
        style={style}
        className={styles["slide-box"]}
        enhanced
        // paging-enabled
        fast-deceleration
        scrollX
        scrollWithAnimation
        scroll-into-view={activeTabKey}
      >
        {dataSource.length > 0 &&
          dataSource.map((item, index) => {
            return (
              <View
                className={styles["slide-tabs-item"]}
                key={item.cid}
                id={item.key}
                onClick={() =>
                  changeTab({
                    detail: { current: index, currentItemId: item.cid },
                  })
                }
              >
                <Image
                  className={styles["slide-tabs-img"]}
                  mode="aspectFill"
                  src={item.path}
                />
                <Text
                  className={classNames(
                    item.key === activeTabKey
                      ? styles["slide-tabs-active"]
                      : "",
                    styles["slide-tabs-text"]
                  )}
                >
                  {item.categoryName}
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
