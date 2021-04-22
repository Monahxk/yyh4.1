<template>
  <div class="wrapper addrole">
    <el-dialog :title="isShow.title" :visible.sync="isShow.role" @open="openDialog" width="440px">
      <div>
        <el-form ref="form" :model="form" label-width="80px" class="demo-ruleForm">
          <el-row>
            <el-col :span="17">
              <el-form-item label="角色名称" :required="true">
                <el-input size="small" v-model="name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="角色权限">
                <el-tree
                  accordion
                  :data="editData"
                  show-checkbox
                  ref="tree"
                  node-key="id"
                  :default-expand-all="false"
                  :props="defaultProps"
                  :default-checked-keys="cks"
                  :leafOnly="true"
                ></el-tree>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="footer" slot="footer">
          <ul class="btns_wrap">
            <li class="actives" @click="getCheckedKeys()">
              <span>确定</span>
            </li>
            <li @click="isShow.role=false">
              <span>取消</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, saveAddRole, getEditData, upEditData } from "@/api";
export default {
  components: {},
  props: ["isShow"],
  data() {
    return {
      form: {},
      data: "",
      name: "",
      menuLenArr: [],
      loading: "",
      editData: [],
      defaultProps: {
        children: "submenu",
        label: "menu"
      },
      cks: []
    };
  },
  watch: {
    "isShow.role"(val) {
      console.log(val);
    }
  },
  created() {},
  computed: {},
  mounted() {},
  methods: {
    openDialog() {
      this.clear();
      this.init();
    },
    init() {
      if (this.isShow.edit) {
        // 编辑
        let data = {};
        data.id = this.isShow.id;
        getEditData(data)
          .then(res => {
            this.name = res.data.data.role.name;
            this.editData = addDataFilter(res.data.data.menuList, this);
            let arr = res.data.data.menuList;
            for (let i = 0; i < arr.length; i++) {
              this.menuLenArr.push(i);
              for (let j = 0; j < arr[i].submenu.length; j++) {
                if (arr[i].submenu[j].checked) {
                  this.cks.push(arr[i].submenu[j].id);
                }
              }
            }
          })
          .catch(function(error) {});
      } else {
        // 新增
        this.name = "";
        this.cks = [];
        addRole({}).then(res => {
          this.menuList = res.data.data.menuList;
          res.data.data.menuList.map((item, index) => {
            this.cks.push(index);
            this.menuLenArr.push(index);
          });
          this.editData = addDataFilter(res.data.data.menuList, this);
        });
      }
    },
    // 提交数据
    getCheckedKeys() {
      let roleStr = "";
      let arr = this.$refs.tree.getCheckedKeys();
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < this.menuLenArr.length; j++) {
          if (arr[i] == this.menuLenArr[j]) {
            arr.splice(i, 1);
          }
        }
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, 1) == "s") {
          arr[i] = arr[i].substr(1);
        }
      }
      roleStr = arr.join(",");
      if (checkData(this, roleStr)) {
        this.openloading();
        if (this.isShow.edit) {
          let roleData = {};
          roleData.name = this.name;
          roleData.id = this.isShow.id;
          roleData.privilege = roleStr;
          upEditData(roleData)
            .then(res => {
              if (res.data.code === 200) {
                this.loading.close();
                
                this.clear();
                this.isShow.role = false;
                this.refresh();
              } else {
  
                this.loading.close();
              }
            })
            .catch(function(error) {
              this.loading.close();

            });
        } else {
          let roleData = {};
          roleData.name = this.name;
          roleData.id = 0;
          roleData.privilege = roleStr;
          // 提交数据
          saveAddRole(roleData)
            .then(res => {
              if (res.data.code === 200) {
                this.loading.close();
                this.clear();
                this.isShow.role = false;
                this.refresh();
              } else {
                this.loading.close();
              }
            })
            .catch(function(error) {
              this.loading.close();
            });
        }
      }
    },
    clear() {
      this.editData = [];
      this.cks = [];
    },
    openloading() {
      this.loading = this.$loading({
        lock: true,
        text: "正在提交……",
        color: "#fff",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,.3)"
      });
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    refresh() {
      this.$emit("refreshData");
    }
  },
  mixins: [],
  mounted() {}
};
// 数据过滤
let addDataFilter = (arr, vm) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i].id = i;
    for (let j = 0; j < arr[i].submenu.length; j++) {
      arr[i].submenu[j].menu = arr[i].submenu[j].subMenu;
      arr[i].submenu[j].id = "s" + arr[i].submenu[j].id;
    }
  }
  return arr;
};
function checkData(v, str) {
  let cd = false;

  if (v.name != "") {
    cd = true;
  } else {
    cd = false;
    v.open("角色不能为空！", "warning");
    return cd;
  }
  if (str.length > 0) {
    cd = true;
  } else {
    cd = false;
    v.open("权限不能为空！", "warning");
    return cd;
  }
  return cd;
}
</script>
<style lang="less" scoped>
@import "../../../../assets/css/workbench/publicTable.css";

.wrapper {
  .footer {
    padding-top: 20px;
  }


    .btns_wrap {
      display: flex;
      justify-content:center;
      text-align: center;
      line-height: 32px;
      li {
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
  
  .demo-ruleForm {
    .el-row {
    }
  }
}
</style>
<style>
.addrole .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border: 7px solid #409eff;
  background-color: transparent;
}
</style>
