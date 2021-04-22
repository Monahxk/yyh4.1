/*
 * @Descripttion: 用处未知
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:21:45
 */
import store from '@/store'
 
export default {
  inserted(el, binding, vnode) {
    let data = store.state.global.userPermission
    let {value} = binding
    let [subUrl,opr] = value.split(',')
    data.map(item => {
      item.submenu.map(val => {
        if (Object.is(val.subUrl,subUrl)) {
          if (val.oprList[0].opr === '*') {
            el.style.display = 'block'
          } else {
            [...(val.oprList[0].opr)].map(res => {
              if (opr === res) {
                el.style.display = 'none'
              }
            })
          }
        }
      })
    })    
  }
}