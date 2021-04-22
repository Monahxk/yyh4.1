<!--
 * @Descripttion: 新增处置记录
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-05 18:02:41
 -->
<template>
  <div class="wrapper">
    <ul class="header_wrap">
      <li>
        <span @click="backList">处置记录 ></span>
        <span>{{id ? "编辑记录" : "新增记录"}}</span>
      </li>
    </ul>
    <div class="main" id="main" v-if="true">
      <div style>
        <el-form label-width="140px" v-model="form">
          <el-row>
            <el-col :span="11">
              <el-form-item label="选择牙位:">
                <div class="box" @click="openTooth">
                  <div class="lt">{{form.leftUpValue}}</div>
                  <div class="rt">{{form.rightUpValue}}</div>
                  <div class="lb">{{form.leftDownValue}}</div>
                  <div class="rb">{{form.rightDownValue}}</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item
                label="处置日期:"
                label-width="140px"
                class="demonstration"
                :required="true"
              >
                <el-date-picker
                  v-model="form.commitTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="处置内容:" label-width="140px" :required="true">
                <el-input
                  type="textarea"
                  :rows="3"
                  size="medium"
                  style="width:700px"
                  placeholder="请在这里写下处置内容"
                  v-model="form.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="selecttooth_box" v-if="innerVisible">
        <div class="selecttooth">
          <SelectTooth
            :index="selectToothIndex"
            :reqData="innerToothData"
            @selectToothFun="selectToothFun"
          />
        </div>
      </div>
    </div>
    <div style="marginLeft:700px">
      <el-button type="primary" @click="add">保存</el-button>
      <el-button @click="backList">取 消</el-button>
    </div>
  </div>
</template>

<script>
import monment from "moment";
import { mapState } from "vuex";
import { saveRecord, upDataRecord, getEditRecord } from "@/api";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import SelectTooth from "../components/SelectTooth";
export default {
  components: { SelectTooth },
  props: ["id"],
  data() {
    return {
      dialogFormVisible: false,
      innerVisible: false,
      innerToothData: {
        leftDownValue: "",
        leftUpValue: "",
        rightDownValue: "",
        rightUpValue: "",
        toothContent: ""
      },
      form: {
        leftUpValue: "",
        leftDownValue: "",
        rightUpValue: "",
        rightDownValue: "",
        commitTime: "",
        remark: "",
        patientId: ""
      },
      selectToothIndex: 0, //点击选中的牙位是列表第几个
      loading: ""
    };
  },
  watch: {},
  computed: mapState({
    patientId: state => state.signal.patientId
  }),
  created() {
    this.init();
  },
  mounted() {
    if (this.id) {
      getEditRecord(this.id).then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          Object.assign(this.form, res.data.data);
        }
      });
    }
  },
  methods: {
    init() {},
    openTooth(index, data) {
      this.innerVisible = true;
      Object.assign(this.innerToothData, this.form);

    },
    selectToothFun(val) {
      this.form.leftUpValue = val.leftUpValue;
      this.form.leftDownValue = val.leftDownValue;
      this.form.rightUpValue = val.rightUpValue;
      this.form.rightDownValue = val.rightDownValue;
      this.innerVisible = false;
    },
    backList() {
      this.$emit("openOrclose","",true);
      
    },
    getTime(t, l) {
      if (l) {
        return monment(t).format("YYYY-MM-DD");
      } else {
        return monment(t).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    add() {
      if (!this.form.commitTime) {
        this.$message.error("请选择处置日期");
        return;
      }
      if (!this.form.remark) {
        this.$message.error("请输入处置内容");
        return;
      }
       this.form.patientId = this.patientId;
      if (this.id) {
        upDataRecord(this.form).then(res => {
          if (res.data.code === SYSTEM_HTTP_SUCCESS) {
            this.$emit("openOrclose","",true);
          }
        });
      } else {
        saveRecord(this.form).then(res => {
          if (res.data.code === SYSTEM_HTTP_SUCCESS) {
            this.$emit("openOrclose","",true);
          }
        });
      }
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.wrapper {
  .main::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .main::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
  padding-bottom: 30px;
  .section_title {
    font-weight: bold;
  }
  .foot {
    width: 150px;
    margin: 20px auto;
    button {
      display: inline-block;
      border: 1px solid #3b78fd;
      width: 70px;
      height: 30px;
      background: #fff;
      color: #3b78fd;
    }
  }
}
.add_bt {
  font-size: 14px;
  display: block;
  cursor: pointer;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(59, 120, 253);
}
.header_wrap {
  color: #3b78fd;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li:nth-child(1) {
    font-size: 16px;
    padding-left: 10px;
    cursor: pointer;
  }
  li:nth-child(3) {
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    padding-left: 10px;
    padding: 0 4px 0 4px;
    border: 1px solid #3b78fd;
    margin-left: 700px;
    cursor: pointer;
  }
  li:nth-child(2) {
    cursor: pointer;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #3b78fd;
    padding: 0 4px 0 4px;
  }
}
.img_box {
  width: 400px;
}
.addMain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  padding-top: 4px;
  height: 700px !important;
  overflow-y: scroll;
  .list_item {
    display: flex;
    margin-bottom: 20px;
    .timer {
      width: 100px;
      color: #1b1e25;
      font-size: 14px;
      font-weight: bold;
    }
    .list_content {
      width: 650px;
      padding: 10px;
      color: #1b1e25;
      font-size: 14px;
      box-shadow: 0 0 6px 0 #e4e9ff;
      background-color: #ffffff;
      li {
        display: flex;
        line-height: 30px;
      }
      li span:nth-child(1) {
        margin-right: 10px;
      }
      .other {
        justify-content: space-between;
        div {
          display: flex;
          p {
            cursor: pointer;
            width: 88px;
            height: 32px;
            border: 1px solid #3b78fd;
            color: #3b78fd;
            text-align: center;
            line-height: 32px;
          }
          p:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
.selecttooth_box {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  background: rgba(7, 5, 5, 0.3);
  .selecttooth {
    width: 800px;
    height: 500px;
    background: #fff;
    margin: 100px auto;
  }
}
@b_height: 70px;
.box {
  width: 180px;
  height: @b_height;
  // background: #ccc;
  div {
    width: 50%;
    height: 50%;
    box-sizing: border-box;
    float: left;
    font-size: 14px;
    letter-spacing: 1px;
    line-height: @b_height / 2;
    cursor: pointer;
  }
  .lt {
    border-right: 1px solid #3b78fd;
    text-align: right;
  }
  .lb {
    border-right: 1px solid #3b78fd;
    border-top: 1px solid #3b78fd;
    text-align: right;
  }
  .rb {
    border-top: 1px solid #3b78fd;
  }
}
</style>
<style>
.caseHistoryList_collapse .el-collapse-item__arrow {
  display: none;
}
</style>
