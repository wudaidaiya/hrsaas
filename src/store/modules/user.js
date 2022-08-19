import { getUserInfoApi, getUserDetail, login } from '@/api/user'
import { setTokenTime } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    //获取token
    setToken(state, payload) {
      state.token = payload
    },
    // 获取用户信息
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    //获取token
    async getToken(context, payload) {
      const res = await login(payload)
      context.commit('setToken', res)
      setTokenTime()
    },
    // 获取用户信息
    async getUserInfo(context) {
      const userBaseInfo = await getUserInfoApi()
      console.log(userBaseInfo)
      const userInfo = await getUserDetail(userBaseInfo.userId)
      // console.log(userInfo)
      context.commit('setUserInfo', { ...userInfo, ...userBaseInfo })
      console.log({ ...userInfo, ...userBaseInfo })
    },
    // 获取详细的用户信息

    // logout 退出方法
    logout(context) {
      context.commit('setToken', '')
      context.commit('setUserInfo', {})
    }
  }
}
// 其中app.js模块和settings.js模块，功能已经完备，不需要再进行修改。 user.js模块是我们后期需要重点开发的内容，所以这里我们将user.js里面的内容删除，并且导出一个默认配置
