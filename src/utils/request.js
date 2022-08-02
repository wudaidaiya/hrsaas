// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
// 引入messgae
import { Message } from 'element-ui'
const service = axios.create({
    // baseURL: 'http://localhost:8888/api',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
}) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器
service.interceptors.response.use((res) => {
    const { success,data,message } = res.data
    // 如果success成功则返回data
    if(success){
        return data
    }
    // success错误否则返回
    Message.error(message)
    return Promise.reject(new Error(message))
},
// 如果响应错误
function(error){
    Message.error('系统异常')
    return Promise.reject(error)
}
) // 响应拦截器
export default service // 导出axios实例
