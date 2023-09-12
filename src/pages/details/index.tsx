import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { TDataSource } from "@components/ImageCard";
import ImageDetails from "@components/ImageDetails";
import Loading from "@components/Loading";
import { RootState } from "@store/index";
import { getCategoryImage } from "@/api/category";
import { serverMap } from "@/services/config";
import styles from "./index.module.less";

const Details: React.FC = () => {
  const router = useRouter();
  console.log("router: ", router);
  const { imgId, cid, imgProperty, activeTab, viewType, page, pageSize } =
    router.params;
  const currentPage = Number(page || 0);
  const currentPageSize = Number(pageSize || 11);
  console.log("page,pageSize: ", page, pageSize);
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);
  const [currentImg, setCurrentImg] = useState<number>(Number(activeTab));

  const [loading, setLoading] = useState<boolean>(true);

  useShareAppMessage((res) => {
    let shareAppMessage = {};
    if (res.from === "button") {
      // 来自页面内转发按钮
      shareAppMessage = {
        title: "给你一张非常nice的壁纸 ~",
        path: `/pages/mobile/index?imgId=${imgId}&cid=${cid}&imgProperty=${imgProperty}&activeTab=${currentImg}&viewType=${viewType}&page=${page}&pageSize=${pageSize}&to=details&source=details`,
      };
    } else {
      shareAppMessage = {
        title: "Zhua壁纸头像",
        path: `/pages/mobile/index?imgId=${imgId}&cid=${cid}&imgProperty=${imgProperty}&activeTab=${currentImg}&viewType=${viewType}&page=${page}&pageSize=${pageSize}&to=details&source=details`,
      };
    }
    return shareAppMessage;
  });

  const swiperChange = (currentIndex) => {
    setCurrentImg(currentIndex);
  };

  useEffect(() => {
    getCategoryImage({
      imgProperty,
      cid,
      page: 0,
      pageSize: (currentPage + 1) * currentPageSize,
    }).then(({ data }) => {
      const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
      const result = data.value.map((item) => {
        return {
          ...item,
          path: `${proxy}/${item.path}`,
          dPath: `${proxy}/${item.dPath}`,
        };
      });
      setDetailsData(result);
      setLoading(false);
    });
  }, []);

  return (
    <View className={styles["details"]}>
      <View className={styles["details-main"]}>
        {loading && (
          <Loading
            containerStyle={{
              height: `${navBarStyle.windowHeight}px`,
            }}
          />
        )}
        {!loading && (
          <ImageDetails
            dataSource={detailsData}
            imgMode={cid == "14" ? "aspectFit" : "aspectFill"}
            currentImg={currentImg}
            showDetails
            onChange={setCurrentImg}
            navigateBack={Taro.navigateBack}
          />
        )}
      </View>
    </View>
  );
};

export default Details;
