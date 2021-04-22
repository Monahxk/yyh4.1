<template>
	<el-dialog
		title="移动到..."
		:visible.sync="dialogCfg.moveInstitutionDialog.isshow"
		@open="openDialog"
		width="500px"
		>
		<div class="content">
			<areaTree :treeCfg="treeCfg" ref="tree" @treeNodeClick="getChainlevel"></areaTree>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="formfn" :loading="loading">确 定</el-button>
			<el-button @click="closeDialog">取 消</el-button>
		</span>
	</el-dialog>
</template>
<script>
import {moveInstitution} from '@/api'
import areaTree from '@/components/chainment/areaTree'
export default {
	name: 'moveInstitutionDialog',
	components: {
    areaTree,
  },
	props: ['dialogCfg'],
	data() {
		return  {
			loading: false,
			treeCfg: {
				isshowAddBtn: false,
				isshowYes: true
			},
			chainlevel: {}
		}
	},
	methods: {
		closeDialog() {
			this.dialogCfg.moveInstitutionDialog.isshow = false;
			this.loading = false;
		},
		//移动门店提交
    formfn() {  
			if(this.chainlevel.chainLevel.id) {
				this.loading = true;
				let data = {
					chainLevel1Id: this.chainlevel.chainLevel.chainLevel1Id,
					chainLevel2Id: this.chainlevel.chainLevel.chainLevel2Id,
					chainLevel3Id: this.chainlevel.chainLevel.chainLevel3Id,
					chainLevel4Id: this.chainlevel.chainLevel.chainLevel4Id,
					headquartersId: this.chainlevel.chainLevel.headquartersId,
					id: this.dialogCfg.moveInstitutionDialog.data.id
				}
				data[`chainLevel${this.chainlevel.chainLevel.level}Id`] = this.chainlevel.chainLevel.id;
				moveInstitution(data).then(res => {
					this.dialogCfg.moveInstitutionDialog.isshow = false;
					this.loading = false;
					this.$emit('getTableList', false);
				}).catch(res => {
					this.loading = false;
				})
			}
		},
		getChainlevel(data) {
			this.chainlevel = data;
		},
		openDialog() {
			if(this.$refs.tree)this.$refs.tree.clearClass();
		}
  }
}
</script>
<style lang="less" scoped>
	.content {
			height: 500px;
			overflow-y: auto;

			/deep/.wrapper-tree {
				border: 0;
			}
	}
</style>
