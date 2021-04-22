<template>
  <div class="wrapper DialogPosition">
    <el-dialog
      :title="isShow.edit ? '编辑岗位' : ' 新增岗位'"
      :visible.sync="isShow.job"
      width="440px"
      @closed="closedFn"
      @open="getPositionData"
      :close-on-click-modal="false"
    >
      <el-form ref="form" label-width="60px" class="demo-ruleForm">
        <el-form-item label="岗位" :required="true">
          <el-input v-model="position"></el-input>
        </el-form-item>
        <el-form-item class="laab" label="业务权限" label-width="60px" :required="true">
          <div class="checkbox">
            <label class="labelbox">
              <input v-model="billEditable" type="checkbox" value /> 划价权限
            </label>
            <label class="labelbox">
              <input v-model="chargeEditable" type="checkbox" value /> 收费权限
            </label>
            <label class="labelbox">
              <input v-model="chargeItemConfigEditable" type="checkbox" value /> 收费项目编辑权限
            </label>
            <label class="labelbox">
              <input v-model="emrEditable" type="checkbox" value /> 病历编辑权限
            </label>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives" @click="saveData()">
            <span>确定</span>
          </li>
          <li @click="isShow.job = !isShow.job">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  savePosition,
  editPosition,
  updatePosition,
  getPositiondo
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: ["isShow", "positionId"],
  data() {
    return {
      checkList: [],
      permission: {
        chargeEditable: "",
        chargeItemConfigEditable: "",
        emrEditable: "",
        billEditable: ""
      },
      billEditable: "",
      chargeEditable: "",
      chargeItemConfigEditable: "",
      emrEditable: "",
      form: {},
      position: "",
      id: "",
      Jurisdiction: []
    };
  },
  watch: {},
  computed: {},
  methods: {},
  mixins: [],
  methods: {
    getPositionData() {
      if (this.isShow.edit) {
        editPosition({ id: this.positionId }).then(res => {
          this.position = res.data.data.position.name;
          this.id = res.data.data.position.id;
          let data = res.data.data.permission;
          data.billEditable === 1
            ? (this.billEditable = true)
            : (this.billEditable = false);
          data.chargeEditable === 1
            ? (this.chargeEditable = true)
            : (this.chargeEditable = false);
          data.chargeItemConfigEditable === 1
            ? (this.chargeItemConfigEditable = true)
            : (this.chargeItemConfigEditable = false);
          data.emrEditable === 1
            ? (this.emrEditable = true)
            : (this.emrEditable = false);
        });
      } else {
        getPositiondo().then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            let data = res.data.data.permission;
          }
        });
      }
    },

    closedFn() {
      this.position = "";
      this.id = "";
      this.isShow.job = false;

      for (let key in this.permission) {
        this.permission[key] = 0;
      }
      this.billEditable = "";
      this.chargeEditable = "";
      this.chargeItemConfigEditable = "";
      this.emrEditable = "";
    },
    saveData() {
      if (!this.position) {
        this.$message.error("请填写岗位");
        return;
      }

      this.billEditable
        ? (this.permission.billEditable = 1)
        : (this.permission.billEditable = 0);
      this.chargeItemConfigEditable
        ? (this.permission.chargeItemConfigEditable = 1)
        : (this.permission.chargeItemConfigEditable = 0);
      this.emrEditable
        ? (this.permission.emrEditable = 1)
        : (this.permission.emrEditable = 0);
      this.chargeEditable
        ? (this.permission.chargeEditable = 1)
        : (this.permission.chargeEditable = 0);
      let formData = {
        position: {
          name: "",
          id: ""
        },
      };
      formData.position.name = this.position;
      formData.permission= this.permission;
      if (this.isShow.edit) {
        formData.position.id = this.id;
        updatePosition(formData).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.$emit("initPosition");
            this.closedFn();
          }
        });
      } else {
        savePosition(formData).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.closedFn();
            this.$emit("initPosition");
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../assets/css/workbench/publicTable.css";

.wrapper {
  .btns_wrap {
    display: flex;
    justify-content: center;
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
}
.box {
  width: 700px;
  height: 170px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  margin-left: 15px;
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
.demo-ruleForm {
  .el-row {
    margin-top: 20px;
  }
}
.checkbox .labelbox {
  display: block;
}
</style>
<style lang="less">
.DialogPosition {
  .el-dialog__body {
    padding: 20px 20px;
  }
  .el-dialog__footer {
    padding: 40px 20px 10px 40px;
  }
  .laab .el-form-item__label {
    line-height: normal;
  }
}
</style>