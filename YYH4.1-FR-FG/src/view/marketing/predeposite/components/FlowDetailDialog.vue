<template>
	<el-dialog
		:title="dialogCfg.turnover.title"
		:visible.sync="dialogCfg.turnover.isshow"
		@open="openDialog"
		@close="closeDialog"
		width="1000px"
		>
		<div class="content">
			<el-table
			highlight-current-row
			ref="singleTable"
			:data="tableList"
			style="font-size: 14px"
			height="500px"
			v-loading="tableLoading"
			:header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
			>
			<el-table-column prop="rechargeTime" label="时间" align="center"></el-table-column>
			<el-table-column prop="flowMoneyYuan" label="金额" align="center"></el-table-column>
		   	<el-table-column  label="交易类型" align="center">
			    <template slot-scope="scope" style="marginLeft:-25px">
					<span v-if="scope.row.type == 0">
						充值
					</span>
					<span v-else-if="scope.row.type == 1">
						消费
					</span>
					<span v-else-if="scope.row.type == 2">
						退费
					</span>
			    </template>
		   </el-table-column>
          	<el-table-column prop="createEmployee.name" label="经办人" align="center" ></el-table-column>
          	<el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>
		</div>
	</el-dialog>
</template>
<script>
import {predepositconsumeflowList,discountconsumeflowList} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
	name: 'turnoverDetailDialog',
	props: ['dialogCfg'],
	data() {
		return {
			tableLoading: false,
			tableList: []
		}
	},
	methods: {
		openDialog() {
			this.tableLoading = true;
			if(this.dialogCfg.turnover.type == 'discount') {
				discountconsumeflowList(this.dialogCfg.turnover.id).then(res => {
					this.tableLoading = false;
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.tableList = res.data.data;
					} else {
						this.tableList = [];
					}
				})
			} else {
				predepositconsumeflowList(this.dialogCfg.turnover.id).then(res => {
					this.tableLoading = false;
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.tableList = res.data.data;
					} else {
						this.tableList = [];
					}
				})
			}
		},
		closeDialog() {
			this.tableList = [];
			this.tableLoading = false;
		}
	}
}
</script>
<style lang="less" scoped>
</style>
