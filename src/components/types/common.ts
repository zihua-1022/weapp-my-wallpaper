export interface IimgProps {
  id: number;
  path: string;
  alt?: string;
}

export interface IswiperProps {
  dataSource: IimgProps[];
  style?: {};
}
