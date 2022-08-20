import router, { asyncRoutes } from './router'
import store from './store'

// 白名单----用户未登录也可以访问
const whiteList = ['/login', '/404']
// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  //   判断是否登录
  if (token) {
    // 再判断是否请求过---若第一次进入才发送请求
    if (!store.state.user.userInfo.userId) {
      // 每次跳转发送获取用户信息的请求
      const { roles } = await store.dispatch('user/getUserInfo')
      // console.log(roles.menus)
      // console.log(asyncRoutes)
      const routes = asyncRoutes.filter((item) =>
        roles.menus.includes(item.meta.id)
      )
      // console.log(routes)
      router.addRoutes([...routes,{ path: '*', redirect: '/404', hidden: true }])
      next(to.path)
    }
    // 登录了若想去登录页面---强制去首页
    if (to.path === '/login') return next('/')
    // 不去登录页---放行
    next()
  } else {
    // 判断是否去白名单中----在就放行--不在就去登录页
    const isCludes = whiteList.includes(to.path)
    if (isCludes) return next()
    next('/login')
  }
})
