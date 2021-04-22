<template>
  <div class="wrapper callback">
    <div class="nav_item">
      <base-tabs v-model="checkedIndex">
        <base-pane label="回访管理">
          <span @click="newCallBack" class="add_new_but">新增回访</span>
          <div class="optios">
            <el-form ref="form" label-position="center" :model="form" label-width="100px">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="回访日期">
                    <el-date-picker
                      class="time"
                      v-model="visitTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width:100%"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="7" :push="0">
                  <el-form-item label="回访状态">
                    <el-select v-model="form.status" placeholder="请选择回访状态">
                      <el-option
                        :label="value"
                        :value="key"
                        v-for="(value, key) in searchData.callbackStatusMap"
                        :key="key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" :pull="0">
                  <el-form-item label="诊治医生">
                    <el-select v-model="form.doctorId" placeholder="请选择诊治医生">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of searchData.doctorList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" :pull="0">
                  <!-- <el-form-item> -->
                    <div class="seachbtn">
                      <el-button type="primary" class="search_btn" round  @click="searchFn()">查询</el-button>
                    </div>
                  <!-- </el-form-item> -->
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7" >
                  <el-form-item label="姓名">
                    <el-input v-model="form.patientName" placeholder="请输入姓名" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </base-pane>
      </base-tabs>
    </div>

    <div class="table_box">
      <callbackList
        :tableData="sendData"
        :total="total"
        @editEvent="getEditData"
        @updateInit="initCallbackDataList"
        @acceptPage="handelPageFn"
        @acceptPageSize="handelPageSizeFn"
        @addManyCallBack="addManyCallBack"
      />
    </div>

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
          :current-page="form.page"
          :pager-count="9"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <addCallback :isShow="paramObj" :patient="patient" @successData="initCallbackDataList"/>
    <editCallback
      @sendEvent="initCallbackDataList"
      :isShow="paramObj"
      :selectData="selectData"
      :form="editCallbackData"
      :stateData="stateData"
    />
  </div>
</template> 
<script>
import addCallback from "./components/DialogAddCallback";
import callbackList from "./components/TempTable";
import editCallback from "./components/DialogEditCallback";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import {
  getCallbacklist,
  getCallbackfiltervo,
  getCallbackfilter,
  getEditCallbackvo
} from "@/api";
import monment from "moment";
export default {
  components: { callbackList, addCallback, editCallback },
  props: {},
  data() {
    return {
      visitTime: [],
      selectData: {
        resultSet:"",    
        callerList:"",     
        periodList:"",    
        doctorList:"",       
        contentSet:""  
      },
      stateData: {},
      editCallbackData: {
        callerId: "", // 回访人员
        callTime: "", // 回访时间
        doctorId: "", // 诊治医生
        status: 0,
        result: "", // 回访结果
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      },
      form: {
        page: 1,
        pageSize: 10,
        begDate: "",
        endDate: "",
        status: null,
        patientName: null,
        callerId: null,
        doctorId: null
      },
      checkedIndex: 0,
      sendData: [],
      searchData: {
        callbackStatusMap: [],
        callerList: [],
        doctorList: []
      },
      total: 1, // 分页总的条目数
      patient: {},
      paramObj: {
        iframeShow: false,
        id: "",
        tapActive: "",
        register: false,
        edit: false,
        shows: false,
        more: false
      }
    };
  },
  created() {},
  watch: {
    visitTime(val) {
      if (!val) {
        this.form.begDate = "";
        this.form.endDate = "";
      }
    }
  },
  computed: {},
  methods: {
    // 新增回访
    getEditData(row) {
      // 获取回访单挑数据
      getEditCallbackvo(row.callback.id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.selectData = res.data.data;
          this.selectData.emrNo = row.emrNo;
          this.selectData.mobilphone = row.teleno;
          this.stateData.name = row.patientName;
          this.stateData.emrNo = row.emrNo;
          this.stateData.mobilphone = row.teleno;
          this.stateData.visitTime = row.visitTime;
          this.editCallbackData = res.data.data.callback;
          this.editCallbackData.callerId = res.data.data.callback.callerId;
          this.editCallbackData.doctorId = res.data.data.callback.doctorId;
          this.editCallbackData["patientId"] = res.data.data.callback.patientId;
          this.stateData.isOff = row.isOff;
        }
      });
      this.paramObj.shows = !this.paramObj.shows;
    },
    addManyCallBack(val) {
      this.paramObj.register = !this.paramObj.register;
      this.patient.patientId = val.callback.patientId;
      this.patient.patientName = val.callback.patientName;
      this.patient.emrNo = val.emrNo;
      this.patient.mobilephone = val.teleno;
      this.paramObj.more = true;
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.searchFn(true);
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.searchFn();
    },
    initSearchFn() {
      getCallbackfiltervo().then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          Object.assign(this.searchData,res.data.data)
        }
      });
    },
    searchFn(isChangePage) {
      if(!isChangePage)this.form.page = 1;
      if (this.visitTime) {
        let [beg, end] = this.visitTime;
        this.form.begDate = beg;
        this.form.endDate = end;
      }
      getCallbackfilter(this.form).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          this.total = res.data.totalNumber;
          let arr = ["未回访", "已回访", "无结果", "已取消"];
          let sex = ["男", "女"];
          this.sendData = _D.map(v => {
            v.statusTxt = arr[parseInt(v.callback.status)];
            v.id = v.callback.id;
            v.status = v.callback.status;
            v.patientName = v.callback.patientName;
            v.callTime = v.callback.callTime;
            v.visitTime = v.callback.visitTime;
            v.content = v.callback.content;
            v.result = v.callback.result;
            v.remark = v.callback.remark;
            return v;
            return v;
          });
        }
      });
    },
    initCallbackDataList() {
      getCallbacklist({
        page: this.form.page,
        pageSize: this.form.pageSize
      }).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          this.total = res.data.totalNumber;
          let arr = ["未回访", "已回访", "无结果", "已取消"];
          let sex = ["男", "女"];
          this.sendData = _D.map(v => {
            v.statusTxt = arr[parseInt(v.callback.status)];
            v.id = v.callback.id;
            v.status = v.callback.status;
            v.patientName = v.callback.patientName;
            v.callTime = v.callback.callTime;
            v.visitTime = v.callback.visitTime;
            v.content = v.callback.content;
            v.result = v.callback.result;
            v.remark = v.callback.remark;
            return v;
          });
        }
      });
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD hh:mm:ss");
    },
    handelPageFn(val) {
      this.page = val;
    },
    handelPageSizeFn(val) {
      this.pageSize = val;
    },
    newCallBack() {
      this.paramObj.register = !this.paramObj.register;
      this.paramObj.more = false;
    }
  },
  mixins: [],
  mounted() {
    this.initSearchFn();
    this.initCallbackDataList();
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.optios {
  padding-top: 16px;
  background: #fff;
  height: auto;
  box-shadow: 0 0 6px 0 #e4e9ff;
  .el-row {
    margin-bottom: 0;
  }
}
.time {
  width: 100%;
}
.wrapper {
  .contene_set {
    width: 600px;
  }
  .nav_item {
    color: #493bfd;
    display: flex;
    align-items: center;
    .add_new_but {
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
    .nav_title {
      cursor: pointer;
      font-size: 14px;
      padding-left: 10px;
      line-height: 40px;
      height: 40px;
      color: #000;
    }
    .nav_main {
      display: flex;
      font-size: 14px;
      overflow: hidden;
      margin-left: 20px;
      transition: all 1s;
      li {
        line-height: 20px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .active_checked {
      border-bottom: 2px solid #7874f2;
    }
  }
  .active span,
  .active li {
    color: #493bfd !important;
  }
  .active .nav_main {
    width: auto;
    transition: all 0.1s easy;
  }
  .seachbtn {
    margin-left: 50px;
    .search_btn {
      padding: 12px 50px;
    }
  }
  .table_box {
    background-color: #fff;
    position: absolute;
    bottom: 80px;
    top: 245px;
    right: 20px;
    left: 20px;
    width: 100%;
  }
  .pagination_box {
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.el-form .el-input,.el-select,.el-form .el-input__inner {
    width: 270px !important;
  }
</style>
<style>
.callback .nav_item .wrapper_table {
  position: absolute;
  left: 20px;
  top: 205px;
  right: 20px;
  bottom: 90px;
  /* overflow-y: scroll; */
}
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

.has-gutter .gutter {
  background: rgb(247, 249, 255);
}
</style>
