<!--
 * @Descripttion: 物品类别，导航栏
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 18:03:03
 -->
<template> 
	<div class="wrapper">
		<el-menu
      :default-active="defaultActive"
			@select="changeType"
      class="el-menu-vertical-demo">
		  <el-menu-item :index="item.id+''" v-for="(item) in drugTypeList" :key="item.id">
        <span slot="title">{{item.goodstypeName}}</span>
      </el-menu-item>
		</el-menu>
	</div>
</template>
<script>
import {listGoodsType} from '@/api'
export default {
    data() {
			return {
				defaultActive: '0',
				drugTypeList: []
			}
		},
		mounted() {
			this.listDrugType();
			this.changeType('0');
		},
		methods: {
			listDrugType() {
				listGoodsType().then(res => {
					if(res.data.code === 200) {
						let list = [{
							id: '0',
							goodstypeName: '全部'
						}];

						this.drugTypeList = list.concat(res.data.data);
					}
				})
			},
			changeType(index) {
				this.$emit('getTableList',index);
			}
		}
}
</script>

<style lang="less" scoped>
	.wrapper {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		.el-menu {
			border: 0;
		}
		.el-menu-item .is-active {
			color: inherit;
		}
		.el-menu-item span {
			background-color: transparent !important;
		}
	}
</style>
