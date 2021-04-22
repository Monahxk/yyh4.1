<!--
 * @Author: jyp
 * @LastEditors: hzj
 * @Description: mainpage
 * @Date: 2019-04-02 15:47:14
 * @LastEditTime: 2019-11-08 13:43:18
 -->
<template>
  <div class="mainPage">
    <header class="head">
      <div class="head_left fl">
        <a class="logo_icon fl"></a>
        <div class="title fl">{{clinicName}}</div>
      </div>
      <div>
        <span class="txt">{{userType}}</span>
      </div>
      <div class="head_right fr">
        <div class="dropdown_box fr">
          <el-dropdown align="right" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openDownMenu(2)" v-if="isChain">
                <span class="switchIcon"></span>切换门店
              </el-dropdown-item>
              <el-dropdown-item @click.native="openDownMenu(0)">
                <span class="setIcon"></span>设置
              </el-dropdown-item>
              <el-dropdown-item @click.native="openDownMenu(1)">
                <span class="outIcon"></span>退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="user_name fr">{{name}}</div>
        <div class="head_img fr">
          <img :src="headImg" class="head_img_icon" />
        </div>
        <div @click="openMsg" :class="hasMsg  ?' msg_i' : 'msg' "></div>
      </div>
    </header>

    <div class="content_left">
      <div class="aside">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              :default-active="getDefaultActive"
              :router="true"
              class="el-menu-vertical-demo"
              @close="handleClose"
              @open="openMenu"
              @select="selectMenu"
              :unique-opened="true"
            >
              <el-submenu :index="item.menu" v-for="(item,index) in menuArr" :key="index">
                <template slot="title">
                  <i :class="item.url"></i>
                  <span>{{item.menu}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="submenuitem in item.submenu"
                    @click="menuRouter(submenuitem, item)"
                    :key="submenuitem.id"
                    :index="'/'+submenuitem.subUrl"
                  >{{submenuitem.subMenu}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="content_right">
      <router-view name="asider"></router-view>
      <div class="temp_content">
        <router-view />
      </div>
    </div>
    <div>
      <noticeDialog @msgStatus="chageMsgIcon" :isShow="MsgShow" />
      <userInfoDiolog :isShow="MsgShow" />
      <div class="dialogBox">
        <el-dialog :visible.sync="outDialogVisible" width="318px" align="ctnter">
          <span>{{operationMsg}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="outDialogVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="DialogVisible">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="switch_dialogbox">
        <el-dialog
          title="切换门店"
          :visible.sync="switchDialogVisible"
          @open="openSwitchDialog"
          width="400px"
          align="ctnter"
        >
          <div class="content">
            <!-- <div class="search_box">
              <el-input placeholder="搜索门店" v-model="store" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>-->
            <div class="storelist_box">
              <vuescroll :ops="ops">
                <ul>
                  <li
                    v-for="(item, index) in storeArr"
                    :key="index"
                    @click="selsetStore(storeArr,index)"
                    class="item_store"
                  >
                    {{item.alias}}
                    <span :class="{'el-icon-check':item.checked}"></span>
                  </li>
                </ul>
              </vuescroll>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="switchStore">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import noticeDialog from "./components/DialogNotice";
import userInfoDiolog from "./components/DialogUserInfo.vue";
import {
  getMenuList,
  getMsgLen,
  changeSuatus,
  userloguot,
  getUserInfo,
  getClinicInfo,
  getInstitutionList,
  userLogin,
  institutionIschain
} from "@/api";
import sse from "sessionstorage";
import { SOCKET_ROOT, IMGSRC_ROOT } from "@/api/config";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import vuescroll from "vuescroll";
export default {
  name: "mainPage",
  components: {
    noticeDialog,
    userInfoDiolog,
    vuescroll
  },
  data() {
    return {
      store: "",
      storeArr: [],
      userType: "",
      isChain: false,
      num: 0,
      test: "",
      switchDialogVisible: false,
      operationMsg: "确定要退出吗？",
      outDialogVisible: false,
      headImg: "",
      headImgurl: IMGSRC_ROOT + "/common/file/",
      userName: "",
      clinicName: "牙医慧口腔云",
      name: "",
      websocket: "",
      websocketUrl: "",
      institutionId: "",
      switchInstitutionId: "",
      hasMsg: false,
      timer:'',
      id: "",
      videoSrc: "",
      MsgShow: {
        msgdialogVisible: false,
        userInfoDiolog: false
      },
      menuArr: [],
      notify: "",
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      }
    };
  },
  computed: {
    getDefaultActive() {
      let path = this.$route.meta.path || this.$route.path;
      return path;
    }
  },
  created() {
    let _this = this;
    this.getSocketUrl();
    SOCKET_ROOT
      ? (this.websocketUrl = SOCKET_ROOT)
      : (this.websocketUrl = this.getSocketUrl());

    this.getInfo();
    this.userName = sse.getItem("userName");
    this.name = sse.getItem("name");
    // 判断是否为连锁机构
    institutionIschain().then(res => {
      sse.setItem("isChain", res.data.data);
      if (res.data.code == SYSTEM_HTTP_SUCCESS) {
        this.isChain = res.data.data;
      }
    });
    //判断当前浏览器是否支持WebSocket
    if ("WebSocket" in window) {
      this.websocket = new WebSocket(this.websocketUrl + sse.getItem("userId"));
    } else {
      alert("Not support websocket");
    }

    this.websocket.onerror = function() {
      console.log("连接发生错误的回调方法");

    };

    this.websocket.onopen = (e)=> {
      console.log("连接成功建立的回调方法");
      this.sendSocketMsg();


    };
    //接收到消息的回调方法
    this.websocket.onmessage = function(event) {
      console.log(event.data);
      if (event.data.indexOf("description") !== -1) {
        if (event.data) {
          _this.$root.Bus.$emit("ChangeRefresh");
          let data = JSON.parse(event.data.toString());
          _this.videoSrc = IMGSRC_ROOT + "/common/file/" + data.voice;
          let msg = data.description;
          _this.id = data.id;
          _this.handleNot(data.title, msg, data.id);

          let audios = new Audio(IMGSRC_ROOT + "/common/file/" + data.voice);
          audios.play();
        }
      }

      getMsgLen({}).then(res => {
        if (res.data.data && res.data.data > 0) {
          this.hasMsg = true;
        }
      });
    };

    //连接关闭的回调方法
    this.websocket.onclose = ()=> {
      console.log("连接关闭的回调方法");
      window.clearInterval(this.timer);
    };

    // mainpage页面跨组件执行方法
    this.$root.Bus.$on("ChangeMainpageFn", function() {
      _this.getClinicInfo();
    });
  },
  mounted() {
    // 获取侧边栏
    this.$nextTick(() => {
      this.refreshData();
    });
    window.addEventListener("beforeunload", e => this.beforeunloadHandler(e));
  },
  methods: {
    sendSocketMsg() {
      if (this.websocket ) {
        this.timer = setInterval(() => {
          this.websocket.send(0)
        }, 9 * 60 * 1000);
      }
    },
    beforeunloadHandler(e) {
      // this.websocket.close();
      // var e = window.event || e;
      // e.returnValue = "确定离开当前页面吗？";
    },
    getSocketUrl() {
      let url = document.location.href;
      let urlMap = document.location;
      let cutFront = url.indexOf("//");
      let header = "";
      let cutAfter;
      let hp = urlMap.protocol;
      hp === "http:" ? (header = "ws://") : (header = "wss://");
      url = header + urlMap.host + urlMap.pathname + "websocket/";
      return url;
    },
    getClinicInfo() {
      getClinicInfo(sse.getItem("institutionId")).then(res => {
        this.clinicName = res.data.data.alias;
      });
    },
    getInfo() {
      getUserInfo({}).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          this.institutionId = res.data.data.membership.institutionId;
          this.getClinicInfo();
          if (res.data.data.employee.photoPath) {
            sse.setItem("headImgSrc", res.data.data.employee.photoPath);
            this.headImg = this.headImgurl + res.data.data.employee.photoPath;
          } else {
            this.headImg = require("../../assets/img/userFile_active.png");
          }
        }
      });
    },
    handleNotClose(event) {
      changeSuatus(event.currentID).then(res => {
        // 获取未读消息数量
        getMsgLen({}).then(res => {
          if (res.data.data && res.data.data > 0) {
            this.hasMsg = true;
          }
        });
      });
    },
    handleNot(t, m, id) {
      this.num = this.num + 1;
      this.$notify({
        title: t,
        currentID: id,
        message: m,
        duration: 0,
        position: "top-right",
        onClose: this.handleNotClose
      });
    },
    // 获取侧边栏
    refreshData() {
      let _this = this;
      getMenuList({}).then(res => {
        console.log(res);

        _this.menuArr = res.data.data;
      });
      // 获取未读消息数量
      getMsgLen({}).then(res => {
        if (res.data.data && res.data.data > 0) {
          this.hasMsg = true;
        }
      });
    },
    menuRouter(submenuitem, item) {
      let powerId = sse.getItem("powerId");
      sse.removeItem('startTime');
      sse.removeItem('endTime');
      if (powerId != 3 && submenuitem.subUrl == "DoctorBench") {
        // this.$message("当前用户不是医生岗位，不能查看医生数据");
      }
      if (
        submenuitem.subUrl !== "ReceptionistBench" &&
        submenuitem.subUrl !== "DoctorBench"
      ) {
        this.$router.push({ path: "/" + submenuitem.subUrl });
      } else {
        let a = typeof (this.$route.path.lastIndexOf("/") - 1);
        if (submenuitem.subUrl === "ReceptionistBench" && a === "number") {
          this.$router.push({
            name: "ReceptionistBench",
            params: { menu: 0, sub: 0 }
          });
        } else if (submenuitem.subUrl === "DoctorBench" && a === "number") {
          this.$router.push({
            name: "DoctorBench",
            params: { menu: 0, sub: 0 }
          });
        }
      }
    },
    // 设置和退出
    openDownMenu(i) {
      if (i === 0) {
        this.MsgShow.userInfoDiolog = true;
      }
      if (i === 1) {
        this.outDialogVisible = !this.outDialogVisible;
        sse.removeItem('startTime');
        sse.removeItem('endTime');
      }
      if (i === 2) {
        this.switchDialogVisible = true;
        sse.removeItem('startTime');
        sse.removeItem('endTime');
      }
    },
    openSwitchDialog() {
      getInstitutionList(sse.getItem("username")).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.storeArr = res.data.data;
          this.storeArr.map(item => {
            if (item.id === this.institutionId) {
              this.$set(item, "checked", true);
            }
          });
        }
      });
    },
    selsetStore(item, i) {
      if (item.length > 1) {
        if (item[i].checked) {
          this.$set(item[i], "checked", false);
          this.switchInstitutionId = "";
        } else if (item[i].id === Number(sse.getItem("institutionId"))) {
          this.$message("同一门店不可切换");
        } else {
          for (let j = 0; j < item.length; j++) {
            this.$set(item[j], "checked", false);
          }
          this.$set(item[i], "checked", true);
          this.switchInstitutionId = item[i].id;
        }
      } else {
        this.$message("同一门店不可切换");
      }
    },
    switchStore() {
      if (this.switchInstitutionId) {
        let formData = new FormData();
        formData.append(
          "username",
          sse.getItem("username") + "$$" + this.switchInstitutionId
        );
        formData.append("password", sse.getItem("password"));
        formData.append("remember-me", false);
        userLogin(formData).then(res => {
          if (res.data.code === SYSTEM_HTTP_SUCCESS) {
            this.openMsg("登录成功");
            sse.setItem("userId", res.data.data.employee.id);
            sse.setItem("name", res.data.data.employee.name);
            sse.setItem("powerId", res.data.data.positionId);
            sse.setItem("institutionId", res.data.data.institutionId);
            if (res.data.data.photoPath !== null) {
              sse.setItem("headImgSrc", res.data.data.employee.photoPath);
            }
            this.switchInstitutionId = "";
            this.$router.go(0);
            this.getMenu();
          } else {
            this.$message(res.data.code);
          }
        });
      } else {
        this.$message("请选择门店");
      }
    },
    getMenu() {
      getMenuList({}).then(res => {
        if (res.data.code == 200) {
          let [data] = res.data.data;
          if (data.index == 1) {
            this.$router.push({
              name: data.submenu[0].subUrl,
              params: { menu: 0, sub: 0 }
            });
          } else {
            data.submenu.map((val, index) => {
              if (!index) this.$router.push({ path: "/" + val.subUrl });
            });
          }
        }
      });
    },
    DialogVisible() {
      this.websocket.close();
      userloguot().then(res => {});
      this.$router.push({ path: "/" });
    },
    // 显示选中
    handleOpen(key, keyPath) {
      if (key === "工作台") {
        this.menuArr.map(val => {
          if (val.index == 1) {
            if (val.submenu.length == 2) {
              this.$router.push({
                name: "DoctorBench",
                params: { menu: 0, sub: 0 }
              });
              return;
            }
            if (val.submenu[0].subUrl == "DoctorBench") {
              this.$router.push({
                name: "DoctorBench",
                params: { menu: 0, sub: 0 }
              });
              return;
            }
            if (val.submenu[0].subUrl == "ReceptionistBench") {
              this.$router.push({
                name: "ReceptionistBench",
                params: { menu: 0, sub: 0 }
              });
            }
          }
        });
        this.$router.push({ path: "/DoctorBench" });
      }
      if (key === "预约中心") {
      }
      if (key === "营销管理") {
        this.$router.push({ path: "/Customer" });
      }
    },
    openMenu(key, keyPath) {
      // console.log(key, keyPath);
    },
    selectMenu(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {},
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    openMsg() {
      this.MsgShow.msgdialogVisible = !this.MsgShow.msgdialogVisible;
    },
    // 改为已读后是否还有未读消息
    chageMsgIcon(p) {
      this.hasMsg = p;
    },
    // 点击改为已读
    onClick() {
      changeSuatus(this.id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.notify.close();
        }
        // 获取未读消息数量
        getMsgLen({}).then(res => {
          if (res.data.data && res.data.data > 0) {
            this.hasMsg = true;
          }
        });
      });
    }
  },
  destroyed() {
    window.clearInterval(this.timer);
    window.removeEventListener("beforeunload", e =>
      this.beforeunloadHandler(e)
    );
  },
  watch: {
    $route: {
      handler(to, from) {
        to.meta.name ? (this.userType = to.meta.name) : (this.userType = "");
      },
      immediate: true
    },
    videoSrc() {},
    // 监听头像地址变化
    "MsgShow.userInfoDiolog": {
      handler: function(obj) {
        // 判断是否头像路径
        if (!this.MsgShow.userInfoDiolog) {
          if (sse.getItem("headImgSrc")) {
            this.headImg = this.headImgurl + sse.getItem("headImgSrc");
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang='less'>
.notify_but {
  width: 88px;
  height: 32px;
  font-family: PingFangSC;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 32px;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
  float: right;
  margin-top: 20px;
}
.mainPage {
  height: 100%;
}
/* 头部 */
.head {
  height: 66px;
  background: #fff;
  border-bottom: 1px solid #dfe7f0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head_left {
  width: 400px;
  height: 100%;
}
.logo_icon {
  width: 85px;
  height: 100%;
  background: url(../../assets/img/icons-log-in-logo.png) 33px 16px no-repeat;
  background-size: 33px 33px;
  display: inline-block;
}
.title {
  width: 300px;
  height: 100%;
  color: #172440;
  font-size: 16px;
  line-height: 66px;
  font-family: PingFangSC;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 6px;
}
/* 头部右侧 */
.head_right {
  width: 400px;
  height: 66px;
  line-height: 66px;
  float: right;
  padding-right: 20px;
}
.head_img {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  margin-top: 17px;
  overflow: hidden;
}
.tem_content {
  width: 100%;
  padding-top: 1px;
}

.head_img_icon {
  width: 32px;
  height: 32px;
  vertical-align: top;
  display: inline-block;
  cursor: pointer;
}
.user_name {
  margin-left: 8px;
  height: 100%;
  line-height: 66px;
  font-family: PingFangSC;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: right;
  color: #1b1e25;
}
.msg {
  height: 100%;
  width: 24px;
  background: url(../../assets/img/mainpage/icon_mainpage_msg.png) 0px 21px
    no-repeat;
  margin-right: 18px;
  cursor: pointer;
  float: right;
}
.msg_i {
  height: 100%;
  width: 24px;
  background: url(../../assets/img/mainpage/icon_mainpage_hasmsg.png) 0px 21px
    no-repeat;
  margin-right: 18px;
  cursor: pointer;
  float: right;
}
.out {
  height: 100%;
  width: 24px;
  background: url(../../assets/img/mainpage/icon_mainpage_informationopen.png)
    0px 24px no-repeat;
  margin-left: 14px;
  cursor: pointer;
}

.dropdown_box {
  height: 100%;
  width: 24px;
  margin-left: 14px;
  cursor: pointer;
}
.switchIcon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: -7px;
  margin-right: 10px;
  background: url(../../assets/img/mainpage/icon_mainpage_switch.png) 0px 0px
    no-repeat;
}
.outIcon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: -7px;
  margin-right: 10px;
  background: url(../../assets/img/mainpage/icon_mainpage_set.png) 0px 0px
    no-repeat;
}
.setIcon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: -7px;
  margin-right: 10px;
  background: url(../../assets/img/mainpage/icon_mainpage_signout.png) 0px 0px
    no-repeat;
}
.content_left {
  position: absolute;
  width: 182px;
  left: 0px;
  top: 66px;
  right: 182px;
  width: 182px;
  bottom: 0;
  border-right: 1px solid #dfe7f0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
/* 侧边栏 */
.aside {
  padding-top: 28px;
}
.txt {
  color: #3c79fd;
  font-size: 18px;
}
.content_right {
  background: #fcfdff;
  position: absolute;
  left: 182px;
  top: 66px;
  bottom: 0;
  right: 0;
  overflow: hidden;
}

.temp_content {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  padding: 20px;
  padding-bottom: 30px;
  // overflow-y: auto;
}
/* 内容区 */

/* 侧边栏背景色 */
.el-menu-item .is-active {
  background-color: rgba(59, 120, 253, 0.1) !important;
}
/* 侧边栏 hover*/
.el-submenu__title:hover {
  // background-color: red !important;
}
.mainPage .aside .el-menu-vertical-demo {
  border: none;
}
/* 侧边栏 图标*/
.mainPage .todays:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_worktoday.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .workbench:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_worktoday.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .patientcenter:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_patientcenter.png");
  margin-right: 10px;
  vertical-align: -6px;
}

.mainPage .appointcenter:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_reservation.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .inventory:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_inventory.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .internal:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_administration.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .statistics:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_report.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .marketing:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_marketing.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .systemcfg:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_systemmanagement.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .finance:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_financialmanagement.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .chain:before {
  width: 24px;
  height: 24px;
  content: url("../../assets/img/mainpage/icon_mainpage_chain.png");
  margin-right: 10px;
  vertical-align: -6px;
}
.mainPage .el-menu-item {
  min-width: 181px;
  text-align: center;
}
.search_box {
  width: 100%;
  padding: 4px 0 10px 0;
}
.item_store {
  height: 56px;
  position: relative;
  line-height: 56px;
  border-bottom: 1px solid #eee;
  text-align: center;
  cursor: pointer;
}
.item_store:hover {
  background: #eee;
}
.storelist_box {
  height: 300px;
}
.checked_store {
}
.el-icon-check {
  font-weight: bold;
  color: #3b78fd;
  margin-left: 20px;
  font-size: 20px;
  position: absolute;
  right: 30px;
  top: 20px;
}
</style>
<style>
.mainPage .el-notification__closeBtn {
  top: none;
  padding: 5px 20px;
  border-radius: 5px;
  background: #4e81f2;
}
.mainPage .el-notification__content {
  margin-top: 20px;
}
.mainPage .el-icon-arrow-down:before {
  width: 24px;
  height: 24px;
  content: url(../../assets/img/mainpage/icon_mainpage_informationopen.png) 0px
    20px !important ;
  margin-right: 10px;
}
/* 侧边栏 */
.mainPage .el-menu-item .is-active {
  background-color: rgba(59, 120, 253, 0.1) !important;
}
/* 侧边栏 hover*/
.mainPage .el-submenu__title:hover {
  background-color: rgba(59, 120, 253, 0.1) !important;
}
.mainPage .el-menu-item :hover {
  background-color: rgba(59, 120, 253, 0.1) !important;
}
/* 设置table字体 */
.el-table {
  font-size: 16px;
  text-align: center;
  color: #797979;
}
/* 设置table 详情里字体 */
.wrapper_workbench_table .el-table__row .cell .el-button {
  font-size: 14px;
}
/* 设置分页里字体 */
.wrapper_workbench_table
  .block
  .el-pagination
  .el-pagination__sizes
  .el-input__inner {
  font-size: 16px;
}
/* 设置分页里字体 */
.wrapper_workbench_table .block .el-pagination .el-pagination__jump {
  font-size: 16px;
}
.mainPage .switch_dialogbox .el-dialog__body {
  padding: 10px 10px;
}
</style>
