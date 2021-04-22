/*
 * @Descripttion:
 * @version:
 * @Author: hzj
 * @Date: 2019-08-26 09:43:25
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-15 18:13:20
 */
import axios from './axios-set'
import qs from 'qs'


// login登录 4.0
export const userLogin = params => {
    return axios(`common/employee/login`, {
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// 判断当前机构是否为连锁
export const institutionIschain = params => axios.get(`common/institution/ischain`)

// 获取员工所属机构列表 内部用
export const getInstitutionList = params => axios.get(`common/institution/list/currentuser`)

// 获取员工所属机构列表 登录用
export const getLoginInstitutionList = params => axios.get(`common/institution/list/username/${params}`)

// mainPage-获取侧边栏菜单
export const getMenuList = data => axios.get('/common/function/list', data)
export const userPermission = params => axios('/common/function/list')

// mainPage-获取消息
export const getMsgLen = data => axios.get('/implicittask/noticemessage/count', data)
export const getBusinessMsg = params => axios.get(`/implicittask/noticemessage/business/page?page=${params.page}&pageSize=${params.pageSize}&status=${params.status}`)

export const getSystemMsg = params => axios.get(`implicittask/noticemessage/system/page?page=${params.page}&pageSize=${params.pageSize}&status=${params.status}`)
export const getMsgRead = data => axios.get('/implicittask/noticemessage/unread?status=1', data)

// mainPage-基本信息弹窗
export const getUserInfo = data => axios.get('common/currentmembership', data)

// mainPage-基本信息弹窗修改头像
export const upDataHeadImgFn = params => {
    console.log(params)
    return axios(`common/currentuser/icon`, {
        method: 'PUT',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// mainPage-基本信息弹窗修改密码
export const upPassWordFn = params => {
    return axios(`common/currentuser/password`, {
        method: 'PUT',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// mainPage-用户退出 4.0
export const userloguot = params => {
    return axios.post(`common/employee/logout`)
}

// 改变所有状态
export const changeAllSuatus = params => {
    return axios(`implicittask/noticemessage/list`, {
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// 改变单个状态
export const changeSuatus = params => {
  return axios(`/implicittask/noticemessage/${params}`, {
      method: 'put',
      timeout:10000
  })
}
// 跟据id获取诊所信息 4.0
export const getClinicInfo = params => axios.get(`/common/institution/${params}`)

// 获取标识诊所信息（不登录）4.0
export const getClinicBaseInfo = params => axios.get(`/common/institution/identifier/${params}`)


// -------------------------------管理中心--部门管理---------------------------------


// 管理中心 - 部门管理 - 科室管理 - 列表
export const listDepartment = params => axios('organization/department/list')
//管理中心 - 部门管理 - 科室管理 - 获取新增时的下拉列表
export const addDepartment = params => axios('organization/departmentdo')

//管理中心 - 岗位管理 - 科室管理 - 获取新增时的下拉列表
export const getPositiondo = params => axios('organization/positiondo')


// 管理中心 - 部门管理 - 科室管理 - 新增保存
export const saveOrUpdateDepartment = datas => {
    console.log(datas)
    return axios({
        method: 'post',
        url: "organization/department",
        data: datas
    })
}
// 管理中心 - 部门管理 - 科室管理 - 编辑保存
export const updateDepartment = datas => {
    console.log(datas)
    return axios({
        method: 'put',
        url: "organization/department",
        data: datas
    })
}
// 管理中心 - 部门管理 - 科室管理 - 编辑时获取数据
export const editDepartment = params => {
    return axios.get(`organization/departmentdo/${params.id}`)
}
// 管理中心 - 部门管理 - 科室管理 - 删除
export const deleteDepartment = params => {
    return axios.delete(`/organization/department/${params.id}`)
}
//管理中心 - 部门管理 - 岗位管理 - 列表
export const listPosition = params => axios('/organization/position/list')
//管理中心 - -部门管理- 岗位管理 - 保存
export const savePosition = datas => {
    return axios({
        method: 'post',
        url: "organization/position",
        data: datas
    })
}
//管理中心 - 部门管理 - 岗位管理 - 修改
export const editPosition = params => {
    return axios(`organization/positiondo/${params.id}`)
}
//管理中心 - 部门管理 - 岗位管理 - 更新
export const updatePosition = datas => {
    // console.log(datas)
    return axios({
        method: 'put',
        url: "organization/position",
        data: datas
    })
}
//管理中心 - 部门管理 - 岗位管理 - 删除
export const delPosition = params => {
    return axios.delete(`organization/position/${params.id}`)
}

// -------------------------------管理中心--角色管理---------------------------------


//管理中心 - 角色管理 - 新增角色
export const saveAddRole = datas => axios.post('organization/role', datas)
//管理中心 - 角色管理 - 获取角色
export const getEditData = params => {
    return axios.get(`organization/roledo/${params.id}`)
}
//管理中心 - 角色管理 - 编辑角色
export const upEditData = datas => axios.put('organization/role', datas)

//员工管理 - 角色管理 - 列表
export const listRole = params => axios.get('organization/role/list')
//员工管理 - 角色管理 - 删除
export const deleteRole = params => axios.delete(`organization/role/${params.id}`)
//员工管理 - 角色管理 - 增加
export const addRole = params => axios.get('organization/roledo')

// -------------------------------管理中心--角色管理---------------------------------

//管理中心 - 员工管理 - 进入
export const clinicUserLogin = params => {
    return axios.post(`/common/session?username=${params.username}&password=${params.password}&logonFree=${params.logonFree}`)
}
//管理中心 - 员工管理 - 获取带分页列表
export const getClinicUserPage = params => axios.get(`/organization/employee/page?page=${params.page}&pageSize=${params.pageSize}`)

//管理中心 - 员工管理 - 获取下拉列表
export const getAddClinicUserDownList = params => {
    return axios.get(`organization/employeedo`, {
        data: params
    })
}
//管理中心 - 员工管理 - 新增保存
export const saveClinicUser = datas => {
    return axios({
        method: 'post',
        url: "organization/employee",
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        data: datas
    })
}
//管理中心 - 员工管理 - 获取编辑数据
export const editClinicUser = params => {
    return axios.get(`organization/employeedo/${params.id}`)
}
//管理中心 - 员工管理 - 保存编辑数据
export const updateClinicUser = datas => {
    return axios({
        method: 'put',
        url: "organization/employee",
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        data: datas
    })
}
//管理中心 - 员工管理 - 重置
export const resetPassword = datas => {
    return axios({
        method: 'Put',
        url: `organization/employee/${datas}/password`,
    })
}
//管理中心 - 员工管理 - 删除
export const deleteClinicUser = params => {
    return axios.delete(`organization/employee/${params.id}`)
}
//管理中心 - 员工管理  - 筛选
export const listByFilter = params => {
    // console.log(data);
    return axios({
        method: 'get',
        url: "organization/employee/page/filter",
        params
    })
}

// -------------------------------管理中心--工作关系---------------------------------

//管理中心 - 工作关系 - 列表
export const listWorkingRelations = params => {
    return axios.get('organization/workingrelation/list')
}

//管理中心 - 工作关系 - 获取下拉数据
export const addWorkingRelation = params => {
    return axios.get('organization/workingrelationdo')
}
//管理中心 - 工作关系 - 保存
export const saveWorkingRelation = datas => {
    return axios({
        method: 'post',
        url: "organization/workingrelation",
        data: datas
    })
}
export const updataWorkingRelation = datas => {
    return axios({
        method: 'post',
        url: "organization/workingrelation",
        data: datas
    })
}
//管理中心 - 工作关系 - 编辑
export const editWorkingRelation = params => {
    return axios.get(`organization/workingrelationdo/${params.id}`)
}
//管理中心 - 工作关系 - 删除
export const deleteWorkingRelation = params => {
    return axios.delete(`organization/workingrelation/${params.id}`)
}

// -----------------------------------------------------------管理中心----end--------------------------------------------------------------------------------------------
// ------------------------------系统配置 - 基本信息---------------------------------
//系统配置 - 基本信息 - 页面数据
export const getCurrentClinic = params => axios.get('organization/currentinstitution')
//系统配置 - 基本信息 - 编辑
export const isIdentifier = params => {
    return axios.get(`organization/institution/uniqueidentifier/${params.identifier}`)
}
//系统配置 - 基本信息 - 更新
export const updateClinic = data => {
    console.log(data)
    return axios({
        method: 'put',
        url: 'organization/institution',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        data: data
    })
}
//系统配置 - 更改机构logo
export const updateInstitutionLogo = data => {
    return axios({
        method: 'put',
        url: 'organization/institution/logo',
        headers: {
            "content-type": 'multipart/from-data'
        },
        data: data
    })
}
// ------------------------------系统配置 - 业务权限---------------------------------
//系统配置 - 业务权限 - 获取权限列表
export const getDiscountList = params => axios.get(`organization/discountpvg/page?page=${params.page}&pageSize=${params.pageSize}`)

//系统配置 - 业务权限 - 获取默认权限
export const getDefaulteDiscountPvg = params => axios.get('organization/discountpvg/default')

//系统配置 - 业务权限 - 获取下拉列表
export const getDownList = params => {
    return axios.get(`organization/discountpvgdo`)
}
//系统配置 - 业务权限 - 保存新增权限
export const saveDiscountPvg = data => {
    console.log(data)
    return axios({
        method: 'post',
        url: 'organization/discountpvg',
        data: data
    })
}
//系统配置 - 业务权限 - 修改权限
export const updateDiscountPvg = data => {
    return axios({
        method: 'put',
        url: 'organization/discountpvg',
        data: data
    })
}
//系统配置 - 业务权限 - 删除
export const deleteDiscountPvg = params => axios.delete(`organization/discountpvg/${params.id}`)

// ------------------------------系统配置 - 收费方式配置---------------------------------

//系统配置 - 收费方式配置 - 列表
export const getPaywayList = params => axios.get(`systemcfg/payway/list`)
//系统配置 - 收费方式配置 - 获取新增里的下拉列表
export const getPaywayDownList = params => axios.get('systemcfg/paywaydo')
//系统配置 - 收费方式配置 - 删除
export const deletePayway = params => axios.delete(`systemcfg/payway/${params.id}`)
//系统配置 - 收费方式配置 - 获取编辑时的数据
export const getEeditPayway = params => axios.get(`systemcfg/paywaydo/${params.id}`)
//系统配置  - 收费方式 - 保存
export const saveOrUpdatePayway = datas => axios.post('systemcfg/payway',datas)
//系统配置  - 收费方式 - 修改
export const saveOrUpdatePaywayPut = datas => axios.put('systemcfg/payway',datas)

//系统配置 - 收费账户 - 列表
export const listAccount = params => axios.get('systemcfg/account/list')
//系统配置 - 收费账户 - 保存
export const saveOrUpdateAccount = datas => axios.post('systemcfg/account',datas)
//系统配置 - 收费账户 - 修改
export const saveOrUpdateAccountPut = datas => axios.put('systemcfg/account',datas)
//系统设置 - 收费账户 - 编辑时的数据
export const getEditAccount = params => axios.get(`systemcfg/accountdo/${params.id}`)
//系统配置 - 收费账户 - 删除
export const deleteAccount = params => axios.delete(`systemcfg/account/${params.id}`)


// 系统配置  - 回访管理 - 获取内容list
export const getContentlist = data => axios('systemcfg/callbackcfg/callbackcontent/list')
// 系统配置 - 回访管理 - 新增内容保存1
export const postCallbackContent = datas => axios.post('systemcfg/callbackcfg/callbackcontent', datas)
// 系统配置 - 回访管理 - 修改内容保存
export const putCallbackContent = datas => axios.put('systemcfg/callbackcfg/callbackcontent', datas)
// 系统配置 - 回访管理 - 获取结果list
export const getCallbackresultlist = datas => axios('systemcfg/callbackcfg/callbackresult/list')
// 系统配置 - 回访管理 - 新增結果保存
export const postCallbackresult = datas => axios.post('systemcfg/callbackcfg/callbackresult', datas)
// 系统配置 - 回访管理 - 修改結果保存
export const putCallbackresult = datas => axios.put('systemcfg/callbackcfg/callbackresult', datas)

// 系统配置 - 回访管理 - 获取计划list
export const getCallbackperiodlist = datas => axios('systemcfg/callbackcfg/callbackperiod/list')
// 系统配置 - 回访管理 - 新增結果计划
export const postCallbackperiod = data => axios.post('systemcfg/callbackcfg/callbackperiod', data)
// 系统配置 - 回访管理 - 修改結果计划
export const putCallbackperiod = datas => axios.put('systemcfg/callbackcfg/callbackperiod', datas)

// 系统配置 - 回访管理 - 刪除
export const deleteContentId = params => axios.delete(`systemcfg/callbackcfg/${params}`)
// 系统配置 - 回访管理 - 查询
export const callbackcfgdoId = params => axios.get(`systemcfg/callbackcfgdo/${params}`)


// 工作台 - 获取患者标签 - label 3.2
export const getWorkLabel = params => axios(`treatment/label/${params}`)

// 工作台 - 医生工作台 - 顶部 3.2
export const getWorkCount = params => axios('workbench/statistic/header')

// 工作台 - 医生和前台 工作台 - 全部 - 收费 3.2
export const getChargebillingAll = params => {
    let type = params.doctor || ''
    return axios(`/treatment/workbench/chargebill/page?type=${type}&status=all&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}
// 工作台 - 医生和前台 工作台 - 代办 - 收费
export const getChargebillingInfo = params => {
    let type = params.doctor || ''
    return axios(`treatment/workbench/chargebill/page?type=${type}&status=need-deal&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 列表 - 收费 全部 代办

export const getChargebillingList= params => {
    return axios(`treatment/workbench/chargebill/page?type=${params.type}&status=${params.status}&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 医生工作台 - 全部 - 病例
export const getAllDentalemr = params => {
    let type = params.doctor || ''
    return axios(`treatment/workbench/emr/page?type=${type}&firststatus=all&&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 医生工作台 - 代办 - 病例
export const getDentalemr = params => {
    let type = params.doctor || ''
    return axios(`treatment/workbench/emr/page?type=${type}&firststatus=need-deal&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 医生工作台 - 全部- 代办 - 病例
export const getEmrList = params => {
    return axios(`treatment/workbench/emr/page?type=${params.type}&firststatus=${params.status}&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}


// 工作台 -  医生和前台工作台 - 全部 - 回访
//0代表待办null代表全部
export const getDentalfeedbackInfoAll = params => {
    let type = params.doctor || ''
    return axios(`/marketing/callback/page/filter?type=${type}&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}
// 工作台 - 医生和前台工作台 - 代办 - 回访
export const getDentalfeedbackInfo = params => {
    let type = params.doctor || ''
    return axios(`/marketing/callback/page/filter?type=${type}&status=0&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}
// 工作台 - 医生和前台工作台 - 代办- 全部 - 回访  4合1
// export const getCallbackList = params => {
//     return axios(`/marketing/callback/page/filter?type=${params.type}&status=${params.status}&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
// }
export const getCallbackList = params => axios.get(`marketing/callback/page/filter`,{params})

// 工作台 - 医生工作台和前台工作台 -全部- 就诊
export const getRecepAppointmentAllPatient = params => {
    let type = params.doctor || ''
    return axios(`treatment/visitrecord/page?type=${type}&firststatus=all&status="all"&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}
// 工作台 - 医生工作台 - 代办 - 就诊 3.2
export const getDentalPatientInfo = params => {
    let type = params.doctor || ''
    return axios(`treatment/visitrecord/page?type=${type}&firststatus=need-deal&status=need-deal-visit&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 前台工作台 - 待办 - 就诊
export const getRecepAppointmentPatient = params => {
    let type = params.doctor || ''
    return axios(`treatment/visitrecord/page?type=${type}&firststatus=need-deal&status=""&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 医生工作台 - 全部 - 就诊  弃用
export const getDentalAll = params => {
    let type = params.doctor || ''
    return axios(`treatment/visitrecord/page?type=${type}&firststatus=need-deal&status=need-deal-visit&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
}

// 工作台 - 就诊 -接口
export const getVisitData = params => {
    console.log(params);
    return axios(`treatment/visitrecord/page/filter?type=${params.type}&firststatus=${params.firststatus}&status=${params.status}&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime} 00:00:00&endTime=${params.endTime} 00:00:00`)
}





// 工作台 - 前台工作台 - 全部 - 预约
export const getAllAppointment = params => axios(`treatment/appointment/page/receptionistbench/all?status=all&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
// 工作台 - 前台工作台 - 代办 - 预约
export const getAppointment = params => axios(`treatment/appointment/page/receptionistbench/pending?status=need-deal&page=${params.page}&pageSize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)

// 工作台 - 前台工作台 - 全部或代办 - 预约
export const getAppointmentData = params => axios(`treatment/appointment/page/receptionistbench/${params.type}?status=${params.type}&page=${params.page}&pageSize=${params.pageSize}&begDate=${params.startTime} 00:00:00&endDate=${params.endTime} 00:00:00`)

// 工作台 - 接待员工作台 - 获取患者信息
export const getAllpatient = params => axios(`treatment/patient/page`)
// 工作台 - 医生工作台 - button 病例管理
export const getCase = data => axios('treatment/workbench/emr/page/case', { params: data })

// 工作台 - 前台工作台 -  获取医生列表
export const getCaseDoctor = data => axios('organization/employee/doctor/list')

// 工作台 - 接待员工作台 - button 收费管理 3.2
export const getChargebilling = data => axios('treatment/workbench/manager/chargebill/page', { params: data })

// 工作台 - 医生工作台 - 代办 - 就诊 - 下方按钮 选项 更改治疗状态
export const putDentalPatientInfo = data => {
    return axios({
        method: 'put',
        url: 'treatment/visitrecord/status',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: data
    })
}

//工作台 - 医生工作台  详情  处置记录  编辑
export const editdisposalrecord = params => axios(`fg/disposalrecord/${params.cilincId}`)
//工作台 - 医生工作台  详情  处置记录  保存
export const putdisposalrecord = data => {
    return axios({
        method: 'put',
        url: '/fg/disposalrecord',
        headers: {
            "Content-Type": 'multipart/from-data'
        },
        data: data
    })
}
//工作台 - 医生工作台  详情  处置记录  删除
export const deletedisposalrecord = params => {
    return axios.delete(`fg/disposalrecord/${params.id}`)
}
//工作台 - 医生工作台  详情  处置记录  列表
export const listdisposalrecord = params => axios(`fg/disposalrecord?patientId=${params.patientId}`)


// 工作台 - 就诊 作废挂号
export const delatePatient = params => axios.delete(`treatment/registration/${params}`)

// 工作台 - 回访 取消回访  3.2,4.1
export const delateAcallback = (id, status,result) =>{
    return axios({
        method: 'put',
        url: `marketing/callback/${id}/status/${status}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            result: result
        }
    })
}

// 工作台 - 前台工作台 - 代办 - 取消預約 3.2
export const deleteAppointment = params => axios.delete(`treatment/appointment/${params}`)
// 工作台 - 前台工作台 - 代办 - 取消收费 3.2
export const putchargebillinginfo = id => axios.delete(`treatment/chargebill/${id}`)

//工作台 - 医生工作台 -新增挂号获取下拉列表3.2
export const getRegisterInfo = params => axios(`treatment/registrationdo`)
//患者详情挂号
export const getRegisterPatientIdInfo = patientId => axios(`treatment/registrationdo/patient/${patientId}`)
//工作台更多挂号
export const registrationdoIdInfo = avTrickId => axios(`treatment/registrationdo/${avTrickId}/patient`)
//工作台 - 医生工作台 -新增挂号3.2
export const addRegister = data => axios.post(`treatment/registration`, data)

//工作台 - 医生工作台 -修改挂号3.2
export const putRegisterupdata = data => axios.put(`treatment/registration`, data)

//工作台 - 医生工作台 -修改挂号获取下拉
export const getEditRegisterInfo = params => axios(`treatment/registrationdo/${params.id}`)

//工作台 - 前台 -新增预约下拉列表
export const getBespeakInfo = params => axios(`patient/patientcenter3//patientAppointRelevant`)

//工作台 - 前台 -获取预约时间
export const getBespeakTime = params => axios(`patient/patientcenter3/patientAppointTineView?doctorId=${params}`)

//工作台 - 前台 -保存预约
// export const addBespeak = data => axios.post(`fg/patientAppoint`, data)

//进销存  - 基础信息 - 品牌 新增内容保存
export const saveDrugBrand = data => {
    return axios({
        method: 'post',
        url: `inventory/basecfg/drugbrand`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 基础信息 - 品牌 修改内容保存
export const editDrugBrand = data => {
    return axios({
        method: 'put',
        url: `inventory/basecfg/drugbrand`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 基础信息 -  品牌删除
export const deleteDrugBrand = id => axios.delete(`inventory/basecfg/drugbrand/${id}`)


//进销存  - 基础信息 - 类别 新增内容保存
export const saveDrugType = data => {
    return axios({
        method: 'post',
        url: `inventory/basecfg/drugtype`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 基础信息 - 类别 修改内容保存
export const editDrugType = data => {
    return axios({
        method: 'put',
        url: `inventory/basecfg/drugtype`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 基础信息 -  类别删除
export const deleteDrugType = id => axios.delete(`inventory/basecfg/drugtype/${id}`)


//进销存  - 基础信息 - 单位 新增
export const saveDrugUnit = data => {
    return axios({
        method: 'post',
        url: `inventory/basecfg/drugunitconfig`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 基础信息 - 单位修改
export const updateDrugUnit = data => {
    return axios({
        method: 'put',
        url: `inventory/basecfg/drugunitconfig`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 基础信息 -  单位删除
export const deleteDrugUnit = id => axios.delete(`inventory/basecfg/drugunitconfig/${id}`)

//进销存  - 基础信息 -  获取信息
export const listBasecfg = params => axios.get(`inventory/inventorybasecfgdo`)

//进销存  - 供应商配置 -新增内容保存
export const saveProvider = data => {
    return axios({
        method: 'post',
        url: `inventory/providercfg`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 供应商配置 -修改内容保存
export const updateProvider = data => {
    return axios({
        method: 'put',
        url: `inventory/providercfg`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

export const saveOrUpdateProvider = data => {
    return axios({
        method: 'put',
        url: `inventory/providercfg`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//进销存  - 供应商配置 - 删除
export const deleteProvider = id => axios.delete(`inventory/providercfg/${id}`)

//进销存  - 供应商配置 -获取
export const getProvider = id => axios.get(`inventory/providercfg/${id}`)

//进销存  - 供应商配置 -获取列表
export const listProvider = params => axios.get(`inventory/providercfg/page?page=${params.page}&pageSize=${params.pageSize}&suppliersName=${params.suppliersName}`)

//进销存  - 物品配置 -获取下拉框数据
export const getDrugvo = id => axios.get(`inventory/drugdo`)

//进销存 - 物品配置 - 入库价 -获取列表
export const listImportPrice = params => axios.get(`systemcfg/discountpvg/page?page=${params.page}&pageSize=${params.pageSize}`)

//进销存 - 物品配置  - 出库价 -获取列表
export const listExportPrice = params => axios.get(`systemcfg/discountpvg/page?page=${params.page}&pageSize=${params.pageSize}`)

//进销存  - 物品配置 -新增内容保存
export const saveDrug = datas => {
    return axios({
        method: 'post',
        url: `inventory/drug`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: datas
    })
}
//进销存  - 物品配置 -修改内容保存
export const updateDrug = datas => {
    return axios({
        method: 'put',
        url: `inventory/drug`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: datas
    })
}

//进销存  - 物品配置 - 删除
export const deleteDrug = id => axios.delete(`inventory/drug/${id}`)

//进销存  - 物品配置 -获取修改回填数据
export const getDrugById = params => axios.get(`inventory/drugvo/${params.id}`)

//进销存  - 物品配置 -获取列表
export const listDrug = params => axios.get(`inventory/drug/page`,{params})

//进销存  -获取列表 - 全部药品
export const inlistDrug = params => axios.get(`inventory/drug/page`,{params})

//进销存   -获取列表 - 出库相关，需要库房id
export const outlistDrug = params => axios.get(`inventory/inventory/page/filter`,{params})

//进销存   - 物品详情，需要库房id
export const getDrugDetByWareHouseId = params => axios.get(`inventory/inventory/drug/${params.drugId}/${params.wareHouseId}`)

//进销存  - 物品入库 -获取供应商列表 - 筛选下拉数据
export const getImportinventoryfiltervo = () => {
    return axios({
        method: 'get',
        url: `inventory/importinventoryfilterdo`,
    })
}

//进销存  - 物品入库 -获取列表
export const listImportInventory = params => axios.get(`inventory/importInventory/page/filter`,{params})

//进销存  - 物品入库 -获取详情列表 - 通过id
export const getImportinventorydo = id => {
    return axios({
        method: 'get',
        url: `inventory/importinventorydo/${id}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })
}

//进销存  - 物品确认入库 -获取列表
export const saveImportInventoryConfirm = datas => {
    return axios({
        method: 'post',
        url: `inventory/importinventory/confirm`,
        data: datas
    })
}

//进销存  - 物品入库 -新增内容保存
export const saveImportInventory = datas => {
    return axios({
        method: 'post',
        url: `inventory/importinventory`,
        data: datas
    })
}
//进销存  - 物品入库 -修改内容保存
export const updateImportInventory = datas => {
    return axios({
        method: 'put',
        url: `inventory/importinventory`,
        data: datas
    })
}
//进销存 - 物品入库 -删除
export const deleteImportInventory = id => axios.delete(`inventory/importInventory/${id}`)

//进销存  - 物品入库 -再次入库
export const saveAgainImport = id => {
    return axios({
        method: 'get',
        url: `inventory/importInventory/again/${id}`,
    })
}

//进销存  - 获取库管员
export const listStorekeeper = () => {
    return axios({
        method: 'get',
        url: `organization/employee/storekeeper/list`,
    })
}

//进销存  - 获取所有员工
export const listClinicUser = () => {
    return axios({
        method: 'get',
        url: `organization/employee/list`,
    })
}

//进销存  - 物品入库 -获取物品
export const getImportInventoryDrug = id => {
    return axios({
        method: 'get',
        url: `inventory/inventory/drug/${id}`,
    })
}

//进销存  - 物品入库 -获取退货信息
export const getReturnrecord = id => {
    return axios({
        method: 'get',
        url: `inventory/returnrecord/importinventory/${id}`,
    })
}

//进销存 - 物品入库  - 导出列表
export const exportImportInventory = (params) => {
    return axios({
        method: 'get',
        url: `inventory/importInventory/upload?importTimeStart=${params.importTimeStart}&importTimeEnd=${params.importTimeEnd}&collarUseId=${params.collarUseId}
        &drugProviderId=${params.drugProviderId}&serialNumber=${params.serialNumber}`,
        responseType: 'arraybuffer',
    })
}

//进销存  - 物品出库  - 筛选下拉数据
export const getExportinventoryfiltervo = () => {
    return axios({
        method: 'get',
        url: `inventory/exportinventoryfilterdo`,
    })
}

//进销存  - 物品出库 -获取列表
export const listExportInventory = params => axios.get(`inventory/exportinventory/page/filter`,{params})
//进销存  - 物品确认出库 -保存
export const saveExportInventoryConfirm = params => axios.post(`inventory/exportinventory/confirm`,{params})
//进销存  - 物品出库 -删除
export const delExportInventory = id => axios.delete(`inventory/exportinventory/${id}`)

//进销存  - 物品出库 -获取详情列表 - 通过id
export const getExportInventoryDetailById = id => axios.get(`inventory/exportinventorydo/${id}`)

//进销存  - 物品出库 -获取详情列表 - 通过id,status
export const getExportDetailByIdAndStatus = params => axios.get(`inventory/exportinventory/${params.id}/${params.status}`)

//进销存  - 物品出库 - 确认出库 获取批号
export const getDrugBatchlineitem = params => axios.get(`inventory/drugbatchlineitem/${params.drugId}/${params.wareHouseId}`)

//进销存 - 物品出库  - 导出列表
export const exportExportInventory = (params) => {
    return axios({
        method: 'get',
        url: `inventory/exportexcel?startTime=${params.startTime}&endTime=${params.endTime}&collarUseId=${params.collarUseId}
        &storekeeperId=${params.storekeeperId}&serialNumber=${params.serialNumber}`,
        responseType: 'arraybuffer',
    })
}

//进销存  - 物品出库 -新增内容保存
export const saveExportInventory = datas => {
    return axios({
        method: 'post',
        url: `inventory/exportinventory`,
        data: datas
    })
}


//进销存  - 物品出库 -确认出库
export const saveConfirmExport = datas => {
    return axios({
        method: 'post',
        url: `inventory/exportinventory/confirm`,
        data: datas
    })
}

//进销存  - 物品退货 -新增内容保存
export const saveReturnRecord = datas => {
    return axios({
        method: 'post',
        url: `inventory/returnrecord`,
        data: datas
    })
}

//进销存  - 物品退货 -获取列表
export const listReturnInventory = params => axios.get(`inventory/returnrecord/page?page=${params.page}&pageSize=${params.pageSize}
&startTime=${params.startTime}&endTime=${params.endTime}&collarUseId=${params.collarUseId}
&storekeeperId=${params.storekeeperId}&number=${params.number}`)

//进销存  - 物品退货 -获取详情列表 - 通过id
export const listReturnInventoryDetailById = id => {
    return axios({
        method: 'get',
        url: `inventory/returnrecord/${id}`,
    })
}

//进销存  - 当前库存 -获取列表
export const listCurrentInventory = params => axios.get(`inventory/inventory/page/filter`,{params})

//进销存  - 当前库存 -获取列表详情 - 通过id
export const listCurrentInventoryDetailById = params => axios.get(`inventory/inventory/${params.id}`)

//进销存  - 当前库存 -修改预售价
export const saveSalePrice = params => {
    return axios({
        method: 'put',
        url: `inventory/inventory/${params.id}/saleprice/${params.salePrice}`,
    })
}

//进销存  - 盘点管理 -获取列表
export const listCheckInventory = params => axios.get(`checkinventory/checkinventory/page?page=${params.page}&pageSize=${params.pageSize}
&startTime=${params.startTime}&endTime=${params.endTime}&userId=${params.userId}&number=${params.number}&status=${params.status}`)

//进销存  - 当前库存 -获取列表详情 - 通过id
export const listCheckInventoryDetailById = id => axios.get(`checkinventory/checkinventoryitem/${id}`)

//进销存  - 盘点管理 -新增内容保存
export const saveCheckInventory = datas => {
    return axios({
        method: 'post',
        url: `checkinventory/checkInventory`,
        data: datas
    })
}

//进销存  - 盘点管理 -修改内容保存
export const saveUpdateCheckInventory = datas => {
    return axios({
        method: 'put',
        url: `checkinventory/checkInventory`,
        data: datas
    })
}

// 进销存 - 盘点表 - 确认盘点
export const checkInventory = id => axios.put(`checkinventory/checkinventory/${id}`)

// 进销存 - 盘点表 - 作废
export const cancelInventory = id => axios.put(`checkinventory/checkInventory/${id}/3`)

//进销存 - 盘点表  - 导出列表
export const exportExportCheckInventory = (params) => {
    return axios({
        method: 'get',
        url: `checkinventory/download/checkInventory?startTime=${params.startTime}&endTime=${params.endTime}&userId=${params.userId}&number=${params.number}&status=${params.status}`,
        responseType: 'arraybuffer',
    })
}

//进销存  - 获取物品大类
export const listGoodsType = () => axios.get(`inventory/drugtype`)

//进销存   -获取导入模板
export const getDownloadModel = (params) => {
    let url = '';
    if (params.model === 'importInventory') {
        url = 'inventory/importdownload';
    } else if (params.model === 'exportInventory') {
        url = 'inventory/exportdownload';
    }
    return axios({
        method: 'get',
        url: url,
        responseType: 'arraybuffer',
    })
}

//进销存   - 导入excel
export const uploadInventoryExcel = datas => {
    let url = '';
    if (datas.get('model') === 'importInventory') {
        //导入入库单
        url = 'inventory/importinventoryitem/fileimport';
    } else if (datas.get('model') === 'exportInventory') {
        //导入出库单
        url = 'inventory/exportupload';
    } else if (datas.get('model') === 'drugpurchase') {
        //导入采购单
        url = 'inventory/drugpurchase/fileimport';
    }
    return axios({
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'multipart/from-data'
        },
        data: datas
    })
}

/***************进销存4.1************8********** */

//进销存 - 库房回填数据
export const getWarehousedo = id => axios.get(`inventory/warehousedo/${id}`)

//进销存 - 库房列表
export const listWareHouse = params => {
    return axios.get(`inventory/warehouse/page/filter`, { params })
}

// 进销存 - 获取所有库房
export const getWareHouseAll = () => axios.get(`inventory/warehouse`)

//进销存  - 新增库房
export const saveWareHouse = datas => {
    return axios({
        method: 'post',
        url: `inventory/warehouse`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: datas
    })
}

// 进销存 - 删除库房
export const deleteWareHouse = id => axios.delete(`inventory/warehouse/${id}`)

//进销存  - 修改库房
export const updateWareHouse = datas => {
    return axios({
        method: 'put',
        url: `inventory/warehouse`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: datas
    })
}

//进销存 - 批号列表
export const listDrugBatch = params => {
    return axios.get(`inventory/drugbatchlineitem/page/filter`, { params })
}

//进销存 - 临期预警列表
export const listExpireWarning = params => {
    return axios.get(`inventory/expirewarningdto/page/filter`, { params })
}

//进销存 - 低量预警列表
export const listLowQuantityWarning = params => {
    return axios.get(`inventory/lowquantitywarningdto/page/filter`, { params })
}

//进销存 - 封装低量预警和到期预警条件查询DO
export const getinventorywarningDO = () => {
    return axios.get(`inventory/inventorywarningDO`, {})
}

//进销存  - 新增采购
export const saveDrugpurchase = datas => {
    return axios({
        method: 'post',
        url: `inventory/drugpurchase`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: datas
    })
}

//进销存  - 修改采购
export const updateDrugpurchase = datas => {
    return axios({
        method: 'put',
        url: `inventory/drugpurchase`,
        data: datas
    })
}

//进销存  - 撤回采购审批
export const cancelDrugpurchase = id => {
    return axios({
        method: 'put',
        url: `inventory/drugpurchase/${id}`,
    })
}

//进销存  - 撤回采购审批
export const delDrugpurchase = id => {
    return axios({
        method: 'delete',
        url: `inventory/drugpurchase/${id}`,
    })
}

//进销存  - 再次采购。如果设置了审批，则进入审批流
export const againDrugpurchase = id => {
    return axios({
        method: 'post',
        url: `inventory/drugpurchase/${id}/again`,
    })
}

//进销存  - 采购 修改时回显do
export const getDrugpurchasedo = drugPurchaseId => {
    return axios.get(`inventory/drugpurchasedo/${drugPurchaseId}`)
}

//进销存  - 获取采购 列表
export const getDrugpurchaseList = params => axios.get('inventory/drugpurchase/page/filter',{params})
//进销存  - 采购 明细
export const getDrugpurchaseItem = drugPurchaseId => {
    return axios.get(`inventory/drugpurchasedo/${drugPurchaseId}/item`)
}
//进销存  - 采购 查询条件
export const getDrugpurchasefilterdo = drugPurchaseId => {
    return axios.get(`inventory/drugpurchasefilterdo`)
}

//进销存  - 获取入库单详情
export const getImportInventoryObj = params => axios.get(`inventory/importInventory/${params.id}/${params.status}`)

//进销存  - 获取退货单 列表
export const getReturnRecordList = params => axios.get('inventory/returnrecord/page/filter',{params})
//进销存  - 删除退货单
export const delReturnRecord = id => axios.delete(`inventory/returnrecord/${id}`)
//进销存  - 获取退货单  - 回填数据
export const getReturnRecordById = id => axios.get(`inventory/returnrecorddo/${id}/update`)
//进销存  - 获取退货单  - 详情数据
export const getReturnRecorddetailById = id => axios.get(`inventory/returnrecord/${id}/detail`)
//进销存  - 获取退货单  - 查询条件
export const getReturnrecordfilterdo = id => axios.get(`inventory/returnrecordfilterdo`)

//进销存  - 获取调拨单 列表
export const getAllocationList = params => axios.get('inventory/drugallocation/page/filter',{params})
//进销存  - 获取调拨单 列表
export const getAllocationById = id => axios.delete(`inventory/returnrecord/${id}`)

//进销存  - 获取领用 列表
export const getTakeoutList = params => axios.get('inventory/takeout/page/filter',{params})
//进销存  - 获取领用单  - 回填数据
export const getTakeoutById = id => axios.get(`inventory/takeoutdo/${id}/update`)
//进销存  - 获取领用单  - 查询条件
export const getTakeoutfilterdo = id => axios.get(`inventory/takeoutfilterdo`)
//进销存  - 删除领用单
export const delTakeout = id => axios.delete(`inventory/takeout/${id}`)
//进销存  - 新增，修改领用单
export const saveTakeout = datas => {
    return axios({
        method: 'post',
        url: `inventory/takeout`,
        data: datas
    })
}

//进销存  - 获取退库 列表
export const getReturnInventoryList = params => axios.get('inventory/drugreturninventory/page/filter',{params})
//进销存  - 获取退库单  - 回填数据
export const getReturnInventoryById = id => axios.get(`inventory/returninventorydo/${id}/update`)
//进销存  - 获取退库单  - 查询条件
export const getReturnInventoryfilterdo = id => axios.get(`inventory/returninventoryfilterdo`)
//进销存  - 删除退库单
export const delReturnInventory = id => axios.delete(`inventory/drugreturninventory/${id}`)
//进销存  - 新增，修改退库单
export const saveReturnInventory = datas => {
    return axios({
        method: 'post',
        url: `inventory/drugreturninventory`,
        data: datas
    })
}

/**************进销存4.1END******************** */

//客户咨询 - 获取今日和全部咨询列表
export const listCustomer = params => {
    return axios.get(`marketing/customer/page/filter`, { params: params })
}
//客户咨询 - 获取下拉别表
export const getCustomerDownList = data => {
    return axios.get(`marketing/customerfilterdo`)
}
export const listCustomerasd = data => {
    // return axios.get(`marketing/customer/page?status=${data.status}`, data)
}
export const listCustomerdoor = data => {
    // return axios.get(`marketing/customer/page?todayStatus=${data.todayStatus}`)
}
export const listCustomerdoores = data => {
    // return axios.get(`marketing/customer/page?todayStatus=${data.todayStatus}&status=${data.status}`, data)
}
export const listCustomered = data => {
    // return axios.get(`marketing/customer/page/filter)`, data)

}
//客户咨询 - 查询 咨询师
export const queryClinicUser = data => {
    // console.log(data)
    // return axios.get(`marketing/customer/queryClinicUserByPosition?positionId=${data.positionId}`, data)
}
//客户咨询 查询 - 咨询项目
export const queryProject = data => {
    // return axios.get('marketing/customer/queryProjectByPosition', data)
}
//客户咨询 删除
export const deteClinicUser = data => {
    // console.log(data)
    return axios.delete(`marketing/customer/${data.id}`)
}
//客户咨询 - 详情
export const particularsClinicUser = data => axios.get(`marketing/customerdo/${data}`)
//客户咨询  增加
export const addClinicUsered = data => {
    return axios({
        method: 'post',
        url: `marketing/customer`,
        data: data
    })
}
//客户咨询 编辑
export const editClinicUsered = data => {
    return axios({
        method: 'put',
        url: `marketing/customer`,
        data: data
    })
}

//营销管理  - 预存款 - 预存卡 - 新增
export const savePredepositcard = data => {
    return axios({
        method: 'post',
        url: 'marketing/predepositcard',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 预存卡 - 修改
export const updatePredepositcard = data => {
    return axios({
        method: 'put',
        url: 'marketing/predepositcard',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 预存卡 - 密码 - 修改
export const updatePredeCardPassWord = data => {
    return axios({
        method: 'put',
        url: 'marketing/predepositcard/password',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 预存卡 - 充值
export const savePredepositcardRecharge = data => {
    return axios({
        method: 'post',
        url: 'marketing/predepositconsumeflow/recharge',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 预存卡 - 新增预存款时候填充条件
export const getPredepositcarddo = () => axios.get(`marketing/predepositcarddo`)

//营销管理  - 预存款 - 预存卡 - 预存款充值时填充条件
export const getPredepositcarderchargedo = (id) => axios.get(`marketing/predepositcarderchargedo/${id}`)

//营销管理  - 预存款 - 预存卡列表
export const predepositcardList = data => axios.get(`marketing/predepositcard/page/filter?page=${data.page}&pageSize=${data.pageSize}&startTime=${data.startTime}&endTime=${data.endTime}
&patientName=${data.patientName}&number=${data.number}&userId=${data.userId}`)
//营销管理  - 预存款 - 预存卡详情
export const predepositcardDeditList = id => axios.get(`marketing/predepositcard/${id}`)

//营销管理  - 预存款 - 预存卡 - 充值记录
export const predepositconsumeflowList = id => axios.get(`marketing/predepositconsumeflow/predepositcard/${id}`)


//营销管理  - 预存款 - 折扣卡 - 新增
export const saveDiscountcard = data => {
    return axios({
        method: 'post',
        url: 'marketing/discountcard',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 折扣卡 - 修改
export const updateDiscountcard = data => {
    return axios({
        method: 'put',
        url: 'marketing/discountcard',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 折扣卡 - 密码 - 修改
export const updateDiscountcardPassWord = data => {
    return axios({
        method: 'put',
        url: 'marketing/discountcard/password',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

//营销管理  - 预存款 - 折扣卡 - 充值
export const saveDiscountcardRecharge = data => {
    return axios({
        method: 'post',
        url: 'marketing/discountconsumeflow/recharge',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}


//营销管理  - 预存款 - 折扣卡 - 新增时候填充条件
export const getDiscountcarddo = () => axios.get(`marketing/discountcarddo`)

//营销管理  - 预存款 - 折扣卡 - 新增折扣卡充值时填充条件
export const getDiscountcardrechargedo = (id) => axios.get(`marketing/discountcardrechargedo/${id}`)

//营销管理  - 预存款 - 折扣卡列表
export const discountcardList = data => axios.get(`marketing/discountcard/page/filter?page=${data.page}&pageSize=${data.pageSize}&startTime=${data.startTime}&endTime=${data.endTime}
&patientName=${data.patientName}&number=${data.number}&userId=${data.userId}`)
//营销管理  - 预存款 - 折扣卡详情
export const discountcardDeditList = id => axios.get(`marketing/discountcard/${id}`)

//营销管理  - 预存款 - 折扣卡 - 充值记录
export const discountconsumeflowList = id => axios.get(`marketing/discountconsumeflow/discountcard/${id}`)


//修改密码
export const resetrechargecardpassword = data => {
    return axios({
        method: 'post',
        url: `marketing/resetrechargecardpassword`,
        headers: {
            'Content-Type': 'multipart/from-data'
        },
        data: data
    })
}
//保存
export const saverechargecard = data => {
    return axios({
        method: 'post',
        url: `marketing/saverechargecard`,
        headers: {
            'Content-Type': 'multipart/from-data'
        },
        data: data
    })
}
//编辑
export const updaterechargecard = data => {
    return axios({
        method: 'put',
        url: `marketing/updaterechargecard`,
        headers: {
            'Content-Type': 'multipart/from-data'
        },
        data: data
    })
}
//保存
export const updaterechargerecord = data => {
    return axios({
        method: 'put',
        url: `marketing/updaterechargerecord`,
        headers: {
            'Content-Type': 'multipart/from-data'
        },
        data: data
    })
}
//充值活动
export const activeylist = data => axios.get(`/marketing/activeylist/${data.id}`)
//充值方式
export const paywaylist = data => axios.get(`/marketing/paywaylist`)
//充值  保存
export const saverechargerecord = data => {
    return axios({
        method: 'post',
        url: `marketing/saverechargerecord`,
        headers: {
            'Content-Type': 'multipart/from-data'
        },
        data: data
    })

}
//充值记录 列表
export const rechargerecordlist = data => axios.get(`marketing/rechargerecordlist`, data)

export const rechargerecordlists = data => axios.get(`marketing/rechargerecordlist?beginHandleDate=${data.beginHandleDate}&endHandleDate=${data.endHandleDate}&patientName=${data.patientName}&creatorName=${data.creatorName}&telephone=${data.telephone}&cardNo=${data.cardNo}`, data)

export const rechargerecordedit = data => axios.get(`marketing/rechargerecordedit/${data.id}`, data)
//新办卡的列表
export const patientlist = data => axios.get(`marketing/patientlist?patientName=${data.patientName}`, data)
// 财务中心-报表 /api/marketing/saverechargerecord

export const getCreateById = data => axios.get('finance/putinventoryrecordvo', data)
// 明细
export const getRecord = data => axios.get('finance/putinventoryrecorditem/page/filter', data)
export const getDrugs = data => axios.get('finance/putinventoryrecorditemvo', data)

// 出库报表
// 汇总
export const getOutRecord = data => axios.get('finance/getinventoryrecord/page/filter', data)
// 明细
export const getOutSummary = data => axios.get('finance/getinventoryrecordvo', data)



// 退款管理 - 退款管理
export const getDrug = data => axios(`finance/refundslip/drug?page=${data.page}&pageSzie=${data.pageSize}&startTime=${data.startTime}&endTime=${data.endTime}&status=${data.status}`)
// 退款管理 - 详情
export const getDetail = data => axios(`finance/refundslip/drug/detail?id=${data}`)
// 退款管理 - 审批通过
export const putDrug = data => axios.put(`finance/refundslip/drug`, data)

// 退款管理 - 收款退货
export const getCharge = data => axios(`finance/refundslip/charge?page=${data.page}&pageSzie=${data.pageSize}&startTime=${data.startTime}&endTime=${data.endTime}&billingStatus=${data.status}`)
// 退款管理 - 详情
export const getDetailOne = data => axios(`finance/refundslip/charge/detail?id=${data}`)
// 退款管理 - 审批通过
export const putDrugs = data => axios.put(`finance/refundslip/charge`, data)

// 财务中心  - 财务报表  - 出库报表 - 汇总
export const getAllRecord = data => axios(`finance/report/getinventory/record`, { params: data })
export const getTwoUser = data => axios(`finance/report/users`)
// 财务中心  - 财务报表  - 出库报表 - 详情 finance/report/drugs
export const getAllRecordItem = data => axios(`finance/report/getinventory/item`, { params: data })

// 财务中心  - 财务报表  - 出库报表 - 物品
export const getAllRecordItemUser = data => axios(`finance/report/drugs`)

// 财务中心 - 财务报表 - 余额 finance/report/checkinventory
export const getAllInventory = data => axios(`finance/report/inventory`, { params: data })

// 财务中心 - 财务报表 - 盘点
export const getAllcheckinventory = data => axios(`finance/report/checkinventory`, { params: data })


/***********************营销管理-回访 **************************/

export const getCallbacklist = data => axios.get(`marketing/callback/page?page=${data.page}&pageSize=${data.pageSize}`)
// 营销管理 - 回访中心 - 获取回访列表
export const getCallbackfilter = params => axios.get(`marketing/callback/page/filter`, { params: params })
// 营销管理 - 回访中心 - 搜索数据
export const getCallbackfiltervo = data => axios(`marketing/callbackfilterdo`)
// 营销管理 - 回访中心 - 弹框下拉数据
export const getCallbackvo = data => axios(`marketing/callbackdo`)
// 营销管理 - 回访中心-获取患者数据
export const getPatientfilter = data => axios.get(`treatment//patient/list/visitstatus?patientName=${data}`)
// 营销管理 - 回访中心 - 弹框保存
// export const postAddCallback = data => axios.post(`marketing/callback`, qs.stringify(data))
// 营销管理 - 回访中心 - 保存单次新增回访
export const postAddCallback = datas => {
    return axios({
        method: 'post',
        url: "marketing/callback",
        data: datas
    })
}
// 营销管理 - 回访中心 - 保存定制新增回访
// export const postAddCallbackFormData = datas => {
//     return axios({
//         method: 'post',
//         url: "marketing/callback",
//         data: datas
//     })
// }
// 营销管理 - 回访中心 - 取消回访
export const deleteCallData = params => axios.delete(`/marketing/callback/${params}`)
// 营销管理 - 回访中心 - 获取编辑数据
export const getEditCallbackvo = params => axios(`marketing/callbackdo/${params}`)
// 营销管理 - 回访中心 - 完成回访
export const getFinishstatus = params => axios.put(`marketing/callback/${params}/status/finishstatus`)
// 营销管理 - 回访中心 - 更新数据
export const putUpdateData = data => axios.put(`marketing/callback`, data)
// 营销管理 - 回访 -获取患者表格数据
export const getPatientList = params => axios.get(`treatment/patient/page`,{params})


/***********************患者详情-回访 **************************/
// 获取单个回访人信息
export const getPatientCallbacList = id => axios(`marketing/callback/list/patient/${id}`)
// 删除单个回访人信息
export const deleteOneCallback = id => axios.delete(`marketing/callback/${id}`)


// 新增患者
export const postPatientcenter = params => {
    return axios({
        method: 'post',
        url: `patient/patientcenter?verbId=getPatientFromList`,
        baseURL: ''
    })
}

// 患者来源
export const getPatientFromList = params => {
    return axios({
        method: 'post',
        url: `/patient/patientcenter?verbId=getPatientFromList`,
        baseURL: ''
    })
}

// 责任医生
export const getDoctorList = params => {
    return axios({
        method: 'post',
        url: `/patient/patientcenter?verbId=getDoctorList`,
        baseURL: ''
    })
}
// 符合
export const accordAll = url => {
    return axios({
        method: 'post',
        url,
        baseURL: ''
    })
}

// 获取人员
export const queryPatientAndCardInfo = data => {
    return axios({
        method: 'post',
        url: '/patient/patientcenter?verbId=queryPatientAndCardInfo',
        data: qs.stringify(data),
        baseURL: ''
    })
}

// 获取病人信息 3.2
export const getPatientMsg = data => axios(`treatment/patient/${data}`)

//品牌管理
export const drugBrand = data => {
    console.log(data)
    return axios({
        method: 'post',
        url: "/inventory/drugBrand",
        headers: {
            "Content-Type": 'multipart/from-data'
        },
        baseURL: '',
        data: data
    })
}


//删除
export const deleteBrand = params => {
    return axios({
        method: 'delete',
        url: `/inventory/drugBrand/${params.id}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        baseURL: '',
    })
}

//单位
export const saveDrugunits = data => {
    console.log(data)
    return axios({
        method: 'post',
        url: "inventory/saveDrugunits",
        headers: {
            "Content-Type": 'multipart/from-data'
        },
        baseURL: '',
        data: data
    })
}


//编辑
export const updateDrugBrand = data => {
    console.log(data)
    return axios({
        method: 'post',
        url: "inventory/drugBrand",
        headers: {
            "Content-Type": 'multipart/from-data'
        },
        baseURL: '',
        data: data
    })
}
export const updateDrugunits = data => {
    console.log(data)
    return axios({
        method: 'post',
        url: "inventory/updateDrugunits",
        headers: {
            "Content-Type": 'multipart/from-data'
        },
        baseURL: '',
        data: data
    })
}


//删除
export const deletedrugunits = data => {
    return axios({
        method: 'delete',
        url: `inventory/drugunits/${data.id}`,
        baseURL: '',
        data: data
    })
}



//物品类别
export const articlecfg = data => {
    return axios({
        method: 'post',
        url: "/inventory/articlecfg?verbId=saveOrUpdateDentalscmGoodsType",
        headers: {
            "Content-Type": 'multipart/from-data'
        },
        baseURL: '',
        data: data
    })
}


//删除
export const deletearticlecfg = data => {
    return axios({
        method: 'delete',
        url: `/inventory/articlecfg?verbId=deleteDentalscmGoodsType`,
        baseURL: '',
        data: data
    })
}

//............................. 体检 3.2......................................................

//体检表 列表
export const physicalexaminationlist = params => axios(`treatment/physicalexamination/page`,params)
//体检表 跟据id获取编辑信息
export const editphysicalexamination = data => {
    return axios({
        method: 'get',
        url: `treatment/physicalexamination/${data}`,
    })
}
//体检表 删除
export const deletephysicalexamination = data => axios.delete(`treatment/physicalexamination/${data.id}`)

//体检表  医生
export const doctorlist = data => {
    return axios({
        method: 'get',
        url: `organization/employee/doctor/list`,
    })
}
//体检表 保存
export const saveorupdatephysicalexamination = data => {
    return axios({
        method: 'post',
        url: `treatment/physicalexamination`,
        data: data
    })
}
//体检表 保存编辑
export const updatephysicalexamination = data => {
    return axios({
        method: 'put',
        url: `treatment/physicalexamination`,
        data: data
    })
}
// 体检表 跟据姓或名获取患者
export const getPatientlists = params => axios(`treatment//patient/list/visitstatus?patientName=${params}`)


// 跟据id获取患者的体检记录列表 3.2
export const getPhysical = params => axios(`treatment/physicalpxaminationrecord/${params.patientId}`)

// 修改入库单
export const getReturnarticle = id => {
    return axios({
        method: 'post',
        url: `inventory/returnarticle?verbId=queryPutInfo`,
        data: qs.stringify({ pid: id }),
        baseURL: ''
    })
}

// 获取退货人
export const exportClinicuser = id => {
    // return axios({
    //     method: 'post',
    //     url: `/inventory/clinicuserlist?verbId=queryExportClinicuserlist&amp;positionId=${id}`,
    //     baseURL: ''
    // })
}

// 获取退货人
export const sendReturnArticle = data => {
    return axios({
        method: 'post',
        data: data,
        url: `inventory/returnarticle?verbId=saveOrUpdateReturnArticle`,
        baseURL: ''
    })
}

//............................. 营销管理-营销活动......................................................

// 新增  预存款
export const savePrechargeactivity = data => {
    return axios({
        method: 'post',
        data: data,
        url: `marketing/prechargeactivity`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 修改预存款活动
export const updataPrechargeactivity = data => {
    return axios({
        method: 'PUT',
        data: data,
        url: `marketing/prechargeactivity`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 分页查询预存款活动列表
export const getPrechargeactivityPage = params => axios(`marketing/prechargeactivity/page?page=${params.page}&pageSize=${params.pageSize}`)

// 获取填充修改页面的数据
export const getEditPrechargeactivity = params => axios(`marketing/prechargeactivity/${params}`)

// 删除一条预存款活动
export const deletePrechargeactivity = params => axios.put(`marketing/prechargeactivity/${params}`)

// 折扣卡

// 新增  折扣卡
export const saveDiscountactivity = data => {
    return axios({
        method: 'post',
        data: data,
        url: `marketing/discountactivity`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 修改折扣卡
export const updataDiscountactivity = data => {
    return axios({
        method: 'PUT',
        data: data,
        url: `marketing/discountactivity`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 分页查询折扣卡活动列表
export const getDiscountactivityPage = params => axios(`marketing/discountactivity/page?page=${params.page}&pageSize=${params.pageSize}`)

// 获取折扣卡填充修改页面的数据
export const getEditDiscountactivity = params => axios(`marketing/discountactivity/${params}`)

// 删除一条折扣卡活动
export const deleteDiscountactivity = params => axios.put(`marketing/discountactivity/${params}`)


// 代金券

// 新增代金券活动
export const saveCashcouponactivity = data => {
    return axios({
        method: 'post',
        data: data,
        url: `marketing/cashcouponactivity`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 修改代金券活动
export const updataCashcouponactivity = data => {
    return axios({
        method: 'PUT',
        data: data,
        url: `marketing/cashcouponactivity`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}


// 分页查询代金券活动列表
export const getCashcouponactivityPage = params => axios(`marketing/cashcouponactivity/page?page=${params.page}&pageSize=${params.pageSize}`)

// 删除一条折扣卡活动
export const deleteCashcouponactivity = params => axios.put(`marketing/cashcouponactivity/${params}`)

// 新增代金券活动时获取所有诊疗服务和商品服务
export const getCashcouponactivitydo = params => axios.get(`marketing/cashcouponactivitydo`)

// 获取代金券详情以及修改时候回显
export const getEditCashcouponactivity = params => axios(`marketing/cashcouponactivitydo/${params}`)

// 查看代金券的使用记录
export const queryCashcouponnumber = params => axios(`marketing/cashcouponnumber/cashcouponactivity/${params}`)

// 促销套餐

// 新增促销套餐
export const saveChargepackage = data => {
    return axios({
        method: 'post',
        data: data,
        url: `marketing/chargepackage`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 修改促销套餐
export const updataChargepackage = data => {
    return axios({
        method: 'PUT',
        data: data,
        url: `marketing/chargepackage`,
        headers: {
            "Content-Type": 'application/json'
        },
    })
}

// 获取促销套餐列表信息
export const getChargepackageList = params => axios(`marketing/chargepackage/list`)

// 获取带分页促销套餐列表信息
export const getChargepackagePage = params => axios(`marketing/chargepackage/page?page=${params.page}&pageSize=${params.pageSize}`)

// 获取单个促销套餐和对应详情信息
export const getChargepackageInfo = params => axios(`marketing/chargepackage/${params}`)

// 删除收费套餐信息
export const deleteChargepackage = params => axios.put(`marketing/chargepackage/${params}`)

// 全部收费套餐和详情信息列表
export const getChargepackagedto = params => axios(`marketing/chargepackagedto/list`)

// 预存款活动 同步到分店
export const savePrechargeActivitys = data => {
    return axios({
        method: 'post',
        url: `marketing/prechargeactivity/batchins`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
// 获取填充预充值同步门店的DO
export const getPerchargeActivityById = perchargeActivityId => axios(`marketing/synchperchargeactivitydo/${perchargeActivityId}`)

// 代金券活动 同步到分店
export const saveCashcouponActivitys = data => {
    return axios({
        method: 'post',
        url: `marketing/cashcouponactivity/batchins`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
// 获取填充代金券活动同步门店的DO
export const getCashCouponActivityById = cashCouponActivityId => axios(`marketing/synchcashcouponactivitydo/${cashCouponActivityId}`)

// 折扣卡活动 同步到分店
export const saveDiscountActivitys = data => {
    return axios({
        method: 'post',
        url: `marketing/discountactivity/batchins`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
// 获取填充折扣卡活动同步门店的DO
export const getDiscountActivityById = discountActivityId => axios(`marketing/synchdiscountactivitydo/${discountActivityId}`)

// 收费套餐活动 同步到分店
export const saveSynchChargePackages = data => {
    return axios({
        method: 'post',
        url: `marketing/chargepackage/batchins`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
// 获取填充收费套餐活动同步门店的DO
export const getSynchChargePackageById = chargepackageId => axios(`marketing/synchchargepackagedo/${chargepackageId}`)






// 医生工作台  获取数量 3.2
export const getWorkbenchNum = params => axios(`workbench/statistic/task/doctor?status=${params.id}&startDate=${params.startTime} 00:00:00&endDate=${params.endTime} 00:00:00`)

// 接待工作台  获取数量 3.2
export const getnNurseNum = params => axios(`workbench/statistic/task/receiptionist?status=${params.id}&startDate=${params.startTime} 00:00:00&endDate=${params.endTime} 00:00:00`)


/***********************工作台-新增患者 **************************/
export const patientCenterList = params => axios.get('treatment/patient/page', params)
export const deletePatient = id => axios.delete(`treatment/patient/${id}`)
// 20119/02/25
// 新增患者 - 获取下拉数据3.2
export const getPatientRelevant = id => axios(`treatment/patientdo/${id}`)
// 新智患者 - 获取 市 区
// export const getPatientCicy = datas => axios.post(`/patient/commConfigLocation/getCity`, qs.stringify(datas))
// 新增患者 - label列表 - 查3.2
export const getLabelConfigList = datas => axios(`treatment/labelconfig/list`)
// 新增患者 - label列表 - 增3.2
export const postLabelConfigList = datas => axios.post(`treatment/labelconfig`, datas)
// 新增患者 - label列表 - 改3.2
export const putLabelConfigList = datas => axios.put(`treatment/labelconfig`, datas)
// 新增患者 - label列表 - 删除3.2
export const deleteLabelConfigList = datas => axios.delete(`treatment/labelconfig/${datas.id}`)
// 新增患者 - 患者关系下获取患者列表
export const getPatientcenter = params => axios(`treatment/patient/page`, { params })
// 新增患者 - 保存新增患者 3.2
export const savePatient = params => axios.post(`treatment/patient`, { ...params })

/***********************工作台-患者详情-患者信息 **************************/

// 患者信息- 很具id获取患者信息
export const getPatientDetial = params => axios(`/treatment/patient/${params}`)

/***********************工作台-患者详情-就诊记录 **************************/

// 患者信息- 跟据id获取患者信息
export const getPatientVisitrecord = params => axios(`treatment/visitrecord/${params}`)

// 患者信息- 跟据id获取患者流转记录
export const getPatientVisittracklineitemd = params => axios(`treatment/visittracklineitem/${params}`)

/***********************工作台-收費 **************************/

//收费 获取 全部
export const getPatientInfo = params => axios(`treatment/chargebill/list?patientId=${params.id}&multiStatus=${params.num}`)

//收费 新增收费 左侧列表 - 服务
export const getAsideService = params => axios(`systemcfg/chargetypeconfig/list`)
//收费 新增收费 左侧列表 - 类别
export const getAsideDrug = params => axios(`inventory/drugtype`)
//收费 新增收费 左侧列表 - 服务 - 子集
export const getAsideServiceChild = params => axios(`systemcfg/chargitemconfig/type/${params}`)
//收费 新增收费 左侧列表 - 类别 - 子集
export const getAsideDrugChild = params => axios(`inventory/drug/drugtype/list?typeId=${params}`)

// 收费 基本select
export const getParentSelect = params => axios(`treatment/chargebilldo?patientId=${params.patientId}&chargeBillId=${params.chargeBillId}`)

// 收费 新增收费 - 保存
export const postSaveCharge = data => axios.post(`treatment/chargebillvo`, data)

//收费 - 确认收费
export const postCollect = data => axios.post(`treatment/chargebill`, data)

//收费 新增收费 请求二级 typeId=10001&type=0
export const getChildlist = params => axios(`charge/chargecategorychildlist`, { params })

// 收费 新增收费 诊疗服务  search=TF&type=0
export const getSearchData = params => axios(`systemcfg/chargitem/drug/search`, { params })

// 收费 新增收费 确认收费 获取
export const getPayWay = params => axios(`systemcfg/payway/list`)

// 收费 新增收费 验证密码  折扣卡
export const getVioiDiscount = params => axios(`discountcard/password?patientId=${params.patientId}&cardNo=${params.cardNo}&password=${params.password}`)

// 收费 新增收费 查看详情
export const getEditchargebill = params => axios(`treatment/chargebilldo/${params}`)
// 收费 查看退费详情
export const getEditchargeRefundbill = id => axios(`treatment/chargebilldo/refund/${id}`)
// 收费 退费单打印
export const getchargebillPrint = id => axios(`treatment/chargebilldo/${id}/print`)

// 收费 新增收费 申请退费
export const postRefundmoney = data => axios.post(`treatment/chargebill/refund`, data)

// 收费 新增收费 作废
export const deletechargebill = params => axios.delete(`treatment/chargebill/${params}`)

// 收费 新增收费 获取大集合
export const querychargebillinfos = params => axios(`treatment/chargebill/list/ids?ids=${params}`)

// 收费 新增收费 批量收费
export const postBatchcharge = data => axios.post(`treatment/chargebill/list`, data)

// 收费 状态
export const getChargebillStatus = params => axios(`treatment/chargebill/status`)

export const postChildlist = data => {
    return axios({
        method: 'post',
        transformRequest: [function (data) {
            return qs.stringify(data)
        }],
        url: `charge/savechargebill`,
        data
    })
}
// 患者收费  - 套餐列表
export const getChargeSelList = id => axios(`marketing/chargepackage/list`)
// 或者收费 - 套餐列表
export const getChargePackage = id => axios(`marketing/chargepackage/${id}`)

// 确认收费 - 获取代金券
export const getCach = id => axios(`marketing/cashcouponnumber?code=${id}`)

// 确认收费 - 获取预付卡信息
export const getCardMsg = data =>axios(`marketing/predepositcard?cardNoOrPhone=${data}`)

// 确认收费 - 预付卡密码验证
export const getValidCard = data => axios(`marketing/predepositcard/password?cardId=${data.cardIds}&password=${data.cardPassword}`)

// 确认收费 - 折扣卡列表
export const getPatientCardList = data => axios(`marketing/discountcard/list?patientId=${data}`)

// 确认收费 - 打折卡信息
export const getDiscount = data => axios(`marketing/discountcard?cardNoOrPhone=${data}`)

// 确认收费 - 预付卡信息
export const getWillCard = data => axios(`marketing/predepositcard/list?patientId=${data}`)

//医生划价 - 折扣权限
export const getDoctorDiscount= params => axios(`treatment/chargebill/doctor/${params.doctorId}/discount/${params.discount}`)

//收费 - 创建收费单权限
export const getBilladdable= id => axios(`organization/position/operateperm/bill-addable`)
//收费 - 收费单详情 - 收费按钮权限
export const getChargeEditable= id => axios(`organization/position/operateperm/charge-editable`)
//收费 - 收费单 - 修改，作废权限
export const getChargeitemconfigable= id => axios(`organization/position/operateperm/chargeitemconfig-editable`)


/*****************************************患者详情 电子病历**************************************/
// 获取新增病例下拉列表 3.2
// export const getVisttime = params => axios(`charge/doctornursevisttime/?patientId=${params.id}&chargeBillId=${params.chargeBillId}`)
export const getVisttime = params => axios(`treatment/emrbigto/${params.id}`)

//电子病历 获取电子病历列表 3.2
export const getElectronicMedicalRecordList = params => axios(`/treatment/emr/list/${params}`)

//删除电子病历 3.2
export const deletemr = data => {
    return axios({
        method: 'delete',
        url: `treatment/emr/${data.id}`
    })
}

//电子病历下 获取词条信息 3.2
export const getEmrentryList = params => axios(`systemcfg/emrentry/list/${params}`)

//电子病历下 获取病例模板 3.2
export const getTemplatelist = params => axios(`systemcfg/templateclass/third/list`)

//电子病历下 获取保存的病例模板 3.2
export const getSaveTemplatelist = params => axios(`systemcfg/templateclass/noleaf/list`)

//电子病历下 获取病例模板下的每条数据 GET /api/systemcfg/template/data/{templateId}
export const getTemplate = params => axios(`systemcfg/template/data/${params}`)

// 修改电子病历 3.2
export const emrsaveedit = data => {
    return axios({
        method: 'put',
        data: data,
        url: `treatment/emrvo`,
        // baseURL:''
    })
}
// 打印所有病例  3.2
export const getAllEmrList = params => axios(`treatment/emrbigdo/list/${params}`)

// 完成治疗 3.2
export const emrcompleted = data => {
    return axios({
        method: 'post',
        data: data,
        url: `treatment/emr/status/completed`,
        // baseURL:''
    })
}

// 打印日志 3.2
export const getFologlist = params => axios(`treatment/emr/loglist/${params}`)

// 新增电子病历 3.2
export const emrsave = data => {
    console.log(JSON.stringify(data))
    return axios({
        method: 'post',
        data: data,
        url: `treatment/emrvo`,
        // baseURL:''
    })
}
// 新增电子病历并保存模板 3.2
export const emrsaveandtemp = data => {
    return axios({
        method: 'post',
        data: data,
        url: `treatment/emrandtemplate`,
        // baseURL:''
    })
}

// 编辑电子病历-数据回填  3.2
export const getEmrInfo = params => axios(`treatment/emrdo/${params}`)

/*******************************患者详情 拍片 **********************************/

// 获取拍片类型
export const getPhotoType = data => axios(`treatment/photograph/types`)

// 侧边滑块 发送申请
export const getNoticeMessage = data => axios.post(`treatment/photograph`, data)

/*******************************患者详情 技加工 **********************************/

// 跟据i患者id 获取  技加工列表
export const getMachiningList = params => axios(`treatment/machiningproduct/list/${params}`)

// 跟据id删除一个 记录
export const deleteMachining = params => axios.delete(`treatment/machiningproduct/${params}`)

// 获取打印技加工数据
export const getMachiningPrint = params => axios(`treatment/machiningproduct/${params}/details`)

//跟据id获取下拉列表数据 vo
export const getmMchiningvo = id => axios.get(`treatment/machiningproductdo/patient/${id}`)

/*******************************患者详情 处置记录 **********************************/

// 跟据患者id 获取  处置记录列表
export const getRecordList = params => axios(`treatment/disposalrecord/list?patientId=${params}`)

// 保存 处置记录
export const saveRecord = data => {
    return axios({
        method: 'post',
        data: data,
        url: `treatment/disposalrecord`,
    })
}
// 编辑保存 处置记录
export const upDataRecord = data => {
    return axios({
        method: 'put',
        data: data,
        url: `treatment/disposalrecord`,
    })
}
// 编辑跟据id获取一条信息
export const getEditRecord = params => axios(`treatment/disposalrecord/${params}`)

// 删除记录
export const deleteRecord = params => axios.delete(`treatment/disposalrecord/${params}`)

/*******************************工作台-新增预约 **********************************/


// // 新增预约 获取新增的下拉数据3.2
// export const getRelevant = params => axios(`treatment/appointmentdo/${params}`)

// 新增预约 获取科室 4.1
export const getRelevant = institutionId => axios(`treatment/appointmentdo/institution/${institutionId}`)

// 新增预约 获取新增的下拉数据3.2
export const appointmentdo = params => axios(`treatment/appointmentdo`)

// 新增预约  跟距医生列表获取列表 3.2
// export const getTineView = params => axios(`treatment/appointmentview?doctorId=${params}`)
export const getTineView = params => axios(`treatment/appointment/doctor/${params.doctorId}/date/${params.dateStr}`)

// 新增预约 修改的保存3.2
export const postPatientAppoint = data => axios.post(`treatment/appointment`, data)
export const putPatientAppoint = data => axios.put(`treatment/appointment`, data)

// 新增预约  获取回填数据
export const getRecordData = params => axios.get(`treatment/appointmentdo/${params}`)
// 新增预约  详情预约
export const appointmentdoId = patientId => axios.get(`treatment/appointmentdo/patient/${patientId}`)

//工作台 - 前台 -新增预约下拉列表
// export const  getBespeakInfo  = params => axios(`patient/patientcenter3//patientAppointRelevant`)

// //工作台 - 前台 -获取预约时间
// export const  getBespeakTime  = params => axios(`patient/patientcenter3/patientAppointTineView?doctorId=${params}`)

// //工作台 - 前台 -保存预约
export const addBespeak = data => axios.post(`treatment/appointment`, data)
//患者列表
// export const patientCenterList = params => axios.get('patient/patientcenter3/patient3',params)
//患者删除
// export const deletePatient = id => axios.delete(`patient/patientcenter3/deletepatient/${id}`)

/***************************转诊**************************************** */

// 新增转诊 - 获取患者详情
export const getPatientDetail = id => axios(`treatment/patient/detail/${id}`)
// 新增转诊 - 获取当前机构
export const getCurrentinstitution = id => axios(`systemcfg/currentinstitution`)
// 新增转诊 - 通过id获取机构
export const getInstitutionsById = id => axios(`chain/chainlevel/tree/institutions/${id}`)
// 新增转诊 - 通过机构id获取部门
export const getDepartmentsById = id => axios(`department/list/institution/${id}`)
// 新增转诊 - 通过部门id调用排班
export const getDoctorsById = params => axios(`organization/duty/doctor/list/institution/${params.institutionId}/department/${params.deparentmentId}`)
// 新增转诊 -保存
export const saveReferral = data => axios.post(`treatment/referral`, data)


// ------------------- 财务中心 -------------------
// 收费账单 下拉数据
export const getChargebillvo = data => axios(`finance/chargebilldo`)
// 收费对账 数据列表
export const getFinancePageFilter = params => axios.get(`finance/chargebill/page/filter`,{params})
// 收费对账 查看详情 - 通用
export const getChargeitem = id => axios(`treatment/chargebilldo/${id}`)

// 账目明细 下拉数据
export const getChargebillitemvo = params => axios(`finance/chargebillitemdo`)
// 账目明细 数据列表
export const getChargebillitem = params => axios.get(`finance/chargebillitem/page/filter`,{params})


// 日常收支 下拉数据
export const getDailyincomeoutdo = data => axios(`finance/dailyincomeoutdo`)
// 日常收支 列表
export const getDailyincomeout = params => axios(`finance/dailyincomeout/page/filter`, { params })
// 日常收支 新增
export const saveDailyincomeout = data => axios.post(`finance/dailyincomeout`, data)
// 日常收支 修改
export const updateDailyincomeout = data => axios.put(`finance/dailyincomeout`, data)
// 日常收支 详情 finance/dailyincomeout/1
export const getDailyMsgt = params => axios(`finance/dailyincomeout/${params}`)
// 日常收支  作废
export const deteleDaily = params => axios.delete(`finance/dailyincomeout/${params}`)
// 日常收支  添加转账
export const postTransfer = data => axios.post(`finance/dailyincomeout/transfer`, data)

// 资金流水 获取数据
export const getCapitalflow = params => axios(`finance/capitalflow/page/filter`, { params })
// 资金流水 获取nav
export const getCapitalflowvo = params => axios(`finance/capitalflowdo`, { params })
// 资金流水 获取总额
export const getCapitalflowTotal = params => axios(`finance/capitalflow/total`, { params })
// 资金流水 获取详情
export const getCapitalDetial = params => axios(`finance/capitalflow/${params}`)

// 预存款 - 预存款余额
export const getRechargecard = params => axios(`finance/predepositcard/page/filter`, { params })
// 预存款 - 预存款详情,个人
export const getConsumeFlow = id => axios(`finance/rechargeconsumeflow/${id}`)
// 预存款 - 预存款明细
export const getRechargeFlow = params => axios(`finance/rechargeconsumeflow/page/filter`, { params })
// 财务 - 预存款余额 - 合计
export const getPredepositCardTotal = params => axios(`finance/predepositcard/filter/total`,{params})
// 财务 - 预存款余额流水 - 合计
export const getPredepositCardFlowTotal = params => axios(`finance/rechargeconsumeflow/filter/total`,{params})

// 预存款 - 折扣卡余额
export const getFinanceDiscountCard = params => axios(`finance/discountcard/page/filter`, { params })
// 预存款 - 折扣卡详情,个人
export const getFinanceDiscountCardFlow = id => axios(`finance/discountconsumeflow/${id}`)
// 预存款 - 折扣卡明细
export const getFinanceDiscountCardFlows = params => axios(`finance/discountconsumeflow/page/filter`, { params })
// 财务 - 折扣卡余额 - 合计
export const getFinanceDiscountCardTotal = params => axios(`finance/discountcard/filter/total`,{params})
// 财务 - 折扣卡余额流水 - 合计
export const getFinanceDiscountCardFlowTotal = params => axios(`finance/discountconsumeflow/filter/total`,{params})

// 欠退费 - 欠费报表
export const getArrearsList = params => axios(`finance/chargebill/arrears/page`, { params })
// 欠退费 - 欠费报表 - 合计
export const getArrearsListTotal = params => axios(`finance/chargebill/arrears/total`, { params })
// 欠退费 - 退费报表
export const getRefundList = params => axios(`finance/chargebill/refund/page`, { params })
// 欠退费 - 退费报表 - 合计
export const getRefundListTotal = params => axios(`finance/chargebill/refund/total`, { params })
// 欠退费 - 退费报表 - 详情
export const getRefundListDetail = id => axios(`finance/chargebilldo/refund/${id}`)


// 欠退费 - 退货报表
export const getFinanceReturnRecordList = params => axios(`finance/drugreturnrecord/page/filter`, { params })

// 采购报表 - 汇总
export const getAllTotalList = params => axios(`finance/putinventoryrecord/page/filter`, { params })
// 采购报表 - 汇总 -下拉
export const getAllTotalSel = params => axios(`finance/putinventoryrecordvo`, { params })
// 采购报表 - 明细
export const getDetialTotalList = params => axios(`finance/putinventoryrecorditem/page/filter`, { params })
// 采购报表 - 明细 -下拉
export const getDetialTotalSel = params => axios(`finance/putinventoryrecorditemvo`, { params })
// 出库报表 - 汇总
export const getAllOutBoundList = params => axios(`finance/exportinventoryrecord/page/filter`, { params })
// 出库报表 - 汇总 - 下拉
export const getAllOutBoundSel = params => axios(`finance/exportinventoryrecordvo`, { params })
// 出库报表 - 明细
export const getDetialOutBoundList = params => axios(`finance/exportinventoryrecorditem/page/filter`, { params })
// 出库报表 - 明细 - 下拉
export const getDetialOutBoundSel = params => axios(`finance/exportinventoryrecorditemvo`, { params })
// 获取库存余额表 -
export const getDruginventoryList = params => axios(`finance/druginventory/page/filter`, { params })
// 获取库存余额表 - 下拉
export const getDruginventorySel = params => axios(`finance/druginventoryvo`, { params })
// 货物盘点列表
export const getCheckinventoryList = params => axios(`finance/checkinventoryitem/page/filter`, { params })
// 货物盘点列表  - 下拉
export const getCheckinventorySel = params => axios(`finance/checkinventoryitemvo`, { params })


//财务日报统计各项
export const chargebillflowCount = params => axios.get('finance/chargebillflow/filter/count', params)
//财务日报列表
export const chargebillflowList = params => axios.get('finance/chargebillflow/filter/page', params)
//财务日报详情
export const chargebillflowInfo = billId => axios.get(`finance/chargebillflow/${billId}`)
//财务日报导出
export const chargebillflowExport = data => {
    return axios({
        method: 'get',
        url: `finance/chargebillflow/export?time=` + data,
        responseType: 'arraybuffer',
    })
}


//系统配置-收费项目
export const chargitemconfigList = params => axios.get('systemcfg/chargitemconfig/page', params)
//系统配置-收费项目-所属子类
export const chargetypeconfigListService = params => axios.get('systemcfg/chargetypeconfig/list', params)
//系统配置-收费项目-修改回填
export const chargitemconfigVo = id => axios.get(`systemcfg/chargitemconfig/${id}`)
//系统配置-收费项目-删除
export const deleteChargitemconfig = id => axios.delete(`systemcfg/chargitemconfig/${id}`)
// 系统配置-收费项目-新增
export const addChargitemconfig = data => axios.post(`systemcfg/chargitemconfig`, data)
// 系统配置-收费项目-修改
export const putChargitemconfig = data => axios.put(`systemcfg/chargitemconfig`, data)
//系统配置-收费大类列表
export const chargetypeconfigList = params => axios.get('systemcfg/chargtypeconfig/page', params)
// 系统配置-收费项目 -新增
export const addChargetypeconfig = data => axios.post(`systemcfg/chargetypeconfig`, data)
// 系统配置-收费项目-修改
export const putChargetypeconfig = data => axios.put(`systemcfg/chargetypeconfig`, data)
// 系统配置-收费子项目-删除
export const deleteChargetypeconfig = id => axios.delete(`systemcfg/chargetypeconfig/${id}`)
// 系统配置-收费列表项目-删除
export const deleteChargeitemconfig = id => axios.delete(`systemcfg/chargitemconfig/${id}`)
// 系统配置-收费项目-修改回填
export const chargetypeconfigVo = id => axios.get(`systemcfg/chargetypeconfig/${id}`)

//查询机构所有挂号费配置项
export const regfeeconfigList = data => axios.get(`systemcfg/regtypeconfig/list`, data)
// 系统配置-挂号费-新增
export const addRegfeeconfig = data => axios.post(`systemcfg/regtypeconfig`, data)
// 系统配置-挂号费-修改
export const putRegfeeconfig = data => axios.put(`systemcfg/regtypeconfig`, data)
// 系统配置-挂号费-修改回填
export const regfeeconfigDo = id => axios.get(`systemcfg/regtypeconfigdo/${id}`)
//系统配置-收费项目-删除
export const deleteRegfeeconfig = id => axios.delete(`systemcfg/regtypeconfig/${id}`)

//系统配置-病例词条配置
export const systemcfgEmrentryList = params => axios.get('systemcfg/emrentry/list', params)

//审批流程列表
export const approvalcfgList = data => axios.get(`approvalflow/approvalcfg/page`, data)
//审批流程下拉数据
export const approvalcfgdo = data => axios.get(`approvalflow/approvalcfgdo`, data)
//修改审批流程下拉数据
export const approvalcfgdoId = id => axios.get(`approvalflow/approvalcfgdo/${id}`)
//删除审批流程
export const approvalcfgDel = id => axios.delete(`approvalflow/approvalcfg/${id}`)
//新增审批流程
export const approvalcfgAdd = data => axios.post(`approvalflow/approvalcfg`, data)
//修改审批流程
export const approvalcfgPut = data => axios.put(`approvalflow/approvalcfg`, data)
//审批启用禁用
export const approvalcfgStatus = params => axios.put(`approvalflow/approvalcfg/${params.id}/status/${encodeURI(params.status)}`)


// 获取全部系统参数
export const systemparam = data => axios.get(`systemcfg/systemparam`, data)
// 修改系统参数
export const systemparamPut = data => axios.put(`systemcfg/systemparam`, data)

//系统配置-预约项目-项目列表
export const appointmentitemconfigTypeId = typeId => axios.get(`systemcfg/treatitemconfig/type/${typeId}`)
// 系统配置-预约项目 - 新增
export const addAppointmentitemconfig = data => axios.post(`systemcfg/treatitemconfig`, data)
// 系统配置-预约项目 - 修改
export const putAppointmentitemconfig = data => axios.put(`systemcfg/treatitemconfig`, data)
//系统配置-预约项目-修改回填
export const appointmentitemconfigId = id => axios.get(`systemcfg/treatitemconfig/${id}`)
//系统配置-预约项目-类别列表
export const appointmenttypeanditemList = params => axios.get('systemcfg/treattypeconfig/list', params)
//系统配置-预约项目-项目删除
export const deleteAppointmentitemconfig = id => axios.delete(`systemcfg/treatitemconfig/${id}`)

// 预约大类 - 新增
export const addAppointmenttypeconfig = data => axios.post(`systemcfg/treattypeconfig`, data)
// 预约大类 - 修改
export const putAppointmenttypeconfig = data => axios.put(`systemcfg/treattypeconfig`, data)
// 预约大类-大类列表
export const appointmenttypeconfigList = params => axios.get('systemcfg/treattypeconfig/page',params)
//预约大类-修改回填
export const appointmenttypeconfigId = id => axios.get(`systemcfg/treattypeconfig/${id}`)
//预约大类-大类删除
export const deleteAppointmenttypeconfig = id => axios.delete(`systemcfg/treattypeconfig/${id}`)


// 系统配置-患者关系列表
export const patientrelationconfigList = id => axios.get(`systemcfg/patientrelationconfig/list`)
// 系统配置-患者关系-新增
export const addPatientrelationconfig = data => axios.post(`systemcfg/patientrelationconfig`, data)
// 系统配置-患者关系-修改
export const putPatientrelationconfig = data => axios.put(`systemcfg/patientrelationconfig`, data)
// 系统配置-患者关系-删除
export const deletePatientrelationconfig = id => axios.delete(`systemcfg/patientrelationconfig/${id}`)
// 系统配置-患者关系-修改回填
export const patientrelationconfigVo = id => axios.get(`systemcfg/patientrelationconfig/${id}`)
// 系统配置-患者来源列表
export const patientsourceconfigList = id => axios.get(`systemcfg/patientsourceconfig/list`)
// 系统配置-患者来源-新增
export const addPatientsourceconfig = data => axios.post(`systemcfg/patientsourceconfig`, data)
// 系统配置-患者来源-修改
export const putPatientsourceconfig = data => axios.put(`systemcfg/patientsourceconfig`, data)
// 系统配置-患者来源-删除
export const deletePatientsourceconfig = id => axios.delete(`systemcfg/patientsourceconfig/${id}`)
// 系统配置-患者来源-修改回填
export const patientsourceconfigVo = id => axios.get(`systemcfg/patientsourceconfig/${id}`)

// 系统配置-技加工-列表
export const machiningconfigList = typeFlag => axios.get(`systemcfg/machiningconfig/${typeFlag}/list`)
// 系统配置-技加工-新增
export const addMachiningconfig = data => axios.post(`systemcfg/machiningconfig/${data.typeFlag}`, data)
// 系统配置-技加工-修改
export const putMachiningconfig = data => axios.put(`systemcfg/machiningconfig`, data)
// 系统配置-技加工-删除
export const deleteMachiningconfig = id => axios.delete(`systemcfg/machiningconfig/${id}`)
// 系统配置-技加工-修改回填
export const machiningconfigVo = id => axios.get(`systemcfg/machiningconfigdo/${id}`)

//系统配置-病例配置-模板列表
export const templateclassList = params => axios.get('systemcfg/templateclass/third/list', params)
//系统配置-病例配置-模板列表
export const systemcfgTemplateId = templateId => axios.get(`systemcfg/template/data/${templateId}`)
//系统配置-病例配置-class新增
export const addTemplateclass = data => axios.post(`systemcfg/templateclass`, data)
//系统配置-病例配置-class修改
export const putTemplateclass = data => axios.put(`systemcfg/templateclass`, data)
//系统配置-病例配置-class新增修改
export const addTemplateForm = data => axios.post(`systemcfg/template/data`, data)
//系统配置-病例配置- 删除
export const deleteTemplateclass = id => axios.delete(`systemcfg/templateclass/${id}`)

//系统配置-病例配置-词条列表
export const emrentrysList = params => axios.get('systemcfg/emrentry/second/list', params)
//系统配置-病例配置- 词条删除
export const deleteEmrentry = itemCode => axios.delete(`systemcfg/emrentry/item/${itemCode}`)
//系统配置-病例配置- 词条详情删除
export const deleteEmrentryDetail = id => axios.delete(`systemcfg/emrentry/detail/${id}`)
//系统配置-病例配置- 三级
export const emrentryItemId = itemCode => axios.get(`systemcfg/emrentry/detail/list/${itemCode}`)
//系统配置-病例配置-词条新增
export const addEmrentryItem = data => axios.post(`systemcfg/emrentry/item`, data)
//系统配置-病例配置-词条修改
export const putEmrentryItem = data => axios.put(`systemcfg/emrentry/item`, data)
//系统配置-病例配置-词条项目新增
export const addEmrentryDetailItem = data => axios.post(`systemcfg/emrentry/detail`, data)

//系统配置-病例配置-储存列表
export const globalparamList = params => axios.get('systemcfg/globalparam/list', params)
//系统配置-病例配置-储存新增
export const addGlobalparam = data => axios.post(`systemcfg/globalparam`, qs.stringify(data))
//系统配置-病例配置-储存修改信息
export const globalparamId = id => axios.get(`systemcfg/globalparam/${id}`)
//系统配置-病例配置- 词条详情删除
export const deleteGlobalparam = id => axios.delete(`systemcfg/globalparam/${id}`)


//管理中心-技加工-删除
export const deleteMachiningproduct = id => axios.delete(`treatment/machiningproduct/${id}`)
//管理中心-技加工-列表
export const machiningproductList = params => axios.get('treatment/machiningproduct/page/filter', params)
//管理中心-技加工-修改信息
export const machiningproductId = id => axios.get(`treatment/machiningproductdo/${id}`)
//管理中心-技加工-修改信息
export const machiningproductInit = id => axios.get(`treatment/machiningproductdo`)
//管理中心-技加工-新增
export const addMachiningproduct = data => axios.post(`treatment/machiningproduct`, data)
//管理中心-技加工-修改
export const putMachiningproduct = data => axios.put(`treatment/machiningproduct`, data)

//管理中心-患者管理列表
export const treatmentPatientList = params => axios.get('treatment/patient/manager/page', params)
//管理中心-患者管理-解除归档
export const deleteTreatmentPatientArchived = id => axios.delete(`treatment/patient/unarchived/${id}`)
//管理中心-患者管理-归档
export const deleteTreatmentPatient = id => axios.delete(`treatment/patient/archived/${id}`)
//管理中心-患者管理-重复患者列表
export const treatmentSamepatientList = params => axios.get('treatment/patient/same/page', params)

// 统计中心 - 绩效中心 - 医生收费汇总
export const getApiDoctor = params => axios(`statistic/kpi/doctor`, { params })
// 统计中心 - 绩效中心 - 医生收费详情
export const getApiDoctorDetial = params => axios(`statistic/kpi/doctor/detail`, { params })
// 统计中心 - 绩效中心 - 医生收费详情 - 导出
export const exportApiDoctorDetial = (params) => {
    return axios({
        method: 'get',
        url: `statistic/kpi/doctor/detail/export?doctorId=${params.doctorId}&startTime=${params.startTime}&endTime=${params.endTime}`,
        responseType: 'arraybuffer',
    })
}
// 统计中心 - 绩效中心 - 医生对应病患数量
export const getApiDetail = params => axios(`statistic/doctor/count/patient`, { params })
// 统计中心 - 绩效中心 - 护士收费汇总
export const getApiNurse = params => axios(`statistic/kpi/nurse`, { params })
// 统计中心 - 绩效中心 - 护士收费详情
export const getApiNurseDetial = params => axios(`statistic/kpi/nurse/detail`, { params })
// 统计中心 - 绩效中心 - 患者消费汇总
export const getApiConsume = params => axios(`statistic/patient/consume`, { params })

// 统计中心 - 运营总览 - 新增患者统计
export const getViewPatient = params => axios(`statistic/overview/patient`, { params })
// 统计中心 - 运营总览 - 新增患者总览统计
export const getViewIncome = params => axios(`statistic/overview/income`, { params })

// 统计中心 - 趋势分析 - 增量
export const getTrendPatient = params => axios(`statistic/trend/patient`, { params })
// 统计中心 - 趋势分析 - 复诊
export const getTrendReturned = params => axios(`statistic/trend/patient/returned`, { params })
// 统计中心 - 趋势分析 - 收入
export const getTrendCharge = params => axios(`statistic/trend/charge`, { params })


/***********************预约中心*********************************** */

//预约查询 - 预约列表
export const appointmentList = params => axios.get('treatment/appointment/page/filter', params)
//预约查询 - 预约项目
export const appointmentitemconfigList = params => axios.get('systemcfg/appointmentitemconfig/list', params)
//预约查询 - 删除预约
export const deleteTreatmentAppointment = id => axios.delete(`treatment/appointment/${id}`)
//预约查询 - 日查询
export const calendarviewDaily = dayStr => axios.get(`treatment/appointment/calendarview/daily/${dayStr}`)
//预约查询 - 周查询
export const calendarviewWeekly = weekStr => axios.get(`treatment/appointment/calendarview/weekly/${weekStr}`)
//预约查询 - 月查询
export const calendarviewMonthly = monthStr => axios.get(`treatment/appointment/calendarview/monthly/${monthStr}`)
//预约视图 - 预约列表
export const appointmentView = params => axios.get('treatment/appointment/doctorview', params)
//预约视图 - 医生列表
export const doctorListView = params => axios.get('treatment/appointment/doctor/list', params)
//预约视图 - 预约患者之前之后信息
export const patientInfoView = id => axios.get(`treatment/appointment/${id}/around`)
//预约视图 - 修改预约时间
export const appointTimeEdit = data => {
    return axios({
        method: 'put',
        url: `treatment/appointment/${data.id}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:qs.stringify(data)
    })
}

/***********************连锁管理*********************************** */

//判断登录的用户所在机构是否为连锁机构
export const isChain = () => axios.get('common/institution/ischain')

//连锁管理 - 新增层级
export const addChainLevel = data => {
    return axios({
        method: 'post',
        url: `chain/chainlevel`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

//连锁管理 - 修改层级
export const editChainLevel = data => {
    return axios({
        method: 'put',
        url: `chain/chainlevel`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

//连锁管理 - 删除层级
export const delChainLevel = id => axios.delete(`chain/chainlevel/${id}`)

//连锁管理 - 获取层级
export const listChainLevel = () => axios.get(`chain/chainlevel/tree`)

//连锁管理 - 获取当前机构层级的树形结构（带门店简单列表）
export const listChainLevelInstitutions = () => axios.get(`chain/chainlevel/tree/institutions`)

//连锁管理 - 获取门店
export const listInstitution = (params) => {
    return axios({
        method: 'get',
        url: `chain/institution/page/filter?page=${params.page}&pageSize=${params.pageSize}&nameOrId=${params.nameOrId}&headquartersId=${params.headquartersId}
        &chainLevel1Id=${params.chainLevel1Id}&chainLevel2Id=${params.chainLevel2Id}&chainLevel3Id=${params.chainLevel3Id}&chainLevel4Id=${params.chainLevel4Id}`,
    })
}

//连锁管理 - 增加门店
export const addInstitution = (data) => {
    return axios({
        method: 'post',
        url: `chain/institution`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//连锁管理 - 上传门店logo
export const savefileImg = params => {
    return axios(`common/file`, {
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//连锁管理 - 修改门店
export const editInstitution = (data) => {
    return axios({
        method: 'put',
        url: `chain/institution`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//连锁管理 - 获取门店-通过id
export const getInstitution = (id) => axios.get(`chain/institutiondo/${id}`)

//连锁管理 - 获取门店-填充数据
export const getInstitutionDo = () => axios.get(`chain/institutiondo`)

//连锁管理 - 删除门店
export const delInstitution = id => axios.delete(`chain/institution/${id}`)

//连锁管理 - 删除门店规模
export const delChainscale = name => axios.delete(`chain/chainscale/name/${name}`)

//连锁管理 - 改变门店状态
export const changeInstitutionStatus = params => {
    return axios({
        method: 'put',
        url: `chain/institution/${params.id}/status/${params.status}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })
}

//连锁管理 - 门店移动
export const moveInstitution = data => {
    return axios({
        method: 'put',
        url: `chain/institution/${data.id}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//连锁管理 - 门店排序
export const orderInstitution = data => {
    return axios({
        method: 'put',
        url: `chain/institution/${data.id}/order/${data.order}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//连锁管理 - 获取连锁员工
export const listChainemployee = (params) => {
    return axios({
        method: 'get',
        url: `chain/chainemployee/page/filter?page=${params.page}&pageSize=${params.pageSize}
        &nameOrId=${params.nameOrId}&positionId=${params.positionId}&departmentId=${params.departmentId}
        &headquartersId=${params.headquartersId}&institutionId=${params.institutionId}
        &chainLevel1Id=${params.chainLevel1Id}&chainLevel2Id=${params.chainLevel2Id}&chainLevel3Id=${params.chainLevel3Id}&chainLevel4Id=${params.chainLevel4Id}`,
    })
}

//连锁管理 - 增加连锁员工
export const addChainemployee = (data) => {
    return axios({
        method: 'post',
        url: `chain/chainemployee`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//连锁管理 - 修改连锁员工
export const editChainemployee = (data) => {
    return axios({
        method: 'put',
        url: `chain/chainemployee`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    })
}

//连锁管理 - 获取连锁员工-通过id
export const getChainemployee = (params) => axios.get(`chain/chainemployeedo/${params.id}/headquarters/${params.headquartersId}`)

//连锁管理 - 获取添加连锁员工表单所需数据
export const getChainemployeedo = (params) => axios.get(`chain/chainemployeedo/headquarters/${params.headquartersId}/
institution/${params.institutionId}`)



// 排班设置 - 列表
export const getSetWorkList = params => axios(`organization/duty/page/filter?dutyDate=${params.dutyDate}&page=${params.page}&pageSize=${params.pageSize}&departmentId=${params.departmentId}&positionId=${params.positionId}`)
// 排班设置 - 获取班次列表
export const getDutyconfig = params => axios(`organization/dutyconfig/list`)
// 排班设置 - 获取下拉列表
export const getDutySelect = params => axios('organization/dutyfilterdo')
// 重置修改
export const putReset = data => {
    return axios({
        method: 'put',
        url: `organization/duty/reset`,
        headers: { "Content-Type": 'multipart/from-data' },
        data: data,
    })
}
// export const putReset = params => axios.put('organization/duty/reset', qs.stringify(params))
// 排版设置 - 修改
export const putEditDuty = data => axios.put( `organization/duty`, data )

// 班次管理 - time
export const getBusinessTime  = params => axios('organization/businesshours')
// 班次管理 - 保存
export const postSaveDutys = data => axios.post(`organization/dutyconfig`, data)
// 班次管理 - 修改
export const putEditDutys = data => axios.put(`organization/dutyconfig`, data)
// 班次管理 - 删除
export const deleteDuty = data => axios.delete(`organization/dutyconfig/${data}`)
// 班次管理 - 营业时间
export const PutBusinessHours = data => axios.put(`organization/businesshours`, data)
// 集团报表-地图
export const overviewMap = params => axios.get('chain/report/overview', params)
// 集团报表-新增患者条件
export const incrementalpatient = params => axios.get('chain/report/incrementalpatient', params)
// 集团报表-新增患者初始化
export const incrementalpatientWhole = params => axios.get('chain/report/incrementalpatient/whole', params)
// 集团报表-患者来源条件
export const patientsourceData = params => axios.get('chain/report/patientsource', params)
// 集团报表-患者来源初始化
export const patientsourceWhole = params => axios.get('chain/report/patientsource/whole', params)
// 集团报表-收入统计
export const chargeInstitutionids = params => axios.get('chain/report/charge', params)
// 集团报表-预约统计
export const visitInstitutionids = params => axios.get('chain/report/visit', params)
// 集团报表-收入趋势
export const chargeTrend = params => axios.get('chain/report/charge/trend', params)
// 集团报表-门店
export const treeInstitutions = params => axios.get('chain/chainlevel/tree/institutions', params)
// 集团报表-简单门店
export const treeInstitutionsSimple = params => axios.get('chain/chainlevel/tree/institutions/simple', params)
// 集团报表-收入导出
export const chargeExcel = (params) => {
    return axios({
        method: 'get',
        url: `chain/report/charge/excel?startTime=${params.startTime}&endTime=${params.endTime}&institutionIds=${params.institutionIds}`,
        responseType: 'arraybuffer',
    })
}
// 集团报表-新增患者导出
export const incrementalpatientExcel = (params) => {
    return axios({
        method: 'get',
        url: `chain/report/incrementalpatient/excel?startTime=${params.startTime}&endTime=${params.endTime}&institutionIds=${params.institutionIds}`,
        responseType: 'arraybuffer',
    })
}
// 集团报表-患者来源导出
export const patientsourceExcel = (params) => {
    return axios({
        method: 'get',
        url: `chain/report/patientsource/excel?startTime=${params.startTime}&endTime=${params.endTime}&institutionIds=${params.institutionIds}`,
        responseType: 'arraybuffer',
    })
}
// 集团报表-预约导出
export const appointmentExcel = (params) => {
    return axios({
        method: 'get',
        url: `chain/report/appointment/visit/excel?startTime=${params.startTime}&endTime=${params.endTime}&institutionIds=${params.institutionIds}`,
        responseType: 'arraybuffer',
    })
}
// 集团报表-收入趋势导出
export const trendExcel = (params) => {
    return axios({
        method: 'get',
        url: `chain/report/charge/trend/excel?startTime=${params.startTime}&endTime=${params.endTime}&institutionIds=${params.institutionIds}&queryFlag=${params.queryFlag}`,
        responseType: 'arraybuffer',
    })
}

//患者中心-连锁店患者列表
export const chainPatientList = params => axios.get('chain/patient/page', params)
//患者中心-连锁店患者门店列表
export const chainInstitutionList = params => axios.get('systemcfg/institution/list/chain', params)
// 患者中心- 连锁店患者id获取患者信息
export const chainPatientDetail = params => axios(`/chain/patient/detail/${params}`)

export const chainDeletePatient = data => axios.post(`chain/patient/transfer`,qs.stringify(data))
