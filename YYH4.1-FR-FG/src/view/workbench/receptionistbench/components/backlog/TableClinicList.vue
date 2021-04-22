<!--
 * @Descripttion: 
 * @version: V2.0
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 16:24:08
 -->
<template>
  <div class="wrapper_workbench_table" id="wrapper_workbench_tables">
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
      size="small"
      :picker-options="pickerOptions"
      v-if="isshow"
    ></el-date-picker>
    <div class="wrapper_table" id="wrapper_table">
      <el-table
        highlight-current-row
        :height="tableHeight"
        ref="singleTable"
        @row-click="handleTableChange"
        :data="tableDataList"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <div style="padding: 50px 0;">
            <p style="width:300px;margin: auto;">
              <img src="../../../../../assets/img/workbench/img_workbench_table_bg.png" alt />
            </p>
          </div>
        </template>

        <el-table-column prop="patientName" label="患者姓名" sortable width="120" align="center">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.patientName}}</span>
              <span v-if="scope.row.arrearFlag" class="owe">欠</span>
            </div>
            <ul class="add_title">
              <li
                v-for="(item, index) in scope.row.labelList"
                :style="{backgroundColor:item.labelConfig.color}"
                :key="index"
              >
                <span>{{item.labelConfig.abbreviate}}</span>
              </li>
            </ul>
          </template>
        </el-table-column>

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

        <el-table-column prop="item.status" label="就诊状态" width="120" align="center">
          <template slot-scope="scope">
            <span :class="tabsArr[scope.row.status]">{{scope.row.statusName}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" v-if="isDoctor">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="moreEvent(0,scope.row)"
                  v-if="scope.row.status != '4' && scope.row.status != '10'"
                >
                  <span class="outIcon"></span>修改挂号
                </el-dropdown-item>
                <el-dropdown-item @click.native="moreEvent(1, scope.row)">
                  <span class="outIcon"></span>作废挂号
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" v-if="! isDoctor">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="doctorMoreEvent(0,scope.row)"
                  v-if="scope.row.status != Constants.TYPE_DOCTORBENCH_ZERO && scope.row.status != '10' && scope.row.status != '4'"
                >
                  <span class="outIcon"></span>修改挂号
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="doctorMoreEvent(1, scope.row)"
                  v-if="scope.row.status != Constants.TYPE_DOCTORBENCH_ZERO"
                >
                  <span class="outIcon"></span>作废挂号
                </el-dropdown-item>

                <el-dropdown-item
                  @click.native="doctorMoreEvent(2,scope.row)"
                  v-if="scope.row.status == Constants.TYPE_DOCTORBENCH_ZERO"
                >
                  <span class="outIcon"></span>挂号
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="doctorMoreEvent(3,scope.row)"
                  v-if="scope.row.status == Constants.TYPE_DOCTORBENCH_ZERO"
                >
                  <span class="outIcon"></span>修改预约
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="doctorMoreEvent(4, scope.row)"
                  v-if="scope.row.status == Constants.TYPE_DOCTORBENCH_ZERO"
                >
                  <span class="outIcon"></span>取消预约
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_bottom">
      <!-- 分页 -->
      <div class="but_box" v-if="treatmentStatue">
        <button
          v-for="(item, index) of butArr"
          :key="index"
          class="start_but"
          :class="{but_avtive : activeIndex===index}"
          @click="butEvent(index)"
        >{{item}}</button>
      </div>
      <div class="pagination_box">
        <div class="block">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[ 4,10, 20, 30]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager-count="9"
            :total="params.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="dialogBox">
      <el-dialog :visible.sync="outDialogVisible" width="318px" align="ctnter">
        <span>{{operationMsg}}</span>
        <span slot="footer" class="dialog-footer">
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
      <registerDialogs :isShow="editReferral" :userinfo="userinfo" :event-refresh="eventRefresh" />
      <!-- 转诊 -->
      <addReferralDialog
        :isShow="isShowDialog"
        :userinfo="currentRow"
        @event-refresh="eventRefresh"
      ></addReferralDialog>
      <!-- 修改预约 -->
      <addBespeakDialog
        :isShow="bespeakDialog"
        :info="appUserinfo"
        :rowId="appRowId"
        :isEdit="true"
        :event-refresh="eventRefresh"
      />
    </div>
  </div>
</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import monment from "moment";
import registerDialogs from "@/components/workbench/dialogs/DialogsAddRegister";
import addReferralDialog from "@/components/workbench/dialogs/DialogsAddReferral";
import addBespeakDialog from "@/components/workbench/dialogs/DialogAddBespeak";
import {
  SYSTEM_HTTP_SUCCESS,
  STATUS_VISIT_STATUSARR,
  STATUS_VISIT_FIRST,
  STATUS_VISIT_AGAIN,
  TYPE_PHYSICAL_MAN,
  TYPE_WORKBEN_SEXARR,
  FLAG_BACK_YES
} from "@/constant";
import {
  getRecepAppointmentPatient,
  getRecepAppointmentAllPatient,
  putDentalPatientInfo,
  delatePatient,
  getVisitData,
  deleteAppointment
} from "@/api";
export default {
  name: "clinicTableCom",
  components: {
    IframeDialog,
    // ChargeApplyDialog,
    registerDialogs,
    addReferralDialog,
    addBespeakDialog
  },
  props: {
    datalist: {
      default: 0
    },
    titlelist: [Array],
    operationbut: [Array],

    totals: {
      default: 0
    }
  },
  data() {
    return {
      bespeakDialog: {
        visibility: false,
        isSearch: true,
        patientId: ""
      },
      endTime: "",
      startTime: "",
      timeSlot: [],
      isDoctor: true,
      isshow: false,//显示筛选日期
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
      thisShow: true,
      labelData: [],
      timer: "",
      total: 1,
      page: 1,
      pageSize: 10,
      totalPage: 0,
      listTotal: 0,
      operationMsg: "",
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: "",
        addRV: false,
        doctor: {
          id: ''
        },
        nurse: {
          id: ''
        }
      },
      outDialogVisible: false,
      isShowDialog: {
        patient: false,
        add: false,
        register: false,
        addPage: false
      },
      editReferral: {
        register: false,
        registerId: ""
      },
      params: {
        total: 0,
        page: 1,
        startTime: "",
        pageSize: 10,
        endTime: "",
        type: "",
        firststatus: "",
        status: ""
      },
      userinfo: {
        patientId: "",
        patientName: "",
        clinicNo: "",
        telephone: "",
        edit: true
      },
      tableDataList: [],
      tabletitle: [
        {
          prop: "emrNo",
          label: "病历号"
        },
        {
          prop: "registerTime",
          label: "挂号时间",
          width: '150px',
          formatter: function(row, column, cellValue) {
            return monment(cellValue).format("YYYY-MM-DD HH:mm");
          }
        },
        {
          prop: "mobilephone",
          label: "手机号"
        },
        {
          prop: "doctorName",
          label: "诊治医生"
        },
        {
          prop: "projectName",
          label: "项目"
        },
        {
          prop: "returnVisitName",
          label: "初复诊"
        }
      ],
      courseInfo: "",
      oldTableDataList: "",
      tableData: [],
      iframeShow: true,
      loading: true,
      courseId: "",
      currentRow: {},
      pagerCount: 1,
      treatmentStatue: false,
      butArr: ["开始治疗", "完成治疗", "结束就诊", "转诊", "回退"],
      tabsArr: [
        "color0",
        "color1",
        "color2",
        "color3",
        "color4",
        "color5",
        "color6",
        "color7",
        "color8",
        "color9"
      ],
      activeIndex: "",
      tableHeight: 300,
      appRowId: "",
      appUserinfo: {
        patientId: "",
        patientName: "",
        clinicNo: "",
        telephone: "",
        edit: true
      }
    };
  },

  watch: {
    $route(val) {
      this.initData();
    }
  },
  created() {
    this.initData()
  },
  computed: {},
  mounted() {
    this.setTableHeight();
  },
  methods: {
    initData() {
      this.params.type = this.$route.meta.attr;
      if (this.$route.meta.attr === "front") {
        this.isDoctor = true;
      } else {
        this.isDoctor = false;
      }
      //不是医生登录就不加载数据
      //isdoctor 在全局utils/GlobeFindComponent/.js
      if(!this.isdoctor && this.params.type == 'doctor') {
        this.isshow  = false;
        return;
      } else {
        this.isshow  = true;
      }

      this.params.firststatus = this.$route.meta.firststatus;
      this.params.status = this.$route.meta.status;
      this.getSessionDate();
      this.getAppointmentFn();
      this.upDateTime();
    },
    timeChange(val) {
      if(val) {
        this.setSessionDate();
        this.params.startTime = val[0];
        this.params.endTime = val[1];
      }
      this.params.total = 0;
      this.params.page = 1;
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
      this.detection = false;
      this.getAppointmentFn();
    },
    // 设置行选中
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    // 点击行选中
    handleTableChange(val) {
      //前台工作台不显示，治疗操作
      if(this.$route.meta.attr == 'front') {
        return;
      }
      this.treatmentStatue = true;
      this.currentRow = val;
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
    IndexEvent(row) {
      this.detection = true;
      this.$store.commit("SET_ROW_ID", row.id);
      let patientId = row.appointmentVisitTrack.patientId;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "second";
      this.iframeParam.doctor.id = row.doctorId;

    },
    moreEvent(i, row) {
      if (i === 2) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = this.tabsArr[i];
      }
      if (i === 3) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = this.tabsArr[i];
      }
      if (i === 5) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = this.tabsArr[i];
        this.iframeParam.addRV = true;
      }
      // 修改挂号
      if (i === 0) {
        let id = row.id;
        Object.assign(this.userinfo, row);
        this.editReferral.register = true;
        this.userinfo.edit = true;
      }
      if (i === 1) {
        this.confirm("作废该挂号？").then(() => {
          delatePatient(row.id).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.$root.Bus.$emit("ChangeConstRefresh");
              this.getAppointmentFn();
            }
          });
        });
      }
    },
    doctorMoreEvent(i, val) {

      // 修改挂号
      if (i === 0) {
        let id = val.id;
        Object.assign(this.userinfo, val);
        this.editReferral.register = true;
      }
      if (i === 1) {
        this.confirm("作废该挂号？").then(() => {
          delatePatient(val.id).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.$root.Bus.$emit("ChangeConstRefresh");
              this.getAppointmentFn();
            }
          });
        });
      }
      // 挂号
      if (i === 2) {
        let id = val.id;
        this.userinfo.edit = false;
        this.userinfo.brShow = true;
        Object.assign(this.userinfo, val);
        this.userinfo.rowId = val.id;
        this.userinfo.add = true;
        this.editReferral.register = true;
      }
      // 修改
      if (i === 3) {
        this.bespeakDialog.visibility = true;
        this.appUserinfo = val;
        this.appUserinfo.mobilphone = val.phoneNumber;
        this.appUserinfo.patientId = val.patientId;
        this.appRowId = val.id;
      }
      // 预约
      if (i === 4) {
        this.$confirm("确定要取消预约吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteAppointment(val.id).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.getAppointmentFn();
              this.$root.Bus.$emit("ChangeBespeakRefresh");
              this.$root.Bus.$emit("ChangeConstRefresh");
            }
          });
        }).catch(err => {
          console.log(err)
        });
      }
    },
    messageFn(status, text) {
      this.$message({
        message: `[警告]，当前患者状态为 ${STATUS_VISIT_STATUSARR[status]},${text}`,
        type: "warning"
      });
    },
    confirm(val) {
      return this.$confirm(`此操作将${val}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    currentRowFn(index) {
      let status = parseInt(this.currentRow.status);
      // console.log(status);
      switch (index) {
        case 0:
          return status !== 1 ? this.messageFn(status, "已经开始治疗") : true;
          break;
        case 1:
          return status <= 1 || status == 9
            ? this.messageFn(status, "无法完成治疗")
            : true;
          break;
        case 3:
          return status < 1 || status > 2
            ? this.messageFn(status, "无法转诊")
            : true;
          break;
        case 4:
          return status > 3 || status <= 1
            ? this.messageFn(status, "无法回退")
            : true;
          break;
      }
    },
    // 下面四个按钮
    butEvent(i) {
      if (i === 0 && this.currentRowFn(i)) {
        this.confirm("开始治疗")
          .then(() => {
            putDentalPatientInfo({
              id: this.currentRow.id,
              status: 2,
              backflag: 0
            }).then(res => {
              if (res.data.code === SYSTEM_HTTP_SUCCESS) {
                this.getAppointmentFn();
              }
            });
          })
          .catch(() => {});
      }
      if (i === 1 && this.currentRowFn(i)) {
        this.confirm("完成治疗")
          .then(() => {
            putDentalPatientInfo({
              id: this.currentRow.id,
              status: 3,
              backflag: 0
            }).then(res => {
              if (res.data.code === SYSTEM_HTTP_SUCCESS) {
                this.getAppointmentFn();
              }
            });
          })
          .catch(() => {});
      }
      if (i === 2) {
        this.confirm("结束治疗")
          .then(() => {
            putDentalPatientInfo({
              id: this.currentRow.id,
              status: 9,
              backflag: 0
            }).then(res => {
              if (res.data.code === SYSTEM_HTTP_SUCCESS) {
                this.getAppointmentFn();
              }
            });
          })
          .catch(() => {});
      }
      if (i === 3 && this.currentRowFn(i)) {
        this.isShowDialog.addPage = !this.isShowDialog.addPage;
      }
      if (i === 4 && this.currentRowFn(i)) {
        this.confirm("是否进行回退？")
          .then(() => {
            putDentalPatientInfo({
              backflag: FLAG_BACK_YES,
              status: this.currentRow.status,
              id: this.currentRow.id
            }).then(res => {
              if (res.data.code === SYSTEM_HTTP_SUCCESS) {
                this.getAppointmentFn();
              }
            });
          })
          .catch(() => {});
      }
    },
    // 退出询问
    DialogVisible() {
      this.outDialogVisible = false;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },

    // 更新视图
    eventRefresh(type) {
      if (this.$parent.updateConstData) this.$parent.updateConstData();
      if (type === "referral") {
        this.getAppointmentFn();
      }
    },
    getAppointmentFn() {
      getVisitData(this.params).then(res => {
        if (res.data.code === 200) {
          let _D = res.data.data;
          this.params.total = res.data.totalNumber;
          this.tableDataList = _D;
          this.setTableHeight();
        }
      });
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
    },
    setTableHeight() {
      this.$nextTick(() => {
        let height = document.getElementById("wrapper_table").offsetHeight;
        this.tableHeight = height;
      });
    }
  },
  mixins() {},
  beforeDestroy() {
    window.clearInterval(this.timer);
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
.owe {
  color: #ff4871;
  border-radius: 50%;
  padding: 0px 2px;
  border: 1px solid #ff4871;
}
.color0 {
  color: #ff485f;
}
.color1 {
  color: #7ed321;
}
.color2 {
  color: #28c0f5;
}
.color3 {
  color: #28c0f5;
}
.color4 {
  color: #f77e1b;
}
.color5 {
  color: #797979;
}
.color6 {
  color: #ff4871;
}
.color7 {
  color: #ff4871;
}
.color8 {
  color: #797979;
}
.color9 {
  color: #7ed321;
}
.add_title {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 22px;
  text-align: center;
  margin-top: 5px;
}
.add_title li {
  font-size: 12px;
  width: 22px;
  height: 22px;
  margin: 0 5px;
  border-radius: 100%;
  color: #fff;
}
.el-table::before {
  display: none;
}
</style>
<style>
/* 修改ele样式 */

.pagination_box .block .el-pagination span {
  color: #4d9eff;
}
.pagination_box .el-input__inner {
  color: #4d9eff;
  border: 1px solid #4d9eff;
}
.pagination_box .el-select .el-input .el-select__carett {
  color: #4d9eff !important;
}
.pagination_box .number {
  color: #4d9eff !important;
  background: #fff !important;
  border: 1px solid #4d9eff !important ;
}
.pagination_box .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  color: #4d9eff !important;
}
.pagination_box
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  color: #fff !important;
  background: #4d9eff !important;
  border: none;
}
/* 退出弹出框 */
.wrapper_workbench_table .dialogBox .el-dialog {
  border-radius: 4px;
  margin: 0;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
}
.wrapper_workbench_table .dialogBox .el-dialog__body {
  font-family: PingFangSC;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.85);
}

.wrapper_workbench_table .dialogBox .el-dialog__body {
  padding: 45px 20px;
}
.wrapper_workbench_table .dialogBox .el-dialog__footer {
  height: 53px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid #ccc !important;
}
#wrapper_workbench_tables .el-table__empty-block {
  /* min-height: 345px; */
}
</style>
