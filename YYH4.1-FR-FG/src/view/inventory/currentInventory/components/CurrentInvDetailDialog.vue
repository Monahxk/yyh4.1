<!--
 * @Descripttion: 当前库存明细
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 17:26:06
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			:title="getTitle"
			:visible.sync="isShowDialog.isshow"
			width="1000px"
			style="margin-top: 0;"
      class="dialog"
			@open="getTableList"
			>
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
            <el-table-column prop="typeText" label="类型" align="center"></el-table-column>
            <el-table-column prop="price" label="入库单价" :formatter="formatterMoney" align="center"></el-table-column>
            <el-table-column prop="quantity" label="数量" align="center"></el-table-column>
            <el-table-column prop="amount" label="金额" :formatter="formatterMoney" align="center"></el-table-column>
            <el-table-column prop="date" label="日期" :formatter="formatterDate" align="center"></el-table-column>
            <el-table-column prop="orderNumber" :show-overflow-tooltip="true" label="关联单号"  align="center"></el-table-column>
          </el-table>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {SYSTEM_HTTP_SUCCESS,TO_FIXED,MESSAGE_TABLE_STYLE,PAGE_SIZE} from "@/constant"
import {listCurrentInventoryDetailById} from '@/api'
export default {
	name: 'CurrentInvDetailDialog',
	props: ['isShowDialog'],
	data() {
		return {
      tableLoading: false,
			tableList: [],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
			}
		}
  },
  computed: {
    getTitle() {
        return this.isShowDialog.drugName + '的库存流水明细'
		},
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
  },
  mounted() {
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize,id: this.isShowDialog.id};
			listCurrentInventoryDetailById(params).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
    },
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
		/deep/.el-dialog {
			margin: 0 0 0 auto;
			height: 100%;
			margin-top: 0 !important;
		}
		/deep/.el-dialog__body {
      height: calc(100% - 61px);
			background: #FCFDFF;
			.el-table {
				height: 100% !important;
			}
		}

	}
	
</style>

