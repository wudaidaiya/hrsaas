import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/filters/index'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 自定义指令
import * as directives from '@/directives'
// 组件
import component from './components'
// 过滤器
import * as filters from '@/filters'
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.use(ElementUI)
// 统一注册自定义指令
for (let k in directives) {
  Vue.directive(k, directives[k])
}
// 统一注册组件
Vue.use(component)
// 统一注册过滤器
for (let k in filters) {
  Vue.filter(k, filters[k])
}
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
