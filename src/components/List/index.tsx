import React, { PropsWithChildren } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
// import img1 from "@assets/img/测试1.jpg";

import "./index.less";

export interface IimgProps {
  id: number;
  image: string;
  alt?: string;
  style?: {};
}

export interface IswiperProps {
  dataSource: IimgProps[];
}

const List: React.FC<IswiperProps> = (props) => {
  return (
    <AtList>
      {props.dataSource.length &&
        props.dataSource.map((item) => {
          return (
            <AtListItem
              title="标题文字"
              note="描述信息"
              arrow="right"
              thumb="http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png"
            />
          );
        })}
    </AtList>
  );
};
export default List;
