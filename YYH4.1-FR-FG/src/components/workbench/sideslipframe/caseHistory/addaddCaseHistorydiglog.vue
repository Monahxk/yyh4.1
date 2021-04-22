<!--
 * @Descripttion: 
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 11:17:49
 -->
<template>
  <div class="wrapper adddiglog" v-if="isShow.show">
    <div class="warp">
      <header class="head">
        病历模板
        <span class="close" @click="isShow.show=false">x</span>
      </header>
      <div class="content_t">
        <div class="comp">
          <el-row class="comp_row">
            <el-col class="left" :span="8">
              <p class="comp_title">病历分组</p>
              <el-menu
                @select="tempselect"
                :unique-opened="true"
                @open="openMenu"
              >
                <template v-for="(tempmenuItem,index) in tempmenu">
                  <el-submenu
                    :index="tempmenuItem.label+'-'+tempmenuItem.templateId+'-'+tempmenuItem.isLeaf"
                    :key="index"
                    v-if="tempmenuItem.children && tempmenuItem.children.length > 0"
                  >
                    <template slot="title">
                      <span>{{tempmenuItem.label }}</span>
                    </template>
                    <template v-for="(subItem,i)  in tempmenuItem.children">
                      <el-submenu
                        :index="subItem.label+'-'+subItem.templateId+'-'+tempmenuItem.isLeaf"
                        :key="i"
                        v-if="subItem.children && subItem.children.length > 0"
                      >
                        <template slot="title">
                          <span>{{subItem.label}}</span>
                        </template>
                        <el-menu-item
                          v-for="(thirdItem , s) in subItem.children"
                          :index="thirdItem.label+'-'+thirdItem.templateId+'-'+tempmenuItem.isLeaf"
                          :key="s"
                        >
                          <span slot="title">{{thirdItem.label}}</span>
                        </el-menu-item>
                      </el-submenu>
                      <el-menu-item v-else 
                      :key="i" 
                      :index="subItem.label+'-'+subItem.templateId+'-'+subItem.isLeaf">
                        <span slot="title">{{subItem.label }}</span>
                      </el-menu-item>
                    </template>
                  </el-submenu>
                  <el-menu-item v-else 
                  :key="index" 
                  :index="tempmenuItem.label+'-'+tempmenuItem.templateId+'-'+tempmenuItem.isLeaf">
                    <span slot="title">{{tempmenuItem.label }}</span>
                  </el-menu-item>
                </template>
              </el-menu>
            </el-col>
            <el-col class="right" :span="16">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item
                  :label="val.title+':'"
                  v-for="(val,index)  in oralExaminationDownBox"
                  :key="index"
                >
                  <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="val.entryArr"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
      <footer class="foot">
        <el-row>
          <el-col :offset="16" :span="8">
            <el-button type="primary" @click="useComp()" size="medium">使用此模板</el-button>
            <el-button @click="isShow.show=false" size="medium" type="primary" plain>关闭</el-button>
          </el-col>
        </el-row>
      </footer>
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
  emrsave
} from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
export default {
  components: {},
  props: ["isShow", "other"],
  data() {
    return {
      form: {},
      tempmenu: [],
      oralExaminationDownBox: [
        {
          title: "主诉",
          entryArr: ""
        },
        {
          title: "现病史",
          entryArr: ""
        },
        {
          title: "既往史",
          entryArr: ""
        },
        {
          title: "口腔检查",
          entryArr: ""
        },
        {
          title: "辅助检查",
          entryArr: ""
        },
        {
          title: "诊断",
          entryArr: ""
        },
        {
          title: "治疗计划",
          entryArr: ""
        },
        {
          title: "处置",
          entryArr: ""
        },
        {
          title: "医嘱",
          entryArr: ""
        },
        {
          title: "备注",
          entryArr: ""
        }
      ]
    };
  },
  watch: {
    "isShow.show"() {
      getTemplatelist().then(res => {
        this.tempmenu = res.data.data;
      });
    }
  },
  computed: {},
  methods: {
    tempselect(c, keyPath) {
      // console.log(c, keyPath);
      this.templatepush(c);
    },
    temphandleOpen() {},
    openMenu(a, b) {
      // this.templatepush(a);
    },
    templatepush(c) {
      this.oralExaminationTemplate = "";
      this.templateTitle = c.split("-")[0];
      let tid = c.split("-")[1];
      getTemplate(tid).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          let data = res.data.data;
          if (data) {
            this.oralExaminationDownBox[0].entryArr = data.mainComplain;
            this.oralExaminationDownBox[1].entryArr = data.presentIll;
            this.oralExaminationDownBox[2].entryArr = data.pastIll;
            this.oralExaminationDownBox[3].entryArr = data.toothCheck;
            this.oralExaminationDownBox[4].entryArr = data.assistCheck;
            this.oralExaminationDownBox[5].entryArr = data.diagnosis;
            this.oralExaminationDownBox[6].entryArr = data.treatPlan;
            this.oralExaminationDownBox[7].entryArr = data.dispose;
            this.oralExaminationDownBox[8].entryArr = data.advice;
            this.oralExaminationDownBox[9].entryArr = data.remark;
          } 
        }
      });
    },
    temphandleClose() {},
    useComp() {
      this.isShow.show = false;
      this.$emit("addcomp", this.oralExaminationDownBox);
    }
  },
  mixins: [],
  created() {
    for (let i = 0; i < this.oralExaminationDownBox.length; i++) {
      this.oralExaminationDownBox[i].entryStr = this.oralExaminationDownBox[
        i
      ].entryArr.toString();
    }
  }
};
</script>
<style lang="less" scoped>
.adddiglog {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 1000;
  .warp {
    width: 750px;
    height: 550px;
    background: #fff;
    margin: 0 auto;
    margin-top: 15vh;
    .head {
      position: relative;
      height: 50px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      .close {
        position: absolute;
        top: 2px;
        right: 20px;
        cursor: pointer;
      }
    }
    .content_t {
      width: 100%;
      height: 80%;
      padding: 10px 20px;

      .comp {
        width: 100%;
        height: 100%;
        // overflow-y: scroll;
        .comp_row {
          height: 100%;
          .left {
          width: 236px;
          height: 420px;
          overflow-y: auto;
            .comp_title {
              height: 40px;
              line-height: 40px;
              text-align: left;
              color: #ccc;
              font-size: 14px;
              padding-left: 20px;
            }
            box-shadow: 1px 0 0 0 #e4e9ff;
            height: 100%;
          }
          .right {
            padding: 10px 10px 10px 0;
                      // width: 236px;
          height: 420px;
          overflow-y: auto;
          }
        }
      }
    }
    .foot {
      width: 100%;
      height: 50px;
      padding: 8px 20px 0px 20px;
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