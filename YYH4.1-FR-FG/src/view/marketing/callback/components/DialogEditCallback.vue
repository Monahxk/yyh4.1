<!--
@Author: ZJZ
@Date:   2019-08-07
@Filename: DialogEditCallback.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-05
-->

<template>
  <div class="returnVisit_dialog">
    <el-dialog :title="stateData.isOff ? '回访详情' : '编辑回访' "  :visible.sync="isShow.shows" width="960px" @closed="handleOff">
      <div class="dialog_content" :class="{editData:stateData.isOff}">

        <div class="dialog_content_center">
          <div >
            <div class="row fl">
              <span class="key">姓名：</span>
              <span class="val">{{stateData.name}}</span>
            </div>
            <div class="row fl">
              <span class="key">病历号：</span>
              <span class="val">{{stateData.emrNo}}</span>
            </div>

            <div class="row fl">
              <span class="key">手机号：</span>
              <span class="val">{{stateData.mobilphone}}</span>
            </div>
          </div>
        </div>

        <div class="dialog_tabs">
          <div class="dialog_tabs_title">
            <span class="title_text">回访设置</span>
          </div>
          <div class="add_box">
            <el-form ref="form" :model="form" label-width="100px" v-show="callback == 1">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访时间" :required='!stateData.isOff' >
                    <el-date-picker
                    v-model="form.callTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :disabled=stateData.isOff
                    placeholder="选择日期时间"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访状态" :required='!stateData.isOff'>
                    <el-radio-group v-model="form.status" >
                      <el-radio :label="0" :disabled="stateData.isOff">未回访</el-radio>
                      <el-radio :label="1" :disabled="stateData.isOff">已完成</el-radio>
                      <el-radio :label="2" :disabled="stateData.isOff">无结果</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员" :required='!stateData.isOff'>
                    <el-select v-model="form.callerId" placeholder="请选回访人员" :disabled="stateData.isOff" >
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.callerList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="诊治医生" :required='!stateData.isOff'>
                    <el-select v-model="form.doctorId" placeholder="请选择诊治医生" :disabled="stateData.isOff" >
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.doctorList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访内容" :required='!stateData.isOff'>
                    <el-select v-model="form.content" placeholder=""  filterable allow-create :disabled="stateData.isOff" >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.contentSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访结果" >
                    <el-select v-model="form.result" placeholder="请选择回访结果" :disabled="stateData.isOff" >
                      <el-option
                        :label="item"
                        :value="item"
                        v-for="(item, index) of selectData.resultSet"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                    :disabled=stateData.isOff
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="form.remark"
                      :autosize="{ minRows: 4, maxRows: 4}"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!stateData.isOff"  @click="isShow.shows = false">取 消</el-button>
        <el-button type="primary" @click="uplateData" v-if="!stateData.isOff">确 定</el-button>
        <el-button type="primary" @click="isShow.shows = false" v-if="stateData.isOff">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {putUpdateData} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from "@/constant"
import monment from "moment";
export default {
  components: {},
  props: ["isShow","selectData", "form", "stateData"],
  data() {
    return {
      callback: "1",
      oldForm: {
        callerId: "",
        callTime: "",
        doctorId: "",
        status: 0,
        result: "",
        content: "",
        remark: "",
        visitTime:'',
        patientName:"",
        "patientId":'',
        id:''
      },
      dialogFormVisible: false,
    };
  },
  created() {},
  watch: {},
  computed: {},
  methods: {
    handleOff() {
      this.stateData.isOff = false;
    },
    uplateData(){
      Object.keys(this.form).map( v => {
        Object.keys(this.oldForm).map(k => {
          if (k==v) {
            this.oldForm[k] = this.form[v]
          }
        })
      })

      if (!this.oldForm.callTime) {
        this.$message.error('请选择回访时间');
        return
      }
      if (!this.oldForm.callerId) {
        this.$message.error('请选择回访人员');
        return
      }
      if (!this.oldForm.doctorId) {
        this.$message.error('请选择诊治医生');
        return
      }
      if (!this.oldForm.content) {
        this.$message.error('请选择回访内容');
        return
      }
      console.log(this.oldForm);
      putUpdateData(this.oldForm).then(res => {
        if (res.data.code ===SYSTEM_HTTP_SUCCESS) {
          this.$emit('sendEvent')
          this.isShow.shows = false
        }
      })
    }
  },
  mixins() {},
  created() {
  }
};
</script>
<style  scoped>
.select_header {
  margin-bottom: 20px;
}
.name_box {
  display: flex;
  justify-content: space-between;
}
.headers {
  padding: 10px 20px;
  background: rgb(247, 245, 255);
}
.dialog_content_center {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
}
.dialog_tabs_title {
  height: 50px;
  padding: 0 20px;
  line-height: 50px;
  background: rgb(247, 245, 255);
}
.add_box {
  padding: 20px;
}
.row {
  margin-right: 40px;
}
</style>
<style>
.returnVisit_dialog .el-dialog__body {
  padding: 10px;
}
.editData .is-disabled .el-icon-arrow-up {
  display: none !important;
  cursor:default !important;
}
.editData .is-disabled textarea, .is-disabled input {
  cursor:default !important;
  border: 1px solid #fff !important;
  background: #fff !important;
}
</style>
