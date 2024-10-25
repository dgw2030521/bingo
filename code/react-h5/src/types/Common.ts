/**
 * 分页数据
 */
export interface PageData<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

/**
 * 对象响应
 */
export interface Response<T> {
  data: T;
  errorCode: string;
  errorDesc: string;
  errorType: string;
  exceptionType: string;
  success: boolean;
}
