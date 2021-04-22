<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Inquire.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-10
-->

<template>
  <div class="manage_patient_inquire">
    <div class="box_header">
      <el-form :inline="true" :model="formSearch" class="max-form" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="7">
            <el-form-item label="姓名">
              <el-input v-model="formSearch.patientName" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="病历号">
              <el-input v-model="formSearch.emrNo" clearable placeholder="请输入病历号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手机号">
              <el-input v-model="formSearch.mobilePhone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" class="search_btn" round @click="init">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="责任医生">
              <el-select v-model="formSearch.doctorId" clearable placeholder="请选择责任医生">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) of doctorTOList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="患者类型">
              <el-select v-model="formSearch.patientType" clearable placeholder="请选择患者类型">
                <el-option label="普通" value="0"></el-option>
                <el-option label="临时" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建日期">
              <el-date-picker
                v-model="tValue"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table_list">
      <el-table
        highlight-current-row
        ref="singleTable"
        :data="list"
        height="580"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column prop="patient.patientName" label="患者姓名" sortable align="center"></el-table-column>
        <el-table-column prop="patient.emrNo" label="病历号" sortable align="center"></el-table-column>
        <el-table-column prop="abc" label="患者类型" align="center">
          <template slot-scope="scope">{{scope.row.patient.type == 0?'普通':'临时'}}</template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">{{scope.row.patient.gender == 1?'男':'女'}}</template>
        </el-table-column>
        <el-table-column prop="patient.mobilephone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="patient.addTime" label="创建时间" sortable align="center"></el-table-column>
        <el-table-column prop="doctorName" label="责任医生" sortable align="center"></el-table-column>
        <el-table-column prop="sourceName" label="患者来源" sortable align="center"></el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="IndexEvent(scope.row.patient)">详情</el-button>
            <span class="line">|</span>
            <el-button type="text" size="small" @click="Del(scope.row.patient.id)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_box">
      <div class="block">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          layout="total,prev,pager,next,sizes,jumper"
          :page-sizes="[4, 10, 15, 20]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="9"
          :total="formSearch.totalNumber"
          :current-page="formSearch.page"
        ></el-pagination>
      </div>
    </div>
    <IframeDialog
      :iframeVisible="iframeParam"
      :event-refresh="eventRefresh"
      v-if="detection"
      @on-click="testFn"
    />
  </div>

</template>

<script>
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import {
  treatmentPatientList,
  deleteTreatmentPatient,
  getRegisterInfo
} from "@/api";
export default {
  name: "inquire",
  components: {
    IframeDialog
  },
  data() {
    return {
      tValue: [],
      formSearch: {
        //筛选搜索
        patientName: "",
        emrNo: "",
        mobilePhone: "",
        doctorId: "",
        patientType: "",
        startTime: "",
        endTime: "",
        archived: 0,
        page: 1,
        pageSize: 10,
        totalNumber: 0
      },
      list: [],
      doctorTOList: [], //医生列表
      isShowDialog: {
        patient: false,
        addPatientpage: false,
        register: false,
        addPatientpageId: "",
        add: false,
        registerId: ""
      },
      detection: false,
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: "",
        addRV: false
      }
    };
  },
  watch: {
    tValue(val) {
      if (!val) {
        this.formSearch.startTime = "";
        this.formSearch.endTime = "";
      }
    }
  },
  mounted() {
    let _this = this;
    this.setData();
    getRegisterInfo().then(res => {
      this.doctorTOList = res.data.data.doctorList;
    });
    // 新增患者刷新
    this.$root.Bus.$on("ChangeConstRefresh", function() {
      _this.setData();
    });
  },
  methods: {
    IndexEvent(row) {
      this.detection = true;
      this.$store.commit("SET_ROW_ID", row.id);
      let patientId = row.id;
      this.$store.dispatch("GET_PATIENT_MSG", patientId);
      this.iframeParam.id = patientId;
      this.iframeParam.iframeShow = true;
      this.iframeParam.tapActive = "first";
    },
    testFn() {
      this.detection = false;
      this.setData();
    },
    updateConstData() {
      this.$children.map(val => {
        if (val.getAppointmentFn) val.getAppointmentFn();
      });
      getWorkCount().then(res => {
        if (res.data.code === 200) Object.assign(this.titData, res.data.data);
      });
    },
    // 更新视图
    eventRefresh() {
      if (this.$parent.updateConstData) this.$parent.updateConstData();
    },
    setData() {
      this.list = [];
      treatmentPatientList({ params: this.formSearch }).then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
          this.formSearch.totalNumber = res.data.totalNumber;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize = pageSize;
      this.setData();
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData();
    },
    dialog(type, id) {
      //弹窗
      let _this = this;
    },
    Del(id) {
      this.$confirm("确定将该患者归档?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          deleteTreatmentPatient(id).then(res => {
            if (res.data.code == 200) {
              this.setData();
            }
          });
        })
        .catch(() => {});
    },
    init() {
      if (this.tValue) {
        let [beg, end] = this.tValue;
        this.formSearch.startTime = beg;
        this.formSearch.endTime = end;
      }
      this.formSearch.page = 1;
      this.setData();
    }
  }
};
</script>
<style lang="less" scoped>
.manage_patient_inquire {
  background: white;
  // position: relative;
  .max-form {
    width: 100%;
    .el-date-editor {
      width: 270px;
    }
  }
  .search_btn {
    padding: 12px 50px;
  }
}
</style>
