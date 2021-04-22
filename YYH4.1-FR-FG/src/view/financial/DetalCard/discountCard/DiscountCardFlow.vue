<!--
 * @Descripttion: 折扣卡余额
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-28 10:00:22
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 18:05:36
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
          <div class="nav_item">
						<el-button type="text" icon="el-icon-search" @click="showQuery=!showQuery">搜索</el-button>
					</div>
          <div class="nav_item">
						<el-select v-model="formSearch.type" placeholder="交易类型" @change="search"  clearable>
              <el-option label="充值" value="0"></el-option>
              <el-option label="消费" value="1"></el-option>
            </el-select>
					</div>
          <div class="nav_item">
            <el-radio-group v-model="formSearch.queryFlag" >
              <el-radio-button label="0">日</el-radio-button>
              <el-radio-button label="1">月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="nav_item" v-show="formSearch.queryFlag == '0'">
            <el-date-picker
              v-model="timeValue"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="search">
            </el-date-picker>
          </div>
          <div class="nav_item" v-show="formSearch.queryFlag == '1'">
            <el-date-picker
              v-model="formSearch.startTime"
              value-format="yyyy-MM"
              @change="search"
              type="month"
              placeholder="开始月"
              class="h-month">
            </el-date-picker>
            <el-date-picker
              v-model="formSearch.endTime"
              value-format="yyyy-MM"
              @change="search"
              type="month"
              placeholder="结束月"
              class="h-month">
            </el-date-picker>
          </div>
				</div>
			</div>
      <div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
          <el-form-item>
            <el-input placeholder="卡号/患者姓名/病历号" v-model="formSearch.patientInfo" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
		</header>
    <div class="total-content">
      <div class="total-right">
        <span>流入：<i class="money">￥{{inflowYuan}}</i></span>
        <span>流出：<i class="money">￥{{outflowYuan}}</i></span>
      </div>
    </div>
		<main class="main-content">
			<section class="table-box" :class="{'re-ren': showQuery}">
				<el-table
          highlight-current-row
          ref="table"
          :data="tableList"
          :style="{'font-size': tableStyleConfig.font}"
          height="100%"
          v-loading="tableLoading"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
          <template v-for="(item, index) of tableTitle">
          <el-table-column
            :key="index"
            :width="item.width"
            :label="item.label"
            :prop="item.prop"
            align="center"
            :formatter="item.formatter"
          ></el-table-column>
          </template>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
    <DetailDialog :dialog="dialog"></DetailDialog>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import DetailDialog from './DetailDialog'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getFinanceDiscountCardFlows,getFinanceDiscountCardFlowTotal} from '@/api'
export default {
	name: 'DiscountCardFlows',
	components: {Pagination,DetailDialog},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
      payWayList: [],
      clinicUserList: [],
      timeValue: '',
			formSearch: {
        startTime: '',
        endTime: '',
        type: '',
        patientInfo: '',
        queryFlag: '0'
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'discountCard.cardNo',
          label: '卡号',
          width: '200'
        },
        {
          prop: 'discountCard.patient.patientName',
          label: '患者姓名',
        },
        // {
        //   prop: 'patient.sourceName',
        //   label: '患者来源',
        // },
        {
          prop: "discountCard.patient.gender",
          label: "性别",
          formatter: function(row, column, cellValue) {
            return cellValue == '1' ? '男' : '女'
          }
        },
        {
          prop: "discountCard.patient.age",
          label: "年龄",
        },
        {
          prop: 'discountCard.patient.emrNo',
          label: '病历号',
        },
        {
          prop: 'flowMoneyYuan',
          label: '流水金额',
          formatter: function(row, column, cellValue) {
            return '￥' + cellValue;
          }
        },
        {
          prop: 'payWayName',
          label: '支付方式',
        },
        {
          prop: 'balanceYuan',
          label: '卡余额',
          formatter: function(row, column, cellValue) {
            return '￥' + cellValue;
          }
        },
        {
          prop: 'rechargeTime',
          label: '交易日期',
          formatter: function(row, column, cellValue) {
            return util.dateFormat(cellValue,'yyyy-MM-dd hh:mm')
          }
        },
        {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'createEmployee.name',
          label: '经办人',
        },
      ],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
      },
      outflowYuan: 0,
      inflowYuan: 0,
      dialog: {
        isshow: false,
        id: '',
        dialogTitle: ''
      }
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
	},
	mounted() {
    let date = new Date();
    let time = util.timestampDay(date);
    this.timeValue = [time,time];
    this.search();
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getFinanceDiscountCardFlows(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data;
          this.tableList = data.data || [];
          this.pageConfig.total = data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
      getFinanceDiscountCardFlowTotal(this.formSearch).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.inflowYuan = res.data.data.inflowYuan;
          this.outflowYuan = res.data.data.outflowYuan;
        }
      })
    },
    search() {
      this.pageConfig.currentPage = 1;
      if(this.timeValue) {
        this.formSearch.startTime = this.timeValue[0];
        this.formSearch.endTime = this.timeValue[1];
      } else if(this.formSearch.queryFlag == '0'){
        this.formSearch.startTime = '';
        this.formSearch.endTime = '';
      }
      this.getTableList();
    },
    handleSizeChange(pageSize) {
      this.pageConfig.currentPage = 1;
      this.pageConfig.pageSize = pageSize;
      this.getTableList();
    },
     handleChage(page) {
      this.pageConfig.currentPage = page;
      this.getTableList();
    },
    detail(row) {
      this.dialog.isshow = true;
      this.dialog.id = row.id;
      this.dialog.dialogTitle = row.patient.patientName;
    }
	}
}
</script>
<style lang="less" scoped>
	.total-content {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    .total-right {
      span {
        margin-left: 10px;
      }
    }
    .money {
      color: #568BFD;
    }
  }
  .h-month {
    width: 120px !important;
    &:first-child {
      margin-right: 10px;
    }
  }
</style>
