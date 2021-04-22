<template>
  <div class="wrapper">
    <div class="nav_wrap">
      <div class="nav_left_box">
        <div
          class="nav_item"
          :class="{active: isMaxActive === index}"
          v-for="(item, index) of navListData"
          :key="index"
        >
          <span class="title" @click="handleNavFn(index)" style="color:#000">{{item.title}}</span>
          <div class="line" v-show="index === 0">
            <span>|</span>
          </div>
        </div>
      </div>
      <ul class="handle_wrap">
        <li @click="showDialog()">
          <span>新增客户</span>
        </li>
      </ul>
    </div>
    <tadayCustomer v-if="nowIndex===0"></tadayCustomer>
    <allCustomer v-if="nowIndex===1"></allCustomer>
    <addCustomer @sendEvent="handelChildEvent" :isShow="isShowDialog"/>
  </div>
</template>
<script>
import addCustomer from "./components/DialogAddCustomer.vue";
import editCustomer from "./components/DialogEditCustomer.vue";
import allCustomer from "./components/TempAllCustomer";
import tadayCustomer from "./components/TempTadayCustomer";

import { listCustomer } from "@/api";
export default {
  components: {
    tadayCustomer,
    addCustomer,
    editCustomer,
    allCustomer
  },
  data() {
    return {
      nowIndex: 0,
      isShow: false,
      navListData: [
        {
          title: "今日客户"
        },
        {
          title: "全部客户"
        }
      ],
      btnData: ["新增客户"],
      isMaxActive: 0,
      leftSmallActive: 0,
      rightSmallActive: 1,
      isShowDialog: {
        patient: false,
        add: false,
        register: false,
        patiented: false
      },
      list: []
    };
  },
  computed: {
    isSmallActive() {
      return !this.isMaxActive ? this.leftSmallActive : this.rightSmallActive;
    }
  },
  created() {},
  mounted() {
    console.log(this.$children);
  },
  methods: {
    handelChildEvent() {
      this.$children.map(val => {
        if (val.name == "A") {
          val.initlist();
        }
      });
    },
    handleNavFn(num) {
      this.isMaxActive = num;
      this.nowIndex = num;
    },
    showDialog() {
      this.isShowDialog.add = !this.isShowDialog.add;
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  .nav_wrap {
    height: 42px;
    padding: -10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .nav_left_box {
      display: flex;
      align-items: center;
      .line {
        padding: 0 20px;
        b {
          color: #ccc;
          margin-left: -12px;
        }
      }
      .nav_item {
        display: flex;
        align-items: center;
        .title {
          cursor: pointer;
          font-size: 16px;
          color: #493bfd;
        }
        .nav_main {
          display: flex;
          font-size: 14px;
          overflow: hidden;
          margin-left: 20px;
          transition: all 1s;
          width: 0;
          li {
            line-height: 20px;
            cursor: pointer;
            margin-right: 20px;
          }
        }
        .active_checked {
          border-bottom: 2px solid #7874f2;
        }
      }
      .jinai {
        cursor: pointer;
        font-size: 18px;
      }
      .active span,
      .active li {
        color: #493bfd !important;
      }
      .active .nav_main {
        width: auto;
        transition: all 0.1s easy;
      }
    }
    .handle_wrap {
      display: flex;
      position: absolute;
      right: 1px;
      z-index: 3;
      li {
        cursor: pointer;
        width: 154px;
        height: 48px;
        font-size: 18px;
        font-weight: bold;
        color: #4e81f2;
        text-align: center;
        line-height: 48px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        background-color: #ffffff;
        margin-right: 20px;
      }
    }
  }
}
.wrapper_workbench_table {
  margin-top: 25px;
}
.wrapper_workbench_table {
  box-shadow: none;
}
</style>