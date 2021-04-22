<template>
	<div>
		<el-dialog
		:title="dialogCfg.edit.title"
		:visible.sync="dialogCfg.edit.isshow"
		@open="openDialog"
		@close="closeDialog"
		width="40%"
		>
			<div class="content">
				<el-form :model="form" :rules="rules" ref="form"  label-width="100px">
					<el-row>
						<el-col :span="11">
							<el-form-item label="患者姓名">
								<span>{{form.patient.patientName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="卡余额">
								<span>￥{{form.balanceYuan}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="卡号">
								<span>{{form.cardNo}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="手机号" prop="telephone">
								<el-input v-model="form.telephone" placeholder="请输入手机号" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="办卡日期">
								<span>{{form.rechargeTime}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="经办人">
								<span>{{form.employeeName}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="备注">
								<el-input type="textarea" v-model="form.remark" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 6}" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<el-row slot="footer" class="dialog-footer">
				<el-col :span="24" class="footer-right">
					<el-button type="primary" @click="formfn('form')" :loading="loading">确 定</el-button>
					<el-button @click="closeDialog">取 消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
	
</template>
<script>
import {predepositcardDeditList,updatePredepositcard,discountcardDeditList,updateDiscountcard} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
	name: 'editCardDialog',
	props: ['dialogCfg'],
	data() {
		let isMobile = (rule, value, callback) => {
			var reg = /^[1][0-9]{10}$/;
			if(!value) {
				callback(new Error('请输入手机号'));
			}else if (!reg.test(value)) {
				callback(new Error('手机号格式不正确'));
			} else {
				callback();
			}
		};
		return {
			form:{
				patient: {
					patientName: ''
				}
			},
			rules: {
				telephone: [
					{ required: true,validator: isMobile, trigger: 'blur' }
				],
			},
			isshow: false,
			loading: false
		}
	},
	methods: {
		openDialog() {
			if(this.dialogCfg.edit.type == 'discount') {
				discountcardDeditList(this.dialogCfg.edit.id).then(res => {
					if(res.data.code == 200)this.form = res.data.data;
				})
			} else {
				predepositcardDeditList(this.dialogCfg.edit.id).then(res => {
					if(res.data.code == 200)this.form = res.data.data;
				})
			}
			
		},
		closeDialog() {
			this.dialogCfg.edit.isshow = false;
			this.$refs['form'].clearValidate();
			this.$refs['form'].resetFields();
			this.loading = false;
		},
		formfn(formName) {
			let _this = this;
			_this.loading = true;
			this.$refs[formName].validate((valid) => {
			if (valid) {
				if(this.dialogCfg.edit.type == 'discount') {
					updateDiscountcard(_this.form).then(res => {
						if(res.data.code == SYSTEM_HTTP_SUCCESS) {
							_this.$emit('getTableList');
							_this.closeDialog();
						}
						_this.loading = false;
					})
				} else {
					updatePredepositcard(_this.form).then(res => {
						if(res.data.code == SYSTEM_HTTP_SUCCESS) {
							_this.$emit('getTableList');
							_this.closeDialog();
						}
						_this.loading = false;
					})
				}
				
			} else {
				console.log('error submit!!');
					_this.loading = false;
					return false;
				}
			});
		}
	}
}
</script>
<style lang="less" scoped>
	.content {
    height: 400px;
		overflow-y: auto;
		
		.repass {
			color: #409EFF;
			cursor: pointer;
		}
	}
</style>
