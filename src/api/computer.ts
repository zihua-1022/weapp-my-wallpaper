import { request } from "@services/index";
import { IPcImgResult } from "./model/computerModel";

export const getImageRecommend = async (params: {
  isPrimary: number;
  imgProperty: number;
}) => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/computer/image-recommend",
    method: "get",
    params: params,
  });
};

export const getImages = async (params: {}) => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/computer/images",
    method: "get",
    params: params,
  });
};

export const getCategoryTabs = async (params: {
  mid: number | string;
  imgProperty: number;
}) => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/computer/image-tabs",
    method: "get",
    params,
  });
};
