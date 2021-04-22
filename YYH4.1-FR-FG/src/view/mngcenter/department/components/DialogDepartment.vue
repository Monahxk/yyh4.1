<template>
  <div class="wrapper DialogDepartment">
    <el-dialog
      :title=" isShow.edit ? '编辑科室' : '新增科室'"
      :visible.sync="isShow.departmentShow"
      width="440px"
      @closed="closedFn"
      @open="getEditDepartmentData"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="80px" class="demo-ruleForm">
        <el-form-item label="科室名称" :required="true">
          <el-input v-model="department"></el-input>
        </el-form-item>

        <el-form-item label="科室主任">
          <el-select class="director" v-model="departmentUser" placeholder="请选择">
            <el-option
              v-for="(item,index) in this.list"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives" @click="saveData()">
            <span>确定</span>
          </li>
          <li @click="isShow.departmentShow = !isShow.departmentShow">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveOrUpdateDepartment,
  updateDepartment,
  listDepartment,
  addDepartment,
  editDepartment
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: ["isShow", "dpatmtId"],
  data() {
    return {
      form: {},
      department: "",
      departmentUser: "",
      list: [],
      error: "",
      id: ""
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.getDepartmentList();
  },
  mixins: [],
  methods: {
    closedFn() {
      this.department = "";
      this.departmentUser = "";
    },
    getDepartmentList() {
      addDepartment().then(res => {
        this.list = res.data.data.doctorList;
      });
    },
    getEditDepartmentData() {
      //编辑
      if (this.isShow.edit) {
        this.departmentId = this.dpatmtId;
        editDepartment({
          id: this.departmentId
        }).then(res => {
          this.id = res.data.data.department.id;
          this.department = res.data.data.department.name;
          res.data.data.director.id
            ? (this.departmentUser = res.data.data.director.id)
            : (this.departmentUser = "");
        });
      }
    },
    saveData() {
      if (!this.department) {
        this.$message.error("请填写科室名称");
        return;
      }

      let formData = {};

      formData.name = this.department;
      formData.directorId =
        this.departmentUser == undefined || this.departmentUser == ""
          ? "0 "
          : this.departmentUser;
      if (this.isShow.edit) {
        formData.id = this.id;
        console.log(formData);
      updateDepartment(formData).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          this.$emit("initDepartment");
        }
      });
        
      } else {

        formData.id = 0;
      saveOrUpdateDepartment(formData).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          this.$emit("initDepartment");
        }
      });
      }


      this.isShow.departmentShow = !this.isShow.departmentShow;
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
    margin-top: -20px;
  }
}
.director {
  width: 100%;
}
</style>
<style lang="less">
.DialogDepartment {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__footer {
    padding: 0px 20px 10px 40px;
  }
}
</style>
