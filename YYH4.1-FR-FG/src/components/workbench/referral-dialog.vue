<template>
  <div class="wrapper register" id="register">
    <el-dialog title="转诊" :visible.sync="isShow.referral" width="960">
      <div>
        <!--  -->
        <div class="content_user">
          <ul class="user_msg">
            <li><span>患者姓名：</span><span>张三</span></li>
            <li><span>病历号：</span><span>2015899521</span></li>
            <li><span>手机号：</span><span>155555555555</span></li>
          </ul>
          <div>
            <span class="blue">转诊</span>
          </div>
        </div>

        <div class="add_reg">
          <div class="header">
            <span>转诊</span>
          </div>
          <div class="form_box">
             <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="转诊原因">
                     <el-select v-model="form.region" placeholder="请选择">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="转诊科室">
                     <el-select v-model="form.region" placeholder="请选择">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row>
                <el-col :span="11">
                  <el-form-item label="主治医生">
                     <el-select v-model="form.region" placeholder="请选择">
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
                      v-model="textarea3">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
             </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="btns_wrap">
          <span class="item">排班查询</span>
        </div>
        <ul class="btns_wrap">
          <li class="actives item"><span>确认挂号</span></li>
          <li class="item" @click="isShow.register = !isShow.register"><span>取消</span></li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['isShow'],
  data () {
    return {
      form: {
        region:''
      },
      textarea3:'',
      a: true
    }
  },
  watch: {},
  computed: {},
  methods: {},
  mixins: [],
  mounted () {}
}
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
    background: rgb(247,245,249);
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
    padding: 0 20px ;
    .user_msg {
      display: flex;
      li {
        margin-right: 30px;
      }
    }
  }
  .add_reg {
    height: 400px;
    padding: 0 20px ;
    .header {
      height: 60px;
      background: rgb(247,245,249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
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
        background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
      }
    }
  }
}
</style>
<style>
.register  .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
</style>
