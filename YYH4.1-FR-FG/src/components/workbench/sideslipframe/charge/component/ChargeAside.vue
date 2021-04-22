<template>
  <div class="wrapper">
    <div class="search_box">
      <el-input size="small" placeholder="编码名称/名称/首字母" @input="searchServeFn" v-model="searchServe"></el-input>
    </div>
    <div class="scroll_wrap">
      <vuescroll :ops="ops">
        <ul class="aside_box" v-show="!searchServe">
          <li v-for="(item, index) in medicalServices" :key="index" class="item_title">
            <div class="titles" @click="selectNav(item, index)">
              <i class="el-icon-caret-bottom" v-show="item.is"></i>
              <i class="el-icon-caret-right" v-show="!item.is"></i>
              <el-button type="text" style="color:#666">{{item.name}}</el-button>
            </div>
            <ul class="childNav" v-show="item.is">
              <li
                v-for="(val, index) in item.childListData"
                :key="index"
                :class="{is_active_checked:val.isChecked}"
                @click="handleChilden(val)"
              >
                <el-button type="text" style="color:#666">{{val.name}}</el-button>
              </li>
            </ul>
          </li>
        </ul>

        <ul class="childNav" v-show="searchServe">
          <li
            v-for="(val, index) in doctorSearchData"
            :key="index"
            :class="{is_active_checked:val.isChecked}"
            @click="handleChilden(val)"
          >
            <el-button type="text" style="color:#666">{{val.name}}</el-button>
          </li>
        </ul>
      </vuescroll>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
@bacColor: rgb(236, 242, 252);
.scroll_wrap {
  height: 100%;
  padding-bottom: 32px;
}
.aside_box {
  .item_title {
    cursor: pointer;
    .childNav {
      line-height: 30px;
      li {
        padding-left: 20px;
        margin-bottom: 5px;
      }
    }
    .titles:hover {
      background: @bacColor;
    }
  }
}
.is_active_checked {
  background: @bacColor;
}
</style>