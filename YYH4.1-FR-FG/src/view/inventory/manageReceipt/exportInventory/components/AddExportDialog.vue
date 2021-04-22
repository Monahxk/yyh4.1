<!--
 * @Descripttion: 新增，修改出库单
 * @version: 4.1
 * @Author: hzj
 * @Date: 2019-08-22 15:23:22
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 17:55:21
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
              <el-button size="small" class="submit" v-if="dialog.status == 2 || dialog.status == 4" @click="dialog.type='edit'">重新编辑</el-button>
            </div>
            <div v-show="dialog.type !== 'detail'">
              <Buttons :btncfg="{submit: true,text: '提交'}" @submitfn="submitfn"></Buttons>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms" :rules="rules"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="出库库房" prop="exportInventoryRecord.wareHouseId" label-width="100px">
                  <el-select v-model="dataForms.exportInventoryRecord.wareHouseId" @change="wareHouseChange"  :disabled="disabled" placeholder="请选择">
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
                <el-form-item label="申请日期" prop="exportInventoryRecord.applyDate" label-width="100px">
                  <el-input v-model="dataForms.exportInventoryRecord.applyDate" readonly></el-input>
                  <!-- <el-date-picker
                    :disabled="disabled"
                    v-model="dataForms.exportInventoryRecord.applyDate"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="exportInventoryRecord.remark">
                  <el-input v-model="dataForms.exportInventoryRecord.remark" clearable :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="table-box">
              <header class="nav">
                <div class="left">明细</div>
                <div class="right" v-show="!disabled">
                  <el-button type="primary" size="small" @click="selectDrug">选择物品</el-button>
                </div>
              </header>
              <div class="sum-box">
                <div class="g-type">种类：<span class="number">{{dataForms.exportInventoryRecordItemList.length}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.exportInventoryRecord.quantity}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.exportInventoryRecord.amountYuan}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.exportInventoryRecordItemList"
                  style="font-size: 14px"
                  height="100%"
                  v-loading="tableLoading"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column prop="drug.drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="curquantity" label="当前库存" align="center"></el-table-column>
                  <el-table-column prop="drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="importCount" label="批号" align="center" v-if="showBatch"></el-table-column>
									<el-table-column prop="importCount" label="出库数量" align="center">
                    <template slot-scope="scope1">
                      <el-form-item :prop="'exportInventoryRecordItemList.' + scope1.$index + '.quantity'" :rules='rules.quantity'>
                        <el-input v-model.number="scope1.row.quantity" placeholder="请输入" :disabled="disabled"  @input="inputQuantity(scope1.row)"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="importCount" label="参考单价" align="center">
                    <template slot-scope="scope1">
                      <el-form-item :prop="'exportInventoryRecordItemList.' + scope1.$index + '.priceYuan'" :rules='rules.priceYuan'>
                        <el-input v-model="scope1.row.priceYuan" placeholder="请输入" @input="inputPriceYuan(scope1.row)" :disabled="disabled"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="amountYuan" label="金额" align="center"></el-table-column>

                  <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope" style="marginLeft:-25px">
                      <el-button type="text" v-if="!disabled" size="small" @click="delRow(scope.$index)">删除</el-button>
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
import Buttons from '@/components/commons/buttons/Buttons'
import selectDrugDialog from '@/components/inventory/selectDrugDialog'
import moment from "moment";
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import {saveExportInventory,getWareHouseAll,getExportInventoryDetailById} from '@/api'
export default {
  name: 'AddImportDialog',
	components: {
    selectDrugDialog,
    Buttons
	},
	props: ['dialog'],
	data() {
		return {
      tableLoading: false,
      showBatch: false,
      disabled: false,
      isOpenDialog: {
				drug: false,
        isshowDddDrug: false,
        type: 'out',
        wareHouseId: ''
			},
      tableList: [],
      dataForms: {
        exportInventoryRecord: {
          amountYuan: 0,
          category: 0,
          quantity: 0,
          remark: '',
          wareHouseId: '',
          applyDate: ''
        },
        exportInventoryRecordItemList: []
      },
      rules: {
        'exportInventoryRecord.wareHouseId': [
          { required: true, message: '请选择库房', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请选择出库数量', trigger: 'blur' },
        ],
        priceYuan: [
          { required: true, message: '请选择出库单价', trigger: 'blur' },
        ]
      },
      wareHouseList: []
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        this.disabled = false;
        return '新增出库单'
      } else if (this.dialog.type === 'edit') {
        this.disabled = false;
        return '编辑出库单'
      } else {
        this.disabled = true;
        return '出库单明细'
      }
    }
  },
  mounted() {
    getWareHouseAll().then(res => {
      if(res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.wareHouseList = res.data.data;
      }
    })
  },
	methods: {
    submitfn() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          this.dataForms.exportInventoryRecord.category = this.dataForms.exportInventoryRecordItemList.length;
          if(this.dialog.type == 'add' || this.dialog.type == 'edit') {
            this.dataForms.exportInventoryRecord.id = '';
            this.dataForms.exportInventoryRecordItemList.map((item => {
              item.id = '';
            }))
            saveExportInventory(this.dataForms).then(res => {
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
      if(!this.dataForms.exportInventoryRecord.wareHouseId) {
        this.$message({
					message: '请选择出库库房',
					type: 'warning'
				});
        return;
      }
      this.isOpenDialog.drug = true;
      this.isOpenDialog.wareHouseId = this.dataForms.exportInventoryRecord.wareHouseId
    },
    //添加出库数据
		pushTableList(rowData) {
			let ishas = this.dataForms.exportInventoryRecordItemList.find(function(value,index,arr){
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
          curquantity: rowData.quantity || 0,
					quantity: null,
          amountYuan: 0,
          priceYuan: rowData.guidePriceYuan || 0,
          drug: {
            id: rowData.drug.id,
            drugName: rowData.drug.drugName,
            inventoryAmount: rowData.drug.inventoryAmount,
            drugBrand: {
              brandName: rowData.drug.drugBrand?rowData.drug.drugBrand.brandName: '',
            },
            drugSpec: rowData.drug.drugSpec,
            drugUnitsConfig: {
              unitName: rowData.drug.drugUnitsConfig?rowData.drug.drugUnitsConfig.unitName:'',
            }
          }
				}
				this.dataForms.exportInventoryRecordItemList.push(data);
				this.$message({
					message: '添加成功',
					type: 'success'
				});
			}
		},
		//删除行
		delRow(index) {
			this.dataForms.exportInventoryRecordItemList.splice(index,1);
			this.sumtotale();
    },
    openDialog() {
      let timestamp = new Date().getTime();
      let date = this.getTimeTamp(timestamp);
      this.dataForms.exportInventoryRecord.applyDate = date;
      if(this.dialog.id) {
        this.tableLoading = true;
        getExportInventoryDetailById(this.dialog.id).then(res => {
          this.tableLoading = false;
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            let {exportInventoryRecord,exportInventoryRecordItemList} = res.data.data;
            this.dataForms.exportInventoryRecord = exportInventoryRecord;
            exportInventoryRecordItemList.map(v => {
              v.curquantity = v.inventoryQuantity;
            })
            this.dataForms.exportInventoryRecordItemList = exportInventoryRecordItemList;
          }
        }).catch(err => {
          this.tableLoading = false;
        })
      }
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.exportInventoryRecordItemList = [];
		  this.dataForms.exportInventoryRecord.quantity = 0;
      this.dataForms.exportInventoryRecord.amountYuan = 0;
			this.loading = false;
    },
    inputPriceYuan(row) {
      row.priceYuan =  row.priceYuan ? row.priceYuan.replace(/^\./g,'').replace(/[^\d\.]/g,'').replace(/(\d)(\.)(\d{3,})/g,'$1$2') : '';
      this.sumRowMoney(row);
    },
    inputQuantity(row) {
      if(row.curquantity < row.quantity) {
        this.$message({
					message: '出库数量大于当前库存',
					type: 'error'
        });
        return;
      }
      this.sumRowMoney(row);
    },
    sumRowMoney(row) {
      let n = Number(row.quantity) || 0;
      let m = Number(row.priceYuan) || 0;
      row.amountYuan = (n * m).toFixed(TO_FIXED);
      this.sumtotale();
    },
    sumtotale() {
      let sumNumber = 0, sumMoney = 0;
      this.dataForms.exportInventoryRecordItemList.map((v) => {
         let n = Number(v.quantity) || 0;
         let m = Number(v.amountYuan) || 0;
         sumNumber += n;
         sumMoney  += m;
      });
      this.dataForms.exportInventoryRecord.quantity = sumNumber;
      this.dataForms.exportInventoryRecord.amountYuan = sumMoney.toFixed(TO_FIXED);
    },
    getTimeTamp(t) {
      return moment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    //改变库房
    wareHouseChange() {
      this.dataForms.exportInventoryRecordItemList = [];
		  this.dataForms.exportInventoryRecord.quantity = 0;
      this.dataForms.exportInventoryRecord.amountYuan = 0;
    }
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

        .el-input {
          width: 100%;
        }
      }

		}
	}
	
</style>

