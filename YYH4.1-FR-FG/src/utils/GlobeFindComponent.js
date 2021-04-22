/*
 * @Descripttion: 增加表格日期格式化函数
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 10:06:38
 */
import sse from "sessionstorage";
import {POSITION_ID_DOCTOR} from "@/constant";
export default {
  provide() {
    return {
      "global_App": this
    }
  },
  data() {
    return {
      author: '勿动',
      isdoctor: false,//是否是医生登录
    }
  },
  methods: {
    findComponentsUpward(context, componentName, method) {
      console.log( this.$route )
      let r_name = componentName || this.$route.name
      let parent = context.$parent
      let name = parent.$options.name;
      
      while(parent && !name || [r_name].indexOf(name) < 0) {
        parent = parent.$parent
        if (parent) name = parent.$options.name
      }
      parent.updateConstData()
      // method? parent.method() : 
      return parent;
    },
    //表格格式化日期
		formatterDate(row, column, cellValue) {
			return util.dateFormat(cellValue,'yyyy-MM-dd hh:mm');
    },
    //表格格式化日期
		formatterDateTOymd(row, column, cellValue) {
			return util.dateFormat(cellValue,'yyyy-MM-dd');
    },
    //金额格式化
    formatterMoney(row, column, money) {
      // return money ? '￥' + util.moneyFmt(money) : '';
      return money;
    }
  },
  created() {
    let powerId = sse.getItem('powerId');
    this.powerId = powerId;
    //登录账号是管理员，不加载数据
    if(powerId != POSITION_ID_DOCTOR) {
      this.isdoctor = false;
    } else {
      this.isdoctor = true;
    }
  }
}