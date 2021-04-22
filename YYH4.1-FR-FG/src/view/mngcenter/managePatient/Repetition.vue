<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Repetition.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-10
-->

<template>
    <div class="manage_patient_repetition">
      <div class="box_header">
        <el-form :inline="true" :model="formSearch" class="max-form" >
          <el-row :gutter="24">
            <el-col :span="3">
              <el-form-item>
                <el-checkbox true-label='1' v-model="formSearch.patientNameFlag">患者姓名</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-checkbox  true-label='1' v-model="formSearch.mobilephoneFlag">手机号</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="2" :push='14'>
              <el-form-item>
                <el-button type="primary" class="search_btn" round @click="setData">查重</el-button>
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
          height="650"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column prop="patient.patientName" label="患者姓名"   sortable align="center"></el-table-column>
          <el-table-column prop="patient.emrNo" label="病历号"  sortable align="center"></el-table-column>
          <el-table-column prop="patient.birthDate" label="患者生日"  align="center"></el-table-column>
          <el-table-column prop="patient.mobilephone" label="手机号"  align="center"></el-table-column>
          <el-table-column prop="patient.addTime" label="创建时间"  sortable align="center"></el-table-column>
          <el-table-column prop="doctorName" label="责任医生"  sortable align="center"></el-table-column>
          <el-table-column prop="patient.remark" label="备注"  sortable align="center"></el-table-column>

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
import { treatmentSamepatientList,deleteTreatmentPatient } from "@/api";
export default {
  name:'repetition',
  components: {
    IframeDialog
  },
  data() {
    return {
      formSearch: { //筛选搜索
        patientNameFlag: 0,
        mobilephoneFlag:0,
        page:1,
        pageSize:10,
        totalNumber:0
      },
      list: [],
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
      },

    };
  },
  mounted() {
    let _this = this;
    this.setData()
    // 新增患者刷新
    this.$root.Bus.$on('ChangeConstRefresh', function () {
      _this.setData()
    })
  },
  methods: {

    setData(){
      this.list=[]
      treatmentSamepatientList({params:this.formSearch}).then(res=>{
        if(res.data.code==200){
          this.list=res.data.data
          this.formSearch.totalNumber=res.data.totalNumber
        }
      })
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this.setData()
    },
    handleCurrentChange(val) {
      this.formSearch.page = val
      this.setData()
    },

    dialog(type,id){ //弹窗
      let _this=this

    },

    Del(id){
      this.$confirm("确定将该患者归档?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTreatmentPatient(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});
    },
    IndexEvent(row) {
      this.detection = true
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
    // 更新视图
    eventRefresh() {
     if( this.$parent.updateConstData) this.$parent.updateConstData()
    },
    updateConstData() {
      this.$children.map(val => {
        if (val.getAppointmentFn) val.getAppointmentFn()
      })
      getWorkCount().then(res => {
        if (res.data.code === 200) Object.assign(this.titData, res.data.data);
      });
    },

  },
};
</script>
<style lang="less" scoped>
  .manage_patient_repetition{

    background: white;
    // position: relative;
    .max-form{
      width: 100%;
    }
    .search_btn{
      padding:12px 50px;
    }


  }
</style>
