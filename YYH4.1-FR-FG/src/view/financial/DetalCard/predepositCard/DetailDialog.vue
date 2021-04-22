<!--
 * @Descripttion: 预存卡，个人明细
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-28 10:11:01
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 14:32:03
 -->
<template>
	<div class="content is-right">
		<div class="wrapper">
			<el-dialog
			:title="dialog.dialogTitle"
			:visible.sync="dialog.isshow"
			width="900px"
			style="margin-top: 0;"
      class="dialog"
      @open="openDialog"
			>
        <div class="content">
          <el-table
          highlight-current-row
          ref="table"
          :data="tableList"
          :style="{'font-size': tableStyleConfig.font}"
          v-loading="tableLoading"
          height="100%"
          width="100%"
          :header-cell-style="{background:tableStyleConfig.headerCellStyle.background,color:tableStyleConfig.headerCellStyle.color}"
          >
            <template slot="empty">
              <div class="table-empty">
                <img src="../../../../assets/img/blank.png" alt>
              </div>
            </template>
            <template v-for="(item, index) of tableTitle">
            <el-table-column
              :key="index"
              :width="item.width"
              :label="item.label"
              :prop="item.prop"
              align="center"
              :formatter="item.formatter"
            ></el-table-column>
            </template>
          </el-table>
        </div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {MESSAGE_TABLE_STYLE,PAGE_SIZE,SYSTEM_HTTP_SUCCESS} from '@/constant'
import {getConsumeFlow} from '@/api'
export default {
  name: 'predepositCardDetailDialog',
	components: {
	},
  props: ['dialog'],
	data() {
		return {
      tableLoading: false,
      tableList: [],
      tableTitle: [
        {
          prop: 'rechargeTime',
          label: '日期',
          formatter: function(row, column, cellValue) {
            return util.dateFormat(cellValue,'yyyy-MM-dd hh:mm')
          }
        },
        {
          prop: 'flowMoneyYuan',
          label: '金额',
          formatter: function(row, column, cellValue) {
            return '￥' + cellValue;
          }
        },
        // {
        //   prop: 'type',
        //   label: '交易类型',
        // },
        {
          prop: 'payWayName',
          label: '支付方式',
        },
        {
          prop: 'createEmployee.name',
          label: '经办人',
        },
        {
          prop: 'remark',
          label: '备注',
        },
      ]
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
      getConsumeFlow(this.dialog.id).then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          let dataArry = res.data.data || [];
          dataArry.map((item => {
            item.type == '0' ? '充值' : '消费';
          }))
          this.tableList = dataArry;
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

      .el-dialog__body {
        padding-top: 0;
      }

      .content {
        height: 100%;
        margin-bottom: 0 !important;
        .el-table  {
          height: 100% !important;
        }
      }
		}
	}

</style>
