/*
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-09-06 16:19:00
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-06 16:23:48
 */
export default {
  data() {
   return {
   }
  },
  created() {
  },
  mounted() {},
  methods: {
    mapToArray(dmap) {
      let array = [];
      if(dmap) {
        for(var p in dmap){//遍历json对象的每个key/value对,p为key
          let json = {
            id: p,
            name: dmap[p]
          }
          array.push(json);
        }
      }
      return array;
    }
  }
 }