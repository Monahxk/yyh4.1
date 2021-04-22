<!--
 * @Descripttion: 退货管理
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-09-04 10:05:18
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 18:07:45
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
              value-format="yyyy-MM-dd HH:mm:ss"
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
              <el-input placeholder="单号/退货人" v-model="formSearch.numberOrReturnPersonName" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formSearch.operatorId" @change="search" class="select" placeholder="请选择经办人">
                <el-option label="经办人" value=""></el-option>
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) of clinicUserList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
      </div>
		</header>
    <!-- <div class="total-content">
      <div class="total-right">
        <span>退货总金额：<i class="money">￥{{amount}}</i></span>
      </div>
    </div> -->
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
    <ReturnDetial :dialog="dialog"></ReturnDetial>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import ReturnDetial from './components/ReturnDetial'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getFinanceReturnRecordList, getArrearsListTotal} from '@/api'
export default {
	name: 'ReturnList',
	components: {Pagination,ReturnDetial},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
      clinicUserList: [],
      timeValue: '',
			formSearch: {
        operator: '',
        begDate: '',
        endDate: '',
        providerId: '',
        numberOrReturnPersonName: ''
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'orderNumber',
          label: '单据号',
          width: '200'
        },
        {
          prop: 'applyDate',
          label: '退货日期',
          formatter: function(row, column, cellValue) {
            return util.dateFormat(cellValue,'yyyy-MM-dd hh:mm')
          }
        },
        {
          prop: 'wareHouseText',
          label: '库房',
        },
        {
          prop: 'category',
          label: '物品种类',
        },
        {
          prop: 'quantity',
          label: '退货数量',
          formatter: function(row, column, cellValue) {
            return '￥'+cellValue;
          }
        },
        {
          prop: 'amountYuan',
          label: '退货金额',
          formatter: function(row, column, cellValue) {
            return '￥'+cellValue;
          }
        },
        {
          prop: 'requestorName',
          label: '申请人',
        },
        {
          prop: 'returnEmployeeName',
          label: '经办人',
        },
        {
          prop: 'remark',
          label: '退货原因',
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
    let time = util.timestampDay(date) + ' 00:00:00';
    this.timeValue = [time,time];
    this.search();
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getFinanceReturnRecordList(Object.assign(params,this.formSearch)).then(res => {
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
      // getArrearsListTotal(this.formSearch).then(res => {
      //   if(res.data.code == SYSTEM_HTTP_SUCCESS) {
      //     this.amount = res.data.data;
      //   }
      // })
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.formSearch.begDate = this.timeValue ? this.timeValue[0] : '';
      this.formSearch.endDate = this.timeValue ? this.timeValue[1] : '';
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
  .select,.select /deep/.el-input {
    width: 150px !important;
  }
</style>
