<!--
 * @Descripttion: 患者详情，新增病历，保存为模板
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 11:19:15
 -->
<template>
  <div class="wrapper savecomp" v-if="isShow.savecompshow">
    <div class="warp">
      <header class="head">
        保存为模板
        <span class="close" @click="isShow.savecompshow=false">x</span>
      </header>
      <div class="content">
        <div class="comp">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="22">
                <el-form-item label="保存位置" :required="true">
                  <!-- <el-select @focus="clickSelect" v-model="tempName" placeholder="请选择"></el-select> -->
                  <el-input v-model="tempName" @focus="clickSelect" placeholder="请选择">
                     <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
                  </el-input>
                  <div class="menuBox" v-if="menuShow">
                    <vuescroll :ops="ops">
                      <el-menu default-active="2" :unique-opened="true">
                        <template v-for="(tempmenuItem,index) in tempmenu">
                          <el-submenu
                            :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index"
                            :key="index"
                          >
                            <template slot="title">
                              <span
                                @click="getparentId(tempmenuItem.root.id,tempmenuItem.root.className,tempmenuItem.root.isLeaf)"
                              >{{tempmenuItem.root.className }}</span>
                            </template>
                            <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                              <el-submenu :index="'b'+index" :key="i">
                                <template slot="title">
                                  <span
                                    @click="getparentId(subItem.second.id,subItem.second.className,subItem.second.isLeaf)"
                                  >{{subItem.second.className}}</span>
                                </template>
                                <el-menu-item
                                  v-for="(thirdItem , s) in subItem.second.thirdList"
                                  :index="thirdItem.className+'-'+thirdItem.templateId"
                                  :key="s"
                                >
                                  <span
                                    @click="getparentId(thirdItem.id,thirdItem.className, thirdItem.isLeaf)"
                                    slot="title"
                                  >{{thirdItem.className}}</span>
                                </el-menu-item>
                              </el-submenu>
                            </template>
                          </el-submenu>
                        </template>
                      </el-menu>
                    </vuescroll>
                  </div>
                </el-form-item>
                <el-form-item label="模板名称">
                  <el-input v-model="name" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <footer class="foot">
        <el-row>
          <el-col class="footbut" :offset="16" :span="8">
            <el-button type="primary" @click="usecomp()" size="medium">保存</el-button>
            <el-button @click="isShow.savecompshow=false" size="medium" type="primary" plain>关闭</el-button>
          </el-col>
        </el-row>
      </footer>
    </div>
    <div class="rename_box" v-if="renameShow">
      <el-input v-model="input" placeholder="请输入内容"></el-input>
      <el-button type="primary" size="medium">保存</el-button>
      <span class="close" @click="renameShow=false">x</span>
    </div>
  </div>
</template>

<script>
import {
  getDoctorList,
  getNurseList,
  getEmrentryList,
  getTemplatelist,
  getTemplate,
  emrsave,
  getSaveTemplatelist
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import vuescroll from "vuescroll";
export default {
  components: {vuescroll},
  props: ["isShow", "other"],
  data() {
    return {
      isLeaf: "",
      parentId: "",
      renameShow: false,
      rename: false,
      name: "",
      menuShow: false,
      input: "",
      tempName: "",
      form: {},
      tempmenu: [],
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

  watch: {
    "isShow.savecompshow"() {
      getSaveTemplatelist().then(res => {
        console.log(res);
        this.tempmenu = res.data.data.rootList;
      });
    }
  },
  computed: {},
  created() {},
  methods: {
    usecomp() {
      if (checkData(this)) {
        let tempData = {
          parentId: this.parentId,
          tempName: this.name
        };
        if (this.isLeaf) {
          this.$emit("addcomp", "", tempData);
          this.isShow.savecompshow = false;
          this.name = '';
          this.tempName = '';

        }
      }
    },
    clickSelect() {
      this.menuShow = true;
      getSaveTemplatelist().then(res => {
        console.log(res);
        this.tempmenu = res.data.data.rootList;
      });
    },
    getparentId(id, name, isLeaf) {
      isLeaf === "1" ? (this.isLeaf = false) : (this.isLeaf = true);
      if (isLeaf === "1") {
        this.$message(name + "下不能添加模板！");
      } else {
        this.parentId = id;
        this.tempName = name;
      }
    },
    temphandleOpen(k, p) {},
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    cmEvent(n) {
      if (n == 1) {
        this.renameShow = true;
      }
      if (n == 2) {
        this.renameShow = true;
      }
      if (n == 3) {
      }
      if (n == 4) {
        this.renameShow = true;
      }
    }
  },
  mixins: [],
  created() {}
};
function checkData(v) {
  let cd = false;
  if (v.name != "") {
    cd = true;
  } else {
    cd = false;
    v.open("模板名称不能为空！", "warning");
    return cd;
  }
  if (v.parentId != "") {
    cd = true;
  } else {
    cd = false;
    v.open("请选择菜单！", "warning");
    return cd;
  }

  return cd;
}
</script>
<style lang="less" scoped>
.savecomp {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1000;
  .rename_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    .el-input {
      margin-top: 300px;
      width: 40%;
    }
    .close {
      font-size: 18px;
      position: absolute;
      right: 10px;
      top: 10px;
      color: #fff;
    }
    .but {
      width: 200px;
      position: absolute;
      right: 200px;
      top: 400px;
    }
  }
  .warp {
    width: 550px;
    height: 600px;
    background: #fff;
    margin: 0 auto;
    margin-top: 10vh;
    padding-bottom: 20px;
    .head {
      position: relative;
      height: 50px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      text-align: left;
      padding-left: 20px;
      font-size: 18px;
      font-weight: bold;
      .close {
        position: absolute;
        top: 2px;
        right: 20px;
        cursor: pointer;
      }
    }
    .content {
      width: 100%;
      height: 80%;
      padding: 10px 20px;

      .comp {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 10px 20px;
      }
      .menuBox {
        height: 300px;
        z-index: 999;
        overflow-y: auto;
        .el-icon-plus {
          width: 17px;
          height: 20px;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
        }
        .add_grouping {
          color: #ccc;
        }
        .outer {
          width: 100%;
          height: 100%;
        }
        .outer:hover {
          background: #ebf1ff !important;
        }
      }
    }
    .foot {
      width: 100%;
      height: 50px;
      padding: 8px 20px 0px 20px;
      .footbut {
        text-align: right;
      }
    }
  }
  .comp::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .comp::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
}
</style>
<style>
.savecomp .el-input--suffix .el-input__inner {
  width: 350px;
}

.savecomp .menuBox .el-icon-plus:before {
  color: #3b78fd;
}
.savecomp .el-select-dropdown {
  display: none;
}
</style>
