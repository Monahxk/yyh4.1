<!--
 * @Descripttion: 退费单详情
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-27 15:00:50
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-11 15:38:40
 -->
<template>
	<div class="content is-right">
		<div class="wrapper">
			<el-dialog
			title="退费详情"
			:visible.sync="dialog.isshow"
			width="900px"
			style="margin-top: 0;"
      class="dialog"
      @open="openDialog"
			>
        <div class="top-header">
          <el-row>
            <el-col :span="12">
              单号：<span class="t-color">{{chargeBill.number}}</span>
            </el-col>
            <el-col :span="12">
              关联收费单号：<span class="g-color">{{numberstr}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <header class="nav">
            <div class="left">退费明细</div>
          </header>
          <div class="total-box">
            <span>共<i class="item-total">{{tableList.length}}</i>项</span>
            <span>费用合计：<i class="fee-total">￥{{chargeBill.amountYuan}}</i></span>
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
          </el-table>
        </div>
        <div class="content">
          <header class="nav">
            <div class="left">退费详情</div>
          </header>
          <el-row>
            <el-col :span="24">
              退费方式：
              <template v-for="(item,index) in chargePaymentRecordList">
                <span :key="index" class="t-color">
                  ￥{{item.basePayAmountYuan}}/{{item.payWayName}}
                  <template v-if="item.type == 3">({{item.basePayAmountYuan}})</template>、
                </span>
              </template>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              退费原因：<span class="t-color">{{chargeBill.approvalRemark}}</span>
            </el-col>
          </el-row>
        </div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getRefundListDetail} from '@/api'
export default {
  name: 'refundDetail',
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
          label: '总数量',
        },
        // {
        //   prop: 'discountFlagText',
        //   label: '是否允许打折',
        // },
        // {
        //   prop: 'receivedAmountMoneyYuan',
        //   label: '折后应收',
        // },
        // {
        //   prop: 'itemRefundNum',
        //   label: '已退数量',
        // },
      ],
      chargeBill: {},
      chargePaymentRecordList: [],
      numberstr: '',//关联单据号
		}
  },
  computed: {
		tableStyleConfig() {
			return MESSAGE_TABLE_STYLE;
		}
	},
  mounted() {

  },
	methods: {
    openDialog() {
      getRefundListDetail(this.dialog.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.tableList = res.data.data.chargeBillItemList || [];
          this.chargeBill = res.data.data.chargeBill || {};
          this.chargePaymentRecordList = res.data.data.chargePaymentRecordList || [];
          let batchChargeBillList = res.data.data.batchChargeBillList || [];
          if(Array.isArray(batchChargeBillList)) {
            let str = '';
            batchChargeBillList.forEach(item => {
              str += !str ? item.number : ','+ item.number;
            })
            this.numberstr = str;
          }
        }
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
      }
      .t-color {
        color: #737B8D;
      }
      .g-color {
        color: #3B78FD;
      }
		}
	}

</style>
