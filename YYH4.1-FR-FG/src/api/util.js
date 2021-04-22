/*
 * @Descripttion: 工具类
 * @version:
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 11:31:30
 */
//公共工具库
import { Loading } from 'element-ui'
import {TO_FIXED} from "@/constant"
let loading , timer , needLoadingRequestCount = 0;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中…',
    spinner: 'el-icon-loading',
    background: 'rgba(255,255,255,.1)'
  })
}
Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
 return fmt;
}
export default class Util {


  //fmt:yyyy-MM-dd hh:mm:ss
  static dateFormat(dateStr,fmt) {
    return dateStr && fmt ? new Date(dateStr).format(fmt) : '';
  }
  static timestampToTime(timestamp) {

    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D+h+m+s;
  }
  static timestampToTimeMinutes(timestamp) {

    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + '';
    let s = date.getSeconds();
    return Y+M+D+h+m;
  }
  static timestampToTimehms(timestamp) {

    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' ';
    let h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    return Y+M+D+h+m+s;
  }
  static timestampDay(timestamp) {

    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())
    return Y+M+D;
  }
 /**
   * 修正学员数据
   */
  static filterData(arr) {
    // 转换时间戳
    function timestampToTime(timestamp) {

      let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y+M+D;
    }


    // 数据过滤，改值
  for(let i=0;i<arr.length;i++){

      if(arr[i].type===0){
        arr[i].type='注册';
      }else{
        arr[i].type='开通';
      }

      if(arr[i].status===0){
        arr[i].status='启用';
      }else{
        arr[i].status='弃用';
      }
      arr[i].regTime=timestampToTime(arr[i].regTime);
    }
    return arr
  }

  /**
   * 文本是否为空
   */
  static isEmpty(text) {
    return !text || text.trim().length <= 0;
  }

  /**
   * 文本是否email
   */
  static isEmail(email) {
    return new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(email);
  }

  /**
   * 文本是否为正确格式的营业执照
   */
  static isTradingCertificate(str) {
    return new RegExp(/(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/).test(str);
  }

  /**
   * 是否有效手机号
   */
  static isMobile(mobile) {
    return new RegExp(/^[1][0-9]{10}$/).test(mobile);
  }

  /**
   * 是否有效手机号
   */
  static isMoney(money) {
    return new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(money);
  }

  /**
   * 是否正确的密码
   */
  static isValidPassword(pwd) {
    return new RegExp(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/).test(pwd);
  }

  /**
   * 是否正确的身份证号码
   */
  static isIdNo(idNo) {
    let reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(idNo) !== false;
  }

  /**
   * 是否正确的姓名
   * @param name
   * @returns {boolean}
   */
  static isValidName(name) {
    let regName = /^[\u4e00-\u9fa5]{2,4}$/;
    return regName.test(name);
  }

  /*
   * 公司名字必须为1-100汉字可输入（）和()
   */
  static nameIsChinese(name) {
    let chineseName = /^[\(\)\（\）\u4e00-\u9fa5]{1,100}$/;
    return chineseName.test(name);
  }
  static nameIsChinesefive(name) {
    let chineseName = /^[\(\)\（\）\u4e00-\u9fa5]{1,100}$/;
    return chineseName.test(name);
  }
  /**
   * 获取URL参数
   */
  static getURLParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

    let r = '';
    let parts = window.location.href.split('?');
    if (parts.length > 1) {
      r = parts[1];
    }
    r = r.match(reg);
    if (r !== null) return decodeURIComponent(r[2]);
    return null;
  }

  /**
   * 设置URL参数
   */
  static setURLParam(key, value) {
    let url = window.location.href;
    let pattern = key + '=([^&]*)';
    let replaceText = key + '=' + value;
    let newurl = url.match(pattern) ? url.replace(eval('/(' + key + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);

    if (newurl.indexOf(key + "=") < 0) {
      if (newurl.indexOf("?") < 0) {
        newurl = newurl + "?" + key + "=" + value;
      } else {
        newurl = newurl + "&" + key + "=" + value;
      }
    }

    let stateObject = {};
    let title = "tmp";

    window.history.replaceState(stateObject, title, newurl);
  }

  /**
   * 设置cookie
   */
  static setCookie(c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + encodeURIComponent(value) +
      ((expiredays === null || expiredays === undefined) ? "" : ";expires=" + exdate.toUTCString()) +
      ";path=/"
  }

  /**
   * 获取cookie
   */
  static getCookie(c_name) {
    let start;
    let end;
    if (document.cookie.length > 0) {
      start = document.cookie.indexOf(c_name + "=");
      if (start !== -1) {
        start = start + c_name.length + 1;
        end = document.cookie.indexOf(";", start);
        if (end === -1) end = document.cookie.length;
        return decodeURIComponent(document.cookie.substring(start, end))
      }
    }
    return undefined;
  }

  /**
   * 关闭窗口
   */
  static closeWindow() {
    window.opener = null;
    window.open("", "_self");
    window.close();
    if (window) {
      window.location.href = "about:blank";
    }
  }

  /**
   * 禁止返回
   */
  static disableBack() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
    });
  }

  static add0(m) {
    return m < 10 ? '0' + m : m
  };

  /**
   * 时间戳格式化
   */
  static timestampToStringShort(timestamp) {
    let date = new Date();
    date.setTime(timestamp * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return y + '.' + this.add0(m) + '.' + this.add0(d);
  };

  /**
   * 时间戳格式化
   */
  static timestampToString(timestamp) {
    let date = new Date();
    date.setTime(timestamp * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let mm = date.getMinutes();
    let s = date.getSeconds();
    return y + '.' + this.add0(m) + '.' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  };

  /**
   * 货币格式化
   */
  static moneyFmt(strn) {
    let strarr = strn.split('.');
    strn += '';
    strn = strarr[0];
    let result = "";
    let cs = 0;
    for (let i = strn.length - 1; i >= 0; i--) {
      cs++;
      result = strn.charAt(i) + result;
      if (!(cs % 3) && i !== 0) {
        result = "," + result;
      }
    }

    return strarr.length > 1 ? result + '.' + strarr[1] : result;
  }

  /**
   * el日期选择器时间范围限制
   * @param startDate 开始时间
   * @param endDate 结束时间
   */
  static elDatePickerRangeLimitOptions(startDate, endDate) {
    if (!endDate) {
      endDate = new Date(new Date().getTime() + (365 * 24 * 3600 * 1000));
    }

    let options = {
      disabledDate(time) {
        if (time.getTime() < startDate.getTime()) {
          return true;
        }

        if (time.getTime() > endDate.getTime()) {
          return true;
        }

        return false;
      }
    }
    return options;
  }

/**
 * 根据身份证获取信息
 * @param {身份证号} UUserCard
 * @param {*} num
 */
static getIdCardInfo(UUserCard, num) {
  if (num == 1) {
      //获取出生日期
      let birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
      return birth;
  }
  if (num == 2) {
      //获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
          //男
          return "男";
      } else {
          //女
          return "女";
      }
  }
  if (num == 3) {
      //获取年龄
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
          age++;
      }
      return age;
  }
}

/**
 * 保留小数
 * 输入float时，返回正确的格式
 * 根据配置返回保留小数位
 */
static getFloatVal(value) {
  if(!value) {
    return 0;
  }
  let inputValue = (value + '').replace(/^\./g,'').replace(/[^\d\.]/g,'');
  let arr = inputValue.split('.');
  let valstr = '';
  if(arr.length > 2) {
    for(let i=0;i<arr.length;i++) {
      if(arr[i]) {
        valstr += valstr == '' ? arr[i] + '.' : arr[i];
      }
    }
  } else {
    valstr = inputValue;
  }
  arr = valstr.split('.');
  if(arr.length > 1) {
    if(arr[1].length > TO_FIXED) {
      valstr = arr[0] + '.' + arr[1].substr(0,TO_FIXED)
    }
  }
  return valstr;
}

  static getBrowserSupport() {
    let u = navigator.userAgent, app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      chrome: u.indexOf('Chrome') > -1,
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq", //是否QQ
    };
  }

  //

  //打开loading
  static showFullScreenLoading(time = 300) {
    if (needLoadingRequestCount === 0) {
      if(timer) clearTimeout(timer);
      timer = setTimeout(()=>{ startLoading() }, time);
    }
    needLoadingRequestCount++
  }

  //关闭loading
  static tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
      if(timer) clearTimeout(timer);
      setTimeout(()=>{
        if(loading) loading.close()
      }, 300)
    }
  }

}
