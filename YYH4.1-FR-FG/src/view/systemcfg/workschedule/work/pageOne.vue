<template>
  <div class="wrapper">
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
      <div class="msg_item" v-for="(item,index) of 7" :key="index">
        <div class="main_user">
          <span>吃饭</span>
        </div>
        <ul class="main_timer">
          <li  class="time_item" :class="{active: index == 0}" v-for="(item,index) of 7" :key="index">
            <span>休息</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  components: {},
  props: {},
  data() {
    return {
      form: {},
      checkboxGroup4: "医生",
      cities: ["医生", "工作人员"],
      value3: ""
    };
  },
  watch: {},
  computed: {},
  created(){
    const startDate = moment().week(moment().week()).startOf('week').day(1).format('YYYY-MM-DD'); 
    const endDate = moment().week(moment().week()).endOf('week').format('YYYY-MM-DD');



    console.log(this.getLastWeek(1),this.getNextWeek(2) );
    
  },
  methods: {
    // 获取前N周 before
      getLastWeek(i) {
        let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
        let last_monday = moment().subtract(weekOfDay + 7 * i - 1, 'days').format('YYYY-MM-DD');//周一日期
        let last_sunday = moment().subtract(weekOfDay + 7 * (i - 1), 'days').format('YYYY-MM-DD');//周日日期
        return [last_monday, last_sunday]
      },
    // 获取后N周 after
    
      getNextWeek(i) {
        let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
        let next_monday = moment().add((7 - weekOfDay) + 7 * (i - 1) + 1, 'days').format('YYYY-MM-DD');//周一日期
        let next_sunday = moment().add((7 - weekOfDay) + 7 * i, 'days').format('YYYY-MM-DD');//周日日期
        return [next_monday, next_sunday]
      }

  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
.main_top {
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
        background:rgb(170 218 242);
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
