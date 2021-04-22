<!--
 * @Descripttion: 收费详情
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-27 15:00:50
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-11 14:16:27
 -->
<template>
	<div class="content is-right">
		<div class="wrapper">
			<el-dialog
			title="收费详情"
			:visible.sync="dialog.isshow"
			width="900px"
			style="margin-top: 0;"
      class="dialog"
      @open="openDialog"
			>
        <div class="top-header">
          <el-row>
            <el-col :span="12">
              单号：{{chargeBill.number}}
            </el-col>
            <el-col :span="12">
              整单折扣：{{chargeBill.discount}}
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="24">
              应收：<i class="money-c">￥{{chargeBill.discountAmountYuan}}</i>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <header class="nav">
            <div class="left">收费明细</div>
          </header>
          <div class="total-box">
            <span>共<i class="item-total">{{tableList.length}}</i>项</span>
            <span>费用合计：<i class="fee-total">￥{{getAllPrice}}</i></span>
          </div>
          <el-table
          highlight-current-row
          ref="table"
          :data="tableList"
          :style="{'font-size': tableStyleConfig.font}"
          v-loading="tableLoading"
          height="300px"
          width="100%"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
          >
            <template slot="empty">
              <div class="table-empty">
                <img src="../../assets/img/blank.png" alt>
              </div>
            </template>
            <template v-for="(item, index) of tableTitle">
              <el-table-column
                v-if="item.ismoney"
                :key="index"
                :width="item.width"
                :label="item.label"
                :prop="item.prop"
                align="center"
              >
                <template slot-scope="scope">
                  <span>￥{{scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="index"
                :width="item.width"
                :label="item.label"
                :prop="item.prop"
                align="center"
              ></el-table-column>
            </template>
            <el-table-column prop="discountFlag" label="是否允许打折" align="center">
              <template slot-scope="scope">
                <span>{{parseInt(scope.row.discountFlag)? '无折扣' : '折扣'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amountMoneyYuan" label="金额" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="content">
          <header class="nav">
            <div class="left">支付详情</div>
          </header>
          <el-row>
            <el-col :span="24">
              支付方式：
              <template v-for="(item,index) in chargePaymentRecordList">
                <span :key="index">
                  ￥{{item.payMoneyYuan}}/{{item.payWayName}}
                  <template v-if="item.type == 3">({{item.basePayAmountYuan}})</template>、
                </span>
              </template>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              合计实收：<i class="money-c">￥{{chargeBill.receivedAmountYuan}}</i>
            </el-col>
            <el-col :span="12" v-if="chargeBill.specialVisit == '1'">
              特诊
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <header class="nav">
            <div class="left">操作详情</div>
          </header>
          <el-row>
            <el-col :span="12">
              收费日期：{{chargeBill.chargeTime}}
            </el-col>
            <el-col :span="12">
              就诊日期：：{{chargeBill.visitTime}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              医生：{{chargeBill.doctor ? chargeBill.doctor.name : ''}}
            </el-col>
            <el-col :span="12">
              护士：{{chargeBill.nurse ? chargeBill.nurse.name : ''}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              绩效分配：
              <template v-for="(item,index) in performanceAllotList">
                <span :key="index">{{item.itemName}}({{item.doctor.name}},{{item.nurse.name}})、</span>
              </template>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              备注：{{chargeBill.remark}}
            </el-col>
          </el-row>
        </div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getChargeitem} from '@/api'
export default {
  name: 'chargeDetail',
	components: {
	},
  props: ['dialog'],
	data() {
		return {
      tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'projectName',
          label: '项目名称',
        },
        {
          prop: 'itemUnit',
          label: '单位',
        },
        {
          prop: 'itemPriceYuan',
          label: '单价',
        },
        {
          prop: 'itemNum',
          label: '数量',
        },
      ],
      chargeBill: {},
      chargePaymentRecordList: [],
      performanceAllotList: []
		}
  },
  computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
    },
    getAllPrice() {
      let allPrice = 0;
      this.tableList.map(val => {
        allPrice +=  Number(val.amountMoneyYuan);
      })
      return allPrice;
    }
	},
  mounted() {

  },
	methods: {
    openDialog() {
      this.tableLoading = true;
      getChargeitem(this.dialog.id).then(res => {
        this.tableLoading = false;
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let {chargeBill,chargeBillItemList,chargePaymentRecordList} = res.data.data;
          this.chargeBill = chargeBill || {};
          this.tableList = chargeBillItemList || [];
          this.chargePaymentRecordList = chargePaymentRecordList;
        }
      }).catch(err => {
        this.tableLoading = false;
      });
    }
	}
}
</script>
<style lang="less" scoped>
	.wrapper {
    color: #1B1E25;

		/deep/.el-dialog {
      .el-row {
        margin-bottom: 15px;
      }
      .top-header {
        padding: 15px 24px 0 24px;
      }

      .el-dialog__body {
        padding-top: 0;
      }

      .content {
        height: auto;
        border: 1px solid #DFE7F0;
        background-color: #fff;
        padding: 20px;
        border-radius:2px;
        margin-bottom: 15px;

        .total-box {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .fee-total,.item-total {
            color: #3B78FD;
          }
          .item-total {
            padding: 0 5px;
          }
        }
        .money-c {
          color: #7ED321;
        }
      }
		}
	}

</style>
