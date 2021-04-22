<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: DialogLabel.vue
@Last modified by:   ZJZ
@Last modified time: 2019-11-07
-->

<template>
  <div class="wrapper" id="label_dialog_wrap">
    <el-dialog
      title="标签管理"
      :visible.sync="isShow.label"
      :close-on-press-escape="false"
      :closeOnClickModal="false"
      :show-close="false"
      append-to-body
      width="960px"
      class="label_dialog_wrap"
      @open="handleOpen()"
      :close-on-click-modal="false"
    >
      <div class="box_wrap" id="label_dialog">
        <ul class="header">
          <li class="item" v-for="(item, index) of titleList" :key="index">{{item}}</li>
        </ul>
        <div class="main">
          <ul class="main_list" v-for="(item, index) of dataList" :key="index">
            <li class="item">
              <span v-if="!item.hide">{{item.name}}</span>
              <el-input size="small" v-model="item.name" v-else></el-input>
            </li>
            <li class="item">
              <el-color-picker
                v-model="item.color"
                :disabled="!item.hide"
                :predefine="predefineColors"
              ></el-color-picker>
            </li>
            <li class="item">
              <span v-if="!item.hide">{{item.abbreviate}}</span>
              <el-input size="small" v-model="item.abbreviate" maxlength='1' v-else></el-input>
            </li>
            <li class="item">
              <span class="preview" :style="{backgroundColor:item.color}">{{item.abbreviate}}</span>
            </li>
            <li class="item">
              <span class="cur" @click="handelEdit(item, index)">{{item.btnTxt}}</span>
              <span class="line">|</span>
              <span class="cur" @click="handelDelete(item)">{{item.bottomTxt}}</span>
            </li>
          </ul>
        </div>
        <div slot="footer">
          <div class="bottom">
            <span class="btns blues" @click="handelNewTabel">新增标签</span>
            <span class="btns" @click="finishFn">完成</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLabelConfigList, postLabelConfigList, putLabelConfigList, deleteLabelConfigList } from "@/api";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      titleList: ["名称", "颜色", "缩写", "预览", "操作"],
      color: "#3b78fd",
      predefineColors: [
        "#3b78fd",
        "#26d5c3",
        "#7ed321",
        "#f18605",
        "#ff4871",
        "#a17ceb",
        "#f85454"
      ],
      copyList: [],
      dataList: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    handelEdit(item, index) {
      if (item.hide) {
        let reg = /^[\u0391-\uFFE5A-Za-z]+$/;
        let reg_txt = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        let res_china = /^[\u0391-\uFFE5]+$/;
        let repeat = false
        if (!item.name) {
          this.$message.error("【错误】：请填写 - 名称");
          return;
        }
        if (item.name.length > 10) {
          this.$message.error("【错误】：名称最大长度为10个字");
          return;
        }
        if (!reg.test(item.name)) {
          this.$message.error("【错误】：名称中不应含有数字");
          return;
        }
        if (!item.abbreviate) {
          this.$message.error("【错误】：请填写 - 缩写");
          return;
        }
        if (!reg_txt.test(item.abbreviate.trim())) {
          this.$message.error("【错误】：缩写中：请输入英文，数字或者中文");
          return;
        }
        if (
          res_china.test(item.abbreviate.trim()) &&
          item.abbreviate.length != 1
        ) {
          this.$message.error("【错误】：缩写中：中文最大长度为一个字");
          return;
        }
        if (item.abbreviate.length > 3) {
          this.$message.error("【错误】：数字和英文最大长度为3个字");
          return;
        }

        this.dataList.map((val, i) => {
          if ( val.abbreviate == item.abbreviate && i != index ) {
            repeat = true
          }
        })
        if (repeat) {
          this.$message.error("【错误】：缩写名称不能存在重复");
          return
        }

        item.isSave = 0;
        if (!item.isClinic) {
          postLabelConfigList(item).then(res => {
            this.handleOpen()
          });
        } else {
          postLabelConfigList(item).then(res => {
            this.handleOpen()
          })
        }
        this.copyList = JSON.parse(JSON.stringify(this.dataList));
        this.currentTxt(item);
      } else {
        this.currentTxt(item);
      }
    },
    handelDelete(item) {
      if (!item.hide) {
        this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteLabelConfigList(item).then(res => {
            this.handleOpen()
          })
          }).catch(() => {});

        return;
      } else {
        if (item.isSave) {
          this.dataList = this.dataList.filter(val => val != item);
          return;
        } else {
          this.dataList = JSON.parse(JSON.stringify(this.copyList));
          return;
        }
      }
      this.currentTxt(item);
    },
    validateData() {
      if (!this.dataList.length) return false;
      let _req = "";
      this.dataList.map(val => {
        if (val.hide) _req = true;
      });
      if (_req) {
        this.$message.error("【错误】：请先保存当前正在编辑的标签");
      }
      return _req;
    },
    currentTxt(item) {
      item.hide = !item.hide;
      item.hide ? (item.btnTxt = "保存") : (item.btnTxt = "编辑");
      item.hide ? (item.bottomTxt = "取消") : (item.bottomTxt = "删除");
    },
    handelNewTabel() {
      if (this.dataList.length > 8) {
        this.$message.error("【错误】：标签最多只能添加9个");
      } else {
        if (!this.validateData()) {
          this.dataList.push({
            name: "",
            color: "#3b78fd",
            abbreviate: "",
            hide: true,
            btnTxt: "保存",
            bottomTxt: "取消",
            isSave: 1
          });
        }
      }
    },
    finishFn() {
      if (!this.dataList.length) {
        this.$message.error("【错误】：请先添加一条标签，在进行保存");
      }
      let _req = true;
      this.dataList.map(val => {
        if (val.hide) {
          this.$message.error("【错误】：请先保存当前正在编辑的标签");
          _req = false;
        }
      });
      if (_req) {
        this.$emit("sendLabelData");
        this.isShow.label = false;
      }
    },
    handleOpen() {
      getLabelConfigList().then(res => {
        let _D = res.data.data;
        if (!_D.length) return
        this.dataList = _D.map(val => {
          val.hide = "";
          val.btnTxt = "编辑";
          val.bottomTxt = "删除";
          val.isSave = 0;
          val.isChecked = false;
          val.isClinic = true; // 后端数据
          return val;
        });
      this.copyList = JSON.parse(JSON.stringify(this.dataList));
      });
    }
  },
  mixins: [],
  created() {}
};
</script>
<style lang="less" scoped>
.df(@just:space-between) {
  display: flex;
  justify-content: @just;
  align-items: center;
}
@blue: rgb(59, 120, 253);
.blues {
  background: @blue;
  color: #fff !important;
}
.cur {
  cursor: pointer;
}
.box_wrap {
}
.header {
  height: 50px;
  .df();
  background: rgb(247, 249, 255);
  .item {
    width: 20%;
    text-align: center;
  }
}
.main {
  .main_list {
    display: flex;
    text-align: center;
    border-bottom: 1px solid #dddddd;
    padding: 10px 0;
    .item {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20%;
      .line {
        padding: 0 10px;
      }
    }
  }
  .preview {
    width: 36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
  }
}

.bottom {

  .df(flex-end);
  height: 50px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  .btns {
    display: block;
    cursor: pointer;
    margin-right: 20px;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: @blue;
    border: 1px solid @blue;
  }
}
</style>
<style>
#label_dialog .el-color-picker__mask {
  background-color: transparent;
}
#label_dialog .el-color-picker__empty,
.el-color-picker__icon {
  left: 60%;
}
.label_dialog_wrap .el-dialog__body {
  padding: 10px 20px 20px;
}
.el-color-dropdown__main-wrapper,
.el-color-alpha-slider,
.el-color-dropdown__btns .el-input,
.el-color-dropdown__btns .el-color-dropdown__link-btn {
  display: none;
}
.el-color-predefine__colors {
  display: flex;
  justify-content: space-between;
}
.el-color-predefine__color-selector {
  width: 26px;
  height: 26px;
}
#label_dialog_wrap .el-icon-close:before {
  content: "\E60F" !important;
  color: #999;
}
</style>
