<template>
  <div class="wrapper">
    <el-dialog title="编辑" :visible.sync="isShow.edit" width="800px" @open="init" :close-on-click-modal="false">
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
                           <el-input v-model="str.telephone" style="width:200px" placeholder=""></el-input>
                          
                  </el-col>
              </el-row>

              <el-row style="marginTop:25px">
                      <el-col :span="11">
                          <span style="marginLeft:50px">开卡类别</span>
                          <span style="marginLeft:10px">{{radio}}</span>
                     </el-col>
                     <el-col :span="11">
                       <span style="marginLeft:65px">卡密码</span>
                        <span style="marginLeft:10px">***********</span>
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
                            <span style="marginLeft:67px;lineHeight:44px;marginRight:20px">备注</span>
                            <el-input placeholder="请输入" type="textarea" v-model="str.remark"  style='width:618px;marginLeft:10px'  size="small"> {{str.remark}}</el-input>
                </el-row>

            </el-form>   
            <div slot="footer" class="dialog-footer" >
              <ul style="display:flex;marginTop:10px">
                <!-- <li style="marginLeft:50px"><span style="lineHeight:50px">充值金额</span>￥888</li> -->
                <li class="actives" style="marginLeft:550px;lineHeight:50px"><el-button type="primary" size="small" @click="xiangding">确定</el-button></li>
                <li style="marginLeft:20px;lineHeight:50px"><el-button  type="primary" size="small" @click="quxiao">取消</el-button></li>
              </ul>
            </div> 
        </div>
    </el-dialog>
     
  </div>
</template>

<script>
import { rechargecardedit,updaterechargecard} from "@/api"
export default {
  components: {},
  props: ['isShow','d'],
  data() {
    return {
      resource:"",
      region:"",
      value2: null,
      radio:1,
      input2:"",
      ming:"",
      str:{},
      one:"",
      two:"",
      three:"",
      radio:"",
      error:""
    };
  },
  watch: {},
  computed: {},
  methods: {
      init(){
          console.log(this.d)
         rechargecardedit({id:this.d}).then( res => {
            //  console.log(res.data.data)
             this.str = res.data.data
             console.log(this.str )
              if(this.str.cardType == 0){
                 this.radio = "充值卡"
             }else{
                 this.radio = "折扣卡"
             }
         })
      },
      xiangding(){
        
         let formData = new FormData();
        formData.append("id", this.str.id);
        formData.append("telephone", this.str.telephone);
        formData.append("remark", this.str.remark);
        updaterechargecard(formData).then(res => {
           console.log(res)
           this.isShow.edit = !this.isShow.edit
           if(res.data.code == 201){
            
             this.error = res.data.data
              console.log(this.error)
             this.$message({
                type: 'info',
                message: this.error
              });    
              
           }
           this.$emit("xiangding")
        })
      },
     quxiao(){
        this.isShow.edit = !this.isShow.edit
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