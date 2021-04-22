<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 15:49:30
 -->
<template>
  <div class="wrapper">
    <addphysical
      @init="init"
      @showFn="showFn"
      @printing="printing"
      :isShow="isShowDialog"
      :datas="editData"
      :visb="show"
    />
    <physical :isShow="isShow" @showFn="showFn" @printing="printing" v-if="! isShow"/>
    <physicalReport :isShow="isShowDialog" :datas="editData" :visb="show"/>
  </div>
</template>

<script>
import addphysical from "./addphysical.vue";
import physical from "./physical.vue";
import physicalReport from "./physicalReport.vue";
import {
  physicalexaminationlist,
  doctorlist,
  editphysicalexamination,
  deletephysicalexamination
} from "@/api";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  components: { physical, addphysical, physicalReport },
  props: [],
  data() {
    return {
      isShow: false,
      editData: {
        id: "",
        data: [],
        edit: false
      },
      isShowDialog: {
        physical: false,
        detail: false,
        physicalReport: false,
        dialogVisible: false
      },
      show: false
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    changeStatusFn(val, data) {
      this.isShowComp = val;
      this.emrdata = data;
    },
    showFn(t, data, id) {
      this.isShow = t;
      if (data) {
        this.show = false;
        this.isShowDialog.physical = true;
        this.editData.id = id;
        this.editData.data = data;
        this.editData.edit = true;
      } else {
        this.show = true;
        this.isShowDialog.physical = true;
      }
    },
    printing(id) {
      editphysicalexamination(id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.editData.data = res.data.data;
          this.editData.id = id;
          this.isShowDialog.dialogVisible = true;
          // this.editData.edit = true;
        }
      });
    },
    init() {}
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
