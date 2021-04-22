<!--
 * @Descripttion: 折扣卡余额
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-28 10:04:14
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 18:05:27
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
      <div class="total-left">
        <span>卡余额：<i class="money">￥{{cardBalanceYuan}}</i></span>
      </div>
      <div class="total-right">
        <span>充值总额：<i class="money">￥{{cardRechargeYuan}}</i></span>
        <span>消费总额：<i class="money">￥{{cardConsumeYuan}}</i></span>
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
          <el-table-column label="操作" width="100" fixed="right" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="detail(scope.row)">流水明细</el-button>
            </template>
          </el-table-column>
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
import {getFinanceDiscountCard,getFinanceDiscountCardTotal} from '@/api'
export default {
	name: 'DiscountCard',
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
        payWayId: '',
        patientInfo: ''
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'cardNo',
          label: '卡号',
          width: '200'
        },
        {
          prop: 'patient.patientName',
          label: '患者姓名',
        },
        {
          prop: 'telephone',
          label: '联系电话',
        },
        // {
        //   prop: 'patient.sourceName',
        //   label: '患者来源',
        // },
        {
          prop: "patient.gender",
          label: "性别",
          formatter: function(row, column, cellValue) {
            return cellValue == '1' ? '男' : '女'
          }
        },
        {
          prop: "patient.age",
          label: "年龄"
        },
        {
          prop: 'patient.emrNo',
          label: '病历号',
        },
        {
          prop: 'balanceYuan',
          label: '卡余额',
          formatter: function(row, column, cellValue) {
            return '￥' + cellValue;
          }
        },
        // {
        //   prop: 'discount',
        //   label: '充值总额',
        //   formatter: function(row, column, cellValue) {
        //     return '￥' + cellValue;
        //   }
        // },
        {
          prop: 'discount',
          label: '折扣',
        },
        // {
        //   prop: 'receivedAmountYuan',
        //   label: '消费总额',
        //   formatter: function(row, column, cellValue) {
        //     return '￥' + cellValue;
        //   }
        // },
        {
          prop: 'rechargeTime',
          label: '办卡日期',
          formatter: function(row, column, cellValue) {
            return util.dateFormat(cellValue,'yyyy-MM-dd hh:mm')
          }
        },
      ],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
      },
      cardBalanceYuan: 0,//充值卡/折扣卡余额
      cardConsumeYuan: 0,//充值卡/折扣卡消费金额
      cardRechargeYuan: 0,//充值卡/折扣卡充值金额
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
			getFinanceDiscountCard(Object.assign(params,this.formSearch)).then(res => {
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

      getFinanceDiscountCardTotal(this.formSearch).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.cardRechargeYuan = res.data.data.cardRechargeYuan;
          this.cardConsumeYuan = res.data.data.cardConsumeYuan;
          this.cardBalanceYuan = res.data.data.cardBalanceYuan;
        }
      })
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.formSearch.startTime = this.timeValue ? this.timeValue[0] : '';
      this.formSearch.endTime = this.timeValue ? this.timeValue[1] : '';
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
    justify-content: space-between;
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
</style>
