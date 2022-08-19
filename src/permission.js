// 权限控制

// 路由（全局）前置守卫
// 会在所有的路由进入之前触发
import router from '@/router'
import store from '@/store'

// 白名单
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  if (token) {
    //如果没有，就获取
    if (!store.state.user.userInfo.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 1登陆
    // 是否进入登陆

    if (to.path === '/login') {
      // 是 跳转首页
      next('/')
    } else {
      //放行
      next()
    }
  } else {
    // 2、未登录
    // 是否在白名单
    const isCludes = whiteList.includes(to.path)
    if (isCludes) {
      // 在白名单，放行
      next()
    } else {
      // 不在白名单，去登录
      next('/login')
    }
  }
})
