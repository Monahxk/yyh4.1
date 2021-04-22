<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: KpiPay.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-07
-->

<template>
  <div class="wrapper kpi_pay">
    <div class="box_header">
      <el-form :inline="true" label-width='80px' :model="formSearch" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="formSearch.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="formSearch.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" :push='9'>
            <el-form-item>
              <el-button type="primary" class="searchBtn" round @click="init">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div class="content">
      <el-table
        highlight-current-row
        ref="singleTable"
        :data="list"
        style="font-size: 14px"
        height="650"
        :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
      >

        <el-table-column prop="patientName" label="姓名" sortable align="center"></el-table-column>
        <el-table-column label="价格" prop="total" sortable align="center">
        </el-table-column>

      </el-table>

      <div class="pagination_box">
        <div class="block">
          <el-pagination
            prev-text="上一页"
            next-text="下一页"
            background
            layout="total,prev,pager,next,sizes,jumper"
            :page-sizes="[4, 10, 15, 20]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager-count="9"
            :total="totalElements"
            :current-page="formSearch.page"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getApiConsume } from "@/api";
import vuescroll from "vuescroll";
import moment from "moment";
export default {
  components: { vuescroll },
  props: {},
  data() {
    return {
      formSearch: { //项目搜索
        startTime: '',
        endTime:'',
        page: 1,
        orderFlag:0,
        pageSize: 10,
      },
      totalElements: 1,
      list:[],
      total:10
    };
  },

  computed: {},
  methods: {
    _initData() {
      getApiConsume(this.formSearch).then(res => {
        this.list=res.data.data.content
        this.totalElements=res.data.data.totalElements
      });
    },
    init(){
      this._initData()
    },
    handleSizeChange(pageSize) {
      this.formSearch.pageSize=pageSize
      this._initData()
    },
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this._initData()
    },
  },
  mixins: [],
  created() {
    this._initData();
  }
};
</script>
<style lang="less" scoped>
.kpi_pay{
  .box_header{
    padding:20px 0 0 20px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
    box-shadow: 0 0 6px 0 #e4e9ff;
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 20px;
    .el-form{
      width: 100%;
      .el-date-editor{
        width: 270px;
        .el-range-separator{
          padding:0;
        }
      }
    }
    .searchBtn{
      padding:12px 50px;
    }
    .add_new_but{
      cursor: pointer;
      width: 154px;
      height: 48px;
      font-size: 18px;
      font-weight: bold;
      color: #4e81f2;
      text-align: center;
      line-height: 48px;
      -webkit-box-shadow: 0 0 6px 0 #e4e9ff;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #fff;
      position: absolute;
      right: 20px;
      top: 22px;
    }
  }
}

</style>
