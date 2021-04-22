<template>
  <div class="wrapper">
    <ul class="header_wrap">
      <li>
        <span class="title">申请拍片</span>
      </li>
      <li @click="sendData">
        <span>发送申请</span>
      </li>
    </ul>

    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="拍片类型" prop="name">
        <el-radio-group v-model="type">
          <div class="radio_wrap">
            <el-radio :label="index" v-for="(item, index) in radioArr" :key="index">{{item}}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-dialog title="申请拍片" :visible.sync="dialogVisible" width="900px">
      <div class="content">
        <p class="content_title">拍片类型</p>
        <div class="content_tree_box">
          <el-tree
            :data="typeArr"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>
      <div slot="footer">
        <ul class="btns_wrap">
          <li class="actives item">
            <span>确认挂号</span>
          </li>
          <li class="item" @click="dialogVisible = !dialogVisible">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPhotoType, getNoticeMessage } from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import { mapState } from "vuex";
export default {
  components: {},
  props: [],
  data() {
    return {
      radioArr: [],
      ruleForm: {},
      type: "",
      defaultProps: "",
      dialogVisible: false,
      typeArr: []
    };
  },
  watch: {},
  computed: mapState({
    id: state => state.signal.rowId
  }),
  methods: {
    sendData() {
      if(!this.type) {
        this.$message({
          message: '请选择拍片类型',
          type: 'error'
        });
        return;
      }
      getNoticeMessage({ masterId: this.id, type: this.type }).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
        }
      });
    }
  },
  mixins: [],
  mounted() {
    getPhotoType().then(res => {
      if (res.data.code === SYSTEM_HTTP_SUCCESS) {
        this.radioArr = Object.values(res.data.data);
      }
    });
  }
};
</script>
<style lang="less" scoped>
.radio_wrap {
  display: flex;
  flex-flow: row wrap;
}
.header_wrap {
  color: #3b78fd;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li:nth-child(1) {
    font-size: 16px;
  }
  li:nth-child(2) {
    cursor: pointer;
    width: 88px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
  }
}
.img-wrap {
  display: flex;
  flex-flow: row wrap;
  .list-item {
    width: 260px;
    margin: 0 20px 20px 0;
    .img {
      height: 130px;
      img {
        background: #ccc;
      }
    }
    p {
      font-size: 14px;
      text-align: center;
      line-height: 30px;
    }
  }
}
.content {
  display: flex;
  .content_title {
    margin-top: 5px;
    margin-right: 10px;
  }
}
.content_tree_box {
  margin-bottom: 200px;
}
.btns_wrap {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  line-height: 32px;
  .item {
    cursor: pointer;
    color: #3b78fd;
    width: 88px;
    height: 32px;
    border: 1px solid #3b78fd;
    margin-right: 20px;
  }
  .actives {
    color: #fff;
    background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
  }
}
</style>