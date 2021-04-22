<!--
 * @Descripttion: 库房列表
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-26 10:15:51
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 17:04:03
 -->
<template>
	<div class="wrapper">
		<header class="header-page">
			<div class="nav_wrap">
				<div class="nav_right_box">
					<div class="nav_item">
            <Buttons :btncfg="{add: true,text: '新增库房'}" @add="add"></Buttons>
					</div>
				</div>
			</div>
		</header>
		<main class="main-content">
			<section class="table-box">
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
              <img src="../../../assets/img/blank.png" alt>
            </div>
          </template>
          <el-table-column prop="id" label="ID" sortable align="center"></el-table-column>
          <el-table-column prop="name" label="库房名称" sortable  align="center"></el-table-column>
          <el-table-column prop="category" label="物品种类" sortable  align="center"></el-table-column>
          <el-table-column prop="quantity" label="库存量" sortable  align="center"></el-table-column>
          <el-table-column prop="amount" label="库存成本" sortable  align="center"></el-table-column>
          <el-table-column prop="employeeName" label="库管员" sortable  align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" sortable :show-overflow-tooltip="true" align="center"></el-table-column>

          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope" style="marginLeft:-25px">
              <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
              <!-- <span class="line">|</span>
              <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
			</section>
			<footer class="footer">
				<Pagination :pageConfig="pageConfig" @handleSizeChange="handleSizeChange" @handleChage="handleChage"></Pagination>
			</footer>
		</main>

<!-- 新增/修改弹窗 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.isshow"
      width="400px"
      @close="closeDialog"
      class="dialog"
      >
      <div class="content">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="data-form">
          <el-row>
            <el-col :span="24">
              <el-form-item label="库房名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="管理员" prop="employeeId">
                <el-select v-model="form.employeeId" placeholder="请选择人员">
                  <el-option
                    v-for="item in wareHouseEmployeeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input 
                type="textarea"
                :rows="2"
                v-model="form.remark"></el-input>
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
import Buttons from '@/components/commons/buttons/Buttons'
import Pagination from './../../../components/commons/Pagination'
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {listWareHouse,saveWareHouse,updateWareHouse,deleteWareHouse,listStorekeeper,getWarehousedo} from '@/api'
export default {
	name: 'WareHouseList',
	components: {Pagination,Buttons},
  data() {
		return {
      form: {
        id: '',
        employeeId: '',
        remark: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入库房名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        'employeeId': [
          {  required: true, message: '请选择库管员', trigger: 'blur' }
        ],
        remark: [
          { min: 0, max: 100, message: '备注最多 100 个字符', trigger: 'blur' }
        ],
      },
      wareHouseEmployeeList: [],
			tableLoading: false,
			tableList: [],
			pageConfig: {
				currentPage: 1,
        total: 0,
        pageSize: PAGE_SIZE
        
      },
      dialog: {
				isshow: false,
				title: '新增库房'
			},
		}
	},
	computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
  },
  mounted() {
    this.getTableList();
    listStorekeeper().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.wareHouseEmployeeList = res.data.data || [];
      }
    })
  },
	watch: {
  },
	methods: {
		getTableList() {
			listWareHouse({page:this.pageConfig.currentPage,pageSize: this.pageConfig.pageSize}).then(res => {
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
			this.dialog = {
				title: '新增库房',
				isshow: true
      }
      this.form.id = '';
		},
		edit(row) {
			this.dialog = {
				title: '修改库房',
				isshow: true
      }
      getWarehousedo(row.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.form = res.data.data.wareHouse;
        }
      })
      
		},
		del(id) {
			this.$confirm("您确定要删除该单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteWareHouse(id).then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.getTableList();
          }
        })
      }).catch(() => {});
		},
		submitfn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(!this.form.id) {
            saveWareHouse(this.form).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.dialog.isshow = false;
                this.getTableList();
              }
            })
          } else {
            updateWareHouse(this.form).then(res => {
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
    closeDialog() {
			this.$refs['form'].resetFields();
    },
    handleSizeChange(pageSize) {
      this.pageConfig.currentPage = 1;
      this.pageConfig.pageSize = pageSize;
      this.getTableList();
    },
     handleChage(page) {
      this.pageConfig.currentPage = page;
      this.getTableList();
    }
	}
}
</script>
<style lang="less" scoped>
	
</style>
