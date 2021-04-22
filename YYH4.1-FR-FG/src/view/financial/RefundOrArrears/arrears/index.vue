<!--
 * @Descripttion: 欠费
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-30 14:49:15
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 18:01:48
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
          <!-- <div class="nav_item">
            <el-select v-model="formSearch.operator"  @change="search" placeholder="请选择收费员">
              <el-option label="收费员" value=""></el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) of clinicUserList"
                :key="index"
              ></el-option>
            </el-select>
					</div> -->
				</div>
			</div>
      <div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
          <el-form-item>
            <el-input placeholder="单号/患者姓名" v-model="formSearch.numberOrEmrNoOrPatientName" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
		</header>
    <div class="total-content">
      <div class="total-right">
        <span>欠费总金额：<i class="money">￥{{amount}}</i></span>
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
              <el-button type="text" size="small" @click="detail(scope.row)">详情</el-button>
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
import {getArrearsList, getArrearsListTotal} from '@/api'
export default {
	name: 'arrears',
	components: {Pagination,chargeDetail},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
      clinicUserList: [],
      timeValue: '',
			formSearch: {
        operator: '',
        startTime: '',
        endTime: '',
        payWayId: '',
        numberOrEmrNoOrPatientName: ''
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'number',
          label: '单据号',
        },
        {
          prop: 'patient.emrNo',
          label: '病历号',
        },
        {
          prop: 'patient.patientName',
          label: '患者姓名',
        },
        {
          prop: 'patient.mobilephone',
          label: '电话',
        },
        {
          prop: 'arrearsYuan',
          label: '欠费金额',
          formatter: function(row, column, cellValue) {
            return '￥'+cellValue;
          }
        },
        {
          prop: 'visitTime',
          label: '就诊日期',
          formatter: function(row, column, cellValue) {
            return util.dateFormat(cellValue, 'yyyy-MM-dd hh:mm')
          }
        },
        {
          prop: 'toller.name',
          label: '经办人',
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
        }
      ],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
      },
      amount: 0,//总费用
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
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getArrearsList(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data;
          this.tableList = data.data;
          this.pageConfig.total = data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
      getArrearsListTotal(this.formSearch).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.amount = res.data.data;
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
    }
	}
}
</script>
<style lang="less" scoped>
	.total-content {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    .total-right {
      span {
        .money {
          color: #568BFD;
        }
      }
    }
  }
</style>
