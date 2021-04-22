<!--
 * @Descripttion: 
 * @version: V2.0
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 16:25:52
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
    <div class="wrapper_table" id="wrapper_table">
      <!-- 列表 -->
      <el-table
        ref="singleTable"
        :data="tableDataList"
        :height="tableHeight"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <div class="Tips_box">
            <p class="Tips_box_img">
              <img src="../../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
            </p>
            <span v-if="powerId != 3">温馨提示：当前用户不是医生岗位，不能查看医生数据</span>
          </div>
        </template>

        <el-table-column
          v-for="(item,index) in tabletitle "
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          sortable
          :formatter="item.formatter"
        ></el-table-column>

        <el-table-column prop="item.status" label="就诊状态" width="120" align="center">
          <template slot-scope="scope">
            <span >{{scope.row.statusName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-dropdown align="right" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text" size="small">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="moreEvent(0,scope.row)">
                  <span class="setIcon"></span>新增病历
                </el-dropdown-item>
                <el-dropdown-item @click.native="moreEvent(1,scope.row)">
                  <span class="outIcon"></span>历史
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
            layout="prev,pager,next,sizes,jumper"
            :page-sizes="[4, 10, 15, 20]"
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
  </div>
</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import monment from "moment";
import { getDentalemr,getEmrList } from "@/api";
import {
  SYSTEM_HTTP_SUCCESS,
  STATUS_VISIT_STATUSARR,
  STATUS_VISIT_FIRST,
  STATUS_VISIT_AGAIN,
  TYPE_WORKBEN_SEXARR
} from "@/constant";
export default {
  name: "caseHistory",
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
      isshow: false,//显示筛选日期
      timeSlot: [],
      endTime: "",
      startTime: "",
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
      page: 1,
      pageSize: 10,
      total: 1,
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
      tableDataList: [],
      tabletitle: [
        {
          prop: "patientName",
          label: "患者姓名"
        },
        {
          prop: "mobilephone",
          label: "手机号"
        },
        {
          prop: "emrNo",
          label: "病历号"
        },
        {
          prop: "registerTime",
          label: "就诊时间",
          formatter: function(row, column, cellValue) {
            return monment(cellValue).format("YYYY-MM-DD HH:mm");
          }
        },
        {
          prop: "gender",
          label: "性别"
        },
        {
          prop: "doctorName",
          label: "诊治医生"
        },
        {
          prop: "appointmentVisitTrack.addTime",
          label: "创建时间",
          formatter: function(row, column, cellValue) {
            return monment(cellValue).format("YYYY-MM-DD HH:mm");
          }
        }
      ],
      timer: "",
      courseInfo: "",
      oldTableDataList: "",
      tableData: [],
      loading: true,
      courseId: "",
      pagerCount: "",
      treatmentStatue: false,
      butArr: ["开始治疗", "结束治疗", "已离开", "回退", "转诊"],
      activeIndex: "",
      tableHeight: 300,
    };
  },
  created() {
    console.log(this.$route);
    
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
    let _this = this;
    this.initData();
    // 开启定时器
    this.timer = setInterval(() => {
      this.initData();
    }, 1000 * 60 * 2);
    this.pagerCount = this.tableDataList.length;
  },
  mounted() {
    this.$nextTick(() => {
      let height = document.getElementById('wrapper_table').offsetHeight;
      this.tableHeight = height;
    })
  },
  watch: {
  },
  computed: {},
  methods: {
    upDateTime() {
      this.$root.Bus.$emit("ChangeTimeRefresh", this.timeSlot);
    },
    timeChange(val) {
      if(val) {
        this.setSessionDate();
        this.params.startTime = val[0];
        this.params.endTime = val[1];
      }
      this.params.total=0;
      this.params.page=1;
      this.initData();
      this.upDateTime();
    },

    getTimeTamp(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    testFn() {
      this.detection = false;
      this.initData();
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
      this.tableDataList = this.datalist.slice(0, val);
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.initData();
    },
    IndexEvent(row) {
      this.detection = true;
      this.$store.commit("SET_ROW_ID", row.id);
      let patientId = row.patientId;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "third";
      this.iframeParam.doctor.id = row.doctorId;
    },
    moreEvent(i, row) {
      if (i === 0) {
        this.detection = true;
        this.$store.commit("SET_ROW_ID", row.id);
        let patientId = row.patientId;
        this.$store.dispatch("GET_PATIENT_MSG", patientId);
        this.iframeParam.id = patientId;
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "third";
      }
      if (i === 1) {
        this.detection = true;
        this.$store.commit("SET_ROW_ID", row.id);
        let patientId = row.patientId;
        this.$store.dispatch("GET_PATIENT_MSG", patientId);
        this.iframeParam.id = patientId;
        this.iframeParam.iframeShow = true;
        this.iframeParam.tapActive = "third";
      }
    },
    // 退出询问
    DialogVisible() {
      this.outDialogVisible = false;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    initData() {
      getEmrList(this.params).then(res=>{
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          this.params.total = res.data.totalNumber;
          this.tableDataList = _D.map(v => {
            v.startTime = this.getTime(v.startTime);
            v.visitTime = this.getTime(v.visitTime);
            v.gender = TYPE_WORKBEN_SEXARR[parseInt(v.gender)];
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
  beforeDestroy(){
    window.clearInterval(this.timer);
  }
};
</script>
<style  scoped lang="less">
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
.Tips_box {
  padding: 50px 0;
  .Tips_box_img {
    width: 300px;
    margin-bottom: 50px;
  }
}
</style>
<style>
</style>
