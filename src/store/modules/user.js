import Vue from 'vue'
// import VueApollo from 'vue-apollo'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

// Vue.use(VueApollo)
import gql from 'graphql-tag'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = './avatar.png'
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_REMEMBER: (state, flag) => {
      console.log(Vue.ls.get('REMEMBER22'),'--------------------------------------------------')
      // if(flag == false)
      if(flag == null){
        state.isRemember = true
      }else {
        state.isRemember = flag
      }
      Vue.ls.set('REMEMBER', flag)
    },
    SET_ACCOUNT_PASSWORD:(state,params) => {
      console.log(params,'--------------------------------------------------')
      state.account_password = params
      Vue.ls.set('ACCOUNT_PASSWORD',JSON.stringify(params))
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log(Vue.$apollo,Vue.__proto__,userInfo,'vueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      
      return new Promise((resolve, reject) => {
        userInfo.$apollo.query({
          query: gql`query {
            Employee (where:{username:{_eq:"${userInfo.username}"},password:{_eq:"${userInfo.password}"}}){
              id
              name
              password
              username
              headPortrail
              sex
              mobile
              email
              job
              title
              major
              createdAt
              updatedAt
              filterNotificationType
              department {
                id
                name
                company_id
              }
              roles {
                role {
                  name
                  authorizations {
                    authorization {
                      key
                      name
                    }
                  }
                }
              }  
            }
          }
          `
        }).then(response => {
          console.log(response,'login get employee')
          const result = response.data.Employee[0]
          if(result){
            Vue.ls.set(ACCESS_TOKEN, result.token || 'tesktoken', 7 * 24 * 60 * 60 * 1000) //设置token 时间
            Vue.ls.set('account_',userInfo.username)
            Vue.ls.set('password_',userInfo.password)
            console.log(result.token)
            commit('SET_TOKEN', result.token || 'tesktoken')
            commit('SET_INFO',result)
            commit('SET_ROLES', result.roles)
            Vue.ls.set('info',JSON.stringify(result))
            resolve()
          }else {
            resolve(true)
          }
        }).catch(error => {
          reject(error)
        })
      })
  
      // debugger
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000) //设置token 时间
          console.log(result.token)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        var userInfo = {
          username:Vue.ls.get('account_'),
          password:Vue.ls.get('password_')
        }
       


        getInfo().then(response => {
          const result = response.result

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetInfos({commit}){
      var info = JSON.parse(Vue.ls.get('info'))
      // debugger
      commit('SET_NAME', { name: info.name, welcome: welcome() })
      commit('SET_AVATAR', info.avatar)
      commit('SET_INFO', info)
      commit('SET_ROLES', info.roles)
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },

  }
}

export default user