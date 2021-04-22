<template>
  <div class="wrapper">
    <div class="table_box">
      <div class="floor-one">
        <p class="title">
          <span>待处理</span>
        </p>
        <el-table
          :header-cell-style="{background:'#F7F9FF'}"
          :data="tableData"
          style="width: 100%;"
          max-height="350"
        >
          <el-table-column
            fixed
            align="center"
            prop="date"
            :label="item.name"
            v-for="(item,index) of tableData"
            :key="index"
          ></el-table-column>

          <el-table-column align="center" prop="zip" label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="!isActive">写病历</el-button>
              <el-button type="text" v-else>详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="floor-one">
        <p class="title">
          <span style="margin-right: 30px;">待处理</span>
          <el-radio v-model="radio" label="1">结清</el-radio>
          <el-radio v-model="radio" label="2">欠费</el-radio>
          <el-radio v-model="radio" label="2">作废</el-radio>
        </p>
        <el-table
          :header-cell-style="{background:'#F7F9FF'}"
          :data="tableData"
          style="width: 100%;"
          max-height="350"
        >
          <el-table-column
            fixed
            align="center"
            prop="date"
            :label="item.name"
            v-for="(item,index) of tableData"
            :key="index"
          ></el-table-column>

          <el-table-column align="center" prop="zip" label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="!isActive">写病历</el-button>
              <el-button type="text" v-else>详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      activeName: "first",
      radio: '',
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
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
.nav-wrap {
  display: flex;
  justify-content: space-between;
  align-items:center;
  .btns span {
    cursor: pointer;
    display: block;
    width: 86px;
    height: 36px;
    color:#3b78fd;
    text-align: center;
    line-height: 36px;
    border: 1px solid #3b78fd;
  }
}
.table_box {
  .floor-one {
    margin-bottom: 20px;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
    padding-bottom: 30px;
  }
}
</style>