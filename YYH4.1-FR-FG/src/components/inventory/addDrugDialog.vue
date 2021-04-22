<!--
 * @Descripttion: 新增，修改物品表单
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-10-31 17:51:47
 -->
<template>
	<el-dialog
			:title="drugDialog.drugDialogTitle"
			:visible.sync="drugDialog.drugDialogFla"
			@open="openDialog"
			width="720px"
			center
			class="add-drug-dialog">
			<div class="content">
				<el-form :model="drugForm" :rules="rules" ref="drugForm" label-width="100px" class="demo-ruleForm">
					<el-row>
						<el-col :span="11">
							<el-form-item label="名称" prop="drugName">
								<el-input v-model="drugForm.drugName" placeholder="请输入"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="物品条码" >
								<el-input v-model="drugForm.drugIndicator" placeholder="请输入"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="物品类别" prop="dentalscmGoodsTypeId">
								<el-select v-model="drugForm.dentalscmGoodsTypeId" placeholder="请选择">
									<el-option
										v-for="item in drugTypeList"
										:key="item.id"
										:label="item.goodstypeName"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="型号">
								<el-input v-model="drugForm.model" placeholder="请输入"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="规格">
								<el-input v-model="drugForm.drugSpec" placeholder="请输入"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="11" :push="2">
							<el-form-item label="品牌" >
								<el-select v-model="drugForm.brandNameId" placeholder="请选择">
									<el-option
										v-for="item in brandList"
										:key="item.id"
										:label="item.brandName"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="单位">
								<el-select v-model="drugForm.drugUnitsDictId" placeholder="请选择">
									<el-option
										v-for="item in unitList"
										:key="item.id"
										:label="item.unitName"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- <el-row>
						<el-col :span="24">
							<div class="hr"></div>
						</el-col>
					</el-row>
					<el-row >
						<el-col :span="24">
							<el-form-item label="入库价" required>
								<el-col :span="9">
									<el-form-item >
										<el-select v-model="drugForm.importPrice" placeholder="请选择">
											<el-option
												v-for="item in importPriceList"
												:key="item.value"
												:label="item.label"
												:value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="9" :push="1">
									<el-form-item >
										<el-input v-model="drugForm.importPrice1" placeholder="请输入"></el-input>
									</el-form-item>
								</el-col>
						</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="出库价" required>
								<el-col :span="9">
									<el-form-item >
										<el-select v-model="drugForm.exportPrice" placeholder="请选择">
											<el-option
												v-for="item in exportPriceList"
												:key="item.value"
												:label="item.label"
												:value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="9" :push="1">
									<el-form-item >
										<el-input v-model="drugForm.exportPrice1" placeholder="请输入"></el-input>
									</el-form-item>
								</el-col>
							</el-form-item>
						</el-col>
					</el-row> -->

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="drugFormfn('drugForm')" :loading="loading">确 定</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</span>
		</el-dialog>
</template>
<script>
import {saveDrug,updateDrug,getDrugById,getDrugvo} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
let drugForm = {
	drugName: '',
	drugIndicator: '',
	dentalscmGoodsTypeId: '',
	model: '',
	drugSpec: '',
	brandNameId: '',
	drugUnitsDictId: '',
	importPrice: '',
	importPrice1: '',
	exportPrice: '',
	exportPrice1: '',
}
export default {
	name: 'addDrugDialog',
	props: ['drugDialog'],
	data() {
		return  {
			loading: false,
			drugForm: Object.assign({},drugForm),
			rules: {
				drugName: [
					{ required: true, message: '请输入物品名称', trigger: 'blur' }
				],
				dentalscmGoodsTypeId: [
					{ required: true, message: '选择物品类别', trigger: 'blur' }
				],
			},
			drugTypeList: [],//物品类别
			brandList: [],//品牌
			unitList: [],//单位
			importPriceList: [],//入库价
			exportPriceList: [],//出库价
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		openDialog() {
			let _this = this;
			 setTimeout(function(){
        	_this.$refs['drugForm'].clearValidate();
      	},100)
		if(this.drugDialog.type == 'add'){
			_this.drugForm = Object.assign({},drugForm);
		}else{
			_this.getDrug(this.drugDialog.id);
		}
		},
		closeDialog() {
			this.drugDialog.drugDialogFla = false;
			this.$refs['drugForm'].clearValidate();
			this.$refs['drugForm'].resetFields();
			this.loading = false;
		},
		//物品表单提交
    	drugFormfn(formName) {  
			let _this = this;
			_this.loading = true;
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(_this.drugForm.id) {
						updateDrug(_this.drugForm).then(res => {
							_this.loading = false;
							if (res.data.code == SYSTEM_HTTP_SUCCESS) { 
								_this.drugDialog.drugDialogFla = false;
								_this.$emit('getTableList');
							} else {
							}

						}).catch(res => {
							_this.loading = false;
						})
					} else {
						saveDrug(_this.drugForm).then(res => {
							_this.loading = false;
							if (res.data.code == SYSTEM_HTTP_SUCCESS) { 
								_this.$emit('getTableList');
								_this.drugDialog.drugDialogFla = false;
							} else {
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
		init() {
			this.getBasecfg();
		},
		alertMsg(type,msg) {
			this.$message({
				message: msg,
				type: type
			});
		},
		//获取物品
		getDrug(id) {
			let _this = this;
			getDrugById({id: id}).then(res => {
				let data = res.data.data;
				if(res.data.code != SYSTEM_HTTP_SUCCESS) {
					return;
				}
				_this.drugTypeList = data.drugTypeList;
				_this.unitList = data.drugUnitConfigList;
				_this.brandList = data.drugBrandList;
				_this.drugForm = Object.assign({
					dentalscmGoodsTypeId: data.drug.drugType ? data.drug.drugType.id : '',
					brandNameId: data.drug.drugBrand ? data.drug.drugBrand.id : '',
					drugUnitsDictId: data.drug.drugUnitsConfig ? data.drug.drugUnitsConfig.id : '',
				},data.drug);
			});
    	},
		//获取
		getBasecfg() {
			if(this.drugDialog.type === 'add') {
				getDrugvo().then(res => {
					this.drugTypeList =res.data.data.drugTypeList;
					this.unitList = res.data.data.drugUnitConfigList;
					this.brandList = res.data.data.drugBrandList;
				});
			}
      
    	},
	}
}
</script>
<style lang="less" scoped>
	.hr {
		width: 100%;
		height: 0;
		margin: 10px 0 20px 0;
		border-bottom: 1px solid #dcdfe6;
	}
	.content {
		.el-select {
			width: 100%;
		}
	}
	.add-drug-dialog {
		/deep/.el-dialog {
			margin: 0 auto 50px !important;
			height: auto !important;
			margin-top: 15vh !important;
		}
	}
</style>
