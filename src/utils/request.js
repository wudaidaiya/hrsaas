// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from "axios";
// 引入messgae
import { Message } from "element-ui";
import {getTokenTime} from "@/utils/auth";
import router from "@/router/index"
import store from "@/store";
const timeout = function () {
    // 当前时间戳
    const currentTime = Date.now();
    // 存token的时间错
    const tokenTime = getTokenTime();
    const itmeout = 2*60*60*1000;
   return currentTime - tokenTime > itmeout
}
const service = axios.create({
  // baseURL: 'http://localhost:8888/api',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
}); // 创建一个axios的实例
service.interceptors.request.use(async (config) => {
  // 判断token是否存在
  if (store.state.user.token) {
    // 判断token是否过期 过期跳到登录页
    if (timeout()) {
        await store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('登陆过期'))
    } else {
      // 配置请求头
      config.headers.Authorization = "Bearer " + store.state.user.token;
    }
  }
  return config;
}); // 请求拦截器
service.interceptors.response.use(
  (res) => {
    const { success, data, message } = res.data;
    // 如果success成功则返回data
    if (success) {
      return data;
    }
    // success错误否则返回
    Message.error(message);
    return Promise.reject(new Error(message));
  },
  // 如果响应错误
  async function (error) {
    if(error?.response?.status === 401){
        Message.error('登陆过期')
        await store.dispatch('user/logout')
        router.push('/login')
    }else{
        Message.error(error.message)
    }
    return Promise.reject(error);
  }
); // 响应拦截器
export default service; // 导出axios实例
