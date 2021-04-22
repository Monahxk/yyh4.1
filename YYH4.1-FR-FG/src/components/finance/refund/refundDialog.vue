<template>
  <div class="wrapper register" id="registers">
    <el-dialog title="退费详情" :visible.sync="isShow.show" width="960px" @open="openGetData">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="退费明细" name="1">
          <el-table
            :header-cell-style="{background:'#F7F9FF'}"
            :data="tableData"
            style="width: 100%;"
            max-height="580"
          >
            <el-table-column
              fixed
              align="center"
              :prop="item.prop"
              :label="item.label"
              v-for="(item,index) in tableHeader"
              :key="index"
            >
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row[item.prop]}}</span>
                  <div v-if="item.isTemp">
                    <el-button type="text" @click="handleShowFn">详情</el-button>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <span style="color:#409EFF;cursor: pointer;">更多</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>审核通过</el-dropdown-item>
                        <el-dropdown-item>驳回</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="交易时间">
              <span>{{getTime(otherData.commitTime)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请退款时间" label-width="120px">
              <span>{{getTime(otherData.returnTime)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="退款类型">
              <span>{{otherData.statusTxt}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退款单号">
              <span>{{otherData.number}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="退款金额">
              <span class="red">￥{{otherData.price}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作员">
              <span>{{otherData.usernames}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="退费原因">
              <span>{{otherData.returnReason}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <span>{{otherData.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li class="actives item" v-if="otherData.status == 1">
            <span @click="handleCkickOne(2)">审批通过</span>
          </li>
          <li class="item" v-if="otherData.status == 1">
            <span @click="handleCkickOne(3)">驳回</span>
          </li>
          <li class="item" @click="isShow.show = !isShow.show">
            <span>取消</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail, putDrug } from "@/api";
import monment from "moment";
export default {
  components: {},
  props: ["isShow", "dataId"],
  data() {
    return {
      otherData: {},
      activeNames: ["1"],
      form: {
        region: ""
      },
      textarea3: "",
      a: true,
      value1: null,
      value4: "",
      form: {},
      tableHeader: [
        { prop: "projectName", label: "项目名称" },
        { prop: "price", label: "单价" },
        { prop: "count", label: "数量" },
        { prop: "totleSum", label: "总金额" },
        { prop: "count", label: "需退数量" }
      ],
      tableData: [
        {
          a: "待处理",
          b: "王小虎",
          c: "上海",
          d: "普陀区",
          e: "上海市普陀区金沙江路 1518 弄",
          f: 200333,
          g: "王小虎",
          color: 1
        },
        {
          a: "已驳回",
          b: "王小虎",
          c: "上海",
          d: "普陀区",
          e: "上海市普陀区金沙江路 1518 弄",
          f: 200333,
          g: "王小虎",
          color: 2
        },
        {
          a: "已通过",
          b: "王小虎",
          c: "上海",
          d: "普陀区",
          e: "上海市普陀区金沙江路 1518 弄",
          f: 200333,
          g: "王小虎",
          color: 3
        }
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleCkickOne(num) {
      this.$prompt("是否确认审批通过", "备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          console.log( this.otherData )
          putDrug({
            id: this.otherData.id,
            status: num,
            remark:value ,
          }).then(res => {
            this.isShow.show = false
            this.$emit('refreshFn')
          })
        })
    },
    handleChange(val) {},
    getTime(t) {
      return monment(t).format("YYYY-MM-DD");
    },
    openGetData() {
      getDetail(this.dataId).then(res => {
        if (res.data.code == 200) {
          let arr = ["待处理", "已通过", "已驳回"];
          this.tableData = res.data.data.refundSlipItemList;
          this.otherData = res.data.data.drugReturnRecord;
          this.otherData.statusTxt = arr[parseInt(this.otherData.status)];
          this.otherData.usernames = this.otherData.clinicUser.name;
        }
      });
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
.red {
  color: red;
}
#register {
  padding: 0 20px;
}
.wrapper {
  .blue {
    cursor: pointer;
    color: #3b78fd;
  }
  .form_box {
    padding-top: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background: rgb(247, 245, 249);
    .btns {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 36px;
      li {
        cursor: pointer;
        width: 100px;
        height: 36px;
        margin-left: 20px;
        color: #3b78fd;
        border: 1px solid #3b78fd;
      }
      li:nth-child(1) {
        color: #fff;
        background: #3b78fd;
      }
    }
  }
  .content_user {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .user_msg {
      display: flex;
      li {
        margin-right: 30px;
      }
    }
  }
  .add_reg {
    height: 400px;
    padding: 0 20px;
    border-top: 1px solid #eee;
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
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
        background-image: linear-gradient(
          110deg,
          #4d9eff,
          #3c79fd 99%,
          #3b78fd
        );
      }
    }
  }
}
</style>
<style>
#registers .el-dialog__body {
  padding: 0 20px;
}
#registers .el-dialog__footer {
  padding: 20px;
  border-top: 1px solid #eee;
}
</style>
