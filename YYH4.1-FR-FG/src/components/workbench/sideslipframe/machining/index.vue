<template>
  <div class="wrapper" id="machining_list">
    <MachiningList  @openOrclose="openOrclose" v-if="!isShowComp" />
    <Machining @openOrclose="openOrclose" :id='id'  v-if="isShowComp"/>
  </div>
</template>

<script>
import MachiningList from "./MachiningList.vue";
import Machining from "./Machining.vue";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { MachiningList, Machining },
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
      id ? this.id=id : "";
      if(c){this.id=""};
      this.isShowComp=!this.isShowComp;

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
