export interface IGetUserInfoParams {
  id: string | number;
  data?: {};
}

/**
 * @description: Get user information return value
 */
export interface IGetUserInfoModel {
  // roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户昵称
  nickname: string;
  // 真实名字
  username: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
