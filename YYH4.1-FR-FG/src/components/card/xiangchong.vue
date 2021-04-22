<template>
  <div class="wrapper">
    <el-dialog title="充值" :visible.sync="isShow.xianshi" width="800px" @open="init" :close-on-click-modal="false">
      <div>
        <el-form label-width="40px" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item :style="{width:'800px',marginTop:'-15px'}">
                <b>患者姓名：</b>
                <span>{{str.ownerName}}</span>
                <b style="marginLeft:50px">卡余额：</b>
                <span>{{str.balance}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <p style="color:blue;fontSize:17px;marginLeft:35px;marginTop:-18px">新卡信息</p>
          </el-row>

          <el-row style="marginTop:10px">
            <el-col :span="11">
              <span style="marginLeft:80px">卡号</span>
              <span style="marginLeft:10px">{{str.cardNo}}</span>
            </el-col>
            <el-col :span="11">
              <span style="marginLeft:65px">手机号</span>
              <span style="marginLeft:10px">{{str.telephone}}</span>
            </el-col>
          </el-row>

          <el-row style="marginTop:15px">
            <el-col :span="11">
              <span style="marginLeft:48px">开卡类别</span>
              <span style="marginLeft:15px">{{radio }}</span>
            </el-col>
            <el-col :span="11">
              <span style="marginLeft:55px">充值活动</span>
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
            </el-col>
          </el-row>

          <el-row style="marginTop:10px">
            <el-col :span="11">
              <span style="marginLeft:55px">卡密码</span>
              <span tyle="marginLeft:70px;lineHeight:40px;">***********</span>
            </el-col>
          </el-row>

          <el-row style="marginTop:15px">
            <el-col :span="11">
              <span style="marginLeft:40px">实充金额</span>
              <el-input
                placeholder="请输入"
                v-model="str.chongshi"
                style="width:230px;marginLeft:17px"
                size="small"
                @keyup.enter.native="enterInpFn()"
              ></el-input>
            </el-col>
            <el-col :span="11">
              <span style="marginLeft:55px">收费方式</span>
              <el-select
                v-model="fang"
                placeholder="请选择"
                size="small"
                style="width:150px;marginLeft:17px"
              >
                <el-option
                  v-for="(item,index) in la"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button type="primary" size="small" style="marginLeft:10px" @click="add">新增</el-button>
            </el-col>
          </el-row>

          <el-row v-if="fangshi" style="marginTop:15px">
            <el-col :span="11">
              <span style="marginLeft:40px">实充金额</span>
              <el-input
                placeholder="请输入"
                v-model="chongshi"
                style="width:230px;marginLeft:17px"
                size="small"
              ></el-input>
            </el-col>
            <el-col :span="11">
              <span style="marginLeft:55px">收费方式</span>
              <el-select
                v-model="fang"
                placeholder="请选择"
                size="small"
                style="width:150px;marginLeft:17px"
              >
                <el-option
                  v-for="(item,index) in la"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button type="primary" size="small" style="marginLeft:10px">删除</el-button>
            </el-col>
          </el-row>

          <el-row style="marginTop:15px">
            <el-col :span="11">
              <span style="marginLeft:40px">合计实收</span>
              <span style="marginLeft:20px;color:green">￥{{this.balance}}</span>
            </el-col>
            <el-col :span="11">
              <span style="marginLeft:55px">赠送金额</span>
              <span style="marginLeft:20px;color:blue">￥{{this.song}}</span>
            </el-col>
          </el-row>

          <el-row style="marginTop:15px;">
            <span style="marginLeft:65px;lineHeight:44px">备注</span>
            <el-input
              placeholder="请输入"
              type="textarea"
              v-model="remark"
              style="width:618px;marginLeft:10px"
              size="small"
            ></el-input>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ul style="display:flex;marginTop:-50px">
            <li style="marginLeft:50px">
              <span style="lineHeight:50px">充值金额</span>
              ￥{{this.zong}}
            </li>
            <li class="actives" style="marginLeft:450px;lineHeight:50px">
              <el-button type="primary" size="small" @click="zhi">确定</el-button>
            </li>
            <li style="marginLeft:20px;lineHeight:50px">
              <el-button type="primary" size="small" @click="quxiao">取消</el-button>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rechargecardedit,
  activeylist,
  paywaylist,
  saverechargerecord,
  rechargerecordedit
} from "@/api";
export default {
  components: {},
  props: ["isShow", "e"],
  data() {
    return {
      resource: "",
      region: "",
      zeng:"",
      value2: null,
      radio: "",
      input2: "",
      ming: "",
      fang: "",
      huoe: "",
      str: {},
      la: [],
      huo: [],
      fangshi: false,
      data: [],
      remark: "",
      chongshi: "",
      type: "",
      jin: "",
      song:"",
      zong: "",
      yin:false,
      activityId:"",
      ownerId:"",
      cardId:""
    };
  },
  watch: {},
  computed: {},
  methods: {
     gradeChange( a){
     console.log(a)
        this.huo.map(val => {
            console.log(val)
            if(val.id == a ){
                this.chongshi = val.rechargeMoney
                this.song = val.giveMoney
                this.zhe = val.discount
            }
            return val
        })

        this.zong = parseInt(this.chongshi) + parseInt(this.song);
   },
    zhi() {
      let formData = new FormData();
      formData.append("cardId",this.cardId );
      formData.append("cardType", this.str.cardType);
      formData.append("rechargeMoney", this.chongshi);
      
      formData.append("payWayId", this.fang);
      formData.append("remark", this.remark);
      formData.append("ownerId", this.ownerId);
      if(this.str.cardType == 1){
          formData.append("donationAmount",0);
           formData.append("activityId", this.activityId);
           formData.append("oldActivityId",this.huoe)
      }else{
        formData.append("donationAmount",this.song);
        formData.append("activityId", this.activityId);
      }
     
      formData.append("realRechargeAmount",this.chongshi);
      saverechargerecord(formData).then(res => {
        console.log(res);
        this.$emit("ding");
      });
       this.isShow.xianshi = !this.isShow.xianshi;
    },
    add() {
      this.fangshi = !this.fangshi;
    },
    quxiao() {
      this.isShow.xianshi = !this.isShow.xianshi;
    },
    enterInpFn() {
    //   console.log(this.chongshi);
     let i = ''
       this.huo.map((el, index) => {
        if ( el.id == this.huoe ) {
          i = index
        }
      })
      this.song=this.huo[i].ActivityName.substring(6,9)
      this.jin = this.chongshi;
      this.zong = parseInt(this.jin) + parseInt(this.song);
      console.log(this.zong);
      console.log(this.huo)
      this.jin = this.chongshi;
      console.log(this.zong);
      // spoce.id
      // spoce.discount
    },
    init() {
      console.log(this.e )
      rechargerecordedit({ id: this.e }).then(res => {
      
      this.str= res.data.data;
           console.log(this.str);
           this.activityId = this.str.activityId
           this.ownerId = this.str.ownerId
           this.cardId = this.str.cardId
        if (this.str.cardType === 0) {
          this.radio = "充值卡";
          this.yin = true
        } else {
          this.radio = "折扣卡";
          this.yin = false
        }

        this.type = this.str.cardType;
        activeylist({ id: this.type }).then(res => {
            this.huo = res.data.data;
            console.log(res);
        });
        paywaylist().then(res => {
            this.la = res.data.data;
            console.log(this.la);
        });
      });
   
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../../assets/css/workbench/publicTable.css";

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
.demo-ruleForm {
  width: 800px;
  height: 400px;
}
</style>