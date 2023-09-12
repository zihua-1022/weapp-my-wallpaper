import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro, {
  useRouter,
  useShareAppMessage,
  useReachBottom,
} from "@tarojs/taro";
import { View, Swiper, SwiperItem, PageContainer } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import SlideTabs from "@components/SlideTabs";
import ImageCard, { TDataSource } from "@components/ImageCard";
import ImageDetails from "@components/ImageDetails";
import Footer from "@components/Footer";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setShowTabBar } from "@store/tabBar";
import { TImgsTreeData, arrCompositeTree } from "@utils/tools";
import { getCategoryImage } from "@/api/category";
import { IPcImgResult } from "@/api/model/computerModel";
import { serverMap } from "@/services/config";
import styles from "./index.module.less";

const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
const categoryPageSize = 11;

const Category: React.FC = () => {
  const router = useRouter();
  const { imgId, mid, cid, imgProperty, activeTab, viewType, source } =
    router.params;
  console.log(
    source,
    "router: ",
    imgProperty,
    cid,
    mid,
    viewType,
    "00000000",
    activeTab
  );
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const tabsDataSource = {
    // 移动端数据
    mobile: useSelector((state: RootState) => state.category.mobile),
    "computer-1": useSelector((state: RootState) => state.category.official),
    "computer-3": useSelector((state: RootState) => state.category.natural),
    "computer-4": useSelector((state: RootState) => state.category.computer),
    "home-4": useSelector((state: RootState) => state.category.computer),
    "home-7": useSelector((state: RootState) => state.category.avatar),
  };

  const [tabsData, setTabsData] = useState<IPcImgResult[]>([]);
  const [imgsData, setImgsData] = useState<TImgsTreeData[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(Number(activeTab));
  const [swiperHeight, setSwiperHeight] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string | undefined>(cid);
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [curCategoryPage, setCurCategoryPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showPage, setShowPage] = useState(false);
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [activeBlock, setActiveBlock] = useState<string>("");
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);

  const categoryTypeSwiperHeight = {
    "imgProperty-0": (imgLen: number) => imgLen * 190,
    "imgProperty-1": (imgLen: number) => Math.ceil(imgLen / 3) * 210,
    "imgProperty-2": (imgLen: number) =>
      Math.ceil(imgLen / 2) * (Math.ceil(navBarStyle.windowWidth / 2) - 10),
  };

  const [imgStyle, setImgStyle] = useState<{ width: string; height: string }>({
    width: "",
    height: "",
  });

  useShareAppMessage((res) => {
    let shareAppMessage = {};
    if (res.from === "button" || showPage) {
      // 来自页面内转发按钮
      shareAppMessage = {
        title: "给你一张非常nice的壁纸 ~",
        path: `/pages/${source}/index?viewBlock=${activeBlock}&imgProperty=${imgProperty}&activeTab=${currentTab}&viewType=${2}&source=category`,
      };
    } else {
      if (imgProperty === "1") {
        shareAppMessage = {
          title: "Zhua壁纸头像",
          path: `/pages/mobile/index?imgId=${imgId}&cid=${categoryId}&imgProperty=${imgProperty}&activeTab=${currentTab}&viewType=${viewType}&to=category&source=category`,
        };
      } else {
        shareAppMessage = {
          title: "Zhua壁纸头像",
          path: `/pages/${source}/index?viewBlock=${activeBlock}&imgProperty=${imgProperty}&activeTab=${currentTab}&viewType=${2}&source=category`,
        };
      }
    }
    return shareAppMessage;
  });

  useReachBottom(() => {
    const img = imgsData.find((i) => i.cid == Number(categoryId));
    if (img?.total === img?.children.length) {
      return;
    }
    setMoreLoading(true);
    getCategoryImage({
      imgProperty,
      cid: categoryId,
      page: Number(img?.page || 0) + 1,
      pageSize: categoryPageSize,
    }).then(({ data }) => {
      handleInitData(data, categoryId, 2);
      setMoreLoading(false);
    });
  });

  const toImgsDetail = (imgs: TDataSource[], index: number) => {
    const actionMap = {
      0: () => {
        setCurrentImg(index);
        setDetailsData(imgs);
        setShowPage(true);
      },
      1: () =>
        Taro.navigateTo({
          url: `/pages/details/index?imgId=${imgId}&cid=${categoryId}&imgProperty=${imgProperty}&activeTab=${index}&viewType=${viewType}&page=${curCategoryPage}&pageSize=${categoryPageSize}&source=category`,
        }),
      2: () => {
        const urls = imgs.map((img) => img.path);
        Taro.previewImage({
          current: imgs[index].path, // 当前显示图片的http链接
          urls: urls, // 需要预览的图片http链接列表
        });
      },
    };
    imgProperty && actionMap[imgProperty]();
  };

  const swiperChange = (e) => {
    const { current, currentItemId } = e.detail;
    const img = imgsData.find((i) => i.cid == Number(currentItemId));
    // Taro.pageScrollTo({ scrollTop: 0 });
    setCurrentTab(current);
    setCategoryId(currentItemId);
    const imgLen = img?.children.length || 0;
    if (imgLen > 0) {
      setHasMore(img?.children.length !== img?.total);
      // const swiperItemHeight = mobileCategory
      //   ? Math.ceil(imgLen / 3) * 210
      //   : imgLen * 190;
      const swiperItemHeight =
        categoryTypeSwiperHeight[`imgProperty-${imgProperty}`](imgLen);
      const residueHeight =
        navBarStyle.windowHeight - navBarStyle.totalHeight - 55 - 50;
      const heightResult =
        swiperItemHeight > residueHeight ? swiperItemHeight : residueHeight;
      setSwiperHeight(heightResult);
    } else {
      // setCurCategoryPage(0);
      setLoading(true);
      getCategoryImage({
        cid: currentItemId,
        imgProperty,
      }).then(({ data }) => {
        handleInitData(data, currentItemId, 1);
        setLoading(false);
      });
    }
  };

  const handleInitData = (
    data: { total: number; value: any[] },
    curCategoryId: any,
    actionKey: number // 0 init 1 swpier 2 modeLoading
  ) => {
    const { total, value } = data;
    const result = value.map((item) => {
      return {
        ...item,
        path: `${proxy}/${item.path}`,
        dPath: `${proxy}/${item.dPath}`,
      };
    });

    let imgDataTree: TImgsTreeData[] = [];
    let swiperItemHeight = 0;
    if (actionKey === 0) {
      console.log(`${source}-${mid}`);

      imgDataTree = arrCompositeTree(
        imgProperty === "1"
          ? tabsDataSource.mobile
          : tabsDataSource[`${source}-${mid}`],
        result,
        total
      );
      swiperItemHeight = categoryTypeSwiperHeight[`imgProperty-${imgProperty}`](
        value.length
      );
      setHasMore(value.length !== total);
    } else {
      imgDataTree = imgsData.map((i) => {
        const children = [...i.children];
        let dataTotal = i.total;
        let currentPage = i.page;
        if (i.cid == curCategoryId) {
          dataTotal = total;
          currentPage = actionKey === 1 ? i.page : i.page + 1;
          children.push(...result);
          swiperItemHeight = categoryTypeSwiperHeight[
            `imgProperty-${imgProperty}`
          ](children.length);
          setHasMore(children.length !== total);
          setCurCategoryPage(currentPage);
        }
        return {
          ...i,
          total: dataTotal,
          page: currentPage,
          children,
        };
      });
    }
    console.log("imgDataTree: ", imgDataTree);
    const residueHeight =
      navBarStyle.windowHeight - navBarStyle.totalHeight - 55 - 50;
    const heightResult =
      swiperItemHeight > residueHeight ? swiperItemHeight : residueHeight;
    setSwiperHeight(heightResult);
    setImgsData(imgDataTree);
  };

  useEffect(() => {
    setLoading(true);
    getCategoryImage({
      cid,
      imgProperty,
    }).then(({ data }) => {
      if (imgProperty === "1") {
        setTabsData(tabsDataSource[source || "mobile"]);
        setImgStyle({
          width: "calc(33.3% - 10px)",
          height: "200px",
        });
      } else {
        console.log("`${source}-${mid}`: ", `${source}-${mid}`);
        if (tabsDataSource[`${source}-${mid}`]) {
          setTabsData(tabsDataSource[`${source}-${mid}`]);
        } else {
          setTabsData([]);
        }
        if (imgProperty === "2") {
          setImgStyle({
            width: "calc(50% - 10px)",
            height: `${Math.ceil(navBarStyle.windowWidth / 2) - 20}px`,
          });
          setActiveBlock("avatar");
        } else {
          setImgStyle({
            width: "100%",
            height: "180px",
          });
          setActiveBlock("pc");
        }
      }
      handleInitData(data, cid, 0);
      setLoading(false);
    });
  }, []);

  return (
    <View className={styles["category"]}>
      <CustomNavBar backgroundColor="var(--background-color)" />
      <View
        className={classNames(styles["category-main"])}
        style={{ paddingTop: `${navBarStyle.totalHeight + 52}px` }}
      >
        {tabsData.length > 1 && (
          <SlideTabs
            dataSource={tabsData}
            activeTabKey={currentTab}
            changeTab={swiperChange}
          ></SlideTabs>
        )}

        <Swiper
          style={{
            height: `${swiperHeight}px`,
          }}
          className={styles["slide-content"]}
          current={currentTab}
          onChange={swiperChange}
          easing-function="easeOutCubic"
        >
          {imgsData.length &&
            imgsData.map((item) => {
              return (
                <SwiperItem
                  className={styles["swiper-item"]}
                  itemId={String(item.cid)}
                  key={item.cid}
                >
                  {loading && (
                    <Loading
                      containerStyle={{
                        height: `${
                          navBarStyle.windowHeight -
                          navBarStyle.totalHeight -
                          55
                        }px`,
                      }}
                    />
                  )}
                  {!loading && (
                    <>
                      <ImageCard
                        style={{ padding: "0px 9px" }}
                        imgStyle={imgStyle}
                        className="image-card"
                        dataSource={item.children}
                        viewType={1}
                        toImgsDetail={toImgsDetail}
                      />
                    </>
                  )}
                </SwiperItem>
              );
            })}
        </Swiper>
        {!loading && <Footer loading={moreLoading} hasMore={hasMore} />}
      </View>
      <PageContainer
        show={showPage}
        duration={500}
        position="center"
        onAfterLeave={() => {
          setCurrentImg(0);
          setShowPage(false);
          store.dispatch(setShowTabBar(true));
        }}
      >
        <ImageDetails
          dataSource={detailsData}
          scale
          currentImg={currentImg}
          showDetails={showPage}
          showDateTime={false}
          navigateBack={() => {
            setShowPage(false);
            store.dispatch(setShowTabBar(true));
          }}
        />
      </PageContainer>
    </View>
  );
};

export default Category;
