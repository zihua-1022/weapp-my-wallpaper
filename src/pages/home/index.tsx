import { useState, useEffect } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import SearchBox from "@components/SearchBox";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard from "@components/ImageCard";
import Swiper from "@components/Swiper";
import { IBaseImgResult } from "@/api/model/baseModel";
import { getDailyRecommend, getDailyPopular } from "@/api/home";
import { serverMap } from "@/services/config";

// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import styles from "./index.module.less";

function Home() {
  const [recommendImgs, setRecommendImgs] = useState<IBaseImgResult[]>([]);
  const [popularImgs, setPopularImgs] = useState<IBaseImgResult[]>([]);
  const handleSearch = (keyword: string) => {
    console.log(`搜索关键词：${keyword}`);
  };
  useEffect(() => {
    getDailyRecommend().then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            path: proxy + "/" + item.path,
          };
        });
        setRecommendImgs(result);
      }
    });
    getDailyPopular().then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            path: proxy + "/" + item.path,
          };
        });
        setPopularImgs(result);
      }
    });
  }, []);

  return (
    <View className={classNames("app", styles["home"])}>
      <CustomNavBar>
        <SearchBox onSearch={handleSearch} />
      </CustomNavBar>
      <View
        className={classNames("app-main", styles["home-main"])}
        // style={{
        //   // paddingTop: `${navBarStyle.totalHeight}px`,
        //   height: `calc(100vh - ${navBarStyle.totalHeight}px)`,
        //   position: "relative",
        //   // marginTop: `${navBarStyle.totalHeight}px`,
        //   overflowY: "auto",
        // }}
      >
        <View className={styles["home-header"]}>
          <Swiper dataSource={recommendImgs}></Swiper>
        </View>
        <View
          className={styles["home-content"]}
          style={{ padding: "0 14px 14px" }}
        >
          <View
            style={{ margin: "12px 0", textAlign: "center", color: "#8a2be2" }}
          >
            ---------- 今日推荐 ----------
          </View>
          <ImageCard
            dataSource={popularImgs}
            style={{
              gridTemplateColumns: "48% 48%",
              columnGap: "4%",
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default Home;
