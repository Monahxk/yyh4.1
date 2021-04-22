<!--
 * @Descripttion:
 * @version:
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-08-30 15:39:09
 -->
<template>
	<el-dialog
		:title="dialogCfg.add.title"
		:visible.sync="dialogCfg.add.isshow"
		@open="openDialog"
		width="800px"
		>
		<div class="content">
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
				<el-row>
					<el-col :span="11">
						<el-form-item label="选择患者" prop="discountCard.patient.patientName">
							<el-autocomplete
								:disabled="disabled"
								v-model="form.discountCard.patient.patientName"
								:fetch-suggestions="querySearch"
								placeholder="请输入内容"
								suffix-icon="el-icon-search"
								:trigger-on-focus="false"
								@select="handleSelect"
							>
								<template slot-scope="{ item }">
									<div class="name_box">
										<span>{{ item.patientName }}</span>
									</div>
								</template>
							</el-autocomplete>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="卡号" prop="discountCard.cardNo">
							<el-input v-model="form.discountCard.cardNo" placeholder="" disabled clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="手机号" prop="discountCard.telephone">
							<el-input v-model="form.discountCard.telephone" placeholder="请输入手机号" :disabled="disabled" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="充值活动" prop="discountActivityId">
							<el-select v-model="form.discountActivityId" @change="changeActivity" placeholder="请选择" clearable filterable>
								<el-option
									v-for="item in discountActivityList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
							<input type="text" style="display:none">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="卡密码" prop="discountCard.password">
							<input type="text" style="display:none;">
							<input type="password" style="display:none;">
							<el-input type="password" v-model="form.discountCard.password" placeholder="请输入" :disabled="disabled" clearable autocomplete="new-password"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2" v-if="dialogCfg.add.type !== 'recharge'">
						<el-form-item label="确认密码" prop="discountCard.checkpassword">
							<el-input type="password" v-model="form.discountCard.checkpassword" placeholder="请输入" :disabled="disabled" clearable autocomplete="new-password"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="是否共用" prop="discountCard.commone">
							<el-radio v-model="form.discountCard.commone" label="1">是</el-radio>
  						<el-radio v-model="form.discountCard.commone" label="2">否</el-radio>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="hr"></div>
					</el-col>
				</el-row>
				<div v-for="(item,index) in form.payWayVOList" :key="index">
					<el-row>
						<el-col :span="3" class="row-title">
							<span>支付方式{{index+1}}:</span>
						</el-col>
						<el-col :span="6">
							<el-form-item label="" label-width="20px" :prop="'payWayVOList.' + index + '.id'" :rules='rules.payWayId'>
								<el-select v-model="item.id" placeholder="请选择支付方式"  clearable filterable>
									<el-option
										v-for="item in payWayList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>

						</el-col>
						<el-col :span="6">
							<el-form-item label="￥" label-width="80px" :prop="'payWayVOList.' + index + '.amountYuan'" :rules='rules.amountYuan'>
								<el-input v-model.number="item.amountYuan" placeholder="请输入" @change="changeAmount" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2" :push="4">
								<el-button @click="handleMembershipList('add')" v-if="index == 0">新增</el-button>
								<el-button @click="handleMembershipList('del',index)" v-else>删除</el-button>
						</el-col>
					</el-row>
					<el-row v-if="(form.payWayVOList.length - 1) != index">
						<el-col :span="20" :push="3">
							<div class="hr"></div>
						</el-col>
					</el-row>
				</div>

				<el-row>
					<el-col :span="24">
						<div class="hr"></div>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="8">
						<el-form-item label="合计实收">
							<span class="paid-up">￥{{form.amount}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="7" :push="1" v-show="form.discountCard.discountYuan">
						<el-form-item label="折扣">
							<span class="give-money">{{form.discountCard.discountYuan}}折</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input type="textarea" v-model="form.discountCard.remark" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 6}"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<el-row slot="footer" class="dialog-footer">
			<el-col :span="12" class="footer-left">
				<p>充值总额<span class="total-money">￥{{form.amount}}</span>
					<span v-if="dialogCfg.add.type === 'recharge'" class="balance"> 余额：￥{{form.discountCard.balanceYuan}}</span>
				</p>
			</el-col>
			<el-col :span="12" class="footer-right">
				<el-button type="primary" @click="formfn('form')" :loading="loading">确 定</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</el-col>
		</el-row>
	</el-dialog>
</template>
<script>
import {saveDiscountcard,updateDiscountcard,saveDiscountcardRecharge,getDiscountcarddo,getPatientlists,getDiscountcardrechargedo} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
let ship = {
	id: '',//收费方式id
	amountYuan: null,//充值金额
};
let form = {
	id: '',
	discountActivityId: '',
	discountCard: {
		id: '',
		cardNo: '',
		patient: {
			patientName: '',
			id: '',
		},
		telephone: '',
		remark: '',
		checkpassword: '',
		password: '',
		balanceYuan: 0,
		commone: '1'
	},
	payWayVOList: [Object.assign({},ship)],
	amount: 0,
	rechargeMoneyYuan: 0,
	remark: '', //充值的时候

}
export default {
	name: 'addDiscountCardDialog',
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
		var validatePass = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请输入密码'));
			} else {
			if (this.form.discountCard.checkpassword !== '' && this.dialogCfg.add.type !== 'recharge') {
				this.$refs.form.validateField('discountCard.checkpassword');
			}
			callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请再次输入密码'));
		} else if (value !== this.form.discountCard.password) {
			callback(new Error('两次输入密码不一致!'));
			} else {
			callback();
			}
		};
		return  {
			loading: false,
			imageUrl: '',
			discountActivityList: [],
			payWayList: [],
			currentActivity: {},
			disabled: false,
			form: JSON.parse(JSON.stringify(form)),
			rules: {
				'discountCard.patient.patientName': [
					{ required: true, message: '请选择患者', trigger: 'change' }
				],
				'discountCard.cardNo': [
					{required: true,message: '卡号不存在', trigger: 'blur' },
				],
				'discountCard.telephone': [
					{ required: true,validator: isMobile, trigger: 'blur' }
				],
				discountActivityId: [
					{ required: true, message: '请选择活动', trigger: 'change' }
				],
				payWayId: [
					{ required: true, message: '请选择支付方式', trigger: 'change' }
				],
				amountYuan: [
					{ required: true, message: '金额不能为空'},
					{
						pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
						message: "请输入正确的金额",
						trigger: "blur"
					}
				],
				'discountCard.password': [
					{ required: true,validator: validatePass, trigger: 'blur' }
				],
				'discountCard.checkpassword': [
					{ required: true,validator: validatePass2, trigger: 'blur' }
				]
			},

		}
	},
	mounted() {
	},
	methods: {
		openDialog() {
			let _this = this;
			setTimeout(function(){
				_this.$refs['form'].clearValidate();
				_this.$refs['form'].resetFields();
				_this.init();
			},100)
		},
		closeDialog() {
			this.dialogCfg.add.isshow = false;
			this.$refs['form'].clearValidate();
			this.$refs['form'].resetFields();
			this.loading = false;
		},
		querySearch(queryString, cb) {
			// 调用 callback 返回建议列表的数据
			getPatientlists(this.form.discountCard.patient.patientName).then(res => {
				if (res.data.code === SYSTEM_HTTP_SUCCESS) cb(res.data.data);
			});
		},
		 handleSelect(item) {
			this.form.discountCard.patient.patientName = item.patientName;
			this.form.discountCard.patient.id = item.id;
			this.form.discountCard.telephone = item.mobilephone;
		},
		handleMembershipList(type,index) {
			if(!this.form.payWayVOList) {
				return;
			}
			if(type === 'add') {
				this.form.payWayVOList.push(Object.assign({},ship)) ;
			} else {
				this.form.payWayVOList.splice(index,1);
				this.sumTotalPrice();
			}
		},
		//门店表单提交
    	formfn(formName) {
			let _this = this;
			_this.loading = true;
			this.$refs[formName].validate((valid) => {
			if (valid) {

				if(this.dialogCfg.add.type === 'add') {
					saveDiscountcard(_this.form).then(res => {
						_this.loading = false;
						if (res.data.code === SYSTEM_HTTP_SUCCESS) {
							_this.closeDialog();
							_this.$emit('getTableList');
						}

					}).catch(res => {
						_this.loading = false;
					})
				}else if(this.dialogCfg.add.type == 'recharge'){
					_this.form.remark = _this.form.discountCard.remark;
					saveDiscountcardRecharge(_this.form).then(res => {
						_this.loading = false;
						if (res.data.code === SYSTEM_HTTP_SUCCESS) {
							_this.closeDialog();
							_this.$emit('getTableList');
						}
					}).catch(res => {
						_this.loading = false;
					})
				} else {
					updateDiscountcard(formData).then(res => {
						_this.loading = false;
						if (res.data.code === SYSTEM_HTTP_SUCCESS) {
							_this.closeDialog();
							_this.$emit('getTableList');
						}
					}).catch(res => {
						_this.loading = false;
					})
				}
			} else {
				console.log('error submit!!');
				_this.loading = false;
				return false;
				}
			});
		},
		//重置密码
		resetpassword() {
			this.$confirm("您确定要重置密码?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
			}).catch(() => {});
		},
		//活动改变
		changeActivity(data,d) {
			let item = this.discountActivityList.find(function(val) {
				if(val.id == data) {
					return val
				}
			});
			if(item) {
				this.form.discountCard.discountYuan = item.discountYuan;
				this.form.payWayVOList[0].amountYuan = item.rechargeMoneyYuan;
				this.currentActivity = item;
			} else {
				this.form.discountCard.discountYuan = 0;
				this.currentActivity = {};
			}
			this.sumTotalPrice();
		},
		//输入金额改变
		changeAmount() {
			this.sumTotalPrice();
		},
		//计算实收金额,充值总额
		sumTotalPrice() {
			let amount = 0;
			 this.form.payWayVOList.forEach(item => {
				 if(!isNaN(item.amountYuan))amount += item.amountYuan - 0;
			 });
			 //修改充值金额后，总金额大于活动金额，还是能打折
			 if(this.currentActivity.rechargeMoneyYuan <= amount) {
				 this.form.discountCard.discountYuan = this.currentActivity.discountYuan;
			 } else {
				 // 总金额小于活动金额，不参与折扣
				this.form.discountCard.discountYuan = 0;
			 }
			 this.form.amount = amount;
		},
		init() {
			if(this.dialogCfg.add.type == 'recharge') {
				this.disabled = true;
				getDiscountcardrechargedo(this.dialogCfg.add.id).then(res => {
					if(res.data.code == SYSTEM_HTTP_SUCCESS) {
						this.payWayList = res.data.data.payWayList;
						this.discountActivityList = res.data.data.discountActivityList;
						let formd = JSON.parse(JSON.stringify(form));
						formd.discountCard = res.data.data.discountCard;
						formd.discountCard.remark = '';
						formd.id = res.data.data.discountCard.id;
						this.form = formd;
					}
				})
			} else {
				this.disabled = false;
				this.form = JSON.parse(JSON.stringify(form));
				this.getDiscountcarddo();
			}
		},
		//新增预存款时候填充条件
		getDiscountcarddo() {
			getDiscountcarddo().then(res => {
				if(this.dialogCfg.add.type == 'add')this.form.discountCard.cardNo = res.data.data.number;
				this.payWayList = res.data.data.payWayList;
				this.discountActivityList = res.data.data.discountActivityList;
			})
		}
  }
}
</script>
<style lang="less" scoped>
	.hr {
		width: 100%;
		height: 0;
		margin: 10px 0 20px 0;
		border-bottom: 1px dashed #dcdfe6;
	}
	.content {
    height: 500px;
		overflow-y: auto;
		margin-right: -20px;
		padding-right: 20px;
		.row-title {
			text-align: right;
			padding-top: 10px;
		}
		.el-select,.el-input,.el-autocomplete {
			width: 100%;
		}
		.paid-up {
			color: #7ED321;
		}
		.give-money {
			color: #3B78FD;
		}
	}
	.footer-left {
		text-align: left;
		padding-left: 20px;

		.total-money {
			color: #3B78FD;
			padding-left: 10px;
		}

		.balance {
			margin-left: 50px;
		}
	}
	.footer-right {
		text-align: right;
		padding-right: 20px;
	}
</style>
