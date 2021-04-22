<!--
 * @Descripttion: 供应商配置
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-26 11:48:59
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-11 16:22:10
 -->
<template>
	<div class="wrapper">
		<header class="header-page" :class="{'show-query': showQuery}">
			<div class="nav_wrap">
				<div class="nav_right_box">
          <div class="nav_item">
            <el-input placeholder="供应商名称" v-model="formSearch.suppliersName"  @keyup.enter.native="search">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
          </div>
          <div class="nav_item">
						<el-button type="primary"   @click="add">新增供应商</el-button>
					</div>
				</div>
			</div>
		</header>
		<main class="main-content">
			<section class="table-box" :class="{'re-ren': showQuery}">
				<el-table
          highlight-current-row
          ref="table"
          :data="tableList"
          :style="{'font-size': tableStyleConfig.font}"
          height="100%"
          v-loading="tableLoading"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
        >
          <template slot="empty">
            <div class="table-empty">
              <img src="../../../../assets/img/blank.png" alt>
            </div>
          </template>
           <el-table-column prop="suppliersName" label="名称" sortable align="center"></el-table-column>
          <el-table-column prop="contacts" label="联系人" sortable align="center"></el-table-column>
          <el-table-column prop="contactsTel" label="联系电话" sortable align="center"></el-table-column>
          <el-table-column label="结算方式" sortable align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.suppliersType == 1">
                月结
              </span>
              <span v-else>
                现结
              </span>
            </template>
          </el-table-column>
           <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
              <span class="line">|</span>
              <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>
    <!-- 新增/修改供应商的弹窗 -->
      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.isshow"
        width="766px"
        @close="closeDialog"
        class="dialog">
        <div class="content">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-row>
              <el-col :span="11">
                <el-form-item label="名称" prop="suppliersName">
                  <el-input v-model="form.suppliersName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="联系人" prop="contacts">
                  <el-input v-model="form.contacts"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :push="2">
                <el-form-item label="联系电话" prop="contactsTel" >
                  <el-input v-model="form.contactsTel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="传真" prop="contactsFax">
                  <el-input v-model="form.contactsFax"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :push="2">
                <el-form-item label="邮箱" prop="contactsMail" >
                  <el-input v-model="form.contactsMail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址" prop="contactsAddress">
                  <el-input v-model="form.contactsAddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="结算方式" prop="suppliersType">
                  <el-radio v-model="form.suppliersType" label="2">现结</el-radio>
                  <el-radio v-model="form.suppliersType" label="1">月结</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="开户银行" prop="payBank">
                  <el-input v-model="form.payBank"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :push="2">
                <el-form-item label="银行账户" prop="payBankCard">
                  <el-input v-model="form.payBankCard"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitfn('form')">确 定</el-button>
          <el-button @click="dialog.isshow = false">取 消</el-button>
        </span>
      </el-dialog>
	</div>
</template>
<script>
import Pagination from '@/components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {saveProvider,updateProvider,deleteProvider,getProvider,listProvider} from '@/api'
import util from '@/api/util'
export default {
	name: 'Provider',
	components: {Pagination},
  data() {
    let email = (rule, value, callback) => {
      let result = util.isEmail(value);
      let isEmpty = util.isEmpty(value+'');
      if (!isEmpty && !result) {
        return callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    };
    let phone = (rule, value, callback) => {
      let result = util.isMobile(value);
      let isEmpty = util.isEmpty(value+'');
      if (!isEmpty && !result) {
        return callback(new Error('联系电话格式不正确'));
      } else {
        callback();
      }
    };
		return {
			showQuery: false,
			tableel: false,
			state: 0,
			stateList: [
				{name: '全部库房', id: 0}
			],
			formSearch: {
				suppliersName: ''
      },
      form: {
        id: '',
        suppliersName: '',
        suppliersType: '1',
        contacts: '',
        contactsTel: '',
        contactsFax: '',
        contactsMail: '',
        contactsAddress: '',
        payBank: '',
        payBankCard: '',
        remark: ''
      },
      rules: {
        suppliersName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        contactsTel: [
          { validator: phone, trigger: 'blur' }
        ],
        contactsMail: [
          { validator: email, trigger: 'blur' }
        ],

      },
      dialog: {
				isshow: false,
				title: '新增供应商'
			},
			tableLoading: false,
			tableList: [],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
			}
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
	},
	mounted() {
    this.getTableList();
  },
	methods: {
		getTableList() {
      this.tableLoading = true;
      let params = {page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize};
			listProvider(Object.assign(params,this.formSearch)).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data;
          this.pageConfig.total = res.data.totalNumber || 0;
        } else {
          this.tableList = [];
          this.pageConfig.total = 0;
        }
      });
    },
    add() {
      this.form.id = '';
      this.dialog.title = '新增供应商';
      this.dialog.isshow = true;
    },
    edit(row) {
      console.log(row)
      this.form.id = row.id;
      this.dialog.title = '编辑供应商';
      this.dialog.isshow = true;
      this.$nextTick(() => {
        this.form = Object.assign({},row);
        this.form.suppliersType = this.form.suppliersType + '';
      })
    },
    del(id) {
       this.$confirm("此操作将删除该收费项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProvider(id).then(res => {
          this.getTableList();
        })
      }).catch(() => {});
    },
    submitfn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(!this.form.id)
          if(!this.form.id) {
            saveProvider(this.form).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.dialog.isshow = false;
                this.getTableList();
              }
            })
          } else {
            updateProvider(this.form).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.dialog.isshow = false;
                this.getTableList();
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    search() {
      this.pageConfig.currentPage = 1;
      this.getTableList();
    },
    handleSizeChange(pageSize) {
      this.pageConfig.currentPage = 1;
      this.pageConfig.pageSize = pageSize;
      this.getTableList();
    },
     handleChage(page) {
      this.pageConfig.currentPage = page;
      this.getTableList();
    },
    closeDialog() {
      this.$refs['form'].resetFields()
    },
	}
}
</script>
<style lang="less" scoped>
	
</style>
