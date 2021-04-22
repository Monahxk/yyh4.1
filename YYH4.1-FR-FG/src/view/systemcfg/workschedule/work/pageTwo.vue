<template>
  <div class="wrapper">
    <div class="header">
      <div class="header_left">
        <span>当前营业时间:</span>
        <span>8:00 - 17:30</span>
        <span>编辑</span>
      </div>
      <div class="header_right">
        <span>新增班次</span>
      </div>
    </div>

    <div class="from_box">
      <el-table :data="tableData" :header-cell-style="{background:'#F7F9FF'}">
        <el-table-column
          v-for="(item,index) of tHaderData"
          :key="index"
          fixed
          align="center"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div>
              <div v-if="item.isTemp">
                <el-button type="text">编辑</el-button>
                <span class="line">|</span>
                <el-button type="text">删除</el-button>
              </div>
              <span v-else>{{scope.row[item.prop]}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_box">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        background
        layout="sizes, prev, pager, next, total"
        :total="1000"
      ></el-pagination></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      form: {},
      checkboxGroup4: "医生",
      cities: ["医生", "工作人员"],
      value3: "",
      tHaderData: [
        { prop: "a", label: "班次" },
        { prop: "b", label: "上班时间" },
        { prop: "e", label: "下班时间" },
        { prop: "e", label: "是否可约诊" },
        { prop: "h", label: "操作", isTemp: true }
      ],
      tableData: [
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        },
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        },
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        },
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        },
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        },
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        },
        {
          a: "华西耗材",
          b: "12313",
          c: "30",
          d: "交易时间",
          e: "年度",
          f: "$2000",
          g: "无"
        }
      ]};
  },
  watch: {},
  computed: {},
  methods: {},
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.pagination_box {
  height: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header {
  height: 70px;
  display: flex;
  padding: 0 20px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  .header_left {
    font-size: 16px;
    span {
      margin-right: 10px;
    }
    span:nth-child(1) {
      color: #4a4a4a;
    }
    span:nth-child(2) {
      color: #3b78fd;
    }
    span:nth-child(3) {
      cursor: pointer;
      padding: 3px 20px;
      border: 1px solid #3b78fd;
      color: #3b78fd;
    }
  }
  .header_right {
    span {
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      padding: 5px 20px;
      border: 1px solid #3b78fd;
      background-image: linear-gradient(97deg, #4d9eff, #3b78fd);
    }
  }
}
.from_box {
  margin-top: 20px;
  box-shadow: 0 0 6px 0 #e4e9ff;
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
</style>
