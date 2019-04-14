<template>
  <div>
    <a-modal
      :visible="visibled"
      :title="title"
      :maskClosable="maskClosable"
      :footer="null"
      @cancel="cancel"
      :width="800"
    >
      <a-row class="TaskFileDialog">
        <!-- <a-col :span="24">
          <a-input-search
            :style="{width:'45%'}"
            placeholder="项目编号、项目名称、项目负责人"
            @search="onSearch"
            enterButton="搜索"
          />
        </a-col>-->
        <a-col :span="24" :style="{margin:'10px 0'}">
          <a-table :bordered="true" :columns="column" :dataSource="data" :pagination="false">
            <div slot="name" slot-scope="text,record,index">
              <!-- <span :style="{color:'#debd22',marginRight:'10px'}" v-if="record.property == 0">
                <a-icon type="folder" theme="filled" style="font-size: 16px;"/>
              </span> -->
              <span :style="{color:record.iconColor,marginRight:'10px'}">
                <a-icon
                  :type="record.iconType"
                  :theme="record.iconType == 'file-jpg'?'outlined':'filled'"
                  style="font-size: 16px;"
                />
              </span>

              <!-- <a @click="nextFolder(record)" v-if="record.property == 0">{{ text }}</a> -->
              <a @click="downloadFile(record)"  class="download-a" :title="text">{{ text }}</a>
            </div>
          </a-table>
        </a-col>
        <!-- <a-col :span="24" :style="{textAlign:'center'}">
          <a-button type="primary" @click="handlerOk" :style="{marginRight:'10px'}">确定</a-button>
          <a-button type="default" @click="cancel">取消</a-button>
        </a-col>-->
      </a-row>
    </a-modal>
  </div>
</template>
<script>
// import gql from 'graphql-tag'
import moment from 'moment'

export default {
  name: 'TaskFileDialog',
  props: {
    fVisibled: {
      type: Boolean,
      default: false
    },
    fTitle: {
      type: String,
      default: ''
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      visibled: this.fVisibled,
      title: this.fTitle,
      data: this.dataSource,
      //   pageSizeOptions: ['10', '20', '30'], //分页列数
      //   total: 0, //总数
      //   currentPageSize: 10, //表格页的列数
      //   defaultCurrent: 1, //表格当前页
      //   pagination: {}, //分页对象
      //   loading: true, //加载
      //   selectedRowKeys: [], //所选项目
      //   order_byString: '', //排序字符
      //   whereString: '', //查询条件
      column: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 350,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '上传人',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 150,
          align: 'center',
          customRender: text => (text ? text.name : '')
        },
        {
          title: '文件大小',
          dataIndex: 'fileSize',
          key: 'fileSize',
          width: 150,
          align: 'center',
          customRender: text => {
            if (text > 1024 * 1024 * 1024) {
              return (text / (1024 * 1024 * 1024)).toFixed(2) + 'G'
            } else if (text > 1024 * 1024) {
              return (text / (1024 * 1024)).toFixed(2) + 'M'
            } else if (text > 1024) {
              return (text / 1024).toFixed(2) + 'K'
            } else {
              return text + 'B'
            }
          }
        },
        {
          title: '上传时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150,
          align: 'center',
          customRender: text => (text ? moment(text).format('YYYY-MM-DD') : '')
        }
      ]
    }
  },
  created() {},
  methods: {
    cancel() {
      this.$emit('fileCancel', { visibled: false })
    },
    //下级数据处理
    beforeFolderData(beforeData) {
      console.log(beforeData, 'before folder data')
      this.isFirst = false
      beforeData.forEach(ele => {
        // var childData = this.allData.filter(e => (e.parent ? ele.id == e.parent.id : ''))
        // ele.objectNum = childData.length

        // if (ele.property == 1) {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1]
          // ele.downLoadHref = '/apis/upload/'+ ele.url  + ele.name
          ele.downLoadHref = `http://${location.hostname}:15050/upload/` + ele.url + ele.name
        //   console.log(`http://${location.hostname}:15050/upload/` + ele.url + ele.name)
        //   console.log(fileFormat, ele, 'ele')
          if (['doc', 'docx'].indexOf(fileFormat) > -1) {
            ele.iconType = 'file-word'
            ele.iconColor = '#2b82c5'
          } else if (['xls', 'xlsx'].indexOf(fileFormat) > -1) {
            ele.iconType = 'file-excel'
            ele.iconColor = '#3d9364'
          } else if (['png', 'jpg', 'jpeg', 'gif'].indexOf(fileFormat) > -1) {
            ele.iconType = 'file-jpg'
            ele.iconColor = '#40d5b3'
          } else if (['pdf'].indexOf(fileFormat) > -1) {
            ele.iconType = 'file-pdf'
            ele.iconColor = '#de5657'
          } else if (['ppt', 'pptx'].indexOf(fileFormat) > -1) {
            ele.iconType = 'file-ppt'
            ele.iconColor = '#ff8a00'
          } else if (['txt'].indexOf(fileFormat) > -1) {
            ele.iconType = 'file-text'
            ele.iconColor = '#666'
          } else {
            ele.iconType = 'file-unknown'
            ele.iconColor = '#666'
          }
        // }
      })

      this.data = beforeData
    },
     //下载文件
    downloadFile(record) {
      if (this.$auth('download-project-document')) {
        //拥有下载权限
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = record.downLoadHref
        link.setAttribute('download', record.name)

        document.body.appendChild(link)
        link.click()
      }
    },
  },
  watch: {
    fVisibled(newT, oldT) {
      console.log(newT, oldT, '-------')
      this.visibled = newT
      this.beforeFolderData(this.data)
      if (newT) {
        // this.initInfo()
        // this.loadData()
      }
    },
    dataSource(newT) {
        // debugger
        this.beforeFolderData(newT)
    //   this.data = newT
      // console.log(newT,'dataSorce')
    }
  }
}
</script>
<style>
.TaskFileDialog .ant-table-thead > tr > th,
.TaskFileDialog .ant-table-tbody > tr > td {
  padding: 8px;
}
</style>

