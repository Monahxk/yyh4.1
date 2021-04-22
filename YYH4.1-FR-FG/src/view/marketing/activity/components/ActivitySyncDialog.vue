<!--
 * @Descripttion: 活动同步到门店
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-23 09:25:55
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-23 13:47:20
 -->
<template>
  <div>
    <!-- 同步门店弹窗 -->
    <el-dialog
      title="活动同步到分店"
      :visible.sync="dialog.isshow"
      width="440px"
      top="20vh"
      center
      @open="openDialog"
      @close="closeDialog"
      :closeOnClickModal="false"
    >
      <div class="content">
        <el-form :model="form" :ref="form" class="demo-ruleForm">
          <el-form-item label-width="80px" label="使用门店" prop="activityName">
             <el-cascader-multi
             v-model="form.institutions"
             :data="institutionList"
             :show-leaf-label="true"
             :is-two-dimension-value="false"
             expand-trigger="hover"
             @change="changeIns"
             >
             </el-cascader-multi>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitFn('form')">保存</el-button>
        <el-button size="small" @click="dialog.isshow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {treeInstitutionsSimple} from '@/api'
export default {
  name: 'ActivitySyncDialog',
  props: ['dialog'],
  data() {
    return {
      form: {
        institutions: [],
        oldselect: []
      },
      institutionList: [],
    }
  },
  watch: {
    'dialog.institutionIdList'(val) {
      if(val.length > 0) {
        let institutions = [];
        val.map(item => {
          institutions.push('inst-' + item);
        })
        this.form.institutions = institutions;
        this.form.oldselect = institutions;
      }
    }
  },
  mounted() {
    // this.getInstitution();
  },
  methods: {
    getInstitution() {
      if(this.institutionList.length < 0) {
        return;
      }
      treeInstitutionsSimple().then(res => {
        if (res.data.code == 200) {
          this.institutionList = res.data.data
        }
      });
    },
    submitFn() {
      if(this.form.institutions.length < 0) {
        this.$message({
          message: '请选择同步门店',
          type: 'error'
        });
      } else {
        let institutions = [];
        this.form.institutions.map(item => {
          institutions.push(item.replace('inst-',''));
        })
        this.$emit('submitSync', institutions);
      }
    },
    changeIns(value){
      let insstr = this.form.institutions.join(',');
      this.form.oldselect.map((item) => {
        if(insstr.indexOf(item) < 0) {
          this.$message({
            message: '该门店已经同步，不能取消',
            type: 'waring'
          });
          this.form.institutions.push(item)
        }
      })
      this.volidInstitution();
      return false
    },
    volidInstitution() {
      for(let i in this.form.institutions) {
        if(this.form.institutions[i].indexOf('level') >=0 ) {
          this.form.institutions.splice(i,1);
        }
      }
    },
    openDialog() {
      this.getInstitution();
    },
    closeDialog() {
      this.form.institutions = [];
      this.form.oldselect = [];
    }
  }
}
</script>

<style lang="less" scoped>

</style>
