<template>
  <div class="wrapper" id="AddRecord_list">
    <RecordList  @openOrclose="openOrclose" v-if="!isShowComp" />
    <AddRecord @openOrclose="openOrclose" :id='id' v-if="isShowComp"/>
  </div>
</template>

<script>
import RecordList from "./RecordList.vue";
import AddRecord from "./AddRecord.vue";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { RecordList, AddRecord },
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
