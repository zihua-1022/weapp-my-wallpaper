import React, { PropsWithChildren, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Image,
  Block,
  ScrollView,
  MovableArea,
  MovableView,
  Swiper,
  SwiperItem,
  SwiperProps,
} from "@tarojs/components";
import classNames from "classnames";
// import Swiper from "@components/Swiper";
import TabBar from "@components/TabBar";
import { downloadFile } from "@utils/weapp";
import { IPcImgResult } from "@/api/model/computerModel";
import { getTabBarImg } from "@assets/img/tabBar";

import styles from "./index.module.less";

export type TImageDetailsProps = {
  dataSource: IPcImgResult[];
  currentImg?: number;
  navigateBack?: () => void;
  onChange?: (currentIndex: number) => void;
  style?: {};
  imgMode?: "aspectFill" | "aspectFit" | "widthFix" | "top" | "bottom";
  scroll?: boolean;
  scale?: boolean;
  movable?: boolean;
  showDetails?: boolean;
};

const ImageDetails: React.FC<TImageDetailsProps & PropsWithChildren> = ({
  dataSource,
  style,
  currentImg,
  navigateBack,
  onChange,
  imgMode = "aspectFit",
  scroll,
  scale,
  movable,
  showDetails = true,
}) => {
  const [filePath, setFilePath] = useState<string>("");

  let startX = 0; // 手势滑动起始位置 X

  const onTouchStart = (event) => {
    startX = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    const moveX = event.changedTouches[0].clientX;
    const deltaX = moveX - startX;
    if (deltaX < 0) {
      // 执行左滑逻辑
      console.log("左滑");
    } else if (startX < 20 && deltaX !== 0) {
      console.log("非左滑");
      // 执行其他逻辑
      if (navigateBack) {
        navigateBack();
      }
    }
  };

  const swiperChange = (e) => {
    const { current, currentItemId } = e.detail;
    setFilePath(currentItemId);
    if (onChange && scroll) {
      onChange(current);
    }
  };

  useEffect(() => {
    if (dataSource.length > 0) {
      const img = dataSource.filter((item, index) => {
        return index === currentImg;
      });
      setFilePath(img[0].path);
    }
  }, [dataSource, currentImg]);

  return (
    <>
      <View className={styles["image-details"]}>
        {showDetails && (
          <>
            <Swiper
              className={styles["image-details-main"]}
              current={currentImg}
              // easing-function="easeOutCubic"
              onChange={swiperChange}
              onClick={() => {
                if (scale && navigateBack) {
                  navigateBack();
                }
              }}
            >
              {dataSource.length > 0 &&
                dataSource.map((img) => {
                  return (
                    <SwiperItem key={img.id} itemId={img.path}>
                      <Image src={img.path} mode={imgMode} />
                    </SwiperItem>
                  );
                })}
            </Swiper>
            <View className={styles["image-details-footer"]}>
              {dataSource.length > 0 && (
                <View className={styles.desc}>
                  <View>{`图片名称：${dataSource[0].imgName}`}</View>
                  <View>{`图片描述：${dataSource[0].imgDesc}`}</View>
                  <View>{`图片上传时间：${dataSource[0].createdAt}`}</View>
                </View>
              )}
            </View>
            {/* {dataSource.length > 0 &&
            dataSource.map((item) => {
              return (
                <>
                  {!movable && (
                    <View
                      className={styles["image-details-main"]}
                      key={item.id}
                      onClick={navigateBack}
                    >
                      <Image
                        // className={classNames(
                        //   styles.images,
                        //   showDetails ? styles.enter : ""
                        // )}
                        mode={imgMode}
                        src={item.path}
                      />
                    </View>
                  )}
                  {movable && (
                    <View
                      className={styles["image-details-main"]}
                      key={item.id}
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                    >
                      <MovableArea style={{ width: "100%", height: "100vh" }}>
                        <MovableView
                          style={{
                            width: item.imgWidth,
                            height: "100%",
                          }}
                          direction="horizontal"
                        >
                          <Image mode={imgMode} src={item.path} />
                        </MovableView>
                      </MovableArea>
                    </View>
                  )}
                  <View className={styles.desc}>
                    <View>{`图片名称：${item.imgName}`}</View>
                    <View>{`图片描述：${item.imgDesc}`}</View>
                    <View>{`图片上传时间：${item.createdAt}`}</View>
                  </View>
                </>
              );
            })} */}
          </>
        )}
      </View>

      <TabBar
        dataSource={[
          {
            id: "goBack",
            ...getTabBarImg("goBack"),
          },
          {
            id: "download",
            ...getTabBarImg("download"),
          },
          {
            id: "share",
            ...getTabBarImg("share"),
          },
        ]}
        navigateBack={navigateBack}
        downloadImage={async () => {
          Taro.showLoading();
          try {
            await downloadFile(filePath);
            Taro.hideLoading();
            Taro.showToast({
              title: "保存成功~",
              icon: "none",
            });
          } catch (error) {
            Taro.hideLoading();
            Taro.showToast({
              title: "保存失败！",
              icon: "none",
            });
            throw new Error(error);
          }
        }}
      />
    </>
  );
};
export default ImageDetails;
