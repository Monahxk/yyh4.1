<!--
 * @Descripttion: 收费打印弹框，入口，所有打印模板在这里显示
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-11-12 11:21:06
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 17:08:52
 -->
<template>
  <main class="print_main">
    <rongYiClinic :dialog="dialog" :chargeStatus="chargeStatus" @cancel-print="canselPrint"></rongYiClinic>
  </main>
</template>
<script>
import rongYiClinic from "./rongYiClinic/index";
export default {
  name: 'printIndex',
  components: {rongYiClinic },
  props: ['dialog','chargeStatus'],
  data() {
    return {
    }
  },
  methods: {
    canselPrint(id) {
      this.$emit('cancel-print',this.id);
    }
  }
}
</script>