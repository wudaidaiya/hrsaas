import router, {constantRoutes, asyncRoutes} from '@/router'
export default {
  namespaced: true,
  state: {
    routes: [],
    points: []
  },
  mutations: {
    setRoutes(state, routes) {
      state.routes = [...constantRoutes, ...routes]
    },
    setPoints(state, payload){
      state.points= payload
    }
  },
  actions: {
    filterRoutes(context, roles) {
      const routes = asyncRoutes.filter((item) => {
        // 如果权限标识在roles.menus 有这个权限返回true
        // 如果权限标识不在roles.menus 没有这个权限返回false
        return roles.menus.includes(item.meta.id)
      })
      context.commit('setRoutes', routes)
      // console.log(routes)
      router.addRoutes([
        ...routes,
        { path: '*', redirect: '/404', hidden: true }
      ])
    },
    setPointsAction(context,points) {
      context.commit('setPoints',points)
    }
  }
}
