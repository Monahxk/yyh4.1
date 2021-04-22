<!--
 * @Descripttion: 新增，修改退库单
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-16 16:20:58
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-14 15:40:59
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
              <el-button size="small" class="submit" v-if="dialog.status == 2 || dialog.status == 4" @click="edit">重新编辑</el-button>
            </div>
            <div v-show="dialog.type !== 'detail'">
              <el-button size="small" class="submit" @click="submitfn">提交</el-button>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms" :rules="rules"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="领用库房" prop="drugReturnInventory.wareHouseId" label-width="100px">
                  <el-select v-model="dataForms.drugReturnInventory.wareHouseId" :disabled="disabled" placeholder="请选择">
                    <el-option
                      v-for="item in wareHouseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :push="4">
                <el-form-item label="申请日期" prop="drugReturnInventory.applyDate" label-width="100px">
                  <el-input v-model="dataForms.drugReturnInventory.applyDate" readonly></el-input>
                  <!-- <el-date-picker 
                  type="date"
                  :disabled="disabled"
                  v-model="dataForms.drugReturnInventory.applyDate" 
                  placeholder="选择日期" 
                  value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="remark">
                  <el-input v-model="dataForms.drugReturnInventory.remark" clearable :disabled="disabled"></el-input>
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
                <div class="g-type">种类：<span class="number">{{dataForms.drugReturnInventory.category}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.drugReturnInventory.quantity}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.drugReturnInventoryItemDTOList"
                  style="font-size: 14px"
                  height="100%"
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
                        <el-table-column  label="退库数量" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'drugReturnInventoryItemDTOList.' + scope.$index + '.batchList.' + scope1.$index + '.quantity'">
                              <el-input v-model.number="scope1.row.quantity" placeholder="请输入" @input="inputQuantity(scope.row)" :disabled="disabled"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drugReturnInventoryItem.drug.drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="drugReturnInventoryItem.drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drugReturnInventoryItem.drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drugReturnInventoryItem.drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="" label="批号" align="center" >
                    <template slot-scope="scope" >
                      <span>添加</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drugReturnInventoryItem.quantity" label="退库数量" align="center"></el-table-column>

                  <el-table-column label="操作" width="150" align="center" v-if="!disabled">
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
import moment from "moment";
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import {getDrugBatchlineitem,saveReturnInventory,getReturnInventoryById,getWareHouseAll} from '@/api'
export default {
  name: 'AddReturnToInventory',
	components: {
    selectDrugDialog
	},
	props: ['dialog'],
	data() {
		return {
      disabled: false,
      isOpenDialog: {
				drug: false,
        isshowDddDrug: true,
        type: 'out',
        wareHouseId: ''
      },
      wareHouseList: [],
      tableList: [],
      dataForms: {
        drugReturnInventory: {
          category: 0,
          quantity: 0,
          wareHouseId: '',
          applyDate: '',
          remark: ''
        },
        drugReturnInventoryItemDTOList: [],
      },
      rules: {
        'drugReturnInventory.wareHouseId': [
          { required: true, message: '请选择库房', trigger: 'change' },
        ],
        'drugReturnInventory.applyDate': [
          { required: true, message: '请选择日期', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请输入退库数量', trigger: 'blur' },
        ]
      },
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        this.disabled = false;
        return '新增退库单'
      } else if (this.dialog.type === 'edit') {
        this.disabled = false;
        return '编辑退库单'
      } else {
        this.disabled = true;
        return '退库单明细'
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
		selectDrug() {
      if(!this.dataForms.drugReturnInventory.wareHouseId) {
        this.$message({
					message: '请选择库房',
					type: 'warning'
				});
        return;
      }
      this.isOpenDialog.wareHouseId = this.dataForms.drugReturnInventory.wareHouseId;
      this.isOpenDialog.drug = true;
    },
    //添加入库数据
		pushTableList(rowData) {
			let ishas = this.dataForms.drugReturnInventoryItemDTOList.find(function(value,index,arr){
		　　　　return value.drugReturnInventoryItem.drug.id == rowData.drug.id;
		　　});
			if(ishas) {
				this.$message({
					message: '已存在',
					type: 'warning'
				});
			} else {
        let map = {
          drugReturnInventoryItem: {
            id: '',
            inventoryQuantity: rowData.quantity || 0,
            quantity: 0,
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
          },
          batchList: []
        }
        this.dataForms.drugReturnInventoryItemDTOList.push(map);
        this.dataForms.drugReturnInventory.category++;
				this.$message({
					message: '添加成功',
					type: 'success'
				});
			}
    },
    expand(row, expandedRows) {
      if(row.batchList.length > 0) {
        return;
      }
      getDrugBatchlineitem({
        drugId: row.drugReturnInventoryItem.drug.id,
        wareHouseId: this.dataForms.drugReturnInventory.wareHouseId
      }).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let barch = res.data.data;
          barch.map(item=> {
            let id = item.id;
            item.quantity = null;
            item.drugBatchId = id;
            item.id = '';
          })
          // if(row.returnInventoryBatchList && row.returnInventoryBatchList.length > 0) {
          //   if(this.dialog.type == 'detail') {
          //     row.batchList = row.returnInventoryBatchList;
          //     row.returnInventoryBatchList.map(item => {
          //       for(let val of barch) {
          //         if(item.drugBatchId == val.drugBatchId) {
          //           item.batchNumber = val.batchNumber;
          //           break;
          //         }
          //       }
          //     })
          //   } else {
          //     barch.map(item => {
          //       for(let val of row.returnInventoryBatchList) {
          //         if(item.drugBatchId == val.drugBatchId) {
          //           item.quantity = val.quantity;
          //           break;
          //         }
          //       }
          //     })
          //     row.batchList = barch;
          //   }
          // } else {
          //   row.batchList = barch;
          // }
          row.batchList = barch;
        }
      })
    },
    submitfn() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          if(this.dialog.type == 'add' || this.dialog.type == 'edit') {
            let isgo = true;
            this.dataForms.drugReturnInventory.id ='';
            this.dataForms.drugReturnInventoryItemDTOList.map(item => {
              item.drugReturnInventoryItem.id = '';
              let arr = [];
              for(let val of item.batchList) {
                console.log(val)
                if(val.quantity) {
                  arr.push(val);
                }
                val.id = '';
              }
              //判断明细时候填写，如果修改的时候未展开批号详情就返回原来的批号明细
              if(arr.length == 0 && item.returnInventoryBatchList.length == 0) {
                isgo = false;
              }
              if(arr.length > 0)item.returnInventoryBatchList = arr;
            })
            if(!isgo) {
              this.$message({
                message: '退库数量 不能为空',
                type: 'error'
              });
              return
            }
            // console.log(JSON.stringify(this.dataForms))
            saveReturnInventory(this.dataForms).then(res => {
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
		//删除行
		delRow(index) {
      this.dataForms.drugReturnInventoryItemDTOList.splice(index,1);
      this.dataForms.drugReturnInventory.category = this.dataForms.drugReturnInventoryItemDTOList.length;
      this.sumtotale();
    },
    inputQuantity(row) {
      let sumnumber = 0;
      row.batchList.map(item => {
        sumnumber += Number(item.quantity) ? Number(item.quantity) : 0
      })
      row.drugReturnInventoryItem.quantity = sumnumber;
      this.sumtotale(row);
    },
    sumtotale() {
      let sumNumber = 0, sumMoney = 0;
      this.dataForms.drugReturnInventoryItemDTOList.map((v) => {
         let n = Number(v.drugReturnInventoryItem.quantity);
         sumNumber += n ? n : 0;
      });
      this.dataForms.drugReturnInventory.quantity = sumNumber;
    },
    openDialog() {
      let timestamp = new Date().getTime();
      let date = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
      this.dataForms.drugReturnInventory.applyDate = date;
      if(this.dialog.id) {
        getReturnInventoryById(this.dialog.id).then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            let {drugReturnInventory,drugReturnInventoryItemDTOList} = res.data.data;
            drugReturnInventoryItemDTOList.map(item => {
              item.batchList = item.returnInventoryBatchList;
              // item.batchList.map(item => {
              //   item.batchNumber = item.orderNumber;
              // })
            })
            this.dataForms.drugReturnInventory = drugReturnInventory;
            this.dataForms.drugReturnInventoryItemDTOList = drugReturnInventoryItemDTOList;
          }
        })
      }
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.drugReturnInventoryItemDTOList = [];
			this.dataForms.drugReturnInventory.category = 0;
			this.dataForms.drugReturnInventory.quantity = 0;
      this.dataForms.drugReturnInventory.id = '';
      this.loading = false;
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
      }

		}
	}
	
</style>

