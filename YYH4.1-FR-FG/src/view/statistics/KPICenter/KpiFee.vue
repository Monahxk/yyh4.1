<template>
  <div class="wrapper">
    <div class="header_box">
      <el-radio-group v-model="params.queryFlag" size="small" style="margin-right: 20px;">
        <el-radio-button label="0">原价</el-radio-button>
        <el-radio-button label="1">折后价</el-radio-button>
        <el-radio-button label="2">实收</el-radio-button>
      </el-radio-group>
      <div>
        <span style="margin-right:20px;">起止日期</span>
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
                <li
                  class="item"
                  v-for="(item, index) of listData"
                  :key="index"
                  @click="showDialogFn(item)"
                >
                  <p>
                    <span class="round" style="margin-right:20px;"></span>
                    <span>{{item.doctorName}}</span>
                    <span style="margin:0 5px;">|</span>
                    <span style="color:#ccc;">{{item.rate}}</span>
                  </p>
                  <p>
                    <span>{{item.amount}} ></span>
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

    <el-dialog title="查看明细" :visible.sync="dialogVisible" width="960px">
      <div class="main">
        <el-table
          :data="tableData"
          max-height="450"
          height="450"
          style="width: 100%"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column
            v-for="(item, index) of tableTitle"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
				<el-row>
					<el-col :span="24" v-show="params.queryFlag == 0">
          	<el-button type="primary" @click="exportData" :loading="exploading">导 出</el-button>
					</el-col>
				</el-row>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getApiDoctor, getApiDoctorDetial,exportApiDoctorDetial } from "@/api";
import vuescroll from "vuescroll";
import moment from "moment";
export default {
  components: { vuescroll },
  props: {},
  data() {
    return {
      isData: true,
      exploading: false,
      timeValue: [
        moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
      ],
      radio: "1",
      listData: [],
      tableData: [],
      tableTitle: [
        {
          prop: "userName",
          label: "医生姓名"
        },
        {
          prop: "itemName",
          label: "项目名称"
        },
        {
          prop: "patientName",
          label: "患者姓名"
        },
        {
          prop: "price",
          label: "单价"
        },
        {
          prop: "itemNum",
          label: "数量"
        },
        {
          prop: "unit",
          label: "单位"
        },
        {
          prop: "amountMoney",
          label: "原价"
        },
        {
          prop: "discount",
          label: "折扣"
        }
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "总开费",
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
            text: "￥ 523.00",
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
        columns: ["doctorName", "amount"],
        rows: []
      },
      dialogVisible: false,
      params: {
        queryFlag: 0,
        startTime: moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      doctorId: '',
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
    showDialogFn({ doctorId }) {
      this.doctorId = doctorId;
      this.dialogVisible = true;
      let data = { doctorId };
      Object.assign(data, this.params);
      getApiDoctorDetial(data).then(res => {
        this.tableData = res.data.data;
      });
    },
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
      this.exploading = false;
      getApiDoctor(this.params).then(res => {
        if (!res.data.data.length) {
          this.isData = false;
          return;
        }
        this.isData = true
        let allAmount = 0;
        res.data.data.map(item => {
          allAmount += Number(item.amount);
        });
        this.listData = res.data.data;
        this.graphic[1].style.text = `￥ ${allAmount.toFixed(1)}`;
        this.chartData.rows = res.data.data;
      });
    },
    exportData() {
      this.exploading = true;
      exportApiDoctorDetial(Object.assign({doctorId: this.doctorId},this.params)).then(res => {
        let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '费用详情.xlsx'
        this.fileDownload(res.data, filename) // response.data是后端返回的二进制数据流，filename是获取到的导出文件名，获取失败使用默认值
        this.exploading = false;
      }).catch(res => {
        this.exploading = false;
      })
    },
    fileDownload(data, fileName) {
      const blob = new Blob([data], {
        type: 'application/octet-stream'
      })
      const filename = fileName || 'filename.xlsx'
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
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