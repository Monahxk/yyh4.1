<!--
 * @Descripttion: 修改预售价
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 16:00:29
 -->
<template>
  <div> 
	<el-dialog
	title="修改预售价"
	:visible.sync="isShowDialog.editPrice.isshow"
	@open="openDialog"
	>
		<el-form :model="dataForms" ref="dataForms" :rules="rules"  class="demo-form-inline">
			<el-form-item label="" prop="salePrice">
				<el-input v-model="dataForms.salePrice" placeholder="请输入预售价" clearable=""></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="drugFormfn('dataForms')" :loading="loading">确 定</el-button>
		</span>
	</el-dialog>
  </div>
</template>
<script>
import {saveSalePrice} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
export default {
	props: ["isShowDialog"],
	data() {
		let isfloat = (rule, value, callback) => {
			var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
			if(!value) {
				callback(new Error('请输入价格'));
			}else if (!reg.test(value)) {
				callback(new Error('请输入正确格式，最多保留两位小数'));
			} else {
				callback();
			}
		};
		return {
			loading: false,
			dataForms: {
				salePrice: 0
			},
			rules: {
				 salePrice: [
					{validator: isfloat, trigger: 'blur' },
				]
			}
		}
	},
	methods: {
		openDialog() {
			this.dataForms.salePrice = this.isShowDialog.editPrice.salePrice;
		},
		//物品表单提交
    	drugFormfn(formName) {  
			let _this = this;
			_this.loading = true;
			_this.dataForms.id = _this.isShowDialog.editPrice.id;
      		this.$refs[formName].validate((valid) => {
				if (valid) {
					saveSalePrice(_this.dataForms).then(res => {
						_this.loading = false;
						if (res.data.code == SYSTEM_HTTP_SUCCESS) { 
							_this.$emit('getTableList');
							_this.closeDialog();
						} else {
						}
					}).catch(res => {
						_this.loading = false;
					})
				} else {
					console.log('error submit!!');
					_this.loading = false;
					return false;
				}
      		});
		},
		alertMsg(type,msg) {
			this.$message({
				message: msg,
				type: type
			});
		},
		closeDialog() {
			this.isShowDialog.editPrice.isshow = false;
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.loading = false;
		},
	}
}
</script>
<style lang="less" scoped>
 /deep/.el-dialog {
		position: relative;
		width: 400px;
		margin-top: 0 !important;
		top: 50%;
		transform: translateY(-50%);
		.el-dialog__body {
			height: 170px;
		}
		.el-select {
			width: 100%;
		}
	}
</style>


