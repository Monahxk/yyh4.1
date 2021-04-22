<!--
 * @Descripttion: 营销管理，预存卡
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-10-30 13:38:37
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 11:41:47
 -->
<template>
  <div class="wrapper">

    <div class="charge_item" ref="charge_item">
      <div class="box_header" ref="box_header">
        <el-form :inline="true" :model="formSearch"  label-width="90px" class="demo-form-inline" >
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="办卡日期">
                <el-date-picker
                  v-model="formSearch.time"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="开卡患者">
                <el-input placeholder="请输入姓名" v-model="formSearch.patientName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="卡号/手机号" >
                <el-input placeholder="请输入" v-model="formSearch.number" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="经办人">
                <el-select v-model="formSearch.userId" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button type="primary" class="search_btn" round @click="getTableList('query')">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="add_btn" @click="addChargDialog('add')">新办预存卡</div>
      </div>
      <div class="main-content">
        <el-table
          highlight-current-row
          ref="singleTable"
          :data="tableList"
          style="font-size: 14px"
          v-loading.fullscreen.lock="tableLoading"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../assets/img/blank.png" alt>
            </div>
          </template>
          <el-table-column prop="cardNo" label="卡号" align="center" sortable></el-table-column>
          <el-table-column prop="patient.patientName" label="开卡患者" align="center"></el-table-column>
          <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
          <el-table-column prop="balanceYuan" label="卡余额" :formatter="formatterMoney" align="right" sortable></el-table-column>
          <el-table-column prop="rechargeTime" label="办卡日期" align="center" sortable></el-table-column>
          <el-table-column prop="employeeName" label="经办人" align="center" sortable></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>

          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="predepositCardDetail(scope.row.id)">详情</el-button>
              <span class="line">|</span>
              <el-button type="text" size="small" @click="addChargDialog('recharge',scope.row.id)">充值</el-button>
              <span class="line">|</span>
              <el-dropdown>
								<span class="el-dropdown-link">
									更多
								</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="editChargDialog(scope.row.id)">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="turnoverDetail(scope.row)">流水明细</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
              @current-change="handleChage"
              :pager-count="9"
              :total="formSearch.totalNumber"
              :current-page="formSearch.page"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- <pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></pagination> -->

      <addPredepositCardDialog :dialogCfg="dialogCfg" @getTableList="getTableList"></addPredepositCardDialog>
      <editCardDialog :dialogCfg="dialogCfg" @getTableList="getTableList"></editCardDialog>
      <flowDetailDialog :dialogCfg="dialogCfg"></flowDetailDialog>
      <cardDetailDialog :dialogCfg="dialogCfg" ></cardDetailDialog>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/inventory/pagination'
import addPredepositCardDialog from './components/AddPredepositCardDialog'
import editCardDialog from './components/EditCardDialog'
import flowDetailDialog from './components/FlowDetailDialog'
import cardDetailDialog from './components/CardDetailDialog'

import {predepositcardList,listClinicUser} from '@/api'

export default {
  name:'predepositCard',
  components: {
    pagination,
    addPredepositCardDialog,
    editCardDialog,
    flowDetailDialog,
    cardDetailDialog
  },
  data() {
    return {
      loading: false,
      tableLoading: true,
      dialogCfg: {
        add: {
          isshow: false,
          title: '新增预存卡',
          type: 'add',
          id: ''
        },
        edit: {
          isshow: false,
          title: '修改',
          type: 'predeposit',
          id: ''
        },
        turnover: {
          isshow: false,
          title: '流水明细',
          id: '',
          type: 'predeposit'
        },
        detail: {
          isshow: false,
          title: '详情',
          id: '',
          type: 'predeposit'
        }
      },
      userList: [],
      formSearch: { //项目搜索
        patientName: '',
        time: '',
        userId: '',
        number: '',
        totalNumber: 1,
        pageSize: 10,
        total: 0,
        page: 1,
      },
      tableHeight: 300,
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      checkedIndex: 0, // 这个值会自动更新
      tableList: [],

    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    //打开新增/修改模态框
    addChargDialog(type,id){
      let _this=this
      _this.dialogCfg.add.isshow = true;
      _this.dialogCfg.add.type = type;
      if(type == 'add'){
        _this.dialogCfg.add.title = '新增预存卡'
      } else if(type == 'edit'){
        _this.dialogCfg.add.title = '修改预存卡';
        _this.dialogCfg.add.id = id;
      } else if(type == 'recharge') {
        _this.dialogCfg.add.title = '预存卡-充值';
        _this.dialogCfg.add.id = id;
      }

    },
    //每页显示条数改变
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this.getTableList();
    },
    handleChage(page) {
      this.formSearch.page = page;
      console.log(page)
      this.getTableList();
    },
    init() {  //项目初始化
      this.$nextTick(() => {
        let wheight = this.$refs['charge_item'].offsetHeight - this.$refs['box_header'].offsetHeight - 60;//50为分页高度
        this.tableHeight = wheight;
      })
      this.getTableList();
      this.getUserList();
    },
    //获取供应商列表
    getTableList(params) {
      let _this = this;
      _this.tableLoading = true;
      predepositcardList({
        page: _this.formSearch.page,
        pageSize: _this.formSearch.pageSize,
        patientName: _this.formSearch.patientName,
        number: _this.formSearch.number,
        userId: _this.formSearch.userId,
        startTime: _this.formSearch.time ? _this.formSearch.time[0] : '',
        endTime: _this.formSearch.time ? _this.formSearch.time[1] : '',
      }).then(res => {
        this.tableList = Array.isArray(res.data.data) && res.data.data ? res.data.data : [{id:1}];
        this.formSearch.totalNumber = res.data.totalNumber || 0;
        _this.tableLoading = false;
      }).catch(res => {
         _this.tableLoading = false;
      });
    },
    //流水明细
    turnoverDetail(rowData) {
      this.dialogCfg.turnover.id = rowData.id;
      this.dialogCfg.turnover.isshow = true;
      this.dialogCfg.turnover.title = rowData.patient.patientName + '的流水明细';
    },
    //详情
    predepositCardDetail(id) {
      this.dialogCfg.detail.id = id;
      this.dialogCfg.detail.isshow = true;
    },
    editChargDialog(id) {
      this.dialogCfg.edit.id = id;
      this.dialogCfg.edit.isshow = true;
    },
    //获取经办人
    getUserList() {
      listClinicUser().then(res => {
        this.userList = res.data.data;
      })
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  padding-bottom: 10px;
  .charge_item {
    position: relative;
    height: 100%;
    .pagination_box{
      padding:0;
    }
    .height100 {
      height: 100%;
    }
    .main-content{
      height: 88%;
    }
    .pagination {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .box_header .el-form .el-input {
      width: 200px !important;
    }

    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    /deep/.box_header .el-form .el-input {
      width: 220px !important;
    }
  }
}
</style>
