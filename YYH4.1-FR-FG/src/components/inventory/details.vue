<!--
 * @Descripttion: 盘点详情
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:22:59
 -->
<template>
  <div class="wrapper register" id="add_dialog">
    <el-dialog title="盘点详情" :visible.sync="isShow.isShow" width="1200px" @open="getFromDataFn">
      <div>
        <div class="header">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="单号">
              <span>{{formData.number}}</span>
            </el-form-item>
            <el-form-item label="管理员">
              <span>{{formData.clinicUserName}}</span>
            </el-form-item>
            <el-form-item label></el-form-item>
          </el-form>
        </div>

        <div class="add_reg">
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
                  <span v-if="item.prop !== 'f'">{{scope.row[item.prop]}}</span>
                  <div v-if="item.prop == 'f'">
                    <el-input-number
                      style="width:130px;"
                      v-model="num1"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      label="描述文字"
                    ></el-input-number>
                  </div>
                  <div v-if="item.isTemp">
                    <el-button type="text">备注</el-button>
                    <el-button type="text">删除</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="tool_wrap">
          <li>
            <span class>类型总数</span>
            <span class="blues">{{tableData.length}}</span>
          </li>
          <li>
            <span class>金额</span>
            <span class="blues">￥ {{allPrice}}</span>
          </li>
        </ul>
        <ul class="btns_wrap">
          <li class="actives item" @click="isShow.isShow = !isShow.isShow">
            <span>确定</span>
          </li>
          <!-- <li class="item" @click="isShow.show = !isShow.isShow">
            <span>取消</span>
          </li>-->
        </ul>
      </div>

      <div class="adide_box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetailsData } from '@/api'
export default {
  components: {},
  props: ["isShow","formData"],
  data() {
    return {
      innerVisible: false,
      allPrice:0,
      num1: 1,
      form: {},
      value1: "",
      tableHeader: [
        { prop: "drugName", label: "名称" },
        { prop: "count", label: "当前库存" },
        { prop: "drugSpec", label: "规格" },
        { prop: "unitName", label: "单位" },
        { prop: "profitLossNum", label: "盈亏数量" },
        { prop: "price", label: "金额" }
        // { prop: "i", label: "操作", isTemp: true }
        // { prop: "a", label: "名称" },
        // { prop: "b", label: "当前库存" },
        // { prop: "c", label: "品牌" },
        // { prop: "d", label: "规格" },
        // { prop: "e", label: "单位" },
        // { prop: "f", label: "盈亏数量" },
        // { prop: "g", label: "金额" },
        // { prop: "h", label: "操作", isTemp: true }
      ],
      tableData: []
    };
  },
  watch: {
    formData(val){
      console.log(123)
      console.log(val)
    }
  },
  computed: {},
  methods: {
    handleChange(val) {
      console.log(val)
    },
    getFromDataFn() {
      let id = this.formData.id
      let letArr = []
      getDetailsData(id).then(res => {
        if(res.data.code === 200) {
          let _D = res.data.data
          let allPrice = 0
          _D.map((v,i) => {
            let drugUnitsDict = ''
            if ( v.drugDict.drugUnitsDict ) {
             drugUnitsDict =  v.drugDict.drugUnitsDict.unitName
            }
            letArr.push({
              drugName:v.drugDict.drugName,
              count: v.count,
              drugSpec: v.drugDict.drugSpec,
              unitName: drugUnitsDict,
              profitLossNum: v.profitLossNum,
              price:v.price
            })
            allPrice += v.price
          })
          this.tableData = letArr
          this.allPrice = allPrice
        }
      })
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
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
    border-top: 1px solid #eee;
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
    .header {
      height: 60px;
      background: rgb(247, 245, 249);
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
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
.blues {
  font-size: 20px;
  color: #3b78fd;
  margin-right: 20px;
}
.tool_wrap {
  display: flex;
  font-size: 16px;
}
</style>
<style>
.register .el-dialog__wrapper .el-dialog__body {
  padding: 0;
}
#add_dialog .el-form {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-content: center;
}
#add_dialog .el-form .el-form-item {
  margin: 0;
}
</style>
