import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'
import { constantRouterMap } from '@/config/router.config'

Vue.use(Router)
Vue.use(VueApollo)

console.log(Vue)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})