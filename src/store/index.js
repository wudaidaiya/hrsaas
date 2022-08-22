import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import createVuexPersisted from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission
  },
  getters,
  plugins: [
    createVuexPersisted({
      reducer(state) {
        // 指定存储某个模块的数据
        return {
          user: {
            token: state.user.token
          }
        }
      }
    })
  ]
})

export default store
