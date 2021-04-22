<!--
@Author: ZJZ
@Date:   2019-08-05
@Filename: Parameter.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-15
-->

<template>
  <div class="wrapper">
    <div class="main_top_title">通用性配置</div>
    <div class="parameter">
      <el-form :model="form" :rules="rules" ref="form" label-width="170px">
        <!-- <el-form-item label="预约成功提醒" prop="appointSuccRemind">
          <el-switch
            v-model="form.appointSuccRemind"
            active-value='1'
            inactive-value='0'
            active-color="#3B78FD"
            inactive-color="#DFE7F0">
          </el-switch>
        </el-form-item> -->
        <el-form-item label="挂号时收取挂号费" prop="useRegFee">
          <el-switch
            v-model="form.useRegFee"
            active-value='1'
            inactive-value='0'
            active-color="#3B78FD"
            inactive-color="#DFE7F0">
          </el-switch>
          <span class="gray_text">(在系统配置-收费项目下配置挂号费 <span class="blue_text"><router-link :to="{ name: 'Item', }">前往>></router-link></span> )</span>
        </el-form-item>
        <el-form-item label="通知启用语音提醒" >
          <el-checkbox true-label='1' false-label='0' v-model="form.useRegVoice">挂号语音提醒</el-checkbox>
          <el-checkbox true-label='1' false-label='0' v-model="form.useChargeVoice">收费语音提醒</el-checkbox>
        </el-form-item>
        <el-form-item label="电子病历时限配置" prop="emrEditTimeLimit">
          <el-input size="small" v-model="form.emrEditTimeLimit" maxlength='3'></el-input> &nbsp;天
        </el-form-item>
        <el-form-item label="物品临期报警预设" prop="inventoryCriticalDays">
          有效期低于&nbsp;&nbsp;
          <el-input size="small" maxlength='3' v-model="form.inventoryCriticalDays"></el-input> 天
        </el-form-item>
        <el-form-item label="库存低量报警预设" prop="inventoryLowLimit">
          数量低于&nbsp;&nbsp;
          <el-input size="small" v-model="form.inventoryLowLimit" maxlength='3'></el-input>
        </el-form-item>

        <el-button @click='formFun' class="form_btn" size='small' type="primary">保 存</el-button>
      </el-form>
    </div>




  </div>
</template>


<script>
import {systemparam,systemparamPut} from "@/api";

export default {
  name:'parameter',
  data() {
    return {
      form: { //表单
        appointSuccRemind: '0',
        useRegFee: '0',
        useRegVoice:'1',
        useChargeVoice:'0',
        emrEditTimeLimit:30,
        inventoryCriticalDays:30,
        inventoryLowLimit:30,
      },
      rules: {
        emrEditTimeLimit: [
          { required: true, message: "请输入时限", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        inventoryCriticalDays: [
          { required: true, message: "请输入临期报警时间", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        inventoryLowLimit: [
          { required: true, message: "请输入低量报警时间", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
      }

    };
  },
  mounted() {
    systemparam().then(res=>{
      console.log(res)
      this.form=res.data.data
      this.form.useRegFee=this.form.useRegFee.toString()
      this.form.appointSuccRemind=this.form.appointSuccRemind.toString()
      this.form.useRegVoice=this.form.useRegVoice.toString()
      this.form.useChargeVoice=this.form.useChargeVoice.toString()
    })
  },
  methods: {
    formFun(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          systemparamPut(this.form).then(res=>{
            console.log(res)
          })

        } else {
          return false;
        }
      });
    }



  }
};
</script>
<style lang="less" scoped>
.parameter {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-top: -10px;
  background: white;
  height: 800px;
  .el-form-item{
    margin-bottom:10;
    .el-input,.el-select{
      width: 60px;
    }
  }
  .blue_text{
    a{
      color: #3B78FD;
    }
  }
  .form_btn{
    margin-left: 45px;
    margin-top: 40px;
  }

}

</style>
