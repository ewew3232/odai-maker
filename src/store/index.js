// store.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    editingItem: null
  },
  mutations: {
    setEditingItem(state, item) {
      state.editingItem = item
    }
  }
})
