<!--
@Author: ZJZ
@Date:   2019-08-07
@Filename: DialogAddDiscount.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-08
-->

<template>
  <div class="wrapper DialogAddDiscount" id="DialogAddDiscount" @open="fn">
    <el-dialog
      title="新增折扣权限"
      :visible.sync="isShow.register"
      width="400px"
      top='30vh'
      :close-on-click-modal="false"
      @closed="closedFn"
    >
      <el-form ref="form" :model="form" label-width="56px" :rules="rules">
        <el-form-item label="科室"  prop="region">
          <el-select style="width:100%;" v-model="form.region" placeholder="请选择">
            <el-option
              v-for="(item,index) in this.deptList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="医生" prop="doctorId">
          <el-select style="width:100%;" v-model="form.doctorId" placeholder="请选择">
            <el-option
              v-for="(item,index) in this.doctorList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="折扣" prop="discount">
          <el-input v-model="form.discount">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div class="btns_wrap1"></div>
        <el-button type="primary" @click="que">保存</el-button>
        <el-button @click="isShow.register = !isShow.register">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDownList, saveDiscountPvg } from "@/api";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      form: {
        discount: "",
        doctorId: "",
        region: "",
        id:''
      },
      rules: {
        discount: [
          { required: true, message: '折扣不能为空', trigger: 'blur' },
          {
            pattern:/^([0-9]|[1-9][0-9]|100)$/,
            message: "折扣在0-100之间",
            trigger: "blur"
          }
        ],
        region: [
          { required: true, message: '请选择科室', trigger: 'change' },
        ],
        doctorId: [
          { required: true, message: '请选择科室', trigger: 'change' },
        ],
      },
      textarea3: "",
      a: true,
      data: {},
      deptList: [],
      doctorList: [],
      sed: 0,
      arr: [],

      shu: "100"
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.fn();
  },
  methods: {
    closedFn() {
      this.$refs["form"].resetFields();
    },
    fn() {
      getDownList({}).then(res => {
        this.data = res.data.data;
        this.deptList = this.data.deptList;
        this.doctorList = this.data.doctorList;
      });
    },
    que() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          saveDiscountPvg(this.form).then(res => {
            this.$emit("que");
          });
          this.isShow.register = !this.isShow.register;
        } else {
          return false;
        }
      });

    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .blue {
    cursor: pointer;
    color: #3b78fd;
  }
  .form_box {
    padding-top: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background: rgb(247, 245, 249);
    .btns {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 36px;
      li {
        cursor: pointer;
        width: 100px;
        height: 36px;
        margin-left: 20px;
        color: #3b78fd;
        border: 1px solid #3b78fd;
      }
      li:nth-child(1) {
        color: #fff;
        background: #3b78fd;
      }
    }
  }
  .content_user {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .user_msg {
      display: flex;
      li {
        margin-right: 30px;
      }
    }
  }
  .add_reg {
    height: 400px;
    padding: 0 20px;
    border-top: 1px solid #eee;
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    .btns_wrap {
      display: flex;
      justify-content: center;
      text-align: center;
      line-height: 32px;
      .item {
        cursor: pointer;
        color: #3b78fd;
        width: 88px;
        height: 32px;
        border: 1px solid #3b78fd;
        margin-right: 20px;
      }
      .actives {
        color: #fff;
        background-image: linear-gradient(
          110deg,
          #4d9eff,
          #3c79fd 99%,
          #3b78fd
        );
      }
    }
  }
}
</style>
<style lang="less">
.DialogAddDiscount .el-dialog__body {
  padding: 10px 20px;
}
.DialogAddDiscount .el-dialog__footer {
  padding: 0px 20px 10px 40px;
}
</style>
