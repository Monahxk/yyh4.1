/**
 * @Author: ZJZ
 * @Date:   2019-08-01
 * @Filename: axios-set.js
 * @Last modified by:   ZJZ
 * @Last modified time: 2019-11-11
 */

import axios from 'axios'
import { API_ROOT } from './config'
import { Message } from 'element-ui'
import Router from '@/router'
const instance = axios.create({
  timeout: 3000000, //设置成10000就没有，加载数据蒙版和操作成功提示
  baseURL: API_ROOT,
  withCredentials: true,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  delayLoading: true,//全局默认设置true，加载数据蒙版，不想有蒙版就在你单条数据请求头设置false,    zjz   2019/7/8
  messageFla:true,//全局默认设置true，提示，false就没有操作提示,    zjz   2019/7.18

})

// 请求拦截器
instance.interceptors.request.use(function (config) {

  // if(config.delayLoading){//开启蒙版，建议开发时注释，接口经常响应太慢
  //   util.showFullScreenLoading();
  // }else {
  //   util.showFullScreenLoading(0);
  // }
  if(config.method!='get' && config.timeout != 10000){
    util.showFullScreenLoading(0);
  }
  return config

}, function (error) {
  util.tryHideFullScreenLoading();
});
instance.interceptors.response.use(function (response) {
  let code = response.data.code
  if (code === 212) {
    Message.error('连接超时，返回首页后，请重新登录')
    Router.push('/')
  }
  else if (response && code !== 200) {
    if(response.data.msg)Message.error(`${response.data.msg}`)
  }
  if(response.config.method !='get'){
    if(code==200 && response.config.timeout != 10000){
      if(response.data.msg)Message.success(`${response.data.msg}`)
    }
  }
  util.tryHideFullScreenLoading();
  return response;
}, err => {
  util.tryHideFullScreenLoading();
  if (err && err.response) {
    if (err.response.status == 500) {
      Message.error(err.response.statusText + `服务器错误`)
    }
    return Promise.reject(err)

  }
});

export default instance
