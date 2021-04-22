<!--
 * @Descripttion: 退费详情列表
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-10 16:18:11
 -->
<template>
  <div class="register" id="registers">
    <aside-dialog :isShow="isShow" v-model="closeData" title="退费详情" width="900px">
      <div>
        <el-table
          height="500px"
          ref="singleTable"
          :data="tableDataList"
          empty="暂无内容"
          style="font-size: 14px"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
        >
          <el-table-column
            v-for="(item,index) in tabletitle "
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="item.ismoney">￥</span>{{scope.row[item.prop]}}
            </template>
          </el-table-column>

          <el-table-column label="需退数量" align="center" prop="itemNum">
            <template slot-scope="scope">
             <span>{{scope.row.itemNum}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="reason_box">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <span>退费原因</span>
                <span>{{approvalRemark}}</span>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <span>退费合计</span>
                  <span style="margin-left:10px; color:rgb(59, 120, 253);font-size:16px;">￥{{all}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </aside-dialog>
  </div>
</template>

<script>
// 申请退费
import asideDialog from "@/components/workbench/asideDialog";
import vuescroll from "vuescroll";
import { postRefundmoney } from "@/api";
export default {
  components: { asideDialog, vuescroll },
  props: ["isShow", "tableList", "all"],
  data() {
    return {
      approvalRemark: "",
      closeData: "",
      form: {},
      amount: "",
      allPrice: "0",
      checkArr: [],
      tableDataList: [],
      tabletitle: [
        {
          prop: "projectName",
          label: "项目名称"
        },
        {
          prop: "itemPriceYuan",
          label: "单价",
          ismoney: true
        },
        {
          prop: "itemNum",
          label: "数量"
        },
        {
          prop: "amountMoneyYuan",
          label: "折后应收",
          ismoney: true
        },
        {
          prop: "itemNum",
          label: "可退数量"
        },
      ]
    };
  },
  watch: {
    tableList(val) {
      let remark = this.tableList.chargeBill.approvalRemark
      this.tableDataList = this.tableList.chargeBillItemList.map(val => {
        val.amountMoneyYuan = Math.abs( val.amountMoneyYuan )
        return val
      })
      this.approvalRemark = remark ? remark : '无'
    }
  },
  computed: {},
  methods: {
    getOutPrice() {
      console.log(  this.tableList )
      let str = 0
      let discount = parseFloat(this.tableList.chargeBill.discount)/100
      this.tableList.chargeBillItemList.map( val => {
          str += parseFloat(val.amountMoney)
      })
      this.allPrice = str*discount
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
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
  padding-top: 20px;
  .df();
  .box_left {
    .df();
  }
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
#registers {
    /deep/.el-dialog {
    width: 1000px !important;
  }
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
