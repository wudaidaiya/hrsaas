import { login } from "@/api/user"

export default {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
     // 登陆页面
    setToken(state,payload) {
      state.token = payload
    }
  },
  actions: {
    // 登陆页面
    async getToken(context,payload) {
    const res = await login(payload)
    console.log(res)
    context.commit('setToken',res)
    }
  }
}
