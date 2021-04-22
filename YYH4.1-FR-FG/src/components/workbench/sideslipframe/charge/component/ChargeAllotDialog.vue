<!--
 * @Descripttion: 绩效分配
 * @version: V2.0
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-10-24 10:55:12
 -->
<template>
  <div class="wrapper">
    <aside-dialog :isShow="isShow" v-model="closeData" title="绩效分配至" >
      <div>
        <ul class="header">
          <li v-for="(item,index) of headerData" :key="index">{{item}}</li>
        </ul>
        <div class="contents">
          <vuescroll :ops="ops">
            <div class="allot_content">
              <ul class="from_list" v-for="(item, index) in tableData" :key="index">
                <li>
                  <span>{{item.itemName}}</span>
                </li>
                <li>
                  <el-select v-model="item.doc" size="mini" placeholder="请选择医生" @change="changeFn">
                    <el-option :label="val.name" :value="val.id" v-for="(val, index) in selectData.doctorlist" :key="index"></el-option>
                  </el-select>
                </li>
                <li>
                  <el-select v-model="item.nurse" size="mini" placeholder="请选择护士" @change="changeFn">
                    <el-option :label="val.name" :selected="index == 1" :value="val.id" v-for="(val, index) in selectData.nurselist" :key="index"></el-option>
                  </el-select>
                </li>
              </ul>
            </div>
          </vuescroll>
        </div>
      </div>
      <div slot="footer">
        <div class="bottom">
          <span class="btns blues" @click="saveFn">保存</span>
          <span class="btns" @click="isShow.dialogVisible = false">取消</span>
        </div>
      </div>
    </aside-dialog>
  </div>
</template>

<script>
import asideDialog from "@/components/workbench/asideDialog";
import vuescroll from "vuescroll";
export default {
  components: { asideDialog, vuescroll },
  props: ["isShow", "tableData", "selectData"],
  data() {
    return {
      closeData: false,
      headerData: ["项目名称", "医生", "护士"],
      form: {},
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      }
    };
  },
  watch: {
    closeData() {
      console.log(this.closeData);
    },
    
    tableData: {
      handler(val) {
        // console.log( 'hahah', val )
        // console.log( val )
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    changeFn(){
      this.$forceUpdate()
    },
    saveFn() {
      this.isShow.dialogVisible = false
      this.$emit('on-saveData')
    }
  },
  mixins: [],
  mounted() {}
};
</script>
<style lang="less" scoped>
@blue: rgb(59, 120, 253);
.blues {
  background: @blue;
  color: #fff !important;
}
.df(@content:space-between ) {
  display: flex;
  align-items: center;
  justify-content: @content;
}

.allot_content {
  height: 400px;
}
.header {
  .df();
  height: 50px;
  text-align: center;
  background: rgb(247, 249, 255);
  li {
    flex: 2;
  }
}
.from_list {
  .df();
  li {
    height: 60px;
    .df(center);
    flex: 2;
    border-bottom: 1px solid #eee;
  }
}
.bottom {
  .df(flex-end);
  height: 60px;
  border-top: 1px solid #eee;
  .btns {
    display: block;
    cursor: pointer;
    margin-right: 20px;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: @blue;
    border: 1px solid @blue;
  }
}
.contents {
  height: 400px;
}
</style>