/*
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-12 16:05:05
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'fullcalendar/dist/fullcalendar.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/public.less';
import './assets/css/common.less';
import {BasePane, BaseTabs} from './components/my-tabs'
import util from './api/util'
import sse from 'sessionstorage'
import Print from 'vue-print-nb'
import VCharts from 'v-charts'
import elCascaderMulti from "el-cascader-multi";
Vue.prototype.$echarts = VCharts;
// import 'babel-polyfill' libs 下删除了文件
import VueFullcalendar from '@/components/VueFullcalendar'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import FindComponent from './utils/GlobeFindComponent'
import Constants from '@/constant'
import {currency} from './libs/format' //libs 下删除了文件
window.util = util;
Vue.use(VueFullcalendar)
Vue.use(ElementUI)
Vue.use(BasePane)
Vue.use(BaseTabs)
Vue.use(Print);
Vue.use(contentmenu)
Vue.mixin(FindComponent)
Vue.use(VCharts)
Vue.use(elCascaderMulti )
Vue.filter("currency",currency) // libs 下删除了文件
import axios from 'axios'
axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.iframeUrl =''
Vue.prototype.Constants=Constants
const isDebug_mode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode
const Bus = new Vue()
const Ma= new  Vue({
  el: '#app',
  router,
  store,
  data(){
    return {
      Bus
    }
  },
  components: { App },
  template: '<App/>'
})
