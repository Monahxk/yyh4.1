<template>
  <div class="wrapper DialogAddPayWay" id="DialogAddPayWay">
    <el-dialog
      top="27vh"
      :title="isShow.edit ? '编辑收支账户':'新增收支账户'"
      :visible.sync="isShow.expenditure"
      width="440px"
      @close="clear"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form_box">
          <el-form ref="form" :model="form" :rules="rules"  label-width="80px">
            <el-form-item label="收支账户" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="收支账号" prop="accountNumber">
              <el-input v-model="form.accountNumber"></el-input>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows:2}"
                placeholder="请输入内容"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrUpdateAccountData">保 存</el-button>
				<el-button @click="closeDialog">取 消</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveOrUpdateAccount,saveOrUpdateAccountPut, getEditAccount } from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: ["isShow", "accountId"],
  data() {
    return {
      remark: "",
      checked: true,
      form: {
        name: '',
        accountNumber: '',
        remark: ''
      },
      rules: {
				name: [
					{required: true,message: '请输入收支账户', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				]
			},
    };
  },
  watch: {
    "isShow.expenditure"() {
      if (this.isShow.edit) {
        this.getEditAccountData();
      }
    }
  },
  computed: {},
  methods: {
    clear() {
      this.isShow.edit = false;
      this.isShow.expenditure = false;
      let _this = this;
      this.$nextTick(() => {
        _this.$refs['form'].resetFields();
      })
    },
    closeDialog() {
      this.clear();
    },
    getEditAccountData() {
      getEditAccount({ id: this.accountId }).then(res => {
        this.form.name = res.data.data.name;
        this.form.accountNumber = res.data.data.accountNumber;
        this.form.remark = res.data.data.remark;
      });
    },
    saveOrUpdateAccountData() {
      this.$refs['form'].validate((valid) => {
				if (valid) {
          let formData = new FormData();
          if (this.isShow.edit) {
            this.form.id=this.accountId
            saveOrUpdateAccountPut(this.form).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit("refreshList");
                this.clear();
              }
            }).catch(res => {});
          } else {
            this.form.id=0
            saveOrUpdateAccount(this.form).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit("refreshList");
                this.clear();
              }
            }).catch(res => {});
          }


				} else {
					console.log('error submit!!');
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
  .content {
    padding: 0 20px;
    border-top: 1px solid #eee;
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content:center;
    .btns_wrap {
      display: flex;
      justify-content:center;
      text-align:center;
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
<style>
.DialogAddPayWay .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
.DialogAddPayWay .el-dialog__body {
  padding: 10px 20px 20px 20px;
}
.DialogAddPayWay .el-dialog__footer {
  padding: 0px 0px 20px 20px;
}
</style>
