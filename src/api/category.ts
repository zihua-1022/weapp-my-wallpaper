import { useState, ChangeEventHandler } from "react";
import Taro from "@tarojs/taro";
import service, { request } from "@services/index";
import { IPageResult } from "./model/baseModel";
import { ICategoryResult } from "./model/categoryModel";
import { IPcImgResult } from "./model/computerModel";

export const getCategoryImage = async (params: {
  // isPrimary: number;
  cid?: string;
  imgProperty?: number | string;
  page?: number;
  pageSize?: number;
}) => {
  return request<IPageResult<IPcImgResult>>({
    url: `weapp/v1/category/image`,
    method: "get",
    params: params,
  });
};

export const getCategoryTabs = async (params: {
  mid?: number | string;
  imgProperty: number;
}) => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/category/image-tabs",
    method: "get",
    params,
  });
};

export const getSingleCategory = async (params: { mid: number }) => {
  return request<ICategoryResult[]>({
    url: `weapp/v1/category/single/${params.mid}`,
    method: "get",
  });
};

export const getAllCategory = async () => {
  return request<ICategoryResult[]>({
    url: "weapp/v1/category/all",
    method: "get",
  });
};
