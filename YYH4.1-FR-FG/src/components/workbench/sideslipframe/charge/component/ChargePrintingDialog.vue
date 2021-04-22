<!--
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 15:01:41
 -->
<template>
  <div class="wrapper" id="chargePrint">
    <aside-dialog :isShow="isShow" v-model="closeData" title="打印预览" >
      <div class="print_wrap" id="printTest" :class="{isSCale: radio == 6}">
        <div v-for="(item, index) in tableDataList" :key="index">
         
          <div class="header">
             <span>{{currentinstitution.name}}</span>
          </div>
          <div class="print_main">
            <ul class="table_floor">
              <li class="table_item">
                <p>
                  <span>姓名</span>
                  <span>{{patientsMsg.patientName}}</span>
                </p>
                <p >
                  <span>单据号</span> 
                  <span class="brnone">{{item.chargeBill.number}}</span>
                </p>
              </li>
              <li class="table_item">
                <p>
                  <span>病历号</span>
                  <span>{{patientsMsg.emrNo}}</span>
                </p>
                <p>
                  <span>就诊日期</span>
                  <span class="brnone">{{getTime(item.chargeBill.visitTime)}}</span> 
                </p>
              </li>
            </ul>
            <div class="print_content">
              <div style="paddingBottom:0px;">
                <ul class="title title_one other mains">
                  <li v-for="(v, index) of titleData" :key="index">{{v}}</li>
                </ul>
                <ul class="title title_two mains" v-for="(val, index) in item.chargeBillItemList" :key="index">
                  <li>{{val.projectName}}</li>
                  <li>{{val.itemUnit}}</li>
                  <li>{{val.itemPriceYuan}}</li>
                  <li>{{val.itemNum}}</li>
                  <li>{{val.amountMoneyYuan}}</li>
                </ul>
              </div>

              <ul class="title title_one wrap sum">
                <li class="text_align_left">
                  <span>总金额：</span>
                  <span>￥{{item.chargeBill.amountYuan}}</span>
                </li>
                <li class="text_align_left">
                  <span>整单折扣：</span>
                  <span>{{item.chargeBill.discount}}%</span>
                </li>
                <li class="text_align_left">
                  <span>折后价：</span>
                  <span>￥{{item.chargeBill.discountAmountYuan}}</span>
                </li>
              </ul>

              <ul class="all_price sum">
                <li class="text_align_left">
                  <span>应收：</span>
                  <span>￥{{item.moneyYuan}}</span>
                </li>
                <li :class="{biglength: !!item.number}" class="text_align_left">
                  <span>实收：</span>
                  <span>￥{{item.chargeBill.receivedAmountYuan}}<i v-if="item.number">（补{{item.number}}单据欠费）</i></span>
                </li>
                <li v-if="Number(item.chargeBill.arrearsYuan) > 0" class="text_align_left">
                  <span>欠费：</span>
                  <span>￥{{item.chargeBill.arrearsYuan}}</span>
                </li>
              </ul>
            </div>
          </div>

          <ul class="footers">
            <li>
              <span>联系电话：{{currentinstitution.teleno}}</span>
            </li>
            <li>
              <span>医生：</span>
              <span>{{item.chargeBill.doctor.name}}</span>
            </li>
            <li>
              <span>地址：{{currentinstitution.addr}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <div class="bottom">
        <div style="marginRight:40px;">
          <el-radio-group v-model="radio">
            <el-radio :label="3">A4纸张</el-radio>
            <el-radio :label="6">3联票据</el-radio>
          </el-radio-group>
        </div>
          <span class="btns blues" v-print="'#printTest'">打印</span>
          <span class="btns" @click="isShow.dialogVisible = false">取消</span>
        </div>
      </div>
    </aside-dialog>
  </div>
</template>

<script>
import asideDialog from "@/components/workbench/asideDialog";
import { mapState } from "vuex";
import monment from "moment";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import {getCurrentClinic} from '@/api'
export default {
  components: { asideDialog },
  props: [
    "isShow",
    "tableDataList",
    "discount",
    "compallConst",
    "orderNumber",
    "chargeStatus",
    "time",
  ],
  inject: ["apps"],
  data() {
    return {
      radio: 6,
      closeData: "",
      titleData: ["项目名称", "单位", "单价（元）", "数量", "金额（元）"],
      allPrices: 0,
      currentinstitution: {}
    };
  },
  watch: {
    tableDataList(val) {
      this.totalPriceFn();
    }
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg
  }),
  methods: {
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
    totalPriceFn() {
      if (!this.tableDataList.length) {
        this.allPrices = 0;
        return;
      }
     
      let isAll = 0;
      if (this.discount) {
        this.tableDataList.map(val => {
          if (val.discountFlag) {
            isAll += parseInt(val.number) * val.retailPrice;
          } else {
            isAll += (this.discount / 100) * (parseInt(val.number) * parseInt(val.retailPrice))
          }
        });
      } else {
        this.tableDataList.map(val => {
          isAll += parseInt(val.number) * val.retailPrice;
        });
      }
      this.allPrices = isAll;

    },
    getCurrentinstitution() {
      let currentinstitution = sessionStorage.getItem('currentinstitution');
      if(currentinstitution) {
        this.currentinstitution = JSON.parse(currentinstitution);
      } else {
        getCurrentClinic().then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.currentinstitution = res.data.data;
            sessionStorage.setItem("currentinstitution", JSON.stringify(this.currentinstitution));
          }
        })
      }
    }
  },
  mixins: [],
  mounted() {
    this.getCurrentinstitution();
  }
};
</script>
<style lang="less" scoped>

.print_wrap  {
  padding: 0 30px;
}
.isSCale{
  margin: 0 auto;
  // transform: scaleX(0.6);
  font-size: 14px;
  width: 550px;
  // transform: translateX()
}
.df(@just:space-between) {
  display: flex;
  align-items: center;
  justify-content: @just;
}
@blue: rgb(59, 120, 253);
.header {
  padding: 0 20px 10px 20px;
  // height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  .df(center);
  .header_left {
    width: 60px;
    margin-right: 30px;
  }
  .header_right {
    width: 680px;
    .header_txt {
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
      margin-left: -109px;
    }
  }
}
.print_main {
  // border: 2px solid #423e48;

  .table_floor {
    .table_item {
      height: 24px;
      margin-right: -1px;
      border: 1px solid #423e48;
      text-align: center;
      line-height: 24px;
      .df();
      p {
        width: 50%;
        .df();
        span {
          border-right: 1px solid #423e48;
        }
        span:nth-child(1) {
          flex: 1;
        }
        span:nth-child(2) {
          flex: 2;
        }
      }
    }
    .table_item:nth-child(1) {
      border-bottom: none;
    }
  }
}
.print_content {
  padding: 10px 10px 0px 10px;
  text-align: center;
  .title_two {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
  }
  .title {
    font-size: 13px;
    .df();
    li {
      width: 30%;
    }
    li:nth-child(1) {
      // width: 50%;
    }
  }
}
.title_one {
  height: 30px;
  border-top: 1px solid #423e48;
  border-bottom: 1px solid #423e48;
}

.all_price {
  .df();
  line-height: 30px;
  li {
    text-align: left;
    // padding-left: 20px;
  }
  justify-content: left;
}
.footers {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  line-height: 18px;
  font-size: 12px;
  li {
  }
}
.bottom {
  .df(flex-end);
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #eee;
}
.btns {
  margin-right: 10px;
  margin-top: 5px;
  display: block;
  cursor: pointer;
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: @blue;
  border: 1px solid @blue;
}

.blues {
  background: @blue;
  color: #fff !important;
}
.other {
  margin-bottom: 0px;
}
.wrap {
  li {
    width: 40px;
  }
}
.brnone{
  border: 0 !important;
}

.mains {
  li:nth-child(1) {
    width: 60%;
  }
}
.sum {
  padding-left: 15px;
  &:nth-of-type(1) {
    margin-top: 10px;
    border-top: 2px solid #000;
  }
  li {
    width: 33.33%;
  }
}
.biglength {
  width: 66.66% !important;
}
.text_align_left {
  text-align: left;
}
</style>