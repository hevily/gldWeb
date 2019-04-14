import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    projectId:'',
    projectName:'',
  },
  mutations: {
    set_project(state,project){
      console.log(project)
      state.projectId = project.id
      state.projectName = project.name
    }
  },
  actions: {

  },
  getters
})
