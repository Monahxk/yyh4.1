<!--
 * @Descripttion: 连锁店患者，修改了连锁门店查询
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-16 09:51:54
 -->
<template>
  <div class="wrapper today_patient">
    <div class="box_header">
      <el-form :inline="true" label-width='80px' :model="formSearch" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="">
              <el-input v-model="formSearch.patientName" clearable placeholder="请输入名称/病历号/手机号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店">
              <el-cascader
                v-model='formSearch.institutionId'
                :options="institutionList"
                expand-trigger="hover"
                :show-all-levels='false'
                :props="defaultProps">
                <template slot-scope="{ node, data }">
                  <!-- <span>{{data.name }}</span> -->
                </template>
                </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="2" :push='9'>
            <el-form-item>
              <el-button type="primary" class="searchBtn" round @click="init">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">

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
        height="650"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <el-table-column width='300' prop="patientName" label="患者姓名" sortable align="center">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.patientName}}</span>
              <span v-if="scope.row.arrearage" class="qian">欠</span>
            </div>
            <ul class="add_title">
              <li
                v-for="(item, index) in scope.row.listLabel"
                :style="{backgroundColor:item.labelId.color}"
                :key="index"
              >{{item.labelId.abbreviate}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="emrNo" label="病历号" sortable align="center"></el-table-column>
        <el-table-column label="性别" sortable align="center">
          <template slot-scope="scope" >
            {{scope.row.gender == 1?'男':'女'}}
          </template>
        </el-table-column>
        <el-table-column prop="patientAge" label="年龄" sortable align="center"></el-table-column>
        <el-table-column prop="mobilephone" label="手机号码" sortable align="center"></el-table-column>

        <el-table-column prop="name" label="所属门店" sortable align="center"></el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginLeft:-25px">
            <el-button type="text" size="small" @click="IndexEvent(scope.row)">详情</el-button>
            <span class="line">|</span>
            <el-button type="text" size="small" @click="Del(scope.row.id)">转店</el-button>

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

    <addPatients :isShow="isShowDialog" :event-refresh="updateConstData"/>

    <IframeDialog
      :iframeVisible="iframeParam"
      v-if="detection"
      @on-click="testFn"
    />


  </div>
</template>


<script>
import addPatients from "@/components/workbench/dialogs/DialogAddPatient";
import IframeDialog from "./components/Sideslipframe.vue";

import { getWorkCount, getCallbackfiltervo,chainPatientList,chainDeletePatient,listInstitution,treeInstitutionsSimple } from "@/api";
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
      tValue: [],
      defaultProps: {
        // value:'id',
        // label: 'name',
        // children: 'subLevelList',
        // emitPath: false,
			},
      institutionList:[],
      formSearch: { //项目搜索
        patientName: '',
        institutionId:'',
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
    document.onkeypress = function(e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        _this.init()
         return false;
      }
    };
    treeInstitutionsSimple().then(res => {
      if (res.data.code == 200) {
        _this.institutionList = res.data.data
      }
    });

    // 新增患者刷新
    this.$root.Bus.$on('ChangeConstRefresh', function () {
      _this.setData()
    })
    this.setData()

  },
  methods: {
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
      chainPatientList({params:_this.formSearch}).then(res =>{
        _this.list=res.data.data
        _this.total=res.data.totalNumber

      })
    },
    init(){
      if (this.tValue) {
        let [beg, end] = this.tValue;
        this.formSearch.visitStartTime = beg;
        this.formSearch.visitEndTime = end;
      }
      let inst = this.formSearch.institutionId;
      if(inst) {
        if(inst.length > 0) {
          this.formSearch.institutionId = inst[inst.length - 1].replace('inst-','').replace('level-','');
        }
      }
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
    Del(id){
      this.$confirm("此操作将转店该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let form={'patientId':id}
        chainDeletePatient(form).then(res=>{
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
      border-radius: 50%;
      color: #fff;
    }
    .qian {
      color: #ff4871;
      border-radius: 50%;
      padding: 0px 2px;
      border: 1px solid #ff4871;
    }
    .orange_bg{
      background:linear-gradient(24deg,rgba(238,165,48,1) 0%,rgba(242,130,0,1) 100%);
    }
    .cyan_bg{
      background:linear-gradient(17deg,rgba(110,221,213,1) 0%,rgba(26,213,193,1) 100%);
    }
    .purple_bg{
      background:linear-gradient(206deg,rgba(161,124,235,1) 0%,rgba(187,159,243,1) 100%);
    }
    .pink_bg{
      background:linear-gradient(17deg,rgba(253,177,158,1) 0%,rgba(247,144,124,1) 100%);
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
}

</style>
