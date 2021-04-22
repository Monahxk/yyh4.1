/**
 * @Author: ZJZ
 * @Date:   2019-08-12
 * @Filename: config.js
 * @Last modified by:   ZJZ
 * @Last modified time: 2019-10-31
 */

export const API_ROOT = getHelper('API_ROOT')
export const CDN_ROOT = getHelper('CDN_ROOT')
export const SOCKET_ROOT = getHelper('SOCKET_ROOT')
export const CookieDomain = getHelper('CookieDomain')
export const IMGSRC_ROOT = getHelper('IMGSRC_ROOT')
function getHelper (type) {
  if (type === 'API_ROOT') {
    if (process.env.NODE_ENV === 'production') {
      return '/yyh41-fg/api'
    } else {
      return '/apis'
      // return 'http://192.168.1.168:8190/'
    }
  }
  if (type === 'IMGSRC_ROOT') {
    if (process.env.NODE_ENV === 'production') {
      return 'api'
    } else {
      return 'apis'
    }
  }
  if (type === 'SOCKET_ROOT') {
    if (process.env.NODE_ENV === 'production') {
      return false
    } else {
      // return 'ws://211.144.5.66:60841/yyh41-fg/websocket/'
      return 'ws://211.144.5.74/yyh41-fg/websocket/'
    }
    // 192.168.0.180
  }
}
