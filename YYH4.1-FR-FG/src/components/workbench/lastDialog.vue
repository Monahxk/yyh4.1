<template>
  <div class="returnVisit_dialog" id="last_dialog">
    <el-dialog
      title="编辑回访"
      :visible.sync="isShow.shows"
      width="960px"
      @closed="handleOff"
      :modal="false"
    >
      <div class="dialog_content">
        <div class="dialog_tabs">
          <div class="dialog_tabs_title">
            <span class="title_text">回访</span>
          </div>
          <div class="add_box">
            <el-form ref="form" :model="form" label-width="90px" v-show="radio == 1">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访时间" :required="true">
                    <el-date-picker
                      v-model="form.callTime"
                      value-format="yyyy/MM/dd HH:mm"
                      type="datetime"
                      placeholder="选择日期时间"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="回访状态" :required="true">
                    <el-radio-group v-model="form.status">
                      <el-radio :label="0">未回访</el-radio>
                      <el-radio :label="1">已完成</el-radio>
                      <el-radio :label="2">无结果</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访人员" :required="true">
                    <el-select v-model="form.callerId" placeholder="请选回访人员">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.callerTOList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="诊治医生" :required="true">
                    <el-select v-model="form.doctorId" placeholder="请选择诊治医生">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="(item, index) of selectData.doctorTOList"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="回访内容" :required="true">
                    <el-select v-model="form.content" placeholder="请选择回访内容">
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
                  <el-form-item label="回访结果">
                    <el-select v-model="form.result" placeholder="请选择回访结果">
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
                      type="textarea"
                      autosize
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
      <!--  -->
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!stateData.isOff" @click="isShow.shows = false">取 消</el-button>
        <el-button type="primary" @click="uplateData" v-if="!stateData.isOff">确 定</el-button>
        <el-button type="primary" @click="isShow.shows = false" v-if="stateData.isOff">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putUpdateData } from "@/api";
import monment from "moment";
export default {
  components: {},
  props: ["isShow", "selectData", "form", "stateData"],
  data() {
    return {
      radio: "1",
      radio2: "",
      oldform: {
        callerId: "", // 回访人员
        callTime: "", // 回访时间
        doctorId: "", // 诊治医生
        status: 0,
        result: "", // 回访结果
        content: "",
        remark: "",
        visitTime: "",
        "patient.id": "",
        id: ""
      },
      dialogFormVisible: false,
      textarea3: "",
      state3: ""
    };
  },
  created() {},
  watch: {},
  computed: {},
  methods: {
    handleOff() {
      this.stateData.isOff = false;
    },
    uplateData() {
      if (!this.form.callTime) {
        this.$message.error("请选择回访时间");
        return;
      }

      if (!this.form.callerId) {
        this.$message.error("请选择回访人员");
        return;
      }

      if (!this.form.doctorId) {
        this.$message.error("请选择回访医生");
        return;
      }
      if (!this.form.content) {
        this.$message.error("请选择回访内容");
        return;
      }

      Object.keys(this.form).map(v => {
        Object.keys(this.oldform).map(k => {
          if (k == v) {
            this.oldform[k] = this.form[v];
          }
        });
      });

      putUpdateData(this.oldform).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.$emit("sendEvent");
          this.isShow.shows = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      });
    }
  },
  mixins() {},
  created() {}
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
.p_row_left {
  margin-right: 40px;
}
</style>
<style>
.returnVisit_dialog .el-dialog__body {
  padding: 0;
}
#last_dialog .el-dialog__body{
  height: auto !important;
}
</style>
