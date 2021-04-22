<template>
  <div class="wrapper" id="addPage">
    <el-dialog title="退货" @open="handleInitFn" :visible.sync="dialogVisible.isShow" width="1000px">
      <div class="content">
        <div class="header">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="退货日期">
                  <el-date-picker
                    v-model="form.returnTime"
                    type="datetime"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="退货人">
                  <el-select v-model="form.userId" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注">
                  <el-input v-model="form.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- content -->
        <div class="el_table">
          <el-table
            ref="singleTable"
            :data="tableDataList"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <template slot="empty">
              <p>
                <span>暂无内容</span>
              </p>
            </template>

            <el-table-column
              v-for="(item,index) in tabletitle "
              :key="index"
              height="100%"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
              <template slot-scope="scope">
                <span
                  v-if="item.prop != 'retCount'"
                  v-show="item.prop !='retPrice'"
                >{{scope.row[item.prop]}}</span>
                <el-input
                  type="number"
                  v-if="item.prop == 'retCount'"
                  v-model="scope.row.retCount"
                  placeholder="请输入退货数"
                  @change="handleMeth(scope.row)"
                ></el-input>
                <el-input
                  v-if="item.prop == 'retPrice'"
                  v-model="scope.row.retPrice"
                  placeholder="请输入退货单价"
                  @change="handleMeth(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="footer_main">
          <div class="txt">
            <!-- <span>
              退货总数
              <i>{{amount}}</i>
            </span>
            <span>
              退货总金额￥
              <i>{{totalPrice}}</i>
            </span> -->
          </div>
          <div>
            <el-button @click="dialogVisible.isShow = false">取 消</el-button>
            <el-button type="primary" @click="sendDataFn">确 定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getReturnarticle, exportClinicuser, sendReturnArticle } from "@/api";
import { version } from "moment";
export default {
  components: {},
  props: ["dialogVisible"],
  data() {
    return {
      form: {
        returnTime: "",
        userId: "",
        putId: "",
        remark: ""
      },
      totalPrice: "",
      amount: "",
      valTime: "",
      value: "",
      tableDataList: [],
      tabletitle: [
        {
          prop: "drugName",
          label: "物品名称"
        },
        {
          prop: "drugBrand",
          label: "品牌"
        },
        {
          prop: "drugSpec",
          label: "规格"
        },
        {
          prop: "unitName",
          label: "单位"
        },
        {
          prop: "price",
          label: "入库单价"
        },
        {
          prop: "surplusNumber",
          label: "剩余数量"
        },
        {
          prop: "retCount",
          label: "退货数量"
        },
        {
          prop: "retPrice",
          label: "退货单价"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleMeth(val) {
      // amount 总数
      // totalPrice 总金额
      let mount = "";
      let price = "";
      if (val.retCount > val.surplusNumber) {
        this.$message.error("退货数不能大于库存数");
        val.retCount = "";
        return;
      }

      if (val.retCount <= 0) {
        this.$message.error("退货数存在问题，请重新输入");
        val.retCount = "";
        return;
      }

      if (val.retPrice && val.retPrice <= 0) {
        this.$message.error("退货单价不能为0");
        val.retPrice = "";
        return;
      }

      this.tableDataList.map(val => {
        if (val.retPrice && val.retCount) {
          mount = mount + parseInt(val.retCount)
          price += parseInt(val.retPrice)
        }
      });

      this.amount = mount;
      this.totalPrice = price;
    },
    sendDataFn() {
      let arr = [];
      if (!this.form.userId) {
        this.$message.error("请选择退货人");
        return;
      }
      this.tableDataList.map(val => {
        let _is = val.retCount * val.retPrice;
        if (_is == 0 && val.retCount && val.retPrice) {
          this.$message.error(",请填写完整");
          return;
        }

        if (val.surplusNumber < val.retCount) {
          this.$message.error("错了,退货数不能大于剩余数量");
          return;
        }

        if (val.retCount && val.retPrice) {
          arr.push({
            piriId: val.piriId,
            drugId: val.drugDict.id,
            retCount: val.retCount,
            retPrice: val.retPrice,
            retTotalPrice: val.retCount * val.retPrice
          });
        }
      });
      if (arr.length) {
        this.form.drriList = arr;
        console.log(this.form);
        sendReturnArticle(this.form).then(res => {
          if (!res.data.success) {
            this.$message.error("存在存错，请联系管理员");
          } else {
            this.dialogVisible.isShow = false;
            this.$message("退货成功");
          }
        });
      }
    },
    handleInitFn() {
      console.log(this.dialogVisible);
      this.getReturnarticleFn();
      this.exportClinicuserFn();
    },
    getReturnarticleFn() {
      getReturnarticle(this.dialogVisible.id).then(res => {
        console.log(res);
        this.amount = res.data.amount;
        this.totalPrice = res.data.totalPrice;
        this.form.putId = res.data.id;
        this.tableDataList = res.data.pIList.map(v => {
          v.drugName = v.drugDict.drugName;
          v.drugBrand = v.drugDict.drugBrand.brandName;
          v.drugSpec = v.drugDict.drugSpec;
          v.unitName = v.drugDict.drugUnitsDict.unitName;
          v.retCount = "";
          v.retPrice = "";
          return v;
        });
      });
    },
    exportClinicuserFn() {
      exportClinicuser(this.dialogVisible.id).then(res => {
        this.options = res.data;
      });
    }
  },
  mixins() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.footer_main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .txt span {
    margin-right: 20px;
    i {
      padding: 10px;
    }
  }
}
.header {
  padding: 20px 0;
}
</style>
<style>
#addPage .el-dialog__header {
  border-bottom: 1px solid #ccc;
}
#addPage .el-dialog__body {
  padding-top: 0;
}
</style>