<!--
 * @Descripttion: 导入excel
 * @version: V4.1
 * @Author: hzj
 * @Date: 2019-09-09 16:23:32
 * @LastEditors: hzj
 * @LastEditTime: 2019-09-19 17:11:27
 -->
<template>
    <div>
		<el-dialog
		:title="imExcelDiaog.dialogTitle"
		:visible.sync="imExcelDiaog.isshow"
		width="40%"
		center>
			<el-row>
				<el-col :span="2" :push="20">
					<el-button icon="el-icon-download" @click="download" :loading="dloading">下载模板</el-button>
				</el-col>
			</el-row>
			<el-upload
			class="upload"
			drag
			action=""
			:auto-upload="false"
			:http-request="uploadSectionFile"
			ref="upload"
			:limit="limit"
			:multiple="multiple"
			>
				<div class="warpper_text">
					<span class="add-icon-upload">+</span>
					<div class="el-upload__text">点击或拖拽填好的模板至此上传</div>
				</div>
			</el-upload>
			<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="importExcelFn()" :loading="loading">确 定</el-button>
			<el-button @click="closeDialog">取 消</el-button>
			</span>
		</el-dialog>
        
    </div>
</template>
<script>
import {uploadInventoryExcel,getDownloadModel} from '@/api'
import {SYSTEM_HTTP_SUCCESS} from '@/constant'
export default {
	props: ["imExcelDiaog"],
	data() {
		return {
			dialogTitle: '导入EXCEL模板',
			limit: 1,
			multiple: false,
			loading: false,
			dloading: false
		}
	},
	methods: {
		download() {
			this.dloading = true;
			getDownloadModel({model: this.imExcelDiaog.model}).then(res => {
				this.dloading = false;
				let filename = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]) || '导入模板.xlsx'
				this.fileDownload(res.data, filename) // response.data是后端返回的二进制数据流，filename是获取到的导出文件名，获取失败使用默认值
			}).catch(res => {
				this.dloading = false;
			})
		},
		fileDownload(data, fileName) {
      	const blob = new Blob([data], {
        type: 'application/octet-stream'
      })
      const filename = fileName || 'filename.xlsx'
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    },
		importExcelFn() {
			this.$refs['upload'].submit();
		},
		closeDialog() {
			this.$refs['upload'].clearFiles();
			this.imExcelDiaog.isshow = false;
		},
		uploadSectionFile(param) {
			this.loading = true;
			var fileObj = param.file;
			var form = new FormData();
			form.append("filePath", fileObj);
			form.append('model',this.imExcelDiaog.model)
			
			uploadInventoryExcel(form).then(res => {
				this.loading = false;
				if(res.data.code == SYSTEM_HTTP_SUCCESS) {
					this.$emit('search');
					this.imExcelDiaog.isshow = false;
				}
				
			}).catch(res => {
				this.loading = false;
			})
			
		}

	}
}
</script>
<style lang="less" scoped>
	.warpper_text {
		height: 40px;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}
	.upload {
		width: 100%;
		margin-top: 20px;
		/deep/ div.el-upload.el-upload--text{
			width: 100%;
			.el-upload-dragger {
				width: 100%;
				height: 300px;
			}
		}
	}
	
	.add-icon-upload {
		width: 24px;
		height: 24px;
		font-size: 20px;
		text-align: center;
		color: #606266;
	}
	.download {
		display: block;
		height: 40px;
		display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
		border-radius: 4px; 
	}

	.download:focus, .download:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
}
</style>


