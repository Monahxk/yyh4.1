// import axios from '@/api/axios-set'
// import qs from 'qs'
 
// // 工作台 - 医生工作台 - 顶部
// export const getWorkCount = params => axios('/commonVisit/workbench/count')

// // 工作台 - 医生工作台 - 代办 - 就诊
// export const getDentalPatientInfo = params => {
//     let type = params.doctor || ''
//     return axios(`commonVisit/dentalPatientInfo?type=${type}&firststatus=needAll&status=needtodeal&page=${params.page}&pagesize=${params.pageSize}&startTime=${params.startTime}&endTime=${params.endTime}`)
// }
// // 工作台 - 医生工作台 - 代办 - 收费
// export const getChargebillingInfo = params => {
//     let type = params.doctor || ''
//     return axios(`/commonVisit/chargebillinginfo?type=${type}&status=needAll&page=${params.page}&pagesize=${params.pageSize}`)
// }
// // 工作台 - 医生工作台 - 代办 - 病例
// export const getDentalemr = params => {
//     let type = params.doctor || ''
//     return axios(`commonVisit/dentalemr?type=${type}&firststatus=needAll&page=${params.page}&pagesize=${params.pageSize}`)
// }
// // 工作台 - 医生工作台 - 代办 - 回访
// export const getDentalfeedbackInfo = params => {
//     let type = params.doctor || ''
//     return axios(`/commonVisit/dentalfeedback?type=${type}&status=needAll&page=${params.page}&pagesize=${params.pageSize}`)
// }


// // 工作台 - 医生工作台 - 全部 - 就诊
// export const getDentalAll = params => {
//   let type = params.doctor || ''
//   return axios(`commonVisit/dentalPatientInfo?type=${type}&firststatus=all&status=all&page=${params.page}&pageSize=${params.pageSize}`)
// }
// // 工作台 - 医生工作台 - 全部 - 收费
// export const getChargebillingAll = params => {
//   let type = params.doctor || ''
//   return axios(`/commonVisit/chargebillinginfo?type=${type}&status=all&page=${params.page}&pageSize=${params.pageSize}`)
// }
// // 工作台 - 医生工作台 - 全部 - 病例
// export const getAllDentalemr = params => {
//   let type = params.doctor || ''
//   return axios(`commonVisit/dentalemr?type=${type}&firststatus=all&&page=${params.page}&pagesize=${params.pageSize}`)
// }

// // 工作台 - 医生工作台 - 全部 - 回访
// export const getDentalfeedbackInfoAll = params => {
//   let type = params.doctor || ''
//   return axios(`/commonVisit/dentalfeedback?type=${type}&status=all&page=${params.page}&pageSize=${params.pageSize}`)
// }