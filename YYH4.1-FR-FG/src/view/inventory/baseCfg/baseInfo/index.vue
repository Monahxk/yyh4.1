<!--
 * @Descripttion: 基础信息
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-26 14:53:48
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-12 10:18:58
 -->
<template>
  <div class="wrapper">
    <div class="source">
      <div class="chunk">
        <p class="title_text">物品类别管理
          <img src="../../../../assets/img/inventory/add.png" alt=""  @click="dialog('goodsType','add','新增物品类别')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in drugTypeList' :key='index'>
              {{item.goodstypeName}}
              <div class="edit">
                <img src="../../../../assets/img/inventory/edit.png" alt="" @click="dialog('goodsType','edit','修改物品类别',item)">
                <img src="../../../../assets/img/inventory/delete.png" alt="" @click='deleteGoodsType(item.id)'>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">品牌管理
          <img src="../../../../assets/img/inventory/add.png" alt="" @click="dialog('brand','add','新增物品品牌')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in drugBrandList' :key='index'>
              {{item.brandName}}
              <div class="edit">
                <img src="../../../../assets/img/inventory/edit.png" alt="" @click="dialog('brand','edit','修改物品品牌',item)">
                <img src="../../../../assets/img/inventory/delete.png" alt="" @click='deleteBrand(item.id)'>
              </div>
            </li>

          </ul>
        </div>
      </div>
      <div class="chunk right">
        <p class="title_text">单位管理
          <img src="../../../../assets/img/inventory/add.png" alt="" @click="dialog('unit','add','新增物品单位')">
        </p>
        <div class="content">
          <ul>
            <li v-for='(item,index) in drugUnitList' :key='index'>
              {{item.unitName}}
              <div class="edit">
                <img src="../../../../assets/img/inventory/edit.png" alt="" @click="dialog('unit','edit','修改物品单位',item)">
                <img src="../../../../assets/img/inventory/delete.png" alt="" @click='deleteUnit(item.id)'>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>

<!-- 患者来源的弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFla"
        width="500px"
        >
        <div class="content">
          <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="55px" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dialogForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" v-show="showcmemo">
              <el-input type="textarea" :rows="4" v-model="dialogForm.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="form('dialogForm')" :loading="loading">确 定</el-button>
          <el-button @click="close('dialogForm')">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import {saveDrugBrand,deleteDrugBrand,editDrugBrand,
        saveDrugType,deleteDrugType,editDrugType,
        saveDrugUnit,updateDrugUnit,deleteDrugUnit,listBasecfg} from '@/api'
const dialogForm = { //表单
    id: '',
    name: '',
    remark: ''
  }
export default {
  name:'inventoryBaseInfo',
  data() {
    return {
      loading: false,
      drugUnitList:[],
      drugTypeList: [],
      drugBrandList: [],
      dialogFla:false,
      dialogTitle:'',
      showcmemo: true,
      Class:'', //那个配置
      dialogForm: Object.assign({},dialogForm),//表单
      rules: {
         name: [
           { required: true, message: '请输入名称', trigger: 'blur' }
         ],
       },

    };
  },
  mounted() {
		this.init();
  },
  methods: {
    dialog(Class,type,title,item){ //来源弹窗
      let _this=this
      _this.dialogFla=true
      _this.dialogTitle=title
      _this.Class=Class
      if(Class === 'goodsType') {
        this.showcmemo = true;
      } else {
        this.showcmemo = false;
      }
      if(type == 'add'){
        setTimeout(function(){
          _this.$refs['dialogForm'].clearValidate();
					_this.dialogForm = Object.assign({},dialogForm);
        },100)

      }else{
        if(Class === 'goodsType') {
          _this.dialogForm = Object.assign({name: item.goodstypeName},item);
        } else if(Class === 'brand') {
          _this.dialogForm = Object.assign({name: item.brandName},item);
        } else if(Class === 'unit') {
          _this.dialogForm = Object.assign({name: item.unitName},item);
        }
       
      }
    },
    form(formName) {  //来源表单
      let _this=this;
      _this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(_this.Class == 'goodsType') {
            if(this.dialogForm.id) {
              editDrugType({
                goodstypeName: _this.dialogForm.name,
                id: _this.dialogForm.id,
                remark: _this.dialogForm.remark
              }).then(res => {
                this.init();
                _this.loading = false;
                _this.dialogFla = false;
              }).catch(res => {
                _this.loading = false;
              });
            } else {
              saveDrugType({
                goodstypeName: _this.dialogForm.name,
                remark: _this.dialogForm.remark
              }).then(res => {
                this.init();
                _this.loading = false;
                 _this.dialogFla = false;
              }).catch(res => {
                _this.loading = false;
              });
            }
						
          } else if(_this.Class == 'brand') {
             if(this.dialogForm.id) {
                editDrugBrand({
                  brandName: _this.dialogForm.name,
                  id: _this.dialogForm.id,
                  remark: _this.dialogForm.remark
                }).then(res => {
                  this.init();
                  _this.loading = false;
                   _this.dialogFla = false;
                }).catch(res => {
                  _this.loading = false;
                });
             } else {
                saveDrugBrand({
                  brandName: _this.dialogForm.name,
                  remark: _this.dialogForm.remark
                }).then(res => {
                  this.init();
                  _this.loading = false;
                   _this.dialogFla = false;
                }).catch(res => {
                  _this.loading = false;
                });
             }
           
          } else if(_this.Class == 'unit') {
            if(this.dialogForm.id) {
              updateDrugUnit({
                unitName: _this.dialogForm.name,
                id: _this.dialogForm.id,
                remark: _this.dialogForm.remark
              }).then(res => {
                this.init();
                _this.loading = false;
                 _this.dialogFla = false;
              }).catch(res => {
                _this.loading = false;
              });
            } else {
              saveDrugUnit({
                unitName: _this.dialogForm.name,
                remark: _this.dialogForm.remark
              }).then(res => {
                this.init();
                _this.loading = false;
                 _this.dialogFla = false;
              }).catch(res => {
                _this.loading = false;
              });
            }
          }
        } else {
          console.log('error submit!!');
          _this.loading = false;
          return false;
        }
      });
    },
    deleteGoodsType(id){//删除物品类别
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
       deleteDrugType(id).then(res => {
          this.init();
        })
      }).catch(() => {});
    },
    deleteBrand(id){//删除品牌
      this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDrugBrand(id).then(res => {
          this.init();
        })
      }).catch(() => {});
    },
		deleteUnit(id) {//删除单位
			this.$confirm("此操作将删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteDrugUnit(id).then(res => {
          this.init();
        })
      }).catch(() => {});
    },
    getBasecfg() {
      listBasecfg().then(res => {
        this.drugUnitList = res.data.data.drugUnitsDicts;
        this.drugBrandList = res.data.data.drugBrand;
        this.drugTypeList = res.data.data.goodsType;
      })
    },
		init() {
      this.getBasecfg();
		},
    close(formName) {
      this.dialogFla=false
      this.$refs[formName].resetFields();
      this.loading = false;
    },

  }
};
</script>
<style lang="less" scoped>
.temp_content .main {
  height: 100%;
}
.wrapper {
  height: 100%;
  .main_top_title {
    font-weight: normal !important;
    color: #493bdf !important;
  }
}

.source {
  display: flex;
  align-items: stretch;
  height: 100%;
  .chunk{
    width: 33%;
    height: 100%;
    border: 1px solid #DFE7F0;
    .title_text{
      padding: 16px 25px;
      background: #F7F9FF;
      font-size: 14px;
      font-weight:bold;
      position: relative;
      img{
        width: 24px;
        position: absolute;
        right: 10px;
        top: 11px;
        cursor: pointer;
      }
    }
    .content{
      height: calc(100% - 47px);
      background: white;
			padding:10px 10px;
			overflow-y: auto;
      li{
        height: 35px;
        line-height: 35px;
        padding-left: 20px;
        overflow: hidden;
        .edit{
          float: right;
          display: none;
          align-items:center;
          height: 35px;
          img{
            width: 24px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
      li:hover{
        box-shadow:0px 0px 2px 0px rgba(59,120,253,0.56);
        .edit{
          display: flex;
        }
      }
    }
  }
  .right{
    margin-left: 3%;
  }
}
        
</style>
