<template>
  <div class="wrapper">
    <div class="header_box">
      <el-radio-group v-model="params.queryFlag" size="small" style="margin-right: 20px;display:none;">
        <el-radio-button label="1">应收</el-radio-button>
        <el-radio-button label="2">实收</el-radio-button>
      </el-radio-group>
      <div>
        <span style="margin-right:20px;">起止日期</span>
        <el-date-picker
          v-model="timeValue"
          type="daterange"
          @change="changeTime"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="view_box">
      <div class="title">
        <span>
          医生开费占比
          <i v-show="params.startTime">（{{params.startTime}} ~ {{params.endTime}}）</i>
        </span>
      </div>
      <div class="chart_box">
        <div class="chart" stlye="height:100%" v-show="isData">
          <ve-ring
            height="500px"
            :data="chartData"
            :legend-visible="false"
            :graphic="graphic"
            :settings="chartSettings"
          ></ve-ring>
        </div>
        <div class="scroll_wrap" v-show="isData">
          <vuescroll :ops="ops">
            <ul class="user_list">
              <li class="item" v-for="(item, index) of listData" :key="index" @click="showDialogFn">
                <p>
                  <span class="round" style="margin-right:20px;"></span>
                  <span>{{item.doctorName}}</span>
                </p>
                <p>
                  <span>{{item.count}}</span>
                </p>
              </li>
            </ul>
          </vuescroll>
        </div>

        <div class="box" v-show="!isData">
          <span>暂无内容</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getApiDetail } from "@/api";
import vuescroll from "vuescroll";
import moment from "moment";
export default {
  components: { vuescroll },
  props: {},
  data() {
    return {
      isData: true,
      timeValue: [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
      ],
      radio: "1",
      listData: [],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "病患数量",
            textAlign: "center",
            fill: "#999",
            fontSize: 14
          }
        },
        {
          type: "text",
          left: "center",
          top: "55%",
          style: {
            text: "0",
            textAlign: "center",
            fill: "#000",
            fontSize: 28
          }
        }
      ],
      chartSettings: {
        labelLine: {
          show: true
        },
        label: {
          show: true
        },
        radius: [120, 150],
        offsetY: 280
      },
      chartData: {
        columns: ["doctorName", "count"],
        rows: []
      },
      dialogVisible: {
        show: false
      },
      params: {
        queryFlag: 1,
        startTime: moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      }
    };
  },
  watch: {
    "params.queryFlag": {
      handler(val) {
        this.params.queryFlag = val;
        this._initData();
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    showDialogFn() {},
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
      getApiDetail(this.params).then(res => {
        if (!res.data.data.length) {
          this.isData = false;
          return;
        }
        this.isData = true;
        let allAmount = 0;
        res.data.data.map(item => {
          allAmount += Number(item.count);
        });
        this.listData = res.data.data;
        this.graphic[1].style.text = `${allAmount.toFixed(1)}`;
        this.chartData.rows = res.data.data;
      });
    }
  },
  mixins: [],
  created() {
    this._initData();
  }
};
</script>
<style lang="less" scoped>
.df() {
  display: flex;
  justify-items: center;
  align-items: center;
}
.wrapper {
  display: flex;
  flex-flow: column nowrap;
}
.header_box {
  display: flex;
  margin-bottom: 20px;
}
.scroll_wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 300px;
  width: 20%;
  padding: 50px 0;
}
.box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
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
      width: 55%;
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
        background: #ccc;
      }
    }
  }
}
</style>