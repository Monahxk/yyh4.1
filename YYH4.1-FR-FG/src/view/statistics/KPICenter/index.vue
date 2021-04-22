<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: index.vue
@Last modified by:   ZJZ
@Last modified time: 2019-10-31
-->

<template>
  <!-- 运营总揽 -->
  <div class="wrapper">
    <base-tabs ref="active" v-model="checkedIndex">
      <base-pane
        v-for="(item, index) of navData"
        :key="index"
        :label="item.txt"
      ></base-pane>
    </base-tabs>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const navData = [
  {
    txt: '医生开费汇总',
    url: 'KpiReport'
  },
  {
    txt: '医生接诊数量',
    url: 'KpiPatient'
  },
  {
    txt: '护士收费汇总',
    url: 'KpiNurse'
  },
  {
    txt: '患者实收汇总',
    url: 'KpiPay'
  },
]
export default {
  data() {
    return {
      navData,
      checkedIndex: 0
    };
  },
  watch: {
    checkedIndex(n) {
      this.$router.push(this.navData[n].url)
    }
  },
  created() {
    let path = this.$route.path.substr(1)
    this.navData.forEach((val, index) => {
      if ( val.url == path ) {
        this.checkedIndex = index
      }
    })
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  .main {
    flex: 2;
  }
}
</style>
