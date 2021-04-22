<template>
  <div class="wrapper">
    <el-dialog
      title="客户详情"
      :visible.sync="isShow.show"
      width="750px"
      @open="init"
      :close-on-click-modal="false"
    >
      <div>
        <el-form label-width="80px" :disabled="onOffEdit">
          <el-row>
            <el-col :span="11">
              <el-form-item label="姓名">
                <el-input v-model="list.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-radio-group v-model="list.gender">
                <el-radio :label="0" style="marginLeft:15px">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="2">
              <div
                class="el-icon-edit edit_but"
                :class="{ 'active_edit_but' : !onOffEdit}"
                @click="editCustomer"
              ></div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="电话">
                <el-input v-model="list.teleno" maxlength="11" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push="2">
              <el-form-item label="咨询师">
                <el-select v-model="formInline.region" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in user"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="marginTop:-20px">
            <el-col :span="11">
              <el-form-item label="咨询项目">
                <el-select v-model="formInline.regioned" placeholder=" 请选择 ">
                  <el-option
                    v-for="(item,index) in this.project"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push="2">
              <el-form-item label="咨询方式">
                <el-select v-model="list.consultationMethod" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in this.consultWayMap"
                    :key="index"
                    :label="item.lable"
                    :value="item.val"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="咨询时间">
                <el-row>
                  <el-date-picker v-model="list.consultationTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push="2">
              <el-form-item label="患者备注">
                <el-input v-model="list.patientRemark" placeholder="有意向"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <div class="box">
              <p>咨询基本信息</p>
              <el-form-item label="咨询记录" style="marginTop:10px">
                <el-input type="textarea" v-model="list.advisoryRecord"></el-input>
              </el-form-item>
              <el-form label-width="80px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="回访进度">
                      <el-select v-model="status" placeholder="请选择回访进度">
                        <el-option
                          v-for="(item,index) in statusList"
                          :key="index"
                          :label="item.lable"
                          :value="item.status"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :push="2">
                    <el-form-item label="回访时间">
                      <template>
                        <div class="block">
                          <span class="demonstration"></span>
                          <el-date-picker
                            v-model="followUpTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            placeholder="选择日期"
                          ></el-date-picker>
                        </div>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ul class="btns_wrap">
            <li class="actives" @click="upData" v-show="!onOffEdit">
              <span>保存</span>
            </li>
            <li @click="isShow.show=!isShow.show">
              <span>取消</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  editClinicUsered,
  particularsClinicUser,
  getCustomerDownList
} from "@/api";
import monment from "moment";
export default {
  components: {},
  props: ["isShow", "id"],
  data() {
    return {
      formInline: {
        region: "",
        regioned: ""
      },
      onOffEdit: true,
      consultWayMap: [],
      statusList: [],
      input: {},
      list: {
        id: "",
        teleno: "",
        name: "",
        gender: "",
        consultationMethod: "",
        consultationTime: "",
        patientRemark: "",
        advisoryRecord: ""
      },
      user: [],
      project: [],
      status: "",
      followUpTime: ""
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    change() {
      this.$forceUpdate();
    },
    editCustomer() {
      this.onOffEdit = !this.onOffEdit;
    },
    init() {
      particularsClinicUser(this.id).then(res => {
        let data = res.data.data;
        let s = data.statusMap;
        let c = data.consultWayMap;
        for (let key in s) {
          this.statusList.push({ status: Number(key), lable: s[key] });
        }
        for (let keys in c) {
          this.consultWayMap.push({ val: Number(keys), lable: c[keys] });
        }

        this.project = data.consultItemList.map(val => {
          val.id = Number(val.id);
          return val;
        });
        this.user = data.consultantList.map(val => {
          val.id = Number(val.id);
          return val;
        });
        this.list.id = data.customer.id;
        this.list.name = data.customer.name;
        this.list.gender = data.customer.gender;
        this.list.teleno = data.customer.teleno;
        this.list.consultationMethod = Number(data.customer.consultMethod);
        this.list.consultationTime = data.customer.consultTime;
        this.status = data.customer.status;
        this.followUpTime = data.customer.followUpTime;
        this.list.patientRemark = data.customer.patientRemark;
        this.list.advisoryRecord = data.customer.consultRecord;
        this.formInline.region = Number(data.customer.consultantId);
        this.formInline.regioned = Number(data.customer.consultItemId);
      });
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    upData() {
      let formData = {};
      formData.id= this.list.id;
      formData.name= this.list.name;
      formData.teleno= this.list.teleno;
      formData.gender= this.list.gender;
      formData.consultantId= this.formInline.region;
      // formData.dentalAppointmentProjectId= this.formInline.regioned;
      formData.consultMethod=this.list.consultationMethod;
      formData.consultItemId= this.formInline.regioned;
      formData.consultTime= this.list.consultationTime;
      formData.followUpTime= this.followUpTime;
      formData.consultRecord= this.list.advisoryRecord;
      formData.patientRemark= this.list.patientRemark;
      formData.status= this.status;
      editClinicUsered(formData).then(res => {
        this.$root.Bus.$emit("refreshList");
        this.isShow.show = !this.isShow.show;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../assets/css/workbench/publicTable.css";
.wrapper {
  .btns_wrap {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    line-height: 32px;
    li {
      cursor: pointer;
      color: #3b78fd;
      width: 88px;
      height: 32px;
      border: 1px solid #3b78fd;
      margin-right: 20px;
    }
    .actives {
      color: #fff;
      background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
    }
  }
  .edit_but {
    width: 50px;
    height: 50px;
    font-size: 20px;
    color: #3b78fd;
  }
  .active_edit_but {
    color: #000;
  }
}
.el-select,
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.box {
  height: 170px;
  background-color: #ffffff;
  p {
    width: 100%;
    height: 40px;
    background-color: #f7f9ff;
    padding-left: 35px;
    box-sizing: border-box;
    line-height: 44px;
    color: #000;
  }
}
</style>