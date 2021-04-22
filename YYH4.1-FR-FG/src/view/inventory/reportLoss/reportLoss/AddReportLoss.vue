<!--
 * @Descripttion: 新增，修改报损单
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 11:50:33
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
      class="dialog"
			>
        <header class="header" slot="title">
          <div class="title">{{getTitle}}</div>
          <div class="right">
            <div v-show="dialog.type == 'detail'">
              <el-button size="small" class="submit" @click="dialog.type='edit'">重新编辑</el-button>
              <el-button size="small" type="text">查看审批</el-button>
            </div>
            <div v-show="dialog.type !== 'detail'">
              <el-button size="small" class="submit" @click="submitfn">提交</el-button>
            </div>
          </div>
        </header>
        	<el-form :model="dataForms"  ref="dataForms"  class="data-form">
            <el-row >
              <el-col :span="10">
                <el-form-item label="报损库房" prop="commitTime1" label-width="100px">
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
                <el-form-item label="报损日期" prop="commitTime" label-width="100px">
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
                <el-form-item label="报损原因" label-width="100px" prop="remark">
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
                <div class="g-type">种类：<span class="number">{{dataForms.pIList.length}}</span></div>
                <div class="money">
                  <span>总数量：<i class="number">{{dataForms.sumNumber}}</i></span>
                  <span class="sum-money">总金额：<i class="number">￥{{dataForms.sumMoney}}</i></span>
                </div>
              </div>
              <div class="table-wrapper">
                <el-table
                  highlight-current-row
                  ref="table"
                  :data="dataForms.pIList"
                  style="font-size: 14px"
                  height="100%"
                  :default-expand-all="true"
                  :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
                >
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table 
                      style="font-size: 14px"
                      :data="scope.row.list"
                      :header-cell-style="{background:'rgba(181,190,209,0.44)',color:'#000'}"
                      class="table-expand"
                      >
                        <el-table-column prop="pnumber" label="批号" align="center"></el-table-column>
                        <el-table-column prop="pdate" label="有效期" align="center"></el-table-column>
                        <el-table-column prop="number" label="报损数量" align="center">
                          <template slot-scope="scope1">
                            <el-form-item :prop="'pIList.' + scope.$index + '.list.' + scope1.$index + '.number'" >
                              <el-input v-model="scope1.row.number" placeholder="请输入" @input="inputNumber(scope.row,scope1.row)"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drugName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
                  <el-table-column prop="drugSpec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="unitName" label="单位" align="center"></el-table-column>
                  <el-table-column prop="unitName" label="批号/有效期" align="center"></el-table-column>
                  <el-table-column prop="number" label="报损数量" align="center"></el-table-column>
                  <el-table-column prop="price" label="入库单价" align="center"></el-table-column>
                  <el-table-column prop="money" label="金额" align="center"> </el-table-column>

                  <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope" style="marginLeft:-25px">
                      <el-button type="text" size="small" @click="delRow(scope.row.id)">删除</el-button>
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
export default {
  name: 'AddPurchaseOrder',
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
      wareHouseList: [],
      tableList: [],
      dataForms: {
        wareHouse: '',
        commitTime: '',
        remark: '',
        sumNumber: 0,
        sumMoney: 0,
        pIList: [{number:'',price: 2,list: [{pnumber:'4',pdate: '2019-2-2',number:''},{pnumber:'444',pdate: '2019-2-2',number:''}]}]
      },
      rules: []
		}
  },
  computed: {
    getTitle() {
      if(this.dialog.type === 'add') {
        return '新增报损'
      } else if (this.dialog.type === 'edit') {
        return '编辑报损'
      } else {
        return '报损明细'
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
    submitfn() {
      let result = this.findArrHasNull(this.dataForms.pIList);
      if(!result) {
        this.$message({
					message: '请填写报损数量',
					type: 'error'
				});
      }
    },
		//删除行
		delRow(id) {
			let _index ; 
			this.dataForms.pIList.find(function(value,index,arr){
		　　　　if(value.drugId === id) {
					_index = index;
					return true;
				} else {
					return false;
				}
		　　});
      this.dataForms.pIList.splice(_index,1);
      this.sumtotale();
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
    inputNumber(row,er) {
      let temp = er.number+'';
      er.number = temp.replace(/\D|(^0)/g,'');
      let number = 0;
      let price = Number(row.price) ? Number(row.price) : 0;
      row.list.map((v) => {
        let temp = Number(v.number);
        if(temp) {
          number += temp;
        }
      })
      row.number = number;
      row.money = number * price ;
      this.sumtotale();
    },
    sumtotale() {
      let sumNumber = 0, sumMoney = 0;
      this.dataForms.pIList.map((v) => {
         let n = Number(v.number);
         let m = Number(v.money);
         n ? (sumNumber += n) : '';
         m ? (sumMoney  += m) : '';
      });
      this.dataForms.sumNumber = sumNumber;
      this.dataForms.sumMoney = sumMoney.toFixed(TO_FIXED);
    },
    findArrHasNull(list) {
      //查询报损数量是否填写
      if(Array.isArray(list)) {
        return list.find((v) => {
          return v.number == ''
        }) ? false : true;
      } else {
        return false;
      }
      
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

