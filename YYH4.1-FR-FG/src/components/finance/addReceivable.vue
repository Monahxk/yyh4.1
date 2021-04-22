<template>
  <div class="iframe_wrapper">
    <el-dialog title="提示" :visible.sync="isShow.show" width="960px">
      <div class="content">
        <div class="header-wrap">
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="新增应收" name="first">
              <div>
                <el-form ref="form" :model="form" label-width="80px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="应收日期">
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="供应商">
                        <el-select v-model="form.region" placeholder="请选择" style="width:100%;">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" :push="2">
                      <el-form-item label>
                        <el-button>选择物品</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="关联出库">
                        <el-select style="width:100%;" v-model="form.region" placeholder="请选择">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="备注">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div>
                  <el-table :data="tableData" :header-cell-style="{background:'#F7F9FF'}">
                    <el-table-column
                      v-for="(item,index) of tHaderData"
                      :key="index"
                      fixed
                      align="center"
                      :prop="item.prop"
                      :label="item.label"
                    ></el-table-column>

                    <el-table-column label="入库数量">
                      <template slot-scope="scope">
                        <el-input></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="入库单价">
                      <template slot-scope="scope">
                        <el-input></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="金额"></el-table-column>

                    <el-table-column label="金额">
                      <template slot-scope="scope">
                        <el-button type="text">备注</el-button>
                        <el-button type="text">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="新增应付" name="second">
              <div>
                <el-form ref="form" :model="form" label-width="80px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="应收日期">
                        <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="供应商">
                        <el-select v-model="form.region" placeholder="请选择" style="width:100%;">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" :push="2">
                      <el-form-item label>
                        <el-button>选择物品</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="关联出库">
                        <el-select style="width:100%;" v-model="form.region" placeholder="请选择">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="备注">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div>
                  <el-table :data="tableData" :header-cell-style="{background:'#F7F9FF'}">
                    <el-table-column
                      v-for="(item,index) of tHaderData"
                      :key="index"
                      fixed
                      align="center"
                      :prop="item.prop"
                      :label="item.label"
                    ></el-table-column>

                    <el-table-column label="入库数量">
                      <template slot-scope="scope">
                        <el-input></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="入库单价">
                      <template slot-scope="scope">
                        <el-input></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="金额"></el-table-column>

                    <el-table-column label="金额">
                      <template slot-scope="scope">
                        <el-button type="text">备注</el-button>
                        <el-button type="text">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="numbs">
          <li>
            <span>总数量</span>
            <span class="blue">10</span>
          </li>
          <li>
            <span>总金额</span>
            <span class="blue">10</span>
          </li>
        </ul>
        <div class="bts_wrap">
          <div class="btns">
            <span>保存</span>
          </div>
          <div class="btns write">
            <span>取消</span>
          </div>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['isShow'],
  data() {
    return {
      dialogVisible: true,
      checked: true,
      activeName2: "first",
      value1: "first",
      form: {},
      tHaderData: [
        { prop: "a", label: "名称" },
        { prop: "b", label: "当前库存" },
        { prop: "c", label: "品牌" },
        { prop: "d", label: "规格" },
        { prop: "e", label: "单位" }
      ],
      tableData: [
        { a: "华西耗材", b: "12313", c: "30", d: "交易时间", e: "年度" },
        { a: "华西耗材", b: "12313", c: "30", d: "交易时间", e: "年度" },
        { a: "华西耗材", b: "12313", c: "30", d: "交易时间", e: "年度" },
        { a: "华西耗材", b: "12313", c: "30", d: "交易时间", e: "年度" },
        { a: "华西耗材", b: "12313", c: "30", d: "交易时间", e: "年度" },
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleClick() {}
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.numbs {
  display: flex;
  font-size: 16px;
  .blue {
    color: #3b78fd;
  }
  li:nth-child(1) {
    margin-right: 20px;
  }
}
.header {
  height: 66px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  font-size: 16px;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  li {
    cursor: pointer;
  }
  li:nth-child(2) span {
    color: #ddd;
    padding: 0 20px;
  }
  .active {
    color: #3b78fd;
  }
}
.content {
  .header-wrap {
    width: 100%;
    border-bottom: 1px solid #dfe7f0;
  }
}
.main-wrap {
  height: 500px;
  overflow-y: scroll;
  padding: 10px 0px;
  border-bottom: 1px solid #ccc;
  .msg-item {
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    .title {
      display: flex;
      justify-content: space-between;
    }
    .text {
      padding-top: 10px;
      line-height: 20px;
    }
  }
  .msg-item:hover {
    background: #eee;
  }
}
.dialog-footer {
  padding: 10px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btns {
  cursor: pointer;
  text-align: center;
  line-height: 32px;
  color: #fff;
  width: 88px;
  height: 32px;
  background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
}
.bts_wrap {
  display: flex;
  .write {
    color: #3b78fd;
    margin-left: 10px;
    background: #fff;
    border: 1px solid #3b78fd;
  }
}
</style>
<style>
.iframe_wrapper .el-dialog__body {
  border-top: 1px solid #ddd;
}
.iframe_wrapper .el-dialog__body {
  padding: 20px;
}
</style>

