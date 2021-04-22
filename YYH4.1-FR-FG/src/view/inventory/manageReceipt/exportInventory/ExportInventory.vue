<!--
 * @Descripttion: 出库单列表
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-22 15:23:22
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 09:05:48
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
						<el-select v-model="formSearch.status"@change="search">
							<el-option label="全部状态" value=""></el-option>
							<el-option
							v-for="item in stateList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div>
          <!-- <div class="nav_item">
						<el-button size="small">导入出库单</el-button>
					</div> -->
					<div class="nav_item">
						<Buttons :btncfg="{add: true,text: '新增出库单'}" @add="add"></Buttons>
					</div>
				</div>
			</div>
			<div class="query-box">
        <el-form :inline="true" :model="formSearch" @keyup.enter.native="search">
					<el-form-item label="出库日期">
					<el-date-picker
						v-model="timeValue"
						value-format="yyyy-MM-dd HH:mm:ss"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-select v-model="formSearch.wareHouseId" placeholder="请选择" clearable filterable>
						<el-option label="全部库房" value=""></el-option>
						<el-option
							v-for="(item,index) in wareHouseList"
							:key="item.index"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="">
					<el-input placeholder="单号/申请人" v-model="formSearch.numberOrApplyName" clearable></el-input>
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
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
          <el-table-column prop="statusText" label="状态" sortable align="center">
						<template slot-scope="scope">
							<span :class="'exp_status_color'+scope.row.status">
								{{scope.row.statusText}}
							</span>
						</template>
					</el-table-column>
          <el-table-column prop="typeText" label="出库类型"  min-width="100" sortable align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="出库单号" min-width="120" :show-overflow-tooltip="true" sortable  align="center"></el-table-column>
					<el-table-column prop="applyDate" label="申请日期" width="160" sortable align="center"></el-table-column>
          <el-table-column prop="getDate" label="出库日期" width="160" sortable align="center"></el-table-column>
          <el-table-column prop="wareHouseText" label="出库库房" :show-overflow-tooltip="true" min-width="120"  sortable align="center"></el-table-column>
          <el-table-column prop="category" label="物品种类" min-width="100" sortable align="center"></el-table-column>
          <el-table-column prop="quantity" label="出库数量" min-width="100" sortable align="center"></el-table-column>
          <el-table-column prop="amountYuan" label="总金额" min-width="100" sortable align="center"></el-table-column>
					<el-table-column prop="applyEmployeeName" label="申请人" min-width="100" sortable align="center"></el-table-column>
          <el-table-column prop="operateEmployeeName" label="经办人" min-width="100" sortable  align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" sortable  align="center"></el-table-column>

          <el-table-column label="操作" width="125" fixed="right" align="left">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="showDetailById(scope.row)">明细</el-button>
              <span class="line" v-if="scope.row.status == 2 || scope.row.status == 4 || scope.row.status == 6">|</span>
							<el-button type="text" size="small"  v-if="scope.row.status == 2" @click="edit(scope.row.id)">编辑</el-button>
							<el-button type="text" size="small"  v-if="scope.row.status == 6" @click="sureExport(scope.row.id)">确认出库</el-button>
              <el-dropdown v-if="scope.row.status == 4">
								<span class="el-dropdown-link">
									更多
								</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="edit(scope.row.id)">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="returnDrugs(scope.row.id)">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
		<addExportDialog :dialog="dialog" @search="search"></addExportDialog>
		<confirmExportDialog :dialog="confirmDialog" @search="search"></confirmExportDialog>
		<detailExportDialog :dialog="detailDialog" @edit="edit"></detailExportDialog>
	</div>
</template>
<script> 
import Buttons from '@/components/commons/buttons/Buttons'
import addExportDialog from './components/AddExportDialog'
import confirmExportDialog from './components/ConfirmExportDialog'
import detailExportDialog from './components/DetailExportDialog'
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,SYSTEM_HTTP_SUCCESS,PAGE_SIZE} from '@/constant'
import {delExportInventory,listExportInventory,getExportinventoryfiltervo} from '@/api'
import typesAndHouseMixin from '@/mixins/inventory/typesAndHouse';
export default {
	name: 'ExportInventory',
	components: {addExportDialog,confirmExportDialog,detailExportDialog,Pagination,Buttons},
	mixins: [typesAndHouseMixin],
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
			stateList: [],
      wareHouseList: [],
			storeKeeperList: [],//库管员
			timeValue: '',
			formSearch: {
				status: '',
        startDate: '',
        endDate: '',
				wareHouseId: '',
				numberOrApplyName: ''
			},
			tableLoading: false,
			tableList: [],
			dialog: {
				isshow: false,
				id: '',
				type: 'add',
				status: ''
			},
			confirmDialog: {
				isshow: false,
				id: '',
			},
			detailDialog: {
				isshow: false,
				id: '',
				status: ''
			},
			pageConfig: {
				currentPage: 1,
				total: 0,
				pageSize: PAGE_SIZE
			}
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
	},
	watch: {
		showQuery: {
			handler() {
				// this.$refs.table.doLayout()
			}
		}
	},
	created() {
		this.$nextTick( () => {
			let id = this.$route.query.id;
			console.log(id)
			if(id) {
				this.edit(id);
			}
		})
	},
	mounted() {
		this.search();
		getExportinventoryfiltervo().then(res => {
			if(res.data.code == SYSTEM_HTTP_SUCCESS) {
				let {statusMap,wareHouseList} = res.data.data;
				this.wareHouseList = wareHouseList || [];
				this.stateList = this.mapToArray(statusMap);
			}
		})
	},
	methods: {
		getTableList() {
			this.tableLoading = true;
			let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			listExportInventory(Object.assign(params,this.formSearch)).then(res => {
				this.tableLoading = false;
				if(res.data.code == SYSTEM_HTTP_SUCCESS) {
					this.tableList = res.data.data;
					this.pageConfig.total = res.data.totalNumber;
				} else {
					this.tableList = [];
					this.pageConfig.total = 0;
				}
			}).catch(err => {
				this.tableLoading = false;
				this.tableList = [];
				this.pageConfig.total = 0;
			})
		},
		search() {
			this.pageConfig.currentPage = 1;
      this.formSearch.startDate =  this.timeValue ? this.timeValue[0] : '';
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
		add() {
      this.dialog.type = 'add';
			this.dialog.isshow = true;
			this.dialog.id = '';
		},
		edit(id) {
			this.dialog.type = 'edit';
			this.dialog.isshow = true;
			this.dialog.id = id;
		},
		del(id) {
			this.$confirm("您确定要删除该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      }).catch(() => {});
		},
		cancel(id) {
			this.$confirm("您确定要撤销该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      }).catch(() => {});
		},
		showDetailById(row) {
			this.detailDialog.isshow = true;
			this.detailDialog.id = row.id;
			this.detailDialog.status = row.status;
		},
		sureExport(id) {
			this.confirmDialog.isshow = true;
			this.confirmDialog.id = id;
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
