<!--
@Author: ZJZ
@Date:   2019-11-04
@Filename: Received.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-07
-->

<template>
  <!-- 趋势分析 -->
  <div class="wrapper">
    <div class="main">
    <div class="header_box">
      <el-radio-group v-model="params.queryFlag" size="small" style="margin-right: 20px;">
        <el-radio-button label="0">日</el-radio-button>
        <el-radio-button label="1">月</el-radio-button>
      </el-radio-group>
      <div>
        <span style="marginRight:20px;">起止日期</span>
        <el-date-picker
          v-model="timeValue"
          :clearable="false"
          :editable="false"
          v-show="params.queryFlag == 0"
          value-format="yyyy-MM-dd"
          type="daterange"
          size="small"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <el-date-picker
          v-show="params.queryFlag == 1"
          v-model="mStartTime"
          type="month"
          size="small"
          value-format="yyyy-MM"
          :clearable="false"
          :editable="false"
          placeholder="选择月">
        </el-date-picker>

        <el-date-picker
          v-show="params.queryFlag == 1"
          v-model="mEndTime"
          type="month"
          value-format="yyyy-MM"
          size="small"
          :clearable="false"
          :editable="false"
          placeholder="选择月">
        </el-date-picker>

        <el-button type="primary" size="small" @click="searchData">搜索</el-button>
      </div>
    </div>

    <div class="view_box">
      <div class="title">
        <span>实收趋势图
          <i v-show="params.queryFlag == 0">（{{timeValue[0]}} ~ {{timeValue[1]}}）</i>
          <i v-show="params.queryFlag == 1">（{{mStartTime}} ~ {{mEndTime}}）</i>
        </span>
      </div>
      <div class="chart_box">
        <div class="chart" stlye="height:100%">
          <ve-line
            height="500px"
            :data="chartData"
            :legend-visible="false"
            :settings="chartSettings"
          ></ve-line>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { getTrendPatient, getTrendReturned, getTrendCharge } from '@/api'
import moment from 'moment'
export default {
  data() {
    return {
      mStartTime: moment().startOf("month").format("YYYY-MM"), //  moment().startOf("month").format("YYYY-MM-DD")
      mEndTime: moment().startOf("month").format("YYYY-MM"),
      params: {
        queryFlag: 0,
        startTime: moment().startOf("month").format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      timeValue: [moment().startOf("month").format("YYYY-MM-DD"),moment().format("YYYY-MM-DD")],
      chartSettings: {
        labelLine: {
          show: true
        },
        label: {
          show: true
        },
        area:true,
        lineStyle: {
          width: 5 //这里是为了突出显示加上的
        }
      },
      chartData: {
        columns: ["dateTime", "count"],
        rows: []
      }
    };
  },

  methods: {
    searchData() {
      if (!Number(this.params.queryFlag)) {   // 日
        let [start, end] = this.timeValue;
        this.params.startTime = start;
        this.params.endTime = end;
      } else {                               // 月
        if (moment(this.mEndTime).isBefore(this.mStartTime)) {
          this.$message.error('开始月份不应大于结束月份');
          return
        }
        this.params.startTime = this.mStartTime;
        this.params.endTime = this.mEndTime;
      }
      this._initChargeData()
    },

    _initChargeData() {
      getTrendCharge(this.params).then(res => {
        console.log( res )
        this.chartData.rows = res.data.data
      })
    }
  },
  mounted() {
    this.mStartTime =  moment().startOf("month").format("YYYY-MM")
    this.mEndTime = moment().startOf("month").format("YYYY-MM")
    this.params = {
      queryFlag: 0,
      startTime: moment().startOf("month").format("YYYY-MM-DD"),
      endTime: moment().format("YYYY-MM-DD")
    }
    this.timeValue = [moment().startOf("month").format("YYYY-MM-DD"),moment().format("YYYY-MM-DD")]
    this._initChargeData()
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  .main {
    flex: 2;
  }
}

.df() {
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_box {
  display: flex;
  margin-bottom: 20px;
}
.view_box {
  flex: 2;
  display: flex;
  flex-flow: column nowrap;
  background: #fff;
  .title {
    font-size: 14px;
    height: 50px;
    font-weight: bold;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
  }
  .chart_box {
    height: 100%;
    position: relative;
    display: flex;
    .chart {
      padding: 50px;
      width: 100%;
    }
  }
  .user_list {
    // margin-top: 40px;
    .item {
      padding: 8px 0;
      font-size: 14px;
      cursor: pointer;
      .df();
      justify-content: space-between;
      p {
        .df();
      }
      .round {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: chartreuse;
      }
    }
  }
}
</style>
