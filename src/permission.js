// import Vue from 'vue'
// import router from './router'
// import store from './store'

// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import notification from 'ant-design-vue/es/notification'
// import { ACCESS_TOKEN } from '@/store/mutation-types'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist

// router.beforeEach((to, from, next) => {
//   NProgress.start() // start progress bar
//   // console.log(Vue.ls.get,Vue.ls.get(ACCESS_TOKEN),'icon')
//   if (Vue.ls.get(ACCESS_TOKEN)) {
//     /* has token */
//     if (to.path === '/user/login') {
//       next({ path: '/home' })
//       NProgress.done()
//     } else {
//       console.log(store.getters.roles, router, 'dfdfdfdffffff')



//       if (!store.getters.isAddR) {
//         store.dispatch('GenerateRoutes', { roles:{} }).then(() => {
//           // 根据roles权限生成可访问的路由表
//           // 动态添加可访问路由表
//           // debugger;
//           // console.log(store.getters.addRouters)
//           // debugger
//           store.dispatch('GetInfos')
//           router.addRoutes(store.getters.addRouters)
//           store.dispatch('IsSetRoute').then(() => {
//             const redirect = decodeURIComponent(from.query.redirect || to.path)
//             if (to.path === redirect) {
//               // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//               next({ ...to, replace: true })
//             } else {
//               // 跳转到目的路由
//               next({ path: redirect })
//             }
//           })
//         })
//       } else {
//         next()
//       }

//       // console.log(store.getters.roles,store.getters.roles.length,'fdddddddddddddddddddddddddddd')
//       // if (store.getters.roles.length === 0) { //为空的时候进入
//       //   store
//       //     .dispatch('GetInfo')
//       //     .then(res => {
//       //       // debugger
//       //       const roles = res.result && res.result.role
//       //       console.log(roles)

//       //       store.dispatch('GenerateRoutes', { roles }).then(() => {
//       //         // 根据roles权限生成可访问的路由表
//       //         // 动态添加可访问路由表
//       //         // debugger;
//       //         console.log(store.getters.addRouters)
//       //         router.addRoutes(store.getters.addRouters)
//       //         const redirect = decodeURIComponent(from.query.redirect || to.path)
//       //         if (to.path === redirect) {
//       //           // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//       //           next({ ...to, replace: true })
//       //         } else {
//       //           // 跳转到目的路由
//       //           next({ path: redirect })
//       //         }
//       //       })
//       //     })
//       //     .catch((err) => {
//       //       console.log(err)
//       //       notification.error({
//       //         message: '错误',
//       //         description: '请求用户信息失败，请重试'
//       //       })
//       //       store.dispatch('Logout').then(() => {
//       //         next({ path: '/user/login', query: { redirect: to.fullPath } })
//       //       })
//       //     })
//     // } else {
//     //   debugger
//     //   next()
//     // }
//   }
// } else {
//     if(whiteList.includes(to.name)) {
//   // 在免登录白名单，直接进入
//   next()
// } else {
//   next({ path: '/user/login', query: { redirect: to.fullPath } })
//   NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
// }
//   }
// })

// router.afterEach(() => {
//   NProgress.done() // finish progress bar
// })


import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
// debugger
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // console.log(Vue.ls.get,Vue.ls.get(ACCESS_TOKEN),'icon')
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/home' })
      NProgress.done()
    } else {
      console.log(store.getters.roles, router, 'all roles')
      store.dispatch('GetInfos')
      if (!store.getters.isAddR) {
        const roles = store.getters.roles
        store.dispatch('GenerateRoutes', { roles: roles }).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          // debugger;
          // console.log(store.getters.addRouters)
          // debugger
         
          router.addRoutes(store.getters.addRouters)
          store.dispatch('IsSetRoute', true).then(() => {
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              console.log(store.getters.addRouters,'store.getters.addRouters')
              if(to.path == '/404'){
                next({ path: '/' })
              }else {
                next({ ...to, replace: true })
              } 
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              
            } else {
              // 跳转到目的路由
              // debugger
              if(to.path == '/404'){
                next({ path: '/' })
              }else {
                next({ path: redirect })
              }
              
            }
          })
        })
      } else {
        next()
      }

      // console.log(store.getters.roles,store.getters.roles.length,'fdddddddddddddddddddddddddddd')
      // if (store.getters.roles.length === 0) { //为空的时候进入
      //   store
      //     .dispatch('GetInfo')
      //     .then(res => {
      //       // debugger
      //       const roles = res.result && res.result.role
      //       console.log(roles)

      //       store.dispatch('GenerateRoutes', { roles }).then(() => {
      //         // 根据roles权限生成可访问的路由表
      //         // 动态添加可访问路由表
      //         // debugger;
      //         console.log(store.getters.addRouters)
      //         router.addRoutes(store.getters.addRouters)
      //         const redirect = decodeURIComponent(from.query.redirect || to.path)
      //         if (to.path === redirect) {
      //           // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //           next({ ...to, replace: true })
      //         } else {
      //           // 跳转到目的路由
      //           next({ path: redirect })
      //         }
      //       })
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //       notification.error({
      //         message: '错误',
      //         description: '请求用户信息失败，请重试'
      //       })
      //       store.dispatch('Logout').then(() => {
      //         next({ path: '/user/login', query: { redirect: to.fullPath } })
      //       })
      //     })
    // } else {
    //   debugger
    //   next()
    // }
  }
} else {
    if(whiteList.includes(to.name)) {
  // 在免登录白名单，直接进入
  next()
} else {
  next({ path: '/user/login', query: { redirect: to.fullPath } })
  NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
}
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
