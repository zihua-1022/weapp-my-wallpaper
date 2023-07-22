import React, { useState, PropsWithChildren } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Image,
  Block,
  ShareElement,
  PageContainer,
} from "@tarojs/components";
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
  viewType: number;
  toDetails?: (img: TDataSource, index: number, viewType: number) => void;
  toImgsDetail?: (imgs: TDataSource[], index: number) => void;
  style?: {};
  imgStyle?: {};
  imgMode?: "aspectFill" | "aspectFit" | "widthFix" | "top" | "bottom";
  showSkeleton?: boolean;
  showBottomBtn?: boolean;
};

const ImageCard: React.FC<TImageCardProps & PropsWithChildren> = ({
  dataSource,
  className,
  viewType, // 0 分类页面 1 全屏right假页面 2 全屏center弹窗假页面
  toDetails,
  toImgsDetail,
  style,
  imgStyle,
  imgMode = "aspectFill",
  showSkeleton,
  showBottomBtn,
}) => {
  return (
    <View className={classNames("image-card", className)} style={style}>
      {dataSource.length > 0 &&
        dataSource.map((item, index) => {
          return (
            <Block key={item.id}>
              <View
                style={{ ...imgStyle, backgroundColor: item.imgColor }}
                className="image-card-cover"
                // style={imgStyle}
                id={`img_${index}`}
                onClick={() => {
                  if (toDetails) {
                    toDetails(item, 0, viewType);
                  } else if (toImgsDetail) {
                    toImgsDetail(dataSource, index);
                  }
                }}
              >
                {item.operationTitle && item.operationDesc && (
                  <View className="image-card-cover-meta">
                    <View className="title">{item.operationTitle}</View>
                    <View className="desc">{item.operationDesc}</View>
                    {item.operate && (
                      <View className="btn">{item.operate}</View>
                    )}
                  </View>
                )}
                <Image mode={imgMode} src={item.path} />
                {showBottomBtn && (
                  <View className="btn bottom-btn">{item.categoryName}</View>
                )}
              </View>
            </Block>
          );
        })}
      {showSkeleton && dataSource.length <= 0 && (
        <View
          style={{
            ...imgStyle,
            width: "100%",
            backgroundColor: "var(--card-background-color)",
          }}
        ></View>
      )}
    </View>
  );
};
export default ImageCard;
