<!--
 * @Descripttion: 收费
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 16:03:50
 -->
<template>
  <div class="wrapper">
    <charge-home v-if="!isShowComp" @sendChange="changeStatusFn" @on-details="getDetails"></charge-home>
    <ChargeDetails v-if="isShowComp" @sendChange="changeStatusFn" :isShowAsid="isShowAsid" @on-aside="changeAside" :currentRowId="currentRowId" :iframeVisible="iframeVisible"></ChargeDetails>
    
    <charge-refund :isShow="refundDialog" :tableList="detailsData" :all="all"></charge-refund>

  </div>
</template> 
<script>
import ChargeHome from './ChargeHome'
import ChargeDetails from './ChargeDetails'
import ChargeRefund from './component/ChargeRefund'
import { mapState } from "vuex";
import { getEditchargebill} from '@/api'
export default {
  components: {ChargeHome, ChargeDetails, ChargeRefund},
  name: 'asideCharge',
  props: ['iframeVisible'],
  provide() {
    return {
      apps: this
    }
  },
  data () {
    return {
      currentRowId: '',
      isCurrent:'',
      isEdit: false,
      isDetail: false,
      detailsData: {},   // 详情data
      isShowComp: false, // 组件
      isShowAsid: false, // 侧边栏 true 显示 false 不
      all: 0,
      refundDialog: {
        dialogVisible: false
      },
      reloadDetail: false,
      billingStatusName: '',
    }
  },
  watch: {},
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId,
    rowId: state => state.signal.rowId
  }),
  methods: {
    changeAside(val) {
      this.isShowAsid = val
    },
    // 新增 or 编辑
    changeStatusFn(val) {
      this.isDetail = false
      this.isCurrent = -1
      this.isShowComp = val
      this.isShowAsid = true
    },
    goHome() {
      // alert(0)
      this.isShowComp = false
    },
    // 详情
    detailsFn(val) {
      this.isShowComp = true
      this.isShowAsid = false
    },
    getDetails(row,home) {
      this.currentRowId = row.id;
      getEditchargebill(row.id).then((res) => {
        const arr = [
          "待收费",
          "已收费",
          "",
          "退费",
          "欠费",
          "作废",
          "审批待处理",
          "审批通过",
          "审批驳回",
          "待审批",
          "驳回",
          "审批中",
          "撤销",
          "已待批",
          "提交申请",
          "补收欠费"
        ];
        // return
        this.detailsData = res.data.data
        if (res.data.data.chargeBill) {
          this.all = Math.abs(res.data.data.chargeBill.discountAmountYuan)
        }
        this.isCurrent = arr.findIndex(v => row.billingStatusName == v)
        this.billingStatusName = row.billingStatusName;
        if (home) {
          this.refundDialog.dialogVisible = true
          return
        }
        if(this.reloadDetail == true) {
          this.$root.Bus.$emit("renderDetail",true);
          this.reloadDetail = false;
        }
        this.isDetail = true
        this.detailsFn()
      })
    }
  },
  mixins: [],
  mounted () {
    let _this = this;
    this.$root.Bus.$on("reloadDetail", function(row) {
      console.log(row)
      _this.getDetails(row);
      _this.reloadDetail = true;
    });
  }
}
</script>
<style lang="less" scoped>
.wrapper{
  height: 100%;
}
</style>