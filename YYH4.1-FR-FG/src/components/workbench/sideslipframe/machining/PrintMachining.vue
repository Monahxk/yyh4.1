<!--
 * @Descripttion: 技加工打印
 * @version: v4.1
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-13 18:25:07
 -->
<template>
  <div class="wrapper machiningprinting">
    <asideDialog title="打印预览" :isShow="isShow">
      <div id="printTest">
        <section>
          <div style>
            <el-row>
              <el-col :span="24">
                <p style="marginTop:20px;" class="title">{{currentinstitution.name}} -- 技加工</p>
              </el-col>
            </el-row>
            <div class="content">
              <el-row class="patientinfo">
                <el-col :span="6">
                  <span>患者姓名：{{data.patientName}}</span>
                </el-col>
                <el-col :span="6">
                  <span>性别：</span>
                  <span>{{data.gender}}</span>
                </el-col>
                <el-col :span="6">
                  <span>出生日期：</span>
                  <span>{{data.birthDay}}</span>
                </el-col>
                <el-col :span="6">
                  <span>手机：</span>
                  <span>{{data.patientMobile}}</span>
                </el-col>
              </el-row>
              <el-row>
                <table width="100%" border="1" class="infolist">
                  <tr>
                    <td width="20%" align="center">
                      <B>牙位</B>
                    </td>
                    <td width="35%" align="center">
                      <B>材料</B>
                    </td>
                    <td width="25%" align="center">
                      <B>型号</B>
                    </td>
                    <td width="15%" align="center">
                      <B>数量</B>
                    </td>
                  </tr>
                  <tr v-for="(item,index) in data.detailsList" :key="index">
                    <td width="20%">
                      <table
                        width="80%"
                        class="cross_table"
                        style="text-align: center;margin-left: 20px;"
                        border="0"
                      >
                        <tr style="border-bottom:1px solid #ccc;">
                          <td width="71px" style="border-width: 0 1px 1px 0;">{{item.leftUpValue}}</td>
                          <td
                            width="71px"
                            style="border-width: 0 0 1px 0;border-left:1px solid #ccc;"
                          >{{item.rightUpValue}}</td>
                        </tr>
                        <tr>
                          <td width="71px" style="border-width: 0 1px 0 0; ">{{item.leftDownValue}}</td>
                          <td
                            width="71px"
                            style="border-width: 0;border-left:1px solid #ccc;"
                          >{{item.rightDownValue}}</td>
                        </tr>
                      </table>
                    </td>
                    <td width="35%">{{item.material}}</td>
                    <td width="25%">{{item.model}}</td>
                    <td width="15%">{{item.quantity}}</td>
                  </tr>
                </table>
              </el-row>
            </div>
          </div>
        </section>
        <section class="machining_info">
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">就诊时间</el-col>
                <el-col :span="14">{{data.visitTime}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">医生姓名</el-col>
                <el-col :span="14">{{data.doctorName}}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">订单编号</el-col>
                <el-col :span="14">{{data.orderNo}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">联系电话</el-col>
                <el-col :span="14">{{data.teleno}}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">加工单位</el-col>
                <el-col :span="14">{{data.unit}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">取件人</el-col>
                <el-col :span="14">{{data.pickupContacts}}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">加工费用</el-col>
                <el-col :span="14">{{data.machiningCostYuan}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">患者收费</el-col>
                <el-col :span="14">{{data.sellPriceYuan}}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">订单状态</el-col>
                <el-col :span="14">{{arr[data.orderStatus]}}</el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="10">备注</el-col>
                <el-col :span="14">{{data.remark}}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </section>
        <section class="clinicInfo">
          <el-row type="flex" class="row_bg" justify="space-between" style="marginBottom:10px;">
            <el-col :span="10">
              <div>联系电话：{{currentinstitution.teleno}}</div>
            </el-col>
            <el-col :offset="1" :span="6">
              <div>接诊时间：周一 ~ 周五 09:00-18:00</div>
            </el-col>
          </el-row>
          <el-row class="row_bg">
            <el-col :span="20">
              <div>地址：{{currentinstitution.addr}}</div>
            </el-col>
          </el-row>
        </section>
      </div>
      <div slot="footer" class="dialog-footer">
        <ul class="btns_wrap">
          <li v-print="'#printTest'">
            <span @click="close('p')">打印</span>
          </li>
          <li @click="close">
            <span >取消</span>
          </li>
        </ul>
      </div>
    </asideDialog>
  </div>
</template>
<script>
import { getMachiningPrint,getCurrentClinic } from "@/api";
import { SYSTEM_HTTP_SUCCESS, STATUS_MACHINING_STATUS_ARR } from "@/constant";
import asideDialog from "../../asideDialog.vue";
import { mapState } from "vuex";
export default {
  components: { asideDialog },
  props: ["isShow"],
  data() {
    return {
      arr: STATUS_MACHINING_STATUS_ARR,
      data: {
        machiningProduct: { patientName: "" }
      },
      currentinstitution: {}
    };
  },

  watch: {
    "isShow.id"(val) {
      getMachiningPrint(this.isShow.id).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          this.data = res.data.data;
        }
      });
    }
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg,
  }),
  mounted() {
    this.getCurrentinstitution();
  },
  methods: {
    close(p) {
      if (p) {
        setTimeout(() => {
          this.$emit("closeAdd");
          this.isShow.dialogVisible = false;
        }, 500);
      } else {
        this.$emit("closeAdd");
        this.isShow.dialogVisible = false;
      }
    },
    getCurrentinstitution() {
      let currentinstitution = sessionStorage.getItem('currentinstitution');
      if(currentinstitution) {
        this.currentinstitution = JSON.parse(currentinstitution);
      } else {
        getCurrentClinic().then(res => {
          if(res.data.code == SYSTEM_HTTP_SUCCESS) {
            this.currentinstitution = res.data.data;
            sessionStorage.setItem("currentinstitution", JSON.stringify(this.currentinstitution));
          }
        })
      }
    }
  },
  mixins: []
};
</script>
<style lang="less" scoped>
.printTest {
  width: 850px;
}
.patientinfo {
  margin-top: 40px;
}

.clinicName {
  height: 30px;
  margin-bottom: 20px;
  text-align: center;
  padding-left: 100px;
  img {
    width: 90%;
  }
}
.title {
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}
.clinic_logo {
  position: absolute;
  left: 10px;
  top: -17px;
  width: 78px;
  height: 80px;
}
.content {
  width: 100%;
  margin: 10px auto;
  font-weight: bold;
  margin-bottom: 10px;
  .patientinfo {
    padding: 10px 0 10px 0;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    .el-col {
      text-align: center;
    }
  }
  .infolist {
    margin-top: 20px;
    text-align: center;
    tr {
      height: 40px;
    }
  }
}
.clinicInfo {
  margin-top: 20px;
  border-top: 1px solid #000;
  padding-top: 10px;
}

.machining_info {
  padding: 10px;
  .el-col {
    height: 40px;
    line-height: 40px;
  }
}
.btns_wrap {
  display: flex;
  justify-content: flex-start;
  text-align: center;
  line-height: 32px;
  margin-top: 20px;
  margin-bottom: 70px;
  li {
    cursor: pointer;
    color: #3b78fd;
    width: 88px;
    height: 32px;
    border: 1px solid #3b78fd;
    margin-right: 20px;
    line-height: 32px;
  }
  li:nth-child(1) {
    margin-left: 400px;
  }
  .actives {
    color: #fff;
  }
}
</style>
<style>
</style>
