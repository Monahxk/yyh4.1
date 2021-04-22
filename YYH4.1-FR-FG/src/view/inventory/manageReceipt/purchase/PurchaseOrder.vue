<!--
 * @Descripttion: 采购单
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-09 15:50:02
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-14 17:14:50
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
						<el-select v-model="formSearch.status"  @change="search">
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
						<el-button  @click="importData">导入采购计划</el-button>
					</div> -->
					<div class="nav_item">
						<Buttons :btncfg="{add: true,text: '新增采购计划'}" @add="add"></Buttons>
					</div>
				</div>
			</div>
			<div class="query-box">
        <el-form :inline="true"  :model="formSearch" @keyup.enter.native="search">
            <el-form-item label="采购日期">
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
              <el-select v-model="formSearch.wareHouseId">
								<el-option label="全部库房" value=""></el-option>
								<el-option
								v-for="item in wareHouseList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
								</el-option>
							</el-select>
            </el-form-item>
						<el-form-item label="">
                <el-input placeholder="单号/供应商" v-model="formSearch.numberOrApplyName" clearable></el-input>
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
          <el-table-column prop="purchaseDate" label="采购日期" sortable :formatter="formatterDate"  align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="单号" sortable width="200px" align="center"></el-table-column>
          <el-table-column prop="category" label="物品种类" sortable align="center"></el-table-column>
          <el-table-column prop="amountYuan" label="总金额" sortable align="center"></el-table-column>
          <el-table-column prop="arrivalDate" label="预计到货日期" sortable :formatter="formatterDateTOymd" align="center"></el-table-column>
          <el-table-column prop="applyName" label="申请人" sortable  align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" sortable :show-overflow-tooltip="true" align="center"></el-table-column>

          <el-table-column label="操作" width="100" fixed="right" align="left">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="showDetailById(scope.row)">明细</el-button>
              <span class="line" v-if="scope.row.status == 4 || scope.row.status == 2">|</span>
							<el-button type="text" v-if="scope.row.status == 2" size="small" @click="edit(scope.row.id)">编辑</el-button>
              <el-dropdown v-if="scope.row.status == 4">
								<span class="el-dropdown-link">
									更多
								</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="edit(scope.row.id)">编辑</p>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <p @click="del(scope.row.id)">删除</p>
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
		<addBuy :dialog="dialog" @search="search"></addBuy>
		<importExcelDialog :imExcelDiaog="imExcelDiaog"  @search="search"></importExcelDialog>
	</div>
</template> 
<script>
import Buttons from '@/components/commons/buttons/Buttons'
import addBuy from './AddPurchaseOrder'
import RowSlot from '@/components/commons/RowSlot'
import Pagination from '@/components/commons/Pagination'
import importExcelDialog from '@/components/inventory/importExcelDialog'
import {MESSAGE_TABLE_STYLE,SYSTEM_HTTP_SUCCESS,PAGE_SIZE} from '@/constant'
import {getDrugpurchaseList,delDrugpurchase,getDrugpurchasefilterdo} from '@/api'
export default {
	name: 'PurchaseOrder',
	components: {addBuy,Pagination,Buttons,RowSlot,importExcelDialog},
  data() {
		return {
			showQuery: false,
			tableel: false,
			state: 0,
			stateList: [],
			wareHouseList: [],
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
			pageConfig: {
				currentPage: 1,
				total: 0,
				pageSize: PAGE_SIZE
			},
			imExcelDiaog: {
        isshow: false,
        model: 'drugpurchase',//模块
        dialogTitle: '导入采购单',//dialog名称
        downloadName: '导入采购单模板',//下载模板名称
      },
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
			if(id) {
				this.edit(id);
			}
		})
	},
	mounted() {
		this.search();
		getDrugpurchasefilterdo().then(res => {
			if(res.data.code == SYSTEM_HTTP_SUCCESS) {
				let statusMap = res.data.data.statusMap;
				let status = [];
				if(statusMap) {
					for(var p in statusMap){//遍历json对象的每个key/value对,p为key
						let json = {
							id: p,
							name: statusMap[p]
						}
						status.push(json);
					}
				}
				this.stateList = status;
				this.wareHouseList = res.data.data.wareHouseList || [];
			}
		}).catch(err => {})
	},
	methods: {
		getTableList() {
			this.tableLoading = true;
			let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			getDrugpurchaseList(Object.assign(params,this.formSearch)).then(res => {
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
			this.dialog = {
				type: 'add',
				isshow: true,
				id: '',
			}
		},
		edit(id) {
			this.dialog = {
				type: 'edit',
				isshow: true,
				id: id
			}
		},
		del(id) {
			this.$confirm("您确定要删除该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
				delDrugpurchase(id).then(res => {
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.search();
					}
				}).catch(err => {})
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
			this.dialog = {
				type: 'detail',
				isshow: true,
				id: row.id,
				status: row.status
			}
		},
		importData() {
			this.imExcelDiaog.isshow = true;
		}
	}
}
</script>
<style lang="less" scoped>
	
</style>
