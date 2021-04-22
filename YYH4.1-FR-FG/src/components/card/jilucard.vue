<template>
  <div class="wrapper">
    <el-dialog title="详情" :visible.sync="isShow.jilu" width="800px" @open="init" :close-on-click-modal="false">
      <div>
       <el-form label-width="40px"  class="demo-ruleForm">
            

              <el-row>
                   <el-col :span="11">
                   <el-form-item :style="{width:'800px',marginTop:'-15px'}">
                         <b>患者姓名：</b><span>{{str.ownerName}}</span>
                         <b style="marginLeft:50px">卡余额：</b><span>{{str.balance}}</span>
                   </el-form-item>
                </el-col>
              </el-row>
            
              
              <el-row >
                  <p style="color:blue;fontSize:17px;marginLeft:35px;marginTop:-18px">充值卡信息</p>
              </el-row>
               
             <el-row style="marginTop:25px">
                      <el-col :span="11">
                          <span style="marginLeft:80px">卡号</span>
                          <span style="marginLeft:10px">{{str.cardNo}}</span>
                     </el-col>
                     <el-col :span="11">
                           <span style="marginLeft:65px">手机号</span>
                          <span style="marginLeft:10px">{{str.telephone}}</span>
                  </el-col>
              </el-row>

              <el-row style="marginTop:25px">
                      <el-col :span="11">
                          <span style="marginLeft:50px">开卡类别</span>
                          <span style="marginLeft:10px">{{radio}}</span>
                     </el-col>
                     <el-col :span="11">
                       <span style="marginLeft:65px">充值卡活动</span>
                        <span style="marginLeft:10px">{{str.actitvityName}}</span>
                  </el-col>
              </el-row>
              

                <el-row style="marginTop:20px">
                      <el-col :span="11">
                          <span style="marginLeft:45px">实收金额</span><span  style="marginLeft:20px">{{str.realRechargeAmount}}</span>
                          
                     </el-col>
                     <el-col :span="11">
                          <span style="marginLeft:65px">收费方式</span><span   style="marginLeft:20px;color:blue">{{str.payWayName}}</span>
                         
                    </el-col>
              </el-row>

                 <el-row style="marginTop:20px">
                      <el-col :span="11">
                          <span style="marginLeft:45px">合计实收</span><span  style="marginLeft:20px">{{str.balance}}</span>
                          
                     </el-col>
                     <el-col :span="11">
                          <span style="marginLeft:65px">赠送金额</span><span   style="marginLeft:20px;color:blue">{{str.donationAmount}}</span>
                         
                    </el-col>
              </el-row>
                
                 <el-row style="marginTop:10px;">
                            <span style="marginLeft:67px;lineHeight:44px;marginRight:20px">备注</span>{{str.remark}}
                </el-row>

            </el-form>   
            <div slot="footer" class="dialog-footer" >
              <ul style="display:flex;marginTop:10px">
                <li style="marginLeft:50px"><span style="lineHeight:50px">充值金额</span>￥{{str.rechargeMoney}}</li>
                <li class="actives" style="marginLeft:450px;lineHeight:50px"><el-button type="primary" size="small" @click=" xiangqing">确定</el-button></li>
                <li style="marginLeft:20px;lineHeight:50px"><el-button  type="primary" size="small" @click="quxiao">取消</el-button></li>
              </ul>
            </div> 
        </div>
    </el-dialog>
     
  </div>
</template>

<script>
import monment from "moment";
import { rechargerecordedit,resetrechargecardpassword,saverechargerecord} from "@/api"
export default {
  components: {},
  props: ['isShow','a'],
  data() {
    return {
      resource:"",
      region:"",
      value2: null,
      radio:1,
      input2:"",
      ming:"",
      xiugai:false,
      str:{},
      one:"",
      two:"",
      three:"",
      radio:""
    };
  },
  watch: {},
  computed: {},
  methods: {
          getTime(t) {
         return monment(t).format("YYYY-MM-DD");
  },
      init(){
         rechargerecordedit({id:this.a}).then( res => {
            //  console.log(res.data.data)
             this.str = res.data.data
             console.log(this.str )
        //        let str   = _D.map( val => {
        //     val.cardNo = val.rechargeCard.cardNo
        //     val.telephone = val.rechargeCard.telephone
        //     return val
        //   }) 
              if(this.str.cardType == 0){
                 this.radio = "充值卡"
             }else{
                 this.radio = "折扣卡"
             }
         })
      },
      quxiao(){
        this.isShow.jilu = !this.isShow.jilu
      },
      xiangqing(){
        this.isShow.jilu = !this.isShow.jilu
      }, 
      
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
.box{
       width: 700px;
       height: 170px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        margin-left: 15px;
       background-color: #ffffff;
       p{
        width:100%;
        height: 40px;
        background-color: #f7f9ff;
        padding-left: 35px;
        box-sizing: border-box;
        line-height: 44px;
        color:#000;
       }
  }
  .demo-ruleForm{
    width: 800px;
    height: 400px
  }
</style>