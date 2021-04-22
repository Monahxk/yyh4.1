import Pane from './BasePane.vue'
import Tabs from './BaseTabs.vue'

export const BasePane = {
  install: function (Vue) {
    Vue.component('BasePane', Pane)
  }
}

export const BaseTabs = {
  install: function (Vue) {
    Vue.component('BaseTabs', Tabs)
  }
}