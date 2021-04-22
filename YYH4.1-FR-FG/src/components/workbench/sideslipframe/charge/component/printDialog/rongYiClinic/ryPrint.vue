<!--
 * @Descripttion: 融益口腔收费单打印
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-11-12 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-18 14:30:22
 -->
<template>
  <div class="wrapper" id="wrapper">
      <div class="print_wrap" id="printTest">
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
              <p>
                <span>单据号</span>
                <span class="brnone">{{chargeBill.number}}</span>
              </p>
            </li>
            <li class="table_item">
              <p>
                <span>病历号</span>
                <span>{{patientsMsg.emrNo}}</span>
              </p>
              <p>
                <span>就诊日期</span>
                <span class="brnone">{{getTime(chargeBill.visitTime)}}</span>
              </p>
            </li>
          </ul>
          <div class="print_content">
            <div style="paddingBottom:0px;">
              <ul class="title title_one other mains">
                <li v-for="(item, index) of titleData" :key="index">{{item}}</li>
              </ul>
              <ul class="title title_two mains" v-for="(item, index) in chargeBill.chargeBillItemList" :key="index">
                <li>{{item.projectName}}</li>
                <li>{{item.itemUnit}}</li>
                <li>{{item.itemPriceYuan}}</li>
                <li>{{item.itemNum}}</li>
                <li>{{item.amountMoneyYuan}}</li>
              </ul>
            </div>

            <ul class="title title_one sum">
              <li class="text_align_left">
                <span>总金额：</span>
                <span>￥{{chargeBill.chargeBill.amountYuan}}</span>
              </li>
              <li class="text_align_left">
                <span>整单折扣：</span>
                <span>{{chargeBill.chargeBill.discount}}%</span>
              </li>
              <li class="text_align_left">
                <span>折后价：</span>
                <span>￥{{chargeBill.chargeBill.discountAmountYuan}}</span>
              </li>
            </ul>
            <ul class="title title_one sum">
              <li class="text_align_left">
                <span>应收：</span>
                <span>￥{{chargeBill.moneyYuan}}</span>
              </li>
              <li :class="{biglength: !!chargeBill.number}" class="text_align_left">
                <span>实收：</span>
                <span>￥{{chargeBill.chargeBill.receivedAmountYuan}}<i v-if="chargeBill.number">（补{{chargeBill.number}}单据欠费）</i></span>
              </li>
              <li v-if="Number(chargeBill.chargeBill.arrearsYuan) > 0" class="text_align_left">
                <span>欠费：</span>
                <span>￥{{chargeBill.chargeBill.arrearsYuan}}</span>
              </li>
            </ul>
          </div>
        </div>

        <ul class="footers">
          <li>
            <span>联系电话：{{currentinstitution.teleno}}</span>
          </li>
          <li>
            <span>地址：{{currentinstitution.addr}}</span>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import asideDialog from "@/components/workbench/asideDialog";
import { mapState } from "vuex";
import monment from "moment";
import {getCurrentClinic,getchargebillPrint} from '@/api'
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: { asideDialog },
  props: ['currentinstitution', 'chargeBill','patientsMsg'],
  data() {
    return {
      titleData: ["项目名称", "单位", "单价（元）", "数量", "金额（元）"],
      chargeBillItemList: [],
      payWayNamesStr: '',
      number: '',//原始单号
      moneyYuan: '0.00'
    };
  },
  methods: {
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>
<style lang="less" scoped>
#wrapper {
  align-items: center;
}
#printTest {
  padding: 0 30px;
  color: #000 !important;
  width: 550px !important;
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
      border: 1px solid #000;
      text-align: center;
      line-height: 24px;
      .df();
      p {
        width: 50%;
        .df();
        span {
          border-right: 1px solid #000;
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
    border-bottom: 1px solid #000;
  }
  .title {
    font-size: 13px;
    .df();
    li {
      width: 33.33%;
    }
    li:nth-child(1) {
      // width: 50%;
    }
    justify-content: left;
  }
}
.title_one {
  height: 30px;
  
  border-bottom: 1px solid #000;
}

.all_price {
  .df();
  line-height: 30px;
  li {
    text-align: left;
    padding-left: 20px;
    width: 50%;
  }
}
.footers {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  line-height: 18px;
  font-size: 12px;
  li {
    width: 50%;
  }
  li:nth-child(3) {
    width:100%;
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
  border-top: 1px solid #000;
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
}
.biglength {
  width: 66.66% !important;
}
.text_align_left {
  text-align: left;
}
</style>