<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 16:44:42
 -->
<template>
  <div class="wrapper" >
    <ul class="header_wrap">
      <li>
        <span>技加工记录</span>
      </li>
      <li>
        <span @click="addMachining">新增技加工</span>
      </li>
    </ul>
    <div class="main" id="main" v-if="sendData.length">
      <div class="list_item" v-for="(item,index) of sendData" :key="index">
        <p class="timer">{{item.leftTime}}</p>
        <ul class="list_content">
          <li>
            <div>
              <p>  
                <span>就诊时间 ：{{item.visitTime }}</span> 
                <span>{{ item.clinicName}}</span>
              </p>
            </div>
          </li>
          <li>
            <span>订单状态</span>
            <span>{{item.orderStatusText}}</span>
          </li>
          <li>
            <span>加工单位</span>
            <span>{{item.unit}}</span>
          </li>
          <li>
            <span>诊治医生</span>
            <span>{{item.doctorName}}</span>
          </li>
          <li>
            <span>送件时间</span>
            <span>{{item.deliveryTime}}</span>
          </li>
          <li>
            <span>取件时间</span>
            <span>{{item.receivingTime}}</span>
          </li>
          <li v-if="item.realCost">
            <span>加工费</span>
            <span>{{item.realCost}}</span>
          </li>
          <li v-if="item.realCharge">
            <span>患者花费</span>
            <span>{{item.realCharge}}</span>
          </li>
          <li>
            <span>{{item.doctorName}}创建于{{item.visitTime}}</span>
          </li>
          <li style="position:relative">
            <p class="but_box">
              <el-button size="mini"  @click="printfn(item.id)">打印</el-button>
              <el-button type="primary" size="mini"  @click="detial(item.id)">编辑</el-button>
              <el-button type="primary" size="mini"  @click="del(item.id)">删除</el-button>
            </p>
          </li>
        </ul>
      </div>
    </div>
      <PrintMachining :isShow="isShowDialog"></PrintMachining>
    <div class="main addMain" id="main" v-if="!sendData.length">
      <div class="img_box">
        <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
      </div>
    </div>
  </div>
</template>

<script>
import {

  getMachiningList,
  deleteMachining
  
} from "@/api";
import monment from "moment";
import { mapState } from "vuex";
import {SYSTEM_HTTP_SUCCESS} from "@/constant";
import PrintMachining from "./PrintMachining.vue";

export default {
  components: {PrintMachining},
  props: [],
  data() {
    return {
      list: {},
      sendData:[],
      loading: "",
      pid: "",
      isShowDialog: {
        dialogVisible: false,
        id: ""
      },
    };
  },
  watch: {

  },
  computed: mapState({
    pId: state => state.signal.patientId
  }),
  created() {
    this.init();
  },
  methods: {
    init(){
        getMachiningList(this.pId).then(res=>{
          if(res.data.code=SYSTEM_HTTP_SUCCESS){
            let data=res.data.data || null;
            this.sendData=data.map(item=>{
              item.leftTime=this.getTime(item.visitTime,'l')
              return item
            })
          }
        })
    },
    printfn(id) {
      this.isShowDialog.id = id;
      this.isShowDialog.dialogVisible = true;
    },
    addMachining(){
      this.$emit("openOrclose","")
    },
    detial(id){
      this.$emit("openOrclose",id)
    },
    del(id){
      this.$confirm('删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMachining(id).then(res=>{
          if(res.data.code==SYSTEM_HTTP_SUCCESS){
            this.init()
          }else{
          }        
        })
      }).catch((err) =>{
        
      })

    },
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD HH:mm:ss");
      }
    },
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .main::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .main::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
  padding-bottom: 30px;
  .section_title {
    font-weight: bold;
  }
  .foot {
    width: 150px;
    margin: 20px auto;
    button {
      display: inline-block;
      border: 1px solid #3b78fd;
      width: 70px;
      height: 30px;
      background: #fff;
      color: #3b78fd;
    }
  }
}
.add_bt {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(59, 120, 253);
}
.header_wrap {
  color: #3b78fd;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li:nth-child(1) {
    font-size: 16px;
    padding-left: 10px;
    cursor: pointer;
  }
  li:nth-child(3) {
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    padding-left: 10px;
    padding: 0 4px 0 4px;
    border: 1px solid #3b78fd;
    margin-left: 700px;
    cursor: pointer;
  }
  li:nth-child(2) {
    cursor: pointer;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
    padding: 0 4px 0 4px;
  }
}
.img_box {
  width: 400px;
}
.addMain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  padding-top: 4px;
  height: 700px !important;
  overflow-y: scroll;
  .list_item {
    display: flex;
    margin-bottom: 20px;
    padding-right: 20px;
    .timer {
      width: 100px;
      color: #1b1e25;
      font-size: 14px;
      font-weight: bold;
    }
    .list_content {
      width: 650px;
      padding: 10px;
      color: #1b1e25;
      font-size: 14px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #ffffff;
      flex: 1;
      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 10px;
      }
      .other {
        justify-content: space-between;
        div {
          display: flex;
          p {
            cursor: pointer;
            width: 88px;
            height: 32px;
            border: 1px solid #3b78fd;
            color: #3b78fd;
            text-align: center;
            line-height: 32px;
          }
          p:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
    }
  }
.but_box{
  padding-left: 420px;
  position: absolute;
  right: 20px;
  bottom: 5px;
}
}
</style>
<style>
.caseHistoryList_collapse .el-collapse-item__arrow {
  display: none;
}
</style>
