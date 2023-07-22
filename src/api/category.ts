import { useState, ChangeEventHandler } from "react";
import Taro from "@tarojs/taro";
import service, { request } from "@services/index";
import { IPcImgResult } from "./model/computerModel";

export const getCategoryImage = async (params: {
  isPrimary: number;
  isPhone?: number | string;
  cid?: string;
}) => {
  return request<IPcImgResult[]>({
    url: `weapp/v1/category/image`,
    method: "get",
    params: params,
  });
};

export const getCategoryTabs = async () => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/category/image-tabs",
    method: "get",
  });
};

export const getAllCategory = async () => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/category/all",
    method: "get",
  });
};