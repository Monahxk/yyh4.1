<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: PayWay.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-12
-->

<template>
  <div class="wrapper" id="PayWay">
    <div class="header">
      <div class="header_left">
        <base-tabs v-model="checkedIndex" @on-click="getParentIndex">
          <base-pane label="收费方式配置">
            <div class="tabel_box">
              <el-table
                :height="tableHeight"
                highlight-current-row
                ref="singleTable"
                :data="list"
                style="font-size: 14px"
                :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
              >
                <el-table-column prop="payWay.name" label="收费方式" sortable align="center"></el-table-column>
                <el-table-column prop="account.name" label="默认收支账户" sortable align="center"></el-table-column>
                <el-table-column prop="account.accountNumber" label="收支帐号" sortable align="center"></el-table-column>
                <el-table-column prop="types" label="充值卡" sortable align="center">
                  <template slot-scope="scope" >
                    {{scope.row.payWay.type == 1?'是':'否'}}
                  </template>
                </el-table-column>
                <el-table-column prop="payWay.remark" label="备注" sortable align="center"></el-table-column>

                <el-table-column label="操作" width="150">
                  <template slot-scope="scope" style="marginLeft:-25px">
                    <el-button type="text" size="small" @click="editPayWay(scope.row.payWay.id)">编辑</el-button>
                    <span class="line">|</span>
                    <el-button type="text" size="small" @click="delPayWay(scope.row.payWay.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </base-pane>
          <base-pane label="收费账户配置">
            <div class="tabel_box">
              <el-table
                :height="tableHeight"
                highlight-current-row
                ref="singleTable"
                :data="listed"
                :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
              >
                <el-table-column prop="name" label="收支账户" sortable align="center"></el-table-column>
                <el-table-column prop="accountNumber" label="收支账号" sortable align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" sortable align="center"></el-table-column>

                <el-table-column label="操作" width="150">
                  <template slot-scope="scope" style="marginLeft:-25px">
                    <el-button type="text" size="small" @click="editAccount(scope.row.id)">编辑</el-button>
                    <span class="line">|</span>
                    <el-button type="text" size="small" @click="delAccount(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </base-pane>
        </base-tabs>
      </div>
      <div class="header_right" @click="isShowDiaLogFn">
        <span >{{btnValue}}</span>
      </div>
    </div>
    <incomeDialog @refreshList="init" :payWayId="payWayId" :isShow="isShowDiaLog"/>
    <expenditureDialog @refreshList="initialize" :accountId="accountId" :isShow="isShowDiaLog"/>
  </div>
</template>

<script>
import incomeDialog from "./components/DialogAddPayWay.vue";
import expenditureDialog from "./components/DialogAddAccount";
import {
  getPaywayList,
  deletePayway,
  editPayway,
  listAccount,
  deleteAccount
} from "@/api";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { incomeDialog, expenditureDialog},
  props: {},
  data() {
    return {
      tableHeight: 500,
      payWayId: "",
      page: 1,
      pageSize: 10,
      total: 1,
      checkedIndex: 0, // 这个值会自动更新
      btnValue: "新增收费方式",
      list: [],
      listed: [],
      accountId: 0,
      navListData: [
        {
          title: "收费方式配置"
        },
        {
          title: "收支账户配置"
        }
      ],
      isShowDiaLog: {
        income: false,
        expenditure: false,
        edit: ""
      }
    };
  },
  watch: {
    checkedIndex(val) {
      val ? (this.btnValue = "新增收支账户") : (this.btnValue = "新增收费配置");
    }
  },
  computed: {},
  mounted() {
    this.init();
    this.initialize();

    this.$nextTick(() => {
      let height = document.getElementById("PayWay").offsetHeight;
      this.tableHeight = height-60;
    });

  },
  methods: {
    handleSizeChange(pageSize) {},
    handleChage(page) {},
    init() {
      getPaywayList().then(res => {
        let _D = res.data.data;
        this.list = _D
      });
    },
    initialize() {
      listAccount({
      }).then(res => {
        this.listed = res.data.data;
      });
    },
    editPayWay(id) {
      this.isShowDiaLog.income = !this.isShowDiaLog.income;
      this.isShowDiaLog.edit=true;
      this.payWayId = id;
    },
    editAccount(id) {
      this.accountId = id;
      this.isShowDiaLog.expenditure = !this.isShowDiaLog.expenditure;
      this.isShowDiaLog.edit=true;
    },
    //删除
    delPayWay(id) {
      this.$confirm("此操作将删除该收费方式, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePayway({ id: id }).then(res => {
          this.init();
        });
      });
    },
    delAccount(id) {
      this.$confirm("此操作将删除该收费账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteAccount({ id: id }).then(res => {
          this.initialize();
        });

      });
    },
    isShowDiaLogFn() {
      if(this.checkedIndex){
        this.isShowDiaLog.expenditure = !this.isShowDiaLog.expenditure;
        this.isShowDiaLog.edit ="";
      }else{
        this.isShowDiaLog.income = !this.isShowDiaLog.income;
        this.isShowDiaLog.edit ="";
      }
    },
    getParentIndex(v) {}


  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper{
  height:100%;
}
.header {
  position: relative;
}
.header_right {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 154px;
  height: 48px;
  font-size: 18px;
  font-weight: bold;
  color: #4e81f2;
  text-align: center;
  line-height: 48px;
  -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #ffffff;
  margin-right: 20px;
}
</style>
