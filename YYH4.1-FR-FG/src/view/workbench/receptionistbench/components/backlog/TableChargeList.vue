<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 16:18:41
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
      :clearable="true"
      v-if="isshow"
    ></el-date-picker>
    <div class="wrapper_table" id="wrapper_table">
      <!-- 列表 -->
      <el-table
        ref="singleTable"
        :height="tableHeight"
        v-loading="loading"
        :data="tableDataList"
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
          :width="item.width"
          :formatter="item.formatter"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column props="discountAmountYuan" label="应收" width="120" align="center">
          <template slot-scope="scope">
            <span
              :class="{
              green: scope.row.status == 1,
              red: scope.row.status == 0 || scope.row.status == 3,
              orange: scope.row.status == 6,
              blue: scope.row.status == 5
              }"
            >{{scope.row.discountAmountYuan}}</span>
          </template>
        </el-table-column>
        <el-table-column props="statusName" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span
              :class="{
              green: scope.row.status == 1,
              red: scope.row.status == 0 || scope.row.status == 3,
              orange: scope.row.status == 6,
              blue: scope.row.status == 5
              }"
            >{{scope.row.statusName}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="addTime" label="创建时间" :formatter="formatterDate" align="center" width="150px"></el-table-column>

        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="moreEvent(1,scope.row)">
                  <span class="outIcon"></span>修改
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_bottom">
      <!-- 分页 -->
      <div class="but_box" v-if="treatmentStatue"></div>
      <div class="pagination_box">
        <div class="block">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40]"
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
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="outDialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="DialogVisible">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <IframeDialog :iframeVisible="iframeParam" v-if="detection" @on-click="testFn"/>
    </div>
  </div>
</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import { getChargebillingInfo, putchargebillinginfo,getChargebillingList} from "@/api";
import {
SYSTEM_HTTP_SUCCESS,
TYPE_WORKBENCHCHARGE_SUATUSARR,
TYPE_WORKBEN_SEXARR,
BILL_STATUS_MAP,
STATUS_BILL_NO_CHARGE,
STATUS_BILL_CHARGED,
STATUS_BILL_REFUND  ,
STATUS_BILL_ARREARAGE ,
STATUS_BILL_INVALID   ,
STATUS_BILL_APPROVALING ,
} from "@/constant";
import monment from "moment";
export default {
  name: "charge",
  loading: true,
  components: { IframeDialog },
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
      params: {
        total: 0,
        page: 1,
        startTime: '',
        pageSize: 10,
        endTime: '',
        type: '',
        status: ''
      },
      endTime: "",
      startTime: "",
      isshow: false,//显示筛选日期
      timeSlot: [],
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
      timer: "",
      total: 1,
      page: 1,
      pageSize: 10,
      listTotal: 0,
      operationMsg: "",
      outDialogVisible: false,
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
      tableDataList: [
      ],
      tabletitle: [
        {
          prop: "number",
          label: "单据号"
        },
        {
          prop: "patientName",
          label: "患者姓名"
        },
        {
          prop: "clinicNo",
          label: "病历号"
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          width: '150px',
          formatter: function(row, column, cellValue) {
            return util.dateFormat(cellValue,'yyyy-MM-dd hh:mm')
          },
        },
        {
          prop: "telephone",
          label: "手机号"
        },
        {
          prop: "doctorUserName",
          label: "诊治医生"
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
      tableHeight: 300
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
    // this.getDataData();
    this.pagerCount = this.tableDataList.length;
    this.upDateTime();
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
      this.getDataData();
      this.upDateTime();
    },
    getTimeTamp(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    upDateTime() {
      this.$root.Bus.$emit("ChangeTimeRefresh", this.timeSlot);
    },
    testFn() {
      this.getDataData();
      this.detection = false;
    },
    // 设置行选中
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
      this.getDataData();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getDataData();
    },
    IndexEvent(row) {
      this.detection = true;
      this.$store.commit("SET_ROW_ID", row.id);
      let patientId = row.patient.id;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "four";
      this.iframeParam.doctor.id = row.doctor.id;
      this.iframeParam.nurse.id = row.nurse.id;
    },
    moreEvent(i, row) {
      if (i === 1) {
        this.detection = true;
        this.$store.commit("SET_ROW_ID", row.id);
        let patientId = row.patient.id;
        this.$store.dispatch("GET_PATIENT_MSG", patientId);
        this.iframeParam.id = patientId;
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "four";
      }
      if (i === 2) {
        this.$confirm("此操作将作废该收费信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          putchargebillinginfo(row.id).then(res => {
            if (res.data.code === SYSTEM_HTTP_SUCCESS) {
              this.getDataData();
              // this.$message({
              //   type: "success",
              //   message: "作废该收费信息成功!"
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
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    getDataData() {
      if(!this.isshow) {
        this.loading = false;
        return;
      }
      getChargebillingList(this.params).then(res=>{
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          console.log(res);
          
          let _D = res.data.data;
          this.params.total = res.data.totalNumber;
          this.loading = false;
          this.tableDataList = _D.map((v, i) => {
            v.patientName = v.patient.patientName;
            v.sex = TYPE_WORKBEN_SEXARR[parseInt(v.patient.sex)];
            v.clinicNo = v.patient.emrNo;
            v.doctorUserName = v.doctor.name;
            v.visitTime = this.getTime(v.visitTime);
            v.createTime = this.getTime(v.createTime);
            v.sfTime = this.getTime(v.sfTime);
            v.telephone = v.patient.mobilephone;
            v.billingStatusTxt = TYPE_WORKBENCHCHARGE_SUATUSARR[parseInt(v.status)];
            return v;
          });
        }        
      })

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
    this.getDataData();
    // 开启定时器
    this.timer = setInterval(() => {
      this.getDataData();
    }, 1000 * 60 * 2);
    this.$nextTick(() => {
      let height = document.getElementById('wrapper_table').offsetHeight;
      this.tableHeight = height;
    })
  },
  beforeDestroy(){    
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
.green {
  color: #9cdb60;
}
.red {
  color: #ff485f;
}
.orange {
  color: #f9b37e;
}
.blue {
  color: #74d6f1;
}
.el-table::before{
  display: none
}
</style>
