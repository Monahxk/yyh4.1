<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 10:51:17
 -->
<template>
  <div class="wrapper" id="doctorBench">
    <div class="wrok_bench_title">
      <div class="work_count_wrap">
        <div class="item">
          <p @click="testFn">今日预约</p>
          <p>
            <span class="orange">{{titData.numOfAppoint}}</span>
            <span class="samlls orange">人</span>
          </p>
        </div>
        <div class="item">
          <p>今日就诊</p>
          <p>
            <span class="red">{{titData.numOfVisited}}</span>
            <span class="samlls red">人</span>
          </p>
        </div>
        <div class="item">
          <p>新增患者</p>
          <p>
            <span class="blue">{{titData.numOfPatient}}</span>
            <span class="samlls blue">人</span>
          </p>
        </div>
        <div class="item" @click="handleIncome" style="cursor: pointer;">
          <p>今日实收</p>
          <p>
            <span class="samlls violet">￥</span>
            <span class="violet" v-if="income">{{titData.income}}</span>
            <span class="violet" v-if="!income">-- --</span>
          </p>
        </div>
      </div>
      <ul class="handle_btn_wrap"></ul>
    </div>
    <div class="nav_wrap">
      <div class="nav_left_box">
        <div
          class="nav_item"
          :class="{active: isMaxActive == index}"
          v-for="(item, index) of navListData"
          :key="index"
        >
          <span class="title" @click="handleNavFn(index)">{{item.title}}</span>
          <ul class="nav_main">
            <li
              :class="{active_checked: n == isSmallActive}"
              v-for="(item,n) of item.data"
              @click="handleChildFn(n)"
              :key="n"
            >
              <span>{{item}}</span>
              <span>{{index==0 ? '('+ (allConst[arrKeys[n]] || 0) +')' :'' }}</span>
            </li>
          </ul>
          <div class="line" v-show="index === 0">
            <span>|</span>
          </div>
        </div>
      </div>
      <ul class="handle_wrap" v-if="isdoctor">
        <li v-for="(item, index) of btnData" :key="index" @click="showDialogFn(index)">
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
    <div class="table_box">
      <router-view></router-view>
    </div>

    <addRegister :isShow="isShowDialog" :event-refresh="updateConstData" :userinfo="userinfo" />
    <addPatient :isShow="isShowDialog" :event-refresh="updateConstData" />
    <IframeDialog :iframeVisible="iframeParam" :event-refresh="updateConstData" />
  </div>
</template>

<script>
import addPatient from "@/components/workbench/dialogs/DialogAddPatient";
import addRegister from "@/components/workbench/dialogs/DialogsAddRegister";
import { SYSTEM_HTTP_SUCCESS,POSITION_ID_DOCTOR } from "@/constant";
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import { getWorkCount, getWorkbenchNum } from "@/api";
import storage from "sessionstorage";
import monment from "moment";
export default {
  name: "DoctorBench",
  components: {
    addPatient,
    IframeDialog,
    addRegister
  },
  props: {},
  data() {
    return {
      timer: "",
      allConst: {},
      arrKeys: ["numOfVisiting", "numOfCharging", "numOfEmr", "numOfCallback"],
      income: true,
      titData: {
        appointment: null,
        income: null,
        medicalAdvice: null,
        patient: null
      },
      navListData: [
        {
          title: "待办",
          data: ["就诊", "收费", "病历", "回访"]
        },
        {
          title: "全部",
          data: ["就诊", "收费", "病历", "回访"]
        }
      ],
      btnData: ["新增患者", "病历管理", "新增挂号"],
      isMaxActive: 0,
      leftSmallActive: 0,
      rightSmallActive: 1,
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: "",
        addRV: false
      },
      isShowDialog: {
        patient: false,
        addPatientpage: false,
        register: false,
        addPatientpageId: "",
        add: false,
        registerId: ""
      },
      startTime: "",
      endTime: "",
      routeData:{},
      userinfo: {},
    };
  },
  watch: {
    isShowDialog() {},
    $route(val) {
      let params = this.$route.params;
      if (params.menu == 0 || params.menu) {
        this.isMaxActive = parseFloat(params.menu);
        this.leftSmallActive = this.rightSmallActive = parseFloat(params.sub);
      } else {
        this.isMaxActive = 0;
        this.leftSmallActive = this.rightSmallActive = 0;
      }
      this.routeData=val.meta;
    }
  },
  created() {
    //不是医生登录就不加载数据
    //isdoctor 在全局utils/GlobeFindComponent/.js
    if(!this.isdoctor) {
      return;
    }
    let _this = this;
    // 新增挂号刷新
    this.$root.Bus.$on("ChangeRefresh", function() {
      _this.initTime();
    });
    // 跟据時間刷新
    this.$root.Bus.$on("ChangeTimeRefresh", function(t) {
      if (t) {
        _this.startTime = t[0];
        _this.endTime = t[1];
      } else {
        _this.startTime = "";
        _this.endTime = "";
      }
      _this.getWorkbenchNumFn("");
    });
    // 新增患者刷新
    this.$root.Bus.$on("ChangeConstRefresh", function() {
      _this.updateConstData();
      _this.initTime();
    });

    this.getWorkbenchNumFn();
  },
  computed: {
    isSmallActive() {
      return !this.isMaxActive ? this.leftSmallActive : this.rightSmallActive;
    }
  },
  methods: {
    getTimeTamp(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    getWorkbenchNumFn(id) {
      if(!this.isdoctor) {
        return;
      }
      let timestamp = new Date().getTime();
      let time = this.getTimeTamp(timestamp);
      let endTime = sessionStorage.getItem('endTime') || time;
      let startTime = sessionStorage.getItem('startTime') || time;
      this.endTime = endTime;
      this.startTime = startTime;
      let _D = id || "";
      let data = {};
      data.id = id;
      data.startTime = this.startTime;
      data.endTime = this.endTime;
      if(data.endTime === '') {
        return;
      }
      getWorkbenchNum(data).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.allConst = res.data.data;
        }
      });
    },
    handleIncome() {
      this.income = !this.income;
    },
    testFn() {
      this.$store.dispatch("UPDATE_DOC_DIAGNOSIS");
    },
    initTime() {
      this.getWorkbenchNumFn("");
    },
    // 切换
    handleNavFn(num) {
      this.isMaxActive = num;
      num ? this.getWorkbenchNumFn("all") : this.getWorkbenchNumFn("");
      this.leftSmallActive = this.rightSmallActive = 0;
      if (num === 0) {
        this.$router.push({
          name: "DoctorBench",
          meta:this.routeData,
          params: {
            menu: this.isMaxActive,
            sub: 0
          }
        });
      }
      if (num === 1) {
        this.$router.push({
          name: "allClinicTableCom",
          meta:this.routeData,
          params: {
            menu: this.isMaxActive,
            sub: 0
          }
        });
      }
    },
    handleChildFn(num) {
      !this.isMaxActive
        ? (this.leftSmallActive = num)
        : (this.rightSmallActive = num);
      if (this.isMaxActive === 0) {
        if (num === 0) {
          this.initTime();
          this.$router.push({
            name: "DoctorBench",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 1) {
          this.initTime();
          this.$router.push({
            name: "charge",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 2) {
          this.initTime();
          this.$router.push({
            name: "caseHistory",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 3) {
          this.initTime();
          this.$router.push({
            name: "returnVisit",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
      }
      if (this.isMaxActive === 1) {
        if (num === 0) {
          this.$router.push({
            name: "allClinicTableCom",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 1) {
          this.$router.push({
            name: "allCharge",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 2) {
          this.$router.push({
            name: "allCaseHistory",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 3) {
          this.$router.push({
            name: "allReturnVisit",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
      }
    },
    showDialogFn(num) {
      if (num == 1) {
        this.$router.push({ name: "CaseHistoryManage" });
      } else {
        if (num == 0) {
          // 新增患者

          this.isShowDialog.patient = true;
        }
        if (num === 2) {
          this.userinfo.edit = false;
          this.isShowDialog[Object.keys(this.isShowDialog)[num]] = true;
        }
      }
    },
    updateConstData() {
      if(!this.isdoctor) {
        return;
      }
      this.$children.map(val => {
        if (val.getAppointmentFn) val.getAppointmentFn();
      });
      getWorkCount().then(res => {
        console.log(res.data.data)
        if (res.data.code === SYSTEM_HTTP_SUCCESS)
          Object.assign(this.titData, res.data.data);
          let data = res.data.data;
          this.titData.income = data.income;
          this.titData.numOfAppoint = data.numOfAppoint;
          this.titData.numOfPatient = data.numOfPatient;
          this.titData.numOfVisited = data.numOfVisited;
      });
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  },
  mixins: [],
  mounted() {
    let timestamp = new Date().getTime();
    this.endTime = this.getTimeTamp(timestamp);
    this.startTime = this.getTimeTamp(timestamp);
    let params = this.$route.params;
    if (params.menu == 0 || params.menu) {
      this.isMaxActive = parseFloat(params.menu);
      this.leftSmallActive = this.rightSmallActive = parseFloat(params.sub);
    } else {
      this.isMaxActive = 0;
      this.leftSmallActive = this.rightSmallActive = 0;
    }

    parseFloat(params.menu)
      ? this.getWorkbenchNumFn("all")
      : this.getWorkbenchNumFn("");
    getWorkCount().then(res => {
      if (res.data.code === SYSTEM_HTTP_SUCCESS)
        // Object.assign(this.titData, res.data.data);
        this.titData = res.data.data;
    });

    this.timer = setInterval(() => {
      let _P = this.$route.params;
      parseFloat(_P.menu)
        ? this.getWorkbenchNumFn("all")
        : this.getWorkbenchNumFn("");
      getWorkCount().then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS)
          // Object.assign(this.titData, res.data.data);
          this.titData = res.data.data;
      });
    }, 1000 * 60 * 2);
  },
  clearTimer() {
    window.clearInterval(this.timer);
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  .table_box {
    position: absolute;
    left: 20px;
    bottom: 20px;
    right: 20px;
    top: 220px;
  }
  .wrok_bench_title {
    display: flex;
    align-items: flex-end;
    .work_count_wrap {
      color: #1b1e25;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .item {
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: 96px;
        margin-right: 20px;
        padding: 0 30px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        p:nth-child(1) {
          font-size: 16px;
          padding-bottom: 10px;
        }
        p:nth-child(2) {
          font-size: 40px;
        }
        .samlls {
          font-size: 14px;
        }
      }
      .orange {
        color: #f77e1b;
      }
      .red {
        color: #ff4871;
      }
      .blue {
        color: #28c0f5;
      }
      .violet {
        color: #aa70ff;
      }
    }
    .handle_btn_wrap {
      li {
        cursor: pointer;
        color: #3b78fd;
        width: 88px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #3b78fd;
        &:hover {
          background: #fff;
        }
      }
      li:nth-child(1) {
        margin-bottom: 20px;
      }
    }
  }
  .nav_wrap {
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .nav_left_box {
      display: flex;
      align-items: center;
      height: 48px;
      .line {
        padding: 0 30px;
      }
      .nav_item {
        display: flex;
        align-items: center;
        .title {
          cursor: pointer;
          font-size: 18px;
        }
        .nav_main {
          display: flex;
          font-size: 14px;
          overflow: hidden;
          margin-left: 20px;
          transition: all 1s;
          width: 0;
          li {
            line-height: 20px;
            cursor: pointer;
            margin-right: 20px;
            width: 0;
            height: 0;
          }
        }
        .active_checked {
          border-bottom: 2px solid #7874f2;
        }
      }
      .active span,
      .active li {
        color: #493bfd !important;
        width: auto !important;
        height: auto !important;
      }
      .active .nav_main {
        width: auto;
        transition: all 0.1s easy;
      }
    }
    .handle_wrap {
      display: flex;
      li {
        cursor: pointer;
        width: 154px;
        height: 48px;
        font-size: 18px;
        font-weight: bold;
        color: #4e81f2;
        text-align: center;
        line-height: 48px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        margin-right: 20px;
      }
      li:nth-child(3) {
        margin-right: 0px;
      }
    }
  }
  .sideslip_wrap {
    width: 960px;
    height: 100vh;
    background: #fff;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
<style>
@import "../../../assets/css/workbench/publicTable.css";
.nav_wrap .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
.nav_wrap .el-tabs__header {
  margin: 0;
}
.nav_wrap .el-tabs__nav-wrap::after {
  display: none;
}
#doctorBench .wrapper_table .el-table {
  height: 100%;
}
</style>
