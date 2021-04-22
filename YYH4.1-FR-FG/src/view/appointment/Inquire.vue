<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Inquire.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
  <div class="appointment_inquire">
    <div class="main_top_title">预约查询</div>
    <div class="box_header">
      <el-form :inline="true" label-width='100px' :model="formSearch" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col :span="7">
            <el-form-item label="预约时间">
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
          <el-col :span="7">
            <el-form-item label="医生">
              <el-select v-model="formSearch.doctorId" clearable placeholder="请选择诊治医生">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) of doctorTOList"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="姓名/手机号">
              <el-input v-model="formSearch.patientNameOrMobile" clearable  placeholder="请输入名称/手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" >
            <el-form-item>
              <el-button type="primary" class="search_btn" round @click="inquire">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div class="add_btn" @click="moreEvent(0)">新增预约</div>
    </div>

    <div class="content">
      <el-table
        highlight-current-row
        ref="singleTable"
        :data="list"
        max-height="600"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column prop="appointmentVisitTrack.patientName" label="患者姓名" sortable align="center"></el-table-column>
        <el-table-column prop="emrNo" label="病历号" sortable align="center"></el-table-column>
        <el-table-column prop="patientMobile" label="手机号" sortable align="center"></el-table-column>
        <el-table-column prop="appointmentVisitTrack.appointStartTime" label="预约时间" sortable align="center"></el-table-column>
        <el-table-column prop="departmentName" label="预约科室" sortable align="center"></el-table-column>
        <el-table-column prop="doctorName" label="预约医生" sortable align="center"></el-table-column>
        <el-table-column prop="appointItemsText" label="预约项目" sortable align="center"></el-table-column>
        <el-table-column prop="appointmentVisitTrack.returnVisitText" label="初复诊" sortable align="center"></el-table-column>
        <el-table-column prop="appointmentVisitTrack.statusText" label="预约状态" sortable align="center"></el-table-column>
        <el-table-column prop="appointmentVisitTrack.remark" label="备注" sortable align="center"></el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="moreEvent(1,scope.row)">编辑</el-button>
            <span class="line">|</span>
            <el-button type="text" size="small" @click="Del(scope.row.appointmentVisitTrack.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <addBespeakDialog
      :isShow="isShowDialog"
      :info="userinfo"
      :rowId="rowId"
      :isEdit="isEdit"
      :event-refresh="updateConstData">
    </addBespeakDialog>


  </div>
</template>


<script>
import addBespeakDialog from "@/components/workbench/dialogs/DialogAddBespeak";
import { getWorkCount, getCallbackfiltervo,appointmentitemconfigList,appointmentList,deleteTreatmentAppointment} from "@/api";
export default {
  name:'patient',
  components: {
    addBespeakDialog,
  },
  data() {
    return {
      formSearch: { //项目搜索
        patientNameOrMobile: '',
        begDate:'',
        endDate:'',
        doctorId:'',
        totalNumber:0,
        page: 1,
        pageSize: 10,
      },
      tValue: [],
      list: [],
      doctorTOList:[],
      isShowDialog: {
        visibility: false
      },
      userinfo: {
        rowId: ""
      },
      rowId: "",
      isEdit:false,

    };
  },
  watch: {
    tValue(val) {
      if (!val) {
        this.formSearch.begDate = ""
        this.formSearch.endDate =''
      }
    }
  },
  mounted() {
    this.setData()
    // 新增预约刷新
    this.$root.Bus.$on("ChangeBespeakRefresh", () => {

    });
    getCallbackfiltervo().then(res => {
      if (res.data.code === 200) {
        this.doctorTOList = res.data.data.doctorList;
      }
    });

  },
  methods: {
    updateConstData() {
      this.setData()
    },
    moreEvent(i, val) {
      if (i === 0) {
        this.isShowDialog.visibility = true;
        this.userinfo={}
        this.rowId=''
        this.isEdit=false
      }else{
        this.isShowDialog.visibility = true;
        this.userinfo = val.appointmentVisitTrack;
        this.userinfo.mobilphone = val.patientMobile;
        this.rowId = val.appointmentVisitTrack.id;
        this.isEdit=true
      }

    },
    setData(){
      appointmentList({params:this.formSearch}).then(res=>{
        this.list=res.data.data
        this.formSearch.totalNumber=res.data.totalNumber
      })
    },
    Del(id){//删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTreatmentAppointment(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});;
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this.setData()
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData()
    },
    inquire(){
      if (this.tValue) {
        let [beg, end] = this.tValue;
        this.formSearch.begDate = beg;
        this.formSearch.endDate = end;
      }
      this.formSearch.page = 1;
      this.setData()
    },
    dateFormat(dateStr) {
      return util.dateFormat(dateStr,'yyyy-MM-dd hh:mm')
    }

  }
};
</script>
<style lang="less" scoped>
.appointment_inquire {
  .box_header{
    .add_btn{
      top: 20px;
    }
  }
  .el-dialog{
    .filterable_chunk{
      background: #F7F9FF;
      padding:5px 0;
    }
    .person_details{
      margin:0 0 20px 10px;
      label{
        width: 70px;
        display: inline-block;
      }
      span{
        margin-right: 40px;
      }
    }
    .info_chunk{
      display: flex;
      align-items: stretch;
      .left{
        width: 60%;
        .title{
          background: #F7F9FF;
          padding:10px;
        }
        .class_chunk{
          padding:20px;
          border:1px solid #E4E9FF;
          border-top: 0;
          min-height: 480px;
          overflow-y: auto;
          .el-checkbox{
            width: 24%;
            min-width: 110px;
            margin-bottom: 10px;
            margin-right: 0;
          }
          // .el-checkbox:nth-child(4n){
          //   margin-right: 0;
          // }
        }
      }
      .right{
        width: 35%;
        margin-left: 5%;
        .title{
          background: #F7F9FF;
          padding:10px;
        }
        .info_div{
          padding:10px;
          border:1px solid #E4E9FF;
          border-top: 0;
          min-height: 480px;
          .day_time{
            width: 140px;
          }
          .hour_time{
            width: 80px;
            .el-input__inner{
              padding-right: 0;
            }
          }
          .num_time{
            width: 100px;
            margin-right: 10px;
          }
        }
      }
    }

  }



}


</style>
<style lang="less">
.appointment_inquire{
  .hour_time{
    width: 80px;
    .el-input__inner{
      padding-right: 0;
    }
  }
}
.mP_select_top{
  overflow: hidden;
  >li{
    float: left;
    min-width: 120px;
  }
}
.appointment_inquire_inner{
  .search_chunk{
    background: #F7F9FF;
    padding:10px;
    .el-input{
      width: 240px;
    }
  }
}
</style>
