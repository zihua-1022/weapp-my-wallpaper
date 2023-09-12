import React, { PropsWithChildren, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { ScrollView, View, Image, Text } from "@tarojs/components";
import { RootState } from "@store/index";
import { IPcImgResult } from "@/api/model/computerModel";

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
  dataSource: IPcImgResult[];
  activeTabKey: number;
  changeTab: ({ detail: {} }) => void;
  config?: {};
}

const SlideTabs: React.FC<ISlideTabsProps & PropsWithChildren> = (props) => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const { activeTabKey, dataSource, changeTab, children } = props;

  return (
    <View className={styles["slide-tabs"]}>
      <ScrollView
        style={{ top: `${navBarStyle.totalHeight}px`, flexDirection: "row" }}
        className={styles["slide-box"]}
        scrollX
        enhanced
        enable-flex
        scroll-left={activeTabKey * 100 - 20}
        show-scrollbar={false}
        fast-deceleration
        scrollWithAnimation
        // scroll-into-view={`tab_${activeTabKey}`}
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
                    item.key === `tab_${activeTabKey}`
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
