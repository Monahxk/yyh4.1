<!--
 * @Descripttion: 新增回访
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-24 10:16:52
 -->
<template>
  <div class="returnVisit_dialog">
    <el-dialog
      title="新增回访"
      :visible.sync="isShow.register"
      width="800px"
      @open="getSelectData"
      @close="closeDialog"

      :closeOnClickModal="false"
    >
      <div class="dialog_content">
        <div class="header">
          <div class="name-name"><span>*</span> 选择患者</div>
          <div class="name-box" icon="el-icon-search" @click="tableDialog.tabledialogVisible = true">
            <el-tag size="medium" closable v-for="(item,index) in selectionList" :key="index" @close="delPatient(index)">{{item.patient.patientName}}</el-tag>
          </div>
          <!-- <el-button type="primary" style="margin-left:10px" @click="empty">清空</el-button> -->
          <!-- <el-select
            v-model="patientId"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入患者姓名"
            :remote-method="querySearch"
            :loading="loading"
            clearable
            style="width:280px">
            <el-option
              v-for="item in patientList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
          <!-- <el-autocomplete
            style="width:280px"
            v-model="patientId"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            placeholder="请输入患者姓名"
            @select="handleSelect"
          >
            <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
            <template slot-scope="{ item }">
              <div class="name_box">
                <span>{{ item.patientName }}</span>
              </div>
            </template>
          </el-autocomplete> -->
        </div>

        <!-- <div class="dialog_content_center">
          <div>
            <div class="row fl">
              <span class="key">姓名：</span>
              <span class="val">{{stateData.patientName}}</span>
            </div>
            <div class="row fl">
              <span class="key">病历号：</span>
              <span class="val">{{stateData.emrNo}}</span>
            </div>

            <div class="row fl">
              <span class="key">手机号：</span>
              <span class="val">{{stateData.mobilephone}}</span>
            </div>
          </div>
        </div> -->

        <div class="dialog_tabs">
          <div class="dialog_tabs_title">
            <!-- <span class="title_text">回访设置</span> -->
          </div>
          <div class="add_box">
            <div class="select_header">
              <el-radio v-model="callback" class="radio-left" label="1">单次回访</el-radio>
              <el-radio v-model="callback" label="2">定制回访计划</el-radio>
            </div>
            <el-form ref="form" :model="form" label-width="80px" v-show="callback == 1">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员" :required="true">
                    <el-select v-model="form.callerId" placeholder="请选回访人员">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.callerList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-form-item label="回访时间" :required="true">
                    <el-date-picker
                      v-model="form.callTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="诊治医生" :required="true">
                    <el-select v-model="form.doctorId" placeholder="请选择诊治医生">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.doctorList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-form-item label="回访状态" :required="true">
                    <el-radio-group v-model="form.status">
                      <el-radio :label="0">未回访</el-radio>
                      <el-radio :label="1">已完成</el-radio>
                      <el-radio :label="2">无结果</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访内容" :required="true">
                    <el-select v-model="form.content" filterable allow-create placeholder="请选择回访内容">
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.contentSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-form-item label="回访结果">
                    <el-select v-model="form.result"
                    allow-create
                    filterable
                    default-first-option placeholder="请选择回访结果">
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.resultSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="form.remark"
                      :autosize="{ minRows: 4, maxRows: 4}"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <el-form ref="form" :model="callbackInfo" label-width="80px" v-show="callback == 2">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员" :required="true">
                    <el-select v-model="callbackInfo.callerId" placeholder="请选回访人员">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.callerList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-form-item label="回访计划" :required="true">
                    <el-select v-model="callbackInfo.periods" multiple placeholder="请选择回访计划">
                      <el-option
                        :label="item.name"
                        :value="item.period"
                        v-for="(item, index) of selectData.periodList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="诊治医生" :required="true">
                    <el-select v-model="callbackInfo.doctorId" placeholder="请选择诊治医生">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.doctorList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :push="2">
                  <el-form-item label="回访内容" :required="true">
                    <el-select v-model="callbackInfo.content"
                     placeholder="请选择回访内容">
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.contentSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="callbackInfo.remark"
                      :autosize="{ minRows: 4, maxRows: 4}"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button type="primary" @click="sendData">保 存</el-button>
        <el-button @click="isShow.register = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- table弹框 -->
    <el-dialog
      title="从列表中选择"
      :visible.sync="tableDialog.tabledialogVisible"
      width="960px"
      center
      top='20vh'
      @open="openDialog"
      >
      <div>
        <el-form :inline="true" :model="tableDialog.formSearch" class="demo-form-inline">
          <el-form-item label="">
            <el-input
              placeholder="姓名"
              suffix-icon="el-icon-search"
              v-model="tableDialog.formSearch.patientName"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="就诊日期">
            <el-date-picker
              v-model="valueTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width:370px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getPatients">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="tableData"
          ref="multipleTable"
          style="width: 100%;font-size: 14px"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          height="365px"
          class="tables"
          @selection-change="selectRow"
          v-loading="tableloading"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
          <el-table-column align="center" type="selection" prop="patient.id"></el-table-column>
          <el-table-column align="center" prop="patient.patientName" label="姓名"></el-table-column>
          <el-table-column align="center" prop="patient.emrNo" label="病历号"></el-table-column>
          <el-table-column align="center" prop="patient.mobilephone" label="手机号"></el-table-column>
          <el-table-column align="center" prop="appointmentVisitTrack.registerTime" label="就诊日期"></el-table-column>
          <el-table-column align="center" prop="appointItemsText" label="就诊项目"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tableDialog.tabledialogVisible = false">确 定</el-button>
        <el-button @click="tableDialog.tabledialogVisible = false,selectionList=[]">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPatientfilter, getCallbackvo, postAddCallback,getPatientList } from "@/api";
import qs from "qs";
import monment from "moment";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: ["isShow", "patient"],
  data() {
    return {
      callback: "1",
      selectData: {
        resultSet:"",
        callerList:"",
        periodList:"",
        doctorList:"",
        contentSet:""
      },
      form: {
        callerId: "",
        callTime: "",
        doctorId: "",
        status: 0,
        result: "",
        content: "",
        remark: "",
        mode: 0,
        visitTime: "",
        patientIds: []
      },
      callbackInfo: {
        callerId: "",
        doctorId: "",
        periods: [],
        content: "",
        remark: "",
        mode: 1,
        // visitTime: ""
      },
      dialogFormVisible: false,
      patientId: "",
      stateData: {},
      patientList: [],
      loading: false,
      tableloading: false,
      valueTime: '',
      tableDialog: {
        tabledialogVisible: false,
        formSearch: {
          patientName: '',
          visitStartTime: '',
          visitEndTime: '',
          visitFlag: 0,
          page: 1,
          pageSize: 100
        }
      },
      tableData: [],
      selectionList: [],
      timmer: null
    };
  },
  created() {},
  watch: {
    "isShow.more"() {
      if (this.isShow.more) {
        this.stateData.patientName = this.patient.patientName;
        this.stateData.emrNo = this.patient.emrNo;
        this.stateData.mobilephone = this.patient.mobilephone;
        this.stateData.id = this.patient.patientId;
      }
    },
    "isShow.register"() {
      if (!this.isShow.register) {
        this.isShow.more = !this.isShow.more;
        this.stateData.patientName = "";
        this.stateData.emrNo = "";
        this.stateData.mobilephone = "";
        this.stateData.id = "";
      }
    }
  },
  computed: {},
  methods: {
    // 获取下拉列表data
    getDownList() {
      getCallbackvo().then(res => {
        console.log(res);
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          Object.assign(this.selectData,res.data.data)
        }
      });
    },
    empty(){
      this.selectionList=[]
    },
    closeDialog() {
      this.patientId="";
      this.form.callerId= "";
      this.form.callTime= "";
      this.form.doctorId= "";
      this.form.status= 0;
      this.form.result= "";
      this.form.content= "";
      this.form.remark= "";
      this.form.mode= 0;
      this.form.visitTime= ""
      this.callbackInfo.callerId= "";
      this.callbackInfo.doctorId= "";
      this.callbackInfo.periods= [];
      this.callbackInfo.content= "";
      this.callbackInfo.remark= "";
      this.callbackInfo.mode= 1;
      this.callbackInfo.visitTime= "";
      this.stateData={};
      this.selectionList = [];

    },
    // 保存数据
    sendData() {
      let patientIds = [];
      if (!this.selectionList || this.selectionList.length == 0) {
        this.$message.error("请选择患者");
        return;
      } else {
        this.selectionList.map(item => {
          patientIds.push(item.patient.id)
        })
      }
      if (this.callback == 1) {
        if (!this.form.callerId) {
          this.$message.error("请选择回访人员");
          return;
        }

        if (!this.form.callTime) {
          this.$message.error("请选择回访时间");
          return;
        }

        if (!this.form.doctorId) {
          this.$message.error("请选择诊治医生");
          return;
        }

        if (!this.form.content) {
          this.$message.error("请选择回访内容");
          return;
        }
        this.form["patientId"] = this.stateData.id;
        this.form.visitTime = this.stateData.visitTime;
        this.form.patientName = this.stateData.patientName;
        this.form.patientIds = patientIds;
        postAddCallback(this.form).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.isShow.register = false;
            this.$emit("successData");
          }
        });
      } else {
        if (!this.callbackInfo.callerId) {
          this.$message.error("请选择回访人员");
          return;
        }

        if (!this.callbackInfo.periods.length) {
          this.$message.error("请选择回访计划");
          return;
        }

        if (!this.callbackInfo.doctorId) {
          this.$message.error("请选择诊治医生");
          return;
        }
        if (!this.callbackInfo.content) {
          this.$message.error("请选择回访内容");
          return;
        }

        this.callbackInfo.patientIds = patientIds;
        postAddCallback(this.callbackInfo).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.isShow.register = false;
            this.$emit("successData");
          }
        });
      }
    },

    getSelectData() {
      let obj = {
        callerId: "",
        callTime: "",
        doctorId: "",
        status: 0,
        result: "",
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      };

      let obj2 = {
        callerId: "",
        doctorId: "",
        periods: [],
        content: "",
        remark: "",
        mode: 1,
        visitTime: ""
      };
    },
    handleSelect(val) {
      this.stateData = val;
      this.patientId = val.name;
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    handleIconClick() {},
    querySearch(queryString) {
      this.loading = true;
      getPatientfilter(queryString).then(res => {
        this.loading = false;
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          let arr = ["男", "女"];
          let dataArr = _D.map((val, index) => {
            val.sex = arr[parseInt(val.gender) - 1];
            val.visitTime = this.getTime(val.visitTime);
            val.name = val.patientName;
            val.emrNo = val.emrNo;
            val.mobilephone = val.mobilephone;
            return val;
          });
          this.patientList = dataArr
        }
      });
    },
    openDialog() {
      let timestamp = new Date().getTime();
      this.valueTime = [monment(timestamp).format("YYYY-MM-DD"),monment(timestamp).format("YYYY-MM-DD")]
      this.getPatients()
      this.callback == 1
    },
    getPatients() {
      this.tableloading = true;
      this.valueTime ? this.tableDialog.formSearch.visitStartTime = this.valueTime[0]+' 00:00:00' : '';
      this.valueTime ? this.tableDialog.formSearch.visitEndTime = this.valueTime[1]+' 23:59:59' : '';
      getPatientList(this.tableDialog.formSearch).then(res => {
        this.tableloading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let arr = JSON.parse(JSON.stringify(this.selectionList));
          res.data.data.forEach((row,index)=>{
            let ishas = false;
            this.selectionList.forEach((row1,index1) => {
              if(row.patient.id == row1.patient.id){
                ishas = true;
              }
            })
            if(!ishas) {
              arr.push(row);
            }

          })
          this.tableData = arr;
          this.setSelectRow();
        }
      }).catch(err => {
        this.tableloading = false;
      })
    },
    selectRow(selection, row) {
      this.selectionList = selection;
    },
    delPatient(index) {
      let row = this.selectionList[index];
      this.selectionList.splice(index,1);
      this.$refs.multipleTable.toggleRowSelection(row,false)
    },
    setSelectRow() {
      let selectionList = JSON.parse(JSON.stringify(this.selectionList));
      this.timmer = setTimeout(() => {
        this.tableData.forEach((row,index)=>{
          selectionList.forEach((row1,index1) => {
            if(row.patient.id == row1.patient.id){
              this.$refs.multipleTable.toggleRowSelection(row)
            }
          })

        })
      },200)
    }
  },
  mixins() {},
  created() {
    this.getDownList();
  },
  destroyed() {
    if(this.timmer) {
      this.timmer = null;
    }
  }
};
</script>
<style  scoped lang="less">
.select_header {
  margin-bottom: 20px;
}

.name_box {
  display: flex;
  justify-content: space-between;
}
.header {
  padding: 10px 20px;
  display: flex;
}
.dialog_content_center {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
}
.dialog_tabs_title {
  padding: 5px 20px;
  border-bottom: 1px dashed #DCDFE6;
}
.add_box {
  padding: 20px;
}
.row {
  margin-right: 40px;
}
.el-select,.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.radio-left {
  margin-left: 81px;
}
.name-name {
  font-size: 14px;
  font-weight:400;
  line-height: 40px;
  padding-right:10px;
  width: 90px;
  span{
    color: #F56C6C
  }
}
.name-box {
  width: 100%;
  min-height: 40px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 6px 0;
}
.el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}
.demo-form-inline {
  // padding: 20px;
}
</style>
<style>
.returnVisit_dialog .el-dialog__body {
  padding: 10px ;

}
.returnVisit_dialog .el-date-editor .el-range-separator{
  width: 10%
}
.returnVisit_dialog .el-dialog__header {
  border-bottom: 1px solid #F0F0F1;
}
</style>
