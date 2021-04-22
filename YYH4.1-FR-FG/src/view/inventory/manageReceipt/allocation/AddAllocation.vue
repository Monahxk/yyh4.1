<!--
 * @Descripttion: 新增，修改调拨单
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-19 14:46:29
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="选择物品"
			:visible.sync="dialog.isshow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
			width="1000px"
			style="margin-top: 0;"
      @close="closeDialog"
      class="dialog"
			>
        <header class="header" slot="title">
          <div class="title">{{getTitle}}</div>
          <div class="right">
            <div v-show="dialog.type == 'detail'">
              <el-button size="small" class="submit" @click="dialog.type='edit'">重新编辑</el-button>
              <!-- <el-button size="small" type="text">查看审批</el-button> -->
            </div>
            <div v-show="dialog.type !== 'detail'">
              <el-button size="small" class="submit">提交</el-button>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="调出库房" prop="wareHouse" label-width="100px">
                  <el-select v-model="dataForms.wareHouse" placeholder="请选择">
                    <el-option
                      v-for="item in wareHouseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :push="4">
                <el-form-item label="调入库房" prop="commitTime" label-width="100px">
                  <el-select v-model="dataForms.wareHouse" placeholder="请选择">
                    <el-option
                      v-for="item in wareHouseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="10">
                <el-form-item label="申请日期" prop="commitTime" label-width="100px">
                  <el-date-picker type="date" 
                  v-model="dataForms.commitTime" 
                  placeholder="选择日期" 
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :readonly="dialog.type == 'detail'">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="remark">
                  <el-input v-model="dataForms.remark" clearable :readonly="dialog.type == 'detail'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="table-box">
              <header class="nav">
                <div class="left">明细</div>
                <div class="right" v-show="dialog.type !== 'detail'">
                  <el-button type="primary" size="small" @click="selectDrug">选择物品</el-button>
                </div>
              </header>
              <div class="sum-box">
                <div class="g-type">种类：<span class="number">5</span></div>
                <div class="money">
                  <span>总数量：<i class="number">200</i></span>
                  <span class="sum-money">总金额：<i class="number">￥1,200</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.pIList"
                  style="font-size: 14px"
                  height="100%"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column prop="drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="importCount" label="调拨数量" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'pIList.' + scope.$index + '.importCount'" :rules='rules.importCount' >
                        <el-input v-model="scope.row.importCount" placeholder="请输入"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="调拨单价" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'pIList.' + scope.$index + '.price'" :rules='rules.price' >
                        <el-input v-model="scope.row.price" placeholder="请输入"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="money" label="金额" align="center">
                    <template slot-scope="scope">
                      {{scope.row.money = isNaN(scope.row.price * scope.row.importCount) ? '' : scope.row.price * scope.row.importCount}}
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope" style="marginLeft:-25px">
                      <el-button type="text" size="small" @click="delRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        	</el-form>
			</el-dialog>
      <selectDrugDialog :isOpenDialog="isOpenDialog" @pushTableList="pushTableList"></selectDrugDialog>
		</div>
	</div>
</template>
<script>
import selectDrugDialog from '@/components/inventory/selectDrugDialog'
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
export default {
  name: 'AddAllocation',
	components: {
    selectDrugDialog
	},
	props: ['dialog'],
	data() {
		return {
      isOpenDialog: {
				drug: false,
				isshowDddDrug: true,
				type: 'import'
			},
      tableList: [],
      dataForms: {
        wareHouse: '',
        commitTime: '',
        remark: '',
        pIList: []
      },
      rules: [],
      wareHouseList: []
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        return '新增调拨单'
      } else if (this.dialog.type === 'edit') {
        return '编辑调拨单'
      } else {
        return '调拨单明细'
      }
    }
  },
	methods: {
		selectDrug() {
      this.isOpenDialog.drug = true;
    },
    //添加入库数据
		pushTableList(rowData) {
			let ishas = this.dataForms.pIList.find(function(value,index,arr){
		　　　　return value.drugId == rowData.drug.id;
		　　});
			if(ishas) {
				this.$message({
					message: '已存在',
					type: 'warning'
				});
			} else {
				let data = {
					drugId: rowData.drug.id,
					id: '',
					piriId: '',
					drugName: rowData.drug.drugName,
					surplusNumber: rowData.surplusNumber,
					brandName: rowData.drug.drugBrand?rowData.drug.drugBrand.brandName: '',
					drugSpec: rowData.drug.drugSpec,
					unitName: rowData.drug.drugUnitsConfig?rowData.drug.drugUnitsConfig.unitName:'',
					importCount: null,
					price: null,
					money: 0,
				}
				this.dataForms.pIList.push(data);
				this.$message({
					message: '添加成功',
					type: 'success'
				});
			}
		},
		//删除行
		delRow(index) {
			this.dataForms.pIList.splice(index,1);
			this.getSum();
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.pIList = [];
			this.dataForms.amount = 0;
			this.dataForms.totalPrice = 0;
			this.loading = false;
		},
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
    color: #1B1E25;
		/deep/.el-dialog__body {
      height: calc(100% - 61px);
      background: #FCFDFF;
		}
		/deep/.el-dialog {
			margin: 0 0 0 auto;
			height: 100%;
      margin-top: 0 !important;

      .header {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        .title {
          font-size: 16px;
        }

        .right {
          margin-right: 30px;
        }

        .submit {
          border-color: #3B78FD;
          color: #3B78FD;
        }
      }
 
      .table-box {
        height: calc(100% - 186px);
        background: #fff;
        border: 1px solid #DFE7F0;
        padding: 20px;

        .nav {
          display: flex;
          justify-content: space-between;
          height: 32px;
          line-height: 32px;
          margin-bottom: 20px;

          .left{
            font-weight:500;
            &::before {
              content: '';
              height: 14px;
              width: 0;
              border: 0;
              border-left: 5px solid #3B78FD;
              margin-right: 5px;
            }
          }
        }
        .sum-box {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .number {
            color: #3B78FD;
          }

          .sum-money {
            margin-left: 10px;
          }
        }

        .table-wrapper {
          height: calc(100% - 75px);

          .el-table {
            height: 100% !important;
          }
        }
      }

      .el-form.data-form {
        height: 100%;

        .el-input {
          width: 100%;
        }
      }

		}
	}
	
</style>

