// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTokenTime } from './auth'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
}) // 创建一个axios的实例

const isTimeout = () => {
  // 每次请求的时间戳
  const currentTime = Date.now()
  // 获取token时的时间戳
  const tokenTime = getTokenTime()
  const time = 2 * 60 * 60 * 1000
  return currentTime - tokenTime > time
}

service.interceptors.request.use(async (config) => {
  if (!store.state.user.token) return config

  if (isTimeout()) {
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(new Error('登录过期'))
  } else {
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }

  return config
}) // 请求拦截器
service.interceptors.response.use(
  (res) => {
    // console.log(res)
    const { success, data, message } = res.data
    if (success) {
      return data
    }
    Message.error(message)
    return Promise.reject(new Error(message))
  },
  async (err) => {
    // 响应错误的判断----若后端返回的token错误---删除token  重新登录
    if (err?.response?.status === 401) {
      Message.error('登录过期')
      await store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(err.message)
    }
    return Promise.reject(err)
  }
) // 响应拦截器
export default service // 导出axios实例
