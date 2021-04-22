<template>
  <div class="wrapper" id="visitingRecord">
    <VisitingRecord  @openOrclose="openOrclose" v-if="!isShowComp" />
    <visittracklineitem @openOrclose="openOrclose" :id='id' v-if="isShowComp"/>
  </div>
</template>

<script>
import VisitingRecord from "./VisitingRecord.vue";
import visittracklineitem from "./visittracklineitem.vue";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { VisitingRecord, visittracklineitem },
  props: [],
  data() {
    return {
      isShowComp: false,
      id:''
    };
  },
  watch: {

  },
  computed: {},
  mounted() {},
  methods: {
    openOrclose(id,c){
      this.isShowComp=!this.isShowComp;
      id ? this.id=id : "";
      if(c){this.id=""};
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
