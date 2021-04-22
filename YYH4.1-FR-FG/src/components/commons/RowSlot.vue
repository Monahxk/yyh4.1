<!--
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-28 09:13:14
 * @LastEditors: hzj
 * @LastEditTime: 2019-08-28 09:21:53
 -->
<template>
  <el-row :gutter="20">
    <el-col v-if="colshow.col1" :xl="4" :lg="6" :md="7" :sm="10">
      <slot name="col1"></slot>
    </el-col>
    <el-col v-if="colshow.col2" :xl="4" :lg="6" :md="7" :sm="10">
      <slot name="col2"></slot>
    </el-col>
    <el-col v-if="colshow.col3" :xl="4" :lg="6" :md="7" :sm="10">
      <slot name="col3"></slot>
    </el-col>
    <el-col v-if="colshow.col4" :xl="4" :lg="6" :md="7" :sm="10">
      <slot name="col4"></slot>
    </el-col>
    <el-col v-if="colshow.btn" :span="3">
      <slot name="btn"></slot>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: ['colshow']
}
</script>