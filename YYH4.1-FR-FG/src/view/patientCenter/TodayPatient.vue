<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: TodayPatient.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-14
-->

<template>
  <div class="wrapper today_patient">
    <div class="box_header">
      <el-form :inline="true" label-width='80px' :model="formSearch" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="formSearch.patientName" clearable placeholder="请输入名称/病历号/手机号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="就诊日期">
              <el-date-picker
                v-model="tValue"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change='changeTime'
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="3">
            <el-form-item>
              <el-checkbox true-label='1' false-label='0' v-model="formSearch.queryFlag" @change='init'>今日新增患者</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="2" >
            <el-form-item>
              <el-button type="primary" class="searchBtn" round @click="init">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div class="add_new_but" @click="dialog('add')">新增患者</div>
    </div>

    <div class="content">
      <el-table
        highlight-current-row
        ref="singleTable"
        :data="list"
        style="font-size: 14px"
        height="640"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
      <el-table-column prop="patient.patientName" label="患者姓名" sortable align="center">
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.patient.patientName}}</span>
            <span v-if="scope.row.arrearFlag" class="arrearage">欠</span>
          </div>
          <ul class="add_title">
            <li
              v-for="(item, index) in scope.row.labelList"
              :style="{backgroundColor:item.labelConfig.color}"
              :key="index"
            >{{item.labelConfig.abbreviate}}</li>
          </ul>
        </template>
      </el-table-column>
        <el-table-column prop="patient.emrNo" label="病历号" sortable align="center"></el-table-column>
        <el-table-column  prop="patient.mobilephone" label="手机号码" sortable align="center"></el-table-column>
        <el-table-column  label="性别" sortable align="center">
          <template slot-scope="scope" >
            {{scope.row.patient.gender == 1?'男':'女'}}
          </template>
        </el-table-column>
        <el-table-column label="初复诊" sortable align="center">
          <template slot-scope="scope" >
            {{scope.row.appointmentVisitTrack.returnVisitText}}
          </template>
        </el-table-column>
        <el-table-column  prop="remark" label="创建时间" sortable align="center">
          <template slot-scope="scope" >
            {{getTime(scope.row.patient.addTime)}}
          </template>
        </el-table-column>
        <el-table-column  prop="remark" label="就诊时间" sortable align="center">
          <template slot-scope="scope" >
            {{scope.row.appointmentVisitTrack.registerTime?getTime(scope.row.appointmentVisitTrack.registerTime):''}}
          </template>
        </el-table-column>
        <el-table-column prop="patientSource" label="患者来源" sortable align="center"></el-table-column>
        <el-table-column  prop="patient.remark" label="备注" sortable align="center"></el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="IndexEvent(scope.row.patient)">详情</el-button>
            <span class="line">|</span>
            <el-button type="text" size="small" @click="Del(scope.row.patient.id)">删除</el-button>

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
            :total="total"
            :current-page="formSearch.page"
          ></el-pagination>
        </div>
      </div>
    </div>
    <IframeDialog
      :iframeVisible="iframeParam"
      :event-refresh="eventRefresh"
      v-if="detection"
      @on-click="testFn"
    />
<!-- 患者来源的弹窗 -->
    <addPatients :isShow="isShowDialog" :event-refresh="updateConstData"/>

  </div>
</template>


<script>
import addPatients from "@/components/workbench/dialogs/DialogAddPatient";
import IframeDialog from "@/components/workbench/sideslipframe/Sideslipframe";
import { getWorkCount, getCallbackfiltervo,patientCenterList,deletePatient } from "@/api";
import monment from "moment";
export default {
  name:'todayPatient',
  components: {
    addPatients,
    IframeDialog
  },
  data() {
    return {
      list: [],
      doctorTOList:[],
      tValue: [],
      formSearch: { //项目搜索
        queryFlag:'0',
        today: '',
        patientName: '',
        doctorId:'',
        mobilePhone:'',
        visitStartTime:'',
        visitEndTime:'',
        emrNo: '',
        page: 1,
        pageSize: 10,
      },
      total:20,
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
  watch: {
    tValue(val) {
      if (!val) {
        this.formSearch.visitStartTime = ""
        this.formSearch.visitEndTime =''
      }
    }
  },
  mounted() {
    let _this=this
    // document.onkeypress = function(e) {
    //   var keycode = document.all ? event.keyCode : e.which;
    //   if (keycode == 13) {
    //     _this.init()
    //      return false;
    //   }
    // };
    getCallbackfiltervo().then(res => {
      if (res.data.code === 200) {
        this.doctorTOList = res.data.data.doctorList;
      }
    });
    // 新增患者刷新
    this.$root.Bus.$on('ChangeConstRefresh', function () {
      _this.setData()
    })
    _this.setData()

  },
  methods: {
    IndexEvent(row) {
      this.detection = true
      this.$store.commit("SET_ROW_ID", row.id);
      let patientId = row.id;
      // let p = row.patientId;
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
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this.setData()
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.setData()
    },
    setData(){
      let _this=this
      patientCenterList({params:_this.formSearch}).then(res =>{
        _this.list=res.data.data
        _this.total=res.data.totalNumber

      })
    },
    changeTime(val){
      this.formSearch.visitStartTime = val[0];
      this.formSearch.visitEndTime = val[1];
    },
    init(){
      this.formSearch.page = 1;
      this.setData()
    },
    updateConstData() {
      this.$children.map(val => {
        if (val.getAppointmentFn) val.getAppointmentFn()
      })
      getWorkCount().then(res => {
        if (res.data.code === 200) Object.assign(this.titData, res.data.data);
      });
    },
    dialog(type,id){
      let _this=this
      _this.isShowDialog.patient = true;
    },
    Del(id){//来源删除
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePatient(id).then(res=>{
          if(res.data.code==200){
            this.setData()
          }
        })
      }).catch(() => {});
    },
    getTime(t,visitTime) {
      if(visitTime=='visit'){
        if(!t){
          return
        }
        return monment(t.visitTime).format("YYYY-MM-DD HH:mm");
      }else{
        return monment(t).format("YYYY-MM-DD HH:mm");
      }
    },

  }
};
</script>
<style lang="less" scoped>
.today_patient {
  .content{
    background: white;
  }
  .box_header{
    padding:20px 0 0 20px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 20px;
    .el-form{
      width: 100%;
      .el-date-editor{
        width: 270px;
        .el-range-separator{
          padding:0;
        }
      }
      .el-checkbox{
        .el-checkbox__label{
          font-size: 16px;
        }
      }
    }
    .searchBtn{
      padding:12px 50px;
    }
    .add_new_but{
      cursor: pointer;
      width: 154px;
      height: 48px;
      font-size: 18px;
      font-weight: bold;
      color: #4e81f2;
      text-align: center;
      line-height: 48px;
      -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #fff;
      position: absolute;
      right: 20px;
      top: 22px;
    }
  }

  .el-table{
    .circle{
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      line-height: 24px;
      font-size: 12px;
      color: white;
    }
    .add_title {
      // display: flex;
      // justify-content: center;
      // align-items: center;
      line-height: 22px;
      text-align: center;
      margin-top: 5px;
    }
    .add_title li {
      display: inline-block;
      font-size: 12px;
      width: 22px;
      height: 22px;
      margin-right:5px;
      border-radius: 11px;
      color: #fff;
    }
    .arrearage {
      color: #ff4871;
      border-radius: 50%;
      padding: 0px 2px;
      border: 1px solid #ff4871;
    }
    .el-dropdown{
      cursor: pointer;
      color: #409EFF;
      font-size: 12px;
    }
  }
  .pagination_box {
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

}

</style>
<style lang='less'>
.today_patient{
  .pagination_box .el-pagination span {
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
  .pagination_box .btn-next,
  .pagination_box .btn-prev {
    border: 1px solid #4d9eff;
    padding: 0 10px !important;
    background: #fff !important;
  }
  .el-form{
    .el-checkbox{
      .el-checkbox__label{
        font-size: 16px;
      }
    }
  }
}

</style>
