import { useState, ChangeEventHandler } from "react";
import Taro from "@tarojs/taro";
import Swiper, { IImgProps } from "@components/Swiper";
import service, { request } from "@services/index";
import {
  IWeappLoginParams,
  ILoginResultModel,
  IResultData,
} from "./model/baseModel";

export const getDailyRecommend = async () => {
  return request<IImgProps[]>({
    url: "weapp/home/image-recommend",
    method: "get",
  });
};

export const getDailyPopular = async () => {
  return request<IImgProps[]>({
    url: "weapp/home/image-popular",
    method: "get",
  });
};
