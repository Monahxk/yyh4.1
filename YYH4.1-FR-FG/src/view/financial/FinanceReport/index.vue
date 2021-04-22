<template>
  <div class="wrapper">
    <div class="headers">
      <div
        class="nav_item"
        :class="{active: isMaxActive === index}"
        v-for="(item, index) of navListData"
        :key="index"
      >
        <span class="title" @click="handleNavFn(index)">{{item.title}}</span>
        <ul class="nav_main">
          <li
            :class="{active_checked: n === isSmallActive}"
            v-for="(item,n) of item.data"
            @click="handleChildFn(n)"
            :key="n"
          >
            <span>{{item}}</span>
          </li>
        </ul>
        <div class="line" v-show="index !== navListData.length-1">
          <span>|</span>
        </div>
      </div>
    </div>

    <div class="optios">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row type="flex" justify="start" :gutter="50">
          <el-col :span="8">
            <el-form-item label="采购日期">
              <el-date-picker
                v-model="vtime"
                style="width:100%"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5" v-if="isMaxActive !== 3">
            <el-form-item label="入库单号">
              <el-input v-model="params.number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="物品"
              v-show="isSmallActive !== 0 || isMaxActive == 2 || isMaxActive ==3"
            >
              <el-select v-model="params.drugId" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(item,index) in DrugsArr"
                  :key="index"
                  :label="item.drugName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="2" :push="0">
            <el-form-item>
              <div class="btns other">
                <!-- <span>导出Excel</span> -->
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" :gutter="50">
          <!-- <el-col :span="5" v-show="isSmallActive !== 0">
            <el-form-item label="供应商">
              <el-select v-model="form.region" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="5">
            <el-form-item label="库管员" v-show="isMaxActive !== 2 && isMaxActive !== 3 ">
              <el-select v-model="params.createById" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(item,index) in createByIdArr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="2" :push="10">
            <el-form-item>
              <div @click="handelSearch" class="btns">
                <span>查询</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table_box">
      <el-table
        :header-cell-style="{background:'#F7F9FF'}"
        :data="tableData"
        style="width: 100%;height:500px;"
        max-height="500"
      >
        <el-table-column
          fixed
          align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in tableHeader"
          :key="index"
        ></el-table-column>
      </el-table>

      <div class="pagination_box">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          :page-sizes="[10, 20, 30, 40]"
          layout="sizes, prev, pager, next, total"
          :total="total"
          @size-change="handleSizeFn"
          @current-change="handleCurrent"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAllTotalList,
  getAllTotalSel,
  getDetialTotalList,
  getDetialTotalSel,
  getAllOutBoundList,
  getAllOutBoundSel,
  getDetialOutBoundList,
  getDetialOutBoundSel,
  getDruginventoryList,
  getDruginventorySel,
  getCheckinventoryList,
  getCheckinventorySel,

  getCreateById,
  getRecord,
  getDrugs,
  getOutRecord,
  getOutSummary,
  getAllRecord,
  getTwoUser,
  getAllRecordItem,
  getAllRecordItemUser,
  getAllInventory,
  getAllcheckinventory
} from "@/api";
import sse from "sessionstorage";
import monment from "moment";
export default {
  components: {},
  props: {},
  data() {
    return {
      params: {
        startTime: '',
        endTime: '',
        number: '',
        createById: '',
        page: 1,
        pageSize: 10,
        drugId: ''
      },
      userId: {
        createById: "",
      },
      vtime: [],
      total: 1,
      isMaxActive: 0,
      isSmallActive: 0,
      TotalList: [],
      createByIdArr: [],
      DrugsArr: [],
      id: "",
      drugs: "",
      loading: "",
      startTime: "",
      endTime: "",
      number: "",
      page: 1,
      pageSize: 10,
      navListData: [
        {
          title: "采购报表",
          data: ["汇总", "明细"]
        },
        {
          title: "出库报表",
          data: ["汇总", "明细"]
        },
        {
          title: "货物余额表",
          data: []
        },
        {
          title: "盘点表",
          data: []
        }
      ],
      value4: null,
      form: {},
      tabData: ["汇总", "明细"],
      isActive: 0,
      tableHeader: [],
      TotalHeader: [
        { prop: "number", label: "单号" },
        { prop: "priceYuan", label: "总金额" },
        { prop: "amount", label: "入库数量" },
        { prop: "commitTime", label: "采购日期" },
        { prop: "clinicUser.name", label: "库管员" }
      ],
      recordHeader: [
        { prop: "drugDict.drugName", label: "物品" },
        { prop: "importInventoryRecord.commitTime", label: "采购日期" },
        { prop: "importInventoryRecord.number", label: "入库单号" },
        { prop: "importInventoryRecord.drugProvider.suppliersName", label: "供应商" },
        { prop: "putCount", label: "入库数量" },
        { prop: "priceYuan", label: "入库价" },
        { prop: "totalPriceYuan", label: "总金额" },
        { prop: "importInventoryRecord.clinicUser.name", label: "库管员" }
      ],
      outBoundList: [
        { prop: "number", label: "单号" },
        { prop: "priceYuan", label: "总金额" },
        { prop: "amount", label: "出库数量" },
        { prop: "commitTime", label: "采购日期" },
        { prop: "clinicUser.name", label: "库管员" }
      ],
      outBoundDetial: [
        { prop: "drugDict.drugName", label: "物品" },
        { prop: "exportInventoryRecord.commitTime", label: "采购日期" },
        { prop: "exportInventoryRecord.number", label: "入库单号" },
        { prop: "getCount", label: "入库数量" },
        { prop: "priceYuan", label: "入库价" },
        { prop: "totalPriceYuan", label: "总金额" },
        { prop: "exportInventoryRecord.clinicUser.name", label: "库管员" }
      ],
      recordHeader3: [
        { prop: "drugCode", label: "物品编号" },
        { prop: "lastPriceYuan", label: "最近进价" },
        { prop: "retailPriceYuan", label: "平均价格" },
        { prop: "salePriceYuan", label: "销售指导价" },
        { prop: "quantity", label: "数量" }
      ],
      recordHeader4: [
        { prop: "drugDict.drugName", label: "物品名称" },
        { prop: "profitLossNum", label: "盈亏数" },
        { prop: "count", label: "库存数" },
        { prop: "finalNum", label: "盘点数量" },
        { prop: "priceYuan", label: "金额" },
        { prop: "drugDict.clinic.name", label: "诊所" },
        { prop: "remark", label: "备注" }
      ],
      tableData: []
    };
  },
  created() {
    this.userId.createById = sse.getItem("userId")
    this._initAllTotalList()
  },
  watch: {
    isMaxActive() {
      this.resetParams()
      this.initTable()
    },
    isSmallActive(){
      this.resetParams()
      this.initTable()
    }
  },
  computed: {},
  methods: {
    resetParams() {
      this.createByIdArr = []
      this.grugList = []
      Object.keys(this.params).forEach(key => {
        this.params[key] = ''
        if(key == "page") this.params.page = 1
        if(key == "pageSize") this.params.pageSize = 10
      })
    },

    // 采购报表 - 汇总 
    _initAllTotalList() {
      this.tableHeader = this.TotalHeader
      getAllTotalList(this.params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalPage
      })
      getAllTotalSel(this.userId).then(res => {
        this.createByIdArr = res.data.data.clinicUserList
      })
    },
    
    // 采购报表 - 明细
    _initDetialTotalList() {
      this.tableHeader = this.recordHeader
      getDetialTotalList(this.params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalPage
      })
      getDetialTotalSel(this.userId).then(res => {
       let {grugList, clinicUserList} = res.data.data;
        this.createByIdArr = clinicUserList
        this.DrugsArr = grugList
      })
    },
    
    // 出库报表 - 汇总
    _initAllOutBoundList(){
      this.tableHeader = this.outBoundList
      getAllOutBoundList(this.params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalPage
      })
      getAllOutBoundSel(this.userId).then(res => {
        this.createByIdArr = res.data.data.clinicUserList
      })
    },

    // 出库报表 - 明细
    _initDetialOutBoundList(){
      this.tableHeader = this.outBoundDetial
      getDetialOutBoundList(this.params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalPage
      })
      getDetialOutBoundSel(this.userId).then(res => {
       let {grugList, clinicUserList} = res.data.data;
        this.createByIdArr = clinicUserList
        this.DrugsArr = grugList
      })
    },

    // 货物余额表
    _initDruginventoryList() {
      this.tableHeader = this.recordHeader3
      getDruginventoryList(this.params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalPage
      })
      getDruginventorySel(this.userId).then(res => {
        this.DrugsArr = res.data.data.drugList
      })
    },

    // 盘点表
    _initCheckinventoryList() {
      this.tableHeader = this.recordHeader4
      getCheckinventoryList(this.params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalPage
      })
      getCheckinventorySel(this.userId).then(res => {
        this.DrugsArr = res.data.data.drugList
      })
    },
    
    // 搜索
    handelSearch() {
      if (this.vtime) {
        let [start, end] = this.vtime
        this.params.startTime = start
        this.params.endTime = end
      } else {
        this.params.startTime = ""
        this.params.endTime = ""
      }
      this.initTable()
    },

    // 执行函数
    initTable() {
      if (this.isMaxActive == 0 && this.isSmallActive == 0) this._initAllTotalList()
      if (this.isMaxActive == 0 && this.isSmallActive == 1) this._initDetialTotalList()
      if (this.isMaxActive == 1 && this.isSmallActive == 0) this._initAllOutBoundList()
      if (this.isMaxActive == 1 && this.isSmallActive == 1) this._initDetialOutBoundList()
      if (this.isMaxActive == 2) this._initDruginventoryList()
      if (this.isMaxActive == 3) this._initCheckinventoryList()
    },

    handleSizeFn(val) {
      this.params.pageSize = val;
      this.initTable()
    },

    handleCurrent(val) {
      this.params.page = val;
      this.initTable()
    },

    // big Nav change
    handleNavFn(num) {
      this.isMaxActive = num;
      this.isSmallActive = 0;
    },

    handleChildFn(num) {
      this.isSmallActive = num;
    }

  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrapper {
  .headers {
    height: 48px;
    display: flex;
    margin-bottom: 20px;
    align-items: center;
  }
  .active span,
  .active li {
    color: #493bfd !important;
  }
  .active .nav_main {
    width: auto;
    transition: all 0.1s easy;
  }
  .optios {
    padding-top: 20px;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #ffffff;
  }
  .btns {
    span {
      cursor: pointer;
      color: #fff;
      line-height: 40px;
      text-align: center;
      display: block;
      width: 150px;
      height: 40px;
      border-radius: 20px;
      box-shadow: 0 1px 4px 0 #b9cdf9;
      background-image: linear-gradient(to right, #4d9eff, #3b78fd);
    }
  }
  .table_box {
    margin-top: 30px;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #fff;
  }
  .pagination_box {
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .other {
    span {
      color: #3b78fd;
      border: 1px solid #e4e9ff;
      background: #fff;
    }
  }
}

.nav_item {
  display: flex;
  align-items: center;
  .title {
    cursor: pointer;
    font-size: 18px;
  }
  .nav_main {
    display: flex;
    font-size: 14px;
    overflow: hidden;
    margin-left: 20px;
    transition: all 1s;
    width: 0;
    li {
      line-height: 20px;
      cursor: pointer;
      margin-right: 20px;
    }
  }
  .active_checked {
    border-bottom: 2px solid #7874f2;
  }
}
.active span,
.active li {
  color: #493bfd !important;
}
.active .nav_main {
  width: auto;
  transition: all 0.1s easy;
}
.line {
  padding-right: 20px;
}

.active_checked {
  border-bottom: 2px solid #7874f2;
}
</style>
<style>
.pagination_box .el-pagination span {
  color: #4d9eff;
}
.pagination_box .el-input__inner {
  color: #4d9eff;
  border: 1px solid #4d9eff;
}
.pagination_box .el-select .el-input .el-select__carett {
  color: #4d9eff !important;
}
.pagination_box .number {
  color: #4d9eff !important;
  background: #fff !important;
  border: 1px solid #4d9eff !important ;
}
.pagination_box .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  color: #4d9eff !important;
}
.pagination_box
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  color: #fff !important;
  background: #4d9eff !important;
  border: none;
}
.pagination_box .btn-next,
.pagination_box .btn-prev {
  border: 1px solid #4d9eff;
  padding: 0 10px !important;
  background: #fff !important;
}

.has-gutter .gutter {
  background: rgb(247, 249, 255);
}
</style>
