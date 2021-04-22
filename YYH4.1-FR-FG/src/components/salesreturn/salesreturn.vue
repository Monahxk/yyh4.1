<template>
     <div class="wrapper">
        <el-dialog width="900px" title="新增退货单" :visible.sync="isShow.tui">
                 <el-form :model="form" label-width="70px" >
                        <el-row>
                                <el-col :span="11">
                                   <el-form-item label="退货日期" style="marginLeft:30px">
                                        <el-date-picker
                                            v-model="value1"
                                            style='width:230px'
                                            marginLeft:10px
                                            type="date"
                                            size="small"
                                            placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="退货人">
                                        <el-select size="small" v-model="value" placeholder="请选择">
                                        <el-option  
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                        </el-row>
                        <el-row>
                             <el-col :span="11">
                                   <el-form-item label="备注" style="marginLeft:30px">
                                        <el-input size="small" style="width:550px;" type="textarea" v-model="desc"></el-input>
                                    </el-form-item>
                                </el-col>
                        </el-row>
                 </el-form>

                  <el-table
                highlight-current-row
                @open="initlist"
                :data="list"
                max-height="200px"
                style="font-size: 14px;marginTop:10px; overflowY: scroll;"
                :header-cell-style="{background:'rgba(228, 233, 255, 0.29)',color:'#000'}"
              >
                <el-table-column prop="name" label="物品" width="120" align="center"></el-table-column>

                <el-table-column prop="name" label="品牌" sortable align="center"></el-table-column>
                <el-table-column prop="name" label="规格" sortable align="center"></el-table-column>
                <el-table-column prop="name" label="单位" sortable align="center"></el-table-column>
               
                <el-table-column prop="name" label="入库单价" sortable align="center"></el-table-column>
                <el-table-column prop="name" label="剩余数量" sortable align="center"></el-table-column>
                <el-table-column prop="name" label="退货数量" sortable align="center"></el-table-column>
                <el-table-column prop="name" label="退货单价" sortable align="center"></el-table-column>

              </el-table>

              <div style="marginTop:25px;display:flex;">
                  <div class="left" style="display:flex;lineHeight:50px">
                      <p style="marginLeft:50px">退货总数量</p><span>555</span>
                       <p style="marginLeft:20px">退货总金额</p><span>555</span>
                  </div>
                  <div class="right" style="lineHeight:50px">
                         <el-button  style="marginRight:50px;marginLeft:400px" size="small">保存</el-button>
                         <el-button style="marginRight:20px" size="small">取消</el-button>
                  </div>
              </div>
        </el-dialog>
     </div>
</template>
<script>
export default {
  components: {},
  props: ['isShow'],  
  data(){
      return{
        form:{},
          value1:"",
          value:"",
          desc:"",
           options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        list:[
            {
                name:"琪琪"
            }, {
                name:"琪琪"
            },
             {
                name:"琪琪"
            }, {
                name:"琪琪"
            },
             {
                name:"琪琪"
            }
        ]
      }
  },
  methods:{
      handleClose(){},
      initlist(){
        
      }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/css/workbench/publicTable.css";
.spHeight{
  height: 35px
}

.wrapper {
   height: 100px;
   overflow-y: scroll;
  width:600px;
  .btns_wrap {
    display: flex;
    justify-content: flex-start;
    text-align: center;
    line-height: 32px;
    margin-top: 70px;
    li {
      cursor: pointer;
      color: #3b78fd;
      width: 88px;
      height: 32px;
      border: 1px solid #3b78fd;
      margin-right: 20px;
    }
    li:nth-child(2){
      margin-left: 400px;
    }
    .actives {
      color: #fff;
      background-image: linear-gradient(110deg, #4d9eff, #3c79fd 99%, #3b78fd);
    }
  }
  
}
.box{
       width: 700px;
       height: 170px;
        box-shadow: 0 0 6px 0 #e4e9ff;
        margin-left: 15px;
       background-color: #ffffff;
       p{
        width:100%;
        height: 40px;
        background-color: #f7f9ff;
        padding-left: 35px;
        box-sizing: border-box;
        line-height: 44px;
        color:#000;
       
       }
  }
  .demo-ruleForm{
    width: 800px;
    height: 400px
  }

.el-form-item {margin-bottom: 7px;}   
</style>