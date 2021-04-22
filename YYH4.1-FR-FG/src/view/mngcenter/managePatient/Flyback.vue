<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Flyback.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-01
-->

<template>
    <div class="manage_patient_flyback">
      <div class="box_header">
        <el-form :inline="true" :model="formSearch" class="max-form" >
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
          <el-table-column prop="sourceName" label="患者来源"  sortable align="center"></el-table-column>
          <el-table-column prop="patient.addTime" label="创建时间"  sortable align="center"></el-table-column>
          <el-table-column prop="patient.remark" label="备注"  sortable align="center"></el-table-column>
          <el-table-column prop="patient.archivedTime" label="归档时间"  sortable align="center"></el-table-column>

          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="restore(scope.row.patient.id)">还原</el-button>
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



  </div>
</template>


<script>
import { treatmentPatientList,deleteTreatmentPatientArchived,deleteTreatmentPatient} from "@/api";
export default {
  name:'flyback',
  data() {

    return {
      formSearch: { //筛选搜索
        patientName: '',
        emrNo: '',
        mobilePhone: '',
        archived:1,
        page:1,
        pageSize:10,
        totalNumber:0
      },
      list: [],

    };
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData(){
      this.list=[]
      treatmentPatientList({params:this.formSearch}).then(res=>{
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
    restore(id){
      this.$confirm("是否还原该患者?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTreatmentPatientArchived(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});
    },

    init(){
      this.formSearch.page = 1;
      this.setData()
    },

  },
};
</script>
<style lang="less" scoped>
  .manage_patient_flyback{

    background: white;
    // position: relative;
    .max-form{
      width: 100%;
      .el-input{
        width: 272px;
      }
      .el-date-editor{
        width: 205px;
      }
    }
    .search_btn{
      padding:12px 50px;
    }


  }
</style>
