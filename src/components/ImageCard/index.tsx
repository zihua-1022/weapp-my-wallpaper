import React, { PropsWithChildren, MutableRefObject } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtGrid } from "taro-ui";
import { IImgResultModel } from "@/api/model/baseModel";
import classNames from "classnames";

import "./index.less";

export interface IimgProps {
  id: number;
  path: string;
  alt?: string;
}

export interface IswiperProps {
  dataSource: IImgResultModel[];
  className?: string;
  style?: {};
  imgStyle?: {};
}

const ImageCard: React.FC<IswiperProps> = (props) => {
  // return (
  // <AtGrid
  //   // mode="rect"
  //   hasBorder={false}
  //   data={props.dataSource}
  // />
  // );

  return (
    <View
      className={classNames("image-card", props.className)}
      style={props.style}
    >
      {props.dataSource.length &&
        props.dataSource.map((item) => {
          return (
            <View className="image-card-cover" key={item.id}>
              <Image style={props.imgStyle} mode="aspectFill" src={item.path} />
              <View className="image-card-cover-meta"></View>
            </View>
          );
        })}
    </View>
  );
};
export default ImageCard;
