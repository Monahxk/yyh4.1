<!--
 * @Descripttion: hzj  value:默认tab,2019-09-05 15:55:00
 * @version: v4.0
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-05 15:55:38
 -->
<template>
  <div class="tab_wrap">
    <ul class="tab_list_wrap">
      <li
        v-for="(val, i) of navList"
        :key="i"
        :class="{active: i == currentValue, list_itme:true}"
        @click="handleChange(i)"
      >
        <span class="list_title">{{val.label}}</span>
        <p
          class="list_child_wrap"
          v-if="i === currentValue"
          >
          <span
            v-for="(item, n) of childData"
            :key="n"
            :class="{currentActive: n == currentIndex, list_child_title: true}"
            @click="changeChildNav(n)"
          >{{item}}</span>
        </p>
        <span class="line" v-if="i != navList.length-1">|</span>
      </li>
    </ul>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["value"],
  data() {
    return {
      currentValue: this.value,
      navList: [],
      childData: [],
      currentIndex: 0
    };
  },
  watch: {
    value(v) {
      this.currentValue = v
    },
    currentValue() {
      this.currentIndex = 0
      this.updateStatus();
      this.getChildTabData();
    }
  },
  computed: {},
  methods: {
    getTabs() {
      return this.$children.filter(itme =>
        Object.is(itme.$options.name, "pane")
      );
    },
    getChildTabData() {
      this.childData = this.$children[this.value].navData;
    },
    updateNav() {
      this.navList = [];
      this.getTabs().forEach((v, i) => {
        this.navList.push({
          label: v.label,
          name: v.name || i
        });
        if (!v.names) v.names = i;
        if (i == 0 && !this.currentValue && !Object.is(this.currentValue, 0)) {
          this.currentValue = v.name;
        }
      });
      this.updateStatus();
    },
    updateStatus() {
      this.getTabs().forEach((v, i) => {
        return (v.show = Object.is(v.names, this.currentValue));
      });
    },
    handleChange(i) {
      let name = this.navList[i].name;
      this.currentValue = name;
      this.$emit("input", name);
      this.$emit("on-click", name);
    },
    changeChildNav(n) {
      this.currentIndex = n
      this.$emit("on-click-nav", n);
    }
  },
  mixins: [],
  mounted() {
    this.getChildTabData();
  }
};
</script>
<style lang="less" scoped>
.tab_wrap {
  width: 100%;
}
.line {
  padding: 0 20px;
}
.tab_list_wrap {
  height: 42px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  color: #333;
  .list_itme {
    display: flex;
    align-items: center;
    .list_title {
      cursor: pointer;
      font-size: 16px;
    }
    .list_child_wrap span:nth-child(1) {
      margin-left: 20px;
    }
    .list_child_wrap span{
      cursor: pointer;
      margin: 0 10px;
    }
  }
  .active {
    color: #493bfd !important;
    .currentActive {
      border-bottom: 2px solid #493bfd;
    }
  }
  .tab-content {
    width: 100%;
  }
}
</style>
