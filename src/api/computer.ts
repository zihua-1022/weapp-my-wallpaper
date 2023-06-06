import { request } from "@services/index";
import { IPcImgResult } from "./model/computerModel";

export const getImageRecommend = async () => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/computer/image-recommend",
    method: "get",
  });
};

export const getImages = async (params: {}) => {
  return request<IPcImgResult[]>({
    url: "weapp/v1/computer/images",
    method: "get",
    params: params,
  });
};
