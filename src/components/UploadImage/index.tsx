import React, { PropsWithChildren, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Taro from "@tarojs/taro";
import {
  AtInput,
  AtTextarea,
  AtTag,
  AtImagePicker,
  AtList,
  AtListItem,
} from "taro-ui";
import {
  View,
  Button,
  Label,
  Text,
  Image,
  Radio,
  RadioGroup,
} from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import Select from "@components/Select";
import { RootState } from "@store/index";
import BigFileUpload from "@utils/sparkUpload";
import { IBaseImgResult, IImgInfoParams } from "@/api/model/baseModel";
import { ICategoryResult } from "@/api/model/categoryModel";
import { getSingleCategory, getAllCategory } from "@/api/category";
import { uploadFileData } from "@/api/profile";
import { serverMap } from "@services/config";

import styles from "./index.module.less";

export type TFile = {
  // id?: string | number;
  url: string;
  type?: string;
  file?: {
    path: string;
    size: number;
  };
  chunkFilename?: string;
};

export type TUploadImageProps = {
  userId: string;
  length?: number;
  containerStyle?: {};
};

export type TRadioProps = {
  name: string;
  value: string;
  checked: boolean;
};

const proxy = serverMap[process.env.NODE_ENV || "default"]["weapp"];

const UploadImage: React.FC<TUploadImageProps & PropsWithChildren> = ({
  userId,
  length = 3,
  containerStyle,
  children,
}) => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [files, setFiles] = useState<TFile[]>([]);
  const [imgDesc, setImgDesc] = useState<string>("");
  const [imgTags, setImgTags] = useState<string>("");
  const [imageTypes, setImageTypes] = useState<TRadioProps[]>([
    { name: "手机壁纸", value: "1", checked: true },
    { name: "电脑壁纸", value: "0", checked: false },
    { name: "头像", value: "2", checked: false },
  ]);
  const [imageRecommend, setImageRecommend] = useState<TRadioProps[]>([
    { name: "否", value: "0", checked: true },
    { name: "是", value: "1", checked: false },
  ]);
  const [imageHot, setImageHot] = useState<TRadioProps[]>([
    { name: "否", value: "0", checked: true },
    { name: "是", value: "1", checked: false },
  ]);
  const [imageCover, setImageCover] = useState<TRadioProps[]>([
    { name: "否", value: "0", checked: true },
    { name: "是", value: "1", checked: false },
  ]);
  const [categoryOptions, setCategoryOptions] = useState<ICategoryResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<ICategoryResult>({});

  const onRadioChange = (checkedValue: string, data: TRadioProps[]) => {
    return data.map((item) => {
      let checked = false;
      if (item.value === checkedValue) {
        checked = true;
      } else {
        checked = false;
      }
      return {
        ...item,
        checked,
      };
    });
  };

  const imageTypesRadioChange = (e) => {
    const checkedValue = e.detail.value;
    if (checkedValue == 2) {
      getSingleCategoryData();
    } else {
      getAllCategoryData();
    }
    console.log("checkedValue: ", checkedValue);
    const res = onRadioChange(checkedValue, imageTypes);
    console.log("res: ", res);
    setImageTypes(res);
  };

  const imageRecommendRadioChange = (e) => {
    const checkedValue = e.detail.value;
    const res = onRadioChange(checkedValue, imageRecommend);
    setImageRecommend(res);
  };

  const imageHotRadioChange = (e) => {
    const checkedValue = e.detail.value;
    const res = onRadioChange(checkedValue, imageHot);
    setImageHot(res);
  };

  const imageCoverRadioChange = (e) => {
    const checkedValue = e.detail.value;
    const res = onRadioChange(checkedValue, imageCover);
    setImageCover(res);
  };

  const onFail = (mes) => {
    console.log(mes);
  };
  const onImageClick = (index: number, file: { url: string }) => {
    Taro.previewImage({
      // current: file.url, // 当前显示图片的http链接
      urls: [file.url], // 需要预览的图片http链接列表
    });
  };

  const onChooseImage = (images: TFile[]) => {
    // const diffResult = getArrayDifference<TFile>(res, files);
    // console.log("diffResult: ", diffResult);
    // const handleRes = objArrayDuplicate(res as []);
    // console.log("handleRes: ", handleRes);

    // const imagesRes = await handleImagesInfo();
    // console.log("imagesInfo: ", imagesRes);
    setFiles(images);
  };

  const getFormData = (
    imgs: {
      url: string;
      imgSize: number;
      dSize: number;
      path: string;
      dPath: string;
    }[]
  ): Promise<IImgInfoParams[]> => {
    const imgProperty = imageTypes.find((item) => item.checked)?.value;
    const isRecommend = imageRecommend.find((item) => item.checked)?.value;
    const isHot = imageHot.find((item) => item.checked)?.value;
    const isPrimary = imageCover.find((item) => item.checked)?.value;
    const cid = selectedOption.cid;
    const imagesInfo: IImgInfoParams[] = [];
    return new Promise((resolve, reject) => {
      imgs.forEach((item) => {
        const { url, path, dPath, imgSize, dSize } = item;
        Taro.getImageInfo({
          src: url,
          success(res) {
            const { type, width, height } = res;
            const info = {
              path,
              dPath,
              // imgName: "无",
              // imgDesc: "无",
              // imgColor: "#0f0f0f",
              // imgTags: "无",
              imgSize,
              dSize,
              imgType: `image/${type}`,
              imgResolution: `${width}*${height}`,
              imgProperty,
              isRecommend: isRecommend,
              isPrimary: isPrimary,
              isHot: isHot,
              userId,
              cid,
            };
            imagesInfo.push(info);
            if (imgs.length === imagesInfo.length) {
              resolve(imagesInfo);
            }
          },
          fail(err) {
            reject(err);
          },
        });
      });
    });
  };

  const uploadImages = () => {
    if (files.length > 0) {
      Taro.showModal({
        title: "特别注意：图片类型和所属分类",
        content: "请确保图片相关信息填写正确后，再进行提交喔。",
        success: function (res) {
          if (res.confirm) {
            Taro.showLoading();
            const uploadRes: boolean[] = [];
            const alreadyFileList: {
              url: string;
              imgSize: number;
              dSize: number;
              path: string;
              dPath: string;
            }[] = [];
            const imageType = imageTypes.filter((item) => item.checked)[0]
              .value;
            files.forEach((item) => {
              const { url } = item;
              const bigFileUpload = new BigFileUpload({
                path: url,
                uploadUrl: `${proxy}/v1/upload/file-cdn`,
                enableOss: true,
                dirFlag: imageType,
                imgCategory: selectedOption.cid,
                callback: (result: {
                  code: number;
                  data: {
                    hash: string;
                    dHash: string;
                    path: string;
                    dPath: string;
                    imgSize: number;
                    dSize: number;
                  };
                  msg: string;
                  status: boolean;
                }) => {
                  const { status, msg, code, data } = result;
                  const { path, dPath, imgSize, dSize } = data;
                  uploadRes.push(status);
                  if (status && code === 200) {
                    alreadyFileList.push({
                      url,
                      imgSize,
                      dSize,
                      path,
                      dPath,
                    });
                  }
                  if (uploadRes.length === files.length) {
                    // 返回上传失败的图片数量
                    const uR = uploadRes.filter((i) => !i);
                    if (uR.length > 0) {
                      Taro.hideLoading();
                      Taro.showToast({
                        title: "上传失败",
                        icon: "error",
                      });
                      console.error(msg);
                    } else if (alreadyFileList.length > 0) {
                      getFormData(alreadyFileList).then((filesData) => {
                        filesData.forEach((f) => {
                          uploadFileData(f);
                        });
                        Taro.hideLoading();
                        Taro.showToast({
                          title: "上传成功",
                          icon: "success",
                        });
                        setFiles([]);
                      });
                    } else {
                      Taro.hideLoading();
                      Taro.showToast({
                        title: "上传成功",
                        icon: "success",
                      });
                      setFiles([]);
                    }
                  }
                },
              });
              bigFileUpload.startUpload();
            });
          } else if (res.cancel) {
          }
        },
      });
    }
  };

  const getSingleCategoryData = () => {
    getSingleCategory({ mid: 7 })
      .then((res) => {
        setCategoryOptions(res.data);
        setSelectedOption(res.data[2]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAllCategoryData = () => {
    getAllCategory()
      .then((res) => {
        setCategoryOptions(res.data);
        setSelectedOption(res.data[13]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllCategoryData();
  }, []);

  return (
    <View style={containerStyle} className={styles["upload-image"]}>
      <CustomNavBar isShowLogo={false} titleText="图片上传" />
      <View
        className={styles["upload-image-main"]}
        style={{ paddingTop: `${navBarStyle.totalHeight}px` }}
      >
        {/* <View className={styles["upload-image-container"]}>
          <View className={styles.flex}>
            {files.length > 0 &&
              files.map((item) => {
                return (
                  <View className={styles["flex-item"]} key={item.id}>
                    <View className={styles["close-btn"]}></View>
                    <Image src={item.path} mode="aspectFit"></Image>
                  </View>
                );
              })}
            <View
              className={`${styles["flex-item"]} ${styles["add-bar"]}`}
              onClick={onChooseFile}
            >
              <View className={styles.image}></View>
              <View className={styles.image}></View>
            </View>
          </View>
        </View> */}
        <AtImagePicker
          multiple
          length={3}
          files={files}
          onChange={onChooseImage}
          onFail={onFail}
          onImageClick={onImageClick}
        />
        <View className={styles["image-infor-form"]}>
          <View className={styles.title}>图片类型</View>
          <RadioGroup
            className={styles["radio-group"]}
            onChange={imageTypesRadioChange}
          >
            {imageTypes.length > 0 &&
              imageTypes.map((item) => {
                return (
                  <View className={styles["radio-box"]} key={item.name}>
                    <Radio
                      id={item.name}
                      value={item.value}
                      checked={item.checked}
                    ></Radio>
                    <Label className="label-2-text" for={item.name}>
                      <Text>{item.name}</Text>
                    </Label>
                  </View>
                );
              })}
          </RadioGroup>
          <Select
            options={categoryOptions}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <View className={styles.title}>是否为推荐图片（即每日一图）</View>
          <RadioGroup
            className={styles["radio-group"]}
            onChange={imageRecommendRadioChange}
          >
            {imageRecommend.length > 0 &&
              imageRecommend.map((item) => {
                return (
                  <View className={styles["radio-box"]} key={item.name}>
                    <Radio
                      id={item.name}
                      value={item.value}
                      checked={item.checked}
                    ></Radio>
                    <Label className="label-2-text" for={item.name}>
                      <Text>{item.name}</Text>
                    </Label>
                  </View>
                );
              })}
          </RadioGroup>
          <View className={styles.title}>是否为热门图片</View>
          <RadioGroup
            className={styles["radio-group"]}
            onChange={imageHotRadioChange}
          >
            {imageHot.length > 0 &&
              imageHot.map((item) => {
                return (
                  <View className={styles["radio-box"]} key={item.name}>
                    <Radio
                      id={item.name}
                      value={item.value}
                      checked={item.checked}
                    ></Radio>
                    <Label className="label-2-text" for={item.name}>
                      <Text>{item.name}</Text>
                    </Label>
                  </View>
                );
              })}
          </RadioGroup>
          <View className={styles.title}>是否为封面图片</View>
          <RadioGroup
            className={styles["radio-group"]}
            onChange={imageCoverRadioChange}
          >
            {imageCover.length > 0 &&
              imageCover.map((item) => {
                return (
                  <View className={styles["radio-box"]} key={item.name}>
                    <Radio
                      disabled
                      id={item.name}
                      value={item.value}
                      checked={item.checked}
                    ></Radio>
                    <Label className="label-2-text" for={item.name}>
                      <Text>{item.name}</Text>
                    </Label>
                  </View>
                );
              })}
          </RadioGroup>
          <Button className={styles["submit-button"]} onClick={uploadImages}>
            提交
          </Button>
        </View>
      </View>

      {/* <AtList>
        <AtListItem title="图片类别" arrow="right" />
        <AtListItem
          title="今日推荐"
          // isSwitch
          // onSwitchChange={onMobileChange}
        />
        <AtListItem
          title="今日热门"
          // isSwitch
          // onSwitchChange={onMobileChange}
        />
        <AtListItem
          title="主要展示图"
          // isSwitch
          // onSwitchChange={onMobileChange}
        />
        <AtListItem title="手机壁纸" isSwitch onSwitchChange={onMobileChange} />
      </AtList> */}
    </View>
  );
};
export default UploadImage;
