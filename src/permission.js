import router from "@/router";
import store from "@/store";
// 路由（全局）前置守卫
// 会在所有路由进入之前触发
// to: 去哪里的路由信息
// from：来自哪个路由的信息
// next：是否进入
const whiteList = ["/login", "/404"];
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token;
  if (token) {
    // 如果存在就不再次发送
    if (!store.state.user.userInfo.userId) {
      // 触发vuex 的方法
    await store.dispatch("user/getuserInfo");
    }
    // 登录
    // 是否进入登录页
    if (to.path === "/login") {
      // 1.1 是跳到首页
      return next("/");
    } else {
      // 不是 直接进入
      return next();
    }
  } else {
    // 2 未登录
    // 访问的是否在白名单（未登录也能访问的页面）
    const isCludes = whiteList.includes(to.path);
    if (isCludes) {
      // 2.1 在白名单 放行
      return next();
    } else {
      // 2.2 不在白名单（不登陆不能访问）跳到登陆页
      return next("/login");
    }
  }
});
