import * as types from '../mutation-types'
import {userPermission} from "@/api"
const userInfo = {
  state: {
    userPermission: null
  },
  getters: {
    doneTodos(state) {
      return state.userPermission
    }
  },
  mutations: {
    [types.SET_USER_PERMISSION](state,data) {
      state.userPermission = data
    }
  },
  actions: {
    [types.GET_USER_PERMISSION]({commit},data) {
      // commit('SET_USER_PERMISSION',data)
      return new Promise((resolve, reject) => {
        return
        userPermission().then(res => {
          commit('SET_USER_PERMISSION',res.data.data)
          resolve()
        })
      })
    }
  }
}

export default userInfo