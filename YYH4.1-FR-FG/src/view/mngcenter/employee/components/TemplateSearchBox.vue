<template>
  <div class="seach_box">
    <el-row>
      <el-col :span="7">
        <el-input v-model="searchCriteria" placeholder="姓名/员工号/手机号"></el-input>
      </el-col>
      <el-col :span="7">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="科室" class="department">
            <el-select v-model="form.department" placeholder="请选择">
              <el-option
                v-for="(item,index) in this.departmentList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="7">
        <el-form :model="formInline">
          <el-form-item label="岗位" class="position">
            <el-select v-model="formInline.position" placeholder="请选择" :style="{width:'150px'}">
              <el-option
                v-for="(item,index) in this.optolist"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" round class="right_but" @click="seachPage">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <el-form :model="form">
          <template>
            <el-radio v-model="isDimission" label="0">在职</el-radio>
            <el-radio v-model="isDimission" label="1">离职</el-radio>
          </template>
        </el-form>
      </el-col>
      <el-col :span="7">
        <el-form :model="form">
          <el-form-item>
            <el-checkbox-group v-model="canNotLogin">
              <el-checkbox>允许登录</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3" :push="7">
        <el-button class="right_but" round @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { listByFilter, getAddClinicUserDownList } from "@/api";
import {
  TYPE_CLINICUSER_JOB,
  SYSTEM_HTTP_SUCCESS,
  TYPE_PHYSICAL_NOTLOGIN
} from "@/constant";
export default {
  data() {
    return {
      searchCriteria: "",
      form: {
        department: ""
      },
      formInline: {
        position: ""
      },
      canNotLogin: true,
      isDimission: "",
      departmentList: "",
      optolist: "",
      page: "1",
      pageSize: "10"
    };
  },
  created(){
    this.$root.Bus.$on("pageSearchData", (p,s) => {
      console.log(p,s);
      // alert(this.formData.page)
      this.page = p;
      this.pageSize = s;
      this.seachPage();
      // alert(this.canNotLogin)
      // this.reset()
    });
  },
  mounted() {
    this.getDownList();

  },
  methods: {
    reset() {
      (this.searchCriteria = ""),
        (this.canNotLogin = ""),
        (this.isDimission = ""),
        (this.form.department = ""),
        (this.formInline.position = "");
      this.$emit("emitSeachPage", "");
    },
    getDownList() {
      getAddClinicUserDownList({}).then(res => {
        let data = res.data.data;
        this.departmentList = data.departmentList;
        this.optolist = data.positionList;
      });
    },
    seachPage() {
      let c = "";
      this.canNotLogin ? (c = 0) : (c = 1);
      let formData = {};
      formData.page = this.page;
      formData.pageSize = this.pageSize;
      formData.nameOrWorknoOrTeleno = this.searchCriteria;
      formData.canNotLogin = c;
      formData.isDimission = this.isDimission;
      formData.departmentId = this.form.department;
      formData.positionId = this.formInline.position;
      listByFilter(formData).then(res => {
        this.$emit("emitSeachPage", res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.seach_box {
  width: 100%;
  height: 131px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #ffffff;
  padding: 20px 0 0 20px;
  .right_but {
    padding: 12px 50px;
  }
  .el-input,
  .el-select {
    width: 270px;
  }
}
</style>
