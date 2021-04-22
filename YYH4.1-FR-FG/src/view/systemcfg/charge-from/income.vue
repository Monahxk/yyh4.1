<template>
  <div class="wrapper">
      <el-table
            highlight-current-row
            ref="singleTable"
            :data="list"
            style="font-size: 14px"
            :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          >
            <el-table-column prop="name" label="收费方式" sortable align="center"></el-table-column>
            <el-table-column prop="account.name" label="默认收支账户" sortable  align="center"></el-table-column>
            <el-table-column prop="account.accountNumber" label="收支帐号" sortable  align="center"></el-table-column>
            <el-table-column prop="account.remark" label="充植卡" sortable  align="center"></el-table-column>
            <el-table-column prop="" label="备注" sortable  align="center"></el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope" style="marginLeft:-25px">
                <el-button type="text" size="small">修改</el-button>
                <span class="line">|</span>
                <el-button type="text" size="small" @click="opened(scope.row.id)">删除</el-button>
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
import { deletePayway } from "@/api"
export default {
  components: {},
  props: ['list'],
  data() {
    return {
      navListData: [
        {
          title: "收费方式配置"
        },
        {
          title: "收支账户配置"
        }
      ],
      tHaderData: [
        { prop: "a", label: "收费方式" },
        { prop: "b", label: "默认计入收支账户" },
        { prop: "c", label: "收支账号" },
        { prop: "d", label: "是否为储值卡" },
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
  methods: {

  },
  mixins: [],
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
