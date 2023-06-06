import { request } from "@services/index";
import { IBaseImgResult } from "./model/baseModel";

export const getDailyRecommend = async () => {
  return request<IBaseImgResult[]>({
    url: "weapp/v1/home/image-recommend",
    method: "get",
  });
};

export const getDailyPopular = async () => {
  return request<IBaseImgResult[]>({
    url: "weapp/v1/home/image-popular",
    method: "get",
  });
};
