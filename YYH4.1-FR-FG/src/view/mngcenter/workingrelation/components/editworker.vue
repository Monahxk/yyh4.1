<template>
  <div class="wrapper editworker">
    <el-dialog
      title="编辑工作关系"
      :visible.sync="isShow.bian"
      width="440px"
      @open="fn"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="classRules"
        class="demo-ruleForm"
      >
        <el-form-item label="岗位">
          <el-input style="width" :disabled="true" placeholder="医生"></el-input>
        </el-form-item>

        <el-form-item label="员工"  prop="doctorId">
          <el-select :style="width" :disabled="true"  v-model="form.doctorId" placeholder="请选择">
            <el-option
              v-for="(item,index) in this.str"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级医生" prop="superiorId">
          <el-select :style="width" v-model="form.superiorId" placeholder="请选择">
            <el-option
              v-for="(item,index) in this.str"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="辅助护士" prop="aidNurseId">
          <el-select :style="width" v-model="form.aidNurseId" placeholder="请选择">
            <el-option
              v-for="(item,index) in this.strd"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives" @click="quedd()">
            <span>确定</span>
          </li>
          <li @click="quxiao()">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addWorkingRelation,
  updataWorkingRelation,
  editWorkingRelation
} from "@/api";
export default {
  components: {},
  props: ["isShow", "sed"],
  data() {
    return {
      width: "width:100%",
      form: {
        doctorId: "",
        aidNurseId: "",
        superiorId: ""
      },
      str: "",
      strd: "",
      arr: "",
      list: [],
      classRules: {
        doctorId: [{ required: true, message: "请选择员工", trigger: "blur" }],
        superiorId: [
          { required: true, message: "请选择上级", trigger: "change" }
        ],
        aidNurseId: [{ required: true, message: "请选择护士", trigger: "blur" }]
      }
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    fn() {
      editWorkingRelation({
        id: this.sed
      }).then(res => {
        this.str = res.data.data.doctorList;
        this.strd = res.data.data.aidNurseList;
        this.arr = res.data.data.doctorList;
        this.form.superiorId = res.data.data.wRelation.superiorId;
        this.form.doctorId = res.data.data.wRelation.doctorId;
        this.form.aidNurseId = res.data.data.wRelation.aidNurseId;
      });
    },
    quedd() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form)
          updataWorkingRelation(this.form).then(res => {
            if (res.data.code == 200) {
              this.isShow.bian = !this.isShow.bian;
              this.$emit("quedd");
            }
          });
        }
      });
    },
    quxiao() {
      this.isShow.bian = !this.isShow.bian;
      this.$refs["form"].resetFields();
    }
  },
  mixins: []
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
.dialog-footer {
  text-align: center;
}
</style>
<style>
.editworker .el-dialog__body {
  padding: 10px 20px 20px 20px;
}
.editworker .el-dialog__footer {
  padding: 0px 0px 20px 20px;
}
</style>