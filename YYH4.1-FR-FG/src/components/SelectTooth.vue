<!--
@Author: ZJZ
@Date:   2019-08-01
@Filename: SelectTooth.vue
@Last modified by:   ZJZ
@Last modified time: 2019-10-21
-->

<template>
	<!-- 选择牙位功能模块
  author：zhoujinzhong
  Date：2019年3月20日  -->
	<div class="tooth_chunk" >
		<el-tabs v-model="activeName" stretch @tab-click="handleClick">
				<el-tab-pane label="恒牙" name="first">
					<div class="inner_tooth select_tooth">
						<div class="top_left">
							<el-checkbox-group border v-model="ltCheckedList" >
								<el-checkbox v-for="city in tooth.lt" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="top_right">
							<el-checkbox-group border v-model="rtCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.rt" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="bottom_left">
							<el-checkbox-group border v-model="lbCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.lb" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="bottom_right">
							<el-checkbox-group border v-model="rbCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.rb" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>

				</el-tab-pane>
				<el-tab-pane label="乳牙" name="second">
					<div class="inner_tooth2 select_tooth">
						<div class="top_left">
							<el-checkbox-group border v-model="ry_ltCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.ry_lt" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="top_right">
							<el-checkbox-group border v-model="ry_rtCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.ry_rt" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="bottom_left">
							<el-checkbox-group border v-model="ry_lbCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.ry_lb" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="bottom_right">
							<el-checkbox-group border v-model="ry_rbCheckedList" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="city in tooth.ry_rb" :label="city.id" :key="city.id">
									<img :src="city.img" alt="">
									<span class="tooth_id">{{city.id}}</span>
								</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>

				</el-tab-pane>
			</el-tabs>

			<div class="tooth_chunk_footer">
				<el-button class="btn-primary btn-save" type="primary" @click="submitFun">确 认</el-button>
			</div>

    </div>
</template>
<script>
	export default {
		props:['reqData'],
		data(){
			return {
				toothData:{},	//返回数据
				activeName: 'first',//牙齿选择导航
				ltCheckedList:[],	//左上角选中数据
				rtCheckedList:[],//右上角选中数据
				lbCheckedList:[],//左下角选中数据
				rbCheckedList:[],//右下角选中数据
				ry_ltCheckedList:[],	//乳牙-----左上角选中数据
				ry_rtCheckedList:[],  //乳牙-----右上角选中数据
				ry_lbCheckedList:[],  //乳牙-----左下角选中数据
				ry_rbCheckedList:[],  //乳牙-----右下角选中数据
	      tooth:{
	        lt:[
	          {id:8,img:require('../assets/img/toothPosition/lt/l-t8.png')},
	          {id:7,img:require('../assets/img/toothPosition/lt/l-t7.png')},
	          {id:6,img:require('../assets/img/toothPosition/lt/l-t6.png')},
	          {id:5,img:require('../assets/img/toothPosition/lt/l-t5.png')},
	          {id:4,img:require('../assets/img/toothPosition/lt/l-t4.png')},
	          {id:3,img:require('../assets/img/toothPosition/lt/l-t3.png')},
	          {id:2,img:require('../assets/img/toothPosition/lt/l-t2.png')},
	          {id:1,img:require('../assets/img/toothPosition/lt/l-t1.png')},
	        ],
	        rt:[
	          {id:1,img:require('../assets/img/toothPosition/rt/r-t1.png')},
	          {id:2,img:require('../assets/img/toothPosition/rt/r-t2.png')},
	          {id:3,img:require('../assets/img/toothPosition/rt/r-t3.png')},
	          {id:4,img:require('../assets/img/toothPosition/rt/r-t4.png')},
	          {id:5,img:require('../assets/img/toothPosition/rt/r-t5.png')},
	          {id:6,img:require('../assets/img/toothPosition/rt/r-t6.png')},
	          {id:7,img:require('../assets/img/toothPosition/rt/r-t7.png')},
	          {id:8,img:require('../assets/img/toothPosition/rt/r-t8.png')},
	        ],
	        lb:[
	          {id:8,img:require('../assets/img/toothPosition/lb/l-b8.png')},
	          {id:7,img:require('../assets/img/toothPosition/lb/l-b7.png')},
	          {id:6,img:require('../assets/img/toothPosition/lb/l-b6.png')},
	          {id:5,img:require('../assets/img/toothPosition/lb/l-b5.png')},
	          {id:4,img:require('../assets/img/toothPosition/lb/l-b4.png')},
	          {id:3,img:require('../assets/img/toothPosition/lb/l-b3.png')},
	          {id:2,img:require('../assets/img/toothPosition/lb/l-b2.png')},
	          {id:1,img:require('../assets/img/toothPosition/lb/l-b1.png')},
	        ],
	        rb:[
	          {id:1,img:require('../assets/img/toothPosition/rb/r-b1.png')},
	          {id:2,img:require('../assets/img/toothPosition/rb/r-b2.png')},
	          {id:3,img:require('../assets/img/toothPosition/rb/r-b3.png')},
	          {id:4,img:require('../assets/img/toothPosition/rb/r-b4.png')},
	          {id:5,img:require('../assets/img/toothPosition/rb/r-b5.png')},
	          {id:6,img:require('../assets/img/toothPosition/rb/r-b6.png')},
	          {id:7,img:require('../assets/img/toothPosition/rb/r-b7.png')},
	          {id:8,img:require('../assets/img/toothPosition/rb/r-b8.png')},
	        ],
	        ry_lt:[
	          {id:'E',img:require('../assets/img/toothPosition/ry/lt/l-tE.png')},
	          {id:'D',img:require('../assets/img/toothPosition/ry/lt/l-tD.png')},
	          {id:'C',img:require('../assets/img/toothPosition/ry/lt/l-tC.png')},
	          {id:'B',img:require('../assets/img/toothPosition/ry/lt/l-tB.png')},
	          {id:'A',img:require('../assets/img/toothPosition/ry/lt/l-tA.png')},
	        ],
	        ry_rt:[
	          {id:'A',img:require('../assets/img/toothPosition/ry/rt/r-tA.png')},
	          {id:'B',img:require('../assets/img/toothPosition/ry/rt/r-tB.png')},
	          {id:'C',img:require('../assets/img/toothPosition/ry/rt/r-tC.png')},
	          {id:'D',img:require('../assets/img/toothPosition/ry/rt/r-tD.png')},
	          {id:'E',img:require('../assets/img/toothPosition/ry/rt/r-tE.png')},
	        ],
	        ry_lb:[
	          {id:'E',img:require('../assets/img/toothPosition/ry/lb/l-bE.png')},
	          {id:'D',img:require('../assets/img/toothPosition/ry/lb/l-bD.png')},
	          {id:'C',img:require('../assets/img/toothPosition/ry/lb/l-bC.png')},
	          {id:'B',img:require('../assets/img/toothPosition/ry/lb/l-bB.png')},
	          {id:'A',img:require('../assets/img/toothPosition/ry/lb/l-bA.png')},
	        ],
	        ry_rb:[
	          {id:'A',img:require('../assets/img/toothPosition/ry/rb/r-bA.png')},
	          {id:'B',img:require('../assets/img/toothPosition/ry/rb/r-bB.png')},
	          {id:'C',img:require('../assets/img/toothPosition/ry/rb/r-bC.png')},
	          {id:'D',img:require('../assets/img/toothPosition/ry/rb/r-bD.png')},
	          {id:'E',img:require('../assets/img/toothPosition/ry/rb/r-bE.png')},
	        ],
	      },
			}
		},
		watch:{
			reqData(curVal,oldVal){
				this.reqDataFun(curVal)
				this.activeName='first'
	     },
		},
		created() {
			let _this=this
			// let data=_this.reqData
			_this.reqDataFun(_this.reqData)
    },
    methods:{
			reqDataFun(data){
				let _this=this
				let a=[]
				_this.ltCheckedList=[]
				_this.rtCheckedList=[]
				_this.lbCheckedList=[]
				_this.rbCheckedList=[]
				_this.ltCheckedList=data.leftUpValue.replace(/[^0-9]/ig,"") || []
				_this.ry_ltCheckedList=data.leftUpValue.split('').reverse().join('').match(/^[A-Z]+/gi) || []

				_this.rtCheckedList=data.rightUpValue.replace(/[^0-9]/ig,"") || []
				_this.ry_rtCheckedList=data.rightUpValue.split('').reverse().join('').match(/^[A-Z]+/gi) || []


				_this.lbCheckedList=data.leftDownValue.replace(/[^0-9]/ig,"") || []
				_this.ry_lbCheckedList=data.leftDownValue.split('').reverse().join('').match(/^[a-z|A-Z]+/gi) || []


				_this.rbCheckedList=data.rightDownValue.replace(/[^0-9]/ig,"") || []
				_this.ry_rbCheckedList=data.rightDownValue.split('').reverse().join('').match(/^[a-z|A-Z]+/gi) || []
				if(_this.ry_ltCheckedList.length>0){
					_this.ry_ltCheckedList=_this.ry_ltCheckedList[0].split('')
				}
				if(_this.ry_rtCheckedList.length>0){
					_this.ry_rtCheckedList=_this.ry_rtCheckedList[0].split('')
				}
				if(_this.ry_lbCheckedList.length>0){
					_this.ry_lbCheckedList=_this.ry_lbCheckedList[0].split('')
				}
				if(_this.ry_rbCheckedList.length>0){
					_this.ry_rbCheckedList=_this.ry_rbCheckedList[0].split('')
				}


				if(_this.ltCheckedList.length>0){
					_this.ltCheckedList=_this.ltCheckedList.split('').map(Number)
				}
				if(_this.rtCheckedList.length>0){
					_this.rtCheckedList=_this.rtCheckedList.split('').map(Number)
				}
				if(_this.lbCheckedList.length>0){
					_this.lbCheckedList=_this.lbCheckedList.split('').map(Number)
				}
				if(_this.rbCheckedList.length>0){
					_this.rbCheckedList=_this.rbCheckedList.split('').map(Number)
				}

			},
			// ltCheckedList:[],	//左上角选中数据
			// rtCheckedList:[],//右上角选中数据
			// lbCheckedList:[],//左下角选中数据
			// rbCheckedList:[],//右下角选中数据
			// ry_ltCheckedList:[],	//乳牙-----左上角选中数据
			// ry_rtCheckedList:[],  //乳牙-----右上角选中数据
			// ry_lbCheckedList:[],  //乳牙-----左下角选中数据
			// ry_rbCheckedList:[],  //乳牙-----右下角选中数据
			submitFun(){
				this.toothData.leftUpValue=this.ltCheckedList.concat(this.ry_ltCheckedList).join('')
			this.toothData.rightUpValue=this.rtCheckedList.concat(this.ry_rtCheckedList).join('')
				this.toothData.leftDownValue=this.lbCheckedList.concat(this.ry_lbCheckedList).join('')
				this.toothData.rightDownValue=this.rbCheckedList.concat(this.ry_rbCheckedList).join('')
				this.$emit('selectToothFun',this.toothData)
				// this.
			},

			handleCheckedCitiesChange(value) {

			},
			handleClick(tab, event) { //内弹窗导航状态
	    },

    }
	}
</script>
<style lang="less">
.tooth_chunk{
	// .el-tabs__header{
	// 	border:1px solid #E4E9FF;
	// 	border-radius: 4px;
	// 	width: 120px;
	// 	margin:auto;
	// 	.el-tabs__item{
	// 		// padding:0 20px !important;
	// 	}
	// }
	.inner_tooth,.inner_tooth2{
		width: 90%;
		margin: auto;
		// text-align: center;
		>div{
			padding:20px;
		}
	}
	.inner_tooth2{
		width: 60%;
	}
	.select_tooth{  //选择牙的十字架
		display: flex;
		flex-wrap:wrap;
		cursor: pointer;
		>div{
			display: inline-block;
			width: 49%;

		}
		.el-checkbox{
			// display: inline-flex;
			// align-items:flex-end;
			// flex-direction:column-reverse;
			width: 35px;
			text-align: center;
			img{
				width: 30px;
				margin-left: -30px;
			}
			.el-checkbox__input{
				margin-top: 70px;
				position: relative;
				left: 5px;
			}
			.tooth_id{
				margin-left: -26px;
				position: relative;
				top: 20px;
			}
		}
		.top_left{
			border-right: 1px solid #3B78FD;
			border-bottom: 1px solid #3B78FD;
			text-align: right;
		}
		.bottom_left{
			border-right: 1px solid #3B78FD;
			text-align: right;
		}
		.top_right{
				border-bottom: 1px solid #3B78FD;
		}
	}
	.tooth_chunk_footer{
		margin-top: 20px;
		text-align: center;
	}
}
</style>
