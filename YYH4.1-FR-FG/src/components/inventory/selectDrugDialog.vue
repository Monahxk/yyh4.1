<!--
 * @Descripttion: 选择物品，出库，入库等新增时用
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-07 10:45:19
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="选择物品"
			:visible.sync="isOpenDialog.drug"
			:modal="false"
			width="800px"
			style="margin-top: 0;"
			@open="openDialog"
			center>
				<div class="wrapper-type">
					<div class="type-box">
						<drugType @getTableList="getTableList"></drugType>
					</div>
						<div class="main_content">
							<el-form :inline="true" class="demo-form-inline">
								<el-form-item>
									<el-input
										placeholder="请输入物品名称/拼音首字母/关键字"
										v-model="drugFormSearch.drugName"
										@keyup.native.enter="search"
										>
										<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
									</el-input>
								</el-form-item>
								<el-form-item v-if="isOpenDialog.isshowDddDrug">
									<el-button type="primary" class="search_btn" icon="el-icon-plus" @click="openAddDrugDialog">新增物品</el-button>
								</el-form-item>
							</el-form>
							<div class="warpper-table" id="warpper-table">
								<el-table
								highlight-current-row
								ref="singleTable"
								:data="tableList"
								:height="height"
								@row-click="rowClick"
								style="font-size: 14px"
								v-loading="tableLoading"
								:header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
								>
									<el-table-column prop="drugName" label="物品名称" align="center"></el-table-column>
									<el-table-column prop="drugSpec" label="规格" align="center"></el-table-column>
									<el-table-column prop="drugBrand.brandName" label="品牌" align="center"></el-table-column>
									<el-table-column prop="drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>

								</el-table>
							</div>
							<div class="pagination-box">
								<pagination	tion :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></pagination>
							</div>
						</div>
				</div>
			</el-dialog>
		</div>
		<addDrugDialog :drugDialog="drugDialog"></addDrugDialog>
	</div>
</template>
<script>
import drugType from './drugType'
import addDrugDialog from './addDrugDialog'
import pagination from '@/components/commons/Pagination'
import {getImportInventoryDrug,getDrugDetByWareHouseId,inlistDrug,outlistDrug} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
export default {
	components: {
		drugType,
		addDrugDialog,
		pagination
	},
	props: ['isOpenDialog'],
	data() {
		return {
			tableLoading: true,
			drugDialog: {
				drugDialogFla:false,
				drugDialogTitle:'',
				type: 'add',
				id: ''
			},
			drugFormSearch: { //项目搜索
				drugName: '',
				dgtId: ''
      		},
			tableList: [],
			pageConfig: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
				pagerCount: 7,
				layout: 'prev,pager,next'
			},
			height: '0px'
		}
	},
	methods: {
		getTableList(drugTypeId) {
			let _this = this;
			_this.tableLoading = true;
			if(typeof drugTypeId != 'undefined' && drugTypeId != 'query') {
				this.drugFormSearch.dgtId = drugTypeId;
				this.pageConfig.currentPage = 1;
			} else if(drugTypeId === 'query') {
				this.pageConfig.currentPage = 1;
			}
			if(this.isOpenDialog.type && this.isOpenDialog.type == 'out') {
				/**
				 * 出库相关，选择物品，调用接口
				 * 需要库房id
				 */
				outlistDrug({
					page: this.pageConfig.currentPage,
					pageSize: this.pageConfig.pageSize,
					nameOrNumber: _this.drugFormSearch.drugName,
					drugTypeId: _this.drugFormSearch.dgtId,//物品类别id
					wareHouseId: _this.isOpenDialog.wareHouseId || ''
				}).then(res => {

					let tableList = Array.isArray(res.data.data) && res.data.data ? res.data.data : [];
					let arr = [];
					tableList.map((item) => {
						arr.push(item.drug)
					})

					this.tableList = arr;

					this.pageConfig.total = res.data.totalNumber || 0;
					_this.tableLoading = false;
				}).catch(res => {
					_this.tableLoading = false;
					
				});

			} else {
				inlistDrug({
					page: this.pageConfig.currentPage,
					pageSize: this.pageConfig.pageSize,
					drugName: _this.drugFormSearch.drugName,
					dgtId: _this.drugFormSearch.dgtId,//物品类别id
				}).then(res => {
					this.tableList = Array.isArray(res.data.data) && res.data.data ? res.data.data : [];
					this.pageConfig.total = res.data.totalNumber || 0;
					_this.tableLoading = false;
				}).catch(res => {
					_this.tableLoading = false;
					
				});
			}
			
		},
		openAddDrugDialog() {
			this.drugDialog.drugDialogTitle = '新增物品';
			this.drugDialog.drugDialogFla = true;
		},
		rowClick(row, event, column) {
			if(this.isOpenDialog.wareHouseId) {
				getDrugDetByWareHouseId({drugId: row.id,wareHouseId: this.isOpenDialog.wareHouseId}).then(res => {
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.$emit('pushTableList',res.data.data);
					}
				}).catch(res => {
					
				});
			} else {
				getImportInventoryDrug(row.id).then(res => {
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.$emit('pushTableList',res.data.data);
					}
				}).catch(res => {
					
				});
			}
		},
		//每页显示条数改变
		handleSizeChange(pageSize) {
			let _this = this;
			this.$nextTick(() => {
				_this.pageConfig.currentPage = 1;
						_this.pageConfig.pageSize = pageSize;
				this.getTableList();
			})
		},
		handleChage(page) {
			this.pageConfig.currentPage = page;
			this.getTableList();
		},
		openDialog() {
			this.$nextTick(() => {
				this.drugFormSearch.drugName = '';
				this.getTabelHeight();
				this.getTableList();
			})
		},
		getTabelHeight() {
			let el = document.getElementById('warpper-table');
			this.height = el.clientHeight + 'px';
		},
		search() {
      this.getTableList('query');
    }
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
		/deep/.el-dialog__body {
			height: calc(100% - 61px);
			background: #fff;
			padding: 0 10px 10px 0;
		}

		/deep/.el-dialog {
			margin: 0 0 0 auto;
			height: 100%;
			margin-top: 0 !important;
			box-shadow: 0px 0px 5px 1px rgba(228,233,255,1);
			.el-dialog__header {
				border-bottom: 1px solid #DFE7F0;
				padding: 10px 20px;
				line-height: 40px;

			}
		}
	}
	
	.wrapper-type {
		height: 100%;
		display: flex;
		.type-box {
			width: 200px;
			border-right: 1px solid #E4E9FF;
			overflow-y: auto;
		}
		.el-row,.el-col,/deep/.wrapper {
			height: 100%;
		}
	}
	.demo-form-inline {
		display: flex;
		justify-content: space-between;

		.el-input {
			width: 270px;
		}
	}
	.main_content {
		width: 100%;
		height: 100%;
		padding: 10px 10px 60px 20px;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.warpper-table {
		height: calc(100% - 115px);
		flex-grow: 1;
		/deep/.el-table {
			height: 100% !important;
		}
	}
.pagination-box {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 54px;
	border-top: 1px solid #DFE7F0;
}
	
</style>

