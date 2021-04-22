<!--
 * @Descripttion: 新增，修改领用单
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-16 16:52:07
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 10:03:52
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
              <el-button size="small" class="submit" v-if="dialog.status == 2 || dialog.status == 4" @click="dialog.type='edit'">重新编辑</el-button>
            </div>
            <div v-show="dialog.type !== 'detail'">
              <el-button size="small" class="submit" @click="submitfn">提交</el-button>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms" :rules="rules" class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="领用库房" prop="takeOut.wareHouseId" label-width="100px">
                  <el-select v-model="dataForms.takeOut.wareHouseId" :disabled="disabled" @change="wareHouseChange" placeholder="请选择">
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
                <el-form-item label="申请日期" prop="takeOut.applyDate" label-width="100px">
                  <el-input v-model="dataForms.takeOut.applyDate" readonly></el-input>
                  <!-- <el-date-picker type="date" 
                  v-model="dataForms.takeOut.applyDate" 
                  placeholder="选择日期" 
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="disabled">
                  </el-date-picker> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24">
                <el-form-item label="备注" label-width="100px" prop="takeOut.remark">
                  <el-input v-model="dataForms.takeOut.remark" clearable :disabled="disabled"></el-input>
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
                <div class="g-type">种类：<span class="number">{{dataForms.takeOut.category}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.takeOut.quantity}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.takeOutItemList"
                  style="font-size: 14px"
                  height="100%"
                  :default-expand-all="true"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column prop="drug.drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="drug.drugBrand.brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drug.drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="drug.drugUnitsConfig.unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="inventoryQuantity" label="当前库存" align="center"></el-table-column>
                  <el-table-column prop="quantity" label="领用数量" align="center">
                    <template slot-scope="scope">
                      <el-form-item :prop="'takeOutItemList.' + scope.$index + '.quantity'" :rules='rules.quantity'>
                        <el-input v-model.number="scope.row.quantity" placeholder="请输入" :disabled="disabled" @input="inputNumber(scope.row)"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

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
import {SYSTEM_HTTP_SUCCESS,TO_FIXED} from "@/constant"
import {getWareHouseAll,saveTakeout,getTakeoutById} from '@/api'
import moment from "moment";
export default {
  name: 'AddTakeOut',
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
        takeOut: {
          category: 0,
          quantity: 0,
          wareHouseId: '',
          applyDate: '',
          remark: ''
        },
        takeOutItemList: [],
      },
      rules: {
        'takeOut.wareHouseId': [
          { required: true, message: '请选择库房', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请输入领用数量', trigger: 'blur' },
        ]
      },
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        this.disabled = false;
        return '新增领用单'
      } else if (this.dialog.type === 'edit') {
        this.disabled = false;
        return '编辑领用单'
      } else {
        this.disabled = true;
        return '领用单明细'
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
      if(!this.dataForms.takeOut.wareHouseId) {
        this.$message({
					message: '请选择库房',
					type: 'warning'
				});
        return;
      }
      this.isOpenDialog.wareHouseId = this.dataForms.takeOut.wareHouseId;
      this.isOpenDialog.drug = true;
    },
    //添加入库数据
		pushTableList(rowData) {
			let ishas = this.dataForms.takeOutItemList.find(function(value,index,arr){
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
          inventoryQuantity: rowData.quantity || 0,
					quantity: null,
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
        this.dataForms.takeOutItemList.push(data);
        this.dataForms.takeOut.category++;
				this.$message({
					message: '添加成功',
					type: 'success'
				});
			}
    },
    submitfn() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          if(this.dataForms.takeOutItemList.length == 0) {
            this.$message({
              message: '请填写领用详情',
              type: 'error'
            });
            return;
          }
          if(this.dialog.type == 'add' || this.dialog.type == 'edit') {
            console.log(JSON.stringify(this.dataForms))
            saveTakeout(this.dataForms).then(res => {
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
      this.dataForms.takeOutItemList.splice(index,1);
      this.sumtotale();
      this.dataForms.takeOut.category = this.dataForms.takeOutItemList.length;
    },
    //切换库房，清空详情
    wareHouseChange() {
      this.dataForms.takeOutItemList = [];
      this.dataForms.takeOut.quantity = 0;
      this.dataForms.takeOut.category = 0;
    },
    openDialog() {
      let timestamp = new Date().getTime();
      let date = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
      this.dataForms.takeOut.applyDate = date;
      if(this.dialog.id) {
        getTakeoutById(this.dialog.id).then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            let {takeOut,takeOutItemList} = res.data.data;
            this.dataForms.takeOutItemList = takeOutItemList;
            this.dataForms.takeOut = takeOut;
          }
        })
      }
    },
    closeDialog() {
			this.$refs['dataForms'].clearValidate();
			this.$refs['dataForms'].resetFields();
			this.dialog.show = false;
			this.dataForms.takeOutItemList = [];
			this.dataForms.takeOut.category = 0;
			this.dataForms.takeOut.quantity = 0;
			this.loading = false;
    },
    inputNumber(row) {
      let temp = row.quantity+'';
      row.quantity = temp.replace(/\D|(^0)/g,'');
      if(row.quantity && Number(row.inventoryQuantity) < Number(row.quantity)) {
        row.quantity = '';
        
        this.$message({
					message: '领用数量 大于 库存数量',
					type: 'error'
        });
      } else {
        this.sumtotale();
      }
    },
    sumtotale() {
      let sumNumber = 0, sumMoney = 0;
      this.dataForms.takeOutItemList.map((v) => {
         let n = Number(v.quantity);
         n ? (sumNumber += n) : '';
      });
      this.dataForms.takeOut.quantity = sumNumber;
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

