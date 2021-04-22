/*
 * @Descripttion: 
 * @version: 
 * @Author: hzj
 * @Date: 2019-08-01 14:52:35
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-18 13:53:25
 */

// 常量命名规范：
// <类别>[_<业务>]_<名称>
// 类别：STATUS、TYPE、MESSAGE、DATA、FLAG
// 业务：CLINIC、CLINIC_USER、FINANCE、……
// 示例：NOTICE_REGISTER_TITLE
/*********************** http状态码常量定义 ***********************/
/**
 ** 状态码： 200 成功 
 * @author jyp
 */
export const SYSTEM_HTTP_SUCCESS = 200

/*********************** 系統配置-收費方式常量定义 *************************/
/**
 ** 系統配置 收費方式： 是否勾选充值卡 0 不勾选 1勾选
 * @author jyp
 */
export const TYPE_PAYWAY_HASCARD = '0'
export const TYPE_PAYWAY_NOCARD = '1'


/*********************** 管理中心-员工管理常量定义 *************************/
/**
 ** 管理中心 员工管理 离职状态 1离职 0在职
 * @author jyp
 */
export const TYPE_CLINICUSER_QUIT = 1
export const TYPE_CLINICUSER_JOB = 0

/**
 ** 管理中心 员工管理 员工账号时候可以登录  0 是   1否
 * @author jyp
 */
export const TYPE_PHYSICAL_CANLOGIN = 0
export const TYPE_PHYSICAL_NOTLOGIN = 1

/*********************** 管理中心-体检表常量定义 **************************/
/**
 ** 管理中心 体检表 离职状态 1男 2女
 * @author jyp
 */
export const TYPE_PHYSICAL_MAN = 1
export const TYPE_PHYSICAL_WOMAN = 2
// upTitle: ["上颌", 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27],
// downTitle: ["下颌",47,46,45,44,43,42,41,31,32,33,34,35,36,37],
// 循环数据
// newDataTtle: [17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27],
// downNewDataTtle: [47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37],
// readyData: ["正常","松动度","叩痛","扪痛","牙结石","附着丧失", "探诊出血","缺失及原因","龋","牙髓炎","根尖周炎","楔状缺损","牙外伤"],

/*********************** 工作台常量定义 **********************************/
/**
 ** 工作台 前台 待办 收费状态 0代收费 1已收费……
 * @author jyp
 */
export const TYPE_WORKBENCHCHARGE_SUATUSARR = ["待收费", "已收费","","退费","欠费","作废","审批待处理"]

export const STATUS_BILL_NO_CHARGE   = 0;
export const STATUS_BILL_CHARGED     = 1;
export const STATUS_BILL_REFUND      = 3;
export const STATUS_BILL_ARREARAGE   = 4;
export const STATUS_BILL_INVALID     = 5;
export const STATUS_BILL_APPROVALING = 6;
export const STATUS_BILL_PASSED      = 7;
export const STATUS_BILL_REJECT      = 8;

/*********************** 治疗相关 ***********************/
/**
 ** 就诊状态，0-预约 1-挂号 2-治疗中  3-治疗完成  4-转诊 5-待拍片 6-待收费 7-已收费 8-已拍片 9-已离开
* @author jyp
*/
export const STATUS_VISIT_APPOINTMENT = 0;
export const STATUS_VISIT_REGISTER = 1;
export const STATUS_VISIT_TREATMENTING = 2;
export const STATUS_VISIT_TREATMENT_END = 3;
export const STATUS_VISIT_REFERRAL = 4;
export const STATUS_VISIT_WAIT_PHOTOGRAPH = 5;
export const STATUS_VISIT_WAIT_CHARGED = 6;
export const STATUS_VISIT_CHARGED = 7;
export const STATUS_VISIT_PHOTOGRAPHED = 8;
export const STATUS_VISIT_LEAVE = 9;



// 工作台 性别 1男 2女 
export const TYPE_WORKBEN_SEXARR = ["未知","男", "女"]    

// 工作台 就诊列表 治疗状态
export const STATUS_VISIT_STATUSARR = ["预约", "待治疗", "治疗中","治疗完成","转入","拍片","代收费","已收费","","结束就诊","转出"];    

// 工作台 就诊列表 看病过程状态
export const STATUS_VISIT_PROCESSARR = ["预约","挂号","治疗中","治疗完成","转入","拍片","待收费","已收费","","已离开","转出"];

// 工作台 回退标识 不回退0    回退1

export const FLAG_BACK_NO = 0;	

export const FLAG_BACK_YES = 1;

 // 工作台 0 是初诊  1 复诊
export const STATUS_VISIT_FIRST  = 0;   
export const STATUS_VISIT_AGAIN  = 1; 

// 工作台 回访列表        
export const STATUS_CALLBACK_STATUSARR = ["未回访", "已回访", "回访未果", "取消回访"];
// <!--  ["未回访", "已回访", "回访待定" , "取消回访"]  -->
// <!-- 
// 0 未回访 编辑、取消回访、完成回访
// 1 回访中 编辑、取消回访、完成回访
// 2 已取消 新增回访
// 3 已回访 新增回访
// -->
/*********************** 用于html结构内使用的常量 **********************************/
const constants ={
    // 医生工作台判断用
    TYPE_DOCTORBENCH_ZERO         :0,
    // 收费状态
     STATUS_BILL_NO_CHARGE   :0,
     STATUS_BILL_CHARGED     :1,
     STATUS_BILL_REFUND      :3,
     STATUS_BILL_ARREARAGE   :4,
     STATUS_BILL_INVALID     :5,
     STATUS_BILL_APPROVALING :6,
     STATUS_BILL_PASSED      :7,
     STATUS_BILL_REJECT      :8,   
    //  回访状态
    STATUS_CALLBACK_NO       :0,		
    STATUS_CALLBACK_END      :1,		
    STATUS_CALLBACK_NORESULT :2,		
    STATUS_CALLBACK_CANCELED :3,  



} 
export default constants

/**
 * hzj
 */
//医生的岗位id
export const POSITION_ID_DOCTOR = 3; 


/*********************** 前台工作台-收费管理 *************************/
/**
 ** 收费管理 搜索框 收费状态 arr
 * @author jyp
 */
export const STATUS_BILL_SEACHARR = ["待收费","已收费","退费","欠费","作废","审批待处理","审批通过","审批驳回"];

export const STATUS_BILL_TABLEARR = ["待收费","已收费","","退费","欠费","作废","审批待处理","审批通过","审批驳回"];


/*********************** 医生工作台-病历管理 *************************/
/**
 ** 病历管理 搜索框 治疗阶段状态 arr
 * @author jyp
 */
export const STATUS_EMR_TABLEARR = ["预约","待治疗","治疗中","治疗完成","转入","拍片","预约","已收费","","已离开","转出"];

export const STATUS_EMR_FIRSTVISITAGAINARR = ["初诊","复诊"];

/*********************** 进销存-供应商配置 *************************/
/**
 ** 供应商 是否启用：  0 不启用 1启用
 * @author HZJ
 */
export const STATUS_PROVIDER_NOT_ENABLE = 0
export const STATUS_PROVIDER_ENABLE = 1

/*********************** 治疗相关-技加工所用常量定义 ***********************/
/**
 ** 技加工状态信息：0：未取，1：取回，2：已戴走
    * @author ZG
    */
export const STATUS_MACHINING_NO_TAKEN = 0;
export const STATUS_MACHINING_TAKEN = 1;
export const STATUS_MACHINING_WORN_AWAY = 2;
export const STATUS_MACHINING_STATUS_ARR = ['未取','取回','已带走'];


/************************收费，退费****************************************** */
export const TO_FIXED = 2; //保留一位小数


/****************************表格*********************************************** */
export const MESSAGE_TABLE_STYLE = {
    font: '14px',
    headerCellStyle: {
        background: 'rgba(228, 233, 255, 0.29)',
        color: '#000'
    },
    tooltipEffect: 'light'
}

export const PAGE_SIZE = 10; //每页默认显示数量

/*******************打印配置******************** */
export const PLM_INSTITUTION_ID = '15'; //普乐米
export const RY_INSTITUTION_ID = '12'; //融益口腔
export const CT_INSTITUTION_ID = '11'; //川投