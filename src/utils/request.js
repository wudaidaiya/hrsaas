// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import { Message } from 'element-ui'
import axios from 'axios'
import store from '@/store'
import { getTokenTime } from '@/utils/auth'
import router from '@/router'

//   baseURL: 'http://localhost:8888/api',
function timeOut() {
  const currentTime = Date.now()
  const tokenTime = getTokenTime()
  const timeout = 2 * 60 * 60 * 1000
  // const timeout = 2 * 1000
  return currentTime - tokenTime > timeout
}
const service = axios.create({
  // 开发环境代理是**`/api`**，`npm run dev` 读取env.development
  // 生产环境, `npm run build` 读取env.production
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例

// 请求拦截器
service.interceptors.request.use(async (config) => {
  // 当前请求的配置
  if (store.state.user.token) {
    // console.log(currentTime - tokenTime)
    // 如果请求超时 timeOut()
    if (timeOut()) {
      console.log('跳转登陆页')
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登陆过期'))
    } else {
      config.headers.Authorization = 'Bearer ' + store.state.user.token
    }
  }
  return config
}) // 请求拦截器

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const { success, data, message } = res.data
    if (success) {
      return data
    }
    Message.error(message)
    return Promise.reject(new Error(message))
  },
  // 地址和请求错误的回调
  async (error) => {
    // ⭐️
    if (error?.response?.stauts === 401) {
      Message.error('登陆过期')
      await store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    // console.dir(error)
    return Promise.reject(error)
  }
) // 响应拦截器
export default service // 导出axios实例
