<template>
  <div class="over_wrapper">
    <div class="time_box">
      <span style="marginRight:20px;">起止日期</span>
      <el-date-picker
          :clearable="false"
          :editable="false"
          v-model="timeValue"
          type="daterange"
          @change="changeTime"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>
    </div>

    <div class="main">
      <div class="title">
         <span>
          新增患者来源统计
          <i v-show="params.startTime">（{{params.startTime}} ~ {{params.endTime}}）</i>
        </span>
      </div>
      <div class="main_view" >
        <div class="view_left" >
          <ve-histogram
            :data="chartData"
            :legend-visible="false"
            height="600px"
            :settings="chartSettings"
          ></ve-histogram>
        </div>
        <div class="view_right" v-show="chartData.rows.length !=0 ">
          <h4>新增患者来源排名</h4>
          <ul class="view_list">
            <li class="item_list" v-for="(item, index) in chartData.rows " :key="index">
              <p class="item">
                <span :class="{active: index < 3}">{{ index + 1 }}</span>
                <span>{{item.patientSourceName}}</span>
              </p>
              <p>{{item.count}}</p>
            </li>
          </ul>
        </div>
      <div class="box" v-show="chartData.rows.length == 0">
        <span>暂无数据</span>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getViewPatient } from '@/api'
export default {
  components: {},
  props: {},
  data() {
    return {
      chartSettings: {
        labelLine: {
          show: true
        },
        label: {
          show: true
        },
        itemStyle: {
          color: "#5BC2FE"
        },
        radius: [80, 70],
        offsetY: "50%"
      },
      timeValue: [
        moment().startOf("month").format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
      ],
      params: {
        startTime: moment().startOf("month").format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      chartData: {
        columns: ["patientSourceName", "count"],
        rows: []
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    changeTime(val) {
      if (val) {
        let [start, end] = val;
        this.params.startTime = start;
        this.params.endTime = end;
      } else {
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this._initData();
    },
    _initData() {
      getViewPatient(this.params).then(res => {
        this.chartData.rows = res.data.data
      })
    }
  },
  mixins: [],
  mounted() {
    this._initData()
  }
};
</script>
<style lang="less" scoped>
.over_wrapper {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
.main {
  flex: 2;
  box-shadow: 0 0 6px 0 #e4e9ff;
  margin-top: 20px;
  background: #fff;
  .title {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
  }
  .main_view {
    height: 100%;
    padding: 0 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .view_left {
      width: 70%;
    }
    .view_right {
      padding: 20px;
      width: 25%;
      h4 {
        height: 40px;
        line-height: 40px;
      }
      .view_list {
        // display: flex;
        // justify-content: space-between;
        .item_list {
          width: 100%;
          display: flex;
          padding: 10px 0;
          align-items: center;
          justify-content: space-between;
          .item {
            display: flex;
            align-items: center;
            span:nth-child(1) {
              width: 20px;
              height: 20px;
              color: #fff;
              text-align: center;
              line-height: 20px;
              border-radius: 50%;
              margin-right: 20px;
              background: rgb(181, 190, 209);
            }
            .active {
              background: #5BC2FE !important;
            }
          }
        }
      }
    }
  }
}
</style>