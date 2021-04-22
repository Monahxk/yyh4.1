<template>
	<el-dialog
		title="排序"
		:visible.sync="dialogCfg.order.isshow"
		width="500px"
		@opened="openedDialog"
		@open="openDialog"
		>
		<div class="content">
			<el-form :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="目标值" prop="order">
							<el-input v-model="form.order" placeholder="请输入目标值"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="formfn('form')" :loading="loading">确 定</el-button>
			<el-button @click="closeDialog">取 消</el-button>
		</span>
	</el-dialog>
</template>
<script>
import {orderInstitution} from '@/api'
export default {
	name: 'orderInstitutionDialog',
	props: ['dialogCfg'],
	data() {
		 var checkOrder = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('目标值不能为空'));
			} else if (isNaN(value)) {
				callback(new Error('请输入数字值'));
			} else {
				callback();
			}
		};
		return  {
			loading: false,
			form: {
				order: '',
				id: '',
			},
			rules: {
				order: [
					{ validator: checkOrder, trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		closeDialog() {
			this.dialogCfg.order.isshow = false;
			this.loading = false;
			this.form.order = '';
			this.$refs['form'].clearValidate();
		},
		openDialog() {
			let _this = this;
			this.$nextTick(function() {
				_this.$refs['form'].clearValidate();
			})
		},
		openedDialog() {
			this.form.order = this.dialogCfg.order.data.order;
			this.form.id = this.dialogCfg.order.data.id;
		},
		//门店排序提交
    formfn(formName) {  
			this.loading = true;
			 this.$refs[formName].validate((valid) => {
				 if (valid) {
            orderInstitution(this.form).then(res => {
							this.dialogCfg.order.isshow = false;
							this.loading = false;
							this.$emit('getTableList', false);
						}).catch(res => {
							this.loading = false;
						})
          } else {
						console.log('error submit!!');
						this.loading = false;
            return false;
          }
			 });
		}
  }
}
</script>
<style lang="less" scoped>
	.content {
			height: 300px;
			overflow-y: auto;

	}
</style>
