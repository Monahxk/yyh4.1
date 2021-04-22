<!--
 * @Descripttion: 最早的分页组件，后面可删
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:24:26
 -->
<template>
	<div class="pagination_box">
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
			:total="pageConfig.total">
		</el-pagination>
	</div>
</template>
<script>
export default {
	props:['pageConfig'],
	data() {
		return {
			pageSizes: [4, 10, 15, 20],
			pageSize: 10,
			pagerCount: 9,
			layout: 'total,sizes,prev,pager,next,jumper'
		}
	},
	computed: {
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
		handleSizeChange(pageSize) {
			this.$emit('handleSizeChange',pageSize)
		},
		handleChage(currentPage) {
			this.$emit('handleChage',currentPage)
		},
	}
}
</script>

<style lang="less" scoped>
	.pagination_box {
		width: 100%;
		padding: 0 20px 0 0 !important;
		float: right;
		background-color: #fff;
		margin-top: 2px;
		height: 58px;
		bottom: 0 !important;
		position: relative !important;
		display: block !important;
		.el-pagination {
			text-align: right;
			margin-top: 13px;
		}
	}
</style>
