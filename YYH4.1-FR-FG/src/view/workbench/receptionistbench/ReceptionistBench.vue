<!--
 * @Descripttion: 前台工作台
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-12 17:50:44
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 10:51:26
 -->
<template>
  <div class="wrapper">
    <div class="wrok_bench_title">
      <div class="work_bench_wrap">
        <div class="item">
          <p>今日预约</p>
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
          :class="{active: isMaxActive === index}"
          v-for="(item, index) of navListData"
          :key="index"
        >
          <span class="title" @click="handleNavFn(index)">{{item.title}}</span>
          <ul class="nav_main">
            <li
              :class="{active_checked: n === isSmallActive}"
              v-for="(item,n) of item.data"
              @click="handleChildFn(n)"
              :key="n"
            >
              <span>{{item}}</span>
              <span>{{index==0 ? '('+(allConst[arrKeys[n]] || 0) +')' :'' }}</span>
            </li>
          </ul>
          <div class="line" v-show="index === 0">
            <span>|</span>
          </div>
        </div>
      </div>
      <ul class="handle_wrap">
        <li v-for="(item, index) of btnData" :key="index" @click="showDialogFn(index)">
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
    <div class="table_box">
      <router-view/>
    </div>
    <addBespeakDialog :isShow="isShowDialog" :event-refresh="updateConstData"></addBespeakDialog>
    <addPatients :isShow="isShowDialog" :event-refresh="updateConstData"/>
  </div>
</template>

<script>
import addPatients from "@/components/workbench/dialogs/DialogAddPatient";
import addBespeakDialog from "@/components/workbench/dialogs/DialogAddBespeak";
import { getWorkCount, getnNurseNum } from "@/api";
import monment from "moment";
export default {
  name: "",
  components: {
    addBespeakDialog,
    addPatients
  },
  props: {},
  data() {
    return {
      routeData:{},
      allConst: {},
      timer: "",
      arrKeys: ["numOfAppointment", "numOfVisiting", "numOfCharging", "numOfCallback"],
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
          data: ["预约", "就诊", "收费", "回访"]
        },
        {
          title: "全部",
          data: ["预约", "就诊", "收费", "回访"]
        }
      ],
      btnData: ["新增患者", "收费管理", "新增预约"],
      tableData: [],
      isMaxActive: 0,
      leftSmallActive: 0,
      rightSmallActive: 1,
      showData: {
        addPatientpage: false
      },
      isShowDialog: {
        patient: false,
        add: false,
        register: false,
        visibility: false
      },
      startTime: "",
      endTime: "",
      visitParames:{
        attr: "front",
        type: "need-deal",

      }
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
    let _this = this;
    // 新增预约刷新
    this.$root.Bus.$on("ChangeBespeakRefresh", () => {
      _this.initTime();
    });
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
    this.updateConstData();
    // this.getWorkbenchNumFn("");
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
    initTime() {
      
      this.getWorkbenchNumFn("");
    },
    getWorkbenchNumFn(id) {
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
      getnNurseNum(data).then(res => {
        // console.log(res)
        if (res.data.code == 200) {
          this.allConst = res.data.data;
        }
      });
    },
    handleIncome() {
      this.income = !this.income;
    },
    handleNavFn(num) {
      this.isMaxActive = num;
      num ? this.getWorkbenchNumFn("all") : this.getWorkbenchNumFn("");
      this.leftSmallActive = this.rightSmallActive = 0;
      if (num === 0) {
        this.$router.push({
          name: "ReceptionistBench",
          params: {
            menu: this.isMaxActive,
            sub: 0
          }
        });
      }
      if (num === 1) {
        this.$router.push({
          name: "rcallBespeak",
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
            name: "ReceptionistBench",
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 1) {
          this.initTime();
          this.$router.push({
            name: "rclinicTableCom",
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
            name: "rccharge",
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
            name: "rcreturnVisit",
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
            name: "rcallBespeak",
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 1) {
          this.$router.push({
            name: "rcallClinicTableCom",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 2) {
          this.$router.push({
            name: "rcallCharge",
            meta:this.routeData,
            params: {
              menu: this.isMaxActive,
              sub: num
            }
          });
        }
        if (num === 3) {
          this.$router.push({
            name: "rcallReturnVisit",
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
        this.$router.push({ name: "HargeManag" });
      } else {
        if (num == 0) {
          this.isShowDialog.patient = true;
        }
        if (num == 2) {
          this.isShowDialog.visibility = true;
        }
      }
    },
    updateConstData() {
      this.$children.map(val => {
        if (val.getAppointmentFn) val.getAppointmentFn();
      });

      getWorkCount().then(res => {
        if (res.data.code === 200) {
          this.titData = Object.assign({}, res.data.data);
        } 
      });
    }
  },
  beforeDestroy(){    
    window.clearInterval(this.timer); 
  },
  mixins: [],
  mounted() {
    this.routeData=this.$route.meta;
    // console.log(this.$route);
    let timestamp = new Date().getTime();
    this.endTime = this.getTimeTamp(timestamp);
    this.startTime = this.getTimeTamp(timestamp);

    let params = this.$route.params;
    if (params.menu) {
      this.isMaxActive = parseInt(params.menu);
      this.leftSmallActive = this.rightSmallActive = parseInt(params.sub);
    } else {
      this.isMaxActive = 0;
      this.leftSmallActive = this.rightSmallActive = 0;
    }

    parseFloat(params.menu)
      ? this.getWorkbenchNumFn("all")
      : this.getWorkbenchNumFn("");

    getWorkCount().then(res => {
      if (res.data.code === 200) Object.assign(this.titData, res.data.data);
    });
    this.timer = setInterval(() => {
      let _P = this.$route.params;
      parseFloat(_P.menu) ? this.getWorkbenchNumFn("all") : this.getWorkbenchNumFn("")
      getWorkCount().then(res => {
        if (res.data.code === 200) Object.assign(this.titData, res.data.data);
      });
    }, 1000 * 60 * 2);
  },

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
    .work_bench_wrap {
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
        * {
          -moz-user-select: none; /*火狐*/
          -webkit-user-select: none; /*webkit浏览器*/
          -ms-user-select: none; /*IE10*/
          -khtml-user-select: none; /*早期浏览器*/
          user-select: none;
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
    height: 112px;
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
  .add_reg {
    height: 400px;
    padding: 0 20px;
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    .btns_wrap {
      display: flex;
      justify-content: flex-end;
      text-align: center;
      line-height: 32px;
      .item {
        cursor: pointer;
        color: #3b78fd;
        width: 88px;
        height: 32px;
        border: 1px solid #3b78fd;
        margin-right: 20px;
      }
      .actives {
        color: #fff;
        background-image: linear-gradient(
          110deg,
          #4d9eff,
          #3c79fd 99%,
          #3b78fd
        );
      }
    }
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
.nav_wrap .el-tabs__content {
  /* margin-bottom: 30px; */
}
</style>
