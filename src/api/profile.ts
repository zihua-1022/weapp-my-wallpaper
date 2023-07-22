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

export const uploadFile = (params: IFileParams[]) => {
  console.log("params: ", params);
  return request<IGetUserInfoModel>({
    url: `weapp/v1/account/uplaod-file`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: params,
    // option: 1,
  });
};
