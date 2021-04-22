<template>
	<el-dialog
		:title="dialogCfg.addChainemployeeDialog.dialogTitle"
		:visible.sync="dialogCfg.addChainemployeeDialog.isshow"
		:close-on-click-modal="false"
		@open="openDialog"
		width="900px"
		>
		<div class="content">
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
				<el-row>
					<el-col :span="11">
						<el-form-item label="姓名" prop="employee.name">
							<el-input v-model="form.employee.name" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="性别" prop="gender">
							<el-radio v-model="form.employee.gender" label="1">男</el-radio>
  						<el-radio v-model="form.employee.gender" label="2">女</el-radio>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="工号" prop="employee.workno">
							<el-input v-model="form.employee.workno" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="手机号" prop="employee.teleno">
							<el-input v-model="form.employee.teleno" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="hr"></div>
					</el-col>
				</el-row>
				<div v-for="(item,index) in form.membershipList" :key="index">
					<el-row v-if="item.opr != 'D'">
						<el-col :span="3" class="row-title">
							<span>关联门店{{index+1}}:</span>
						</el-col>
						<el-col :span="6">
							<el-form-item label="门店名称" label-width="80px" :prop="'membershipList.' + index + '.institutionName'" :rules='rules.institutionName'>
								<el-input v-model="item.institutionName" placeholder="请选择" readonly="" :rowindex="index" ></el-input>
								<div class="shop_content" v-if='item.isShowTree'>
									<areaTree :treeCfg="treeCfg" @treeNodeClick="getChainemployeedo"></areaTree>
								</div>
							</el-form-item>
							<el-form-item label="角色" label-width="80px" :prop="'membershipList.' + index + '.roleId'" :rules='rules.roleId'>
								<el-select v-model="item.roleId" placeholder="请选择" clearable filterable>
									<el-option
										v-for="item in item.roleList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="科室" :prop="'membershipList.' + index + '.departmentId'" :rules='rules.departmentId' label-width="80px">
								<el-select v-model="item.departmentId" placeholder="请选择" clearable filterable>
									<el-option
										v-for="item in item.departmentList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="状态" label-width="80px">
								<el-radio v-model="item.isDimission" label="0">在职</el-radio>
								<el-radio v-model="item.isDimission" label="1">离职</el-radio>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="岗位" :prop="'membershipList.' + index + '.positionId'" :rules='rules.positionId' label-width="80px">
								<el-select v-model="item.positionId" placeholder="请选择" clearable filterable>
									<el-option
										v-for="item in item.positionList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="" label-width="10px">
								<el-checkbox v-model="item.islogin">允许登录</el-checkbox>
								<el-checkbox v-model="item.isintern">实习</el-checkbox>
							</el-form-item>
						</el-col>
						<el-col :span="2">
							<div class="my-icon-box">
								<i class="el-icon-plus" v-if="index == 0" @click="handleMembershipList('add')"></i>
								<i class="el-icon-delete" v-else @click="handleMembershipList('del',index)"></i>
							</div>
						</el-col>
					</el-row>
					<el-row v-if="(form.membershipList.length - 1) != index && item.opr != 'D'" ref>
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
					<el-col :span="11">
						<el-form-item label="账号" prop="employee.username">
							<el-input v-model="form.employee.username" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="1">
						<el-form-item label="初始密码">
							123456
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="hr"></div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="出生日期">
							<el-date-picker
							v-model="form.profile.birthDate"
							value-format="yyyy-MM-dd 00:00:00"
							format="yyyy-MM-dd"
							type="date"
							placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="民族" prop="profile.nation">
							<el-input v-model="form.profile.nation" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="有效证件类型" prop="profile.validCertificateType">
							<el-input v-model="form.profile.validCertificateType" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="有效证件号码" prop="profile.validCertificateNo">
							<el-input v-model="form.profile.validCertificateNo" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item class="label-out" label="职业范围" prop="profile.practiceScope">
							<el-input v-model="form.profile.practiceScope" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="职称" prop="profile.prescriptionEffectiveSign">
							<el-input v-model="form.profile.prescriptionEffectiveSign" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item class="label-out" label="职务" prop="profile.duty">
							<el-input v-model="form.profile.duty" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="11" :push="2">
						<el-form-item label="执业证书编码" prop="profile.qualificationCode">
							<el-input v-model="form.profile.qualificationCode" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<el-row slot="footer" class="dialog-footer">
			<el-col :span="12" class="footer-left">
				<!-- <el-button @click="resetPassWord">重置密码</el-button> -->
				<p>&nbsp;</p>
			</el-col>
			<el-col :span="12" class="footer-right">
				<el-button type="primary" @click="formfn('form')" :loading="loading">确 定</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</el-col>
		</el-row>
	</el-dialog>
</template>
<script>
import areaTree from '@/components/chainment/areaTree'
import {addChainemployee,editChainemployee,getChainemployee,getChainemployeedo} from '@/api'
let ship = {
	canNotLogin: 0,//员工是否允许登录：0-允许  1-禁止
	islogin: true,
	departmentId: '',
	employeeId: '',
	institutionId: '',
	institutionName: '',
	id: '',//机构id值
	isDimission: '0',//员工是否已离职：0-在职 1-离职
	isIntern: 0,//是否为实习员工：0-正式 1-实习
	isintern: false,
	positionId: '',
	roleId: '',
	isShowTree: false,
	departmentList: [],
	positionList: [],
	roleList: [],
	opr: 'C'
};
let form = {
  employee: {
		id: '',
		name: '',
		gender: '1',
		type: '',
		photoPath: '',
		teleno: '',
		username: '',
		workno: '',
	},
	membershipList: [Object.assign({},ship)],
	profile: {
		beginPractiseDate: '',
		endPractiseDate: '',
		birthDate: '',
		certificateCode: '',
		duty: '',
		nation: '',
		practiceScope: '',
		prescriptionEffectiveSign: '',
		qualificationCode: '',
		registAddress: '',
		title: '',
		validCertificateNo: '',
		validCertificateType: '身份证'
	}
}
export default {
	name: 'AddEmployeeDialog',
	props: ['dialogCfg'],
	components: {
    areaTree,
  },
	data() {
		let vaworkno = (rule, value, callback) => {
			var reg = /^[0-9]\d*$/;
			if(!value) {
				callback(new Error('请输入工号'));
			}else if (!reg.test(value)) {
				callback(new Error('工号为数字'));
			} else {
				callback();
			}
		};
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
		return  {
			loading: false,
			imageUrl: '',
			form: JSON.parse(JSON.stringify(form)),
			treeCfg: {
				isshowAddBtn: false,
				hasInstitution: true,
				select: true,
				isGettable: false
      		},
			rules: {
				'employee.name': [
					{ required: true, message: '请输入名称', trigger: 'blur' },
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'employee.workno': [
					{required: true,validator: vaworkno, trigger: 'blur' },
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'employee.teleno': [
					{ required: true,validator: isMobile, trigger: 'blur' }
				],
				'employee.username': [
					{ required: true, message: '请输入账号', trigger: 'blur' },
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				institutionId: [
					{ required: true, message: '请选择门店', trigger: 'change' }
				],
				roleId: [
					{ required: true, message: '请选择角色', trigger: 'change' }
				],
				departmentId: [
					{ required: true, message: '请选择科室', trigger: 'change' }
				],
				positionId: [
					{ required: true, message: '请选择岗位', trigger: 'change' }
				],
				'profile.nation': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'profile.validCertificateType': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'profile.validCertificateNo': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'profile.practiceScope': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'profile.prescriptionEffectiveSign': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'profile.duty': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				],
				'profile.qualificationCode': [
					{ min: 0, max: 32, message: '最大长度32个字符', trigger: 'blur' }
				]
			},
			currIndex: 0,
			delshipList: []
		}
	},
	mounted() {
		this.handleContent();
	},
	methods: {
		openDialog() {
			let _this = this;
			setTimeout(function(){
				_this.$refs['form'].resetFields();
				if(_this.dialogCfg.addChainemployeeDialog.type == 'add'){
					_this.form = JSON.parse(JSON.stringify(form));
					_this.form.headquartersId = _this.dialogCfg.addChainemployeeDialog.data.headquartersId;
				}else{
					getChainemployee({
						id: _this.dialogCfg.addChainemployeeDialog.data.id,
						headquartersId: _this.dialogCfg.addChainemployeeDialog.data.headquartersId
					}).then(res => {
						let data = {
							employee: res.data.data.employee,
							profile: res.data.data.profile || {},
							membershipList: []
						};
						data.employee.gender = data.employee.gender + '';
						res.data.data.membershipList.forEach((item,index) => {
							let arr = res.data.data.membershipList[index];
							arr.departmentList = res.data.data.allOptionList[0].departmentList;
							arr.positionList = res.data.data.allOptionList[0].positionList;
							arr.roleList = res.data.data.allOptionList[0].roleList;
							arr.isShowTree = false;
							data.membershipList.push(arr);
							if(item.isIntern == 1) {
								item.isintern = true;
							} else {
								item.isintern = false;
							}
							if(item.canNotLogin == 1) {
								item.islogin = false;
							} else {
								item.islogin = true;
							}
							item.isDimission = item.isDimission + '';
							item.opr = 'U';
						});
						
						_this.form = JSON.parse(JSON.stringify(data));
					}).catch(res => {
						console.log(res)
					})
				}
			},100)
			
		},
		closeDialog() {
			this.$nextTick(() => {

				this.$refs['form'].resetFields();
				this.dialogCfg.addChainemployeeDialog.isshow = false;
				this.loading = false;
				this.delshipList = [];
			})
		},
		handleMembershipList(type,index) {
			if(!this.form.membershipList) {
				return;
			}
			if(type === 'add') {
				this.form.membershipList.push(Object.assign({},ship)) ;
			} else {

				if(this.form.membershipList[index].opr == 'C') {
				} else {
					this.form.membershipList[index].opr = 'D';
					this.delshipList.push(this.form.membershipList[index]);

				}
				this.form.membershipList.splice(index, 1);
			}
		},
		//员工表单提交
    	formfn(formName) {  
			let _this = this;
			_this.loading = true;
			this.$refs[formName].validate((valid) => {
			if (valid) {
				_this.form.membershipList.forEach(item => {
					if(item.isintern) {
						item.isIntern = 1
					} else {
						item.isIntern = 0
					}
					if(item.islogin) {
						item.canNotLogin = 0
					} else {
						item.canNotLogin = 1
					}
				})
				if(this.dialogCfg.addChainemployeeDialog.type === 'add') {
					addChainemployee(_this.form).then(res => {
						_this.init();
					}).catch(res => {
						_this.loading = false;
					})
				} else {
					let data = JSON.parse(JSON.stringify(_this.form));
					data.membershipList = data.membershipList.concat(this.delshipList);
					editChainemployee(data).then(res => {
						_this.init();
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
		resetPassWord() {
			this.$confirm("您确定要重置密码?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
			}).catch(() => {});
		},
		init() {
			this.closeDialog();
			this.$emit('getTableList');
		},
		getChainemployeedo(data) {
			console.log(data)
			if(!data.alias) {
				this.$message({
					message: '请选择门店',
					type: 'warning'
				});
			}
			let params = {
				headquartersId: data.headquartersId || data.chainLevel.headquartersId,
				institutionId: data.id || data.chainLevel.id
			}
			this.form.membershipList[this.currIndex].institutionName = data.name || data.chainLevel.name;
			this.form.membershipList[this.currIndex].institutionId = data.id || data.chainLevel.id;
			getChainemployeedo(params).then(res => {
				if(res.data.data.allOptionList != null) {
					this.form.membershipList[this.currIndex].roleList = res.data.data.allOptionList[0].roleList || [];
					this.form.membershipList[this.currIndex].departmentList = res.data.data.allOptionList[0].departmentList || [];
					this.form.membershipList[this.currIndex].positionList = res.data.data.allOptionList[0].positionList || [];
				} else {
					this.form.membershipList[this.currIndex].roleList = [];
					this.form.membershipList[this.currIndex].departmentList = [];
					this.form.membershipList[this.currIndex].positionList = [];
				}
			})
			
		},
		handleContent() {
			let _this=this
			document.addEventListener('click',function(e){
				if(e.target.attributes.rowindex) {
					let index = e.target.getAttribute('rowindex');
					_this.currIndex = index-0;
					
					_this.form.membershipList.forEach((item,i) => {
						
						if(index == i) {
							_this.form.membershipList[index].isShowTree = !_this.form.membershipList[index].isShowTree;
						} else {
							item.isShowTree = false;
						}
					});
				} else {
					if(!e.target.getAttribute('institution') && e.target.className != 'show_shop') {
						_this.form.membershipList.forEach(item => {
							item.isShowTree = false;
						});
					}
				}
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
		padding-right: 10px;
		margin-right: -30px;
		padding-right: 30px;
		.row-title {
			text-align: right;
			padding-top: 10px;
		}
		.el-select,.el-input {
			width: 100%;
		}
		.my-icon-box {
			height: 124px;
			width: 100%;
			text-align: center;
			line-height: 124px;
			color: #3B78FD;
			i {
				font-weight: bold;
				height: 24px;
				width: 24px;
				line-height: 24px;
				font-size: 20px;
			}
		}

		.shop_content{
			position: absolute;
			top: 40px;
			left: 0;
			box-shadow: 0 0 6px 0 #e4e9ff;
			z-index: 9;
			min-width: 300px;
			background: white;
			overflow-y: auto;
			max-height: 300px;
		}
	}
	.footer-left {
		text-align: left;
		padding-left: 20px;
	}
	.footer-right {
		text-align: right;
		padding-right: 20px;
	}
	/deep/.el-dialog__body {
		padding: 10px 30px 5px 30px;
	}
</style>
