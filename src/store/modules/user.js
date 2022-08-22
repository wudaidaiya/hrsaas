import { login, getUserInfo, getUserDetail } from '@/api/user'
import { setTokenTime } from '@/utils/auth'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    // 赋值token
    setToken(state, payload) {
      state.token = payload
    },
    // 设置用户信息
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    // 发请求获取token
    async getToken({ commit }, payload) {
      const res = await login(payload)
      commit('setToken', res)
      setTokenTime()
    },
    // 获取用户信息请求
    async getUserInfo({ commit }) {
      // 根据基本信息返回的用户id  请求详细信息
      const userBaseInfo = await getUserInfo()
      const userInfo = await getUserDetail(userBaseInfo.userId)
      commit('setUserInfo', { ...userBaseInfo, ...userInfo })
      return userBaseInfo
    },
    logout(context) {
      context.commit('setToken', '')
      context.commit('setUserInfo', {})
      resetRouter()
      context.commit('permission/setRoutes', [], { root: true }) 
    }
  }
}
