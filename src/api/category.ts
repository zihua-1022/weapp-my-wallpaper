import { useState, ChangeEventHandler } from "react";
import Taro from "@tarojs/taro";
import service, { request } from "@services/index";
import { IImgResultModel } from "./model/baseModel";

export const getCategoryImage = async () => {
  return request<IImgResultModel[]>({
    url: "weapp/category/image",
    method: "get",
  });
};

export const getCategoryTabs = async () => {
  return request<IImgResultModel[]>({
    url: "weapp/category/image-tabs",
    method: "get",
  });
};
