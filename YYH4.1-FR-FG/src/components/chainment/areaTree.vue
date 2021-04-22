<!--
 * @Descripttion: 门店树结构
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-11-01 09:19:55
 -->
<template> 
    <div class="wrapper-tree" institution="institution">
		<div class="header" v-if="treeCfg.select">
			<el-input v-model="filterText" institution="institution" placeholder="输入关键字"></el-input>
		</div>
		<div class="wrapper-select" :class="{selected: selectedAll}">
			<input type="text" class="filter-input" institution="institution" :class="{selected: selectedAll}" @click="selectAll" readonly :placeholder="chainLevelData.chainLevel?chainLevelData.chainLevel.name:''" />
			<span class="add-icon" v-if="treeCfg.isshowAddBtn && !treeloading" @click="showAddDialog">+</span>
			<i class="el-icon-loading" v-if="treeloading"></i>
		</div>
		<el-tree :data="chainLevelData.subLevelList" ref="tree" :expand-on-click-node="false" 
			default-expand-all  :props="defaultProps" 
			@node-click="handleNodeClick"
			:filter-node-method="filterNode">
			<div class="custom-tree-node" slot-scope="{ node, data }"  :ref="data.chainLevel?data.chainLevel.id: data.id" 
			:text="data.chainLevel ? data.chainLevel.name : data.name">
				{{data.chainLevel ? data.chainLevel.name : data.name }}
				<span class="circ-icon" v-if="treeCfg.isshowAddBtn">
					<el-dropdown :hide-on-click="false" @visible-change="change(data)" @command="handleCommand">
						<span class="el-dropdown-link">
							...
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item v-if="data.chainLevel.level < 4" command="add">添加子区域</el-dropdown-item>
							<el-dropdown-item command="institution">添加门店</el-dropdown-item>
							<el-dropdown-item command="edit">修改名称</el-dropdown-item>
							<el-dropdown-item command="del">删除此区域</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
				<i class="yes-icon el-icon-check" v-if="treeCfg.isshowYes"></i>
			</div>
		</el-tree>

		<el-dialog
			:title="isshowDialog.dialogTitle"
			:visible.sync="isshowDialog.dialogFla"
			width="500px">
			<div class="content">
				<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
					<el-row>
						<el-col :span="24">
							<el-form-item label="区域名称" prop="name">
								<el-input v-model="form.name" placeholder="请输入"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveChainLevel" :loading="loading">确 定</el-button>
				<el-button @click="closeDialog">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {addChainLevel,editChainLevel,delChainLevel,listChainLevel,listChainLevelInstitutions} from '@/api'
let form = {
	id: '',
	level: '',
	name: '',
	chainLevel1Id: '',
	chainLevel2Id: '',
	chainLevel3Id: '',
	chainLevel4Id: '',
	headquartersId: ''
}
export default {
	name: 'areaTree',
	props: ['treeCfg'],
  	data() {
		return {
			loading: false,
			treeloading: true,
			selectedAll: true,
			filterText: '',
			chainLevelData: {},
			defaultProps: {
				children: 'subLevelList',
				// label: 'chainLevel.name'
			},
			isshowDialog: {
				dialogTitle: '新增区域',
				dialogFla: false
			},
			curTreeData: {},
			type: 'add',
			form: Object.assign({},form),
			rules: {
				name: [
					{ required: true, message: '请输入名称', trigger: 'blur' },
					{ min: 1, max: 12, message: '最大12个字符', trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getChainLevelList();
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		}
    },
    methods: {
		showAddDialog() {
			this.isshowDialog.dialogFla = true;
			this.form = Object.assign({},form);
			this.type = 'add';
			this.isshowDialog.dialogTitle = '新增区域';
			this.curTreeData.chainLevel = {};
		},
		closeDialog() {
			this.isshowDialog.dialogFla = false;
			this.$refs['form'].clearValidate();
			this.form = Object.assign({},form);
			this.loading = false;
		},
		//保存新增或则修改
		saveChainLevel() {
			let _this = this;
			_this.loading = true;
			this.$refs['form'].validate((valid) => {
				if (valid) {
					this.form.chainLevel1Id = this.curTreeData.chainLevel.chainLevel1Id;
					this.form.chainLevel2Id = this.curTreeData.chainLevel.chainLevel2Id;
					this.form.chainLevel3Id = this.curTreeData.chainLevel.chainLevel3Id;
					this.form.chainLevel4Id = this.curTreeData.chainLevel.chainLevel4Id;
					this.form.headquartersId = this.curTreeData.chainLevel.headquartersId;
					if(this.type === 'add') {
						if(_this.curTreeData.chainLevel.level) {
							let level = parseInt(_this.curTreeData.chainLevel.level+'');
							if(level < 4) {
								this.form.level = level + 1;
							}
							this.form[`chainLevel${level}Id`] =  this.curTreeData.chainLevel.id;
						} else {
							this.form.level = 1;
						}
						addChainLevel(_this.form).then(res => {
							_this.loading = false;
							_this.isshowDialog.dialogFla = false;
							_this.getChainLevelList();
						}).catch(res => {
							_this.loading = false;
						})
					}else if(this.type === 'edit') {
						this.form.level = this.curTreeData.chainLevel.level;
						editChainLevel(_this.form).then(res => {
							_this.loading = false;
							_this.isshowDialog.dialogFla = false;
							_this.getChainLevelList();
						}).catch(res => {
							_this.loading = false;
						})
					}
					
				} else {
					console.log('error submit!!');
					_this.loading = false;
					return false;
				}
			});
		},
		//获取层级列表，tree
		getChainLevelList() {
			this.treeloading = true;
			if(this.treeCfg.hasInstitution) {
				//带机构的树
				listChainLevelInstitutions().then(res => {
					if(res.data.data) {
						this.chainLevelData = res.data.data;
						if(this.treeCfg.isGettable)this.$emit('getTableList',{chainLevel: res.data.data.chainLevel});
					}
					this.treeloading = false;
				})
			} else {
				listChainLevel().then(res => {
					if(res.data.data) {
						this.chainLevelData = res.data.data;
						if(this.treeCfg.isGettable)this.$emit('getTableList',{chainLevel: res.data.data.chainLevel});
					}
					this.treeloading = false;
				})
			}
			
		},
		handleCommand(type) {
			this.type = type;
			if(type === 'add') {
				this.form = Object.assign({},form);
				this.isshowDialog.dialogFla = true;
				this.isshowDialog.dialogTitle = '新增区域'
			} else if(type === 'edit') {
				this.form = Object.assign({id: this.curTreeData.chainLevel.id,name: this.curTreeData.chainLevel.name});
				this.isshowDialog.dialogFla = true;
				this.isshowDialog.dialogTitle = '修改区域'
			} else if(type === 'del') {
				this.$confirm("此操作将删除该区域, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					delChainLevel(this.curTreeData.chainLevel.id).then(res => {
						this.getChainLevelList();
					})
				}).catch(() => {});
			} else if(type === 'institution') {
				this.$emit('openDialog','add',this.curTreeData);
			}
		},
      	handleNodeClick(data) {
			this.selectedAll = false;
        	this.$emit('treeNodeClick',data)
		},
		selectAll() {
			this.selectedAll = true;
			this.$emit('getTableList',{chainLevel: this.chainLevelData.chainLevel,institutionId: 0});
			this.clearClass();
		},
		//下拉菜单显隐切换
		change(data) {
			let ele = this.$refs[data.chainLevel.id].parentNode;
			this.toggleClass(ele,'hover-bg')
			this.curTreeData = data;
			
		},
		hasClass(ele, cls) {
			return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
		},
		addClass(ele, cls) {
				if (!this.hasClass(ele, cls)) ele.className += " " + cls;
		},
		removeClass(ele, cls) {
			if (this.hasClass(ele, cls)) {
					var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
					ele.className = ele.className.replace(reg, " ");
			}
		},
		toggleClass(ele, cls) {
			if(this.hasClass(ele,cls)){ 
					this.removeClass(ele, cls); 
			}else{ 
					this.addClass(ele, cls); 
			} 
		},
		clearClass() {
			this.$nextTick( () => {
				let ele = document.querySelector('.is-current');
				if(ele) {
					this.removeClass(ele, 'is-current');
				}
			})
		},
		filterNode(value, data) {
			if (!value) return true;
			if(data.chainLevel) {
				return data.chainLevel.name.indexOf(value) !== -1;
			} else {
				return data.name.indexOf(value) !== -1;
			}
	
		}
    } 	
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.circ-icon,.yes-icon {
		position: absolute;
		display: block;
		height: 16px;
		width: 16px;
		line-height: 8px;
		border-radius: 50%;
		right: 20px;
		bottom: 0;
		top: 0;
		margin: auto;
		border: 1px solid #B5BED1;
		font-weight: bold;
		visibility: hidden;
		text-align: center;

		.el-dropdown-link {
			color: #B5BED1;
		}
	}
	.yes-icon {
		display: inline-block;
		border-radius: 0;
		border:  0;
		line-height: normal;
	}
	.el-tree-node__content:hover .circ-icon
	,.is-current > .el-tree-node__content .circ-icon
	,.hover-bg .circ-icon{
		visibility: visible;
	}
	.is-current > .el-tree-node__content 	.yes-icon {
		visibility: visible;
	}
	.el-tree-node__content.hover-bg,/deep/.is-current > .el-tree-node__content {
		background-color: #F5F7FA !important;
	}
	.wrapper-tree {
		width: 100%;
		height: 100%;
		overflow: hidden;;
		background-color: #fff;
		border-right: 1px solid #E4E9FF;

		/deep/.el-tree {
			color: #333!important;

			.el-tree-node__content {
				position: relative;
				min-height: 35px !important;
				height: auto !important;
				transition: height .2s;
				.custom-tree-node {
					width: 100%;
					word-break: break-word;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					&:hover {
						white-space: normal;
					}
				}
			}
		}

		.header {
			padding: 15px;
		}
		.wrapper-select {
			padding: 10px 20px;
			position: relative;
			.filter-input {
				border: 0;
				outline: none;
				height: 35px;
				width: 80%;
				cursor: pointer;
			}

			.add-icon {
				font-size: 24px;
				color: #3B78FD;
				cursor: pointer;
				right: 20px;
				top: 15px;
				position: absolute;
			}
			.el-icon-loading {
				right: 20px;
				top: 15px;
				position: absolute;
			}

		}
		.selected {
			background-color: #F5F7FA;
		}
	}
</style>
