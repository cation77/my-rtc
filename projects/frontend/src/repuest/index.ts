import axios, { AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import storage from '@/utils/storage'
import type { ResponseResult } from './types'

const errorMsg = '服务异常，请稍后再试'

const request = axios.create({
  baseURL: '/api',
  timeout: 60000, // 超时
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true, // 异步请求携带cookie
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 请求拦截
request.interceptors.request.use(
  (config) => {
    const token = storage.get('accessToken')
    if (token) {
      config.headers.set('X-Access-Token', token)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (!res) {
      message.error(errorMsg)
      return Promise.reject(errorMsg)
    }
    return response
  },
  (error) => {
    // if (error.response && error?.response?.status === 401) {
    // 401，token失效重定向登录页
    // message.error('登录已过期，请重新登录');
    // }
    // if (error.response && error.response.status === 403) {
    //   router.push('/403');
    // } else {
    //   message.error(error.message || errorMsg);
    // }
    message.warning(error.message || errorMsg)
    return Promise.reject(error.message)
  }
)

export const get = <R = ResponseResult>(
  url: string,
  options: any = {}
): Promise<R> => {
  return request.get(url, options)
}

export const post = <R = ResponseResult>(
  url: string,
  data: any = {},
  options: any = {}
): Promise<R> => {
  return request.post(url, data, options)
}

export default request
