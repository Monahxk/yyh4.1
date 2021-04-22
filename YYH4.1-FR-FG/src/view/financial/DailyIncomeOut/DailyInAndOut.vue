<!--
 * @Descripttion: 日常收入
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 17:59:51
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
          <div class="nav_item">
            <el-date-picker
              v-model="timeValue"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
          </div>
          <div class="nav_item">
            <el-select v-model="formSearch.dailyIncomeOutTypeId"  @change="search" :placeholder="placeholder" clearable>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) of typeList"
                :key="index"
              ></el-option>
            </el-select>
					</div>
          <div class="nav_item">
            <Buttons :btncfg="{add: true,text: '新增收支'}" @add="add"></Buttons>
					</div>
				</div>
			</div>
      <div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
          <RowSlot :colshow="{col1: true,btn: true}">
            <el-form-item slot="col1">
              <el-input placeholder="单号/患者姓名" v-model="formSearch.numberOrPatientName" clearable></el-input>
            </el-form-item>
            <el-form-item slot="btn">
              <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
            </el-form-item>
          </RowSlot>
        </el-form>
      </div>
		</header>
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
              <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
              <span class="line">|</span>
              <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
    <AddInAnOurDialog :dialog="dialog" @on-search="search"></AddInAnOurDialog>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import Buttons from '@/components/commons/buttons/Buttons'
import RowSlot from '@/components/commons/RowSlot'
import AddInAnOurDialog from './components/AddInAnOurDialog'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getDailyincomeoutdo, getDailyincomeout, deteleDaily} from '@/api'
export default {
	name: 'DailyIn',
	components: {Pagination,RowSlot,Buttons,AddInAnOurDialog},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
      typeList: [],
      timeValue: '',
			formSearch: {
        operator: '',
        startTime: '',
        endTime: '',
        dailyIncomeOutTypeId: '',
        numberOrPatientName: '',
        type: 1
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'flowNumber',
          label: '单据号',
          width: '200',
        },
        {
          prop: 'dailyIncomeOutType.name',
          label: '收入类别',
        },
        {
          prop: 'amountMoneyYuan',
          label: '金额',
          ismoney: true,
        },
        {
          prop: 'payWay.name',
          label: '收费方式',
        },
        {
          prop: 'employee.name',
          label: '经办人',
        },
        {
          prop: 'incomeTime',
          label: '交易日期',
        },
        {
          prop: 'description',
          label: '备注',
          width: '200',
        }
      ],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
      },
      dialog: {
        isshow: false,
        id: '',
        type: 1
      },
      placeholder: '收入方式',
      dailyIncomeTypeList: [],
      dailyOutTypeList: [],
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
    },
    getUrlType() {
      return this.$route.name;
    }
  },
  watch: {
    $route(to,from){
      if(to.name == 'DailyOut') {
        this.tableTitle[1].label = '支出类别';
        this.tableTitle[3].label = '支付方式';
        this.placeholder = '支出类别';
        this.formSearch.type = 2;
        this.dialog.type = 2;
        this.typeList = this.dailyOutTypeList;
      } else if(to.name == 'DailyIn') {
        this.tableTitle[1].label = '收入类别';
        this.tableTitle[3].label = '收入方式';
        this.placeholder = '收入类别';
        this.formSearch.type = 1;
        this.dialog.type = 1;
        this.typeList = this.dailyIncomeTypeList;
      }
      this.formSearch.dailyIncomeOutTypeId = '';
      this.search();
    },
    timeValue() {
      this.search();
    }
  },
	mounted() {
    this.getsearchdo();
    let date = new Date();
    let time = util.timestampDay(date);
    this.timeValue = [time,time];
    this.search();
  },
	methods: {
    getsearchdo() {
      getDailyincomeoutdo().then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {data: {data: {dailyIncomeTypeList,dailyOutTypeList}}} = res;
          this.dailyIncomeTypeList = dailyIncomeTypeList;
          this.dailyOutTypeList = dailyOutTypeList;
          this.typeList = dailyIncomeTypeList;
        }
      }).catch(err => {
        console.log(err)
      })
    },
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getDailyincomeout(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data;
          this.tableList = data.data;
          this.pageConfig.total = data.totalNumber|| 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
    },
    search() {
      this.pageConfig.currentPage = 1;
      if(this.timeValue) {
        this.formSearch.startTime = this.timeValue[0] + ' 00:00:00';
        this.formSearch.endTime = this.timeValue[1] + ' 00:00:00';
      } else {
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
    add() {
      this.dialog.isshow = true;
      this.dialog.id = '';
      this.dialog.type = -1;
    },
    edit(row) {
      this.dialog.isshow = true;
      this.dialog.id = row.id;
      this.dialog.type = row.type;
    },
    del(row) {
      this.$confirm("您确定要删除该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deteleDaily(row.id).then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.search();
          }
        });
      }).catch(() => {});
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
</style>
