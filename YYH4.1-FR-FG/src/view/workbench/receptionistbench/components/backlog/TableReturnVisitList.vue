<!--
 * @Descripttion: 
 * @version: V2.0
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 16:45:26
 -->
<template>
  <div class="wrapper_workbench_table">
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
    <div class="wrapper_table" id='wrapper_table'>
      <el-table
        ref="singleTable"
        :data="tableDataList"
        :height="tableHeight"
        highlight-current-row
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <div style="padding: 50px 0;">
            <p style="width:300px;margin: auto;">
              <img src="../../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
            </p>
          </div>
        </template>

        <el-table-column
          v-for="(item,index) in tabletitle "
          :key="index"
          :prop="item.prop"
          :label="item.label"
          width="item.width"
          :formatter="item.formatter"
          align="center"
          sortable
        ></el-table-column>

        <el-table-column prop="callback.status" label="回访状态" width="120" align="center">
          <template slot-scope="scope">
            <span
              :class="{red:scope.row.callback.status ==0, 
              green:scope.row.callback.status ==1,
               blue:scope.row.callback.status ==2}"
            >{{scope.row.callback.statusName}}</span>
          </template>
        </el-table-column>
        <!--  ["未回访", "已回访", "回访待定" , "取消回访"]  -->
        <!--
          0 未回访 编辑、取消回访、完成回访
          1 回访中 编辑、取消回访、完成回访
          2 已取消 新增回访
          3 已回访 新增回访
        -->
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="moreEvent(1,scope.row) "
                  v-if="scope.row.status != 3"
                >
                  <span class="outIcon"></span>取消回访
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="moreEvent(2,scope.row) "
                  v-if="scope.row.status != 3"
                >
                  <span class="outIcon"></span>完成回访
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="moreEvent(3, scope.row)"
                  v-if="scope.row.status == 3"
                >
                  <span class="outIcon"></span>新增
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
      </div>
      <div class="pagination_box">
        <div class="block">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30]"
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
      <IframeDialog :iframeVisible="iframeParam" v-if="detection" @on-click="testFn"/>
    </div>
    <div>
      <!-- <returnVisitDialog :isShow="isShowDialog"/> -->
    </div>
    <CallbackDialog :dialog="callbackedDialog" @getTableData="getDataFn"></CallbackDialog>
  </div>
</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import returnVisitDialog from "@/components/workbench/returnVisit-dialog";
import CallbackDialog from './../../../dialogs/CallbackDialog'
import {SYSTEM_HTTP_SUCCESS,STATUS_CALLBACK_STATUSARR} from "@/constant";
import {
  getDentalfeedbackInfo,
  getDentalfeedbackInfoAll,
  delateAcallback,
  getCallbackList
} from "@/api";
import monment from "moment";
export default {
  name: "returnVisit",
  components: { IframeDialog, returnVisitDialog, CallbackDialog },
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
      detection: false,
      timeSlot: [],
      tableHeight:300,
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
      timer: "",
      total: 1,
      page: 1,
      pageSize: 10,
      listTotal: 0,
      operationMsg: "",
      outDialogVisible: false,
      isShowDialog: {
        patient: false,
        add: false,
        register: false
      },
      tabsArr: ["first", "second", "third", "four", "five", "six", "seven"],
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
      tableDataList: [],
      tabletitle: [
        {
          prop: "callback.patientName",
          label: "姓名"
        },
        {
          prop: "teleno",
          label: "手机号"
        },
        {
          prop: "doctorName",
          label: "诊治医生"
        },
        {
          prop: "callback.callTime",
          label: "回访时间",
          width: '150px',
          formatter: function(row, column, cellValue) {
            return monment(cellValue).format("YYYY-MM-DD HH:mm");
          }
        },
        {
          prop: "callback.visitTime",
          label: "就诊时间",
          width: '150px',
          formatter: function(row, column, cellValue) {
            return cellValue ? monment(cellValue).format("YYYY-MM-DD HH:mm") : '';
          }
        },
        {
          prop: "callback.content",
          label: "回访内容"
        },
        {
          prop: "callback.result",
          label: "回访结果"
        },
        {
          prop: "callback.remark",
          label: "备注"
        }
      ],
      courseInfo: "",
      oldTableDataList: "",
      tableData: [],
      loading: true,
      courseId: "",
      pagerCount: "",
      treatmentStatue: false,
      butArr: ["开始治疗", "结束治疗", "已离开", "回退", "转诊"],
      activeIndex: "",
      startTime: "",
      endTime: "",
      params: {
        total: 0,
        page: 1,
        startTime: '',
        pageSize: 10,
        endTime: '',
        type: '',
        status: ''
      },
      callbackedDialog: { //完成回访弹框
        isshow: false,
        id: ''
      }
    };
  },
  created() {
    
    this.params.status=this.$route.meta.status;
    this.params.type=this.$route.meta.type;
    //不是医生登录就不加载数据
    //isdoctor 在全局utils/GlobeFindComponent/.js
    if(!this.isdoctor && this.params.type == 'doctor') {
      this.isshow  = false;
      return;
    } else {
      this.isshow  = true;
    }
    this.getSessionDate();
    this.getDataFn();
    this.params.total = this.tableDataList.length;
  },

  watch: {
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
      this.getDataFn();
      this.upDateTime();
    },
    getTimeTamp(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    upDateTime() {
      this.$root.Bus.$emit("ChangeTimeRefresh", this.timeSlot);
    },
    testFn() {
      this.getDataFn();
      this.detection = false;
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
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
      this.getDataFn();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getDataFn();
    },
    IndexEvent(row) {
      console.log(row)
      this.detection = true;
      this.$store.commit("SET_ROW_ID", row.callback.id);
      let patientId = row.callback.patientId;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "six";
    },
    moreEvent(i, row) {
      if (i === 0) {
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "six";
        this.iframeParam.addRV = true;
      }
      // status = cancelstatus noresultstatus finishstatus 分别代表取消 无结果 完成 回访
      // 取消回访
      if (i === 1) {
        this.$confirm("此操作将取消回访, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delateAcallback(row.callback.id, "cancelstatus").then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.getDataFn();
              this.$root.Bus.$emit("ChangeConstRefresh");
              // this.$message({
              //   type: "success",
              //   message: "取消成功!"
              // });
            }
          });
        });
      }
      // 完成回访
      if (i === 2) {
        this.callbackedDialog.isshow = true;
        this.callbackedDialog.id = row.callback.id;
        return;
        this.$confirm("此操作将完成回访, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delateAcallback(row.callback.id, "finishstatus").then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.getDataFn();
              this.$root.Bus.$emit("ChangeConstRefresh");
              // this.$message({
              //   type: "success",
              //   message: "完成回访成功!"
              // });
            }
          });
        });
      }
    },

    // 退出询问
    DialogVisible() {
      this.outDialogVisible = false;
    },
    getDataFn() {
      if(!this.isshow) {
        return;
      }
      this.$root.Bus.$emit("ChangeConstRefresh");
      let params = Object.assign({},this.params);
      params.begDate = params.startTime + ' 00:00:00';
      params.endDate = params.endTime + ' 00:00:00';
      params.type = '1';
      getCallbackList(params).then(res=>{
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data || [];
          this.params.total = res.data.totalNumber;
          this.tableDataList = _D
        }        
      })
      // getDentalfeedbackInfo({
      //   page: this.params.page,
      //   pageSize: this.params.pageSize,
      //   startTime: this.params.startTime,
      //   endTime: this.params.endTime
      // }).then(res => {
      //   console.log(res);

      //   if (res.data.code === SYSTEM_HTTP_SUCCESS) {
      //     let _D = res.data.data || [];
      //     this.params.total = res.data.totalNumber;
      //     this.tableDataList = _D

      //   }
      // });
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
  mounted() {
    this.getDataFn();

    // 开启定时器
    this.timer = setInterval(() => {
      this.getDataFn();
    }, 1000 * 60 * 2);
    this.$nextTick(() => {
      let height = document.getElementById('wrapper_table').offsetHeight;
      this.tableHeight = height;
    })
  },
  beforeDestroy(){  
    window.clearInterval(this.timer); 
  },
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
.yellow {
  color: #f77e1b;
}
.green {
  color: #7ed321;
}
.blue {
  color: #28c0f5;
}
.el-table::before{
  display: none
}
</style>
<style>
</style>
