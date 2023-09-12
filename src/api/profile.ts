import service, { request } from "@services/index";
import { IFileParams } from "./model/baseModel";
import { IGetUserInfoParams, IGetUserInfoModel } from "./model/profileModel";

/**
 * @description: getUserInfo
 */
export const getUserInfo = (params: IGetUserInfoParams) => {
  console.log("params: ", params);
  const { id } = params;
  return request<IGetUserInfoModel>({
    url: `weapp/account/user-info/${id}`,
    method: "get",
    data: { id },
    // option: 1,
  });
};

export const uploadFileData = (params: any) => {
  return request<IGetUserInfoModel>({
    url: `weapp/v1/upload/file-data`,
    method: "post",
    data: params,
    // option: 1,
  });
};

export const uploadChunkFile = (params: any) => {
  return request<IGetUserInfoModel>({
    url: `weapp/v1/upload/chunk-file`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
    // option: 1,
  });
};

export const mergeUploadFile = (params: {
  hash: string;
  totalCount: number;
  imageType?: string;
}) => {
  return request<IGetUserInfoModel>({
    url: `weapp/v1/upload/merge-file`,
    method: "post",
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded",
    // },
    data: params,
    // option: 1,
  });
};
