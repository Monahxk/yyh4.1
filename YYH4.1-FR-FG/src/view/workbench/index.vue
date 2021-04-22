<!--
 * @Descripttion: 工作台
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-12 10:33:20
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-12 12:31:12
 -->
<template>
  <div class="main-wapper">
    <div class="wrok_bench_title">
      <div class="work_bench_wrap">
        <div class="item">
          <p>今日预约</p>
          <p>
            <span class="orange">0</span>
            <span class="samlls orange">人</span>
          </p>
        </div>
        <div class="item">
          <p>今日就诊</p>
          <p>
            <span class="red">0</span>
            <span class="samlls red">人</span>
          </p>
        </div>
        <div class="item">
          <p>新增患者</p>
          <p>
            <span class="blue">0</span>
            <span class="samlls blue">人</span>
          </p>
        </div>
        <div class="item" @click="handleIncome" style="cursor: pointer;">
          <p>今日实收</p>
          <p>
            <span class="samlls violet">￥</span>
            <span class="violet" v-if="isshowIncome">0</span>
            <span class="violet" v-if="!isshowIncome">-- --</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 中部导航 -->
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
      <div class="nav_center_box">
        <el-form :inline="true" :model="formSearch">
          <el-form-item label="">
            <el-date-picker
              size="small"
              v-model="formSearch.timeValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="nav_right_box"></div>
    </div>
    <div class="table_box">
      <router-view/>
    </div>
  </div>
</template>
<script>
import { getWorkCount, getnNurseNum, getWorkbenchNum} from "@/api";
import monment from "moment";
export default {
  data() {
    return {
      isshowIncome: true,
      allConst: {},
      arrKeys: ["numOfAppointment", "numOfVisiting", "numOfCharging", "numOfCallback"],
      isMaxActive: 0,
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
      leftSmallActive: 0,
      rightSmallActive: 1,
      formSearch: {
        timeValue: ''
      },
      //日期选择快捷键
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  computed: {
    isSmallActive() {
      return !this.isMaxActive ? this.leftSmallActive : this.rightSmallActive;
    }
  },
  watch:{
    $route(to,from){
      console.log(to)
      return
      if(to.name=='ReceptionistBench'){
        this.$router.push({
          name: "ReceptionistBench",
          params: {
            menu: this.isMaxActive,
            sub: num
          }
        });
      }
    }
  },
  created() {
    let timestamp = new Date().getTime();
    let endTime = this.getTimeTamp(timestamp);
    let startTime = this.getTimeTamp(timestamp);
    this.formSearch.timeValue = [startTime,endTime];
  },
  methods: {
    handleNavFn(num) {
      this.isMaxActive = num;
    },
    handleChildFn(num) {
      !this.isMaxActive
        ? (this.leftSmallActive = num)
        : (this.rightSmallActive = num);
    },
    handleIncome() {
      this.isshowIncome = !this.isshowIncome;
    },
    getDoctorHeader() {
      let params = {}
      getWorkbenchNum(params).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.allConst = res.data.data;
        }
      });
    },
    getTimeTamp(t) {
      return monment(t).format("YYYY-MM-DD");
    },
  }
}
</script>
<style lang="less" scoped>
.main-wapper {
  height: 100%;
  display: flex;
  flex-flow: column;
  
  .wrok_bench_title{
    display: flex;
    align-items: flex-end;

    .work_bench_wrap{
      color: #1b1e25;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .item{
        display: flex;
        flex-flow: column;
        justify-content: center;
        height: 96px;
        margin-right: 20px;
        padding: 0 30px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        user-select: none;

        p:nth-child(1) {
          font-size: 16px;
          padding-bottom: 10px;
        }

        p:nth-child(2) {
          font-size: 40px;
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
        .samlls {
          font-size: 14px;
        }
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
          }
        }
        .active_checked {
          border-bottom: 2px solid #7874f2;
        }
      }
      .active span,
      .active li {
        color: #493bfd !important;
      }
      .active .nav_main {
        width: auto;
        transition: all 0.1s easy;
      }
    }
    .nav_center_box {
      .el-form-item {
        margin-bottom: 0;
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

  .table_box {
    flex-grow: 1;
    background-color: #fff;
  }
}
</style>