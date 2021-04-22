<template>
  <div class="wrapper" id="case_history_index">
    <caseHistoryList v-show="!isShowComp" :isShowComp="isShowComp" @sendChange="changeStatusFn "/>
    <addCaseHistory
      v-show="isShowComp"
      :isShowComp="isShowComp"
      :id="id"
      :emrdata="emrdata"
      @sendChange="changeStatusFn"
    />
  </div>
</template>

<script>
import caseHistoryList from "./caseHistoryList.vue";
import addCaseHistory from "./addCaseHistory.vue";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { caseHistoryList, addCaseHistory },
  props: [],
  data() {
    return {
      isShowComp: false,
      times: "",
      emrdata: {},
      id: ""
    };
  },
  watch: {
    emrdata() {}
  },
  computed: {},
  mounted() {},
  methods: {
    changeStatusFn(val, data) {
      this.isShowComp = val;
      this.emrdata = data;
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
}
</style>
<style>
</style>
