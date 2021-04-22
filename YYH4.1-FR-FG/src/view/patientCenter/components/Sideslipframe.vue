<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: Sideslipframe.vue
@Last modified by:   ZJZ
@Last modified time: 2019-09-11
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
            <li @click="testFn" class="el-icon-close"></li>
          </ul>
        </div>
        <div class="main-wrap">
          <el-tabs v-model="iframeVisible.tapActive">
            <el-tab-pane label="患者信息" name="first">
              <patientDetial></patientDetial>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import patientDetial from "./patientDetial";
import { mapState } from "vuex";

import moment from "moment";
import { chainPatientDetail } from "@/api";
export default {
  components: {
    patientDetial
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
      labelData: []
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
      // this.labelData = [];
      // alert(2)
      // getWorkLabel(this.patientId).then(res => {
      //   alert(1)
      //     console.log(res);
      //   let _d = res.data.data;
      //   if (!_d.length) return;


      //   _d.map(val => {
      //     this.labelData.push(val.labelId);
      //   });
      // });
    },
    testFn() {
      this.iframeVisible.iframeShow = false;
      this.$emit("on-click");
    },
    onOff(b) {
      this.arvdShow = b;
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
        chainPatientDetail(this.patientId).then(res => {
          let _d = res.data.data;
          if (!_d.length) return;
          _d.map(val => {
            this.labelData.push(val.labelConfig);
          });
        });
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
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
      display: flex;
      li {
        margin-right: 20px;
      }
    }
  }
  .right-box {
    display: flex;
    li {
      cursor: pointer;
      color: #3b78fd;
      text-align: center;
      margin-left: 30px;
      height: 32px;
      line-height: 26px;
      width: 20px;
      font-size: 20px !important;
    }

  }
}
.main-wrap {
  flex: 2;
  padding: 10px 20px 0 20px;
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
<style>
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
#iframe_wrappers .el-dialog__body {
  height: 100%;
}
#iframe_wrappers .el-tabs--top {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
#iframe_wrappers .el-tabs__content {
  flex: 2;
}

@media screen and (max-height: 900px) {
  #pane-physical #workbench_physicalList #mains {
    height: 600px !important;
  }
  #pane-physical #workaddphysical .main {
    height: 600px !important;
  }
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
  #pane-third #addCaseHistory .content {
    height: 510px !important;
  }
}
@media screen and (max-height: 860px) {
  #pane-third #addCaseHistory .content {
    height: 460px !important;
  }
}
@media screen and (max-height: 830px) {
  #pane-physical #workbench_physicalList #mains {
    height: 500px !important;
  }
  #pane-physical #workaddphysical .main {
    height: 500px !important;
  }
  #pane-third #workbench_caseHistoryList {
    height: 500px !important;
  }
  #pane-third #addCaseHistory .content {
    height: 400px !important;
  }
}
@media screen and (max-height: 800px) {
  #pane-physical #workbench_physicalList #mains {
    height: 450px !important;
  }
  #pane-physical #workaddphysical .main {
    height: 450px !important;
  }
  #pane-third #workbench_caseHistoryList {
    height: 450px !important;
  }
  #pane-third #addCaseHistory .content {
    height: 350px !important;
  }
  #pane-six #main {
    height: 500px !important;
  }
  @media screen and (max-height: 750px) {
    #pane-six #main {
      height: 420px !important;
    }
    #pane-third #addCaseHistory .content {
      height: 350px !important;
    }
  }
  @media screen and (max-height: 720px) {
    #pane-six #main {
      height: 420px !important;
    }
    #pane-third #addCaseHistory .content {
      height: 300px !important;
    }
  }
}
</style>
