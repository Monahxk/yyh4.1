<template>
	<div>
		<el-dialog
		:title="dialogCfg.detail.title"
		:visible.sync="dialogCfg.detail.isshow"
		@open="openDialog"
		@close="closeDialog"
		width="700px"
		>
			<div class="content">
				<el-form label-width="100px">
					<el-row>
						<el-col :span="11">
							<el-form-item label="患者姓名：">
								<span>{{form.patient.patientName}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="卡余额：">
								<span>￥{{form.balanceYuan}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="卡号：">
								<span>{{form.cardNo}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="手机号：">
								<span>{{form.telephone}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="卡密码：">
								<span>******</span>
								<span class="repass" @click="repass">修改密码</span>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="办卡日期：">
								<span>{{form.rechargeTime}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="经办人：">
								<span>{{form.employeeName}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="备注：">
								<span>{{form.remark}}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-dialog>
		<el-dialog
		title="修改密码"
		:visible.sync="isshow"
		@open="openPassDialog"
		width="500px"
		>
			<el-form :model="passForm" :rules="rules" ref="passForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="原始密码" prop="orginalPassword">
					<el-input type="password" v-model="passForm.orginalPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword">
					<el-input type="password" v-model="passForm.newPassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPassword">
					<el-input type="password" v-model="passForm.checkPassword"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="formfn('passForm')" :loading="loading">确 定</el-button>
					<el-button @click="closePassDialog">取 消</el-button>
			</span>
		</el-dialog>
	</div>
	
</template>
<script>
import {predepositcardDeditList,discountcardDeditList,updatePredeCardPassWord,updateDiscountcardPassWord} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
	name: 'cardDetailDialog',
	props: ['dialogCfg'],
	data() {
		 var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.passForm.checkPassword !== '') {
            this.$refs.passForm.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
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
			passForm: {
				orginalPassword: '',
				newPassword: '',
				checkPassword: '',
				id: ''
			},
			rules: {
				orginalPassword: [
					{ required: true, message: '请输入原始密码', trigger: 'blur' }
				],
				checkPassword: [
					{ required: true,validator: validatePass2, trigger: 'blur' }
				],
				newPassword: [
					{ required: true,validator: validatePass, trigger: 'blur' }
				]
			},
			isshow: false,
			loading: false
		}
	},
	methods: {
		openDialog() {
			if(this.dialogCfg.detail.type == 'predeposit') {
				//预存卡
				predepositcardDeditList(this.dialogCfg.detail.id).then(res => {
					if(res.data.code == 200)this.form = res.data.data;
				})
			} else if(this.dialogCfg.detail.type == 'discount') {
				//折扣卡
				discountcardDeditList(this.dialogCfg.detail.id).then(res => {
					if(res.data.code == 200)this.form = res.data.data;
				})
			}
			
		},
		closeDialog() {
			this.form = {
				patient: {
					patientName: ''
				}
			};
			this.dialogCfg.detail.isshow = false;
		},
		repass() {
			this.isshow = true;
		},
		openPassDialog() {

		},
		closePassDialog() {
			this.isshow = false;
			this.$refs['passForm'].clearValidate();
			this.$refs['passForm'].resetFields();
			this.loading = false;
		},
		formfn(formName) {
			let _this = this;
			_this.loading = true;
			this.$refs[formName].validate((valid) => {
			if (valid) {
				_this.passForm.id = _this.dialogCfg.detail.id;
				if(this.dialogCfg.detail.type == 'predeposit') {
					//预存卡
					updatePredeCardPassWord(_this.passForm).then(res => {
						_this.loading = false;
						if(res.data.code == SYSTEM_HTTP_SUCCESS) {
							_this.closePassDialog();
						}
					})
				} else if(this.dialogCfg.detail.type == 'discount') {
					//折扣卡
					updateDiscountcardPassWord(_this.passForm).then(res => {
						_this.loading = false;
						if(res.data.code == SYSTEM_HTTP_SUCCESS) {
							_this.closePassDialog();
						}
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
