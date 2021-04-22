<template>
    <div class="wraper">
        <ul>
          <li  class="top" >
                    <div>
                        <span style="marginLeft:-35px"> 姓名</span>
                        <el-input
                          size="small"
                          v-model="input1"
                          :style="{width:'180px',borderRadius:'20px'}"
                          class="bodrs"
                          >
                        </el-input>
                    </div>

                    <div  style="marginLeft:35px">
                        <span :style="{width:'100px'}"> 咨询日期</span>
                        <el-input
                          size="small"
                          v-model="input2"
                          suffix-icon="el-icon-date"
                          :style="{width:'185px'}"
                          class="bodrs"
                          >
                        </el-input>
                    </div>

                    <div>
                          <el-form :inline="true" :model="formInline" class="demo-form-inline" :style="{marginLeft:'25px'}">
                            <el-form-item label="咨询状态" :style="{width:'300px'}">
                                <el-select v-model="formInline.regions" placeholder="请选择" size="small">
                                  <el-option label="待查询" value="1"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-form> 
                    </div>

                    <div class="right" style="display:flex">
                        <el-row>
                          <el-button type="primary" round  :style="{width:'100px'}"  @click="inquire()">查询</el-button>
                        </el-row>
                        <el-dropdown  :style="{opacity:0}">
                            <el-button type="text">
                              更多筛选<i class="el-icon-arrow-down el-icon-caret-top"></i>
                            </el-button>
                        </el-dropdown>
                    </div>
           </li>
           <li  class="boot" style="marginLeft:45px">
                  <div>
                      <span> 手机号</span>
                        <el-input
                          size="small"
                          v-model="input3"
                          :style="{width:'180px'}"
                          >
                        </el-input>
                  </div>

                   <div :style="{marginLeft:'50px'}">
                      <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="咨询师" :style="{width:'250px',marginTop:'25px'}">
                               <el-select v-model="formInline.region" placeholder="请选择" size="small">
                                    <el-option  v-for="(item,index) in this.user" :key="index" :label="item.name" :value="item.id"></el-option>
                               </el-select>
                          </el-form-item>
                        </el-form> 
                  </div>

                   <div>
                      <el-form :inline="true" :model="formInline" class="demo-form-inline" :style="{marginLeft:'25px'}">
                        <el-form-item label="咨询项目" :style="{width:'280px',marginTop:'25px'}">
                            <el-select v-model="formInline.regioned" placeholder="请选择" size="small">
                               <el-option  v-for="(item,index) in this.project" :key="index" :label="item[1]" :value="item[0]"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-form> 
                  </div>

                   <div style="opacity:0">
                      <el-form :inline="true" :model="formInline" class="demo-form-inline" :style="{marginLeft:'25px'}">
                        <el-form-item label="咨询项目" :style="{width:'280px'}">
                            <el-select placeholder="请选择" size="small">
                            </el-select>
                          </el-form-item>
                        </el-form> 
                  </div>
           </li>
        </ul>
 </div>
</template>
<script>
import { queryClinicUser,queryProject,listCustomered } from "@/api"
export default {
  data() {
    return {
       input1:"",
       input2:'',
       input3:'',
       formInline: {
          user: '',
          region: '',
          regioned:'',
          regions:''
        },
        user:[],
        project:[],
        str:"",
    }
    
  },
  mounted(){
    this.init()
  },
 methods: {
   init(){
     //咨询师
      queryClinicUser({
        positionId:5
      }).then(res => {
        this.user = res.data.data
      })
      //咨询项目
      queryProject().then(res => {
        this.project = res.data.data
        console.log(this.project)
      })
   },
   inquire(){
     console.log(this.formInline.regioned)
     if(this.input2 == ""){
        this.str == ""
     }else{
          this.str == this.input2 + "" + " 00:00:00 " 
     }
     listCustomered({
           name:this.input1,
           phone:this.input3,
           consultationTime:this.str ,
           clinicUser:this.formInline.region,
           consultationProjectId:this.formInline.regioned,
           status:1
      }).then(res => {
        console.log(res)
      })
   }
  }
}
</script>
<style lang="less" scoped>
  ul{
  width: 1300px;
  box-shadow: 0 0 6px 0 #e4e9ff;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  .top{
      display: flex;
      width: 1300px;
      justify-content: center;
      align-items:center;
      height: 60px;
      div{
        margin:0 5px
      }
    }
    
} 

.boot{
      display: flex;
      justify-content: center;
      align-items:center;
      height: 60px;
    }
</style>
