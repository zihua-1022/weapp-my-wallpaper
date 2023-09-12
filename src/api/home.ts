import { request } from "@services/index";
import { IPageResult, IBaseImgResult } from "./model/baseModel";

export const getImageCategory = async (params: {
  mid: number | string;
  imgProperty?: number;
}) => {
  return request<IPageResult<IBaseImgResult>>({
    url: "weapp/v1/home/image-category",
    method: "get",
    params,
  });
};

export const getDailyRecommend = async (params: {
  page?: number;
  pageSize?: number;
}) => {
  return request<IPageResult<IBaseImgResult>>({
    url: "weapp/v1/home/image-recommend",
    method: "get",
    params,
  });
};

export const getDailyPopular = async () => {
  return request<IBaseImgResult[]>({
    url: "weapp/v1/home/image-popular",
    method: "get",
  });
};
