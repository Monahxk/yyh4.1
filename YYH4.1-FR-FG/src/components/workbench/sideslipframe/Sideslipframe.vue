<!--
@Author: ZJZ
@Date:   2019-08-08
@Filename: Sideslipframe.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-11
-->

<template>
  <div class="iframe_wrapper" id="iframe_wrappers">
    <el-dialog
      title="提示"
      :visible.sync="iframeVisible.iframeShow"
      width="960px"
      id="iframe_wrapper"
      @open="openDialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-wraps">
        <div class="header">
          <div class="header_left">
            <div class="user_img">
              <img src="../../../assets/img/icons-log-in-logo.png" alt>
            </div>
            <div class="add_title">
              <ul class="user_msg">
                <li>
                  <span>{{patientsMsg.patientName}}</span>
                </li>
                <li>
                  <span>{{patientsMsg.gender}}</span>
                </li>
                <li>
                  <span>年龄：</span>
                  <span>{{patientsMsg.ages}}</span>
                </li>
                <li>
                  <span>病历号：</span>
                  <span>{{patientsMsg.emrNo}}</span>
                </li>
                <li>
                  <span>手机号：</span>
                  <span>{{patientsMsg.mobilephone}}</span>
                </li>
              </ul>
              <ul class="title">
                <li
                  v-for="(item, index) in labelData"
                  :style="{backgroundColor:item.color}"
                  :key="index"
                >{{item.abbreviate}}</li>
              </ul>
            </div>
          </div>
          <ul class="right-box">
            <li @click="addPage(0)">新增预约</li>
            <li @click="addPatientpage_event(1)">新增挂号</li>
            <li @click="testFn" class="close">
              <div class="icon_close el-icon-close"></div>
            </li>
          </ul>
        </div>
        <div class="main-wrap">
          <el-tabs v-model="iframeVisible.tapActive">
            <el-tab-pane label="患者信息" name="first">
              <patientDetial v-if="iframeVisible.tapActive=='first'"></patientDetial>
            </el-tab-pane>
            <el-tab-pane label="就诊记录" name="second">
              <visitingrecord v-if="iframeVisible.tapActive=='second'"></visitingrecord>
            </el-tab-pane>
            <el-tab-pane label="电子病历" name="third">
              <caseHistory v-if="iframeVisible.tapActive=='third'" />
            </el-tab-pane>
            <el-tab-pane label="收费" name="four">
              <charge v-if="iframeVisible.tapActive=='four'" :detectionid="detectionid" :iframeVisible="iframeVisible"/>
            </el-tab-pane>
            <el-tab-pane label="技加工" name="five">
              <machining v-if="iframeVisible.tapActive=='five'" />
            </el-tab-pane>
            <el-tab-pane label="回访" name="six">
              <callbacklist  @onoff="onOff" v-if=" !arvdShow && iframeVisible.tapActive=='six'"/>
            </el-tab-pane>
            <el-tab-pane label="影像" name="seven">
              <ImagePage v-if="iframeVisible.tapActive=='seven'" />
            </el-tab-pane>
            <el-tab-pane label="处置记录" name="eight">
              <handlerecord v-if="iframeVisible.tapActive=='eight'" />
            </el-tab-pane>
            <el-tab-pane label="体检记录" name="physical">
              <physicals v-if="iframeVisible.tapActive=='physical'" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 创建预约 -->
    <BespeakDialog
      :isShow="visible"
      :info="patientsMsg"
      :isAdd="true"
      :isEdit="true"
      v-bind="$attrs"
    />

    <!-- 新增挂号 -->
    <registerDialogs
      :isShow="componentShow"
      :userinfo="patientsMsg"
      :rowId="rowId"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
// 新增挂号
import registerDialogs from "@/components/workbench/dialogs/DialogsAddRegister";
import BespeakDialog from "@/components/workbench/dialogs/DialogAddBespeak";
import patientDetial from "./patientDetial";
import callbacklist from "./callback/CallBackList";
import ImagePage from "./image/ImagePage";
import machining from "./machining";
import handlerecord from "./handlerecord";
import { mapState } from "vuex";
import charge from "./charge";
import caseHistory from "./caseHistory";
import physicals from "./physical";
import visitingrecord from "./visitingrecord";
import moment from "moment";
import { getWorkLabel } from "@/api";
export default {
  components: {
    patientDetial,
    registerDialogs,
    BespeakDialog,
    caseHistory,
    physicals,
    visitingrecord,
    callbacklist,
    charge,
    ImagePage,
    machining,
    handlerecord
  },
  props: ["iframeVisible"],
  provide() {
    return {
      app: this
    };
  },
  data() {
    return {
      detectionid: true,
      userinfo: {},
      age: "",
      dialogVisible: true,
      activeName: "",
      returnVisitShow: true,
      siapos: false,
      isShows: false,
      arvdShow: false,
      edit: false,
      isShowDialog: {
        register: false,
        patientName: "",
        clinicNo: "",
        mobilphone: "",
        patientId: ""
      },
      componentShow: {
        id: "",
        register: false
      },
      visible: {
        visibility: false,
        patientId: "",
        isSearch: true
      },
      bespeakData: {
        register: true
      },
      labelData: [],
    };
  },
  created() {},
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId,
    rowId: state => state.signal.rowId
  }),
  methods: {
    openDialog() {
    },
    testFn() {
      this.iframeVisible.iframeShow = false;
      this.$emit("on-click");
    },
    onOff(b) {
      this.arvdShow = b;
    },
    // 创建挂号
    addPatientpage_event() {
      this.componentShow.register = true;
      this.patientsMsg.rowId= this.rowId;
      this.patientsMsg.patientId = this.patientId;
      this.patientsMsg.add = true;
      // 患者详情下不需要传id该字段用做挂号时判断
      this.patientsMsg.addNoId = true;
    },
    register_event() {
      this.componentShow.register = true;
    },
    addPage(i) {
      if (i == 0) {
        this.visible.visibility = true;
        this.visible.patientId = this.patientId;
        this.userinfo = this.patientsMsg;
        this.userinfo.patientId = this.patientId;
        this.userinfo.rowId = this.rowId;
      } else {
      }
      this.$emit("addEvent", i);
    },
  },
  mixins: [],
  mounted() {},
  watch: {
    "iframeVisible.id": {
      handler: function(obj) {
        this.activeName = this.iframeVisible.tapActive;
        this.arvdShow = this.iframeVisible.addRV;
      },
      deep: true
    },
    patientId: {
      handler: function(obj) {
        if(this.patientId){
          // getWorkLabel(this.patientId).then(res => {
          //   let _d = res.data.data;
          //   if (!_d.length) return;
          //   _d.map(val => {
          //     this.labelData.push(val.labelConfig);
          //   });
          // });
        }

      },
      deep: true,
      immediate: true
    },
    patientsMsg:{
      handler: function(obj) {
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.el-tab-pane {
  height: 100%;
  overflow: hidden;
}
.dialog-wraps {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.header {
  height: 66px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #dfe7f0;
  background: #fff;
  .header_left {
    display: flex;
    align-items: center;
    .user_img {
      width: 32px;
      height: 32px;
      border-radius: 100% 100%;
      margin-right: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user_msg {
      padding-top: 6px;
      display: flex;
      li {
        margin-right: 20px;
        color: #1B1E25;
      }
    }
  }
  .right-box {
    display: flex;
    padding-top: 3px;
    li {
      cursor: pointer;
      width: 88px;
      height: 32px;
      color: #3b78fd;
      text-align: center;
      line-height: 32px;
      border: 1px solid #3b78fd;
    }
    li:nth-child(1) {
      margin-right: 30px;
    }
    li:nth-child(3) {
      margin-left: 30px;
      height: 32px;
      line-height: 26px;
      border: none;
      width: 20px;
      font-size: 20px !important;
      color: #3b78fd !important;
      .close{
        padding-top: 6px;
        div{
         .el-icon-close{
           margin-top: 6px;
         }
        }
      }


    }
  }
}
.main-wrap {
  flex: 2;
  padding: 10px 20px 0 20px;
  height: calc(100% - 66px);
}
.add_title {
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 22px;
    text-align: center;
    margin-top: 5px;
    li {
      width: 22px;
      height: 22px;
      margin-right: 16px;
      border-radius: 100%;
      color: #fff;
      span {
        display: block;
      }
    }
  }
}
</style>
<style lang="less">
#iframe_wrapper .el-icon-close:before{
  vertical-align:-2px;
}
#iframe_wrapper .el-dialog {
  width: 1020px !important;
  margin: 0 !important;
  right: 0;
  position: absolute;
  height: 100vh;
  overflow: hidden;
}
#iframe_wrapper .el-dialog__header {
  display: none;
}
#iframe_wrapper .el-dialog__body {
  padding: 0;
}

.main-wrap #pane-first,
#pane-second,
#pane-four,
#pane-third,
#pane-five {
  height: 100%;
}
#iframe_wrappers #iframe_wrapper{
  /* z-index: 2003 !important; */
}
#iframe_wrappers .el-dialog__body {
  height: 100%;
}
#iframe_wrappers .el-tabs--top {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
#iframe_wrappers .el-tabs__content {
  /* flex: 2; */
  flex: 1;
}
#addCaseHistory {
  .wrap {
    height: calc(100% - 160px);
    position: relative;
    padding-top: 27px;
    .content {
      height: 100%;
      padding-bottom: 50px;
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      padding-left: 15px;
    }
  }

}

@media screen and (max-height: 900px) {
  #pane-physical #workbench_physicalList #mains {
    height: 600px !important;
  }
  // #pane-physical #workaddphysical .main {
  //   height: 600px !important;
  // }
  #pane-six #main {
    height: 600px !important;
  }

  #pane-third #workbench_caseHistoryList > .main {
    height: 590px !important;
  }
}
@media screen and (max-height: 920px) {
  #pane-six .main {
    height: 450px !important;
  }
  // #pane-third #addCaseHistory .content {
  //   height: 510px !important;
  // }
}
@media screen and (max-height: 860px) {
  // #pane-third #addCaseHistory .content {
  //   height: 460px !important;
  // }
}
@media screen and (max-height: 830px) {
  #pane-physical #workbench_physicalList #mains {
    height: 500px !important;
  }
  // #pane-physical #workaddphysical .main {
  //   height: 500px !important;
  // }
  #pane-third #workbench_caseHistoryList {
    height: 500px !important;
  }
  // #pane-third #addCaseHistory .content {
  //   height: 400px !important;
  // }
}
@media screen and (max-height: 800px) {
  #pane-physical #workbench_physicalList #mains {
    height: 450px !important;
  }
  // #pane-physical #workaddphysical .main {
  //   height: 450px !important;
  // }
  #pane-third #workbench_caseHistoryList {
    height: 450px !important;
  }
  // #pane-third #addCaseHistory .content {
  //   height: 350px !important;
  // }
  #pane-six #main {
    height: 500px !important;
  }
  @media screen and (max-height: 750px) {
    #pane-six #main {
      height: 420px !important;
    }
    // #pane-third #addCaseHistory .content {
    //   height: 350px !important;
    // }
  }
  @media screen and (max-height: 720px) {
    #pane-six #main {
      height: 420px !important;
    }
    // #pane-third #addCaseHistory .content {
    //   height: 300px !important;
    // }
  }
}
</style>
