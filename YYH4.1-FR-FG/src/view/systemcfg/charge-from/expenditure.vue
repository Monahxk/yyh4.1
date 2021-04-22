<template>
  <div class="wrapper">
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

    <div class="pagination_box">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        background
        layout="sizes, prev, pager, next, total"
        :total="1000"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      tHaderData: [
        { prop: "a", label: "收支账户" },
        { prop: "b", label: "收支账号" },
        { prop: "e", label: "备注" },
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
      ]
    };
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
