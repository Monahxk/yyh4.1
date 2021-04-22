<!--
 * @Descripttion: 确认回访，弹框选择回访结果
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-11-04 11:12:16
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-06 15:59:52
 -->
<template>
  <div class="call-back-dialog">
    <el-dialog
      title="完成回访"
      :visible.sync="dialog.isshow"
      :modal="true"
      @close="closeDialog"
      @open="openDialog"
      >
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item prop="result">
            <el-select
              v-model="form.result"
              allow-create
              filterable
              default-first-option
              placeholder="请选择或输入回访结果"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item, index) of selectData.contentSet"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surepost">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {delateAcallback,getCallbackresultlist} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
export default {
  name: 'CallbackDialog',
  props: ['dialog'],
  data() {
    return {
      form: {
        result :'',
      },
      selectData: {
        contentSet: []
      },
      rules: {
        result: [
          { required: true, message: '请选择或输入回访结果', trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    surepost() {
      this.$refs['form'].validate((valid) => {
          if (valid) {
            delateAcallback(this.dialog.id, "finishstatus",this.form.result).then(res => {
              if (res.data.code === SYSTEM_HTTP_SUCCESS) {
                this.$emit('getTableData');
                this.dialog.isshow = false;
              }
            });
          }
        }
      )
    },
    closeDialog() {
      this.$refs['form'].resetFields();
    },
    openDialog() {
      getCallbackresultlist().then(res => {
        if(res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.selectData.contentSet = res.data.data;
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .call-back-dialog {
    /deep/.el-dialog {
      position: relative;
      width: 400px;
      margin-top: 0 !important;
      top: 50%;
      transform: translateY(-50%);
      .el-dialog__body {
        height: 170px;
      }
      .el-select {
        width: 100%;
      }
    }
  }
</style>