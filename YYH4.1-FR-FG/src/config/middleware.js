// import { getDentalPatientInfo } from './index'
// import monment from "moment";
// export const docDiagnosis = async () => {
//   return await getDentalPatientInfo({page: 1, pageSize: 10}).then(res => {
//     if (res.data.code === 200) {
//       let _D = res.data.data;
//       let tableDataList = null
//       // 1 是初诊  0 复诊
//       let arr = [
//         "预约",
//         "待治疗",
//         "治疗中",
//         "治疗完成",
//         "转诊",
//         "拍片",
//         "代收费",
//         "已收费",
//         "",
//         "结束就诊"
//       ];
//       this.total = res.data.totalNumber;
//       tableDataList = _D.map(item => {
//         item.num = parseInt(item.visitStatus);
//         item.visitStatusTxt = arr[parseInt(item.visitStatus)];
//         item.firstVisitIndicator == 1 ? (item.firstVisitIndicator = "初诊") : (item.firstVisitIndicator = "复诊");
//         item.registeringDatemonment(item.registeringDate).format("YYYY-MM-DD");

//         if (Object.is(item.sex, null)) {
//           item.sex == '未添加数据'
//         } else if (item.sex == 0) {
//           item.sex == '未知性别'
//         } else {
//           item.sex == 1 ? item.sex = '男' : item.sex = '女' 
//         }
//         return item;
//       });
//       return tableDataList
//     }
//   })
// }
