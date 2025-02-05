export interface ResponseResult {
  code: number;
  result: any;
  message: any;
  [x: string | symbol]: any;
}

export type ITabOption = {
  id: number | string;
  label: string;
};
