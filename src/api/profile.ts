import request from "@services/index";
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
