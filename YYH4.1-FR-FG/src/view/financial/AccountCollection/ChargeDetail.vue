<!--
 * @Descripttion: 账目明细
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj

 -->

<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
          <div class="nav_item">
						<el-button type="text" icon="el-icon-search"  @click="showQuery=!showQuery">搜索</el-button>
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
            <el-select v-model="formSearch.payWayId"  @change="search" class="q-select" placeholder="请选择收费方式" clearable>
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
            <el-select v-model="formSearch.billingcatagroyId"  @change="search" class="q-select" placeholder="请选择类别" clearable>
              <el-option label="全部类别" value=""></el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) of chargeTypeConfigList"
                :key="index"
              ></el-option>
            </el-select>
					</div>
				</div>
			</div>
      <div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
          <el-form-item>
            <el-input placeholder="患者姓名"  v-model="formSearch.patientInfo" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="search_btn"  @click="search">搜索</el-button>
          </el-form-item>
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
          :tooltip-effect="tableStyleConfig.tooltipEffect"
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
            :show-overflow-tooltip="item.tooltip"
          >
            <template slot-scope="scope">
              <span>￥{{scope.row.chargeBill[item.prop.replace('chargeBill.','')]}}</span>
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
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getChargebillitemvo, getChargebillitem} from '@/api'
export default {
	name: 'ChargeDetail',
	components: {Pagination},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
      payWayList: [],
      chargeTypeConfigList: [],
      timeValue: '',
			formSearch: {
        billingcatagroyId: '',
        startTime: '',
        endTime: '',
        payWayId: '',
        patientInfo: ''
      },
			tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'chargeBill.number',
          label: '单据号',
          width: '150'
        },
        {
          prop: 'chargeBill.patient.patientName',
          label: '患者姓名',
        },
        {
          prop: 'chargeBill.patient.mobilephone',
          label: '电话',
          width: '120'
        },
        {
          prop: "projectName",
          label: "项目",
          tooltip: true,
          width:160
        },
        {
          prop: 'chargeBill.amountYuan',
          label: '原价',
          width: 100,
          ismoney: true
        },
        {
          prop: 'chargeBill.discount',
          label: '折扣',
        },
        {
          prop: 'chargeBill.discountAmountYuan',
          label: '折后价',
          width: 100,
          ismoney: true
        },
        {
          prop: 'chargeBill.receivedAmountYuan',
          label: '实收',
          width: 100,
          ismoney: true
        },
        {
          prop: 'chargeBill.arrearsYuan',
          label: '欠费',
          width: 100,
          ismoney: true
        },
        {
          prop: 'chargeBill.toller.name',
          label: '经办人',
        },
        {
          prop: 'payWayName',
          label: '支付方式',
          width: '150'
        },
        {
          prop: 'chargeBill.chargeTime',
          label: '收费日期',
          width: '160'
        },
        {
          prop: 'chargeBill.nurse.name',
          label: '护士',
        },
        {
          prop: 'chargeBill.doctor.name',
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
    getChargebillitemvo().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        let {data: {data: {chargeTypeConfigList, payWayList}}} = res;
        this.payWayList = payWayList;
        this.chargeTypeConfigList = chargeTypeConfigList;
      }
    })
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getChargebillitem(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data;
          this.tableList = data.chargeBillItemPage.content;
          this.pageConfig.total = data.chargeBillItemPage.totalElements || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
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
