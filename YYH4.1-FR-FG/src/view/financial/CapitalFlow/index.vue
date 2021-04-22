<!--
 * @Descripttion: 资金流水
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 18:12:17
 -->
<template>
	<div class="wrapper">
		<main class="main-content">
      <div class="drug-types">
        <el-menu
          :default-active="defaultActive"
          @select="changeType"
          class="el-menu-vertical-demo">
          <el-menu-item v-for="(item,index) in payWayList" :index="item.id+''" :key="index">
            <div slot="title" class="item"><div>{{item.name}}</div><div v-if="item.money">￥{{item.money}}</div></div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="table-content">
        <div class="query-box">
          <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
            <el-form-item>
              <el-date-picker
                v-model="timeValue"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="search">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="total-content">
          <div class="total-left">
            <span>资金合计：<i class="money">￥{{totalYuan}}</i></span>
          </div>
          <div class="total-right">
            <span>流入：<i class="money">￥{{inflowYuan}}</i></span>
            <span>流出：<i class="money">￥{{outflowYuan}}</i></span>
          </div>
        </div>
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
            <el-table-column prop="time" label="交易日期" align="center"></el-table-column>
            <el-table-column prop="flowNumber" label="单据号" align="center"></el-table-column>
            <el-table-column prop="payWay.name" label="支付方式" align="center"></el-table-column>
            <el-table-column prop="dailyIncomeOutType.name" label="收支类别" align="center"></el-table-column>
            <el-table-column prop="amountMoneyYuan" label="金额" align="center"></el-table-column>
            <el-table-column prop="dailyIncomeOut.employee.name" label="经办人" align="center"></el-table-column>
            <el-table-column prop="dailyIncomeOut.description" label="备注" align="center"></el-table-column>
          </el-table>
        </section>
        <footer class="footer">
          <Pagination :pageConfig="pageConfig"  @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
        </footer>
      </div>
		</main>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getCapitalflowvo,getCapitalflowTotal,getCapitalflow} from '@/api'
export default {
	name: 'CapitalFlow',
	components: {Pagination},
  data() {
		return {
			showQuery: false,
			tableel: false,
      state: 0,
      timeValue: '',
			formSearch: {
        payWayId: '',
        startTime: '',
        endTime: ''
      },
      defaultActive: '',
			payWayList: [],
			tableLoading: false,
			tableList: [],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
      },
      totalYuan: 0,
      outflowYuan: 0,
      inflowYuan: 0,
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
		getTableList(index) {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getCapitalflow(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });

      getCapitalflowTotal(this.formSearch).then(res => {
        if(res.data.code === SYSTEM_HTTP_SUCCESS) {
          this.inflowYuan = res.data.data.inflowYuan;
          this.outflowYuan = res.data.data.outflowYuan;
          this.totalYuan = res.data.data.totalYuan;
        }
      })
      if(index != 'clicktype') {
        getCapitalflowvo(this.formSearch).then(res => {
          if(res.data.code === SYSTEM_HTTP_SUCCESS) {
            let list = [{
              id: '',
              name: '全部',
              money: ''
            }];
            this.payWayList = list.concat(res.data.data.payWayList || []);
          }
        });
      }
    },
    search(index) {
      this.pageConfig.currentPage = 1;
      this.formSearch.startTime = this.timeValue ? this.timeValue[0] : '';
      this.formSearch.endTime = this.timeValue ? this.timeValue[1] : '';
      this.getTableList(index);
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
    closeDialog() {
      this.$refs['form'].clearValidate();
			this.$refs['form'].resetFields();
    },
    changeType(index) {
      this.formSearch.payWayId = index;
      this.search('clicktype');
    }
	}
}
</script>
<style lang="less" scoped>
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    display: flex;
  }
	.drug-types {
    width: 200px;
    min-width: 200px;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #DFE7F0;
  }
  .table-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    padding-left: 15px;
    .query-box {
      padding-top: 15px;
      text-align: right;
    }
    .table-box {
      flex-grow: 1;
    }
  }
  /deep/.el-menu {
    border-right: none 0;
  }
  .total-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0 15px;
    .total-right {
      span {
        margin-left: 10px;
      }
    }
    .money {
      color: #568BFD;
    }
  }
  .el-menu-item {
    .item {
      height: 100%;
      display: flex;
      flex-direction: column;
      line-height: 20px;
      justify-content: center;
      &:hover,div:hover {
        background: none !important;
      }
    }
    &.is-active {
      background-color: #ecf5ff;
      color: #303133;
    }
  }
</style>
