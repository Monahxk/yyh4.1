<!--
 * @Descripttion: 新增退货
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-17 11:05:43
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 09:40:35
 -->
<template>
	<div class="content">
		<div class="wrapper">
			<el-dialog
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
              <el-button size="small" class="submit" v-if="dialog.status == '2' || dialog.status == '4'" @click="edit">重新编辑</el-button>
            </div>
            <div v-show="dialog.type !== 'detail'">
              <Buttons :btncfg="{submit: true,text: '提交'}" @submitfn="submitfn"></Buttons>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms" :rules="rules"  ref="dataForms"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="库房" prop="drugReturnRecord.wareHouseId" label-width="100px">
                  <el-select v-model="dataForms.drugReturnRecord.wareHouseId" @change="wareHouseChange" :disabled="disabled" placeholder="请选择">
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
                <el-form-item label="申请日期" prop="drugReturnRecord.applyDate" label-width="100px">
                  <el-input v-model="dataForms.drugReturnRecord.applyDate" readonly></el-input>
                  <!-- <el-date-picker
                    :disabled="disabled"
                    v-model="dataForms.drugReturnRecord.applyDate"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="drugReturnRecord.remark">
                  <el-input v-model="dataForms.drugReturnRecord.remark" clearable :disabled="disabled"></el-input>
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
                <div class="g-type">种类：<span class="number">{{dataForms.drugReturnRecord.category}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.drugReturnRecord.quantity}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.drugReturnRecord.amountYuan}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.drugReturnRecordItemDTOList"
                  style="font-size: 14px"
                  height="100%"
                  v-loading="tableLoading"
                  :default-expand-all="false"
                  @expand-change="expand"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table 
                      style="font-size: 14px"
                      :data="scope.row.batchList"
                      :header-cell-style="{background:'rgba(181,190,209,0.44)',color:'#000'}"
                      class="table-expand"
                      >
                        <el-table-column prop="batchNumber" label="批号" align="center"></el-table-column>
                        <el-table-column prop="effectiveTime" :formatter="formatterDateTOymd" label="有效期" align="center"></el-table-column>
                        <el-table-column prop="currentQuantity" label="库存" align="center"></el-table-column>
                        <el-table-column  label="退货数量" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'drugReturnRecordItemDTOList.' + scope.$index + '.batchList.' + scope1.$index + '.quantity'">
                              <el-input v-model.number="scope1.row.quantity" :disabled="disabled" placeholder="请输入" @input="inputQuantity(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="priceYuan" label="入库单价" align="center"></el-table-column>
                        <el-table-column prop="amountYuan" label="金额" align="center"></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drugReturnRecordItem.drug.drugName" label="名称" align="center"></el-table-column>
                  <!-- <el-table-column prop="drugReturnRecordItem.currentQuantity" label="当前库存" align="center"></el-table-column> -->
                  <el-table-column prop="drugReturnRecordItem.drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drugReturnRecordItem.drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drugReturnRecordItem.drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="" label="批号/有效期" align="center" >
                  <template slot-scope="scope" >
                    <span>添加</span>
                  </template>
                  </el-table-column>
                  <el-table-column prop="drugReturnRecordItem.quantity" label="退货数量" align="center"></el-table-column>
                  <el-table-column prop="drugReturnRecordItem.amountYuan" label="退货金额" align="center"></el-table-column>
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
		</div>
    <selectDrugDialog :isOpenDialog="isOpenDialog" @pushTableList="pushTableList"></selectDrugDialog>
	</div>
</template>
<script>
import Buttons from '@/components/commons/buttons/Buttons'
import selectDrugDialog from '@/components/inventory/selectDrugDialog'
import moment from "moment";
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import {getReturnRecordById,getDrugBatchlineitem,saveReturnRecord,getWareHouseAll} from '@/api'
export default {
  name: 'AddReturnForm',
	components: {
    Buttons,
    selectDrugDialog
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
        type: 'out',
        wareHouseId: ''
			},
      tableList: [],
      dataForms: {
        drugReturnRecord: {
          amountYuan: 0,
          category: 0,
          quantity: 0,
          remark: '',
          wareHouseId: '',
          applyDate: ''
        },
        drugReturnRecordItemDTOList: [],
      },
      rules: {
        'drugReturnRecord.wareHouseId': [
          { required: true, message: '请选择库房', trigger: 'change' },
        ],
        'drugReturnRecord.applyDate': [
          { required: true, message: '请选择日期', trigger: 'change' },
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
        return '新增退货单'
      } else if (this.dialog.type === 'edit') {
        this.disabled = false;
        return '编辑退货单'
      } else {
        this.disabled = true;
        return '退货单明细'
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
          let hasEmptyRow = 0;
          let isgo = true;
          this.dataForms.drugReturnRecordItemDTOList.map((item => {
            item.drugReturnRecordItem.id = '';
            let arr = [];
            item.batchList.map(v => {
              if(v.quantity) {
                let map = {
                  drugBatchId: v.drugBatchId,
                  amountYuan: v.amountYuan,
                  quantity: v.quantity,
                  // returnRecordItemId: item.drugReturnRecordItem.id
                }
                arr.push(map);
              }
            })
            if(arr.length == 0 && item.returnInventoryBatchList.length == 0) {
              isgo = false;
            }
            if(arr.length > 0)item.returnRecordBatchBatchList = arr;
            if(!item.drugReturnRecordItem.quantity) {
              hasEmptyRow++;
            }
          }))
          if(!isgo) {
              this.$message({
                message: '退货明细不能为空',
                type: 'error'
              });
              return
            }
          if(hasEmptyRow >0 ) {
            this.$message({
              message: '有一行未填写数量！',
              type: 'error'
            });
            return;
          }
          this.dataForms.drugReturnRecord.id = '';
          console.log(JSON.stringify(this.dataForms))
          
          saveReturnRecord(this.dataForms).then(res => {
            if(res.data.code == SYSTEM_HTTP_SUCCESS) {
              this.$emit('search');
              this.dialog.isshow = false;
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    selectDrug() {
      if(!this.dataForms.drugReturnRecord.wareHouseId) {
        this.$message({
					message: '请选择库房',
					type: 'warning'
				});
        return;
      }
      this.isOpenDialog.wareHouseId = this.dataForms.drugReturnRecord.wareHouseId;
      this.isOpenDialog.drug = true;
    },
    //添加退货数据
		pushTableList(rowData) {
			let ishas = this.dataForms.drugReturnRecordItemDTOList.find(function(value,index,arr){
		　　　　return value.drugReturnRecordItem.drug.id == rowData.drug.id;
		　　});
			if(ishas) {
				this.$message({
					message: '已存在',
					type: 'warning'
				});
			} else {
				let data = {
          drugReturnRecordItem: {
            id: '',
            currentQuantity: rowData.quantity || 0,
            quantity: 0,
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
            },
          },
          batchList: [],
          returnRecordBatchBatchList: []
				}
				this.dataForms.drugReturnRecordItemDTOList.push(data);
				this.$message({
					message: '添加成功',
					type: 'success'
        });
        
        this.dataForms.drugReturnRecord.category = this.dataForms.drugReturnRecordItemDTOList.length;
			}
    },
    //删除行
		delRow(index) {
      this.dataForms.drugReturnRecordItemDTOList.splice(index,1);
      this.dataForms.drugReturnRecord.category = this.dataForms.drugReturnRecordItemDTOList.length;
			this.sumtotale();
    },
    inputQuantity(row,batchrow) {
      if(Number(batchrow.quantity))batchrow.quantity = Math.abs(batchrow.quantity);
      if(Number(batchrow.quantity) > Number(batchrow.currentQuantity)) {
        batchrow.quantity = batchrow.currentQuantity;
      }
      batchrow.amountYuan = ((Number(batchrow.quantity) || 0) * (batchrow.priceYuan || 0)).toFixed(TO_FIXED);;
      this.sumtotale(row,batchrow);
    },
    sumtotale(row,batchrow) {
      if(row) {
        let sumNumber = 0,rowamountYuan = 0;
        // if(Number(batchrow.currentQuantity) < Number(batchrow.quantity)) {
        //   batchrow.amountYuan = 0;
        //   batchrow.quantity = 0;
        //   this.$message({
        //     message: '退货数量大于库存数量',
        //     type: 'error'
        //   });
        // }
        row.batchList.map(item => {
          sumNumber += (Number(item.quantity) || 0);
          rowamountYuan += (Number(item.amountYuan));
        })
        row.drugReturnRecordItem.quantity = sumNumber;
        row.drugReturnRecordItem.amountYuan = rowamountYuan;
      }

      let amountYuan = 0,sumquantity = 0;
      this.dataForms.drugReturnRecordItemDTOList.map((item => {
        amountYuan += Number(item.drugReturnRecordItem.amountYuan);
        sumquantity += Number(item.drugReturnRecordItem.quantity);
      }))
      this.dataForms.drugReturnRecord.amountYuan = amountYuan.toFixed(TO_FIXED);
      this.dataForms.drugReturnRecord.quantity = sumquantity;
    },
    expand(row, expandedRows) {
      if(row.batchList.length > 0) {
        return;
      }
      getDrugBatchlineitem({
        drugId: row.drugReturnRecordItem.drug.id,
        wareHouseId: this.dataForms.drugReturnRecord.wareHouseId
      }).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let barch = res.data.data;
          // if(this.dialog.type == 'detail') {
          //   row.batchList = row.returnRecordBatchBatchList;
          //   row.batchList.map(item => {
          //     item.priceYuan = item.price;
          //     for(let val of barch) {
          //       if(item.drugBatchId == val.id) {
          //         item.batchNumber = val.batchNumber;
          //         break;
          //       }
          //     }
          //   })
          // } else {
              barch.map(item=> {
                item.drugBatchId = item.id;
              // if(row.returnRecordBatchBatchList && row.returnRecordBatchBatchList.length > 0) {
              //   for(let a of row.returnRecordBatchBatchList) {
              //     item.currentQuantity = item.quantity;
              //     if(item.id == a.drugBatchId) {
              //       item.quantity = a.quantity;
              //       item.amountYuan = a.amountYuan;
              //     } else {
              //       item.quantity = null;
              //       item.amountYuan = '';
              //     }
              //   }
              // } else {
                  item.currentQuantity = item.quantity;
                  item.quantity = null;
                  item.amountYuan = '';
                // }
            })
            row.batchList = barch;
          // }
          
        }
      })
    },
    wareHouseChange() {
      this.dataForms.drugReturnRecordItemDTOList = [];
      this.dataForms.drugReturnRecord.category = 0;
      this.dataForms.drugReturnRecord.amountYuan = 0;
      this.dataForms.drugReturnRecord.quantity = 0;
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
      this.dialog.show = false;
      this.$nextTick(() => {
        this.dataForms.drugReturnRecordItemDTOList = [];
        this.dataForms.drugReturnRecord.category = 0;
        this.dataForms.drugReturnRecord.amountYuan = 0;
        this.dataForms.drugReturnRecord.quantity = 0;
      })
    },
    openDialog() {
      let timestamp = new Date().getTime();
      let date = this.getTimeTamp(timestamp);
      this.dataForms.drugReturnRecord.applyDate = date;
      if(!this.dialog.id) {
        return;
      }
      this.tableLoading = true;
      getReturnRecordById(this.dialog.id).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {drugReturnRecord,drugReturnRecordItemDTOList} = res.data.data;
          drugReturnRecordItemDTOList.map(item => {
            item.batchList = item.returnRecordBatchBatchList;
          })
          this.dataForms.drugReturnRecordItemDTOList = drugReturnRecordItemDTOList;
          this.dataForms.drugReturnRecord = drugReturnRecord;
        }
      }).catch(err =>{
        this.tableLoading = false;
      })
    },
    getTimeTamp(t) {
      return moment(t).format("YYYY-MM-DD HH:mm:ss");
    },
    edit() {
      this.dialog.type ='edit';
      // this.openDialog();
    }
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
    color: #1B1E25;
		/deep/.el-dialog__body {
      height: 100%;
      background: #FCFDFF;
      padding-top: 0;
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
        .text-item {
          padding: 10px 20px;
        }
      }

		}
	}
	
</style>

