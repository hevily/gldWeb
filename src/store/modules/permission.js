// import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

// /**
//  * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
//  *
//  * @param permission
//  * @param route
//  * @returns {boolean}
//  */
// // function hasPermission(permission, route) {
// //   if (route.meta && route.meta.permission) {
// //     let flag = false
// //     for (let i = 0, len = permission.length; i < len; i++) {
// //       flag = route.meta.permission.includes(permission[i])
// //       if (flag) {
// //         return true
// //       }
// //     }
// //     return false
// //   }
// //   return true
// // }
// function hasPermission(permission, route) {
//   if (route.meta && route.meta.permission) {
//     let flag = false
//     const _permission = []
//     permission.forEach(ele => {
//       ele.role.authorizations.forEach(per => {
//         if(_permission.indexOf(per.authorization.key) === -1){
//           _permission.push(per.authorization.key)
//         }
//       })
//     })
//     for (let i = 0, len = _permission.length; i < len; i++) {
//       flag = route.meta.permission.includes(_permission[i])
//       if (flag) {
//         return true
//       }
//     }
//     return false
//   }
//   return true
// }


// /**
//  * 单账户多角色时，使用该方法可过滤角色不存在的菜单
//  *
//  * @param roles
//  * @param route
//  * @returns {*}
//  */
// // eslint-disable-next-line
// function hasRole(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return route.meta.roles.includes(roles.id)
//   } else {
//     return true
//   }
// }
// //页面权限获取
// // function filterAsyncRouter(routerMap, roles) {
// //   const accessedRouters = routerMap.filter(route => {
// //     if (hasPermission(roles.permissionList, route)) {
// //       if (route.children && route.children.length) {
// //         // debugger;
// //         route.children = filterAsyncRouter(route.children, roles)
// //       }
// //       return true
// //     }
// //     return false
// //   })
// //   return accessedRouters
// // }

// // function filterAsyncRouter(routerMap, roles) {
// //   const accessedRouters = routerMap.filter(route => {
// //     // if (hasPermission(roles.permissionList, route)) {
// //       if (route.children && route.children.length) {
// //         // debugger;
// //         route.children = filterAsyncRouter(route.children, roles)
// //       }
// //       return true
// //     // }
// //     // return false
// //   })
// //   return accessedRouters
// // }

// function filterAsyncRouter(routerMap, roles) {
//   const accessedRouters = routerMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         // debugger;
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }




// const permission = {
//   state: {
//     routers: constantRouterMap,
//     addRouters: [],
//     isAddRoute:false,
//   },
//   mutations: {
//     SET_ROUTERS: (state, routers) => {
//       state.addRouters = routers
//       state.routers = constantRouterMap.concat(routers)
//     },
//     SET_ISADD: (state) => {
//       state.isAddRoute= true
//     }
//   },
//   actions: {
//     GenerateRoutes({ commit }, data) {
//       return new Promise(resolve => {
//         const { roles } = data
//         const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
//         commit('SET_ROUTERS', accessedRouters)
//         resolve()
//       })
//     },
//     IsSetRoute({commit}){
//       return new Promise(resolve => {
//         commit('SET_ISADD')
//         resolve()
//       })
      
//     }
//   }
// }

// export default permission



import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    const _permission = []
    permission.forEach(ele => {
      ele.role.authorizations.forEach(per => {
        if(_permission.indexOf(per.authorization.key) === -1){
          _permission.push(per.authorization.key)
        }
      })
    })
    for (let i = 0, len = _permission.length; i < len; i++) {
      flag = route.meta.permission.includes(_permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}
//页面权限获取
// function filterAsyncRouter(routerMap, roles) {
//   const accessedRouters = routerMap.filter(route => {
//     if (hasPermission(roles.permissionList, route)) {
//       if (route.children && route.children.length) {
//         // debugger;
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

function filterAsyncRouter(routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        // debugger;
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}



const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    isAddRoute:false,
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ISADD: (state, flag) => {
      state.isAddRoute = flag
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    IsSetRoute({commit}, flag){
      return new Promise(resolve => {
        commit('SET_ISADD', flag)
        resolve()
      })
      
    }
  }
}

export default permission
