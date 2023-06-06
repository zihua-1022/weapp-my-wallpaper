import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard from "@components/ImageCard";
import { imgsListToTree2, TImgsTreeData } from "@utils/tools";
import { getImageRecommend } from "@/api/computer";
import { serverMap } from "@/services/config";

import styles from "./index.module.less";

const Computer: React.FC = () => {
  const [imgsTreeData, setImgsTreeData] = useState<TImgsTreeData[]>([]);

  useEffect(() => {
    getImageRecommend().then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            path: proxy + "/" + item.path,
          };
        });
        const imgsTree = imgsListToTree2(result);
        setImgsTreeData(imgsTree);
      }
    });
  }, []);

  return (
    <View className={classNames("app", styles["computer"])}>
      <CustomNavBar />
      <View className={classNames("app-main", styles["computer-main"])}>
        {imgsTreeData.length > 0 &&
          imgsTreeData.map((item) => {
            return (
              <View className={styles["computer-category-card"]} key={item.mid}>
                <View className={styles["category-desc"]}>
                  <View className={styles["category-desc-left"]}>
                    <View className={styles["title"]}>{item.cTitle}</View>
                    <View className={styles["subtitle"]}>{item.cDesc}</View>
                  </View>
                  <View className={styles["btn"]}>More +</View>
                </View>
                <ImageCard
                  dataSource={item.children}
                  style={{
                    gridTemplateColumns: "100%",
                    columnGap: "4%",
                  }}
                  imgStyle={{
                    height: "180px",
                  }}
                />
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default Computer;
