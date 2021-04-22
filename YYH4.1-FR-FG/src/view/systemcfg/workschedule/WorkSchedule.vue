<template>
  <div class="wrapper" style="overflow: hidden">
    <div class="header">
      <div class="header-left">
        <base-tabs v-model="checkedIndex" @on-click="getParentIndex" @on-click-nav="getChildIndex">
          <base-pane
            v-for="(item,index) of navListData"
            :navData="item.data"
            :label="item.title"
            :key="index"
          ></base-pane>
        </base-tabs>
      </div>
    </div>

    <div class="content-box">
      <workSetting v-if="!checkedIndex"/>
      <workAdmin v-if="checkedIndex == 1"/>
    </div>

  </div>
</template>

<script>
import workSetting from "./components/workSetting";
import workAdmin from "./components/workAdmin";
export default {
  components: { workSetting, workAdmin },
  props: {},
  data() {
    return {
      checkedIndex: 0,
      childIndex:0,
      btnValue: "新增收费配置",
      navListData: [
        {
          title: "排班设置"
        },
        {
          title: "班次管理"
        }
      ],
      isShowDiaLog: { income: false, expenditure: false }
    };
  },
  watch: {
    checkedIndex(val) {
      this.childIndex = 0
      val ? (this.btnValue = "新增收支账户") : (this.btnValue = "新增收费配置");
    }
  },
  computed: {},
  methods: {
    isShowDiaLogFn() {
      this.checkedIndex
        ? (this.isShowDiaLog.expenditure = !this.isShowDiaLog.expenditure)
        : (this.isShowDiaLog.income = !this.isShowDiaLog.income);
    },
    getParentIndex(v) {
      // console.log("通过事件获取 大的index", v);
    },
    getChildIndex(v) {
      this.childIndex = v
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrapper, .content-box {
  height: 100%;
}
.content-box {
  // padding: 20px;
}
</style>