<!--
 * @Descripttion: 新增入库单
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-28 17:10:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 17:55:14
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
			title="选择物品"
			:visible.sync="dialog.isshow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
			width="1100px"
			style="margin-top: 0;"
      @close="closeDialog"
      @open="openDialog"
      class="dialog"
			>
        <header class="header" slot="title">
          <div class="title">{{getTitle}}</div>
          <div class="right">
            <div v-show="dialog.type == 'detail'">
              <el-button size="small" v-if="dialog.status != 1" class="submit" @click="dialog.type='edit'">重新编辑</el-button>
            </div>
            <div v-show="dialog.type !== 'detail'">
              <Buttons :btncfg="{submit: true,text: '提交'}" @submitfn="submitfn"></Buttons>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms" :rules="rules"  ref="dataForms"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="入库库房" prop="importInventoryRecord.wareHouseId" label-width="100px">
                  <el-select v-model="dataForms.importInventoryRecord.wareHouseId" :disabled="disabled" placeholder="请选择">
                    <el-option
                      v-for="item in wareHouseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10"  :push="4">
                <el-form-item label="申请日期" prop="importInventoryRecord.applyDate" label-width="100px">
                  <el-input v-model="dataForms.importInventoryRecord.applyDate" readonly></el-input>
                  <!-- <el-date-picker
                    :disabled="disabled"
                    v-model="dataForms.importInventoryRecord.applyDate"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="importInventoryRecord.remark">
                  <el-input v-model="dataForms.importInventoryRecord.remark" :disabled="disabled" clearable :readonly="dialog.type == 'detail'"></el-input>
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
                <div class="g-type">种类：<span class="number">{{dataForms.importInventoryReordItemList.length}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.importInventoryRecord.quantity}}</i></span>
                  <!-- <span class="sum-money">总金额：<i class="number">￥1{{dataForms.importInventoryRecord.amountYuan}}</i></span> -->
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.importInventoryReordItemList"
                  style="font-size: 14px"
                  height="100%"
                  v-loading="tableLoading"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column type="expand" v-if="showBatch">
                    <template slot-scope="scope">
                      <el-table 
                      style="font-size: 14px"
                      :data="scope.row.list"
                      :header-cell-style="{background:'rgba(181,190,209,0.44)',color:'#000'}"
                      class="table-expand"
                      >
                        <el-table-column prop="pnumber" label="批号" align="center"></el-table-column>
                        <el-table-column prop="pdate" label="有效期" align="center"></el-table-column>
                        <el-table-column prop="number" label="入库数量" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'importInventoryReordItemList.' + scope.$index + '.list.' + scope1.$index + '.number'" >
                              <el-input v-model="scope1.row.number" placeholder="请输入" @input="inputNumber(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="number" label="入库单价" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'importInventoryReordItemList.' + scope.$index + '.list.' + scope1.$index + '.number'" :rules='rules.planPriceYuan'>
                              <el-input v-model="scope1.row.number" placeholder="请输入" @input="inputNumber(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="pdate" label="总金额" align="center"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drug.drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="drugProviderId" label="供应商" width="150" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'importInventoryReordItemList.' + scope.$index + '.drugProviderId'" :rules='rules.drugProviderId' >
                        <el-select v-model="scope.row.drugProviderId" :disabled="disabled" placeholder="请选择">
                          <el-option
                            v-for="item in drugProviderList"
                            :key="item.id"
                            :label="item.suppliersName"
                            :value="item.id">
                          </el-option>
                      </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="importCount" label="批号/有效期" align="center" v-if="showBatch"></el-table-column>
									<el-table-column prop="quantity" label="入库数量" align="center">
                    <template slot-scope="scope1">
                      <el-form-item :prop="'importInventoryReordItemList.' + scope1.$index + '.quantity'" :rules='rules.quantity'>
                        <el-input v-model.number="scope1.row.quantity" placeholder="请输入" :disabled="disabled" @input="inputQuantity"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="80" align="center" v-if="!disabled">
                    <template slot-scope="scope" style="marginLeft:-25px">
                      <el-button type="text" size="small" @click="delRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
        	</el-form>
			</el-dialog>
		</div>
    <selectDrugDialog :isOpenDialog="isOpenDialog" @pushTableList="pushTableList"></selectDrugDialog>
	</div>
</template>
<script>
import Buttons from '@/components/commons/buttons/Buttons'
import selectDrugDialog from '@/components/inventory/selectDrugDialog'
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import moment from "moment";
import {saveImportInventory,getImportinventorydo,updateImportInventory} from '@/api'
export default {
  name: 'AddImportDialog',
	components: {
    selectDrugDialog,
    Buttons
	},
	props: ['dialog'],
	data() {
		return {
      disabled: false,
      showBatch: false,
      tableLoading: false,
      isOpenDialog: {
				drug: false,
				isshowDddDrug: true,
        type: 'import',
        wareHouseId: ''
			},
      tableList: [],
      dataForms: {
        importInventoryRecord: {
          amountYuan: 0,
          category: 0,
          quantity: 0,
          remark: '',
          wareHouseId: '',
          applyDate: ''
        },
        importInventoryReordItemList: []
      },
      rules: {
        'importInventoryRecord.wareHouseId': [
          { required: true, message: '请选择库房', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请输入入库数量', trigger: 'blur' },
        ],
        drugProviderId: [
          { required: true, message: '请选择供应商', trigger: 'blur' },
        ]
      },
      wareHouseList: [],
      drugProviderList: []
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        this.disabled = false;
        return '新增入库单'
      } else if (this.dialog.type === 'edit') {
        this.disabled = false;
        return '编辑入库单'
      } else {
        this.disabled = true;
        return '入库单明细'
      }
    }
  },
	methods: {
    submitfn() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          this.dataForms.importInventoryRecord.category = this.dataForms.importInventoryReordItemList.length;
          if(this.dialog.type == 'add') {
            this.dataForms.importInventoryRecord.id = '';
            this.dataForms.importInventoryReordItemList.map((item => {
              item.id = '';
            }))
            saveImportInventory(this.dataForms).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit('search');
                this.dialog.isshow = false;
              }
            });
          } else if(this.dialog.type == 'edit') {
            console.log(JSON.stringify(this.dataForms))
            updateImportInventory(this.dataForms).then(res => {
              if(res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit('search');
                this.dialog.isshow = false;
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
		selectDrug() {
      // if(!this.dataForms.importInventoryRecord.wareHouseId) {
      //   this.$message({
			// 		message: '请选择入库库房',
			// 		type: 'warning'
			// 	});
      //   return;
      // }
      // this.isOpenDialog.wareHouseId = this.dataForms.importInventoryRecord.wareHouseId;
      this.isOpenDialog.drug = true;
    },
    //添加入库数据
		pushTableList(rowData) {
			let ishas = this.dataForms.importInventoryReordItemList.find(function(value,index,arr){
		　　　　return value.drug.id == rowData.drug.id;
		　　});
			if(ishas) {
				this.$message({
					message: '已存在',
					type: 'warning'
				});
			} else {
				let data = {
					id: '',
					quantity: null,
          amountYuan: 0,
          drug: {
            id: rowData.drug.id,
            drugName: rowData.drug.drugName,
            drugBrand: {
              brandName: rowData.drug.drugBrand?rowData.drug.drugBrand.brandName: '',
            },
            drugSpec: rowData.drug.drugSpec,
            drugUnitsConfig: {
              unitName: rowData.drug.drugUnitsConfig?rowData.drug.drugUnitsConfig.unitName:'',
            }
          }
				}
				this.dataForms.importInventoryReordItemList.push(data);
				this.$message({
					message: '添加成功',
					type: 'success'
				});
			}
		},
		//删除行
		delRow(index) {
			this.dataForms.importInventoryReordItemList.splice(index,1);
			this.sumtotale();
    },
    inputQuantity() {
      this.sumtotale();
    },
    sumtotale() {
      let sumNumber = 0, sumMoney = 0;
      this.dataForms.importInventoryReordItemList.map((v) => {
         let n = Number(v.quantity) || 0;
         let m = Number(v.amountYuan) || 0;
         sumNumber += n;
         sumMoney  += m;
      });
      this.dataForms.importInventoryRecord.quantity = sumNumber;
      this.dataForms.importInventoryRecord.amountYuan = sumMoney.toFixed(TO_FIXED);
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.importInventoryReordItemList = [];
    },
    openDialog() {
      this.tableLoading = true;
      let timestamp = new Date().getTime();
      let date = this.getTimeTamp(timestamp);
      this.dataForms.importInventoryRecord.applyDate = date;
      getImportinventorydo(this.dialog.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableLoading = false;
          let {drugProviderList,importInventoryRecord,importInventoryReordItemList,wareHouseList} = res.data.data;
          this.wareHouseList = wareHouseList || [];
          this.drugProviderList = drugProviderList || [];

          importInventoryRecord ? 
          this.dataForms.importInventoryRecord = importInventoryRecord : '';

          importInventoryReordItemList ? 
          this.dataForms.importInventoryReordItemList = importInventoryReordItemList : '';
        } else {
          this.tableLoading = false;
        }
      }).catch(err =>{
        this.tableLoading = false;
      })
    },
    getTimeTamp(t) {
      return moment(t).format("YYYY-MM-DD HH:mm:ss");
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
        height: calc(100% - 124px);
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
        padding-top: 15px;
        .el-input {
          width: 100%;
        }
      }

		}
	}
	
</style>

