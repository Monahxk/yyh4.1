<template>
  <div class="wrapper">
    <div class="header">
      <h3>班次</h3>
      <ul class="checked_box">
        <li>
          <el-radio v-model="radio8" label="1" border size="medium">上午班</el-radio>
        </li>
        <li>
          <el-radio v-model="radio8" label="2" border size="medium">下午班</el-radio>
        </li>
        <li>
          <el-radio v-model="radio8" label="3" border size="medium">白班</el-radio>
        </li>
        <li>
          <el-radio v-model="radio8" label="4" border size="medium">休息</el-radio>
        </li>
      </ul>
    </div>

    <div class="boxs">
      <div class="main_top">
        <div class="nav_box">
          <el-radio-group v-model="checkboxGroup4" size="medium" style="width:300px;">
            <el-radio-button v-for="city in cities" :label="city" :key="city">{{city}}</el-radio-button>
          </el-radio-group>

          <el-date-picker
            v-model="value3"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周"
            style="width:300px;"
          ></el-date-picker>

          <el-select v-model="form.region" placeholder="请选择活动区域" style="width:300px;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </div>
        <ul class="time_box">
          <li class="time_item" v-for="(item,index) of 7" :key="index">
            <span>2018-10-10</span>
            <span>星期一</span>
          </li>
        </ul>
      </div>
      <div class="main_bottom">
        <div class="msg_item" v-for="(item,index) of 4" :key="index">
          <div class="main_user">
            <span>吃饭</span>
          </div>
          <ul class="main_timer">
            <li
              class="time_item"
              :class="{active: index == 0}"
              v-for="(item,index) of 7"
              :key="index"
            >
              <span>
                <el-dropdown>
                  <span class="el-dropdown-link">上午班
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>上午班</el-dropdown-item>
                    <el-dropdown-item>下午班</el-dropdown-item>
                    <el-dropdown-item>白班</el-dropdown-item>
                    <el-dropdown-item disabled>休息</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </li>
          </ul>
        </div>
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
      checkboxGroup4: "医生",
      cities: ["医生", "工作人员"],
      value3: "",
      radio8: "1"
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
.el-dropdown-link {
  cursor: pointer;
}
.boxs {
  background: #fff;
  box-shadow: 0 0 6px 0 #e4e9ff;
}
.header {
  height: 70px;
  display: flex;
  padding: 0 20px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  align-items: center;
  background: #fff;
  h3 {
    font-size: 15px;
    margin-right: 30px;
  }
  .checked_box {
    display: flex;
    li {
      margin-right: 20px;
    }
  }
}
.main_top {
  background: #fff;
  margin-top: 20px;
  // padding: 20px 0;
  height: 160px;
  display: flex;
  .nav_box {
    width: 360px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
  }
  .time_box {
    display: flex;
    justify-content: space-between;
    flex-grow: 2;
    background: rgb(247, 249, 255);
    .time_item {
      font-size: 16px;
      display: flex;
      flex: 2;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: center;
      span:nth-child(2) {
        font-weight: bold;
      }
    }
  }
}
.main_bottom {
  margin-top: 20px;
  font-size: 16px;
  .msg_item {
    height: 70px;
    display: flex;
    text-align: center;
    line-height: 70px;
    border-bottom: 1px solid #eee;
    .main_user {
      width: 360px;
    }
    .main_timer {
      color: #fff;
      flex-grow: 2;
      display: flex;
      background: rgb(102 197 243);
      .time_item {
        flex-grow: 2;
      }
      .active {
        background: rgb(170 218 242);
      }
    }
  }
}
</style>
<style>
.nav_box .el-radio-button__inner {
  width: 150px;
}
</style>
