<template>
  <div class="wrapper register" id="register">
    <el-dialog title="转诊" :visible.sync="isShow.show" width="960">
      <div class="add_reg">
        <div class="form_box">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="交易时间">
                  <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="退款时间">
                  <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="11">
                <el-form-item label="退款类型">
                  <el-select v-model="form.region" placeholder="请选择" style="width:220px;">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="退款单号">
                  <el-input style="width:220px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="11">
                <el-form-item label="金额">
                  <el-input style="width:220px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="操作员">
                  <el-select v-model="form.region" placeholder="请选择" style="width:220px;">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="textarea3"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives item">
            <span>审批通过</span>
          </li>
          <li class="item">
            <span>驳回</span>
          </li>
          <li class="item" @click="isShow.show = !isShow.show">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      form: {
        region: ""
      },
      textarea3: "",
      a: true,
      value1:null
    };
  },
  watch: {},
  computed: {},
  methods: {},
  mixins: [],
  mounted() {}
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
    justify-content: flex-end;
    .btns_wrap {
      display: flex;
      justify-content: flex-end;
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
<style>
.register .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
</style>
