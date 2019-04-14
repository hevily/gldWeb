import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'


import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import {ApolloLink} from 'apollo-link'


import { VueAxios } from '@/utils/request'

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less'  // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import PermissionHelper from '@/utils/helper/permission'
import { removeLoadingAnimate } from '@/utils/util'

import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE
} from '@/store/mutation-types'
import config from '@/defaultSettings'












// 与 API 的 HTTP 连接
const httpLink = new HttpLink({
  // 你需要在这里使用绝对路径
  // uri: 'http://192.168.2.32:4466/'
  // uri:'http://115.159.158.108:4466/'
  uri:'http://182.254.214.210:4080/v1alpha1/graphql'
})


// 创建订阅的 websocket 连接
const wsLink = new WebSocketLink({
  uri: 'ws://182.254.214.210:4080/v1alpha1/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-access-key': 'wicaretest1234'
        // Authorization: `Bearer ${token}` || null
      }
    }
  },
})

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NDc3ODg3NzZ9.N__rYip33R9Y749bi3e0v4MR4_ntK9jXxp47nRqWMmY'
  operation.setContext({
    headers: {
      // Authorization: `Bearer ${token}` || null,
      "x-hasura-access-key": "wicaretest1234"
    }
  })
  return forward(operation)
})



// 使用分割连接的功能
// 你可以根据发送的操作类型将数据发送到不同的连接
const link = split(
  // 根据操作类型分割
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  middlewareLink.concat(httpLink)
)

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  // link: middlewareLink.concat(httpLink),
  link,
  cache
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// exports.apolloProvider = apolloProvider

// debugger
// console.log(apolloProvider,'providerapploooooooo')




Vue.config.productionTip = false

Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(PermissionHelper)

new Vue({
  router,
  store,
  apolloProvider,
  created () {
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    store.commit('SET_REMEMBER', Vue.ls.get('REMEMBER'))
    store.commit('SET_ACCOUNT_PASSWORD', JSON.parse(Vue.ls.get('ACCOUNT_PASSWORD')||"{}"))

    console.log('.... created ()')

    removeLoadingAnimate('preloadingWrapper')
  },
  render: h => h(App)
}).$mount('#app')
