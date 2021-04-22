<template>
  <div class="wrapper">
    <div class="title" style="justify-content:space-between;">
      <p>
        <span class="line"></span>
        <span class="txt">{{titleTxt}}</span>
      </p>
      <p style="height:32px;">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['titleTxt'],
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
@blue: rgb(59, 120, 253);
.df(@dir:flex-end) {
  display: flex;
  align-items: center;
  justify-content: @dir;
}
.title {
  height: 50px;
  font-size: 15px;
  padding: 0 20px;
  line-height: 50px;
  display: flex;
  align-items: center;
  p {
    display: flex;
    align-items: center;
  }
  .df(flex-start);
  .line {
    display: block;
    width: 2px;
    height: 14px;
    margin-right: 10px;
    background: @blue;
  }
}
</style>