<!--
 * @Descripttion: 收费账单
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 17:50:39
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
          <div class="nav_item">
            <el-select class="q-select" v-model="formSearch.payWayId"  @change="search" placeholder="请选择收费方式" clearable>
              <el-option label="全部收费方式" value=""></el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) of payWayList"
                :key="index"
              ></el-option>
            </el-select>
					</div>
          <div class="nav_item">
            <el-select class="q-select"  v-model="formSearch.operator"  @change="search" placeholder="请选择收费员" clearable>
              <el-option label="全部收费员" value=""></el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) of clinicUserList"
                :key="index"
              ></el-option>
            </el-select>
					</div>
				</div>
			</div>
      <div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
          <el-form-item>
            <el-input placeholder="单号/患者姓名" v-model="formSearch.numberOrPatientName" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
		</header>
    <div class="total-content">
      <div class="total-right">
        <span>原价：<i class="money">￥{{amount}}</i></span>
        <span>应收：<i class="money">￥{{sum}}</i></span>
        <span>实收：<i class="money">￥{{countFeeSum}}</i></span>
        <span>欠费：<i class="money">￥{{arrears}}</i></span>
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
              <img src="../../../assets/img/blank.png" alt>
            </div>
          </template>
          <template v-for="(item, index) of tableTitle">
            <el-table-column
            v-if="item.ismoney"
            :key="index"
            :width="item.width"
            :label="item.label"
            :prop="item.prop"
            align="center"
          >
            <template slot-scope="scope">
              <span>￥{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            :width="item.width"
            :label="item.label"
            :prop="item.prop"
            align="center"
          ></el-table-column>
          </template>
          <el-table-column label="操作" width="100" fixed="right" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="detail(scope.row)">明细</el-button>
            </template>
          </el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
    <chargeDetail :dialog="dialog"></chargeDetail>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import chargeDetail from '@/components/finance/chargeDetail'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getChargebillvo, getFinancePageFilter, getChargeitem} from '@/api'
export default {
	name: 'ChargeBill',
	components: {Pagination,chargeDetail},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
      payWayList: [],
      clinicUserList: [],
      timeValue: '',
			formSearch: {
        operator: '',
        startTime: '',
        endTime: '',
        payWayId: '',
        numberOrPatientName: ''
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'number',
          label: '单据号',
          width: '150'
        },
        {
          prop: 'patient.patientName',
          label: '患者姓名',
        },
        // {
        //   prop: 'patient.sourceName',
        //   label: '患者来源',
        // },
        {
          prop: 'patient.mobilephone',
          label: '电话',
          width: '120'
        },
        {
          prop: 'amountYuan',
          label: '原价',
          width: 100,
          ismoney: true
        },
        {
          prop: 'discount',
          label: '折扣',
        },
        {
          prop: 'discountAmountYuan',
          label: '折后价',
          width: 100,
          ismoney: true
        },
        {
          prop: 'receivedAmountYuan',
          label: '实收',
          width: 100,
          ismoney: true
        },
        {
          prop: 'arrearsYuan',
          label: '欠费',
          width: 100,
          ismoney: true
        },
        {
          prop: 'toller.name',
          label: '收费员',
        },
        {
          prop: 'payWayName',
          label: '支付方式',
          width: '150'
        },
        {
          prop: 'chargeTime',
          label: '收费日期',
          width: '160'
        },
        {
          prop: 'nurse.name',
          label: '护士',
        },
        {
          prop: 'doctor.name',
          label: '医生',
        },
        {
          prop: 'remark',
          label: '备注',
          width: '200'
        }
      ],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
      },
      sum: 0,//应收
      countFeeSum: 0,//实收
      amount: 0,//总费用
      arrears: 0,//欠费
      dialog: {
        isshow: false,
        id: ''
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
    getChargebillvo().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        let {data: {data: {employeeList, payWayList}}} = res;
        this.payWayList = payWayList;
        this.clinicUserList = employeeList;
      }
    })
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getFinancePageFilter(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data;
          this.tableList = data.chargeBillPage.content;
          this.pageConfig.total = data.chargeBillPage.totalElements || 0;
          this.arrears = data.arrears || 0;
          this.sum = data.sum || 0;
          this.countFeeSum = data.countFeeSum || 0;
          this.amount = data.amount || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
          this.arrears = 0;
          this.sum = 0;
          this.countFeeSum = 0;
          this.amount = 0;
        }
      });
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.formSearch.startTime =  this.timeValue ? this.timeValue[0] + ' 00:00:00' : '';
      this.formSearch.endTime = this.timeValue ? this.timeValue[1] + ' 00:00:00' : '';
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
        .money {
          color: #568BFD;
        }
      }
    }
  }
  .q-select {
    width: 130px !important;
  }
</style>
