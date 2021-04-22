<!--
 * @Descripttion: 门店级联，未用
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:20:27
 -->
<template>
	<div class="wrapper">
		<el-cascader
			v-model="value"
			:options="chainLevelData"
			:props="defaultProps"
			@change="handleChange">
			</el-cascader>
	</div> 
</template>
<script>
import {listChainLevelInstitutions} from '@/api'
export default {
	data() {
		return {
			chainLevelData: [],
			defaultProps: {
				expandTrigger: 'hover',
				children: 'subLevelList',
				value: 'id',
				label: 'name'
			}
		}
	},
	mounted() {
		listChainLevelInstitutions().then(res => {
			if(res.data.data) {
				// this.chainLevelData = res.data.data;
				this.chainLevelData = this.eachData(res.data.data.subLevelList);
			}
			this.treeloading = false;
		})
	},
	methods: {
		handleChange(value) {
			console.log(value);
		},
		eachData(arr) {
			var forFn = function(arr){
					for (var i = 0; i < arr.length; i++) {
							if (arr[i].chainLevel ) {
								arr[i].id = arr[i].chainLevel.id;
								arr[i].name = arr[i].chainLevel.name;
							}
							if (arr[i].subLevelList && arr[i].subLevelList.length>0) {
									forFn(arr[i].subLevelList);
							}
					}
			};
			forFn(arr);
			return arr;
		}
	}
}
</script>
<style lang="less" scoped>
	.wrapper {

	}
</style>

