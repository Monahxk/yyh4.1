<!--
 * @Descripttion: 申请退费
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-10-30 13:38:37
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 11:03:40
 -->
<template> 
  <div class="wrapper" id="apply">
    <aside-dialog :isShow="isShow" :showDialogClose="showDialogClose" v-model="closeData" title="申请退费" @on-open="openDialog">
      <div>
        <el-table
          max-height="500"
          ref="singleTable"
          :data="tableDataList"
          @selection-change="handleTableChange"
          style="font-size: 14px"
          v-loading="tableLoading"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <template slot="empty">
            <!-- @row-click="handleTableChange" -->
            <!-- @select="handleRow" -->
            <!-- @select-all="handleAllRow" -->
            <!-- <img style="width:180px;height:140px;vertical-align: 30px;" src="../../../assets/image/table/img-null.png" alt=""> -->
            <p>
              <span>暂无内容</span>
            </p>
          </template>
          <el-table-column label="项目名称" align="center" prop="projectName"></el-table-column>
          <el-table-column label="单价" align="center">
            <template slot-scope="scope">
              <span>{{(scope.row.itemPriceYuan - 0).toFixed(to_fixed)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="itemNum"></el-table-column>
          <el-table-column label="应收" align="center">
            <template slot-scope="scope">
              <span>{{(scope.row.amountMoneyYuan - 0).toFixed(to_fixed)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否折扣" align="center" prop="discountFlag">
            <template slot-scope="scope">
              <span>{{Number(scope.row.discountFlag)? '无折扣' : '打折'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="实收" align="center">
            <template slot-scope="scope">
              <span v-if="Number(scope.row.discountFlag) == 0">{{((scope.row.amountMoneyYuan - 0) * scope.row.chargeBill.discount / 100).toFixed(to_fixed)}}</span>
              <span v-else>{{(scope.row.amountMoneyYuan - 0).toFixed(to_fixed)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="可退数量" prop="itemNum" align="center">
          </el-table-column>

          <el-table-column label="需退数量" align="center" prop="refundNum">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.refundNum"
                size="small"
                style="width:80px"
                :readonly="refund"
                @input="inputChangeFn(scope.row, scope)"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                :min="1"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="reason_box">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row type="flex" class="line" justify="space-between" align="middle">
              <el-col :span="8"></el-col>
              <el-col :span="8" class="right">
                  <span>退费合计</span>
                  <span class="refund">￥{{form.refundTotleMoneyYuan  }}</span>
              </el-col>
            </el-row>
            <template v-for="(item,index) in cashCouponList" >
              <el-row type="flex" class="line" justify="space-between" align="middle" :key="index">
                <el-col :span="8">
                  <p class="dj-card">
                    <span>代金券:</span>
                    <span>{{item.code}}</span>
                    <span>抵用金额</span>
                    <span class="money">¥{{item.amountYuan}}</span>
                  </p>
                </el-col>
                <el-col :span="8">
                </el-col>
              </el-row>
            </template>
            <el-row type="flex" class="line" justify="space-between" align="middle">
              <el-col :span="24">
                <div class="play-way-box">
                  <div class="play-title">
                    <el-form-item label="退费方式" required>
                    </el-form-item>
                  </div>
                  <div class="play-way-list">
                    <template v-for="(item,index) in chargePaymentRecordList">
                      <div class="play-way-list-item" v-if="item.type !=3 && item.payWayName != '代金券'" :key="index">
                        <div>
                          【{{item.payWayName}}】已付￥{{item.payMoneyYuan}} 
                          <span class="cemeo" v-if="item.discount<100 && item.type == 2">（{{item.payWayName}}：{{item.discount / 100}}折 &nbsp;&nbsp;支付金额：￥{{item.basePayAmountYuan}}）</span>
                        </div>
                        <div>
                          <el-form-item label="">
                            <el-input placeholder="请输入退费金额" 
                            v-model="item.refundMoney"
                            :readonly="getIsReadonly"
                            @blur="inputChangeMoneyFn(item)"
                            :min="1"></el-input>
                            <p class="s-text" v-if="item.discount<100 && item.type == 2">（实际返还金额：￥{{item.relRefundMoney}}）</p>
                          </el-form-item>
                        </div>
                      </div>
                    </template>
                    
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between" align="middle" class="bottom-box">
              <el-col :span="24">
                <el-form-item label="退费原因" :required="true">
                  <el-input
                    resize="none"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="textarea3"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <div class="bottom">
            <p>
              <!-- <span class="btns" @click="handlePrintFn">打印</span> -->
            </p>
            <p class="btn_right">
              <span class="btns blues" @click="sendDataFn" :loading="loading">提交申请</span>
              <span class="btns" @click="isShow.dialogVisible = false">取消</span>
            </p>
          </div>
        </div>
      </div>
    </aside-dialog>
  </div>
</template>

<script>

// 申请退费
import asideDialog from "@/components/workbench/asideDialog";
import vuescroll from "vuescroll";
import { postRefundmoney,getEditchargebill ,getEditchargeRefundbill} from "@/api";
import { TO_FIXED } from "@/constant";
export default {
  components: { asideDialog, vuescroll },
  props: ["isShow", "tableList", "orderId", "refund","isAllPrice","batchId"],
  data() {
    return {
      textarea3: "",
      closeData: "",
      to_fixed: TO_FIXED,
      tableLoading: false,
      loading: false,
      showDialogClose: false,
      receivedAmountYuans: 0,
      form: {
        chargeBillId: '',
        refundTotleMoneyYuan: 0,
        refundReason: '',
        refundItemList: [],
        paywayDOList: [],
      },
      amount: "",
      allPrice: "0",
      checkArr: [],
      tableDataList: [],
      cashCouponList: [],//代金券
      chargePaymentRecordList: [],//退费方式
      tabletitle: [
        {
          prop: "projectName",
          label: "项目名称"
        },
        {
          prop: "itemPriceYuan",
          label: "单价"
        },
        {
          prop: "itemNum",
          label: "数量"
        },
        {
          prop: "amountMoneyYuan",
          label: "应收"
        },
      ]
    };
  },
  watch: {
    tableList(val) {
      this.openDialog();
    }
  },
  computed: {
    getIsReadonly() {
      return this.refund && !this.batchId
    }
  },
  methods: {
    handleTableChange(selection) {
      this.checkArr = selection;
      this.compAllPric();
    },
    handleChange(row) {
      console.log(row);
    },
    //退费金额
    inputChangeMoneyFn(row) {
      let reg = /^[0-9][0-9]*([.][0-9]{1,2})?$/;
      if(row.refundMoney != '' && !reg.test(row.refundMoney)) {
        this.$message.error(
          "错了哦，应退金额 是整数或者小数哦"
        );
        return;
      } else if(row.refundMoney == '') {
        row.relRefundMoney = 0;
        return;
      }
      row.refundMoney = parseFloat(row.refundMoney).toFixed(TO_FIXED);
      if (parseFloat(row.refundMoney) > parseFloat(row.basePayAmountYuan)) {
        row.refundMoney = row.basePayAmountYuan;
        // if(row.payWayName == '折扣卡' && parseFloat(row.refundMoney) > parseFloat(row.basePayAmountYuan)) {
        //   row.refundMoney = row.basePayAmountYuan;
        // } else {
        //   row.refundMoney = row.payMoneyYuan;
        // }
      }
      if (row.refundMoney == '' || parseFloat(row.refundMoney) <= 0) {
        row.refundMoney = '';
        row.relRefundMoney = 0;
      } else {
        if(row.type == 2) {
          row.relRefundMoney = row.discount ? ((row.discount / 100) * row.refundMoney).toFixed(TO_FIXED) : row.refundMoney;
        } else {
          row.relRefundMoney = row.refundMoney || 0;
        }
      }
      this.compAllMoney();
    },
    compAllMoney() {
      let isAll = 0.0;
      let money = 0.0;
      let baseMoney = 0.0;
      this.chargePaymentRecordList.map(val => {
        if(val.type != 3) {
          money +=  val.refundMoney - 0;
          baseMoney += val.basePayAmountYuan - 0;
          isAll +=  val.refundMoney-0;
        }
      });
        isAll = isAll.toFixed(TO_FIXED)
        if(isAll > parseFloat(this.form.refundTotleMoneyYuan) ) {
          this.$message.error(
            "错了哦，应退金额 大于 退费合计"
          );
          return false;
        } else if(isAll < parseFloat(this.form.refundTotleMoneyYuan) && money < baseMoney) {
          this.$message.error(
            "错了哦，应退金额 小于 退费合计"
          );
          return false;
        }
      
      return true;
    },
    // input 输入的时候
    inputChangeFn(row) {
      if (parseInt(row.refundNum) > parseInt(row.itemNum)) {
        row.refundNum = row.itemNum;
      }
      if (row.refundNum == '' || parseInt(row.refundNum) <= 0 ) row.refundNum = 0;
      this.compAllPric();
    },
    compAllPric() {
      // discountFlag? '无折扣' : '打折'    1 0   
      let isAll = 0;
      let itemNumTotle = 0,refundNumTolet = 0;
      this.tableDataList.map(val => {
        itemNumTotle += val.itemNum - 0;
        if(!isNaN(val.refundNum)) {
          refundNumTolet += val.refundNum - 0;
          if(Number(val.discountFlag)) {
            isAll += Number(val.refundNum) * Number(val.itemPriceYuan);
          } else {

            isAll += Number(val.refundNum) * Number(val.itemPriceYuan) * Number(val.chargeBill.discount) / 100;
          }
        }
        });
        isAll = isAll.toFixed(TO_FIXED);
        if(itemNumTotle === refundNumTolet) {
          this.form.refundTotleMoneyYuan = (this.isAllPrice - 0).toFixed(TO_FIXED);
        }
        if(this.refund) {
          isAll = this.form.refundTotleMoneyYuan;
        } 
        //如果全退，实收金额赋值给退费合计
        if(itemNumTotle === refundNumTolet && parseFloat(this.receivedAmountYuans) <= isAll) {
          this.chargePaymentRecordList.map(val => {
              val.refundMoney = val.basePayAmountYuan; //输入金额
              val.relRefundMoney = val.payMoneyYuan; //实际返回金额
          });
        } else {
          if(!this.refund)this.form.refundTotleMoneyYuan = isAll;
          let moneyTotal = this.form.refundTotleMoneyYuan;
          this.chargePaymentRecordList.map(val => {
            if(moneyTotal > 0 && val.type != 3) {
              if((val.basePayAmountYuan - 0) > moneyTotal) {
                val.refundMoney = moneyTotal;
                moneyTotal = 0;
              } else {
                val.refundMoney = val.basePayAmountYuan - 0;
                moneyTotal = (moneyTotal - val.refundMoney).toFixed(TO_FIXED);
              }
              if(val.type == 2) {
                val.relRefundMoney = val.discount ? ((val.discount / 100) * val.refundMoney).toFixed(TO_FIXED) : val.refundMoney;
              } else {
                val.relRefundMoney = val.refundMoney;
              }
            } else {
              val.refundMoney = '';
              val.relRefundMoney = 0;
            }
          });
        }
    },
   
    handleAllRow(selection) {},
    openDialog() {
      if(!this.orderId) {
        return;
      }
      this.tableLoading = true;
      this.loading = false;
      this.form.chargeBillId = this.orderId;
      this.form.refundTotleMoneyYuan = 0;
      getEditchargeRefundbill(this.orderId).then(res => {
        let data = res.data.data;
        
        this.receivedAmountYuans = (data.chargeBill.receivedAmountYuan - 0).toFixed(TO_FIXED);
        let chargeBillItemList = data.chargeBillItemList || [];
        let chargePaymentRecordList = data.chargePaymentRecordList || [];
        chargeBillItemList.map(val => {

          //refund,套餐退费，只能全额退费
          if(this.refund) {
            val.refundNum = val.itemNum;
            this.form.refundTotleMoneyYuan = (this.isAllPrice - 0).toFixed(TO_FIXED);
          } else {
            val.refundNum = 0;
          }
        });
        chargePaymentRecordList.map(val => {
           //refund,套餐退费，只能全额退费
           val.basePayAmountYuan = parseFloat(val.basePayAmountYuan).toFixed(TO_FIXED);
           val.payMoneyYuan = parseFloat(val.payMoneyYuan).toFixed(TO_FIXED);
          if(this.refund && !this.batchId) {
            //非批量收费的套餐
            val.refundMoney = val.basePayAmountYuan; //输入金额
            val.relRefundMoney = val.payMoneyYuan; //实际返回金额
            
          } else {
            val.refundMoney = ''; //输入金额
            val.relRefundMoney = 0; //实际返回金额
          }
        });
        console.log(chargeBillItemList)
        this.tableDataList = chargeBillItemList;
        this.cashCouponList = res.data.data.cashCouponList || [];
        this.chargePaymentRecordList = chargePaymentRecordList;
        if(this.refund && this.batchId) {
          this.compAllPric();
        }
        this.tableLoading = false;
      }).catch(err => {
        this.tableLoading = false;
        console.log(err)
      })
    },
    sendDataFn() {
      
      if (this.loading) return
      this.loading = true;
      let _is = false;
      let _isNull = false
    
      this.tableDataList.map(val => {
        if (val.refundNum > val.itemNum) {
          _is = true;
        }
      });
      
      if (_is) {
        this.loading = false;
        this.$message.error(
          "错了哦，应退数量 不应大于 可退数量，将会造成数据无法提交"
        );
        return;
      }

      if (!this.textarea3) {
        this.loading = false;
        this.$message.error(
          "请输入退费原因"
        );
        return;
      }
      
      let bol = this.tableDataList.some(val => val.refundNum != '' || val.refundNum )
      if ( bol ) {
        if(!this.compAllMoney()) {
          this.loading = false;
          return;
        } 
        this.form.refundItemList = this.tableDataList;
        let paywayDOList = JSON.parse(JSON.stringify(this.chargePaymentRecordList));
        paywayDOList.map(item => {
          item.payRecordId = item.id;
          if(item.type == 3) {
            item.payMoneyYuan = 0;
          } else { 
            item.payMoneyYuan = item.relRefundMoney;
            item.basePayAmountYuan = item.refundMoney;
          }
        })
        this.form.paywayDOList = paywayDOList;
        this.form.refundReason = this.textarea3;
        postRefundmoney(this.form).then(res => {
          if(res.data.code == 200) {
            this.isShow.dialogVisible = false;
            this.loading = false;
            this.$emit("on-charge");
          }
          
        });
      } else {
        this.$message.error("至少输入一个退货项目");
        this.loading = false;
      }
    }
  },
  mixins: [],
  mounted() {
    // console.log(this.tableDataList);
  }
};
</script>
<style lang="less" scoped>
#apply {

  /deep/.el-dialog {
    width: 900px !important;
  }
  .bottom-box {
    padding: 20px;
  }
}
@blue: rgb(59, 120, 253);
.red_txt {
  color: red;
}
.blues {
  background: @blue;
  color: #fff !important;
}
.df(@content:space-between ) {
  display: flex;
  align-items: center;
  justify-content: @content;
}
.reason_box {
  padding-top: 10px;
  .df();
  .box_left {
    .df();
  }
  .right {
    text-align: right;
  }
  .refund {
    margin-left:10px; 
    color:#ff4e65;
    font-size:20px;
    font-weight: bold;
  }
  .dj-card {
    font-size: 14px;
    .money {
      color:#ff4e65;
      font-weight: bold;
    }
    span{
      margin-left:10px; 
    }
    span:first-child {
      margin-left: 0;
    }
  }
  .play-way-box {
    display: flex;
    .play-title {
      text-align: right;
      width: 80px;
      flex-grow: 0;
      /deep/.el-form-item__content {
        margin-left: 0;
      }
    }

    .play-way-list {
      flex-grow: 1;
      flex: 1;
      .play-way-list-item {
        display: flex;
        justify-content: space-between;
        min-height: 44px;
        line-height: 44px;
        border: 1px solid #E4E9FF;
        padding: 2px 15px;
        margin-bottom: 15px;

        .el-form-item {
          margin: 0;
          /deep/.el-input__inner {
            border: 0;
            text-align: right;
            &:hover {
              border-color: #fff;
            }
          }
        }

        .cemeo {
          color: #F77E1B;
        }
        .s-text {
          text-align: right;
          line-height: 22px;
          color: #FF485F;
          padding-bottom: 5px;
        }
        
      }
    }

  }
}
.line {
  border-bottom: 1px dashed #e2dbdb;
  padding: 20px;
}
.bottom {
  .df(space-between);
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
  .btn_right {
    .df();
  }
  .btns {
    display: block;
    cursor: pointer;
    margin-right: 20px;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: @blue;
    border: 1px solid @blue;
  }
}
.blues {
  background: @blue;
  color: #fff !important;
}
</style>
<style>
.reason_box .el-form {
  width: 100%;
}
.reason_box .el-dialog__body {
  padding-bottom: 0;
}

#apply .el-dialog__body {
  padding-bottom: 0;
  padding-top: 0;
}
#apply .mainPage .el-icon-arrow-down:before {
  margin-right: 0px !important;
}
#apply .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: 1px solid #dcdfe6 !important;
  background: #fff;
}
</style>
