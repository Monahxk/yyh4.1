/*
 * @Descripttion:
 * @version:
 * @Author: hzj
 * @Date: 2019-08-26 10:13:31
 * @LastEditors: hzj
 * @LastEditTime: 2019-10-22 17:09:24
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import login from  '../view/login/Login.vue'
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      component: () => import('@/view/mainpage/MainPage.vue'),
      children: [
        {
          path: '/Doctor',
          name: 'Doctor',
          component: () => import('../view/workbench/doctorbench/DoctorBench.vue'),
          children: [
            {
              path: '/DoctorBench/:menu?/:sub?',
              name: 'DoctorBench',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:"need-deal-visit",firststatus:'need-deal',},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableClinicList.vue'),
            },
            {
              path: '/charge/:menu/:sub',
              name: 'charge',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:"need-deal"},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableChargeList.vue'),
            },
            {
              path: '/caseHistory/:menu/:sub',
              name: 'caseHistory',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:"need-deal"},
              component: () => import('../view/workbench/doctorbench/components/backlog/TableCaseHistoryList.vue'),
            },
            {
              path: '/returnVisit/:menu/:sub',
              name: 'returnVisit',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:0},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableReturnVisitList.vue'),
            },

            {
              path: '/allClinicTableCom/:menu/:sub',
              name: 'allClinicTableCom',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:"",firststatus:'all'},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableClinicList.vue'),
            },
            {
              path: '/allCharge/:menu/:sub',
              name: 'allCharge',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:"all"},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableChargeList.vue'),
            },
            {
              path: '/allCaseHistory/:menu/:sub',
              name: 'allCaseHistory',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:"all"},
              component: () => import('../view/workbench/doctorbench/components/backlog/TableCaseHistoryList.vue'),
            },
            {
              path: '/allReturnVisi/:menu/:sub',
              name: 'allReturnVisit',
              meta: {name: "医生工作台",attr:'doctor',type:'doctor',status:''},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableReturnVisitList.vue'),
            }
          ]
        },
        {
          path: '/Receptionist',
          name: 'Receptionist',
          component: () => import('../view/workbench/receptionistbench/ReceptionistBench.vue'),
          children: [
            {
              path: '/ReceptionistBench/:menu?/:sub?',
              name: 'ReceptionistBench',
              meta: {name: "前台工作台",class:'appointment',attr:'front',type:'pending'},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableBespeakList.vue'),
            },
            {
              path: '/rccharge/:menu/:sub',
              name: 'rccharge',
              meta: {name: "前台工作台",attr:'front',type:'',status:"need-deal"},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableChargeList.vue'),
            },
            {
              path: '/rclinicTableCom/:menu/:sub',
              name: 'rclinicTableCom',
              meta: {name: "前台工作台",attr:'front',type:'',status:"need-deal-visit",firststatus:"need-deal"},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableClinicList.vue'),
            },
            {
              path: '/rcreturnVisit/:menu/:sub',
              name: 'rcreturnVisit',
              meta: {name: "前台工作台",attr:'front',type:'',status:0},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableReturnVisitList.vue'),
            },
            {
              path: '/rcallBespeak/:menu/:sub',
              name: 'rcallBespeak',
              meta: {name: "前台工作台",class:'appointment',attr:'front',type:'all'},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableBespeakList.vue'),
            },
            {
              path: '/rcallClinicTableCom/:menu/:sub',
              name: 'rcallClinicTableCom',
              meta: {name: "前台工作台",attr:'front',type:'',status:"need-deal-visit",firststatus:"all"},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableClinicList.vue'),
            },
            {
              path: '/rcallCharge/:menu/:sub',
              name: 'rcallCharge',
              meta: {name: "前台工作台",attr:'front',type:'',status:""},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableChargeList.vue'),
            },
            {
              path: '/rcallReturnVisit/:menu/:sub',
              name: 'rcallReturnVisit',
              meta: {name: "前台工作台",attr:'front',type:'',status:''},
              component: () => import('../view/workbench/receptionistbench/components/backlog/TableReturnVisitList.vue'),
            },
          ]
        },
        //4.1HZJ添加，暂时未用
        {
          path: '/ReceptionistIndex',
          name: 'ReceptionistBench',
          meta: {name: "前台工作台",childPathName: 'reTableBespeakList'},
          component: () => import('../view/workbench/index'),
          children: [
            {
              path: '/receptionistbench/TableBespeakList',
              name: 'reTableBespeakList',
              meta: {name: "前台工作台",cmemo:'预约',path:'/ReceptionistIndex'},
              component: () => import('@/view/workbench/receptionistbench/components/backlog/TableBespeakList.vue'),
            },
          ]
        },
        // {
        //   path:'/SideslipFrame',
        //   name:'SideslipFrame',
        //   component: () => import('../view/sideslipframe/SideslipFrame.vue')
        // },
        {
          path: '/CaseHistoryManage',
          name: 'CaseHistoryManage',
          component: () => import('../view/workbench/doctorbench/CaseHistoryManage.vue')
        },
        {
          path: '/HargeManag',
          name: 'HargeManag',
          component: () => import('../view/workbench/receptionistbench/HargeManag.vue')
        },
        // 系统配置 - 基本配置
        {
          path: '/BaseInfo',
          name: 'BaseInfo',
          component: () => import('../view/systemcfg/baseinfo/BaseInfo')
        },
        // 系统配置 - 折扣权限
        {
          path: '/DiscountPvg',
          name: 'DiscountPvg',
          component: () => import('../view/systemcfg/discountpvg/DiscountPvg')
        },
        // 系统配置 - 收费方式
        {
          path: '/PayWay',
          name: 'PayWay',
          component: () => import('../view/systemcfg/payway/PayWay')
        },
        // 系统配置 - 回访配置
        {
          path: '/CallbackCfg',
          name: 'CallbackCfg',
          component: () => import('@/view/systemcfg/callbackcfg/callbackcfgIndex'),
        },
        // 系统配置 - 作息排版WorkSchedules
        {
          path: '/WorkSchedule',
          name: 'WorkSchedule',
          component: () => import('../view/systemcfg/workschedule/WorkSchedule.vue'),
        },
        // 管理中心 - 部门管理
        {
          path: '/Department',
          name: 'Department',
          component: () => import('@/view/mngcenter/department/Department.vue'),

        },
        // 管理中心 - 审批管理
        {
          path: '/Approval',
          name: 'Approval',
          component: () => import('../view/mngcenter/approval/ApprovalIndex.vue'),
          children:[
            {
              path: '/Await',
              name: 'Await',
              component:()=> import('@/view/mngcenter/approval/Await')
            },
            {
              path: '/Approved',
              name: 'Approved',
              component:()=> import('@/view/mngcenter/approval/Approved')
            },
            {
              path: '/Me',
              name: 'Me',
              component:()=> import('@/view/mngcenter/approval/Me')
            },
          ]
        },
        //管理中心 - 角色管理
        {
          path: "/Role",
          name: "Role",
          component: () => import('../view/mngcenter/role/Role.vue'),
        },
        //管理中心 - 工作关系
        {
          path: "/WorkingRelation",
          name: "WorkingRelation",
          component: () => import('../view/mngcenter/workingrelation/WorkingRelation.vue'),
        },
        //管理中心 - 员工管理
        {
          path: "/Employee",
          name: "Employee",
          component: () => import('../view/mngcenter/employee/Employee.vue'),
        },
        //管理中心 - 体检
        {
          path: "/PhysicalExam",
          name: "PhysicalExam",
          component: () => import('../view/mngcenter/physical/PhysicalExam.vue')
        },
        // 营销管理-回访
        {
          path: '/Callback',
          name: 'Callback',
          component: () => import('../view/marketing/callback/index'),
          children:[
            {
              path:'/Callback/0',
              name:'CallBackList',
              meta:{cmemo:'回访列表',path:'/Callback'},
              component:()=> import('@/view/marketing/callback/CallBackList'),
            },
          ]
        },
        // 营销管理-客户咨询
        {
          path: '/Customer',
          name: 'Customer',
          component: () => import('../view/marketing/customer/Customer')
        },
        { //患者中心 - 患者中心
          path:'/VisitMng',
          name:'VisitMng',
          // meta:{name:'患者中心'},
          component:()=> import('@/view/patientCenter/Index'),
          children:[
            {
              path:'/TodayPatient',
              name:'TodayPatient',
              // meta:{name:'今日新增患者'},
              component:()=> import('@/view/patientCenter/TodayPatient'),
            },
            {
              path:'/AllPatient',
              name:'AllPatient',
              // meta:{name:'全部患者'},
              component:()=> import('@/view/patientCenter/AllPatient'),
            },
          ]
        },
        {
          path: '/ChargeItem',
          name: 'ChargeItem',
          // meta:{name:'收费项目'},
          component:()=> import('@/view/systemcfg/chargeItem/ChargeItemIndex'),
          children:[
            {
              path: '/Item',
              name: 'Item',
              // meta:{name:'收费项目'},
              component:()=> import('@/view/systemcfg/chargeItem/Item')
            },
            {
              path: '/RegistrationFee',
              name: 'RegistrationFee',
              // meta:{name:'收费大类'},
              component:()=> import('@/view/systemcfg/chargeItem/Registration')
            }
          ]
        },
        {
          path: '/TreatItemCfg',
          name: 'TreatItemCfg',
          // meta:{name:'预约项目'},
          component:()=> import('@/view/systemcfg/appointItemCfg/AppointItemCfgIndex'),
        },
        // 系统管理 - 病例
        {
          path: '/EmrCfg',
          name: 'EmrCfg',
          // meta:{name:'病例配置'},
          component:()=> import('@/view/systemcfg/case/CaseIndex'),
          children: [
            {
              path: '/CaseTemplate',
              name: 'CaseTemplate',
              // meta:{name:'病历模板维护'},
              component:()=> import('@/view/systemcfg/case/Template')
            },
            {
              path: '/CaseEntry',
              name: 'CaseEntry',
              // meta:{name:'病历词条维护'},
              component:()=> import('@/view/systemcfg/case/Entry')
            },
            {
              path: '/Stockpile',
              name: 'Stockpile',
              // meta:{name:'病历存储设置'},
              component:()=> import('@/view/systemcfg/case/Stockpile')
            }

          ]
        },
        { //系统管理 - 患者配置
          path:'/PatientCfg',
          name:'PatientCfg',
          // meta:{name:'患者配置'},
          component:()=> import('@/view/systemcfg/patient/Patient')
        },
        { //系统管理 - 审批流程
          path:'/ApprovalCfg',
          name:'ApprovalCfg',
          component:()=> import('@/view/systemcfg/approval/ApprovalIndex'),
        },
        { //系统管理 - 新建审批流程
          path:'/Addapproval',
          name:'Addapproval',
          component:()=> import('@/view/systemcfg/approval/Addapproval'),
        },
        { //系统管理 - 技加工配置
          path:'/MachiningCfg',
          name:'MachiningCfg',
          component:()=> import('@/view/systemcfg/process/Process')
        },
        { //系统管理 - 系统参数
          path:'/SysParam',
          name:'SysParam',
          component:()=> import('@/view/systemcfg/parameter/Parameter')
        },
        // 营销管理-预存款
        {
          path: '/Predeposite',
          name: 'Predeposite',
          meta:{name:''},
          component:()=> import('@/view/marketing/predeposite/ActivityIndex'),
          children:[
            {
              path:'/Predeposite',
              name:'Predeposite',
              meta:{name:''},
              component:()=> import('@/view/marketing/predeposite/PredepositCard')
            },
            {
              path:'/Discount',
              name:'Discount',
              meta:{name:''},
              component:()=> import('@/view/marketing/predeposite/Discount')
            }
          ]
        },
        // 营销管理-营销活动
        {
          path: '/Activity',
          name: 'Activity',
          component:()=> import('@/view/marketing/activity/Activity'),
          children:[
            {
              path:'/AdvanceDeposit',
              name:'AdvanceDeposit',
              component:()=> import('@/view/marketing/activity/AdvanceDeposit')
            },
            {
              path:'/DiscountCard',
              name:'DiscountCard',
              component:()=> import('@/view/marketing/activity/DiscountCard')
            },
            {
              path:'/Cashcoupon',
              name:'Cashcoupon',
              component:()=> import('@/view/marketing/activity/Cashcoupon')
            },
            {
              path:'/Promotion',
              name:'Promotion',
              component:()=> import('@/view/marketing/activity/Promotion')
            }
          ]
        },
        { //预约中心 - 预约查询
          path:'/AppointInquiry',
          name:'AppointInquiry',
          // meta:{name:'预约查询'},
          component:()=> import('@/view/appointment/Inquire')
        },
        // 管理中心-患者管理
        {
          path: "/PatientMng",
          name: "PatientMng",
          // meta:{name:'患者管理'},
          component:()=> import('@/view/mngcenter/managePatient/PatientIndex'),
          children:[
            {
              path:'/Inquire',
              name:'Inquire',
              // meta:{name:'患者查询'},
              component:()=> import('@/view/mngcenter/managePatient/Inquire'),
            },
            {
              path:'/Repetition',
              name:'Repetition',
              // meta:{name:'重复患者'},
              component:()=> import('@/view/mngcenter/managePatient/Repetition'),
            },
            {
              path:'/Flyback',
              name:'Flyback',
              // meta:{name:'患者回归'},
              component:()=> import('@/view/mngcenter/managePatient/Flyback'),
            },
          ]
        },
        {
          path:'/Machining',
          name:'Machining',
          // meta:{name:'管理中心-技加工'},
          component:()=> import('@/view/mngcenter/process/Process'),
        },
        // 收银对账
        {
          path:'/AccountCollection',
          name:'AccountCollection',
          component:()=> import('@/view/financial/AccountCollection'),
          children: [
            {
              path:'/AccountCollection/0',
              name:'ChargeBill',
              meta: {cmemo: '收费账单',path: '/AccountCollection' },
              component:()=> import('@/view/financial/AccountCollection/ChargeBill'),
            },
            {
              path:'/AccountCollection/1',
              name:'ChargeDetail',
              meta: {cmemo: '账目明细',path: '/AccountCollection' },
              component:()=> import('@/view/financial/AccountCollection/ChargeDetail'),
            }
          ]
        },
        // 日常收支
        {
          path:'/DailyIncomeOut',
          name:'DailyIncomeOut',
          component:()=> import('@/view/financial/DailyIncomeOut'),
          children: [
            {
              path:'/DailyIncomeOut/0',
              name:'DailyIn',
              meta: {path: '/DailyIncomeOut'},
              component:()=> import('@/view/financial/DailyIncomeOut/DailyInAndOut'),
            },
            {
              path:'/DailyIncomeOut/1',
              name:'DailyOut',
              meta: {path: '/DailyIncomeOut'},
              component:()=> import('@/view/financial/DailyIncomeOut/DailyInAndOut'),
            }
          ]
        },
        // 资金流水
        {
          path:'/CapitalFlow',
          name:'CapitalFlow',
          component:()=> import('@/view/financial/CapitalFlow'),
        },
        // 欠退费
        {
          path:'/RefundOrArrears',
          name:'RefundOrArrears',
          component:()=> import('@/view/financial/RefundOrArrears'),
          children: [
            {
              path:'/RefundOrArrears/0',
              name:'Arrears',
              meta: {cmemo: '欠费报表',path: '/RefundOrArrears' },
              component:()=> import('@/view/financial/RefundOrArrears/arrears'),
            },
            {
              path:'/RefundOrArrears/1',
              name:'Refund',
              meta: {cmemo: '退费报表',path: '/RefundOrArrears'},
              component:()=> import('@/view/financial/RefundOrArrears/refund'),
            }
          ]
        },
        // 退货管理
        {
          path:'/Return2Provider',
          name:'Return2Provider',
          component:()=> import('@/view/financial/Return2Provider'),
          children: [
            {
              path:'/Return2Provider/0',
              name:'ReturnList',
              meta: {cmemo: '退货管理',path: '/Return2Provider' },
              component:()=> import('@/view/financial/Return2Provider/ReturnList'),
            },
          ]
        },
        // 预存款
        {
          path:'/PredepositeRecord',
          name:'PredepositeRecord',
          component:()=> import('@/view/financial/DetalCard'),
          children: [
            {
              path:'/PredepositeRecord/0',
              name:'PredepositCard',
              meta: {cmemo: '预存卡余额',path: '/PredepositeRecord'},
              component:()=> import('@/view/financial/DetalCard/predepositCard'),
            },
            {
              path:'/PredepositeRecord/1',
              name:'DiscountCard',
              meta: {cmemo: '折扣卡余额',path: '/PredepositeRecord'},
              component:()=> import('@/view/financial/DetalCard/discountCard'),
            },
            {
              path:'/PredepositeRecord/2',
              name:'PredepositCardFlow',
              meta: {cmemo: '预存卡流水',path: '/PredepositeRecord'},
              component:()=> import('@/view/financial/DetalCard/predepositCard/PredepositCardFlow'),
            },
            {
              path:'/PredepositeRecord/3',
              name:'DiscountCardFlow',
              meta: {cmemo: '折扣卡流水',path: '/PredepositeRecord'},
              component:()=> import('@/view/financial/DetalCard/discountCard/DiscountCardFlow'),
            }
          ]
        },
        // 预约视图
        {
          path:'/AppointView',
          name:'AppointView',
          component:()=> import('@/view/appoint/AppointIndex'),
          children: [
            {
              path:'/CalendarView',
              name:'CalendarView',
              // meta:{name:'预约日历视图'},
              component:()=> import('@/view/appoint/CalendarView'),
            },
            {
              path:'/DoctorView',
              name:'DoctorView',
              // meta:{name:'预约医生视图'},
              component:()=> import('@/view/appoint/DoctorView'),
            }
          ]
        },
        // 日报表
        {
          path:'/ChargeDailyReport',
          name:'ChargeDailyReport',
          component:()=> import('@/view/financial/DailyReport'),
        },
        // 财务报表
        {
          path:'/Report',
          name:'Report',
          component:()=> import('@/view/financial/FinanceReport'),
        },
        // 统计中心
        {
          path:'/OperatingReport',
          // name:'Overview',
          component:()=> import('@/view/statistics/Overview'),
          children: [
            {
              path:'/TotalParent',
              name:'TotalParent',
              component:()=> import('@/view/statistics/Overview/TotalParent'),
            },
            {
              path:'/TotalIncome',
              name:'TotalIncome',
              component:()=> import('@/view/statistics/Overview/TotalIncome'),
            },
            {
              path:'/Increment',
              name:'Increment',
              component: () => import('@/view/statistics/Overview/Increment')
            },
            {
              path:'/OverviewVisit',
              name:'OverviewVisit',
              component: () => import('@/view/statistics/Overview/Visit')
            },
            {
              path:'/Received',
              name:'Received',
              component: () => import('@/view/statistics/Overview/Received')
            }
          ]
        },
        // 库房报表
        {
          path:'/InventoryReport',
          name:'InventoryReport',
          component:()=> import('@/view/statistics/storage/StoragetIndex'),
          children: [
            {
              path:'/Stock',
              name:'Stock',
              component:()=> import('@/view/statistics/storage/Stock'),
            },
            {
              path:'/Access',
              name:'Access',
              component:()=> import('@/view/statistics/storage/Access'),
            },
            {
              path:'/Out',
              name:'Out',
              component:()=> import('@/view/statistics/storage/Out'),
            },
            {
              path:'/Purchase',
              name:'Purchase',
              component:()=> import('@/view/statistics/storage/Purchase'),
            },
            {
              path:'/Receive',
              name:'Receive',
              component:()=> import('@/view/statistics/storage/Receive'),
            },
            {
              path:'/Quit',
              name:'Quit',
              component:()=> import('@/view/statistics/storage/Quit'),
            },
            {
              path:'/Check',
              name:'Check',
              component:()=> import('@/view/statistics/storage/Check'),
            },
          ]
        },
        // 绩效中心
        {
          path:'/KpiReport',
          // name:'KPICenter',
          component:()=> import('@/view/statistics/KPICenter'),
          children: [
            {
              path:'/',
              // name:'TotalParent',
              component: () => import('@/view/statistics/KPICenter/KpiFee')
            },
            {
              path:'/KpiPatient',
              name:'KpiPatient',
              component: () => import('@/view/statistics/KPICenter/KpiPatient')
            },
            {
              path:'/KpiNurse',
              name:'KPINurse',
              component: () => import('@/view/statistics/KPICenter/KPINurse')
            },
            {
              path:'/KpiPay',
              name:'KpiPay',
              component: () => import('@/view/statistics/KPICenter/KpiPay')
            }
          ]
        },
        // 趋势分析
        {
          path:'/TrendAnalysis',
          // name:'TrendAnalysis',
          component:()=> import('@/view/statistics/TrendAnalysis'),
          children: [
            {
              path:'/',
              name:'TotalParent',
              component: () => import('@/view/statistics/TrendAnalysis/StatisticalPartent')
            }
          ]
        },
        // 进销存 - 单据管理
        {
          path:'/Receipt',
          name:'Receipt',
          component: () => import('@/view/inventory/manageReceipt/index'),
          children: [
            {
              path: '/Receipt/0',
              name: 'Purchase',
              meta:{cmemo:'采购',path: '/Receipt'},
              component:()=> import('@/view/inventory/manageReceipt/purchase/PurchaseOrder')
            },
            {
              path: '/Receipt/1',
              name: 'ImportInventory',
              meta:{cmemo:'入库',path: '/Receipt'},
              component:()=> import('@/view/inventory/manageReceipt/impInventory/ImportInventory')
            },
            {
              path: '/Receipt/2',
              name: 'ExportInventory',
              meta:{cmemo:'出库',path: '/Receipt'},
              component:()=> import('@/view/inventory/manageReceipt/exportInventory/ExportInventory')
            },
            {
              path: '/Receipt/3',
              name: 'returnToProvider',
              meta:{cmemo:'退货单',path: '/Receipt'},
              component:()=> import('@/view/inventory/manageReceipt/returnToProvider/index')
            },
            {
              path: '/Receipt/4',
              name: 'Allocation',
              meta:{cmemo:'调拨',path: '/Receipt'},
              component:()=> import('@/view/inventory/manageReceipt/allocation/Allocation')
            },
          ]
        },
        // //进销存 - 库房管理
        {
          path:'/Warehouse',
          name:'Warehouse',
          component: () => import('@/view/inventory/warehouse/index'),
          children: [
            {
              path: '/WarehouseIndex',
              name: 'WarehouseIndex',
              meta:{name:'',path: '/Warehouse'},
              component:()=> import('@/view/inventory/warehouse/WarehouseList')
            },
          ]
        },
        // //进销存 - 报损管理
        {
          path:'/ReportLoss',
          name:'ReportLoss',
          component: () => import('@/view/inventory/reportLoss/index'),
          children: [
            {
              path: '/ReportLossIndex',
              name: 'ReportLossIndex',
              meta:{name:'',path: '/ReportLoss'},
              component:()=> import('@/view/inventory/reportLoss/reportLoss/ReportLossList')
            },
          ]
        },
        // //进销存 - 领用/退库
        {
          path:'/TakeOut',
          name:'TakeOut',
          component: () => import('@/view/inventory/takeOut/index'),
          children: [
            {
              path: '/TakeOut/0',
              name: 'TakeOutIndex',
              meta:{cmemo:'领用管理',path: '/TakeOut'},
              component:()=> import('@/view/inventory/takeOut/takeOut/TakeOutList')
            },
            {
              path: '/TakeOut/1',
              name: 'ReturnToInventoryIndex',
              meta:{cmemo:'退库管理',path: '/TakeOut'},
              component:()=> import('@/view/inventory/takeOut/returnToInventory/ReturnToInventoryList')
            },
          ]
        },
        // //进销存 - 批号/有效期
        {
          path:'/Batch',
          name:'Batch',
          component: () => import('@/view/inventory/batchValidity/index'),
          children: [
            {
              path: '/Batch/0',
              name: 'BatchIndex',
              meta:{cmemo:'批号',path: '/Batch'},
              component:()=> import('@/view/inventory/batchValidity/batch/index')
            },
            {
              path: '/Batch/1',
              name: 'ExpireWarning',
              meta:{cmemo:'临期预警',path: '/Batch'},
              component:()=> import('@/view/inventory/batchValidity/expireWarning/index')
            },
            {
              path: '/Batch/2',
              name: 'LowQuantityWarning',
              meta:{cmemo:'低量预警',path: '/Batch'},
              component:()=> import('@/view/inventory/batchValidity/lowQuantityWarning/index')
            },
          ]
        },
        // //进销存 - 进销存配置
        {
          path:'/InventoryCfg',
          name:'InventoryCfg',
          component: () => import('@/view/inventory/baseCfg/index'),
          children: [
            {
              path: '/InventoryCfg/0',
              name: 'BaseInfoIndex',
              meta:{cmemo:'基本信息',path: '/InventoryCfg'},
              component:()=> import('@/view/inventory/baseCfg/baseInfo/index')
            },
            {
              path: '/InventoryCfg/1',
              name: 'Provider',
              meta:{cmemo:'供应商配置',path: '/InventoryCfg'},
              component:()=> import('@/view/inventory/baseCfg/provider/index')
            },
            {
              path: '/InventoryCfg/2',
              name: 'Goods',
              meta:{cmemo:'供应商配置'},
              component:()=> import('@/view/inventory/baseCfg/goods/index')
            },
          ]
        },
        // //进销存 - 基础信息
        // {
        //   path:'/InventoryBaseCfg',
        //   name:'InventoryBaseCfg',
        //   component: () => import('../view/inventory/basecfg/BaseInfo')
        // },
        // //进销存 - 供应商配置
        // {
        //   path: '/ProviderCfg',
        //   name: 'ProviderCfg',
        //   meta:{name:''},
        //   component:()=> import('@/view/inventory/providercfg/ProviderCfgIndex'),
        //   children:[
        //     {
        //       path: '/Provider',
        //       name: 'Provider',
        //       meta:{name:''},
        //       component:()=> import('@/view/inventory/providercfg/Provider')
        //     },
        //   ]
        // },
        // //进销存 - 物品配置
        // {
        //   path: '/DrugCfg',
        //   name: 'DrugCfg',
        //   meta:{name:''},
        //   component:()=> import('@/view/inventory/drugcfg/DrugCfgIndex'),
        //   children:[
        //     {
        //       path: '/Drugs',
        //       name: 'Drugs',
        //       meta:{name:''},
        //       component:()=> import('@/view/inventory/drugcfg/Drugs')
        //     },
        //   ]
        // },
        // //进销存 - 物品入库
        // {
        //   path: '/ImportInventory',
        //   name: 'ImportInventory',
        //   meta:{name:''},
        //   component:()=> import('@/view/inventory/impInventory/ImportInventory'),
        //   children:[]
        // },
        // //进销存 - 物品出库
        // {
        //   path: '/ExportInventory',
        //   name: 'ExportInventory',
        //   meta:{name:''},
        //   component:()=> import('@/view/inventory/exportInventory/ExportInventory'),
        //   children:[]
        // },
        // //进销存 - 物品退货
        // {
        //   path: '/ReturnDrug',
        //   name: 'ReturnDrug',
        //   meta:{name:''},
        //   component:()=> import('@/view/inventory/returnRecord/ReturnDrug'),
        //   children:[]
        // },
        // //进销存 - 当前库存
        {
          path: '/Inventory',
          name: 'Inventory',
          meta:{name:''},
          component:()=> import('@/view/inventory/currentInventory/index'),
          children:[
            {
              path: '/Inventory/0',
              name: 'CurrentInventory',
              meta:{cmemo:'当前库存',path: '/Inventory'},
              component:()=> import('@/view/inventory/currentInventory/components/index')
            },
          ]
        },
        // //进销存 - 盘点管理
        // {
        //   path: '/MakeInventory',
        //   name: 'MakeInventory',
        //   meta:{name:''},
        //   component:()=> import('@/view/inventory/makeInventory/MakeInventory'),
        //   children:[]
        // },
        //连锁管理 - 门店管理
        {
          path: '/ChainInstitution',
          name: 'ChainInstitution',
          meta:{name:''},
          component:()=> import('@/view/chainment/chainInstitution/ChainInstitution'),
          children:[]
        },
        //连锁管理 - 连锁员工
        {
          path: '/ChainEmployee',
          name: 'ChainEmployee',
          meta:{name:''},
          component:()=> import('@/view/chainment/chainEmployee/ChainEmployee'),
          children:[]
        },
        //连锁管理 - 集团报表
        {
          path: '/ChainReport',
          name: 'ChainReport',
          // meta:{name:'集团报表'},
          component:()=> import('@/view/chainment/report/ReportIndex'),
          children:[
            {
              path: '/ChainReportMap',
              name: 'ChainReportMap',
              // meta:{name:'门店地图'},
              component:()=> import('@/view/chainment/report/Map'),
            },
            {
              path: '/ChainReportPatient',
              name: 'ChainReportPatient',
              // meta:{name:'新增患者'},
              component:()=> import('@/view/chainment/report/Patient'),
            },
            {
              path: '/ChainReportEarnings',
              name: 'ChainReportEarnings',
              // meta:{name:'收入统计'},
              component:()=> import('@/view/chainment/report/Earnings'),
            },
            {
              path: '/ChainReportAppointment',
              name: 'ChainReportAppointment',
              // meta:{name:'预约统计'},
              component:()=> import('@/view/chainment/report/Appointment'),
            },
            {
              path: '/ChainReportTrend',
              name: 'ChainReportTrend',
              // meta:{name:'收入趋势'},
              component:()=> import('@/view/chainment/report/Trend'),
            },
          ]
        },
      ]
    }
  ]
})
