<!--
@Author: ZJZ
@Date:   2019-08-14
@Filename: Addapproval.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-12
-->

<template>
  <div class="wrapper">
    <div class="Addapproval">
      <div class="header">
        <router-link :to="{path:'ApprovalCfg'}">
          <span  class="el-icon-back"></span>
        </router-link>

        <p>审批流设置</p>
        <el-button @click='rulesFormFun' type="primary">完成</el-button>
      </div>
      <div class="content">
        <div class="top">
          <el-form :model="rulesForm" ref="rulesForm" label-width="170px" :inline="true" :rules="rules" class="demo-form-inline">
            <el-form-item label="审批流名称" prop="approvalCfg.name">
              <el-input class="approvable_type" v-model="rulesForm.approvalCfg.name" placeholder="请输入审批流名称"></el-input>
            </el-form-item>
            <el-form-item label="关联业务" prop="approvableTypeId">
              <el-select class="approvable_type" v-model="rulesForm.approvableTypeId" filterable multiple :multiple-limit='5' @change='approvableTypeIdChange'>
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, index) of typeList"
                  :key="index" :disabled='!item.choosable'>
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6;margin-left:50px;margin-right:30px; font-size: 13px">{{ item.description }}</span>
                  </el-option>
              </el-select>
            </el-form-item>
            <div class="content_chunk">
              <ul>
                <li>
                  <p class="title">提交人</p>
                  <p style="padding-left:15px;">提交节点</p>
                  <div class="bottom">
                    <img class="bottom-arrows" src="../../../assets/img/bottom-arrows.png" alt="">
                    <img class="add-btn" @click='addNode(0)' src="../../../assets/img/add-btn.png" alt="">
                  </div>
                </li>
                <li class="approval_chunk" v-for='(item,index) in rulesForm.approvalNodeList' @click='editNode(item,index)'>
                  <p class="title">
                    <el-input readonly
                      placeholder="请选择审批人"
                      suffix-icon="el-icon-arrow-right"
                      v-model="item.approverListText"></el-input>
                    </el-form-item>
                  </p>
                  <p>
                    <el-form-item>
                    <el-input readonly
                      placeholder="请输入节点名称" class="approval_node_name" v-model="item.name"></el-input>
                    </el-form-item>
                    <i @click.stop='del(item,index)' class="del">×</i>
                  </p>
                  <div class="bottom">
                    <img class="bottom-arrows" src="../../../assets/img/bottom-arrows.png" alt="">
                    <img class="add-btn" @click.stop='addNode(index+1)' src="../../../assets/img/add-btn.png" alt="">
                  </div>
                </li>

                <li>
                  <p class="title">流程结束</p>
                </li>

              </ul>
            </div>
            <p>注：节点间为顺序审批，节点内为并行审批，即完成审批需要设置的所有节点全部审批通过。</p>
          </el-form>
        </div>
      </div>

      <el-dialog
        title="节点设置"
        :visible.sync="itemDialogFla"
        width="35%" class="nodeDialog"
        center>
        <div class="content">
          <el-form :model="nodeForm" :rules="nodeRules" ref="nodeForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="审批节点" prop="nodeName">
              <el-input v-model="nodeForm.nodeName" placeholder="请输入审批节点"></el-input>
            </el-form-item>

            <el-form-item label="审批人" prop="approverName">
              <el-select v-model="nodeForm.approverName" filterable multiple :multiple-limit='5' placeholder="请选择审批人">
                <el-option
                  :label="item.employee.name"
                  :value="item.employee.id"
                  v-for="(item, index) of membershipList"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="itemForm('nodeForm')">保存</el-button>
          <el-button @click="itemDialogFla = false">取消</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>



<script>
import {approvalcfgdo,approvalcfgdoId,approvalcfgAdd,approvalcfgPut} from "@/api";
export default {
  name:'caseTemplate',
  data() {
      return {
        id:'',
        itemDialogFla:false,
        dataList: [],
        typeList: [],//关联业务
        membershipList: [],//员工
        nodeIndex:'',//缓存节点下标
        rulesForm:{
          // name:"",
          // approvableTypeId:'',
          approvableTypeId:[],//关联业务选中

          approvalCfg:{ //ApprovalCfg实体
            name:'',
          },
          approvalFuncList:[ //配置项的关联业务
            // {
            //   approvableTypeId:1,
            // },
          ],
          approvalNodeList:[//配置项对应的审批流各节点
            {
              // id:'',
              name:'节点1',
              approverListText:'',
              approverList:[]
            },
          ]
        },
        rules: {
           'approvalCfg.name': [
             { required: true, message: '请输入审批流名称', trigger: 'blur' }
           ],
           approvableTypeId: [
             { required: true, message: '请选择关联业务', trigger: 'change' }
           ],

         },
         nodeForm: { //表单
           nodeName: '',
           approverName: [],
         },
         nodeRules: {
            approverName: [
              { required: true, message: '请选择审批人', trigger: 'change' }
            ],
            nodeName: [
              { required: true, message: '请输入审批节点名称', trigger: 'blur' }
            ],

          },


      }
  },
  mounted() {

    this.id=this.$route.query.id
    if(this.id){
      approvalcfgdoId(this.id).then(res=>{
        this.typeList=res.data.data.typeList
        this.membershipList=res.data.data.membershipList
        this.rulesForm.approvalCfg=res.data.data.approvalCfg
        this.rulesForm.approvalFuncList=res.data.data.approvalFuncList
        this.rulesForm.approvalNodeList=res.data.data.approvalNodeList
        this.rulesForm.approvalNodeList.map((item,index)=>{
          item.approverListText=''
          item.approverList.map((item2,index)=>{
            if(!index){
              item.approverListText +=item2.name
            }else{
              item.approverListText += '、'+item2.name
            }
          })
        })
        this.rulesForm.approvalFuncList.map(res=>{
          this.rulesForm.approvableTypeId.push(res.approvableTypeId)
        })
      })
    }else{
      approvalcfgdo().then(res=>{
        this.typeList=res.data.data.typeList
        this.membershipList=res.data.data.membershipList
      })
    }
  },
  methods: {
    rulesFormFun(){
      this.$refs['rulesForm'].validate((valid) => {
        if (valid) {
          console.log(this.rulesForm)
          if(this.id){
            approvalcfgPut(this.rulesForm).then(res=>{
              if(res.data.code==200){
                this.$router.push('ApprovalCfg')
              }
            })
          }else{
            if(!this.rulesForm.approvalNodeList[0].name){
              this.$message.error('请填写节点信息');
              return
            }
            approvalcfgAdd(this.rulesForm).then(res=>{
              if(res.data.code==200){
                this.$router.push('ApprovalCfg')
              }
            })
          }

        } else {
          return false;
        }
      });
    },
    approvableTypeIdChange(val){
      let _this=this
      _this.rulesForm.approvalFuncList=[]
      _this.rulesForm.approvableTypeId.map((item,index)=>{
        this.rulesForm.approvalFuncList.push({approvableTypeId:item})

      })

    },
    addNode(val){
      let _this=this
      this.itemDialogFla=true
      this.nodeIndex=val
      this.$nextTick(function(){
        this.rulesForm.approvalNodeList.splice(val,0,{name:'',approverListText:'',approverList:[]})
      })
      setTimeout(function(){
        _this.$refs['nodeForm'].resetFields();
      },100)

    },
    editNode(node,index){
      let _this=this
      this.itemDialogFla=true
      this.nodeIndex=index
      setTimeout(function(){
        _this.$refs['nodeForm'].resetFields();
        _this.nodeForm.nodeName=node.name
        node.approverList.map(res=>{
          _this.nodeForm.approverName.push(res.id)
        })
      },100)
    },
    del(node,index){
      this.rulesForm.approvalNodeList.splice(index,1)
    },
    itemForm(formName){
      let _this=this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let userList=_this.membershipList.filter(function(n) {
              return _this.nodeForm.approverName.indexOf(n.employee.id) != -1
          });
          _this.rulesForm.approvalNodeList[_this.nodeIndex].approverListText=''
          _this.rulesForm.approvalNodeList[_this.nodeIndex].approverList=[]
          userList.map(res=>{
            _this.rulesForm.approvalNodeList[_this.nodeIndex].approverList.push({id:res.employee.id,name:res.employee.name})
            _this.rulesForm.approvalNodeList[_this.nodeIndex].approverListText +=res.employee.name+','
          })
          _this.rulesForm.approvalNodeList[_this.nodeIndex].approverListText=_this.rulesForm.approvalNodeList[_this.nodeIndex].approverListText.substring(0,_this.rulesForm.approvalNodeList[_this.nodeIndex].approverListText.length-1)

          _this.rulesForm.approvalNodeList[_this.nodeIndex].name=_this.nodeForm.nodeName
          _this.itemDialogFla=false
        } else {
          return false;
        }
      });
    }


  },
};
</script>
<style lang="less" scoped>

.Addapproval {

  .header{
    height: 65px;
    background: white;
    display: flex;
    align-items:center;
    position: relative;
    // justify-content:center;
    span{
      width: 5%;
      font-size: 30px;
      position: absolute;
      left: 10px;
      top: 20px;
    }
    p{
      width: 100%;
      text-align: center;
      font-size: 18px;
      color: #1B1E25;
      font-weight: 500;
    }
    .el-button{
      position: absolute;
      right: 10px;
    }
  }
  .content{
    padding:20px;
    .approvable_type{
      width: 270px;
    }
    .content_chunk{
      margin: auto;
      width: 100%;
      // border:1px solid red;
      padding:20px;
      overflow-y: auto;
      height: 700px;
      li{
        width: 220px;
        margin: auto;
        position: relative;
        cursor: pointer;
        .title{
          border-radius:5px 5px 0 0;
          box-shadow: 0 0 6px 0 #e4e9ff;
          height: 50px;
          text-align: center;
          line-height: 50px;
          font-size: 16px;
          font-family:PingFangSC-Medium;
          font-weight: bold;
          background: white;
          color: #000;
        }
        p{
          height: 30px;
          width: 100%;
          background: #3B78FD;
          color: white;
          line-height: 30px;
          border-radius:0 0 5px 5px;
          position: relative;
          .del{
            position: absolute;
            right: 10px;
          }
        }
        .bottom{
          text-align: center;
          position: relative;
          .bottom-arrows{
            width: 10px;
            margin: auto;
            display: block;
          }
          .add-btn{
            width: 30px;
            position: absolute;
            top: 20px;
            left: 95px;
          }
        }
        &.approval_chunk{
          .title{
            background: white;
          }
          p{
            background: #72C272;
          }
        }
      }

    }

  }
}

</style>
<style lang="less">
  .Addapproval{

    .approval_chunk{

      .el-input{
        height: 100%;
      }
      .el-input__inner{
        border:0;
      }
      .approval_node_name{
        position: relative;
        top: -5px;
        .el-input__inner{
          height: 30px;
          line-height: 30px;
          color: white;
          border:0;
          background: none;

        }
        .el-input__inner::-webkit-input-placeholder{
            color: white;
        }
        .el-input__inner:-ms-input-placeholder{
            color:white;
        }
        .el-input__inner::-moz-placeholder{
            color:white;
        }
      }
    }
    .nodeDialog{

      .el-dialog{
        position: fixed;
        right: 0;
        top: 0 ;
        margin-top: 0 !important;
        height: 100%;
        .el-select{
          width: 100%;
        }
        .dialog-footer{
          padding:10px 0;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          border-top:1px solid #F0F0F1;
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

      }

    }

  }
</style>
