<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: TempAllCustomer.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-15
-->

<template>
  <div class="wrapper_workbench_table">
    <div>
      <ul class="box">
        <li class="top">
          <el-form>
            <el-row>
              <el-col :span="7">
                <el-form-item label-width="80px" label="姓名">
                  <el-input v-model="name" class="bodrs" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="80px" label="咨询日期">
                  <el-date-picker
                    v-model="consultDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="80px" label="咨询状态">
                  <el-select v-model="status" placeholder="请选择咨询进度">
                    <el-option
                      v-for="(item,index) in statusList"
                      :key="index"
                      :label="item.lable"
                      :value="item.status"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="right">
                  <el-row>
                    <el-button type="primary" class="search_btn" round @click="initlist()">查询</el-button>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </li>
        <li class="bottom">
          <el-form>
            <el-row>
              <el-col :span="7">
                <el-form-item class="downlist" label-width="80px" label="手机号" >
                  <el-input v-model="teleno" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="80px" label="咨询师">
                  <el-select v-model="customerObj.consultant" placeholder="请选择">
                    <el-option
                      v-for="(item,index) in consultantList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="7">
                <el-form-item label-width="80px" label="咨询项目">
                  <el-select style v-model="customerObj.consultItem" placeholder="请选择" >
                    <el-option
                      v-for="(item,index) in projectList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="2">
                <el-button type="primary" class="search_btn" round @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </li>
      </ul>
    </div>

    <div class="wrapper_table">
      <el-table
        highlight-current-row
        ref="singleTable"
        :data="customerList"
        style="font-size: 14px"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >
        <template slot="empty">
          <div class="table-empty">
            <img src="../../../../assets/img/blank.png" alt>
          </div>
        </template>
        <el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
        <el-table-column prop="customer.name" label="姓名" sortable align="center"></el-table-column>
        <el-table-column prop="customer.teleno" label="电话" sortable align="center"></el-table-column>
        <el-table-column prop="customer.consultTime" label="咨询时间" sortable align="center"></el-table-column>
        <el-table-column
          label="咨询师"
          v-for="(item,index) in customerList.clinicUser"
          prop="item.name"
          :key="index"
          sortable
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(item,index) in customerList.dentalAppointmentProject"
          prop="item.projectName"
          :key="index"
          label="预约项目"
          align="center"
        ></el-table-column>
        <el-table-column prop="statusStr" label="咨询状态" sortable align="center"></el-table-column>
        <el-table-column prop="customer.patientRemark" label="备注" sortable align="center"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope" style="marginL4ft:-25px">
            <el-button type="text" size="small" @click="editCustomer(scope.row.customer.id)">详情</el-button>
            <span class="line"></span>
            <el-button type="text" size="small" @click="delCustomer(scope.row.customer.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_bottom">
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
            :total="totalNumber"
            :current-page="page"
          ></el-pagination>
        </div>
      </div>
    </div>
    <addEdit  :id="id" :isShow="isShowDialog"/>
  </div>
</template>

<script>
import monment from "moment";
import addEdit from "./DialogEditCustomer.vue";
import {
  listCustomer,
  deteClinicUser,
  particularsClinicUser,
  listCustomered,
  listCustomerdoor,
  getCustomerDownList
} from "@/api";
export default {
  components: { addEdit },
  props: {},
  data() {
    return {
      status: "",
      statusList: [],
      form: {},
      id: "",
      page: 1,
      pageSize: 10,
      customerList: [],
      name: "",
      consultDate: "",
      teleno: "",
      pagerCount: 1,
      totalNumber:0,
      customerObj: {
        consultant: "",
        consultItem: ""
      },
      isShowDialog: {
        add: false,
        show: false
      },
      consultantList: [],
      projectList: [],
      status: ""
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.initlist();
    let _this = this;
    this.$root.Bus.$on("refreshList", function() {
      _this.initlist();
    });
    getCustomerDownList({}).then(res => {
      let s = res.data.data.statusMap;
      for (const key in s) {
        this.statusList.push({ status: key, lable: s[key] });
      }
      this.projectList = res.data.data.consultItemList;
      this.consultantList = res.data.data.consultantList;
    });
  },
  methods: {
    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    delCustomer(a) {
      this.$confirm("此操作将删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deteClinicUser({ id: a }).then(res => {
            if (res.data.code === 200) {
              this.initlist();
            }
          });
        })
        .catch(() => {});
    },
    initlist() {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        onlyToday: false,
        name: this.name,
        teleno: this.teleno,
        consultDate: this.consultDate,
        consultantId: this.customerObj.consultant,
        consultItemId: this.customerObj.consultItem,
        status: this.status
      };
      listCustomer(data).then(res => {
        this.customerList = res.data.data;
        this.totalNumber=res.data.totalNumber;
      });
    },
    editCustomer(id) {
      this.id = id;
      this.isShowDialog.show = !this.isShowDialog.show;
    },
    reset() {
      this.page=1
      this.name=''
      this.teleno=''
      this.consultDate=''
      this.customerObj.consultant=''
      this.customerObj.consultItem=''
      this.status=''
      this.initlist();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initlist();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.initlist();
    }
  },

  mixins() {}
};
</script>
<style  scoped  lang="less">
.box {
  width:97%;
  box-shadow: 0 0 6px 0 #e4e9ff;
  margin: 30px auto;
  .el-form .el-input,.el-select {
    width: 270px;
  }
  .search_btn {
    padding: 12px 50px;
  }
}
ul {
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #ffffff;
  margin-top: 10px;
  .top {
    padding-top: 20px;
    overflow: hidden;
  }
}
.wrapper_workbench_table {
  background: #fcfdff;
  position: absolute;
  left: 0;
  top: 27px;
  right: 0;
  bottom: 0px;
}
.wrapper_table {
  position: absolute;
  left: 20px;
  top: 200px;
  right: 20px;
  bottom: 71px;
  overflow-y: scroll;
  background: #fff;
  .table-empty {
    padding: 50px 0px;
    width: 400px;
    margin: auto;
  }
}
.line {
  display: inline-block;
  height: 14px;
  border-left: 1px solid #000;
  vertical-align: -2px;
  margin: 0 2px 0 2px;
}
.table_bottom {
  height: 70px;
  width: 100%;
  border-top: 1px solid rgba(59, 120, 253, 0.34);
  position: absolute;
  bottom: 0px;
}
.but_box {
  float: left;
  padding: 20px 0 0 26px;
}
.pagination_box {
  padding: 25px 17px 0 0;
  float: right;
}
.start_but {
  width: 74px;
  height: 32px;
  border: 1px solid #4d9eff;
  border: none;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: #4d9eff;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #4d9eff;
  margin-right: 4px;
}
.start_but:hover {
  box-shadow: 0 2px 3px 0 rgba(34, 113, 199, 0.25);
}
.but_avtive {
  background-image: linear-gradient(to right, #4d9eff, #3b78fd);
  color: #fff;
}
</style>
<style>
.pagination_box .block .el-pagination span {
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
/* 退出弹出框 */
.wrapper_workbench_table .dialogBox .el-dialog {
  border-radius: 4px;
  margin: 0;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
}
.wrapper_workbench_table .dialogBox .el-dialog__body {
  font-family: PingFangSC;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.85);
}

.wrapper_workbench_table .dialogBox .el-dialog__body {
  padding: 45px 20px;
}
.wrapper_workbench_table .dialogBox .el-dialog__footer {
  height: 53px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid #ccc !important;
}
.wrapper_workbench_table .el-table__empty-block {
  min-height: 345px;
}
</style>
