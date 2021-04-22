<!--
 * @Descripttion: 新增盘点表单，组件
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:22:46
 -->
<template> 
  <div class="wrapper register" id="add_dialog">
    <el-dialog title="新增盘点" :visible.sync="isShow.show" width="1200px" 
        @closed="closeDialogFn">
      <el-dialog
        class="content_dialog"
        width="900px"
        title="选择物品"
        :visible.sync="innerVisible"
        @open="geTarticlecfgFn"
        append-to-body
      >
        <div class="add_dialog">
          <div class="add_content">
            <div class="add_left_box">
              <h3>选择物品</h3>
              <ul class="nav_tab">
                <li
                  :class="{active:isActiveIndex == index}"
                  v-for="(item, index) of navData"
                  :key="index"
                  @click="handleIndex(item,index)"
                >
                  <span>{{item.goodstypeName}}</span>
                </li>
              </ul>
            </div>
            <div class="add_right_box">
              <div class="add_right_select">
                <el-input style="width:500px;" v-model="searchValue"></el-input>
                <el-button type="primary" @click="sendSearchFn">查询</el-button>
              </div>
              <ul class="add_right_header">
                <li v-for="(item,index) in titleData" :key="index">
                  <span>{{item}}</span>
                </li>
              </ul>
              <ul
                class="add_right_content"
                v-for="(item, index) of drugDataList"
                :key="index"
                @click="sendParentData(item)"
              >
                <li>
                  <span>{{item.drugName}}</span>
                </li>
                <li>
                  <span>{{item.drugSpec}}</span>
                </li>
                <li>
                  <span>{{item.unitName}}</span>
                  <!-- <span>{{item.name}}</span> -->
                </li>
                <li>
                  <!-- <span>{{item.unitName}}</span> -->
                </li>
              </ul>
              <div v-show="!drugDataList.length" class="txt">
                <span>暂无数据</span>
              </div>
              <div class="page_box" v-show="drugDataList.length">
                <el-pagination layout="prev, pager, next" :total="total"></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <div>
        <div class="header">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="盘点日期">
              <el-date-picker
                v-model="timeValue"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <!-- <el-input></el-input> -->
            </el-form-item>
            <el-form-item label>
              <ul class="btns">
                <li>
                  <span @click="innerVisible=!innerVisible">选择物品</span>
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </div>

        <div class="add_reg">
          <el-table
            :header-cell-style="{background:'#F7F9FF'}"
            :data="tableData"
            style="width: 100%;"
            max-height="580"
          >
            <el-table-column
              fixed
              align="center"
              :prop="item.prop"
              :label="item.label"
              v-for="(item,index) in tableHeader"
              :key="index"
            >
              <template slot-scope="scope">
                <div>
                  <span v-if="item.prop !== 'f'">{{scope.row[item.prop]}}</span>
                  <div v-if="item.prop == 'f'">
                    <el-input-number
                      style="width:130px;"
                      v-model="scope.row.currentNumber"
                      @change="handleChange(scope.row)"
                      label="描述文字"
                    ></el-input-number>
                  </div>
                  <div v-if="item.isTemp">
                    <el-button type="text" @click="remarkFn(scope.row)">备注</el-button>
                    <el-button type="text" @click="delateDataFn(scope.row.id)">删除</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="tool_wrap">
          <li>
            <span class>类型总数：</span>
            <span class="blues">{{tableData.length}}</span>
          </li>
          <li>
            <span class>金额</span>
            <span class="blues">￥ {{allPrice}}</span>
          </li>
        </ul>
        <ul class="btns_wrap">
          <li class="actives item" @click="saveFn">
            <span>保存</span>
          </li>
          <li class="item" @click="isShow.show = !isShow.show">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { geTarticlecfg, getInventory, SavecheckInventory } from "@/api";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      // 全部数据
      allDataList: [],
      // 选择物品 当行
      navData: [],
      // 选择物品 当行 index
      isActiveIndex: 0,
      // 物品列表
      drugDataList: [],
      // 全部数量
      allAmount: 0,
      // 全部金额
      allPrice: 0,
      // 当前增减值
      currentNumber: 0,
      total: 0,
      searchValue: null,
      titleData: ["物品名称", "规格", "单位"],
      innerVisible: false,
      num: 0,
      form: {},
      timeValue: "",
      tableHeader: [
        { prop: "drugName", label: "名称" },
        { prop: "quantity", label: "当前库存" },
        { prop: "drugSpec", label: "规格" },
        { prop: "unitName", label: "单位" },
        { prop: "f", label: "盈亏数量" },
        { prop: "rowPrice", label: "金额" },
        { prop: "h", label: "操作", isTemp: true }
      ],
      tableData: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    closeDialogFn() {
      this.tableData = []
    },
    handleChange(val) {
      val.rowPrice = (val.quantity + val.currentNumber) * val.retailPrice;
      this.getAllNum();
    },
    handleIndex(v, i) {
      this.getInventoryFn(v);
      this.isActiveIndex = i;
    },
    tipsMsg(val, lib) {
      this.$message({
        message: val,
        type: lib
      });
    },
    remarkFn(scope) {
      this.$prompt("请输入备注", "备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: scope.remark
      })
        .then(({ value }) => {
          scope.remark = value;
          this.$message({
            type: "success",
            message: "备注添加成功"
          });
        })
        .catch(() => {});
    },
    sendParentData(val) {
      if (this.isRepeat(val)) {
        this.tipsMsg("警告，当前物品已存在无法添加", "warning");
      } else {
        this.handleCurrent(val);
      }
    },
    handleCurrent(val) {
      val.rowPrice = (val.quantity + val.currentNumber) * val.retailPrice;
      this.tableData.push(val);
      this.getAllNum();
      this.tipsMsg("成功，当前物品已经添加", "success");
    },
    delateDataFn(id) {
      this.tableData = this.tableData.filter(item => item.id != id);
      this.getAllNum();
    },
    saveFn() {
      if (!this.tableData.length) {
        this.tipsMsg("警告，请先添加物品", "warning");
      } else {
        let obj = {
          checkTime:this.timeValue,
          drugNum: this.tableData.length,
          totalPrice: this.allPrice,
          cIList: []
        }
        this.tableData.map(item => {
          obj.cIList.push({
            drugInventoryId: item.invid,
            drugDictId: item.id,
            profitLossNum: item.currentNumber,
            count: item.quantity,
            price: item.rowPrice,
            finalNum:item.quantity + item.currentNumber,
            remark: item.remark
          })
        })
        console.log(obj)
        SavecheckInventory(obj).then(res => {
          this.isShow.show = !this.isShow.show
          this.tipsMsg("成功，新增库存盘点成功", "success");
          this.$emit('successFn')
        })
      }
    },
    isRepeat(val) {
      let isOff = false;
      this.tableData.map(item => {
        if (item.id == val.id) {
          isOff = true;
        }
      });
      return isOff;
    },
    getAllNum() {
      let amount = 0;
      let price = 0;
      this.tableData.map(v => {
        amount += v.quantity + v.currentNumber;
        price += (v.quantity + v.currentNumber) * v.retailPrice;
      });
      this.allAmount = amount;
      this.allPrice = price;
    },
    sendSearchFn() {
      if (this.navData.length) {
        let data = this.navData[this.isActiveIndex];
        this.getInventoryFn(data, this.searchValue);
      }
    },
    getInventoryFn(data, val) {
      getInventory(data, val).then(res => {
        console.log( res )
        if (res.data.code === 200) {
          let _D = res.data.data;
          this.drugDataList = [];
          this.total = res.data.totalNumber;
          _D.map(v => {
            this.drugDataList.push({
              drugName: v.drugDict.drugName, // 物品名称
              drugSpec: v.drugDict.drugSpec, // 规格
              // name: v.drugDict.drugProvider.clinic.name, // 供应商
              unitName: v.drugDict.drugUnitsDict.unitName, // 单位
              quantity: parseInt(v.quantity), // 当前库存
              retailPrice: parseInt(v.retailPrice), // 金额
              remark: "", // 备注
              id: v.drugDict.id, // 物品 id
              currentNumber: 0,
              invid: v.id // 货存 id
            })
          })
        }
      })
    },
    geTarticlecfgFn() {
      this.isActiveIndex = 0;
      geTarticlecfg().then(res => {
        this.navData = res.data;
        this.navData.unshift({
          goodstypeName: '全部',
          id: ''
        })
        let [data] = res.data;
        this.getInventoryFn(data);
      });
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.page_box {
  display: flex;
  justify-content: flex-end;
}
.txt {
  padding: 50px;
  text-align: center;
}
.content_dialog .add_content {
  display: flex;
  justify-content: space-between;
  .add_right_box {
    padding-left: 20px;
    flex: 2;
    .add_right_select {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .add_right_header {
      padding: 0 10px;
      height: 55px;
      background: #e4e9ff;
      display: flex;
      align-items: center;
      text-align: left;
      li {
        width: 25%;
      }
    }
    .add_right_content {
      cursor: pointer;
      padding: 0 10px;
      display: flex;
      li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 40px;
        line-height: 40px;
        width: 25%;
        border-bottom: 1px solid #eee;
      }
    }
  }
  .add_left_box {
    width: 220px;
    height: 600px;
    h3 {
      padding: 20px;
    }
  }
  .nav_tab {
    height: 100%;
    box-shadow: 0 0 6px 0 #e4e9ff;
    border: 1px solid #eee;
    li {
      cursor: pointer;
      padding: 20px;
    }
    .active {
      color: #fff;
      background: #3b78fd;
    }
  }
}
.wrapper {
  .blue {
    cursor: pointer;
    color: #3b78fd;
  }
  .form_box {
    padding-top: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    border-top: 1px solid #eee;
    .btns {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 36px;
      li {
        cursor: pointer;
        width: 100px;
        height: 36px;
        margin-left: 20px;
        color: #3b78fd;
        border: 1px solid #3b78fd;
      }
      li:nth-child(1) {
        color: #fff;
        background: #3b78fd;
      }
    }
  }
  .content_user {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .user_msg {
      display: flex;
      li {
        margin-right: 30px;
      }
    }
  }
  .add_reg {
    height: 400px;
    padding: 0 20px;
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    .btns_wrap {
      display: flex;
      justify-content: flex-end;
      text-align: center;
      line-height: 32px;
      .item {
        cursor: pointer;
        color: #3b78fd;
        width: 88px;
        height: 32px;
        border: 1px solid #3b78fd;
        margin-right: 20px;
      }
      .actives {
        color: #fff;
        background-image: linear-gradient(
          110deg,
          #4d9eff,
          #3c79fd 99%,
          #3b78fd
        );
      }
    }
  }
}
.blues {
  font-size: 20px;
  color: #3b78fd;
  margin-right: 20px;
}
.tool_wrap {
  display: flex;
  font-size: 16px;
}
</style>
<style>
.register .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
#add_dialog .el-form {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-content: center;
}
#add_dialog .el-form .el-form-item {
  margin: 0;
}
</style>
<style>
.content_dialog {
  display: flex;
  justify-content: flex-end;
}
.content_dialog .el-dialog {
  margin: 0 !important;
}

.content_dialog .el-dialog__header {
  border-bottom: 1px solid #eee !important;
}
</style>
