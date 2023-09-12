import React, { PropsWithChildren, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Image,
  Block,
  Text,
  ScrollView,
  MovableArea,
  MovableView,
  Swiper,
  SwiperItem,
} from "@tarojs/components";
import Card from "@components/Card";
import TabBar from "@components/TabBar";
import { getCurrentTime } from "@utils/tools";
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
  showDateTime?: boolean;
};

const ImageDetails: React.FC<TImageDetailsProps & PropsWithChildren> = ({
  dataSource,
  style,
  currentImg,
  navigateBack,
  onChange,
  imgMode = "aspectFit",
  scale,
  showDetails = true,
  showDateTime = true,
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
    if (onChange) {
      onChange(current);
    }
  };

  useEffect(() => {
    if (dataSource.length > 0) {
      const img = dataSource.find((item, index) => {
        return index === currentImg;
      });
      setFilePath(img?.dPath || "");
    }
  }, [currentImg, dataSource]);

  return (
    <>
      <View className={styles["image-details"]}>
        {showDetails && (
          <>
            {showDateTime && (
              <View className={styles["image-details-dateTime"]}>
                <View className={styles.date}>{getCurrentTime("mdw")}</View>
                <View className={styles.time}>{getCurrentTime("hm")}</View>
              </View>
            )}
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
                    <Block key={img.id}>
                      <SwiperItem itemId={img.dPath}>
                        <Image
                          src={img.path}
                          mode={imgMode}
                          // onTap={() => {
                          //   Taro.previewMedia({
                          //     sources: [
                          //       {
                          //         url: img.path,
                          //       },
                          //     ],
                          //     success: (res) => {
                          //       console.log("re_____________s: ", res);
                          //     },
                          //     fail: (err) => {
                          //       console.log("err: ", err);
                          //     },
                          //   });
                          // }}
                        />
                      </SwiperItem>
                    </Block>
                  );
                })}
            </Swiper>
            <View className={styles["image-details-footer"]}>
              <Card>
                <View>壁纸来源于网络</View>
              </Card>
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
s                </>
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
        ]}
        navigateBack={navigateBack}
        downloadImage={async () => {
          Taro.showLoading();
          try {
            console.log("filePath: ", filePath);
            await downloadFile(filePath);
            Taro.hideLoading();
            Taro.showToast({
              title: "保存成功 ~",
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
