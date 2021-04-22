<template>
  <div class="wrapper">
    <div class="msg_list" v-for="item in 10">
      <h4>2018/12/12</h4>
      <div class="message">
        <div class="msg_time">
          <p>
            <span class="item">就诊时间：</span>
            <span class="bold">14:45 - 14:78</span>
          </p>
          <p>
            <span class="bold">复诊</span>
            <span class="bold">成都川投诊所</span>
          </p>
        </div>
        <div>
          <span class="item">状态：</span>
          <span class="red">待处理</span>
        </div>
        <div>
          <span class="item">科室：</span>
          <span>待处理</span>
        </div>
        <div>
          <span class="item">单据号：</span>
          <span>待处理</span>
        </div>
        <div>
          <span class="item">应收：</span>
          <span class="red">$300000</span>
        </div>
        <div>
          <span class="item">收费员：</span>
          <span>$300000</span>
        </div>
        <div>
          <span class="item">六毛：</span>
          <span>创建于20118-12-10 14:44:01</span>
        </div>
        <div class="btns_wrap">
          <span class="btns" @click="getDetailsFn">详情</span>
          <span class="btns" @click="deleteDataFn">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  computed: {},
  methods: {
    deleteDataFn() {
      this.$confirm("此操作将永久删除该账单记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    getDetailsFn() {
      this.$emit('changeTxt', '收费单详情')
    }
  },
  mixins: [],
  mounted () {}
}
</script>
<style lang="less" scoped>

@blue: rgb(59, 120, 253);
@big: {
  font-weight: bold;
};
.red {
  color: #ff4e65;
}
.green {
  color: #8bd836;
}
.df(@dir:flex-end) {
  display: flex;
  align-items: center;
  justify-content: @dir;
}
.bold {
  font-weight: bold;
}
.btns {
  display: block;
  cursor: pointer;
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: @blue;
  border: 1px solid @blue;
}
.wrapper {
  height: 100%;
  position: relative;
  .conent {
    position: absolute;
    top: 50px;
    right: 0;
    bottom: 60px;
    left: 0;
  }
  .msg_list {
    display: flex;
    width: 710px;
    margin: 20px 0;
    h4 {
      padding-top: 15px;
      margin-right: 30px;
    }
    .message {
      position: relative;
      padding: 10px;
      width: 720px;
      line-height: 30px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      .msg_time {
        font-size: 15px;
        display: flex;
        p:nth-child(1) {
          margin-right: 30px;
        }
      }
      .btns_wrap {
        position: absolute;
        display: flex;
        right: 20px;
        bottom: 20px;
        span:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
  }
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  border-top: 1px solid #eee;
  .df();
  .all_amount span:nth-child(2) {
    color: @blue;
    @big();
  }
}
</style>