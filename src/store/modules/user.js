import { getUserInfoApi,login,getUserDetail } from "@/api/user";
import { setTokenTime } from "@/utils/auth";

export default {
  namespaced: true,
  state: {
    token: "",
    userInfo: {}, // 用户信息
  },
  mutations: {
    // 登陆页面
    setToken(state, payload) {
      state.token = payload;
    },
    // 获取用户详细信息
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
  },
  actions: {
    // 登陆页面
    async getToken(context, payload) {
      const res = await login(payload);
      console.log(res);
      context.commit("setToken", res);
      setTokenTime()
    },
    // 获取用户详细信息
   async getuserInfo(context) {
    // 第一个请求 接口 获取用户基本资料
    const userBaseInfo = await getUserInfoApi()
    // 第二个请求 接口 获取员工基本信息
    const userInfo = await getUserDetail(userBaseInfo.userId)
    // 结构 放在一起
    context.commit('setUserInfo',{...userBaseInfo,...userInfo})
    },
    // 退出
    logout(context) {
      // 点击清空
      context.commit('setToken','')
      context.commit('setUserInfo',{})
    }
  },
};
