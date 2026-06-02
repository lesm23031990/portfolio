import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false
  },
  getters: {
    loading: (state) => state.loading
  },
  mutations: {
    SET_LOADING(state, value) {
      state.loading = value
    }
  },
  actions: {
    showLoading({ commit }) {
      commit('SET_LOADING', true)
    },
    hideLoading({ commit }) {
      commit('SET_LOADING', false)
    }
  }
})
