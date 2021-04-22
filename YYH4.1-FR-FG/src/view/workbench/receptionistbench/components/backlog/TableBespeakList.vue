<!--
 * @Descripttion: 前台工作台 预约
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-08 17:28:36
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 16:24:55
 -->
<template>
  <div class="wrapper_workbench_table" id="wrapper_workbench_table">
    <el-date-picker
      @change="timeChange"
      class="bordernone allTime"
      value-format="yyyy-MM-dd"
      v-model="timeSlot"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="mini"
      :picker-options="pickerOptions"
      :clearable="true"
    ></el-date-picker>
    <div class="wrapper_table" id="wrapper_table">
      <!-- 列表 -->
      <el-table
        highlight-current-row
        ref="singleTable"
        @current-change="handleTableChange"
        :data="tableDataList"
        :height="tableHeight"
        style="font-size: 14px"
        v-loading="tableLoading"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <div style="padding: 50px 0;">
            <p style="width:300px;margin: auto;">
              <img src="../../../../../assets/img/workbench/img_workbench_table_bg.png" alt />
            </p>
          </div>
        </template>

        <el-table-column
          v-for="(item,index) in tabletitle "
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column prop="appointmentVisitTrack.statusText" label="预约状态">
          <template slot-scope="scope">
            <span
              :class="{red:scope.row.appointmentVisitTrack.statusText == '已超时' , blue:scope.row.appointmentVisitTrack.statusText == '未到'  }"
            >{{scope.row.appointmentVisitTrack.statusText}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="appointmentVisitTrack.remark" label="备注" width="120"> </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="moreEvent(0,scope.row)">
                  <span class="setIcon"></span>挂号
                </el-dropdown-item>
                <el-dropdown-item @click.native="moreEvent(1,scope.row)">
                  <span class="outIcon"></span>修改预约
                </el-dropdown-item>
                <el-dropdown-item @click.native="moreEvent(2, scope.row)">
                  <span class="outIcon"></span>取消预约
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_bottom">
      <div class="pagination_box">
        <div class="block">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[4, 10, 15, 20]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager-count="9"
            :total="this.params.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="dialogBox">
      <el-dialog :visible.sync="outDialogVisible" width="318px" align="ctnter">
        <span>{{operationMsg}}</span>
        <span slot="footer">
          <el-button size="mini" @click="outDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="DialogVisible">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <IframeDialog
        :iframeVisible="iframeParam"
        :event-refresh="eventRefresh"
        v-if="detection"
        @on-click="testFn"
      />
      <!-- 修改预约 -->
      <addBespeakDialog
        :isShow="bespeakDialog"
        :info="userinfo"
        :rowId="rowId"
        :isEdit="true"
        :event-refresh="eventRefresh"
      />
      <!-- 挂号 -->
      <register :isShow="editReferral" :userinfo="sendUserinfo" :event-refresh="eventRefresh" />
    </div>
  </div>
</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import register from "@/components/workbench/dialogs/DialogsAddRegister";
import addBespeakDialog from "@/components/workbench/dialogs/DialogAddBespeak";

import monment from "moment";
import {
  getAppointment,
  deleteAppointment,
  getAppointmentData,
  getEditBespeakBackfilling
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  name: "bespeak",
  components: {
    IframeDialog,
    register,
    addBespeakDialog
  },
  props: {
    datalist: {
      default: 0
    },
    titlelist: [],
    operationbut: [],
    totals: {
      default: 0
    }
  },
  data() {
    return {
      endTime: "",
      startTime: "",
      timeSlot: [],
      tableHeight: 592,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      detection: false,
      userinfo: {
        rowId: ""
      },
      sendUserinfo: {
        patientId: "",
        patientName: "",
        clinicNo: "",
        mobilephone: "",
        add: true
      },
      rowId: "",
      timer: "",
      page: 1,
      pageSize: 10,
      total: 1,
      listTotal: 0,
      textarea3: "",
      operationMsg: "",
      tabsArr: ["first", "second", "third", "four", "five", "six", "seven"],
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: "",
        doctor: {
          id: ''
        },
        nurse: {
          id: ''
        }
      },
      isShowDialog: {
        register: false,
        patientName: "",
        clinicNo: "",
        mobilphone: "",
        patientId: ""
      },

      bespeakDialog: {
        visibility: false,
        isSearch: true,
        patientId: ""
      },
      editReferral: {
        register: false,
        registerId: ""
      },
      form: {
        name: "",
        region: ""
      },
      outDialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "960px",
      tableDataList: [],
      tabletitle: [
        {
          prop: "appointmentVisitTrack.patientName",
          label: "患者姓名"
        },
        {
          prop: "emrNo",
          label: "病历号"
        },
        {
          prop: "patientMobile",
          label: "手机号"
        },
        {
          prop: "age",
          label: "年龄"
        },
        {
          prop: "appointmentVisitTrack.registerTime",
          label: "预约时间",
          width: '150px',
          formatter: function(row, column, cellValue) {
            return monment(cellValue).format("YYYY-MM-DD HH:mm");
          }
        },
        {
          prop: "departmentName",
          label: "预约科室"
        },
        {
          prop: "doctorName",
          label: "预约医生"
        },
        {
          prop: "appointItemsText",
          label: "预约项目"
        },
        {
          prop: "appointmentVisitTrack.returnVisitText",
          label: "初复诊"
        },
        // {
        //   prop: "appointmentVisitTrack.statusText",
        //   label: "预约状态"
        // },
        // {
        //   prop: "appointmentVisitTrack.remark",
        //   label: "备注"
        // }
      ],
      courseInfo: "",
      oldTableDataList: "",
      tableData: [],
      loading: true,
      courseId: "",
      pagerCount: "",
      treatmentStatue: false,
      activeIndex: "",
      yyztArr: ["未到", "已超时"],
      params: {
        total: 0,
        page: 1,
        startTime: "",
        pageSize: 10,
        endTime: "",
        type: "pending"
      },
      tableLoading: false
    };
  },
  created() {
    this.params.status=this.$route.meta.status;
    this.params.type=this.$route.meta.type;
    this.getSessionDate();
    this.pagerCount = this.tableDataList.length;
    this.getAppointmentFn();
    this.upDateTime();
  },
  clearTimer() {
    window.clearInterval(this.timer);
  },
  watch: {
    $route(val) {
      this.getSessionDate();
      this.params.total = 0;
      this.params.page = 1;
      this.params.pageSize = 10;
      this.params.type = val.meta.type;
      this.getAppointmentFn();
      this.upDateTime();
    }
  },
  computed: {},
  methods: {
    timeChange(val) {
      if(val) {
        this.setSessionDate();
        this.params.startTime = val[0];
        this.params.endTime = val[1];
      }
      this.params.total=0;
      this.params.page=1;
      this.getAppointmentFn();
      this.upDateTime();
    },
    getTimeTamp(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    upDateTime() {
      this.$root.Bus.$emit("ChangeTimeRefresh", this.timeSlot);
    },
    testFn() {
      this.getAppointmentFn();
      this.detection = false;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    // ------------------------------------------
    // 更新视图
    eventRefresh() {
      if (this.$parent.updateConstData) this.$parent.updateConstData();
    },
    // ------------------------------------------
    // 获取列表Date
    getAppointmentFn() {
      this.tableLoading = true;
      getAppointmentData(this.params).then(res => {
        this.tableLoading = false;
        if (res.data.code === 200) {
          if (this.tableHeight == 0) {
            this.setTableHeight();
          }
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.params.total = res.data.totalNumber;
            let _D = res.data.data;
            this.tableDataList = _D.map(v => {
              v.visitTime = this.getTime(v.visitTime);
              return v;
            });
          }
        }
      });
    },
    // 设置行选中
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    // 点击行选中
    handleTableChange(val) {
      this.treatmentStatue = true;
      this.currentRow = val;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getAppointmentFn();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getAppointmentFn();
    },
    // 详情
    IndexEvent(row) {
      this.detection = true;
      this.$store.commit("SET_ROW_ID", row.id);
      let p = row.appointmentVisitTrack.patientId;
      this.$store.dispatch("GET_PATIENT_MSG", p);
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "second";
      this.iframeParam.id = p;
      this.iframeParam.doctor.id = row.doctorId;
    },
    moreEvent(i, val) {
      if (i === 0) {
        let id = val.appointmentVisitTrack.id;
        Object.assign(this.sendUserinfo, val);
        this.sendUserinfo.rowId = val.appointmentVisitTrack.id;
        this.sendUserinfo.patientId = val.appointmentVisitTrack.patientId;
        this.sendUserinfo.patientName = val.appointmentVisitTrack.patientName;
        this.sendUserinfo.mobilephone = val.patientMobile;
        this.editReferral.register = true;
      }
      if (i === 1) {
        this.bespeakDialog.visibility = true;
        this.userinfo = val;
        this.userinfo.mobilphone = val.patientMobile;
        this.userinfo.patientId = val.appointmentVisitTrack.patientId;
        this.userinfo.patientName = val.appointmentVisitTrack.patientName;
        this.rowId = val.appointmentVisitTrack.id;
      }
      if (i === 2) {
        this.$confirm("确定要取消预约吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteAppointment(val.appointmentVisitTrack.id).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.getAppointmentFn();
              this.$root.Bus.$emit("ChangeBespeakRefresh");
              this.$root.Bus.$emit("ChangeConstRefresh");
            }
          });
        });
      }
    },
    // 退出询问
    DialogVisible() {
      this.outDialogVisible = false;
    },
    setTableHeight() {
      let height = document.getElementById("wrapper_table").offsetHeight;
      this.tableHeight = height;
    },
    setSessionDate() {
      sessionStorage.setItem('startTime', this.timeSlot[0]);
      sessionStorage.setItem('endTime', this.timeSlot[1]);
    },
    getSessionDate() {
      let timestamp = new Date().getTime();
      let time = this.getTimeTamp(timestamp);
      let endTime = sessionStorage.getItem('endTime') || time;
      let startTime = sessionStorage.getItem('startTime') || time;
      this.timeSlot[0] = startTime;
      this.timeSlot[1] = endTime;
      this.params.startTime = startTime;
      this.params.endTime = endTime;
    }
  },
  mixins() {},
  // beforeDestroy(){
  //   window.clearInterval(this.timer);
  // },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight();
    });
  }
};
</script>
<style  scoped>
.allTime {
  margin-right: 50px;
  color: #493bfd !important;
  line-height: 46px;
  cursor: pointer;
  font-size: 16px;
  z-index: 2;
  position: absolute;
  left: 750px;
  top: -61px;
  box-shadow: 0 0 6px 0 #e4e9ff;
}
.red {
  color: #ff485f;
}
.blue {
  color: #28c0f5;
}
.dialog_content {
  height: 458px;
  /* overflow:auto; */
  width: 100%;
}
.dialog_content_center {
  margin: 5px auto;
  width: 892px;
}
.dialog_row {
  height: 40px;
}
.key {
  width: 77px;
}
.val {
  margin-right: 46px;
}

.dialog_tabs {
  height: 400px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #ffffff;
}
.dialog_tabs_title {
  line-height: 43px;
  height: 43px;
  background-color: #f7f9ff;
}
.title_text {
  width: 64px;
  height: 22px;
  font-family: PingFangSC;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1b1e25;
  margin-left: 37px;
}
.dialog_tabs_row {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
.dialog_tabs_row_left {
  width: 50%;
  float: left;
}
.dialog_tabs_row_right {
  width: 50%;
  float: left;
}
.title_name {
  width: 78px;
}
.el-table::before {
  display: none;
}
.wrapper_workbench_table {
  height: 100%;
  box-shadow: none;
}
</style>
