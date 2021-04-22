<template>
  <div class="wrapper">
    <el-dialog title="详情" :visible.sync="isShow.bian" width="800px" @open="init" :close-on-click-modal="false">
      <div>
       <el-form label-width="40px"  class="demo-ruleForm">
            

              <el-row>
                   <el-col :span="11">
                   <el-form-item :style="{width:'800px',marginTop:'-15px'}">
                         <b>患者姓名：</b><span>{{str.patientName}}</span>
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
                          <span style="marginLeft:10px">{{str.cardType}}</span>
                     </el-col>
                     <el-col :span="11">
                       <span style="marginLeft:65px">卡密码</span>
                        <span style="marginLeft:10px">***********</span>
                        <span class="el-dropdown-link"><el-button type="text" size="small" @click="xiu">修改密码</el-button></span>
                      <el-dropdown  :hide-on-click="false" align="right" trigger="click">
                                      <div  style="width:790px;height:90px;marginLeft:-385px;border:1px solid #ccc;" v-if="xiugai">
                                          <div style="marginTop:10px">
                                                    <span style="display:inlineBlock">当前密码</span>
                                                    <el-input placeholder="请输入" v-model="one"  style='width:150px;marginLeft:7px'  size="small"></el-input>
                                                    <span style="marginLeft:10px">新密码</span>
                                                    <el-input placeholder="请输入" v-model="two"  style='width:150px;marginLeft:7px'  size="small"></el-input>
                                                    <span style="marginLeft:10px">确认密码</span>
                                                   <el-input placeholder="请输入" v-model="three"  style='width:150px;marginLeft:7px;marginRight:100px'  size="small"></el-input>
                                           <div>
                                                 <el-button style="marginRight:15px;marginTop:10px" size="small"  type="primary" @click="queding">保存</el-button>
                                                 <el-button  type="primary" size="small" style="marginRight:50px" @click="qu">取消</el-button>
                                            </div>
                                            </div>
                                            
                                    </div>
                             </el-dropdown>
                  </el-col>
              </el-row>

                <el-row style="marginTop:20px">
                      <el-col :span="11">
                          <span style="marginLeft:45px">办卡日期</span><span  style="marginLeft:20px">{{str.createTime}}</span>
                          
                     </el-col>
                     <el-col :span="11">
                          <span style="marginLeft:65px">状态</span><span   style="marginLeft:20px;color:blue">正常</span>
                         
                    </el-col>
              </el-row>

               <el-row style="marginTop:20px;">
                            <span style="marginLeft:60px;lineHeight:44px;marginRight:20px">操作人</span>{{str.creatorName}}
                </el-row>
                
                 <el-row style="marginTop:10px;">
                            <span style="marginLeft:67px;lineHeight:44px;marginRight:20px">备注</span>{{str.remark}}
                            <!-- <el-input placeholder="请输入" type="textarea" v-model="ming"  style='width:618px;marginLeft:10px'  size="small"></el-input> -->
                </el-row>

            </el-form>   
            <div slot="footer" class="dialog-footer" >
              <ul style="display:flex;marginTop:10px">
                <li style="marginLeft:50px"><span style="lineHeight:50px">充值金额</span>￥888</li>
                <li class="actives" style="marginLeft:450px;lineHeight:50px"><el-button type="primary" size="small" @click=" xiangqing">确定</el-button></li>
                <li style="marginLeft:20px;lineHeight:50px"><el-button  type="primary" size="small" @click="xiangqing">取消</el-button></li>
              </ul>
            </div> 
        </div>
    </el-dialog>
     
  </div>
</template>

<script>
import { rechargecardedit,resetrechargecardpassword} from "@/api"
export default {
  components: {},
  props: ['isShow','b'],
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
      three:""
    };
  },
  watch: {},
  computed: {},
  methods: {
      init(){
         rechargecardedit({id:this.b}).then( res => {
            //  console.log(res.data.data)
             this.str = res.data.data
             console.log(this.str )
         })
      },
      xiu(){
          this.xiugai = !this.xiugai 
      },
      qu(){
          this.xiugai = !this.xiugai
      },
      xiangqing(){
        this.isShow.detail = !this.isShow.detail
      },
      queding(){
          this.xiugai = !this.xiugai
          console.log(this.one,this.three,this.three)
            let formData = new FormData();
            formData.append("id",this.str.id);
            formData.append("passWord",this.one);
            formData.append("newPassWord",this.two);
           if(this.two === this.three){
              resetrechargecardpassword(formData).then(res => {
                  console.log(res)
              })
          }else{
              alert("输入错误")
          }
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