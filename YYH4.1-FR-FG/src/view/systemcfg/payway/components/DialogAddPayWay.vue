<template>
  <div class="wrapper DialogAddPayWay" id="DialogAddPayWay">
    <el-dialog
      top="27vh"
      :title="isShow.edit ? '编辑收费方式':'新增收费方式'"
      :visible.sync="isShow.income"
      @open="getDownList"
      width="500px"
      @close="clearData"
      :close-on-click-modal="false"
    >
        <div class="content">
          <div class="form_box">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
              <el-form-item label="收费方式" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item class="account" label="默认计入收支账户" prop="accountId">
                <el-select style="width:100%;" v-model="form.accountId" placeholder="请选择" >
                  <el-option
                    v-for="(item,index) in accountList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item class="card" prop="type">
                <el-radio-group v-model="form.type">
                 <el-radio :label="0">普通卡</el-radio>
                 <el-radio :label="1">充值卡</el-radio>
                 <el-radio :label="2">折扣卡</el-radio>
                 <el-radio :label="3">代金券</el-radio>
               </el-radio-group>
                <!-- <el-checkbox v-model="type">充值卡</el-checkbox> -->
              </el-form-item>

              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2}"
                  placeholder="请输入内容"
                  v-model="form.remark"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">保 存</el-button>
				<el-button @click="clocseDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPaywayDownList, saveOrUpdatePayway,saveOrUpdatePaywayPut, getEeditPayway } from "@/api";
import {
  SYSTEM_HTTP_SUCCESS,
  TYPE_PAYWAY_HASCARD,
  TYPE_PAYWAY_NOCARD
} from "@/constant";
export default {
  components: {},
  props: ["isShow", "payWayId"],
  data() {
    return {
      remark: "",
      type: 0,
      form: {
        name: '',
        remark: '',
        type: 0,
        isCard: 0,
        accountId: '',
      },
      name: null,
      isCard: 0,
      accountList: [],
       rules: {
				name: [
					{required: true,message: '请输入收费方式', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				]
			},
    };
  },
  watch: {
    "isShow.income"() {
      if (this.isShow.edit) {
        this.getEditData();
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    getDownList() {
      getPaywayDownList().then(res => {
        this.list = res.data.data;
        this.accountList = this.list.accountList;
      });
    },
    clearData() {
      this.isShow.edit = false;
      this.isShow.income = false;
      let _this = this;
      this.$nextTick(() => {
        _this.$refs['form'].resetFields();
      })
    },
    clocseDialog() {
      this.clearData();
    },
    getEditData() {
      getEeditPayway({ id: this.payWayId }).then(res => {
        res.data.data.account
          ? (this.form.accountId = res.data.data.account.id)
          : (this.form.accountId = "");
        this.form.name = res.data.data.payWay.name;
        this.form.remark = res.data.data.payWay.remark;

        this.form.type=res.data.data.payWay.type
      });
    },
    saveData() {
      this.$refs['form'].validate((valid) => {
				if (valid) {

          if (this.isShow.edit) {
            this.form.id=this.payWayId
            saveOrUpdatePaywayPut(this.form).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit("refreshList");
                this.clearData();
              }
            }).catch(res => {});
          } else {
            this.form.id=0
            saveOrUpdatePayway(this.form).then(res => {
              if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                this.$emit("refreshList");
                this.clearData();
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
.account{
  margin-bottom:10px;
}
.card{
  margin-bottom:10px;
}
</style>
<style>
.DialogAddPayWay .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
.DialogAddPayWay .account .el-form-item__label{
  line-height: normal;
}
.DialogAddPayWay .el-dialog__body {
  padding: 10px 20px 20px 20px;
}
.DialogAddPayWay .el-dialog__footer {
  padding: 0px 0px 20px 20px;
}
</style>
