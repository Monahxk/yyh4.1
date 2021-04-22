<template>
  <div class="wrapper">
    <div class="left-box">
      <div class="left-floor-one">
        <el-radio v-model="radio" label="1">诊疗服务</el-radio>
        <el-radio v-model="radio" label="2">商品出售</el-radio>
      </div>
      <div class="left-floor-two">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:100%;">
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
      </div>
      <div class="left-floor-three">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="1-1">选项1</el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="right-box">
      <div class="right-floor-one">
        <div style="width:100%">
          <el-row>
            <el-col :span="24">
              <el-autocomplete
                style="width: 80%;"
                class="inline-input"
                v-model="state1"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容 完成快速的查询"
                @select="handleSelect"
              ></el-autocomplete>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="right-floor-two">
        <h3 class="titles">收费明细</h3>
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

      <div class="right-floor-three">
        <h3 class="titles">支付详情</h3>
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="整单折扣">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总计应收">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="折后应收">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支付方式	">
                <el-select v-model="form.region" placeholder="请选择">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实收金额">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="欠费	">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="找零">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="right-floor-four">
        <el-form>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收费时间">
                <el-date-picker
                  v-model="value1"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="就诊时间">
                <el-date-picker
                  v-model="value1"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          
          <el-row>
            <el-col :span="12">
              <el-form-item label="医生">
                <el-select v-model="form.region" placeholder="请选择">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="护士">
                <el-select v-model="form.region" placeholder="请选择">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

           <el-row>
            <el-col :span="24">
              <el-form-item label="医生">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="textarea">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="right-floor-five">
        <ul class="btns-wrap">
          <li><span>保存</span></li>
          <li><span>收费</span></li>
          <li><span>保存</span></li>
          <li><span>保存</span></li>
          <li><span>保存</span></li>
        </ul>
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
      form: {},
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
.wrapper {
  display: flex;
  justify-content: space-between;
  .titles {
    padding: 20px 0;
  }
}
.left-box {
  width: 200px;
  height: 600px;
  border: 1px solid #eee;
  .left-floor-one {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
  }
  .left-floor-two {
    border-bottom: 1px solid #eee;
  }
}
.right-box {
  width: 700px;
  .right-floor-one {
    padding: 5px 0 0 20px;
    height: 50px;
    background: #eee;
  }
  .right-floor-five {
    display: flex;
    align-items: center;
    justify-content: center;
    .btns-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      li {
        width: 96px;
        height: 32px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 32px;
      }
    }
  }
}
</style>
<style>
.left-floor-two .el-input__inner {
  border: 0 !important;
}
</style>
