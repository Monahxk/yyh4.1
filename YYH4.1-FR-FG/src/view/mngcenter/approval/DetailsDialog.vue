<!--
@Author: ZJZ
@Date:   2019-08-26
@Filename: Await.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-14
-->

<template>
  <div class=" await">

    <el-dialog
      :visible.sync="infoData.DialogFla"
      width="1000px" class="details_dialog"
      center>
      <div class="top">
        <p class="title">
          <img src="../../../assets/img/approval/allocation.png" alt="" v-if='approvalItem.approvableTypeId==15'>
          <img src="../../../assets/img/approval/storage.png" alt="" v-if='approvalItem.approvableTypeId==12 || approvalItem.approvableTypeId==18'>
          <img src="../../../assets/img/approval/deposit.png" alt="" v-if='approvalItem.approvableTypeId==13 || approvalItem.approvableTypeId==14 || approvalItem.approvableTypeId==17'>
          <img src="../../../assets/img/approval/purchase.png" alt="" v-if='approvalItem.approvableTypeId==11'>
          <img src="../../../assets/img/approval/qita.png" alt="" v-if='approvalItem.approvableTypeId==1 || approvalItem.approvableTypeId==2 || approvalItem.approvableTypeId==3 || approvalItem.approvableTypeId==16 || approvalItem.approvableTypeId==19'>
          {{approvalItem.name}}
        </p>
        <el-form  :inline="true" ref="itemRuleForm" label-position='left' class="demo-ruleForm">
          <el-form-item label="发起人：">
            <span>{{approvalItem.requestorName}}</span>
          </el-form-item>
          <el-form-item label="关联单号：">
            <span class="blue_text">{{approvalItem.formNo}}</span>
          </el-form-item>
        </el-form>
        <div class="edit_chunk">
          <el-button v-if='canApprove' type="primary" plain icon="el-icon-success" @click='passForm(approvalItem.id)'>通过</el-button>
          <el-button v-if='canApprove' type="primary" plain icon="el-icon-error" @click='rejectForm(approvalItem.id)'>驳回</el-button>
          <el-button v-if='(approvalItem.curStatus==2||approvalItem.curStatus==4)&& infoData.me' type="primary" plain icon="el-icon-error" @click='editTo(approvalItem.approvableTypeId,approvalItem.requestItemId)'>重新编辑</el-button>
          <el-button v-if='canUndo && infoData.me' type="primary" plain icon="el-icon-error" @click='cancel(approvalItem.id)'>撤销</el-button>
          <img v-if='approvalItem.curStatus==1' src="../../../assets/img/approval/seal-green.png" alt="">
          <img v-if='approvalItem.curStatus==0' src="../../../assets/img/approval/seal-red.png" alt="">
          <img v-if='approvalItem.curStatus==2' src="../../../assets/img/approval/seal-orange.png" alt="">
          <img v-if='approvalItem.curStatus==3' src="../../../assets/img/approval/seal-shenouzhong.png" alt="">
          <img v-if='approvalItem.curStatus==4' src="../../../assets/img/approval/seal-chexiao.png" alt="">
          <!-- <el-button v-if='approvalItem.curStatus!=0' type="primary" class="remark_text" plain icon="el-icon-s-comment" @click='remark(approvalItem.id)'>备注</el-button> -->
        </div>
      </div>
      <div class="steps">
        <el-steps :active="processTimeIndex" align-center>
          <el-step v-for='(item,index) in nodeList' :key='index' :title="item.nodeName" :status='item.status==0?"process":item.status==1?"success":item.status==9?"finish":"error"'>
            <template slot="description" >
              <p>{{item.employeeNames}} <span :class="'status'+item.status" v-if='item.statusText'>（{{item.statusText}}）</span> </p>
              <p>{{item.processTime}}</p>
            </template>
          </el-step>
        </el-steps>
      </div>
      <div class="detail">
        <div class="title_text">
          <i></i> <span>明细</span>
        </div>
        <div class="">
          <el-form  :inline="true" ref="itemRuleForm" label-width="80px" label-position='left' class="demo-ruleForm top_form">
            <el-form-item v-for='(item,index) in onTopText' :key='index' :label='item.label+":"'>
              <span v-html='item[item.key]'></span>
            </el-form-item>

          </el-form>
        </div>
        <!-- <div class="num">
          <p>种类: <span class="blue_text">{{entity.category}}</span> </p>
          <p class="right">总数量: <span class="blue_text">{{entity.quantity}}</span>总金额: <span class="blue_text">￥{{entity.amountYuan}}</span></p>
        </div> -->
        <div class="num"  v-if='entity.approvableTypeId==2'>
          <p>共 <span class="blue_text">{{entity.totalItemNum}}</span> 项</p>
          <p class="right">合计: <span class="blue_text">￥{{entity.totalRefundAmountYuan}}</span></p>
        </div>
        <el-table
          :data="tableItemList"
          height="300"
          :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
          style="font-size: 14px">
          <el-table-column label="序号" type="index" width='60'>
          </el-table-column>
          <template v-for="(item,index) in onArrayList">
            <el-table-column align='center' :prop="item.value" :label="item.label" :key="index"></el-table-column>
          </template>

        </el-table>
      </div>
      <div class="detail" v-if='entity.approvableTypeId==1'>
        <div class="title_text">
          <i></i> <span>操作信息</span>
        </div>
        <div>
          <el-form  :inline="true" ref="itemRuleForm" label-width="150px" class="demo-ruleForm top_form" style="border:0">
            <el-form-item label='收费时间：'>
              <span >{{entity.chargeBill.chargeTime}}</span>
            </el-form-item>
            <el-form-item label='就诊时间：'>
              <span >{{entity.chargeBill.visitTime}}</span>
            </el-form-item>
            <el-form-item label='医生：'>
              <span >{{entity.chargeBill.doctor.name}}</span>
            </el-form-item>
            <el-form-item label='护士：'>
              <span >{{entity.chargeBill.nurse.name}}</span>
            </el-form-item>
            <el-form-item label='备注：'>
              <span >{{entity.chargeBill.remark}}</span>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <div class="detail" v-if='remarkList'>
        <div class="title_text">
          <i></i> <span>备注</span>
        </div>
        <div>
          <p v-html='remarkList.detailsText'></p>
        </div>
      </div>

    </el-dialog>


  </div>
</template>



<script>
import {approvalitemfilterdo,approvalitemId,putPassApprovalitem,putRejectApprovalitem,approvalitemCancel} from "@/api/index2.js";
export default {
  name:'Await',
  props:['infoData'],
  data() {
      return {
        approvalItem:{},//审批顶部
        remarkList:{},//审批备注
        canApprove:false,//是否显示通过、驳回按钮
        canUndo:false,//是否显示撤销
        nodeList:[],//节点数组
        entity:{},//明细
        processTimeIndex:0,
        typeIndex:1,//审批类型
        opinionValue:'',//审批意见
        onTopText:[], //缓存当前类型的label数据
        onArrayList:[],//缓存当前类型的表头数据
        tableItemList:[],//table数据
        tableTheadList:[  //1-整单折扣 2-退费 3-欠费 11-采购 12-入库 13-出库 14-退货 15-调拨 16-盘点 17-领用 18-退库 19-报损
          {
            type:1,//整单折扣
            arrayList:[
              {value:'projectName',label:'名称'},
              {value:'itemUnit',label:'单位'},
              {value:'itemPriceYuan',label:'单价'},
              {value:'itemNum',label:'数量'},
              {value:'discountFlagText',label:'允许打折'},
              {value:'amountMoneyYuan',label:'金额'},
            ],
            topTextList:[
              {discountPrivilege:'',key:'discountPrivilege',label:'折扣权限'},
              {applyDiscount:'',key:'applyDiscount',label:'申请折扣'},
              {discountReason:'',key:'discountReason',label:'折扣原因'},
            ]
          },
          {
            type:2,//退费
            arrayList:[
              {value:'itemName',label:'名称'},
              {value:'itemPriceYuan',label:'单价'},
              {value:'itemNum',label:'数量'},
              {value:'amountMoneyYuan',label:'应收'},
              {value:'discountFlagText',label:'允许打折'},
              {value:'receivedAmountMoneyYuan',label:'实收'},
              {value:'itemNum',label:'可退数量'},
              {value:'itemRefundNum',label:'需退数量'},
            ],
            topTextList:[
              {amountYuan:'',key:'amountYuan',label:'原价'},
              {discount:'',key:'discount',label:'整单折扣'},
              {discountAmountYuan:'',key:'discountAmountYuan',label:'应收金额'},
              {receivedAmountYuan:'',key:'receivedAmountYuan',label:'实收金额'},
              {refundPaywayText:'',key:'refundPaywayText',label:'退费方式'},
              {refundReason:'',key:'refundReason',label:'退费原因'},
            ]
          },
          {
            type:11,//采购
            arrayList:[
              {value:'drug.drugName',label:'名称'},
              {value:'inventoryQuantity',label:'当前库存'},
              {value:'drug.drugBrand.brandName',label:'品牌'},
              {value:'drug.drugSpec',label:'规格'},
              {value:'drug.drugUnitsConfig.unitName',label:'单位'},
              {value:'planQuantity',label:'计划数量'},
              {value:'planPrice',label:'计划单价'},
              {value:'amountYuan',label:'金额'},
            ],
            topTextList:[
              {wareHourseText:'',key:'wareHourseText',label:'库房'},
              {drugProviderText:'',key:'drugProviderText',label:'供应商'},
              {arrivalDate:'',key:'arrivalDate',label:'计划到货日期'},
              {arrivalDate:'',key:'purchaseDate',label:'采购日期'},
              {remark:'',key:'remark',label:'备注'},
            ]
          },

          {
            type:3,//退货
            arrayList:[
              {value:2,label:'名称'},
              {value:1,label:'品牌'},
              {value:1,label:'规格'},
              {value:1,label:'单位'},
              {value:1,label:'当前库存'},
              {value:1,label:'退货数量'},
              {value:1,label:'金额'},
            ],
            topTextList:[
              {value1:'aa3',key:'value1',label:'库房'},
              {value2:'ss3',key:'value2',label:'申请时间'},
              {value3:'dd3',key:'value3',label:'退货原因'},
            ]
          },
          {
            type:13,//出库
            arrayList:[
              {value:'drug.drugName',label:'名称'},
              {value:'inventoryQuantity',label:'当前库存'},
              {value:'drug.drugBrand.brandName',label:'品牌'},
              {value:'drug.drugSpec',label:'规格'},
              {value:'drug.drugUnitsConfig.unitName',label:'单位'},
              {value:'quantity',label:'出库数量'},
              {value:'amountYuan',label:'金额'},
            ],
            topTextList:[
              {wareHouseText:'',key:'wareHouseText',label:'出库库房'},
              {applyDate:'',key:'applyDate',label:'申请时间'},
              {remark:'',key:'remark',label:'备注'},
            ]
          },
          {
            type:17,//领用
            arrayList:[
              {value:'drug.drugName',label:'名称'},
              {value:'drug.drugBrand.brandName',label:'品牌'},
              {value:'drug.drugSpec',label:'规格'},
              {value:'drug.drugUnitsConfig.unitName',label:'单位'},
              {value:'inventoryQuantity',label:'当前库存'},
              {value:'quantity',label:'领用数量'},
            ],
            topTextList:[
              {wareHouseName:'',key:'wareHouseName',label:'库房'},
              {applyDate:'',key:'applyDate',label:'领用日期'},
              {remark:'',key:'remark',label:'备注'},
            ]
          },
          {
            type:18,//退库
            arrayList:[
              {value:'drug.drugName',label:'名称'},
              {value:'drug.drugBrand.brandName',label:'品牌'},
              {value:'drug.drugSpec',label:'规格'},
              {value:'drug.drugUnitsConfig.unitName',label:'单位'},
              {value:'quantity',label:'退库数量'},
            ],
            topTextList:[
              {applyDate:'',key:'applyDate',label:'申请时间'},
              {remark:'',key:'remark',label:'退库原因'},
            ]
          },
          // {
          //   id:5,//调拨   不确定
          //   arrayList:[
          //     {value:2,label:'名称'},
          //     {value:1,label:'当前库存'},
          //     {value:1,label:'品牌'},
          //     {value:1,label:'规格'},
          //     {value:1,label:'单位'},
          //     {value:1,label:'出库数量'},
          //     {value:1,label:'金额'},
          //   ]
          // },
          {
            type:6,//退费
            arrayList:[
              {value:2,label:'名称'},
              {value:1,label:'单价'},
              {value:1,label:'数量'},
              {value:1,label:'应收'},
              {value:1,label:'允许打折'},
              {value:1,label:'实收'},
              {value:1,label:'可退数量'},
              {value:1,label:'需退数量'},
            ],
            topTextList:[
              {value:'aa',label:'发起人'},
              {value:'aa',label:'关联单号'},
              {value:'aa',label:'退费方式'},
              {value:'aa',label:'退费原因'},
            ]
          },
        ],
      }
  },
  watch:{
    'infoData.id':{
      handler(val) {
          approvalitemId(val).then(res=>{
            this.entity=res.data.data.entity
            this.approvalItem=res.data.data.approvalItem
            this.nodeList=res.data.data.nodeList
            this.remarkList=res.data.data.approvalDetailsList[0]
            this.canApprove=res.data.data.canApprove
            this.canUndo=res.data.data.canUndo

            if(this.approvalItem.approvableTypeId==1){
              this.tableItemList=res.data.data.entity.chargeBillItemList
            }else if(this.approvalItem.approvableTypeId==2){
              this.tableItemList=res.data.data.entity.refundItemList
            }else if(this.approvalItem.approvableTypeId==11){
              this.tableItemList=res.data.data.entity.drugPurchaseItemList
            }else if(this.approvalItem.approvableTypeId==13){
              this.tableItemList=res.data.data.entity.exportInventoryRecordItemList
            }else if(this.approvalItem.approvableTypeId==17){
              this.tableItemList=res.data.data.entity.takeOutItemList
            }else if(this.approvalItem.approvableTypeId==18){
              this.tableItemList=res.data.data.entity.drugReturnInventoryItemList
            }

            this.tableTheadList.map(item=>{//取label文字数据
              if(this.infoData.type==item.type){
                this.onTopText=item.topTextList
                this.onArrayList=item.arrayList

              }
            })
            console.log(this.tableItemList)
            this.onTopText.map(res=>{
              if(this.entity.hasOwnProperty(res.key)){
                res[res.key]=this.entity[res.key]
              }
            })

            for(let i=0;i<this.nodeList.length;i++){
              if(!this.nodeList[i].processTime){
                this.processTimeIndex=i
                return
              }
            }
          })

      },
      deep: true
    },

  },
  mounted() {

    approvalitemfilterdo().then(res=>{
      console.log(res)
    })
  },
  methods: {
    editTo(approvableTypeId,requestItemId){
       if(approvableTypeId==11){
        this.$router.push({path: '/Receipt/0',query:{id:requestItemId}})
      }else if(approvableTypeId==12){
        this.$router.push({path: '/Receipt/1',query:{id:requestItemId}})
      }else if(approvableTypeId==13){
        this.$router.push({path: '/Receipt/2',query:{id:requestItemId}})
      }else if(approvableTypeId==14){
        this.$router.push({path: 'Receipt/3',query:{id:requestItemId}})
      }else if(approvableTypeId==15){
        return
      }else if(approvableTypeId==16){
        return
      }else if(approvableTypeId==17){
        this.$router.push({path: 'TakeOut/0',query:{id:requestItemId}})
      }else if(approvableTypeId==18){
        this.$router.push({path: 'TakeOut/1',query:{id:requestItemId}})
      }else if(approvableTypeId==19){
        return

      }
    },
    passForm(id){
      let _this=this
      this.$prompt('', '确认通过审批', {
        confirmButtonText: '确认通过',
        // cancelButtonText: '取消',
        // inputValue:'',
        inputPattern:/\S/,
        showCancelButton:false,
        confirmButtonClass:'DetailsDialogConfirmButtonClassBtn',
        inputErrorMessage: '审批意见不能为空'
      }).then(({ value }) => {
        let formData = new FormData();
        formData.append("opinion", value);
        formData.append("id", id);
        putPassApprovalitem(formData,id).then(res=>{
          if(res.data.code==200){
            _this.infoData.DialogFla=false
            _this.$emit('setDataFun')

          }
        })
      }).catch(() => {});
    },
    rejectForm(id){
      let _this=this
      this.$prompt('注：驳回后流程将结束', '确认驳回审批', {
        confirmButtonText: '确认驳回',
        // cancelButtonText: '取消',
        // inputValue:'',
        inputPattern:/\S/,
        confirmButtonClass:'DetailsDialogConfirmButtonClassBtn',
        customClass:'DetailsDialogCustomClass',
        showCancelButton:false,
        inputErrorMessage: '审批意见不能为空'
      }).then(({ value }) => {
        let formData = new FormData();
        formData.append("opinion", value);
        formData.append("id", id);
        putRejectApprovalitem(formData,id).then(res=>{
          if(res.data.code==200){
            _this.infoData.DialogFla=false
            _this.$emit('setDataFun')

          }
        })
      }).catch(() => {});
    },
    remark(id){
      let _this=this
      this.$prompt('', '请输入备注', {
        confirmButtonText: '确认',
        // cancelButtonText: '取消',
        // inputValue:'',
        inputPattern:/\S/,
        inputErrorMessage: '备注不能为空'
      }).then(({ value }) => {
        putRejectApprovalitem({params:{opinion:value,id:id}}).then(res=>{
          if(res.data.code==200){
            _this.infoData.DialogFla=false
            _this.$emit('setDataFun')

          }
        })
      }).catch(() => {});
    },
    cancel(id){
      this.$confirm("确定撤销该审批吗?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
          approvalitemCancel(id).then(res => {
            if (res.data.code == 200) {
              this.$emit('setDataFun')
              this.infoData.DialogFla=false
            }
          });
      }).catch(() => {});
    }

  },
};
</script>
<style lang="less" scoped>
  .details_dialog{
    .top{
      background: white;
      padding:10px 27px;
      border-bottom: 1px solid #DFE7F0;
      height: 100px;
      position: relative;
      .title{
        color: #000;
        font-size: 16px;
        font-weight: bold;
        line-height: 23px;
        display: flex;
        margin-bottom: 10px;
        img{
          width: 20px;
          margin-right: 3px;
        }
      }
      .edit_chunk{
        // position: absolute;
        // right: 30px;
        // top: 50px;
        // overflow: hidden;
        display: inline-block;
        // min-width: 200px;
        width: 300px;
        text-align: right;
        float: right;
        li{
          float: left;
          margin-left: 10px;
          font-size: 16px;
          color: #3B78FD;
          img{
            width:14px;
            height: 14px;
            margin-right: 5px;
            position: relative;
            top: -2px;
          }
        }
        img{
          width: 70px;
          position: absolute;
          top: 10px;
          left: 600px;
        }
        .remark_text{
          position: relative;
          top: -60px;
          left: 30px;
        }
      }
    }
    .steps{
      width: 95%;
      margin:auto;
      margin-top: 20px;
      background: white;
      border:1px solid #DFE7F0;
      padding:20px;
      p{
        font-size: 14px;
      }
      .status0{
        color: #FF485F;
      }
      .status1{
        color: #67C23A;
      }
    }
    .detail{
      width: 95%;
      margin:auto;
      margin-top: 20px;
      background: white;
      border:1px solid #DFE7F0;
      padding:20px;
      .title_text{
        position: relative;
        padding-bottom: 10px;
        i{
          display: inline-block;
          width:5px;
          height:16px;
          background:rgba(59,120,253,1);
        }
        span{
          font-size: 14px;
          color: #1B1E25;
          position: relative;
          top: -2px;
          font-weight: bold;
        }
      }
      p{
        padding:15px 0;
        border-bottom: 1px dashed #DFE7F0;
      }
      .num{
        margin-top: 20px;
        position: relative;
        .right{
          position: absolute;
          right: 30px;
          top: 0;
          .blue_text{
            margin-right: 10px;
          }
        }
      }
    }
  }

</style>
<style lang="less">
  .DetailsDialogConfirmButtonClassBtn{
    padding: 12px 20px;
    font-size: 14px;
  }
  .DetailsDialogCustomClass{
    .el-message-box__message{
      position: absolute;
      bottom: 0;
    }
  }
  .await{

    .details_dialog{

      .el-dialog{
        position: fixed;
        right: 0;
        top: 0 ;
        margin-top: 0 !important;
        height: 100%;
        background: #FCFDFF;
        .el-dialog__header{
          background: white;
          margin-bottom: 10px;
        }
        .el-dialog__body{
          padding:0;
          padding-bottom: 30px;
        }
        .demo-ruleForm{
          display: inline-block;
          width: 600px;
          // margin-top: 20px;
          float: left;
          .el-form-item{
            margin-bottom:0;
            color: #1B1E25;
            // height: 30px;
            .el-form-item__label{
              color: #737B8D;
            }
            .el-form-item__content{
              line-height: 20px;
            }
            span{
              display: inline-block;
              width: 200px;
              height:40px;
              line-height: 40px;
            }
          }
          &.top_form{
            width: 100%;
            float: none;
            display: block;
            padding-bottom: 15px;
            border-bottom:1px solid #DFE7F0;
          }
        }
      }
      .el-table{
        margin-top: 20px;
        th{
          padding:5px 0;
        }
      }
    }
  }
</style>
