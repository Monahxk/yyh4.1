<!--
 * @Author: jyp
 * @LastEditors: hzj
 * @Description: 新增和编辑电子病历
 * @Date: 2019-02-20 14:03:12
 * @LastEditTime: 2019-11-14 09:19:07
 -->
<template>
  <div class="wrapper" id="addCaseHistory">
    <ul class="header-wrap">
      <li>
        <span @click="closeAdd">病历记录 ></span>
      </li>
      <li>
        <span>新增病历</span>
      </li>
      <li>
        <span @click="diglogShow.show=true">模板病历</span>
      </li>
    </ul>
    <div class="seachBox">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="诊治医生" :required="true">
              <el-select v-model="doctor" placeholder="请选择医生">
                <el-option
                  :label="val.name"
                  :value="val.id"
                  v-for="(val,index) in doctorList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="3" :span="8">
            <el-form-item label="护士">
              <el-select v-model="nurse" placeholder="请选择护士">
                <el-option
                  :label="val.name"
                  :value="val.id"
                  v-for="(val,index)  in nurseList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="诊治日期">
              <el-select v-model="visitTime" placeholder="选择日期时间" @change="changeVisitTime" clearable>
                <el-option
                  :label="val.registerTime"
                  :value="val.registerTime"
                  v-for="(val,index)  in visitTimeList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="3" :span="7">
            <el-form-item label="类别" class="checkFlag_radio" :required="true">
              <el-radio v-model="checkFlag" label="0">初诊</el-radio>
              <el-radio v-model="checkFlag" label="1">复诊</el-radio>
              <!-- <el-radio v-model="checkFlag" label="2">再诊</el-radio> -->
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label>
              <el-checkbox v-model="synchronization">牙位同步</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="wrap">
      <div class="height100 wrap_left">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo height100"
          @open="handleOpen"
          @close="handleClose"
          @select="clselect"
        >
          <el-submenu index="1">
            <template slot="title">
              <span>主诉及病史</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="mainStatement">主诉</el-menu-item>
              <el-menu-item index="medicalHistory">现病史</el-menu-item>
              <el-menu-item index="pastHistory">既往史</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>口腔检查</span>
            </template>
            <el-menu-item index="oralExamination">口腔检查</el-menu-item>
            <el-menu-item index="auxiliary">辅助检查</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <span>诊断与治疗计划</span>
            </template>
            <el-menu-item index="diagnosis">诊断</el-menu-item>
            <el-menu-item index="treatment">治疗计划</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <span>处置与医嘱</span>
            </template>
            <el-menu-item index="handle">处置</el-menu-item>
            <el-menu-item index="doctorsAdvice">医嘱</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="content">
        <el-row>
          <el-col class="right" ref="pRight" :span="19">
            <div class="title"></div>
            <el-form ref="formData" :model="formData" label-width="80px">
              <el-form-item label="主诉" class="mt emr_event" :required="true">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    @click.native="openEntry(mainStatement,1,'mainComplain')"
                    v-model="mainStatement.val"
                    @input="mainStatement.show=false"
                  ></el-input>
                  <div class="down_box" v-if="mainStatement.show">
                    <div class="down_box_title">
                      <div
                        class="down_box_title_but"
                        :class="{'active': !tabShow }"
                        @click="tabShow=false"
                      >口腔检查词条</div>
                      <div
                        class="down_box_title_but"
                        :class="{'active': tabShow }"
                        @click="tabShow=true"
                      >口腔检查模板</div>
                      <div class="close" @click="mainStatement.show=false">x</div>
                    </div>
                    <div class="down_box_content">
                      <div v-if="!tabShow">
                        <el-form label-width="80px">
                          <el-form-item
                            :label="val.title+':'"
                            v-for="(val,index)  in oralExaminationDownBox"
                            :key="index"
                          >
                            <span
                              @click="publicaddentry('mainStatement',entryArrItem)"
                              class="entry"
                              v-for="(entryArrItem,index)  in val.entryArr"
                              :key="index"
                            >{{entryArrItem}}</span>
                          </el-form-item>
                        </el-form>
                      </div>
                      <div v-if="tabShow">
                        <el-row style="margin-top:20px;">
                          <el-col class="border" :span="6">
                            <el-menu
                              default-active="2"
                              class="el-menu-vertical-demo"
                              @open="temphandleOpen"
                              @select="tempselect"
                              :unique-opened="true"
                              @close="temphandleClose"
                            >
                              <template v-for="(tempmenuItem,index) in tempmenu">
                                <el-submenu :index="tempmenuItem.root.className+{index}" :key="index">
                                  <template slot="title">
                                    <span>{{tempmenuItem.root.className}}</span>
                                  </template>
                                  <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                    <el-submenu :index="subItem.second.className" :key="i">
                                      <template slot="title">
                                        <span>{{subItem.second.className}}</span>
                                      </template>
                                      <el-menu-item
                                        v-for="(thirdItem , s) in subItem.second.thirdList"
                                        :index="thirdItem.className+'-'+thirdItem.templateId"
                                        :key="s"
                                      >
                                        <span slot="title">{{thirdItem.className}}</span>
                                      </el-menu-item>
                                    </el-submenu>
                                  </template>
                                </el-submenu>
                              </template>
                            </el-menu>
                          </el-col>
                          <el-col :span="18">
                            <div class="TemplateTitle">{{templateTitle}}</div>
                            <div class="TemplateContent">
                              <span
                                @click="publicaddTemplate('mainStatement',oralExaminationTemplate)"
                              >{{oralExaminationTemplate}}</span>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
              </el-form-item>
              <el-form-item class="mt emr_event" label="现病史">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  @click.native="openEntry(medicalHistory,2,'presentIll')"
                  @input="medicalHistory.show=false"
                  v-model="medicalHistory.val"
                ></el-input>
                <div class="down_box" v-if="medicalHistory.show">
                  <div class="down_box_title">
                    <div
                      class="down_box_title_but"
                      :class="{'active':!tabShow }"
                      @click="tabShow=false"
                    >口腔检查词条</div>
                    <div
                      class="down_box_title_but"
                      :class="{'active': tabShow }"
                      @click="tabShow=true"
                    >口腔检查模板</div>
                    <div class="close" @click="medicalHistory.show=false">x</div>
                  </div>
                  <div class="down_box_content">
                    <div v-if="!tabShow">
                      <el-form label-width="80px">
                        <el-form-item
                          :label="val.title+':'"
                          v-for="(val,index)  in oralExaminationDownBox"
                          :key="index"
                        >
                          <span
                            @click="publicaddentry('medicalHistory',entryArrItem)"
                            class="entry"
                            v-for="(entryArrItem,index)  in val.entryArr"
                            :key="index"
                          >{{entryArrItem}}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div v-if="tabShow">
                      <el-row style="margin-top:20px;">
                        <el-col class="border" :span="6">
                          <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo"
                            @open="temphandleOpen"
                            @select="tempselect"
                            :unique-opened="true"
                            @close="temphandleClose"
                          >
                            <template v-for="(tempmenuItem,index) in tempmenu">
                              <el-submenu :index="tempmenuItem.root.className+{index}" :key="index">
                                <template slot="title">
                                  <span>{{tempmenuItem.root.className}}</span>
                                </template>
                                <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                  <el-submenu :index="subItem.second.className" :key="i">
                                    <template slot="title">
                                      <span>{{subItem.second.className}}</span>
                                    </template>
                                    <el-menu-item
                                      v-for="(thirdItem , s) in subItem.second.thirdList"
                                      :index="thirdItem.className+'-'+thirdItem.templateId"
                                      :key="s"
                                    >
                                      <span slot="title">{{thirdItem.className}}</span>
                                    </el-menu-item>
                                  </el-submenu>
                                </template>
                              </el-submenu>
                            </template>
                          </el-menu>
                        </el-col>
                        <el-col :span="18">
                          <div class="TemplateTitle">{{templateTitle}}</div>
                          <div class="TemplateContent">
                            <span
                              @click="publicaddTemplate('medicalHistory',oralExaminationTemplate)"
                            >{{oralExaminationTemplate}}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="既往史" class="mt emr_event">
                <el-input
                  type="textarea"
                  :rows="2"
                  @click.native="openEntry(pastHistory,3,'pastIll')"
                  @input="pastHistory.show=false"
                  placeholder="请输入内容"
                  v-model="pastHistory.val"
                ></el-input>
                <div class="down_box" v-if="pastHistory.show">
                  <div class="down_box_title">
                    <div
                      class="down_box_title_but"
                      :class="{'active':!tabShow }"
                      @click="tabShow=false"
                    >口腔检查词条</div>
                    <div
                      class="down_box_title_but"
                      :class="{'active': tabShow }"
                      @click="tabShow=true"
                    >口腔检查模板</div>
                    <div class="close" @click="pastHistory.show=false">x</div>
                  </div>
                  <div class="down_box_content">
                    <div v-if="!tabShow">
                      <el-form label-width="80px">
                        <el-form-item
                          :label="val.title+':'"
                          v-for="(val,index)  in oralExaminationDownBox"
                          :key="index"
                        >
                          <span
                            @click="publicaddentry('pastHistory',entryArrItem)"
                            class="entry"
                            v-for="(entryArrItem,index)  in val.entryArr"
                            :key="index"
                          >{{entryArrItem}}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div v-if="tabShow">
                      <el-row style="margin-top:20px;">
                        <el-col class="border" :span="6">
                          <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo"
                            @open="temphandleOpen"
                            @select="tempselect"
                            :unique-opened="true"
                            @close="temphandleClose"
                          >
                            <template v-for="(tempmenuItem,index) in tempmenu">
                              <el-submenu :index="tempmenuItem.root.className+{index}" :key="index">
                                <template slot="title">
                                  <span>{{tempmenuItem.root.className}}</span>
                                </template>
                                <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                  <el-submenu :index="subItem.second.className" :key="i">
                                    <template slot="title">
                                      <span>{{subItem.second.className}}</span>
                                    </template>
                                    <el-menu-item
                                      v-for="(thirdItem , s) in subItem.second.thirdList"
                                      :index="thirdItem.className+'-'+thirdItem.templateId"
                                      :key="s"
                                    >
                                      <span slot="title">{{thirdItem.className}}</span>
                                    </el-menu-item>
                                  </el-submenu>
                                </template>
                              </el-submenu>
                            </template>
                          </el-menu>
                        </el-col>
                        <el-col :span="18">
                          <div class="TemplateTitle">{{templateTitle}}</div>
                          <div class="TemplateContent">
                            <span
                              @click="publicaddTemplate('pastHistory',oralExaminationTemplate)"
                            >{{oralExaminationTemplate}}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="口腔检查">
                <!-- 从这里开始循环 -->
                <el-row style="margin-top: 10px;" v-for="(item,i) in oralExamination" :key="i">
                  <el-col :span="5">
                    <div
                      class="toothPosition"
                      :class="'toothPosition'+i"
                      v-show="item.toothPositionShow"
                      @click="toothPositionShowFn(item.toothPositionShow,i,oralExamination)"
                    >
                      <div class="title">
                        <el-row>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="end">
                              <el-col :span="8">
                                <div
                                  class="left"
                                  :class="{'tpavtive': !tptabShow  } "
                                  @click="tptabShow=false"
                                >恒牙</div>
                                <div
                                  class="righ"
                                  :class="{'tpavtive': tptabShow  } "
                                  @click="tptabShow=true"
                                >乳牙</div>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="start">
                              <el-col :span="19">
                                <div class="box">
                                  <el-checkbox
                                    v-if="!tptabShow"
                                    @change="ptAllElection(item)"
                                    v-model="item.hychecked"
                                  >选择全口</el-checkbox>
                                  <el-checkbox
                                    v-if="tptabShow"
                                    @change="dtAllElection(item)"
                                    v-model="item.rychecked"
                                  >选择全口</el-checkbox>
                                  <span class="tpclose" @click="item.toothPositionShow=false">x</span>
                                </div>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="tpcontent">
                        <div class="pt" v-show="!tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lt/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rt/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lb/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rb/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>

                        <div class="pt dt" v-show="tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="position"
                      v-if="!tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.pt.lt}}</span>
                      <span>{{item.toothPositionArr.pt.rt}}</span>
                      <span>{{item.toothPositionArr.pt.lb}}</span>
                      <span>{{item.toothPositionArr.pt.rb}}</span>
                    </div>
                    <div
                      class="position"
                      v-if="tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.dt.lt}}</span>
                      <span>{{item.toothPositionArr.dt.rt}}</span>
                      <span>{{item.toothPositionArr.dt.lb}}</span>
                      <span>{{item.toothPositionArr.dt.rb}}</span>
                    </div>
                  </el-col>
                  <el-col class="mt emr_event" :offset="1" :span="18">
                    <!-- 输入框 -->
                    <el-input
                      :class="{'textarea1' : i>0 }"
                      @click.native="openDownmeun(item,4,'toothCheck')"
                      @input="item.downBoxShow=false"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      v-model="item.oralExaminationText"
                    ></el-input>
                    <span v-if="i>0" @click="delOralExamination(i)" class="delIcon el-icon-delete"></span>
                    <!-- 下拉 -->
                    <div class="down_box kq_check" v-if="item.downBoxShow">
                      <div class="down_box_title">
                        <div
                          class="down_box_title_but"
                          :class="{'active': !tabShow }"
                          @click="tabShow=false"
                        >口腔检查词条</div>
                        <div
                          class="down_box_title_but"
                          :class="{'active': tabShow  }"
                          @click="tabShow=true"
                        >口腔检查模板</div>
                        <div class="close" @click="closeDownmeun(item)">x</div>
                      </div>
                      <div class="down_box_content">
                        <div v-if="!tabShow">
                          <el-form label-width="80px">
                            <el-form-item
                              :label="val.title+':'"
                              v-for="(val,index)  in oralExaminationDownBox"
                              :key="index"
                            >
                              <span
                                @click="addentry(item,entryArrItem,'oralExamination')"
                                class="entry"
                                v-for="(entryArrItem,index)  in val.entryArr"
                                :key="index"
                              >{{entryArrItem}}</span>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div v-if="tabShow">
                          <el-row style="margin-top:20px;">
                            <el-col class="border" :span="6">
                              <el-menu
                                default-active="2"
                                class="el-menu-vertical-demo"
                                @open="temphandleOpen"
                                @select="tempselect"
                                :unique-opened="true"
                                @close="temphandleClose"
                              >
                                <template v-for="(tempmenuItem,index) in tempmenu">
                                  <el-submenu :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index" :key="index">
                                    <template slot="title">
                                      <span>{{tempmenuItem.root.className }}</span>
                                    </template>
                                    <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                      <el-submenu :index="'b'+index" :key="i">
                                        <template slot="title">
                                          <span>{{subItem.second.className}}</span>
                                        </template>
                                        <el-menu-item
                                          v-for="(thirdItem , s) in subItem.second.thirdList"
                                          :index="thirdItem.className+'-'+thirdItem.templateId"
                                          :key="s"
                                        >
                                          <span slot="title">{{thirdItem.className}}</span>
                                        </el-menu-item>
                                      </el-submenu>
                                    </template>
                                  </el-submenu>
                                </template>
                              </el-menu>
                            </el-col>
                            <el-col :span="18">
                              <div class="TemplateTitle">{{templateTitle}}</div>
                              <div class="TemplateContent">
                                <span
                                  @click="addTemplate(item,oralExaminationTemplate,'oralExamination')"
                                >{{oralExaminationTemplate}}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col class="add" :span="5">
                    <span class="add_symbol">+</span>
                    <span class @click="addOralExamination">添加牙位</span>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="辅助检查">
                <!-- 从这里开始循环 -->
                <el-row style="margin-top: 10px;" v-for="(item,i) in auxiliary" :key="i">
                  <el-col :span="5">
                    <div
                      class="toothPosition"
                      :class="'toothPosition'+i"
                      v-show="item.toothPositionShow"
                    >
                      <div class="title">
                        <el-row>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="end">
                              <el-col :span="8">
                                <div
                                  class="left"
                                  :class="{'tpavtive': !tptabShow  } "
                                  @click="tptabShow=false"
                                >恒牙</div>
                                <div
                                  class="righ"
                                  :class="{'tpavtive': tptabShow  } "
                                  @click="tptabShow=true"
                                >乳牙</div>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="start">
                              <el-col :span="19">
                                <div class="box">
                                  <el-checkbox
                                    v-if="!tptabShow"
                                    @change="ptAllElection(item)"
                                    v-model="item.hychecked"
                                  >选择全口</el-checkbox>
                                  <el-checkbox
                                    v-if="tptabShow"
                                    @change="dtAllElection(item)"
                                    v-model="item.rychecked"
                                  >选择全口</el-checkbox>
                                  <span class="tpclose" @click="item.toothPositionShow=false">x</span>
                                </div>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="tpcontent">
                        <div class="pt" v-if="!tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lt/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rt/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lb/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rb/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>

                        <div class="pt dt" v-if="tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="position"
                      v-if="!tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.pt.lt}}</span>
                      <span>{{item.toothPositionArr.pt.rt}}</span>
                      <span>{{item.toothPositionArr.pt.lb}}</span>
                      <span>{{item.toothPositionArr.pt.rb}}</span>
                    </div>
                    <div
                      class="position"
                      v-if="tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.dt.lt}}</span>
                      <span>{{item.toothPositionArr.dt.rt}}</span>
                      <span>{{item.toothPositionArr.dt.lb}}</span>
                      <span>{{item.toothPositionArr.dt.rb}}</span>
                    </div>
                  </el-col>
                  <el-col class="mt emr_event" :offset="1" :span="18">
                    <!-- 输入框 -->
                    <el-input
                      :class="{'textarea1' : i>0 }"
                      @click.native="openDownmeun(item,5,'assistCheck')"
                      @input="item.downBoxShow=false"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      v-model="item.auxiliaryText"
                    ></el-input>
                    <span v-if="i>0" @click="delAuxiliary(i)" class="delIcon el-icon-delete"></span>
                    <!-- 下拉 -->
                    <div class="down_box kq_check" v-if="item.downBoxShow">
                      <div class="down_box_title">
                        <div
                          class="down_box_title_but"
                          :class="{'active': !tabShow }"
                          @click="tabShow=false"
                        >口腔检查词条</div>
                        <div
                          class="down_box_title_but"
                          :class="{'active': tabShow  }"
                          @click="tabShow=true"
                        >口腔检查模板</div>
                        <div class="close" @click="closeDownmeun(item)">x</div>
                      </div>
                      <div class="down_box_content">
                        <div v-if="!tabShow">
                          <el-form label-width="80px">
                            <el-form-item
                              :label="val.title+':'"
                              v-for="(val,index)  in oralExaminationDownBox"
                              :key="index"
                            >
                              <span
                                @click="addentry(item,entryArrItem,'auxiliary')"
                                class="entry"
                                v-for="(entryArrItem,index)  in val.entryArr"
                                :key="index"
                              >{{entryArrItem}}</span>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div v-if="tabShow">
                          <el-row style="margin-top:20px;">
                            <el-col class="border" :span="6">
                              <el-menu
                                default-active="2"
                                class="el-menu-vertical-demo"
                                @open="temphandleOpen"
                                @select="tempselect"
                                :unique-opened="true"
                                @close="temphandleClose"
                              >
                                <template v-for="(tempmenuItem,index) in tempmenu">
                                  <el-submenu :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index" :key="index">
                                    <template slot="title">
                                      <span>{{tempmenuItem.root.className }}</span>
                                    </template>
                                    <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                      <el-submenu :index="'b'+index" :key="i">
                                        <template slot="title">
                                          <span>{{subItem.second.className}}</span>
                                        </template>
                                        <el-menu-item
                                          v-for="(thirdItem , s) in subItem.second.thirdList"
                                          :index="thirdItem.className+'-'+thirdItem.templateId"
                                          :key="s"
                                        >
                                          <span slot="title">{{thirdItem.className}}</span>
                                        </el-menu-item>
                                      </el-submenu>
                                    </template>
                                  </el-submenu>
                                </template>
                              </el-menu>
                            </el-col>
                            <el-col :span="18">
                              <div class="TemplateTitle">{{templateTitle}}</div>
                              <div class="TemplateContent">
                                <span
                                  @click="addTemplate(item,oralExaminationTemplate,'auxiliary')"
                                >{{oralExaminationTemplate}}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col class="add" :span="5">
                    <span class="add_symbol">+</span>
                    <span class @click="addAuxiliary">添加牙位</span>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="诊断">
                <!-- 从这里开始循环 诊断-->
                <el-row style="margin-top: 10px;" v-for="(item,i) in diagnosis" :key="i">
                  <el-col :span="5">
                    <div
                      class="toothPosition"
                      :class="'toothPosition'+i"
                      v-show="item.toothPositionShow"
                    >
                      <div class="title">
                        <el-row>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="end">
                              <el-col :span="8">
                                <div
                                  class="left"
                                  :class="{'tpavtive': !tptabShow  } "
                                  @click="tptabShow=false"
                                >恒牙</div>
                                <div
                                  class="righ"
                                  :class="{'tpavtive': tptabShow  } "
                                  @click="tptabShow=true"
                                >乳牙</div>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="start">
                              <el-col :span="19">
                                <div class="box">
                                  <el-checkbox
                                    v-if="!tptabShow"
                                    @change="ptAllElection(item)"
                                    v-model="item.hychecked"
                                  >选择全口</el-checkbox>
                                  <el-checkbox
                                    v-if="tptabShow"
                                    @change="dtAllElection(item)"
                                    v-model="item.rychecked"
                                  >选择全口</el-checkbox>
                                  <span class="tpclose" @click="item.toothPositionShow=false">x</span>
                                </div>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="tpcontent">
                        <div class="pt" v-if="!tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lt/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rt/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lb/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rb/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>

                        <div class="pt dt" v-if="tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="position"
                      v-if="!tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.pt.lt}}</span>
                      <span>{{item.toothPositionArr.pt.rt}}</span>
                      <span>{{item.toothPositionArr.pt.lb}}</span>
                      <span>{{item.toothPositionArr.pt.rb}}</span>
                    </div>
                    <div
                      class="position"
                      v-if="tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.dt.lt}}</span>
                      <span>{{item.toothPositionArr.dt.rt}}</span>
                      <span>{{item.toothPositionArr.dt.lb}}</span>
                      <span>{{item.toothPositionArr.dt.rb}}</span>
                    </div>
                  </el-col>
                  <el-col class="mt emr_event" :offset="1" :span="18">
                    <!-- 输入框 -->
                    <el-input
                      :class="{'textarea1' : i>0 }"
                      @click.native="openDownmeun(item,6,'diagnosis')"
                      @input="item.downBoxShow=false"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      v-model="item.diagnosisText"
                    ></el-input>
                    <span v-if="i>0" @click="delDiagnosis(i)" class="delIcon el-icon-delete"></span>
                    <!-- 下拉 -->
                    <div class="down_box kq_check" v-if="item.downBoxShow">
                      <div class="down_box_title">
                        <div
                          class="down_box_title_but"
                          :class="{'active': !tabShow }"
                          @click="tabShow=false"
                        >口腔检查词条</div>
                        <div
                          class="down_box_title_but"
                          :class="{'active': tabShow  }"
                          @click="tabShow=true"
                        >口腔检查模板</div>
                        <div class="close" @click="closeDownmeun(item)">x</div>
                      </div>
                      <div class="down_box_content">
                        <div v-if="!tabShow">
                          <el-form label-width="80px">
                            <el-form-item
                              :label="val.title+':'"
                              v-for="(val,index)  in oralExaminationDownBox"
                              :key="index"
                            >
                              <span
                                @click="addentry(item,entryArrItem,'diagnosis')"
                                class="entry"
                                v-for="(entryArrItem,index)  in val.entryArr"
                                :key="index"
                              >{{entryArrItem}}</span>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div v-if="tabShow">
                          <el-row style="margin-top:20px;">
                            <el-col class="border" :span="6">
                              <el-menu
                                default-active="2"
                                class="el-menu-vertical-demo"
                                @open="temphandleOpen"
                                @select="tempselect"
                                :unique-opened="true"
                                @close="temphandleClose"
                              >
                                <template v-for="(tempmenuItem,index) in tempmenu">
                                  <el-submenu :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index" :key="index">
                                    <template slot="title">
                                      <span>{{tempmenuItem.root.className }}</span>
                                    </template>
                                    <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                      <el-submenu :index="'b'+index" :key="i">
                                        <template slot="title">
                                          <span>{{subItem.second.className}}</span>
                                        </template>
                                        <el-menu-item
                                          v-for="(thirdItem , s) in subItem.second.thirdList"
                                          :index="thirdItem.className+'-'+thirdItem.templateId"
                                          :key="s"
                                        >
                                          <span slot="title">{{thirdItem.className}}</span>
                                        </el-menu-item>
                                      </el-submenu>
                                    </template>
                                  </el-submenu>
                                </template>
                              </el-menu>
                            </el-col>
                            <el-col :span="18">
                              <div class="TemplateTitle">{{templateTitle}}</div>
                              <div class="TemplateContent">
                                <span
                                  @click="addTemplate(item,oralExaminationTemplate,'diagnosis')"
                                >{{oralExaminationTemplate}}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col class="add" :span="5">
                    <span class="add_symbol">+</span>
                    <span class @click="addDiagnosis">添加牙位</span>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="治疗计划">
                <!-- 从这里开始循环 治疗计划-->
                <el-row style="margin-top: 10px;" v-for="(item,i) in treatment" :key="i">
                  <el-col :span="5">
                    <div
                      class="toothPosition"
                      :class="'toothPosition'+i"
                      v-show="item.toothPositionShow"
                    >
                      <div class="title">
                        <el-row>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="end">
                              <el-col :span="8">
                                <div
                                  class="left"
                                  :class="{'tpavtive': !tptabShow  } "
                                  @click="tptabShow=false"
                                >恒牙</div>
                                <div
                                  class="righ"
                                  :class="{'tpavtive': tptabShow  } "
                                  @click="tptabShow=true"
                                >乳牙</div>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="start">
                              <el-col :span="19">
                                <div class="box">
                                  <el-checkbox
                                    v-if="!tptabShow"
                                    @change="ptAllElection(item)"
                                    v-model="item.hychecked"
                                  >选择全口</el-checkbox>
                                  <el-checkbox
                                    v-if="tptabShow"
                                    @change="dtAllElection(item)"
                                    v-model="item.rychecked"
                                  >选择全口</el-checkbox>
                                  <span class="tpclose" @click="item.toothPositionShow=false">x</span>
                                </div>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="tpcontent">
                        <div class="pt" v-if="!tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lt/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rt/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lb/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rb/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>

                        <div class="pt dt" v-if="tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="position"
                      v-if="!tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.pt.lt}}</span>
                      <span>{{item.toothPositionArr.pt.rt}}</span>
                      <span>{{item.toothPositionArr.pt.lb}}</span>
                      <span>{{item.toothPositionArr.pt.rb}}</span>
                    </div>
                    <div
                      class="position"
                      v-if="tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.dt.lt}}</span>
                      <span>{{item.toothPositionArr.dt.rt}}</span>
                      <span>{{item.toothPositionArr.dt.lb}}</span>
                      <span>{{item.toothPositionArr.dt.rb}}</span>
                    </div>
                  </el-col>
                  <el-col class="mt emr_event" :offset="1" :span="18">
                    <!-- 输入框 -->
                    <el-input
                      :class="{'textarea1' : i>0 }"
                      @click.native="openDownmeun(item,7,'treatPlan')"
                      @input="item.downBoxShow=false"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      v-model="item.treatmentText"
                    ></el-input>
                    <span v-if="i>0" @click="delTreatment(i)" class="delIcon el-icon-delete"></span>
                    <!-- 下拉 -->
                    <div class="down_box kq_check" v-if="item.downBoxShow">
                      <div class="down_box_title">
                        <div
                          class="down_box_title_but"
                          :class="{'active': !tabShow }"
                          @click="tabShow=false"
                        >口腔检查词条</div>
                        <div
                          class="down_box_title_but"
                          :class="{'active': tabShow  }"
                          @click="tabShow=true"
                        >口腔检查模板</div>
                        <div class="close" @click="closeDownmeun(item)">x</div>
                      </div>
                      <div class="down_box_content">
                        <div v-if="!tabShow">
                          <el-form label-width="80px">
                            <el-form-item
                              :label="val.title+':'"
                              v-for="(val,index)  in oralExaminationDownBox"
                              :key="index"
                            >
                              <span
                                @click="addentry(item,entryArrItem,'treatment')"
                                class="entry"
                                v-for="(entryArrItem,index)  in val.entryArr"
                                :key="index"
                              >{{entryArrItem}}</span>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div v-if="tabShow">
                          <el-row style="margin-top:20px;">
                            <el-col class="border" :span="6">
                              <el-menu
                                default-active="2"
                                class="el-menu-vertical-demo"
                                @open="temphandleOpen"
                                @select="tempselect"
                                :unique-opened="true"
                                @close="temphandleClose"
                              >
                                <template v-for="(tempmenuItem,index) in tempmenu">
                                  <el-submenu :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index" :key="index">
                                    <template slot="title">
                                      <span>{{tempmenuItem.root.className }}</span>
                                    </template>
                                    <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                      <el-submenu :index="'b'+index" :key="i">
                                        <template slot="title">
                                          <span>{{subItem.second.className}}</span>
                                        </template>
                                        <el-menu-item
                                          v-for="(thirdItem , s) in subItem.second.thirdList"
                                          :index="thirdItem.className+'-'+thirdItem.templateId"
                                          :key="s"
                                        >
                                          <span slot="title">{{thirdItem.className}}</span>
                                        </el-menu-item>
                                      </el-submenu>
                                    </template>
                                  </el-submenu>
                                </template>
                              </el-menu>
                            </el-col>
                            <el-col :span="18">
                              <div class="TemplateTitle">{{templateTitle}}</div>
                              <div class="TemplateContent">
                                <span
                                  @click="addTemplate(item,oralExaminationTemplate,'treatment')"
                                >{{oralExaminationTemplate}}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col class="add" :span="5">
                    <span class="add_symbol">+</span>
                    <span class @click="addTreatment">添加牙位</span>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="处置">
                <el-row style="margin-top: 10px;" v-for="(item,i) in handle" :key="i">
                  <el-col :span="5">
                    <div
                      class="toothPosition"
                      :class="'toothPosition'+i"
                      v-show="item.toothPositionShow"
                    >
                      <div class="title">
                        <el-row>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="end">
                              <el-col :span="8">
                                <div
                                  class="left"
                                  :class="{'tpavtive': !tptabShow  } "
                                  @click="tptabShow=false"
                                >恒牙</div>
                                <div
                                  class="righ"
                                  :class="{'tpavtive': tptabShow  } "
                                  @click="tptabShow=true"
                                >乳牙</div>
                              </el-col>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" class="row-bg" justify="start">
                              <el-col :span="19">
                                <div class="box">
                                  <el-checkbox
                                    v-if="!tptabShow"
                                    @change="ptAllElection(item)"
                                    v-model="item.hychecked"
                                  >选择全口</el-checkbox>
                                  <el-checkbox
                                    v-if="tptabShow"
                                    @change="dtAllElection(item)"
                                    v-model="item.rychecked"
                                  >选择全口</el-checkbox>
                                  <span class="tpclose" @click="item.toothPositionShow=false">x</span>
                                </div>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="tpcontent">
                        <div class="pt" v-if="!tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lt/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rt/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(8-i,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/lb/'+tpitem.src+(8-i)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{8-i}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.pt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(i+1,tpitem,item,'pt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/rb/'+tpitem.src+(i+1)+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{i+1}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>

                        <div class="pt dt" v-if="tptabShow">
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rt " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rt/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.lb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/lb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="lt">
                            <el-row>
                              <el-col :span="3" v-for="(tpitem,i)  in tpArr.dt.rb " :key="i">
                                <div
                                  class="ltt"
                                  :class="{'lttactive' : tpitem.checked }"
                                  @click="addtp(tpitem.code,tpitem,item,'dt')"
                                >
                                  <img
                                    class="tp"
                                    :src="require('@/assets/img/workbench/toothPosition/dt/rb/'+tpitem.src+tpitem.code+'.png')"
                                    alt
                                  >
                                  <div
                                    class="tnum"
                                    :class="{'tnumactive' : tpitem.checked }"
                                  >{{tpitem.code}}</div>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="position"
                      v-if="!tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.pt.lt}}</span>
                      <span>{{item.toothPositionArr.pt.rt}}</span>
                      <span>{{item.toothPositionArr.pt.lb}}</span>
                      <span>{{item.toothPositionArr.pt.rb}}</span>
                    </div>
                    <div
                      class="position"
                      v-if="tptabShow"
                      :class="'tpbox'+i"
                      @click="openToothPosition(item,('.toothPosition'+i),('.tpbox'+i),i)"
                    >
                      <span>{{item.toothPositionArr.dt.lt}}</span>
                      <span>{{item.toothPositionArr.dt.rt}}</span>
                      <span>{{item.toothPositionArr.dt.lb}}</span>
                      <span>{{item.toothPositionArr.dt.rb}}</span>
                    </div>
                  </el-col>
                  <el-col class="mt emr_event" :offset="1" :span="18">
                    <!-- 输入框 -->
                    <el-input
                      :class="{'textarea1' : i>0 }"
                      @click.native="openDownmeun(item,8,'dispose')"
                      @input="item.downBoxShow=false"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入内容"
                      v-model="item.handleText"
                    ></el-input>
                    <span v-if="i>0" @click="delHandle(i)" class="delIcon el-icon-delete"></span>
                    <!-- 下拉 -->
                    <div class="down_box kq_check" v-if="item.downBoxShow">
                      <div class="down_box_title">
                        <div
                          class="down_box_title_but"
                          :class="{'active': !tabShow }"
                          @click="tabShow=false"
                        >口腔检查词条</div>
                        <div
                          class="down_box_title_but"
                          :class="{'active': tabShow  }"
                          @click="tabShow=true"
                        >口腔检查模板</div>
                        <div class="close" @click="closeDownmeun(item)">x</div>
                      </div>
                      <div class="down_box_content">
                        <div v-if="!tabShow">
                          <el-form label-width="80px">
                            <el-form-item
                              :label="val.title+':'"
                              v-for="(val,index)  in oralExaminationDownBox"
                              :key="index"
                            >
                              <span
                                @click="addentry(item,entryArrItem,'treatment')"
                                class="entry"
                                v-for="(entryArrItem,index)  in val.entryArr"
                                :key="index"
                              >{{entryArrItem}}</span>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div v-if="tabShow">
                          <el-row style="margin-top:20px;">
                            <el-col class="border" :span="6">
                              <el-menu
                                default-active="2"
                                class="el-menu-vertical-demo"
                                @open="temphandleOpen"
                                @select="tempselect"
                                :unique-opened="true"
                                @close="temphandleClose"
                              >
                                <template v-for="(tempmenuItem,index) in tempmenu">
                                  <el-submenu :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index" :key="index">
                                    <template slot="title">
                                      <span>{{tempmenuItem.root.className }}</span>
                                    </template>
                                    <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                      <el-submenu :index="'b'+index" :key="i">
                                        <template slot="title">
                                          <span>{{subItem.second.className}}</span>
                                        </template>
                                        <el-menu-item
                                          v-for="(thirdItem , s) in subItem.second.thirdList"
                                          :index="thirdItem.className+'-'+thirdItem.templateId"
                                          :key="s"
                                        >
                                          <span slot="title">{{thirdItem.className}}</span>
                                        </el-menu-item>
                                      </el-submenu>
                                    </template>
                                  </el-submenu>
                                </template>
                              </el-menu>
                            </el-col>
                            <el-col :span="18">
                              <div class="TemplateTitle">{{templateTitle}}</div>
                              <div class="TemplateContent">
                                <span
                                  @click="addTemplate(item,oralExaminationTemplate,'handle')"
                                >{{oralExaminationTemplate}}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col class="add" :span="5">
                    <span class="add_symbol">+</span>
                    <span class @click="addHandle">添加牙位</span>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="医嘱" class="mt emr_event">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  @click.native="openEntry(doctorsAdvice,9,'advice')"
                  @input="doctorsAdvice.show=false"
                  v-model="doctorsAdvice.val"
                ></el-input>
                <div class="down_box doctor_Advice" v-if="doctorsAdvice.show">
                  <div class="down_box_title">
                    <div
                      class="down_box_title_but"
                      :class="{'active':!tabShow }"
                      @click="tabShow=false"
                    >口腔检查词条</div>
                    <div
                      class="down_box_title_but"
                      :class="{'active': tabShow }"
                      @click="tabShow=true"
                    >口腔检查模板</div>
                    <div class="close" @click="doctorsAdvice.show=false">x</div>
                    <!-- @click="closeDownmeun(item)" -->
                  </div>
                  <div class="down_box_content">
                    <div v-if="!tabShow">
                      <el-form label-width="80px">
                        <el-form-item
                          :label="val.title+':'"
                          v-for="(val,index)  in oralExaminationDownBox"
                          :key="index"
                        >
                          <span
                            @click="publicaddentry('doctorsAdvice',entryArrItem)"
                            class="entry"
                            v-for="(entryArrItem,index)  in val.entryArr"
                            :key="index"
                          >{{entryArrItem}}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div v-if="tabShow">
                      <el-row style="margin-top:20px;">
                        <el-col class="border" :span="6">
                          <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo"
                            @open="temphandleOpen"
                            @select="tempselect"
                            :unique-opened="true"
                            @close="temphandleClose"
                          >
                            <template v-for="(tempmenuItem,index) in tempmenu">
                              <el-submenu :index="tempmenuItem.root.className ? tempmenuItem.root.className :'a'+index" :key="index">
                                <template slot="title">
                                  <span>{{tempmenuItem.root.className }}</span>
                                </template>
                                <template v-for="(subItem,i)  in tempmenuItem.root.secondList">
                                  <el-submenu :index="'b'+index" :key="i">
                                    <template slot="title">
                                      <span>{{subItem.second.className}}</span>
                                    </template>
                                    <el-menu-item
                                      v-for="(thirdItem , s) in subItem.second.thirdList"
                                      :index="thirdItem.className+'-'+thirdItem.templateId"
                                      :key="s"
                                    >
                                      <span slot="title">{{thirdItem.className}}</span>
                                    </el-menu-item>
                                  </el-submenu>
                                </template>
                              </el-submenu>
                            </template>
                          </el-menu>
                        </el-col>
                        <el-col :span="18">
                          <div class="TemplateTitle">{{templateTitle}}</div>
                          <div class="TemplateContent">
                            <span
                              @click="publicaddTemplate('doctorsAdvice',oralExaminationTemplate)"
                            >{{oralExaminationTemplate}}</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="remark"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="upData('')" size="medium">保存</el-button>
        <el-button size="medium" @click="savetemp">另存为模板</el-button>
        <el-button size="medium" @click="upDataEnd()">结束治疗</el-button>
        <el-button size="medium" @click="print">打印</el-button>
        <el-button size="medium" @click="emptyemr">清空病历</el-button>
        <el-button size="medium" @click="closeAdd">取消</el-button>
      </div>
    </div>
    <addaddCaseHistorydiglog @addcomp="backfill" :isShow="diglogShow"></addaddCaseHistorydiglog>
    <savecomp :isShow="diglogShow" @addcomp="backfill"></savecomp>
    <emrPrinting :isShow="isShowDialog" @closeAdd="closeAdd"></emrPrinting>
  </div>
</template>

<script>
import {
  // getDoctorList,
  // getNurseList,
  getEmrentryList,
  getTemplatelist,
  getTemplate,
  emrsave,
  emrsaveandtemp,
  emrsaveedit,
  emrcompleted,
  getVisttime
} from "@/api";
import monment from "moment";
import addaddCaseHistorydiglog from "./addaddCaseHistorydiglog.vue";
import { SYSTEM_HTTP_SUCCESS } from "@/constant";
import emrPrinting from "./emrPrinting.vue";
import savecomp from "./savecomp.vue";
import { mapState,mapGetters } from "vuex";
import $ from "jquery";

export default {
  components: {
    addaddCaseHistorydiglog,
    savecomp,
    emrPrinting
  },

  props: ["id", "emrdata", "time", "isShowComp"],
  data() {
    return {
      visitTimeList: "",
      isShowDialog: {
        dialogVisible: false,
        id: "",
        pid: "",
        data: []
      },
      editIdArr: [],
      upsynchronization: "",
      toothType: 1,
      pid: "",
      remark: "",
      diglogShow: {
        show: false,
        savecompshow: false
      },
      toothPositionShow: false,
      tabShow: false,
      tptabShow: false,
      hychecked: "",
      rychecked: "",
      additem: "",
      mainStatement: {
        //  主诉
        show: false,
        val: ""
      },
      medicalHistory: {
        show: false,
        val: ""
      },
      pastHistory: {
        show: false,
        val: ""
      },
      doctorsAdvice: {
        show: false,
        val: ""
      },
      form: {},
      formData: {},
      tpArr: {
        pt: {
          lt: [
            {
              checked: false,
              src: "l-t",
              code: 1
            },
            {
              checked: false,
              src: "l-t",
              code: 2
            },
            {
              checked: false,
              src: "l-t",
              code: 3
            },
            {
              checked: false,
              src: "l-t",
              code: 4
            },
            {
              checked: false,
              src: "l-t",
              code: 5
            },
            {
              checked: false,
              src: "l-t",
              code: 6
            },
            {
              checked: false,
              src: "l-t",
              code: 7
            },
            {
              checked: false,
              src: "l-t",
              code: 8
            }
          ],
          rt: [
            {
              checked: false,
              src: "r-t",
              code: 1
            },
            {
              checked: false,
              src: "r-t",
              code: 2
            },
            {
              checked: false,
              src: "r-t",
              code: 3
            },
            {
              checked: false,
              src: "r-t",
              code: 4
            },
            {
              checked: false,
              src: "r-t",
              code: 5
            },
            {
              checked: false,
              src: "r-t",
              code: 6
            },
            {
              checked: false,
              src: "r-t",
              code: 7
            },
            {
              checked: false,
              src: "r-t",
              code: 8
            }
          ],
          lb: [
            {
              checked: false,
              src: "l-b",
              code: 1
            },
            {
              checked: false,
              src: "l-b",
              code: 2
            },
            {
              checked: false,
              src: "l-b",
              code: 3
            },
            {
              checked: false,
              src: "l-b",
              code: 4
            },
            {
              checked: false,
              src: "l-b",
              code: 5
            },
            {
              checked: false,
              src: "l-b",
              code: 6
            },
            {
              checked: false,
              src: "l-b",
              code: 7
            },
            {
              checked: false,
              src: "l-b",
              code: 8
            }
          ],
          rb: [
            {
              checked: false,
              src: "r-b",
              code: 1
            },
            {
              checked: false,
              src: "r-b",
              code: 2
            },
            {
              checked: false,
              src: "r-b",
              code: 3
            },
            {
              checked: false,
              src: "r-b",
              code: 4
            },
            {
              checked: false,
              src: "r-b",
              code: 5
            },
            {
              checked: false,
              src: "r-b",
              code: 6
            },
            {
              checked: false,
              src: "r-b",
              code: 7
            },
            {
              checked: false,
              src: "r-b",
              code: 8
            }
          ]
        },
        dt: {
          lt: [
            {
              checked: false,
              src: "l-t",
              code: "A"
            },
            {
              checked: false,
              src: "l-t",
              code: "B"
            },
            {
              checked: false,
              src: "l-t",
              code: "C"
            },
            {
              checked: false,
              src: "l-t",
              code: "D"
            },
            {
              checked: false,
              src: "l-t",
              code: "E"
            }
          ],
          rt: [
            {
              checked: false,
              src: "r-t",
              code: "A"
            },
            {
              checked: false,
              src: "r-t",
              code: "B"
            },
            {
              checked: false,
              src: "r-t",
              code: "C"
            },
            {
              checked: false,
              src: "r-t",
              code: "D"
            },
            {
              checked: false,
              src: "r-t",
              code: "E"
            }
          ],
          lb: [
            {
              checked: false,
              src: "l-b",
              code: "A"
            },
            {
              checked: false,
              src: "l-b",
              code: "B"
            },
            {
              checked: false,
              src: "l-b",
              code: "C"
            },
            {
              checked: false,
              src: "l-b",
              code: "D"
            },
            {
              checked: false,
              src: "l-b",
              code: "E"
            }
          ],
          rb: [
            {
              checked: false,
              src: "r-b",
              code: "A"
            },
            {
              checked: false,
              src: "r-b",
              code: "B"
            },
            {
              checked: false,
              src: "r-b",
              code: "C"
            },
            {
              checked: false,
              src: "r-b",
              code: "D"
            },
            {
              checked: false,
              src: "r-b",
              code: "E"
            }
          ]
        }
      },

      //  口腔检查
      oralExamination: [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          oralExaminationText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ],
      // 辅助检查
      auxiliary: [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          auxiliaryText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ],
      // 诊断
      diagnosis: [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          diagnosisText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ],
      // 治疗计划
      treatment: [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          treatmentText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ],
      handle: [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          treatmentText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ],
      oralExaminationDownBox: [],
      tempmenu: [],
      emrId: "",
      doctor: "",
      nurse: "",
      doctorList: [],
      nurseList: "",
      checkFlag: "",
      synchronization: true,
      oralExaminationTemplate: "",
      auxiliaryTemplate: "",
      templateTitle: "",
      textarea: "",
      visitTime: "",
      radio: "",
      targetDownBox: ""
    };
  },
  watch: {
    visitTime() {
      // 获取时间下拉
    },
    patientId: {
      handler(val) {
        this.pid = val;
        this.getDownMenu();
      },
      immediate: true
    },
    isShowComp() {
      if (!this.emrdata) {
        this.getDownMenu();
        this.synchronization = true;
      }
    },
    emrdata() {
      if (this.emrdata) {
        console.log(this.emrdata.emr);
        
        this.doctor = this.emrdata.emr.doctorId;
        this.nurse = this.emrdata.emr.nurseId;
        this.visitTime = util.timestampToTime(this.emrdata.emr.visitTime);
        this.checkFlag = this.emrdata.emr.checkFlag;
        this.mainStatement.val = this.emrdata.emr.mainComplain;
        this.medicalHistory.val = this.emrdata.emr.presentIll;
        this.pastHistory.val = this.emrdata.emr.pastIll;
        this.doctorsAdvice.val = this.emrdata.emr.advice;
        this.remark = this.emrdata.emr.remark;
        this.emrId = this.emrdata.emr.id;
        this.emrdata.emr.synchronization == 1
          ? (this.synchronization = true)
          : (this.synchronization = false);

        if (
          this.emrdata.emrToothCheckList &&
          this.emrdata.emrToothCheckList.length > 0
        ) {
          this.editIdArr.push(this.emrdata.emrToothCheckList[0].emrId);
          this.oralExamination = [];
          this.emrdata.emrToothCheckList.map((v, i) => {
            if (v.toothType == 1) {
              this.toothType = v.toothType;
              this.tptabShow = false;

              this.oralExamination.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                oralExaminationText: v.toothCheck,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            } else {
              this.toothType = v.toothType;
              this.tptabShow = true;
              this.oralExamination.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                oralExaminationText: v.toothCheck,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            }
          });
        }

        if (
          this.emrdata.emrAssistCheckList &&
          this.emrdata.emrAssistCheckList.length > 0
        ) {
          this.editIdArr.push(this.emrdata.emrAssistCheckList[0].emrId);
          this.auxiliary = [];
          this.emrdata.emrAssistCheckList.map((v, i) => {
            if (v.toothType == 1) {
              this.toothType = v.toothType;
              this.tptabShow = false;
              this.auxiliary.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                auxiliaryText: v.toothCheck,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            } else {
              this.toothType = v.toothType;
              this.tptabShow = true;
              this.auxiliary.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                auxiliaryText: v.toothCheck,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            }
          });
        }

        if (
          this.emrdata.emrDiagnosisList &&
          this.emrdata.emrDiagnosisList.length > 0
        ) {
          this.editIdArr.push(this.emrdata.emrDiagnosisList[0].emrId);
          this.diagnosis = [];
          this.emrdata.emrDiagnosisList.map((v, i) => {
            if (v.toothType == 1) {
              this.toothType = v.toothType;
              this.tptabShow = false;

              this.diagnosis.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                diagnosisText: v.diagnosisContent,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            } else {
              this.toothType = v.toothType;
              this.tptabShow = true;
              this.diagnosis.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                diagnosisText: v.diagnosisContent,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: 1,
                pid: i + 1
              });
            }
          });
        }

        if (
          this.emrdata.emrTreatPlanList &&
          this.emrdata.emrTreatPlanList.length > 0
        ) {
          this.editIdArr.push(this.emrdata.emrTreatPlanList[0].emrId);
          this.treatment = [];
          this.emrdata.emrTreatPlanList.map((v, i) => {
            if (v.toothType == 1) {
              this.toothType = v.toothType;
              this.tptabShow = false;

              this.treatment.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                treatmentText: v.treatPlan,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: 1 + 1
              });
            } else {
              this.toothType = v.toothType;
              this.tptabShow = true;
              this.treatment.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                treatmentText: v.treatPlan,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            }
          });
        }

        if (
          this.emrdata.emrDisposeList &&
          this.emrdata.emrDisposeList.length > 0
        ) {
          this.editIdArr.push(this.emrdata.emrDisposeList[0].emrId);
          this.handle = [];
          this.emrdata.emrDisposeList.map((v, i) => {
            if (v.toothType == 1) {
              this.toothType = v.toothType;
              this.tptabShow = false;

              this.handle.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                handleText: v.disposeContent,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            } else {
              this.toothType = v.toothType;
              this.tptabShow = true;
              this.handle.push({
                toothPositionArr: {
                  pt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  },
                  dt: {
                    lt: v.leftUpValue,
                    rt: v.rightUpValue,
                    lb: v.leftDownValue,
                    rb: v.rightDownValue
                  }
                },
                handleText: v.disposeContent,
                downBoxShow: false,
                toothPositionShow: false,
                hychecked: "",
                rychecked: "",
                id: v.id,
                pid: i + 1
              });
            }
          });
        }
      } else {
      }
    },
    synchronization() {
      if (this.synchronization) {
        this.upsynchronization = 1;
      } else {
        this.upsynchronization = 2;
      }
    }
  },
  computed: mapState({
    patientsMsg: state => state.signal.patientsMsg,
    patientId: state => state.signal.patientId,
    rowId: state => state.signal.rowId
  }),
  mounted() {
    this.emptyemr();
  },
  methods: {
    toothPositionShowFn(toothPositionShow, index, arr) {
      toothPositionShow = true;
    },
    alltp() {
      for (let i = 0; i < this.tpArr.pt.lt.length; i++) {
        this.tpArr.pt.lt[i].checked = true;

        this.tpArr.pt.rt[i].checked = true;

        this.tpArr.pt.lb[i].checked = true;

        this.tpArr.pt.rb[i].checked = true;
      }
    },
    getTime(t) {
      return monment(t).format("YYYY-MM-DD HH:mm:ss ");
    },
    getDownMenu() {
      getVisttime({ id: this.pid }).then(res => {
        this.doctorList = res.data.data.doctorList;
        this.nurseList = res.data.data.nurseList;
        this.visitTimeList = res.data.data.visitList;
        if(this.nurseList.length > 0) {
          this.nurse = this.nurseList[0].id;
        }
        if(this.doctorList.length > 0) {
          this.doctor = this.doctorList[0].id;
        }

        //第一条记录就是最近的诊治日期
        if(this.visitTimeList.length > 0) {
          this.visitTime = this.visitTimeList[0].registerTime;
          this.checkFlag = this.visitTimeList[0].returnVisit == '2' ? '0' : this.visitTimeList[0].returnVisit + '';
        }
        if(this.emrdata == '') {
          let self = this;
          //响应就诊记录，传递过来的消息
          //拜访记录第一条数据，默认诊治医生，诊治日期，类别
          // let vistiData = this.getVisitRecordFrist();
          // self.doctor = vistiData.appointmentVisitTrack ? vistiData.appointmentVisitTrack.doctorId : '';
          // self.visitTime = vistiData.appointmentVisitTrack ? vistiData.appointmentVisitTrack.registerTime : '';
          // self.checkFlag = vistiData.returnVisit + '';
        }
      });
    },
    print() {
      let openPrint = () => {
        this.isShowDialog.dialogVisible = true;
        this.isShowDialog.id = this.emrId;
      };

      this.upData("", "", openPrint);
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    emptyemr() {
      this.emrId = "";
      this.doctor = "";
      this.nurse = "";
      this.visitTime = "";
      this.checkFlag = "";
      this.remark = "";
      this.getDownMenu();
      //  口腔检查
      this.oralExamination = [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          oralExaminationText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ];
      // 辅助检查
      this.auxiliary = [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          auxiliaryText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ];
      // 诊断
      this.diagnosis = [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          diagnosisText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ];
      // 治疗计划
      this.treatment = [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          treatmentText: "",
          downBoxShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ];
      this.handle = [
        {
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          handleText: "",
          downBoxShow: false,
          handleShow: false,
          toothPositionShow: false,
          hychecked: "",
          rychecked: "",
          id: 0,
          pid: 1
        }
      ];

      this.mainStatement = {
        //  主诉
        show: false,
        val: ""
      };
      this.medicalHistory = {
        show: false,
        val: ""
      };
      (this.pastHistory = {
        show: false,
        val: ""
      }),
        (this.doctorsAdvice = {
          show: false,
          val: ""
        });
    },

    clselect(key, keyPath) {
      console.log(key, keyPath)
      if (key == "mainStatement") {
        this.openEntry(this.mainStatement, 1, "mainComplain");
      }
      if (key == "medicalHistory") {
        this.openEntry(this.medicalHistory, 2, "presentIll");
      }
      if (key == "pastHistory") {
        this.openEntry(this.pastHistory, 3, "pastIll");
      }
      if (key == "oralExamination") {
        this.openDownmeun(this.oralExamination[0], 4, "toothCheck");
      }
      if (key == "auxiliary") {
        this.openDownmeun(this.auxiliary[0], 5, "assistCheck");
      }
      if (key == "diagnosis") {
        this.openDownmeun(this.diagnosis[0], 6, "diagnosis");
      }
      if (key == "treatment") {
        this.openDownmeun(this.treatment[0], 7, "treatPlan");
      }
      if (key == "handle") {
        this.openDownmeun(this.handle[0], 8, "dispose");
      }
      if (key == "doctorsAdvice") {
        this.openEntry(this.doctorsAdvice, 9, "advice");
      }
    },

    upDataEnd() {
      let end = true;
      this.upData("", end);
    },
    upData(tempData, end, callback) {
      if (checkData(this)) {
        let ttype = 1;
        if (this.toothType == 1) {
          ttype = "pt";
        } else {
          ttype = "dt";
        }
        let arr = [];
        let ltArr = [];
        let lbArr = [];
        let rtArr = [];
        let rbArr = [];
        let idArr = [];
        let describe = [];
        let a,b,c,d,e;//2019-7-18，hzj添加。下面的a,b,c,d,e,未定义，报错
        if (this.oralExamination.length > 1) {
          for (let i = 0; i < this.oralExamination.length; i++) {
            a++;
            ltArr.push(this.oralExamination[i].toothPositionArr[ttype].lt);
            lbArr.push(this.oralExamination[i].toothPositionArr[ttype].lb);
            rtArr.push(this.oralExamination[i].toothPositionArr[ttype].rt);
            rbArr.push(this.oralExamination[i].toothPositionArr[ttype].rb);
            describe.push(this.oralExamination[i].oralExaminationText);
            if (this.editIdArr.length > 0) {
              idArr.push(this.oralExamination[i].id);
            } else {
              idArr.push(0);
            }
          }

          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        } else {
          ltArr.push(this.oralExamination[0].toothPositionArr[ttype].lt);
          lbArr.push(this.oralExamination[0].toothPositionArr[ttype].lb);
          rtArr.push(this.oralExamination[0].toothPositionArr[ttype].rt);
          rbArr.push(this.oralExamination[0].toothPositionArr[ttype].rb);
          describe.push(this.oralExamination[0].oralExaminationText);
          if (this.editIdArr.length > 0) {
            idArr.push(this.oralExamination[0].id);
          } else {
            idArr.push(0);
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        }
        if (this.auxiliary.length > 1) {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          for (let i = 0; i < this.auxiliary.length; i++) {
            b++;
            ltArr.push(this.auxiliary[i].toothPositionArr[ttype].lt);
            lbArr.push(this.auxiliary[i].toothPositionArr[ttype].lb);
            rtArr.push(this.auxiliary[i].toothPositionArr[ttype].rt);
            rbArr.push(this.auxiliary[i].toothPositionArr[ttype].rb);
            describe.push(this.auxiliary[i].auxiliaryText);
            if (this.auxiliary.length > 0) {
              idArr.push(this.auxiliary[i].id);
            } else {
              idArr.push(0);
            }
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        } else {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          ltArr.push(this.auxiliary[0].toothPositionArr[ttype].lt);
          lbArr.push(this.auxiliary[0].toothPositionArr[ttype].lb);
          rtArr.push(this.auxiliary[0].toothPositionArr[ttype].rt);
          rbArr.push(this.auxiliary[0].toothPositionArr[ttype].rb);
          describe.push(this.auxiliary[0].auxiliaryText);
          if (this.auxiliary.length > 0) {
            idArr.push(this.auxiliary[0].id);
          } else {
            idArr.push(0);
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        }

        if (this.diagnosis.length > 1) {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          for (let i = 0; i < this.diagnosis.length; i++) {
            c++;
            ltArr.push(this.diagnosis[i].toothPositionArr[ttype].lt);
            lbArr.push(this.diagnosis[i].toothPositionArr[ttype].lb);
            rtArr.push(this.diagnosis[i].toothPositionArr[ttype].rt);
            rbArr.push(this.diagnosis[i].toothPositionArr[ttype].rb);
            describe.push(this.diagnosis[i].diagnosisText);
            if (this.diagnosis.length > 0) {
              idArr.push(this.diagnosis[i].id);
            } else {
              idArr.push(0);
            }
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        } else {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          ltArr.push(this.diagnosis[0].toothPositionArr[ttype].lt);
          lbArr.push(this.diagnosis[0].toothPositionArr[ttype].lb);
          rtArr.push(this.diagnosis[0].toothPositionArr[ttype].rt);
          rbArr.push(this.diagnosis[0].toothPositionArr[ttype].rb);
          describe.push(this.diagnosis[0].diagnosisText);
          if (this.diagnosis.length > 0) {
            idArr.push(this.diagnosis[0].id);
          } else {
            idArr.push(0);
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        }

        if (this.treatment.length > 1) {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          for (let i = 0; i < this.treatment.length; i++) {
            d++;
            ltArr.push(this.treatment[i].toothPositionArr[ttype].lt);
            lbArr.push(this.treatment[i].toothPositionArr[ttype].lb);
            rtArr.push(this.treatment[i].toothPositionArr[ttype].rt);
            rbArr.push(this.treatment[i].toothPositionArr[ttype].rb);
            describe.push(this.treatment[i].treatmentText);
            if (this.treatment.length > 0) {
              idArr.push(this.treatment[i].id);
            } else {
              idArr.push(0);
            }
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        } else {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          ltArr.push(this.treatment[0].toothPositionArr[ttype].lt);
          lbArr.push(this.treatment[0].toothPositionArr[ttype].lb);
          rtArr.push(this.treatment[0].toothPositionArr[ttype].rt);
          rbArr.push(this.treatment[0].toothPositionArr[ttype].rb);
          describe.push(this.treatment[0].treatmentText);
          if (this.treatment.length > 0) {
            idArr.push(this.treatment[0].id);
          } else {
            idArr.push(0);
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        }

        if (this.handle.length > 1) {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          for (let i = 0; i < this.handle.length; i++) {
            e++;
            ltArr.push(this.handle[i].toothPositionArr[ttype].lt);
            lbArr.push(this.handle[i].toothPositionArr[ttype].lb);
            rtArr.push(this.handle[i].toothPositionArr[ttype].rt);
            rbArr.push(this.handle[i].toothPositionArr[ttype].rb);
            describe.push(this.handle[i].handleText);
            if (this.treatment.length > 0) {
              idArr.push(this.handle[i].id);
            } else {
              idArr.push(0);
            }
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        } else {
          ltArr = [];
          lbArr = [];
          rtArr = [];
          rbArr = [];
          idArr = [];
          describe = [];
          ltArr.push(this.handle[0].toothPositionArr[ttype].lt);
          lbArr.push(this.handle[0].toothPositionArr[ttype].lb);
          rtArr.push(this.handle[0].toothPositionArr[ttype].rt);
          rbArr.push(this.handle[0].toothPositionArr[ttype].rb);
          describe.push(this.handle[0].handleText);
          if (this.treatment.length > 0) {
            idArr.push(this.handle[0].id);
          } else {
            idArr.push(0);
          }
          arr.push({
            ltArr: ltArr,
            lbArr: lbArr,
            rtArr: rtArr,
            rbArr: rbArr,
            idArr: idArr,
            describe: describe
          });
        }
        if (this.synchronization) {
          this.upsynchronization = 1;
        } else {
          this.upsynchronization = 2;
        }
        let data = {
          emr: {
            doctorId: this.doctor,
            checkFlag: this.checkFlag,
            visitTime: this.visitTime,
            nurseId: this.nurse,
            mainComplain: this.mainStatement.val, //主诉 this.nurse
            patientId: this.pid, //   10363
            presentIll: this.medicalHistory.val, //现病史
            pastIll: this.pastHistory.val, //既往史
            advice: this.doctorsAdvice.val, //医嘱
            remark: this.remark, //备注 
            synchronization: this.upsynchronization, //牙位同步 1同步
          },
          toothType: this.toothType, //1恒压  乳牙
          //口腔检查
          leftUpOralValue: arr[0].ltArr,
          rightUpOralValue: arr[0].rtArr,
          leftDownOralValue: arr[0].lbArr,
          rightDownOralValue: arr[0].rbArr,
          toothOralCheck: arr[0].describe,
          oralId: arr[0].idArr,
          //辅助检查
          aideId: arr[1].idArr,
          leftUpAideValue: arr[1].ltArr,
          rightUpAideValue: arr[1].rtArr,
          leftDownAideValue: arr[1].lbArr,
          rightDownAideValue: arr[1].rbArr,
          toothAideCheck: arr[1].describe,
          //诊断
          diagnosisId: arr[2].idArr,
          leftUpDiagnosisValue: arr[2].ltArr,
          rightUpDiagnosisValue: arr[2].rtArr,
          leftDownDiagnosisValue: arr[2].lbArr,
          rightDownDiagnosisValue: arr[2].rbArr,
          diagnosisContent: arr[2].describe,
          // 治疗计划
          treatId: arr[3].idArr,
          leftUpTreatValue: arr[3].ltArr,
          rightUpTreatValue: arr[3].rtArr,
          leftDownTreatValue: arr[3].lbArr,
          rightDownTreatValue: arr[3].rbArr,
          treatPlan: arr[3].describe,
          // 处置
          disposeId: arr[4].idArr,
          leftUpDisposeValue: arr[4].ltArr,
          rightUpDisposeValue: arr[4].rtArr,
          leftDownDisposeValue: arr[4].lbArr,
          rightDownDisposeValue: arr[4].rbArr,
          disposeContent: arr[4].describe
        };
        if (tempData) {
          data.templateParentId = tempData.parentId;
          data.templateName = tempData.tempName;
          emrsaveandtemp(data).then(res => {
            if (res.data.code == SYSTEM_HTTP_SUCCESS) {
              // this.$message("新增成功！");
              this.editIdArr = [];
              this.closeAdd();
            }
          });
        } else {
          if (this.editIdArr.length > 0) {
            data.emr.id = this.emrId;

            if (end) {
              emrcompleted(data).then(res => {
                if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                  // this.$message("完成治疗！");
                  this.editIdArr = [];
                  this.closeAdd();
                }
              });
            } else {
              emrsaveedit(data).then(res => {
                if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                  // this.$message("修改成功！");
                  this.editIdArr = [];
                  if (callback) {
                    callback();
                  } else {
                    this.closeAdd();
                  }
                }
              });
            }
          } else {
            if (end) {
              emrcompleted(data).then(res => {
                if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                  // this.$message("完成治疗！");
                  this.closeAdd();
                }
              });
            } else {
              emrsave(data).then(res => {
                if (res.data.code == SYSTEM_HTTP_SUCCESS) {
                  this.emrId = res.data.data;
                  // this.$message("新增成功！");
                  if (callback) {
                    callback();
                  } else {
                    this.closeAdd();
                  }
                }
              });
            }
          }
        }
      }
    },

    // 打开下拉框获取词条信息
    openEntry(a, id, t) {
      this.mainStatement.show = false;
      this.medicalHistory.show = false;
      this.pastHistory.show = false;
      this.doctorsAdvice.show = false;
      this.oralExamination[0].downBoxShow = false;
      this.auxiliary[0].downBoxShow = false;
      this.diagnosis[0].downBoxShow = false;
      this.treatment[0].downBoxShow = false;
      this.handle[0].downBoxShow = false;

      this.targetDownBox = t;
      this.oralExaminationDownBox = [];
      a.show = true;
      getEmrentryList(id).then(res => {
        let data = res.data.data;
        if (data.length == 0) {
          this.$message("没有词条！");
        } else {
          for (let i = 0; i < data.length; i++) {
            let arr = [];
            for (let j = 0; j < data[i].emrTermsDetailList.length; j++) {
              arr.push(data[i].emrTermsDetailList[j].termsDetail);
            }
            this.oralExaminationDownBox.push({
              title: data[i].emrTermsItem.itemName,
              entryArr: arr
            });
          }
        }
      });
      // 获取模板列表
      getTemplatelist().then(res => {
        if (res.data.code === SYSTEM_HTTP_SUCCESS) {
          this.tempmenu = res.data.data.rootList;
        }
      });
    },
    savetemp() {
      this.diglogShow.savecompshow = true;
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    temphandleOpen(key, keyPath) {},
    temphandleClose(key, keyPath) {},
    tempselect(c, keyPath) {
      this.templateTitle = c.split("-")[0];
      this.oralExaminationTemplate = "";
      let tid = c.split("-")[1];
      getTemplate(tid).then(res => {
        if (res.data.code == SYSTEM_HTTP_SUCCESS) {
          if (res.data.data == null) {
            this.$message(this.templateTitle + "下没有模板！");
          } else {
            this.oralExaminationTemplate = res.data.data[this.targetDownBox];
          }
        }
      });
    },
    changeStatusFn() {},
    openDownmeun(item, id, t) {
      this.mainStatement.show = false;
      this.medicalHistory.show = false;
      this.pastHistory.show = false;
      this.doctorsAdvice.show = false;
      this.oralExamination[0].downBoxShow = false;
      this.auxiliary[0].downBoxShow = false;
      this.diagnosis[0].downBoxShow = false;
      this.treatment[0].downBoxShow = false;
      this.handle[0].downBoxShow = false;

      item.downBoxShow = true;

      this.targetDownBox = t;
      this.oralExaminationDownBox = [];
      getEmrentryList(id).then(res => {
        let data = res.data.data;
        if (data.length == 0) {
          this.$message("没有词条！");
        } else {
          for (let i = 0; i < data.length; i++) {
            let arr = [];
            for (let j = 0; j < data[i].emrTermsDetailList.length; j++) {
              arr.push(data[i].emrTermsDetailList[j].termsDetail);
            }
            this.oralExaminationDownBox.push({
              title: data[i].emrTermsItem.itemName,
              entryArr: arr
            });
          }
        }
      });
      // 获取模板列表
      getTemplatelist().then(res => {
        this.tempmenu = res.data.data.rootList;
      });
    },
    closeDownmeun(item) {
      item.downBoxShow = false;
    },
    addAlltp(t) {
      if (t !== "oralExamination" && !this.oralExamination[0].readOnly) {
        this.oralExamination.push({
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          oralExaminationText: "",
          downBoxShow: false,
          toothPositionShow: false,
          id: 0,
          pid: this.oralExamination.length + 1
        });
      }
      if (t != "auxiliary" && !this.auxiliary[0].readOnly) {
        this.auxiliary.push({
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          auxiliaryText: "",
          downBoxShow: false,
          toothPositionShow: false,
          id: 0,
          pid: this.auxiliary.length + 1
        });
      }
      if (t != "diagnosis" && !this.diagnosis[0].readOnly) {
        this.diagnosis.push({
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          diagnosisText: "",
          downBoxShow: false,
          toothPositionShow: false,
          id: 0,
          pid: this.diagnosis.length + 1
        });
      }
      if (t != "treatment" && !this.treatment[0].readOnly) {
        this.treatment.push({
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          treatmentText: "",
          downBoxShow: false,
          toothPositionShow: false,
          id: 0,
          pid: this.treatment.length + 1
        });
      }
      if (t != "handle" && !this.handle[0].readOnly) {
        this.handle.push({
          toothPositionArr: {
            pt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            },
            dt: {
              lt: "",
              rt: "",
              lb: "",
              rb: ""
            }
          },
          handleText: "",
          downBoxShow: false,
          toothPositionShow: false,
          id: 0,
          pid: this.handle.length + 1
        });
      }
    },
    addOralExamination() {
      if (this.synchronization) {
        this.addAlltp("oralExamination");
      }
      // 添加检查
      this.oralExamination.push({
        toothPositionArr: {
          pt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          },
          dt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          }
        },
        oralExaminationText: "",
        downBoxShow: false,
        toothPositionShow: false,
        id: 0,
        pid: this.oralExamination.length + 1
      });
    },
    delOralExamination(i) {
      this.oralExamination.splice(i, 1);
    },
    addAuxiliary() {
      // 添加辅助
      if (this.synchronization) {
        this.addAlltp("auxiliary");
      }
      this.auxiliary.push({
        toothPositionArr: {
          pt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          },
          dt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          }
        },
        auxiliaryText: "",
        downBoxShow: false,
        toothPositionShow: false,
        id: 0,
        pid: this.auxiliary.length + 1
      });
    },
    addDiagnosis() {
      // 添加诊断
      if (this.synchronization) {
        this.addAlltp("diagnosis");
      }
      this.diagnosis.push({
        toothPositionArr: {
          pt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          },
          dt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          }
        },
        diagnosisText: "",
        downBoxShow: false,
        toothPositionShow: false,
        id: 0,
        pid: this.diagnosis.length + 1
      });
    },
    addTreatment() {
      // 添加计划
      if (this.synchronization) {
        this.addAlltp("treatment");
      }
      this.treatment.push({
        toothPositionArr: {
          pt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          },
          dt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          }
        },
        treatmentText: "",
        downBoxShow: false,
        toothPositionShow: false,
        id: 0,
        pid: this.treatment.length + 1
      });
    },
    addHandle() {
      // 添加处置
      if (this.synchronization) {
        this.addAlltp("handle");
      }
      this.handle.push({
        toothPositionArr: {
          pt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          },
          dt: {
            lt: "",
            rt: "",
            lb: "",
            rb: ""
          }
        },
        handleText: "",
        downBoxShow: false,
        toothPositionShow: false,
        id: 0,
        pid: this.handle.length + 1
      });
    },

    delAuxiliary(i) {
      this.auxiliary.splice(i, 1);
    },
    delDiagnosis(i) {
      this.diagnosis.splice(i, 1);
    },
    delTreatment(i) {
      this.treatment.splice(i, 1);
    },
    delHandle(i) {
      this.handle.splice(i, 1);
    },
    // 添加词条
    addentry(item, t, name) {
      if (name == "auxiliary") {
        item.auxiliaryText += t;
      }
      if (name == "oralExamination") {
        item.oralExaminationText += t;
      }
      if (name == "diagnosis") {
        item.diagnosisText += t;
      }
      if (name == "treatment") {
        item.treatmentText += t;
      }
    },
    // 添加模板
    addTemplate(item, t, name) {
      if (name == "auxiliary") {
        item.auxiliaryText += t;
      }
      if (name == "oralExamination") {
        item.oralExaminationText += t;
      }
      if (name == "diagnosis") {
        item.diagnosisText += t;
      }
      if (name == "treatment") {
        item.treatmentText += t;
      }
      if (name == "handle") {
        item.handleText += t;
      }
    },
    initToothBitmapHy() {
      for (let i = 0; i < this.tpArr.pt.lt.length; i++) {
        this.tpArr.pt.lt[i].checked = false;

        this.tpArr.pt.rt[i].checked = false;

        this.tpArr.pt.lb[i].checked = false;

        this.tpArr.pt.rb[i].checked = false;
      }
    },
    initToothBitmapRy() {
      for (let i = 0; i < this.tpArr.dt.lt.length; i++) {
        this.tpArr.dt.lt[i].checked = false;

        this.tpArr.dt.rt[i].checked = false;

        this.tpArr.dt.lb[i].checked = false;

        this.tpArr.dt.rb[i].checked = false;
      }
    },
    // 打开牙位图
    openToothPosition(item, c, d, i) {
      this.initToothBitmapHy();
      this.initToothBitmapRy();
      this.oralExamination.map(val => {
        val.toothPositionShow = false;
        return val;
      });
      this.auxiliary.map(val => {
        val.toothPositionShow = false;
        return val;
      });
      this.diagnosis.map(val => {
        val.toothPositionShow = false;
        return val;
      });
      this.treatment.map(val => {
        val.toothPositionShow = false;
        return val;
      });
      this.handle.map(val => {
        val.toothPositionShow = false;
        return val;
      });

      let hyobj = item.toothPositionArr.pt;
      let ryobj = item.toothPositionArr.dt;
      // 恒牙回显
      let n = 0;
      let a = 0;
      for (const key in hyobj) {
        if (hyobj[key] !== "") {
          let pos = this.tpArr.pt[key];
          for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < hyobj[key].length; j++) {
              if (hyobj[key][j] == pos[i].code) {
                if (key == "lt" || key == "lb") {
                  pos[pos.length - i - 1].checked = true;
                } else {
                  pos[i].checked = true;
                }
              }
            }
          }
        }
      }
      for (const key in hyobj) {
        if (hyobj[key] !== "") {
          if (hyobj[key].toString().length == 8) {
            n++;
            if (n == 4) {
              this.alltp();
              item.hychecked = true;
            }
          }
        }
      }
      for (const key in ryobj) {
        if (ryobj[key] !== "") {
          let pos = this.tpArr.dt[key];
          for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < ryobj[key].length; j++) {
              if (ryobj[key][j] == pos[i].code) {
                if (key == "lt" || key == "lb") {
                  pos[i].checked = true;
                } else {
                  pos[i].checked = true;
                }
              }
            }
          }
        }
      }
      for (const key in ryobj) {
        if (ryobj[key] !== "") {
          if (ryobj[key].length == 5) {
            a++;
            if (a == 4) {
              item.rychecked = true;
            }
          }
        }
      }
      item.toothPositionShow = true;

      let tp = document.querySelector(c);
      let td = document.querySelector(d);
      let content = document.querySelector(".content");
      if (Object.keys(item).indexOf("handleText") !== -1) {
        this.handle[i].toothPositionShow = true;
      }
      item.toothPositionShow = true;
    },
    // 添加牙位方法
    addtp(i, tpitem, item, y) {
      if (this.synchronization) {
        let layer = item.pid;
        let str = tpitem.src.split("-")[0] + tpitem.src.split("-")[1];
        tpitem.checked = !tpitem.checked;
        if (item.toothPositionArr[y][str] != "") {
          if (item.toothPositionArr[y][str].indexOf(i) == -1) {
            item.toothPositionArr[y][str] = filterData(
              item.toothPositionArr[y][str],
              str,
              i
            );
          } else {
            item.toothPositionArr[y][str] = item.toothPositionArr[y][
              str
            ].replace(i, "");
            let hyObj = item.toothPositionArr["pt"];
            let ryObj = item.toothPositionArr["dt"];
            if (y === "dt") {
              for (const key1 in ryObj) {
                hyObj[key1] = ryObj[key1];
              }
            } else {
              for (const key in hyObj) {
                ryObj[key] = hyObj[key];
              }
            }
          }
          let hyObj = item.toothPositionArr["pt"];
          let ryObj = item.toothPositionArr["dt"];

          if (y === "dt") {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          } else {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          }
        } else {
          item.toothPositionArr[y][str] = filterData(
            item.toothPositionArr[y][str],
            str,
            i
          );
          let hyObj = item.toothPositionArr["pt"];
          let ryObj = item.toothPositionArr["dt"];
          if (y === "dt") {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          } else {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          }
        }

        if (
          Object.keys(item).indexOf("oralExaminationText") == -1 &&
          !this.oralExamination[0].readOnly
        ) {
          if (this.oralExamination[layer - 1].toothPositionArr[y][str] != "") {
            if (
              this.oralExamination[layer - 1].toothPositionArr[y][str].indexOf(
                i
              ) == -1
            ) {
              this.oralExamination[layer - 1].toothPositionArr[y][
                str
              ] = filterData(
                this.oralExamination[layer - 1].toothPositionArr[y][str],
                str,
                i
              );
            } else {
              this.oralExamination[layer - 1].toothPositionArr[y][
                str
              ] = this.oralExamination[layer - 1].toothPositionArr[y][
                str
              ].replace(i, "");
            }
          } else {
            this.oralExamination[layer - 1].toothPositionArr[y][
              str
            ] = filterData(
              this.oralExamination[layer - 1].toothPositionArr[y][str],
              str,
              i
            );
          }
          let hyObj = this.oralExamination[layer - 1].toothPositionArr.pt;
          let ryObj = this.oralExamination[layer - 1].toothPositionArr.dt;
          if (y == "pt") {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          } else {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          }
        }

        if (
          Object.keys(item).indexOf("auxiliaryText") == -1 &&
          !this.auxiliary[0].readOnly
        ) {
          if (this.auxiliary[layer - 1].toothPositionArr[y][str] != "") {
            if (
              this.auxiliary[layer - 1].toothPositionArr[y][str].indexOf(i) ==
              -1
            ) {
              this.auxiliary[layer - 1].toothPositionArr[y][str] = filterData(
                this.auxiliary[layer - 1].toothPositionArr[y][str],
                str,
                i
              );
            } else {
              this.auxiliary[layer - 1].toothPositionArr[y][
                str
              ] = this.auxiliary[layer - 1].toothPositionArr[y][str].replace(
                i,
                ""
              );
            }
          } else {
            this.auxiliary[layer - 1].toothPositionArr[y][str] = filterData(
              this.auxiliary[layer - 1].toothPositionArr[y][str],
              str,
              i
            );
          }
          let hyObj = this.auxiliary[layer - 1].toothPositionArr.pt;
          let ryObj = this.auxiliary[layer - 1].toothPositionArr.dt;
          if (y == "pt") {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          } else {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          }
        }

        if (
          Object.keys(item).indexOf("diagnosisText") == -1 &&
          !this.diagnosis[0].readOnly
        ) {
          if (this.diagnosis[layer - 1].toothPositionArr[y][str] != "") {
            if (
              this.diagnosis[layer - 1].toothPositionArr[y][str].indexOf(i) ==
              -1
            ) {
              this.diagnosis[layer - 1].toothPositionArr[y][str] = filterData(
                this.diagnosis[layer - 1].toothPositionArr[y][str],
                str,
                i
              );
            } else {
              this.diagnosis[layer - 1].toothPositionArr[y][
                str
              ] = this.diagnosis[layer - 1].toothPositionArr[y][str].replace(
                i,
                ""
              );
            }
          } else {
            this.diagnosis[layer - 1].toothPositionArr[y][str] = filterData(
              this.diagnosis[layer - 1].toothPositionArr[y][str],
              str,
              i
            );
          }
          let hyObj = this.diagnosis[layer - 1].toothPositionArr.pt;
          let ryObj = this.diagnosis[layer - 1].toothPositionArr.dt;
          if (y == "pt") {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          } else {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          }
        }

        if (
          Object.keys(item).indexOf("treatmentText") == -1 &&
          !this.treatment[0].readOnly
        ) {
          if (this.treatment[layer - 1].toothPositionArr[y][str] != "") {
            if (
              this.treatment[layer - 1].toothPositionArr[y][str].indexOf(i) ==
              -1
            ) {
              this.treatment[layer - 1].toothPositionArr[y][str] = filterData(
                this.treatment[layer - 1].toothPositionArr[y][str],
                str,
                i
              );
            } else {
              this.treatment[layer - 1].toothPositionArr[y][
                str
              ] = this.treatment[layer - 1].toothPositionArr[y][str].replace(
                i,
                ""
              );
            }
          } else {
            this.treatment[layer - 1].toothPositionArr[y][str] = filterData(
              this.treatment[layer - 1].toothPositionArr[y][str],
              str,
              i
            );
          }
          let hyObj = this.treatment[layer - 1].toothPositionArr.pt;
          let ryObj = this.treatment[layer - 1].toothPositionArr.dt;
          if (y == "pt") {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          } else {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          }
        }

        if (
          Object.keys(item).indexOf("handleText") == -1 &&
          !this.handle[0].readOnly
        ) {
          if (this.handle[layer - 1].toothPositionArr[y][str] != "") {
            if (
              this.handle[layer - 1].toothPositionArr[y][str].indexOf(i) == -1
            ) {
              this.handle[layer - 1].toothPositionArr[y][str] = filterData(
                this.handle[layer - 1].toothPositionArr[y][str],
                str,
                i
              );
            } else {
              this.handle[layer - 1].toothPositionArr[y][str] = this.handle[
                layer - 1
              ].toothPositionArr[y][str].replace(i, "");
            }
          } else {
            this.handle[layer - 1].toothPositionArr[y][str] = filterData(
              this.handle[layer - 1].toothPositionArr[y][str],
              str,
              i
            );
          }
          let hyObj = this.handle[layer - 1].toothPositionArr.pt;
          let ryObj = this.handle[layer - 1].toothPositionArr.dt;
          if (y == "pt") {
            for (const key in hyObj) {
              ryObj[key] = hyObj[key];
            }
          } else {
            for (const key1 in ryObj) {
              hyObj[key1] = ryObj[key1];
            }
          }
        }

        function filterData(x, str, i) {
          function sortnum(a, b) {
            return b - a;
          }
          let arr = [];
          let arr1 = [];
          if (y == "pt") {
            x += i;
            if (str == "lt" || str == "lb") {
              for (let i = 0; i < x.length; i++) {
                arr.push(x[i]);
              }
              x = arr.sort(sortnum).join("");
            }
            if (str == "rb" || str == "rt") {
              for (let i = 0; i < x.length; i++) {
                arr1.push(x[i]);
              }
              x = arr1.sort().join("");
            }
            return x;
          } else {
            let letterArr = [];
            let letterArr1 = [];
            x += i;
            if (str == "lt" || str == "lb") {
              for (let i = 0; i < x.length; i++) {
                letterArr.push(x[i]);
              }
              x = letterArr
                .sort()
                .reverse()
                .join("");
            }
            if (str == "rb" || str == "rt") {
              for (let i = 0; i < x.length; i++) {
                letterArr1.push(x[i]);
              }
              x = letterArr1.sort().join("");
            }
            return x;
          }
        }
      } else {
        if (Object.keys(item).indexOf("oralExaminationText") !== -1) {
          this.oralExamination[0].readOnly = true;
        }
        if (Object.keys(item).indexOf("auxiliaryText") !== -1) {
          this.auxiliary[0].readOnly = true;
        }
        if (Object.keys(item).indexOf("diagnosisText") !== -1) {
          this.diagnosis[0].readOnly = true;
        }
        if (Object.keys(item).indexOf("treatmentText") !== -1) {
          this.treatment[0].readOnly = true;
        }
        if (Object.keys(item).indexOf("handleText") !== -1) {
          this.handle[0].readOnly = true;
        }
        let str = tpitem.src.split("-")[0] + tpitem.src.split("-")[1];
        tpitem.checked = !tpitem.checked;
        if (item.toothPositionArr[y][str] != "") {
          if (item.toothPositionArr[y][str].indexOf(i) == -1) {
            item.toothPositionArr[y][str] += i;
          } else {
            item.toothPositionArr[y][str] = item.toothPositionArr[y][
              str
            ].replace(i, "");
          }
        } else {
          item.toothPositionArr[y][str] += i;
        }

        function sortnum(a, b) {
          return b - a;
        }
        let arr = [];
        let arr1 = [];
        if (y == "pt") {
          item.toothPositionArr.pt.lt = [
            ...item.toothPositionArr.pt.lt.toString()
          ]
            .sort(sortnum)
            .join("");
          item.toothPositionArr.pt.lb = [
            ...item.toothPositionArr.pt.lb.toString()
          ]
            .sort(sortnum)
            .join("");
          item.toothPositionArr.pt.rb = [
            ...item.toothPositionArr.pt.rb.toString()
          ]
            .sort()
            .join("");
          item.toothPositionArr.pt.rt = [
            ...item.toothPositionArr.pt.rt.toString()
          ]
            .sort()
            .join("");

          let hyObj = item.toothPositionArr.pt;
          let ryObj = item.toothPositionArr.dt;
          for (const key in hyObj) {
            ryObj[key] = hyObj[key];
          }
        } else if (y == "dt") {
          item.toothPositionArr.dt.lt = [
            ...item.toothPositionArr.dt.lt.toString()
          ]
            .sort()
            .reverse()
            .join("");
          item.toothPositionArr.dt.lb = [
            ...item.toothPositionArr.dt.lb.toString()
          ]
            .sort()
            .reverse()
            .join("");
          item.toothPositionArr.dt.rb = [
            ...item.toothPositionArr.dt.rb.toString()
          ]
            .sort()
            .join("");
          item.toothPositionArr.dt.rt = [
            ...item.toothPositionArr.dt.rt.toString()
          ]
            .sort()
            .join("");
          let hyObj = item.toothPositionArr.pt;
          let ryObj = item.toothPositionArr.dt;
          for (const key in ryObj) {
            hyObj[key] = ryObj[key];
          }
        }
      }
    },
    ptAllElection(item) {
      let index = item.pid - 1;
      if (this.synchronization) {
        if (item.hychecked) {
          for (let i = 0; i < this.tpArr.pt.lt.length; i++) {
            this.tpArr.pt.lt[i].checked = true;

            this.tpArr.pt.rt[i].checked = true;

            this.tpArr.pt.lb[i].checked = true;

            this.tpArr.pt.rb[i].checked = true;
          }
          if (!this.oralExamination[0].readOnly) {
            this.oralExamination[index].toothPositionArr.pt.lt = 87654321;
            this.oralExamination[index].toothPositionArr.pt.lb = 87654321;
            this.oralExamination[index].toothPositionArr.pt.rt = 12345678;
            this.oralExamination[index].toothPositionArr.pt.rb = 12345678;
          }
          if (!this.auxiliary[0].readOnly) {
            this.auxiliary[index].toothPositionArr.pt.lt = 87654321;
            this.auxiliary[index].toothPositionArr.pt.lb = 87654321;
            this.auxiliary[index].toothPositionArr.pt.rt = 12345678;
            this.auxiliary[index].toothPositionArr.pt.rb = 12345678;
          }
          if (!this.diagnosis[0].readOnly) {
            this.diagnosis[index].toothPositionArr.pt.lt = 87654321;
            this.diagnosis[index].toothPositionArr.pt.lb = 87654321;
            this.diagnosis[index].toothPositionArr.pt.rt = 12345678;
            this.diagnosis[index].toothPositionArr.pt.rb = 12345678;
          }
          if (!this.treatment[0].readOnly) {
            this.treatment[index].toothPositionArr.pt.lt = 87654321;
            this.treatment[index].toothPositionArr.pt.lb = 87654321;
            this.treatment[index].toothPositionArr.pt.rt = 12345678;
            this.treatment[index].toothPositionArr.pt.rb = 12345678;
          }
          if (!this.handle[0].readOnly) {
            this.handle[index].toothPositionArr.pt.lt = 87654321;
            this.handle[index].toothPositionArr.pt.lb = 87654321;
            this.handle[index].toothPositionArr.pt.rt = 12345678;
            this.handle[index].toothPositionArr.pt.rb = 12345678;
          }
        } else {
          this.initToothBitmapHy();
          if (!this.oralExamination[0].readOnly) {
            let obj = this.oralExamination[index].toothPositionArr.pt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.oralExamination[index].toothPositionArr.pt = obj;
          }
          if (!this.auxiliary[0].readOnly) {
            let obj = this.auxiliary[index].toothPositionArr.pt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.auxiliary[index].toothPositionArr.pt = obj;
          }
          if (!this.diagnosis[0].readOnly) {
            let obj = this.diagnosis[index].toothPositionArr.pt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.diagnosis[index].toothPositionArr.pt = obj;
          }
          if (!this.treatment[0].readOnly) {
            let obj = this.treatment[index].toothPositionArr.pt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.treatment[index].toothPositionArr.pt = obj;
          }
          if (!this.handle[0].readOnly) {
            let obj = this.handle[index].toothPositionArr.pt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.handle[index].toothPositionArr.pt = obj;
          }
        }
      } else {
        if (item.hychecked) {
          this.handle[0].readOnly;
          for (let i = 0; i < 8; i++) {
            this.tpArr.pt.lt[i].checked = true;

            this.tpArr.pt.rt[i].checked = true;

            this.tpArr.pt.lb[i].checked = true;

            this.tpArr.pt.rb[i].checked = true;
          }
          item.toothPositionArr.pt.lt = 87654321;
          item.toothPositionArr.pt.lb = 87654321;
          item.toothPositionArr.pt.rt = 12345678;
          item.toothPositionArr.pt.rb = 12345678;
        } else {
          this.initToothBitmapHy();
          item.toothPositionArr.pt.lt = "";
          item.toothPositionArr.pt.lb = "";
          item.toothPositionArr.pt.rt = "";
          item.toothPositionArr.pt.rb = "";
        }
      }
    },

    dtAllElection(item) {
      let index = item.pid - 1;
      if (this.synchronization) {
        if (item.rychecked) {
          for (let i = 0; i < this.tpArr.dt.lt.length; i++) {
            this.tpArr.dt.lt[i].checked = true;

            this.tpArr.dt.rt[i].checked = true;

            this.tpArr.dt.lb[i].checked = true;

            this.tpArr.dt.rb[i].checked = true;
          }
          if (!this.oralExamination[0].readOnly) {
            this.oralExamination[index].toothPositionArr.dt.lt = "EDCBA";
            this.oralExamination[index].toothPositionArr.dt.lb = "EDCBA";
            this.oralExamination[index].toothPositionArr.dt.rt = "ABCDE";
            this.oralExamination[index].toothPositionArr.dt.rb = "ABCDE";
          }
          if (!this.auxiliary[0].readOnly) {
            this.auxiliary[index].toothPositionArr.dt.lt = "EDCBA";
            this.auxiliary[index].toothPositionArr.dt.lb = "EDCBA";
            this.auxiliary[index].toothPositionArr.dt.rt = "ABCDE";
            this.auxiliary[index].toothPositionArr.dt.rb = "ABCDE";
          }
          if (!this.diagnosis[0].readOnly) {
            this.diagnosis[index].toothPositionArr.dt.lt = "EDCBA";
            this.diagnosis[index].toothPositionArr.dt.lb = "EDCBA";
            this.diagnosis[index].toothPositionArr.dt.rt = "ABCDE";
            this.diagnosis[index].toothPositionArr.dt.rb = "ABCDE";
          }
          if (!this.treatment[0].readOnly) {
            this.treatment[index].toothPositionArr.dt.lt = "EDCBA";
            this.treatment[index].toothPositionArr.dt.lb = "EDCBA";
            this.treatment[index].toothPositionArr.dt.rt = "ABCDE";
            this.treatment[index].toothPositionArr.dt.rb = "ABCDE";
          }
          if (!this.handle[0].readOnly) {
            this.handle[index].toothPositionArr.dt.lt = "EDCBA";
            this.handle[index].toothPositionArr.dt.lb = "EDCBA";
            this.handle[index].toothPositionArr.dt.rt = "ABCDE";
            this.handle[index].toothPositionArr.dt.rb = "ABCDE";
          }
        } else {
          this.initToothBitmapRy();
          if (!this.oralExamination[0].readOnly) {
            let obj = this.oralExamination[index].toothPositionArr.dt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.oralExamination[index].toothPositionArr.dt = obj;
          }
          if (!this.auxiliary[0].readOnly) {
            let obj = this.auxiliary[index].toothPositionArr.dt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.auxiliary[index].toothPositionArr.dt = obj;
          }
          if (!this.diagnosis[0].readOnly) {
            let obj = this.diagnosis[index].toothPositionArr.dt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.diagnosis[index].toothPositionArr.dt = obj;
          }
          if (!this.treatment[0].readOnly) {
            let obj = this.treatment[index].toothPositionArr.dt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.treatment[index].toothPositionArr.dt = obj;
          }
          if (!this.handle[0].readOnly) {
            let obj = this.handle[index].toothPositionArr.dt;
            for (const key in obj) {
              obj[key] = "";
            }
            this.handle[index].toothPositionArr.dt = obj;
          }
        }
      } else {
        if (item.rychecked) {
          for (let i = 0; i < 5; i++) {
            this.tpArr.dt.lt[i].checked = true;

            this.tpArr.dt.rt[i].checked = true;

            this.tpArr.dt.lb[i].checked = true;

            this.tpArr.dt.rb[i].checked = true;
          }
          item.toothPositionArr.dt.lt = "EDCBA";
          item.toothPositionArr.dt.lb = "EDCBA";
          item.toothPositionArr.dt.rt = "ABCDE";
          item.toothPositionArr.dt.rb = "ABCDE";
        } else {
          this.initToothBitmapRy();
          item.toothPositionArr.dt.lt = "";
          item.toothPositionArr.dt.lb = "";
          item.toothPositionArr.dt.rt = "";
          item.toothPositionArr.dt.rb = "";
        }
      }
    },
    // 主诉
    mainStatementfn() {
      this.mainStatement.show = true;
    },
    publicaddentry(k, val) {
      if (k == "mainStatement") {
        this.mainStatement.val += "/" + val;
      }
      if (k == "medicalHistory") {
        this.medicalHistory.val += "/" + val;
      }
      if (k == "pastHistory") {
        this.pastHistory.val += "/" + val;
      }
      if (k == "doctorsAdvice") {
        this.doctorsAdvice.val += "/" + val;
      }
    },
    publicaddTemplate(k, val) {
      if (k == "mainStatement") {
        this.mainStatement.val += "/" + val;
      }
      if (k == "medicalHistory") {
        this.medicalHistory.val += "/" + val;
      }
      if (k == "pastHistory") {
        this.pastHistory.val += "/" + val;
      }
      if (k == "doctorsAdvice") {
        this.doctorsAdvice.val += "/" + val;
      }
    },
    backfill(compval, tempData) {
      if (tempData) {
        this.upData(tempData);
      } else {
        this.mainStatement.val = compval[0].entryArr;
        this.medicalHistory.val = compval[1].entryArr;
        this.pastHistory.val = compval[2].entryArr;
        this.oralExamination[0].oralExaminationText = compval[3].entryArr;
        this.auxiliary[0].auxiliaryText = compval[4].entryArr;
        this.diagnosis[0].diagnosisText = compval[5].entryArr;
        this.treatment[0].treatmentText = compval[6].entryArr;
        this.handle[0].handleText = compval[7].entryArr;
        this.doctorsAdvice.val = compval[8].entryArr;
        this.remark = compval[9].entryArr;
      }
    },
    /**
     * 切换诊治日期，改变类别状态：初诊、复诊
     */
    changeVisitTime() {
      let visitTime = this.visitTime;
      let map = this.visitTimeList.find(item => {
        return item.registerTime == visitTime;
      })
      if(map) {
        this.checkFlag = map.returnVisit == '2' ? '0' : map.returnVisit + '';
      }
    },
    closeAdd() {
      this.$emit("sendChange", false);
      this.emptyemr();
    },
    ...mapGetters([
        'getVisitRecordFrist'
    ])
  },
  mixins: [],
  destroyed() {
  }
};
function checkData(v) {
  let cd = false;
  let reg = /^[0-9]*$/;

  if (v.doctor != "") {
    cd = true;
  } else {
    cd = false;
    v.open("请选择医生！", "warning");
    return cd;
  }
  // if (v.nurse != "") {
  //   cd = true;
  // } else {
  //   cd = false;
  //   v.open("请选择护士！", "warning");
  //   return cd;
  // }

  if (v.visitTime != "") {
    cd = true;
  } else {
    cd = false;
    v.open("请选择时间！", "warning");
    return cd;
  }

  if (v.checkFlag != "") {
    cd = true;
  } else {
    cd = false;
    v.open("请选择类别！", "warning");
    return cd;
  }

  if (v.mainStatement.val != "") {
    cd = true;
  } else {
    cd = false;
    v.open("主诉不能为空！", "warning");
    return cd;
  }

  return cd;
}
</script>
<style lang="less" scoped>
.wrap_left {
  width: 210px;
  border: 1px solid #e4e9ff;
  position: relative;
  z-index: 999;
}
.height100 {
  height: 100%;
}
.wrapper {
  height: 100%;
  display: block;
  .header-wrap {
    padding-bottom: 20px;
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
      width: 88px;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      padding-left: 10px;
      padding: 0 4px 0 4px;
      border: 1px solid #3b78fd;
      margin-left: 700px;
      color: #3b78fd;
      cursor: pointer;
    }
    li:nth-child(2) {
      cursor: pointer;
      color: #3b78fd;
      // width: 94px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 16px;
      padding: 0 4px 0 4px;
      cursor: pointer;
    }
  }
  .seachBox {
    width: 100%;
    height: 90px;
    .el-col {
      height: 46px;
    }
  }
  .wrap {
    position: relative;
    .content_left {
      border: 1px solid #e4e9ff;
      position: absolute;
      top: 23px;
      left: 0;
      z-index: 2;
    }
  }
  .content {
    height: 630px;
    overflow-y: scroll;
    position: relative;

    .el-row {
      position: static;
    }
    .toothPosition {
      width: 716px;
      height: 300px;
      box-shadow: 0 0 6px 0 #84ace8;
      background: #fff;
      position: absolute;
      top: 120px;
      left: -283px;
      z-index: 99999;
      .title {
        height: 50px;
        padding-top: 10px;
        border-bottom: 1px solid #84ace8;
        box-sizing: border-box;
        .left {
          width: 58px;
          float: left;
          height: 30px;
          border: 1px solid #dee8fb;
          line-height: 30px;
          text-align: center;
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
          color: #000;
          cursor: pointer;
        }
        .righ {
          width: 58px;
          float: right;
          height: 30px;
          border: 1px solid #dee8fb;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          line-height: 30px;
          text-align: center;
          position: relative;
          cursor: pointer;
        }
        .tpavtive {
          background: #3275d9;
          color: #fff;
        }
      }
      .tpcontent {
        height: 270px;
        background: #e9effd;
        .pt {
          height: 100%;
          width: 100%;

          .lt {
            width: 50%;
            height: 50%;
            border-bottom: 1px solid #3b78fd;
            border-right: 1px solid #3b78fd;
            float: left;

            .ltt {
              width: 34px;
              margin: 6px auto;
              height: 110px;
              text-align: center;
              padding: 2px 0 0 2px;
              border-radius: 4px;

              .tp {
                width: 28px;
                height: 78px;
                margin-top: 2px;
              }
              .tnum {
                width: 30px;
                height: 20px;
                border: 1px solid #ccc;
                margin-top: 6px;
                border-radius: 4px;
                line-height: 20px;
                text-align: center;
              }
            }
            .ltt:hover {
              box-shadow: 0 0 4px 0 #84ace8;
            }
            .lttactive {
              box-shadow: 0 0 4px 0 #84ace8;
              background: #fff;
            }
            .tnumactive {
              background: #3b78fd;
              color: #fff;
            }
            .el-row {
              height: 100%;
            }
            .el-col {
              height: 100%;
            }
          }
        }
        .dt {
          .lt:nth-child(1) {
            .el-col {
              float: right;
            }
          }
          .lt:nth-child(3) {
            .el-col {
              float: right;
            }
          }
        }
      }
      .box {
        height: 20px;
        padding-left: 10px;
        .tpclose {
          cursor: pointer;
          margin-left: 40px;
          font-size: 20px;
        }
      }
    }

    padding-top: 20px;

    .right {
      padding-right: 2px;
      position: relative;
      float: right;
      .position {
        width: 150px;
        height: 80px;
        margin: 11px auto;
        margin-top: 40px;
        span {
          float: left;
          width: 50%;
          height: 40px;
          box-sizing: border-box;
        }
        span:nth-child(1) {
          border-right: 2px solid #3b78fd;
          border-bottom: 2px solid #3b78fd;
          text-align: right;
          line-height: 40px;
        }
        span:nth-child(2) {
          line-height: 40px;
          text-align: left;
        }
        span:nth-child(3) {
          line-height: 40px;
          text-align: right;
        }
        span:nth-child(4) {
          border-top: 2px solid #3b78fd;
          border-left: 2px solid #3b78fd;
          margin: -2px 0 0 -2px;
          line-height: 40px;
        }
      }
      .delIcon {
        display: inline-block;
        width: 20px;
        height: 100%;
        text-align: center;
        font-size: 20px;
        color: #3b78fd;
      }
      .textarea1 {
        width: 95%;
      }
      .mt {
        margin-top: 10px;
        position: relative;

        .down_box {
          width: 100%;
          background: #fff;
          z-index: 999;
          padding: 1px;
          position: absolute;
          top: 60px;
          left: 0;
          cursor: pointer;
          box-shadow: 0 0 6px 0 #e4e9ff;
          .down_box_title {
            height: 30px;
            width: 100%;
            .down_box_title_but {
              width: 100px;
              height: 30px;
              float: left;
              border: 1px solid #ccc;
              line-height: 30px;
              color: #ccc;
              text-align: center;
            }
            .down_box_title_but:nth-child(2) {
              margin-left: -1px;
            }
            .active {
              border: 1px solid #3b78fd;
              color: #3b78fd;
            }
            .close {
              float: right;
              line-height: 30px;
              width: 30px;
              text-align: center;
            }
          }
          .down_box_content {
            max-height: 300px;
            width: 100%;
            overflow-y: scroll;
            .entry {
              margin-right: 8px;
            }
            .entry:hover {
              color: #3b78fd;
            }
            .border {
              border-top: 1px solid #e4e9ff;
              border-right: 1px solid #e4e9ff;
            }
            .TemplateTitle {
              color: #3b78fd;
              text-align: left;
              padding-left: 10px;
            }
            .TemplateContent {
              padding-left: 10px;
              height: auto;
              line-height: normal;
            }
            .TemplateContent:hover {
              color: #3b78fd;
            }
          }
        }
        .kq_check {
          top: 140px;
        }
        .doctor_Advice {
          top: 100px;
        }
      }
      .add {
        color: #3b78fd;
        text-align: center;
        span {
          cursor: pointer;
        }
      }
      .add_symbol {
        font-weight: bold;
        font-size: 18px;
      }
      .new_chart {
        margin-top: 10px;
      }
    }
  }
  .but_box {
    width: 100%;
    padding: 20px 0 30px 0;
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    .el-col {
      text-align: center;
    }
  }
  .content::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .content::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
  .down_box_content::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: #ccc;
    border-radius: 1px;
  }
  .down_box_content::-webkit-scrollbar-thumb {
    display: block;
    width: 1px;
    margin: 0 auto;
    border-radius: 1px;
    background: #3b78fd;
  }
}
#addCaseHistory .el-menu {
  height: 585px;
  overflow-y: auto;
  overflow-x: hidden;
}
.btn-box {
  position: absolute;
  padding-left: 205px;
  left: 0;
  bottom: 0;
  z-index: 999;
  height: 45px;
  width: 100%;
  border-top: 1px solid #eee;
  padding-top: 12px;
  background: #fff;
  text-align: right;
}
.checkFlag_radio {
  margin-right: 10px;
}
</style>
<style>
#addCaseHistory .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  /* width: 200px; */
}
#addCaseHistory .el-menu {
  border: none;
}
#addCaseHistory .el-textarea__inner {
  /* max-height: 54px;
  min-height: 54px; */
}
#addCaseHistory .down_box .down_box_content .el-form-item__label {
  color: #3b78fd;
}
#addCaseHistory .mainPage .el-menu-item .is-active {
  width: 128px;
}

#adydCaseHistor .el-menu-item {
  height: 40px;
  line-height: 40px;
  min-width: 128px !important;
}
#adydCaseHisto .el-submenu {
  min-width: 128px !important;
}
#adydCaseHistor .el-menu-item,
.el-submenu__title {
  height: 40px;
  line-height: 40px;
}
#adydCaseHistor .el-menu-item-group__title {
  padding: 4px 0 7px 20px;
}
#adydCaseHistor .el-form-item__content {
  position: static;
}
</style>
