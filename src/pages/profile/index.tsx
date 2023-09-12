import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import {
  View,
  Image,
  Text,
  Button,
  Input,
  PageContainer,
} from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard from "@components/ImageCard";
import UploadImage from "@components/UploadImage";
import AboutUs from "@components/AboutUs";
import Card from "@components/Card";
import store, { RootState } from "@store/index";
import { setCurrentTab, setShowTabBar } from "@store/tabBar";
import {
  weappLogin,
  weappLogout,
  updateUserNickName,
  uploadFile,
} from "@utils/weapp";

import { getImg } from "@assets/img";
import { getProfileImg } from "@assets/img/profile";

import styles from "./index.module.less";

export type TCardData = {
  id: number;
  key?: string;
  icon: string;
  content: string;
  rightIcon?: string;
  onClick?: () => void;
};

const Profile: React.FC = () => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const currentTab = useSelector((state: RootState) => state.tabBar.currentTab);
  const userInfo = useSelector((state: RootState) => state.profile);
  console.log("userInfo: ", userInfo);
  const defaultNickName = "ZHUA's 用户";
  // const [cardDataSource, setCardDataSource] = useState<TCardData[]>([]);
  const [nickName, setNickName] = useState<string>(userInfo.nickName);
  const [activeKey, setActiveKey] = useState<string>("");
  const [showPage, setShowPage] = useState<boolean>(false);

  useShareAppMessage((res) => {
    let shareAppMessage = {};
    if (res.from === "button" || showPage) {
      // 来自页面内转发按钮
      shareAppMessage = {
        title: "天青色等烟雨，而我在等你喔 ~",
        path: `/pages/home/index?viewType=1&page=0&pageSize=9&source=profile`,
      };
    } else {
      shareAppMessage = {
        title: "Zhua壁纸头像",
      };
    }
    return shareAppMessage;
  });

  const removeWeappUserInfo = () => {
    Taro.showModal({
      // title: '提示',
      content: "确定退出登录吗？",
      success: function (res) {
        if (res.confirm) {
          weappLogout();
          // Taro.reLaunch({
          //   url: "/pages/profile/index", // tabBar 页面的路径
          // });
          // 用户点击了确定按钮
          // 执行退出操作
        } else if (res.cancel) {
          console.log("用户点击了取消按钮");
          // 用户点击了取消按钮
          // 可选择执行其他操作或不做任何处理
        }
      },
    });
  };

  const getWeappUserInfo = (e: { detail: { avatarUrl: string } }) => {
    const { avatarUrl } = e.detail;
    // TODO: 登录时需要保存用户的头像和昵称
    // uploadFile(
    //   [
    //     {
    //       id: 1,
    //       url: avatarUrl,
    //     },
    //   ],
    //   {}
    // ).then((res) => {
    // console.log("re----------s: ", res);
    weappLogin({ nickName: defaultNickName, avatarUrl, gender: 0 });
    setNickName(defaultNickName);
    // });
  };

  const updateWeappUserInfo = (e: {
    detail: { pass: boolean; timeout: boolean };
  }) => {
    const { pass, timeout } = e.detail;
    if (pass) {
      Taro.createSelectorQuery()
        .select("#input-nickname")
        .fields({ properties: ["value"] })
        .exec((res) => {
          const inputValue = res[0]?.value; // 获取 input 节点的值
          if (inputValue === defaultNickName) {
            return;
          }
          setNickName(inputValue);
          updateUserNickName(inputValue);
        });
    }
  };

  const toProfileDetails = () => {
    Taro.showToast({
      title: "敬请期待！",
      icon: "none",
    });
  };

  const uploadImageClick = () => {
    if (userInfo.userId) {
      store.dispatch(setShowTabBar(false));
      setActiveKey("uploadImage");
      setShowPage(true);
    } else {
      Taro.showToast({
        title: "请先登录喔 ~",
        icon: "error",
      });
    }
  };

  const contactClick = () => {
    Taro.showToast({
      title: "1084191823@qq.com",
      icon: "none",
      duration: 3500,
    });
  };

  const aboutUsClick = () => {
    store.dispatch(setShowTabBar(false));
    setActiveKey("aboutUs");
    setShowPage(true);
  };

  const imgsListData = [
    {
      id: 1,
      imgName: "zihua",
      imgColor: "#3b504e",
      operationTitle: "订阅壁纸推送",
      operationDesc: "获取每周最新壁纸通知",
      operate: "立即查看",
      isHot: 0,
      imgProperty: 0,
      isPrimary: 1,
      isRecommend: 1,
      path: getProfileImg("subscribe"),
    },
  ];

  const cardDataSource = [
    // {
    //   id: 2,
    //   icon: "success_no_circle",
    //   content: "领取花花",
    // },
    // {
    //   id: 3,
    //   icon: "success",
    //   content: "获取花花",
    // },
    {
      id: 3,
      icon: getProfileImg("download"),
      content: "我的下载",
      onClick: toProfileDetails,
    },
    {
      id: 4,
      icon: getProfileImg("upload"),
      content: "上传图片",
      // onClick: toProfileDetails,
      onClick: uploadImageClick,
    },
    {
      id: 5,
      icon: getProfileImg("contact"),
      content: "联系我们",
      onClick: contactClick,
    },
  ];

  useEffect(() => {
    if (currentTab !== 3) {
      store.dispatch(setCurrentTab(3));
    }
  }, []);

  return (
    <View className={styles["profile"]}>
      <CustomNavBar isShowLogo={false} />
      <View
        className="app-main"
        style={{
          paddingTop: `${navBarStyle.totalHeight}px`,
          paddingBottom: "0px",
        }}
      >
        <View className={styles["profile-header"]}>
          <View className={styles["header-left"]}>
            {!userInfo.userId && (
              <Button
                className={styles["avatar-wrapper"]}
                openType="chooseAvatar"
                onChooseAvatar={getWeappUserInfo}
              >
                <Image
                  className={styles["avatar"]}
                  src={userInfo.avatar || ""}
                ></Image>
                <Text className={styles["nickname"]}>点击登录</Text>
              </Button>
            )}
            {userInfo.userId && (
              <>
                <Image
                  className={styles["avatar"]}
                  src={userInfo.avatar || ""}
                ></Image>
                <Input
                  id="input-nickname"
                  type="nickname"
                  className={styles["input-nickname"]}
                  value={nickName}
                  disabled={userInfo.nickName === "ZHUA's 用户" ? false : true}
                  onNickNameReview={updateWeappUserInfo}
                />
              </>
            )}
          </View>
          {/* {userInfo.userId && (
            <View className={styles["header-right"]} onClick={toProfileDetails}>
              <Text className={styles["desc"]}>我的收藏</Text>
              <AtIcon
                // className={styles["icon"]}
                value="chevron-right"
                size="18"
                // color="#8a2be2"
              ></AtIcon>
            </View>
          )} */}
        </View>
        <View className={styles["profile-main"]}>
          <ImageCard
            dataSource={imgsListData}
            imgStyle={{
              width: "100%",
              height: "150px",
            }}
            viewType={0}
            toDetails={toProfileDetails}
          />
          {/* <Card className={styles["integral"]}>
            <Image className={styles["image"]} src={Logo}></Image>
            <View className={styles["desc"]}>当前可用花花</View>
          </Card> 
         {cardDataSource.length > 0 && ( */}
          <View className={styles["action"]}>
            <View className={styles["action-card"]}>
              <Button className={styles["button-invite"]} open-type="share">
                <Image
                  className={styles["icon"]}
                  src={getProfileImg("invite")}
                  mode="aspectFit"
                ></Image>
                <View className={styles["text"]}>邀请好友</View>
              </Button>
            </View>
            {cardDataSource.map((item) => {
              return (
                <Card key={item.id} className={styles["action-card"]}>
                  <View
                    className={styles["card-content"]}
                    onClick={item.onClick}
                  >
                    <Image
                      className={styles["icon"]}
                      src={item.icon}
                      mode="aspectFit"
                    ></Image>
                    <View className={styles["desc"]}>{item.content}</View>
                  </View>
                </Card>
              );
            })}
            <View className={styles["action-card"]}>
              <View className={styles["about-us"]} onClick={aboutUsClick}>
                <Image
                  className={styles["logo"]}
                  src={getImg("logo")}
                  mode="aspectFit"
                ></Image>
                <View className={styles["desc"]}>关于我们</View>
              </View>
            </View>
          </View>
        </View>
        {userInfo.userId && (
          <View
            className={styles["profile-footer"]}
            onClick={removeWeappUserInfo}
          >
            退出登录
          </View>
        )}
      </View>
      <PageContainer
        show={showPage}
        duration={500}
        position="right"
        onAfterLeave={() => {
          setShowPage(false);
          store.dispatch(setShowTabBar(true));
          // setDetailsData([])
        }}
        onBeforeLeave={(e) => {
          console.log(e);
        }}
      >
        {activeKey === "uploadImage" && (
          <UploadImage userId={userInfo.userId} />
        )}
        {activeKey === "aboutUs" && <AboutUs />}
        {/* <ImageDetails
              dataSource={detailsData}
              imgMode={detailImageMode}
              currentImg={currentImg}
              showDetails={showPage}
              scroll={isScroll}
              navigateBack={() => {
                setShowPage(false);
                store.dispatch(setShowTabBar(true));
                // Taro.pageScrollTo({ scrollTop: 0 });
              }}
              onChange={detailSwiperChange}
            /> */}
      </PageContainer>
    </View>
  );
};

export default Profile;
