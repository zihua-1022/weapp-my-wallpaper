/* 服务器返回数据的的类型，根据接口文档确定 */
export interface IResultData<T> {
  code: number;
  status: boolean;
  msg: string;
  data: T;
}

export interface IWeappLoginParams {
  APPID: string;
  AppSecret: string;
  JSCODE: string;
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ILoginResultModel {
  userId: string | number;
  token: string;
  data: {};
}

export interface IPageParams {
  page: number;
  pageSize: number;
}

export interface IPageResultModel<T> {
  items: T[];
  total: number;
}

export interface IImgResultModel {
  key?: string;
  id: number;
  name: string;
  desc?: string;
  type?: string;
  size?: number;
  resolution?: string;
  tags?: string;
  path: string;
  is_recommend: number;
  is_hot?: number;
  is_primary?: number;
  category_id?: number;
  children?: [];
  alt?: string;
  style?: {};
}
