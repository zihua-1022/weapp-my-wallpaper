import React, { PropsWithChildren } from "react";
import { View, Image } from "@tarojs/components";
import { IBaseImgResult } from "@/api/model/baseModel";
import { ICategoryResult } from "@/api/model/categoryModel";
import classNames from "classnames";

import "./index.less";

export type TDataSource = IBaseImgResult &
  ICategoryResult & {
    operationTitle?: string;
    operationDesc?: string;
    operate?: string;
  };

export type TImageCardProps = {
  dataSource: TDataSource[];
  className?: string;
  style?: {};
  imgStyle?: {};
  showBottomBtn?: boolean;
};

const ImageCard: React.FC<TImageCardProps & PropsWithChildren> = (props) => {
  return (
    <View
      className={classNames("image-card", props.className)}
      style={props.style}
    >
      {props.dataSource.length > 0 &&
        props.dataSource.map((item) => {
          return (
            <View className="image-card-cover" key={item.id}>
              {item.operationTitle && item.operationDesc && (
                <View className="image-card-cover-meta">
                  <View className="title">{item.operationTitle}</View>
                  <View className="desc">{item.operationDesc}</View>
                  {item.operate && <View className="btn">{item.operate}</View>}
                </View>
              )}

              <Image style={props.imgStyle} mode="aspectFill" src={item.path} />
              {props.showBottomBtn && (
                <View className="btn bottom-btn">{item.categoryName}</View>
              )}
            </View>
          );
        })}
    </View>
  );
};
export default ImageCard;
