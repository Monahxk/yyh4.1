<template>
  <div class="wrapper">
    <ul class="header_wrap">
      <li>
        <span class="title">回访</span>
      </li>
      <li @click="addCallBack">
        <span>新增回访</span>
      </li>
    </ul>
    <div class="main" id="main" v-if="sendData.length">
      <div class="list_item" v-for="(item,index) of sendData" :key="index">
        <p class="timer">{{item.leftCallTime}}</p>
        <ul class="list_content">
          <li>
            <p>
              <span>回访时间</span>
              <span>{{item.callTime}}</span>
            </p>
          </li>
          <li>
            <span>回访状态</span>
            <span>{{item.statusTxt}}</span>
          </li>
          <li>
            <span>诊治医生</span>
            <span>{{item.doctorNmae}}</span>
          </li>
          <li>
            <span>回访内容</span>
            <span>{{item.content}}</span>
          </li>
          <li>
            <span>回访结果</span>
            <span>{{item.result}}</span>
          </li>
          <li class="other">
            <div>
              <span>备&#12288;&#12288;注</span>
              <span>{{item.remark}}</span>
            </div>
            <div>
              <p @click="editCallback(item)">编辑</p>
              <p @click="delateCallback(item)">删除</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="main addMain" id="main" v-if="!sendData.length">
      <div class="img_box">
        <img src="../../../../assets/img/workbench/img_workbench_table_bg.png" alt>
      </div>
    </div>

    <editCallback
      @sendEvent="initTanleData"
      :isShow="iframeParam"
      :selectData="selectData"
      :form="defaultform"
      :stateData="stateData"
    />
    <addCallBack :isShow="iframeParam" @successData="initTanleData"/>
  </div>
</template>

<script>
import {
  getEditCallbackvo,
  getPatientCallbacList,
  deleteOneCallback
} from "@/api";
import editCallback from "./EditCallback";
import addCallBack from "./AddCallBack";
import { SYSTEM_HTTP_SUCCESS, STATUS_CALLBACK_STATUSARR } from "@/constant";
import monment from "moment";
import { mapState } from "vuex";
export default {
  components: { editCallback, addCallBack },
  props: {},
  data() {
    return {
      sendData: [],
      selectData: {
        callerTO: [],
        contentSet: [],
        callerTOList: [],
        doctorTOList: [],
        periodList: [],
        resultSet: [],
        doctorList: [], //2019/6/19,hzj,add。EditCallback，props对应
        callerList: [] //2019/6/19,hzj,add。EditCallback，props对应
      },
      stateData: {},
      defaultform: {
        callerId: "",
        callTime: "",
        doctorId: "",
        status: 0,
        result: "",
        content: "",
        remark: "",
        mode: 0,
        visitTime: ""
      },
      form: {
        status: null,
        patientName: null,
        callerId: null,
        doctorId: null
      },
      checkedIndex: 0,
      searchData: {
        callbackStatusMap: [],
        callerTOList: [],
        doctorTOList: []
      },
      total: 1,
      iframeParam: {
        iframeShow: false,
        id: "",
        tapActive: "",
        register: false,
        edit: false,
        shows: false
      }
    };
  },
  watch: {},
  computed: mapState({
    pId: state => state.signal.patientId
  }),
  methods: {
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD");
      }
    },
    delateCallback(row) {      
      this.confirm("是否删除回访").then(() => {
        deleteOneCallback(row.callback.id).then(res => {
          if (res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.initTanleData();
          }
        });
      });
    },
    confirm(text) {
      return this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    editCallback(row) {
      getEditCallbackvo(row.callback.id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.selectData = res.data.data;
          this.defaultform = res.data.data.callback;
        }
      });
      this.iframeParam.shows = !this.iframeParam.shows;
    },
    initTanleData() {
      getPatientCallbacList(this.pId).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let _D = res.data.data;
          this.sendData = _D.map(v => {
            v.leftCallTime = this.getTime(v.callback.callTime, "l");
            v.statusTxt =
              STATUS_CALLBACK_STATUSARR[parseInt(v.callback.status)];
            v.patientName = v.callback.patientName;
            v.doctorNmae = v.doctorName;
            v.callTime = this.getTime(v.callback.callTime);
            v.content = v.callback.content;
            v.result = v.callback.result;
            v.remark = v.callback.remark;
            return v;
          });
        }
      });
    },
    addCallBack() {
      this.iframeParam.register = true;
    }
  },
  mixins: [],
  mounted() {
    this.initTanleData();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  padding-bottom: 30px;
  .title{
    font-size: 16px;
  }
}
.header_wrap {
  color: #3b78fd;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li:nth-child(1) {
    font-size: 16px;
  }
  li:nth-child(2) {
    cursor: pointer;
    width: 88px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
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
  height: 700px !important;
  overflow-y: scroll;
  .list_item {
    display: flex;
    margin-bottom: 20px;
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
      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 6px;
      }
      .other {
        justify-content: space-between;
        div span:nth-child(1) {
          display: block;
          white-space:nowrap;
        }
        div span:nth-child(2) {
          padding-right: 11px;
        }
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
            margin-right: 16px;
          }
        }
      }
    }
  }
}
</style>