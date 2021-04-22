<!--
 * @Descripttion: 按钮组件
 * @version: 4.1
 * @Author: hzj
 * @Date: 2019-08-28 09:33:25
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-07 17:18:12
 -->
<template>
  <div>
    <el-button v-if="btncfg.add" @click="add" type="primary">+{{btncfg.text}}</el-button>
    <el-button v-if="btncfg.submit" @click="submitfn" class="submit">{{btncfg.text}}</el-button>
  </div>
  
</template>
<script>
export default {
  props: ['btncfg'],
  methods: {
    add() {
      this.$emit('add');
    },
    submitfn() {
      this.$emit('submitfn');
    }
  }
}
</script>
<style lang="less" scoped>
  .submit {
    border: 1px solid #3B78FD;
  }
</style>