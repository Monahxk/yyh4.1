<!--
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 15:41:14
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 14:54:19
 -->
<template>
	<div class="pagination_wrapper">
		<el-pagination
			prev-text="上一页"
			next-text="下一页"
			background
			:layout="getLayout"
			@size-change="handleSizeChange"
			@current-change="handleChage"
			:page-sizes="getPageSizes"
			:pager-count="getPagerCount"
			:current-page="pageConfig.currentPage"
			:page-size="getPageSize"
			:total="getTotal">
		</el-pagination>
	</div>
</template>
<script>
import {PAGE_SIZE} from '@/constant'
export default {
	props:['pageConfig'],
	data() {
		return {
			pageSizes: [4, 10, 15, 20],
			pageSize: PAGE_SIZE,
			pagerCount: 9,
			layout: 'total,sizes,prev,pager,next,jumper'
		}
	},
	computed: {
		getTotal() {
			return this.pageConfig.total - 0;
		},
		getPageSizes() {
			if(this.pageConfig.pageSizes) {
				return this.pageConfig.pageSizes;
			} else {
				return this.pageSizes;
			}
		},
		getPageSize() {
			if(this.pageConfig.pageSize) {
				return this.pageConfig.pageSize;
			} else {
				return this.pageSize;
			}
		},
		getPagerCount() {
			if(this.pageConfig.pagerCount) {
				return this.pageConfig.pagerCount;
			} else {
				return this.pagerCount;
			}
		},
		getLayout() {
			if(this.pageConfig.layout) {
				return this.pageConfig.layout;
			} else {
				return this.layout;
			}
		}
	},
	methods: {
		//当前页显示条数改变
		handleSizeChange(pageSize) {
			this.$emit('handleSizeChange',pageSize);
		},
		//当前页改变
		handleChage(currentPage) {
			this.$emit('handleChage',currentPage)
		},
	}
}
</script>

<style lang="less" scoped>
	.pagination_wrapper {
		width: 100%;
		// box-shadow: 0 0 6px 0 #e4e9ff;
		padding: 0 20px 0 0 !important;
		float: right;
		background-color: #fff;
		height: 100%;
		bottom: 0 !important;
		position: relative !important;
		border: 0;
		display: flex;
    justify-content: flex-end;
    align-items: center;
		.el-pagination {
			text-align: right;
		}
	}
	.pagination_wrapper /deep/.el-pagination span {
    color: #4d9eff;
  }
  .pagination_wrapper /deep/.el-input__inner {
    color: #4d9eff;
    border: 1px solid #4d9eff;
  }
  .pagination_wrapper /deep/.el-select .el-input .el-select__carett {
    color: #4d9eff !important;
  }
  .pagination_wrapper /deep/.number {
    color: #4d9eff !important;
    background: #fff !important;
    border: 1px solid #4d9eff !important ;
  }
  .pagination_wrapper /deep/.el-pagination.is-background .btn-next,
  /deep/.el-pagination.is-background .btn-prev,
  /deep/.el-pagination.is-background .el-pager li {
    color: #4d9eff !important;
  }
  .pagination_wrapper
    /deep/.el-pagination.is-background
    /deep/.el-pager
    li:not(.disabled).active {
    color: #fff !important;
    background: #4d9eff !important;
    border: none;
  }
  .pagination_wrapper /deep/.btn-next,
  .pagination_wrapper /deep/.btn-prev {
    border: 1px solid #4d9eff;
    padding: 0 10px !important;
    background: #fff !important;
  }
</style>
