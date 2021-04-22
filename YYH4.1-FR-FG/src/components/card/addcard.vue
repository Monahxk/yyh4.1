<template>
  <div class="wrapper">
    <el-dialog
      title="新办卡"
      :visible.sync="isShow.expenditure"
      width="960px"
      @open="init"
      @close="closeFn"
      :close-on-click-modal="false"
    >
      <div>
        <el-form label-width="100px" class="demo-ruleForm">
          <el-row style="marginTop:-25px">
            <el-col :span="11">
              <el-form-item :style="{width:'400px'}" label="请输入姓名">
                <el-autocomplete
                  style="width:200px"
                  popper-class="my-autocomplete"
                  v-model="patientId"
                  :trigger-on-focus="false"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                >
                  <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
                  <template slot-scope="{ item }">
                    <div class="name_box">
                      <span>{{ item.patientName }}</span>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item>
                <!--<el-button  size="small"  style="marginLeft:25px" type="primary">新建患者</el-button>-->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <p
              style="color:blue;fontSize:17px;marginLeft:35px;marginTop:-18px; padding:20px 0;"
            >新卡信息</p>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="卡号" :required="true">
                <el-input
                  placeholder="请输入"
                  v-model="kahao"
                  style="width:230px;marginLeft:10px"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="手机号" :required="true">
                <el-input
                  placeholder="请输入"
                  v-model="telephone"
                  style="width:230px;marginLeft:10px"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="开卡类别" :required="true">
                <el-radio-group style="marginLeft:10px" v-model="resource" change="xuan">
                  <el-radio label="0">充值卡</el-radio>
                  <el-radio label="1">折扣卡</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="充值活动" :required="true">
                <el-select
                  v-model="huoe"
                  placeholder="请选择"
                  size="small"
                  style="width:150px;marginLeft:17px"
                  @change="gradeChange"
                >
                  <el-option
                    v-for="(item,index) in huo"
                    :key="index"
                    :label="item.ActivityName"
                    :value="item.id"
                  >{{item.ActivityName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="卡密码" :required="true">
                <el-input
                  placeholder="请输入"
                  v-model="password"
                  style="width:230px;marginLeft:17px"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="确认密码" :required="true">
                <el-input
                  placeholder="请输入"
                  v-model="ming"
                  style="width:230px;marginLeft:10px"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="充卡金额" :required="true">
                <el-input
                  placeholder="请输入"
                  v-model="chongshi"
                  style="width:230px;marginLeft:17px"
                  size="small"
                  @keyup.enter.native="enterInpFn()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="收费方式">
                <el-select
                  v-model="fang"
                  placeholder="请选择"
                  size="small"
                  style="width:180px;marginLeft:17px"
                >
                  <el-option
                    v-for="(item,index) in la"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-button type="primary" size="small" style="marginLeft:10px">新增</el-button> -->
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="合计实收">
                <span style="marginLeft:20px;color:green">￥{{this.zong}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="赠送金额">
                <span>￥{{this.song}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="备注">
                <el-input
                  placeholder="请输入"
                  type="textarea"
                  v-model="remark"
                  style="width:618px;marginLeft:10px"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <ul class="wrap_tab">
            <li>
              <span>充值金额</span>
              ￥{{this.zong}}
            </li>
            <li class="actives">
              <el-button type="primary" size="small" @click="queok">确定</el-button>
              <el-button type="primary" size="small"  @click="quxiao">取消</el-button>
            </li>
          </ul>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saverechargecard, patientlist, activeylist, paywaylist } from "@/api";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      resource: "",
      region: "",
      value2: null,
      value6: "",
      radio: 1,
      input2: "",
      ming: "",
      list: [],
      huo: [],
      la: [],
      fang: "",
      telephone: "",
      huoe: "",
      password: "",
      kahao: "",
      chongshi: "",
      type: "",
      jin: "",
      remark: "",
      remark: "",
      zong: "",
      huodong: "",
      song: "",
      shichong: "",
      zhe: "",
      patientId: "",
      a: ""
    };
  },
  watch: {
    resource(a) {
      console.log(a);
      if (a == 0) {
        activeylist({ id: 0 }).then(res => {
          this.huo = res.data.data;
          console.log(this.huo);
        });
      } else {
        activeylist({ id: 1 }).then(res => {
          this.huo = res.data.data;
          console.log(this.huo);
        });
      }
    }
  },
  computed: {},
  methods: {},
  mixins: [],
  methods: {
    closeFn() {
      (this.value6 = ""),
        (this.kahao = ""),
        (this.telephone = ""),
        (this.resource = ""),
        (this.huoe = ""),
        (this.password = ""),
        (this.ming = ""),
        (this.shichong = ""),
        (this.fang = ""),
        (this.remark = "");
      this.zong = "";
    },
    enterInpFn() {
      console.log(parseInt(this.shichong));

      this.zong = parseInt(this.shichong);
    },
    gradeChange(a) {
      console.log(a);
      this.huo.map(val => {
        console.log(val);
        if (val.id == a) {
          this.shichong = val.rechargeMoney;
          this.song = val.giveMoney;
          this.zhe = val.discount;
        }
        return val;
      });

      this.zong = parseInt(this.shichong) + parseInt(this.song);
    },
    // querySearch(queryString, cb) {
    //     var restaurants = this.restaurants;
    //     var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
    //     // 调用 callback 返回建议列表的数据
    //     cb(results);

    //   },
    querySearch(queryString, cb) {
      patientlist({ patientName: this.patientId }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          let _D = res.data.data;
          let dataArr = _D.map((val, index) => {
            // val.id = val.patientTO.id
            return val;
          });
          cb(dataArr);
        }
      });
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    getSelectData() {},
    handleSelect(val) {
      console.log(val);
      this.patientId = val.patientName;
      this.a = val.id;
    },
    handleIconClick() {},
    quxiao() {
      this.isShow.expenditure = !this.isShow.expenditure;
    },
    queok() {
      console.log(this.fang);
      //  return
      //  这里是提交数据
      //  kahao卡号
      // telephone 电话
      // resource 开卡列表
      // huoe充值活动
      // password 卡密码
      // ming 确认密码
      // chongshi 充值卡金额

      if (!this.kahao) {
        this.$message.error("请输入卡号");
        return;
      }
      if (!this.telephone) {
        this.$message.error("请输入电话");
        return;
      }
      if (!this.resource) {
        this.$message.error("请选择开卡类别");
        return;
      }
      if (!this.huoe) {
        this.$message.error("请选择充值活动");
        return;
      }

      if (!this.password) {
        this.$message.error("请输入卡密码");
        return;
      }

      if (!this.ming) {
        this.$message.error("请输入确认卡密码");
        return;
      }

      if (this.ming !== this.password) {
        this.$message.error("俩次密码输入的不一样");
        return;
      }

      if (!this.chongshi) {
        this.$message.error("请输入充值卡金额");
        return;
      }

      let formData = new FormData();
      formData.append("cardNo", this.kahao);
      formData.append("patientId", this.a);
      formData.append("telephone", this.telephone);
      formData.append("balance", this.zong);
      formData.append("activityId", this.huoe);
      formData.append("remark", this.remark);
      formData.append("cardType", this.resource);
      formData.append("passWord", this.password);
      formData.append("realRechargeAmount", this.shichong);
      if (this.resource == 0) {
        formData.append("donationAmount", this.song);
      } else {
        formData.append("donationAmount", 0);
      }

      formData.append("payWayId", this.fang);
      saverechargecard(formData).then(res => {
        console.log(res);
        if (res.data.data.code !== 200) {
          this.error = res.data.data
          this.$message({
            type: "success",
            message: this.error
          });
        } else {
          this.$emit("queok");
        }
      });
      this.isShow.expenditure = !this.isShow.expenditure;
    },
    init() {
      patientlist({
        patientName: ""
      }).then(res => {
        console.log(res.data.data);
        this.list = res.data.data;
        console.log(this.list);
      });

      paywaylist().then(res => {
        this.la = res.data.data;
        console.log(this.la);
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/workbench/publicTable.css";
.wrap_tab {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
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

</style>