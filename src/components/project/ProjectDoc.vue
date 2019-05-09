<template>
  <div class="projectDoc">
    <a-row>
      <a-col :span="24">
        <a-tabs defaultActiveKey="1" @change="docChange">
          <a-tab-pane tab="送审资料" key="1"></a-tab-pane>
          <a-tab-pane tab="过程文件" key="2"></a-tab-pane>
          <a-tab-pane tab="成果文件" key="3"></a-tab-pane>
          <a-tab-pane tab="打包文件" key="4"></a-tab-pane>
        </a-tabs>
        <!-- <a-radio-group @change="onChange" v-model="value">
          <a-radio-button value="a">项目资料</a-radio-button>
          <a-radio-button value="d">过程文件</a-radio-button>
        </a-radio-group>-->
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-row>
          <!-- 面包屑 -->
          <a-col :span="10">
            <a-breadcrumb :style="{lineHeight:'32px'}">
              <a-breadcrumb-item v-for="(items,index) in breadCrumb" :key="index">
                <a
                  v-if="index != breadCrumb.length - 1"
                  @click="jumpDoc(items,index)"
                  :style="{color:'#78bb60'}"
                >{{items.name}}</a>
                <span v-else>{{items.name}}</span>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </a-col>
          <a-col :span="14" style="text-align:right">
            <a class="folderAdd" title="导入" @click="importDoc" v-if="activeKey !=4">
              <a-icon type="import"></a-icon>
            </a>
            <a class="folderAdd" title="导出" @click="exportDoc" v-if="activeKey !=4">
              <a-icon type="export"></a-icon>
            </a>
            <a class="folderAdd" title="移动" @click="moveDoc" v-if="activeKey !=4">
              <a-icon type="profile"/>
            </a>

            <a class="folderAdd" title="打包压缩" @click="zipDoc" v-if="activeKey ==4">
              <a-icon type="copy"></a-icon>
            </a>

            <a class="folderAdd" title="添加到打包列表" @click="addZip" v-if="activeKey !=4">
              <a-icon type="plus"/>
            </a>

            <!-- 添加目录 -->
            <a
              class="folderAdd"
              @click="addFolder"
              v-if="$auth('upload-project-document') && activeKey !=4"
            >
              <a-icon type="folder-add"/>
            </a>
            <!-- 上传资料 -->
            <a-upload
              v-if="(activeKey != 1 || breadCrumb.length != 1) && $auth('upload-project-document') && activeKey !=4 "
              :style="{display:'inline-block',marginRight:'10px'}"
              :action="actionHref"
              :multiple="true"
              :showUploadList="false"
              @change="handleChange"
            >
              <a-button>
                <a-icon type="upload"/>
              </a-button>
            </a-upload>
            <!-- 删除目录/文件 -->
            <a class="delete" @click="deleteFolder" v-if="$auth('delete-project-document')">
              <a-icon type="delete"/>
            </a>

            <a-input-search :style="{width:'45%'}" placeholder="请输入文档名称" enterButton="搜索"/>
          </a-col>
        </a-row>
        <div :style="{marginTop:'10px'}" class="projectDocList">
          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,columnWidth:'20px'}"
            :columns="firstColumns"
            :dataSource="firstData"
            :pagination="false"
            v-if="isFirst"
          >
            <div slot="name" slot-scope="text,record,index">
              <span :style="{color:'#debd22',marginRight:'10px'}">
                <a-icon type="folder" theme="filled" style="font-size: 16px;"/>
              </span>
              <a @click="nextFolder(record)">{{ text }}</a>
            </div>

            <template slot="remark" slot-scope="text,record,index">
              <a-input
                v-model="record.remark"
                placeholder="输入备注"
                class="remarkInput"
                @blur="documentRemarkChange(record)"
                @pressEnter="documentRemarkChange(record)"
              />
            </template>
          </a-table>

          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :columns="secondColumns"
            :dataSource="secondData"
            :pagination="false"
            @change="tableChange"
            v-else
          >
            <div slot="name" slot-scope="text,record,index">
              <span :style="{color:'#debd22',marginRight:'10px'}" v-if="record.property == 0">
                <a-icon type="folder" theme="filled" style="font-size: 16px;"/>
              </span>
              <span :style="{color:record.iconColor,marginRight:'10px'}" v-else>
                <a-icon
                  :type="record.iconType"
                  :theme="record.iconType == 'file-jpg'?'outlined':'filled'"
                  style="font-size: 16px;"
                />
              </span>

              <a @click="nextFolder(record)" v-if="record.property == 0">{{ text }}</a>
              <a @click="downloadFile(record)" v-else class="download-a" :title="text">{{ text }}</a>
            </div>

            <template slot="remark" slot-scope="text,record,index">
              <a-input
                v-model="record.remark"
                placeholder="输入备注"
                class="remarkInput"
                @blur="documentRemarkChange(record)"
                @pressEnter="documentRemarkChange(record)"
              />
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>

    <!-- 添加类别 -->
    <a-modal
      :visible="addFolderVisibled"
      :title="addFolderTitle"
      width="400px"
      :maskClosable="false"
      @cancel="addFolderCancel"
      class="projectModal"
    >
      <a-row>
        <a-col :span="6" :style="{lineHeight:'32px'}">类别名称：</a-col>
        <a-col :span="16">
          <div style="position:relative" v-if="breadCrumb.length == 1">
            <a-input v-model="folderName" class="leftInput"/>
            <a-select class="rightSelect" v-model="folderName">
              <a-select-option
                v-for="(sItem,sI) in folderNameSelectData"
                :key="sI"
                :value="sItem"
              >{{sItem}}</a-select-option>
            </a-select>
          </div>
          <a-input v-else type="text" v-model="folderName"/>
        </a-col>
      </a-row>

      <template slot="footer">
        <div>
          <a-button type="primary" @click="addFolderOk">确定</a-button>
          <a-button type="default" @click="addFolderCancel">取消</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal :visible="exportVisible" title="导出模板" @cancel="exportCancel" @ok="exportOk">
      <a-row>
        <a-col :span="5" style="text-align:right;line-height:30px">模板名称：</a-col>
        <a-col :span="15">
          <a-input v-model="exportName"/>
        </a-col>
      </a-row>
    </a-modal>

    <a-modal :visible="zipVisible" title="打包压缩" @cancel="zipCancel" @ok="zipOk">
      <a-row>
        <a-col :span="5" style="text-align:right;line-height:30px">压缩包名称：</a-col>
        <a-col :span="15">
          <a-input v-model="zipName"/>
        </a-col>
      </a-row>
    </a-modal>

    <importTemplate
      :iVisible="iVisible"
      :iTitle="iTitle"
      :iType="iType"
      @templateCancel="templateCancel"
      @templateSave="templateSave"
    />

    <moveTemplate
      :projectId="projectId"
      :mVisible="mVisible"
      :mTitle="mTitle"
      :mType="mType"
      :filterId="filterId"
      @moveCancel="moveCancel"
      @moveSave="moveSave"
    />
  </div>
</template>
<script>
import gql from 'graphql-tag'
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { db } from '@/components/_util/db'

import { ArrayToString } from '@/components/_util/StringUtil'
import importTemplate from '@/components/same/importTemplate'
import moveTemplate from '@/components/same/moveTemplate'

import uuid from 'uuid'

import { axios } from '@/utils/request'

import { Icon } from 'ant-design-vue'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1018467_zbasjalz32.js' // 在 iconfont.cn 上生成
})

const firstColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '对象数量', dataIndex: 'objectNum', key: 'objectNum', scopedSlots: { customRender: 'objectNum' } },
  { title: '上传人', dataIndex: 'createdBy', key: 'createdBy' },
  {
    title: '上传时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: (text, record) => {
      return moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 160, scopedSlots: { customRender: 'remark' } },
  {
    title: '权限',
    dataIndex: 'authUsers',
    key: 'authUsers',
    width: 240,
    align: 'center',
    scopedSlots: { customRender: 'authUsers' }
  }
]

const secondColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 400, sorter: true, scopedSlots: { customRender: 'name' } },
  {
    title: '对象数量',
    dataIndex: 'objectNum',
    key: 'objectNum',
    width: 100,
    scopedSlots: { customRender: 'objectNum' }
  },
  {
    title: '上传人',
    dataIndex: 'createdBy',
    key: 'createdBy',
    width: 100,
    sorter: true,
    customRender: (text, record) => {
      return (text || {}).name
    }
  },
  {
    title: '上传时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sorter: true,
    customRender: (text, record) => {
      return moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { title: '文件大小', dataIndex: 'fileSize', key: 'fileSize', width: 120, sorter: true },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 160, scopedSlots: { customRender: 'remark' } },
  {
    title: '权限',
    dataIndex: 'authUsers',
    key: 'authUsers',
    align: 'center',
    width: 80,
    scopedSlots: { customRender: 'authUsers' }
  },
  { title: '', dataIndex: 'action', key: 'action', width: 200, scopedSlots: { customRender: 'action' } }
]

export default {
  name: 'ProjectDoc',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dbConn: new db(this.$apollo), //数据库操作
      firstColumns, //一级目录表格格式
      secondColumns, //下级目录表格格式
      selectedRowKeys: [], //多列选择
      selectedRows: [],
      allData: [], //项目资料所有数据
      firstData: [], //项目资料一级数据
      secondData: [], //项目资料下级数据
      breadCrumb: [{ name: '送审资料' }], //面包屑
      isFirst: true, //是否是一级数据
      folderName: '', //新建目录名称
      folderNameSelectData: [], //一级目录可选数据
      addFolderVisibled: false, //是否增加目录
      addFolderTitle: '', //增加目录弹框标题,
      actionHref: '',
      url: '',
      activeKey: 1, //资料类型 1送审资料、2过程文件、3成果文件
      whereString: '', //刷选条件,
      projectMan: [],
      projectName: '',
      exportVisible: false,
      exportName: '',
      exportData: [],
      iVisible: false, //导入模板弹框
      iTitle: '',
      iType: 1,
      mVisible: false, //移动弹框
      mTitle: '移动目录',
      mType: 0,
      filterId: [],
      importAll: [],
      zipVisible: false, //压缩包弹框
      zipName: ''
    }
  },
  components: {
    MyIcon,
    importTemplate,
    moveTemplate
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    console.log(this.projectId)
    // console.log(this.ArrayToString)
    var _this = this
    this.docChange(1)
    this.loadMember()
  },
  methods: {
    ...mapMutations(['set_file']),
    async loadMember() {
      var member = `query{
          Project(where:{id:{_eq:"${this.projectId}"}}){
            id
            name
            principal_id
            principal {
              id
              name
            }
            members {
              id
              member_id
            }
            chargers {
              charger_id
              id
            }
          }
      }`
      let res = await this.dbConn.query(member)
      let projectInfo = res.data.Project[0]
      this.projectMan = [projectInfo.principal_id] //通知成员上传了资料
      this.projectName = projectInfo.name
      projectInfo.members.forEach(ele => {
        this.projectMan.push(ele.member_id)
      })
      projectInfo.chargers.forEach(ele => {
        this.projectMan.push(ele.charger_id)
      })

      // if(projectInfo.members.length){}
    },

    //项目资料所有数据
    loadData(orderName) {
      var _this = this
      return this.$apollo.query({
        query: gql`query{
           Document(where:{${this.whereString}},${orderName ? `order_by:[${orderName}]` : ''}){
            id
            name
            url
            type
            property
            relatedId
            fileSize
            projectFileType
            remark
            createdBy{
              id
              name
            }
            createdAt
            authUsers{
              id
              employee {
                id
                name
              }
            }
            parent_id
            parent {
              id
              name
            }
          }
        }`,
        fetchPolicy: 'network-only'
      })
    },
    //数据处理（获取一级数据并处理）
    beforeData(beforeData) {
      var data = []
      this.isFirst = false
      this.breadCrumb = []
      if (this.activeKey == 1) {
        data = beforeData.filter(ele => ele.parent == null && ele.projectFileType == 0 && ele.property == 0)
        this.isFirst = true
        this.breadCrumb = [{ name: '送审资料' }]
      } else if (this.activeKey == 2) {
        data = beforeData.filter(ele => ele.parent == null && ele.projectFileType == 1)
        this.breadCrumb = [{ name: '过程文件' }]
      } else if (this.activeKey == 3) {
        data = beforeData.filter(ele => ele.parent == null && ele.projectFileType == 2)
        this.breadCrumb = [{ name: '成果文件' }]
      } else {
        data = beforeData
        this.breadCrumb = []
      }
      this.actionHref = `http://${location.hostname}:15050/upload?path=` + this.projectId
      this.url = this.projectId

      console.log(this.actionHref, this.url)
      this.folderNameSelectData = []
      data.forEach(ele => {
        var childData = this.allData.filter(e => (e.parent ? ele.id == e.parent.id : ''))
        ele.objectNum = childData.length
        if (ele.property == 0) {
          this.folderNameSelectData.push(ele.name)
        }
      })

      this.firstData = data
      if (this.activeKey != 1) {
        this.beforeFolderData(data)
      }
      console.log(data, 'before data')
    },

    //目录下级数据
    nextFolder(record, index, sort) {
      // console.log(record,"next folder")
      // debugger
      var _this = this
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$apollo
        .query({
          query: gql`query{
           Document(where:{parent_id:{_eq:"${record.id}"}},${sort ? `order_by:${sort}` : ''}){
            id
            name
            url
            type
            property
            relatedId
            projectFileType
            remark
            createdAt
            fileSize
            createdBy{
              id
              name
            }
            authUsers{
              id
              employee {name}
            }
            parent_id
            parent {
              id
              name
            }
          }
        }`,
          fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res, 'get next folder Data success')
          if (index >= 0) {
            _this.breadCrumb.splice(index + 1, _this.breadCrumb.length)
          } else {
            _this.breadCrumb.push(record)
          }
          _this.url = _this.breadCrumb[_this.breadCrumb.length - 1].url
          _this.actionHref = `http://${location.hostname}:15050/upload?path=` + _this.url

          console.log(_this.breadCrumb, 'breadCrumb', _this.actionHref)
          _this.beforeFolderData(res.data.Document)
          // _this.beforeData(res.data.documents)
        })
        .catch(err => {
          console.log(err, 'get next folder Data error')
        })
    },
    //下级数据处理
    beforeFolderData(beforeData) {
      console.log(beforeData, 'before folder data')
      this.isFirst = false
      beforeData.forEach(ele => {
        var childData = this.allData.filter(e => (e.parent ? ele.id == e.parent.id : ''))
        ele.objectNum = childData.length

        if (ele.property == 1) {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1]
          // ele.downLoadHref = '/apis/upload/'+ ele.url  + ele.name
          ele.downLoadHref = `http://${location.hostname}:15050/upload/` + ele.url + ele.name
          console.log(`http://${location.hostname}:15050/upload/` + ele.url + ele.name)
          console.log(fileFormat, ele, 'ele')
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
        }
      })

      this.secondData = beforeData
    },

    tableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter, 'table change')
      let _this = this
      if (!sorter.order) {
        return
      }
      var orderName = sorter.field
      if (sorter.order == 'ascend') {
        //顺序
        orderName = `{${orderName}:asc}`
      } else {
        orderName = `{${orderName}:desc}`
        // orderName += '_DESC'
      }
      if (this.breadCrumb.length == 1 && this.activeKey != 1) {
        this.loadData(orderName)
          .then(res => {
            console.log(res, 'get project document Data success')
            _this.allData = res.data.Document
            _this.beforeData(res.data.Document)
          })
          .catch(err => {
            console.log(err, 'get project document Data error')
          })
      } else {
        this.nextFolder(this.breadCrumb[this.breadCrumb.length - 1], this.breadCrumb.length, orderName)
      }

      console.log(orderName, 'table change orderby')
    },

    //修改备注
    documentRemarkChange(record) {
      console.log(record, 'document remark change')
      var _this = this
      this.$apollo
        .mutate({
          mutation: gql`mutation{
          update_Document(
            _set:{remark:"${record.remark}"},
            where:{id:{_eq:"${record.id}"}}
          ){
            returning{id}
          }
        }`
        })
        .then(res => {
          console.log(res, 'update document remark success')
          _this.$message.success('更新备注成功')
        })
        .catch(err => {
          console.log(err, 'update document remark error')
          _this.$message.error('更新备注失败')
        })
    },

    //面包屑跳转目录
    jumpDoc(item, index) {
      var _this = this
      this.selectedRows = []
      this.selectedRowKeys = []
      // debugger
      if (item.id) {
        this.nextFolder(item, index)
      } else {
        //跳回第一级
        this.loadData()
          .then(res => {
            console.log(res, 'get project document Data success')
            _this.allData = res.data.Document
            _this.beforeData(res.data.Document)
          })
          .catch(err => {
            console.log(err, 'get project document Data error')
          })
      }
    },
    //表框选择
    onSelectChange(selectedRowKeys, selectedRows) {
      //表框选择
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
    //添加目录弹框
    addFolder() {
      this.addFolderVisibled = true
      if (this.breadCrumb.length == 1) {
        this.addFolderTitle = '添加类别'
      } else {
        this.addFolderTitle = '添加子类别'
      }
    },
    //添加文件夹
    addFolderOk() {
      var _this = this
      var docId = this.breadCrumb[this.breadCrumb.length - 1].id
      var url = this.breadCrumb[this.breadCrumb.length - 1].url || _this.projectId
      _this.$apollo
        .mutate({
          mutation: gql`mutation {
          insert_Document(objects:[
            {	
              name:"${_this.folderName}",
              property:0,
              type:1,
              url:"${url}",
              relatedId:"${_this.projectId}",
              projectFileType:${_this.activeKey - 1},
              ${docId ? `parent_id: "${docId}"` : ''}
              createdBy_id:"${_this.userInfo.id}"
            }]){
            returning {
              id
            }
          }
        }`
        })
        .then(res => {
          console.log(res, 'add folder sucess')
          var _did = res.data.insert_Document.returning[0].id
          var _url = url + '/' + _did
          console.log(`mutation{
                update_Document(where:{id:{_eq:"${_did}"}},_set:{url:"${_url}"}){
                  returning {id}
                }
              }`)
          _this.$apollo
            .mutate({
              mutation: gql`mutation{
                update_Document(where:{id:{_eq:"${_did}"}},_set:{url:"${_url}"}){
                  returning {id}
                }
              }`
            })
            .then(_res => {
              console.log(_res, 'update folder url success')
              _this.addFolderVisibled = false
              if (_this.breadCrumb.length != 1) {
                _this.loadData().then(__res => {
                  _this.allData = __res.data.Document
                  _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)
                })
              } else {
                _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1])
              }
            })
            .catch(_err => {
              console.log(_err, 'update folder url error')
            })
        })
        .catch(err => {
          console.log(err, 'add folder error')
        })
    },
    //取消添加目录
    addFolderCancel() {
      this.addFolderVisibled = false
    },
    //删除文件、文件夹
    deleteFolder() {
      // console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
      var _this = this
      if (!this.selectedRows.length) {
        this.$message.error('请选中文件')
        return
      }

      this.$confirm({
        title: '删除文档',
        content: `你确定删除已选择文档吗？`,
        onOk() {
          if (_this.activeKey == 4) {
            // var data = []
            // _this.secondData.forEach((e,i) => {
            //   if(_this.selectedRowKeys.indexOf(i) == -1){
            //     data.push(e)
            //   }
            // })

            // _this.secondData = data
            // _this.$ls.set(this.projectId,JSON.stringify(data))
            // _this.selectedRowKeys = []
            _this.setFileList()
            return
          }

          var deleteString = '['
          _this.selectedRows.forEach(ele => {
            if (ele.property == 0) {
              deleteString += `{url:{_like:"%${ele.url}%"}},`
            } else {
              deleteString += `{id:{_eq:"${ele.id}"}},`
            }

            // var obj = {url_contains:ele.url}
            // deleteArray.push(obj)
          })
          deleteString += ']'
          console.log(deleteString, 'delete')
          // return
          _this.$apollo
            .mutate({
              mutation: gql`mutation{
              delete_Document(
                where:{ _or:${deleteString} }
              ){
                returning { id }
              }
            }`
            })
            .then(res => {
              console.log(res, 'delete project document success')
              if (_this.breadCrumb.length != 1) {
                _this.loadData().then(__res => {
                  _this.allData = __res.data.Document
                  _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)
                })
              } else {
                _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1])
              }
            })
            .catch(err => {
              console.log(err, 'delete project document error')
            })
        },
        onCancel() {}
      })
    },
    //上传文件
    handleChange(info) {
      let _this = this
      _this.set_file(info.fileList)
      if (info.file.status == 'uploading') {
        //上传中
        console.log(info.file.name, 'info')
        // this.$message.success('上传中')
      }
      if (info.file.status == 'done') {
        //上传完成
        // this.$message.success('上传完成')
        let content = ''
        if (this.activeKey == 1) {
          content = '上传了项目资料'
        } else if (this.activeKey == 2) {
          content = '上传了过程资料'
        } else {
          content = '上传了成果文件'
        }
        console.log(info.file.name, 'done')
        let parentId = _this.breadCrumb[_this.breadCrumb.length - 1].id
        var url = this.breadCrumb[this.breadCrumb.length - 1].url || _this.projectId

        let notificationString = ''
        if (this.projectMan.length) {
          var notification = `【${this.userInfo.name}】上传了【${info.file.name}】资料到【${this.projectName}】项目`
          var obj = ''
          this.projectMan.forEach(e => {
            obj += ` {
                type: 4
                name: "${notification}"
                status: 0,
                project_id:"${this.projectId}",
                recipients: {
                  data: {recipient_id:"${e}"}
                }
              }
            `
          })
          notificationString = `insert_Notification(objects: [${obj}]){returning {id}}`
        }

        var mutationString = `mutation {
          insert_Document(objects:[{
              url:"${url}/",
              name: "${info.file.name}", 
              property:1,#文件属性 0:目录 1:文件
              type:1, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档
              relatedId:"${this.projectId}",
              projectFileType:${this.activeKey - 1} #项目文件类型 0:项目资料 1:过程文件 2:成果文件
              fileSize:${info.file.size},
              ${parentId ? `parent_id:"${parentId}",` : ''}
              isLocked:false,
              createdBy_id:"${this.userInfo.id}"
            }]){returning{id}}
            insert_Summary(objects:[
              { content: "${content}", createdBy_id: "${_this.userInfo.id}",project_id:"${_this.projectId}"}
            ]){
              returning{id}
            }
            ${notificationString}
        }`

        console.log(mutationString)

        this.dbConn
          .mutation(mutationString)
          .then(res => {
            console.log(res, 'upload file success')
            _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)
          })
          .catch(err => {
            console.log(err, 'upload file fail')
          })
        console.log(mutationString)
      }
      if (info.file.status == 'error') {
        //失败
        // this.$message.success('上传失败')
      }
    },
    //下载文件
    downloadFile(record) {
      if (this.$auth('download-project-document')) {
        //拥有下载权限
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = record.downLoadHref

        window.open(record.downLoadHref, '_blank')
        // link.setAttribute('download', record.name)

        // document.body.appendChild(link)
        // link.click()
      }
    },
    //切换类型
    docChange(e) {
      console.log(e, 'tabs change')
      let _this = this
      this.activeKey = e
      this.mType = e - 1
      this.selectedRowKeys = []
      if (e == 1) {
        this.whereString = `_and:[{relatedId:{_eq:"${this.projectId}"}},{type:{_eq:1}},{projectFileType:{_eq:0}}]`
      } else if (e == 2) {
        this.whereString = `_and:[{relatedId:{_eq:"${this.projectId}"}},{type:{_in:[1,4]}},{projectFileType:{_eq:1}}]`
      } else {
        this.whereString = `_and:[{relatedId:{_eq:"${this.projectId}"}},{type:{_eq:1}},{projectFileType:{_eq:2}}]`
      }
      if (e != 4) {
        this.loadData()
          .then(res => {
            console.log(res, 'get project document Data success')
            _this.allData = res.data.Document
            _this.beforeData(res.data.Document)
          })
          .catch(err => {
            console.log(err, 'get project document Data error')
          })
      } else {
        var document = JSON.parse(this.$ls.get(this.projectId) || JSON.stringify([]))
        _this.beforeData(document)
      }
    },

    exportDoc() {
      console.log(this.allData.filter(ele => ele.property == 0))

      let docData = this.allData.filter(ele => ele.property == 0)

      //  let firstData = docData.filter(ele => !ele.parent)
      docData.forEach(ele => {
        let childData = docData.filter(e => ele.id == (e.parent || {}).id)
        childData.length ? (ele.child = childData) : ''
      })

      let firstData = docData.filter(ele => !ele.parent)
      this.exportData = firstData
      this.exportVisible = true
      //  console.log(ArrayToString(firstData))
    },
    exportCancel() {
      this.exportVisible = false
    },
    async exportOk() {
      let mutation = `mutation {
        insert_Template(objects:[{
          data:${ArrayToString(this.exportData)},
          name:"${this.exportName}",
          type:1
        }]){
          returning{id}
        }
      }`
      console.log(mutation)
      let res = await this.dbConn.mutation(mutation)
      this.$message.success('导出成功')
      this.exportVisible = false
    },
    importDoc() {
      // console.log(this.allDate)
      this.iTitle = '导入模板'
      this.iVisible = true
    },
    templateCancel() {
      this.iVisible = false
    },
    templateSave(data) {
      let _this = this
      this.$confirm({
        title: '导入目录树',
        content: `是否导入目录树?`,
        async onOk() {
          let ImportJSON = data
          var newJSON = []
          var url = _this.breadCrumb[_this.breadCrumb.length - 1].url || _this.projectId
          var parent_id = _this.breadCrumb[_this.breadCrumb.length - 1].id || null
          // console.log(ImportJSON,'ImportJSON')
          let _data = _this.isFirst ? _this.firstData : _this.secondData.filter(e => e.property == 0)
          let newData = []
          _data.forEach(e => {
            newData.push(e.name)
          })
          let importData = []
          ImportJSON.forEach(ele => {
            // debugger
            if (newData.indexOf(ele.name) == -1) {
              importData.push(ele)
            }
          })
          _this.importAll = []
          // console.log(importData,'importData')
          _this.getDocTreeData(importData, url, parent_id)
          console.log(_this.importAll, 'importAll')
          if (_this.importAll.length) {
            _this.importAllDocument(_this.importAll)
            _this.$message.success('导入成功')
            setTimeout(function() {
              _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)
            }, 100)
          }
          _this.iVisible = false
        },
        onCancel() {}
      })
    },

    getDocTreeData(data, url, parentId) {
      if ((data || []).length) {
        data.forEach(ele => {
          let id = uuid()
          let _url = url + '/' + id
          var obj = {
            id: id,
            url: _url,
            name: ele.name,
            property: 0,
            type: 1,
            relatedId: this.projectId,
            projectFileType: this.activeKey - 1,
            parent_id: parentId || null,
            createdBy_id: this.userInfo.id
          }
          this.importAll.push(obj)
          if (ele.child) {
            this.getDocTreeData(ele.child, _url, id)
          }
        })
      }
    },

    async importAllDocument(data) {
      let insertString = `mutation{insert_Document(objects:${ArrayToString(data)}){returning{id}}}`
      let res = await this.dbConn.mutation(insertString)
      console.log(res, insertString)
    },

    //移动目录弹框显示
    moveDoc() {
      // debugger
      this.filterId = []
      this.selectedRows.forEach(e => {
        this.filterId.push(e.id)
      })
      this.mVisible = true
    },
    //取消移动
    moveCancel() {
      this.mVisible = false
    },
    //确定移动
    async moveSave(obj) {
      var update = []
      this.selectedRows.forEach(e => {
        if (e.property == 1) {
          var _obj = {
            id: e.id,
            parent_id: obj.id,
            url: obj.url + '/',
            oldUrl: e.url,
            oldParent_id: e.parent_id,
            name: e.name,
            property: e.property
          }
          update.push(_obj)
        } else {
          let child = this.allData.filter(ele => ele.url.indexOf(e.url) > -1)

          child.forEach(ele => {
            var _obj = {}
            _obj = {
              id: ele.id,
              parent_id: obj.id,
              url: ele.url.replace(e.url, obj.url + '/' + ele.id),
              oldUrl: ele.url,
              oldParent_id: ele.parent_id,
              name: ele.name,
              property: ele.property
            }
            if (ele.id == e.id) {
              _obj.parent_id = obj.id
            } else {
              _obj.parent_id = ele.parent_id
            }
            update.push(_obj)
          })
          console.log(child)
        }
      })

      for (const e of update) {
        let mutationString = `mutation{update_Document(where:{id:{_eq:"${e.id}"}},_set:{parent_id:"${e.parent_id}",url:"${e.url}"}){returning{id}}}`
        console.log(mutationString,e)
        if(e.property == 1){
          let res = await axios({
            url: '/fs/rename',
            method: 'post',
            data: { oldPath: e.oldUrl, newPath: e.url,type:0 ,name:e.name}
          })
        }
        let res2 =  await this.dbConn.mutation(mutationString)
      }
      this.mVisible = false
      this.jumpDoc(this.breadCrumb[this.breadCrumb.length - 1], this.breadCrumb.length)
      this.$message.success('移动成功')
      console.log('done!')

      // update.forEach(e => {

        

      //   console.log(res2,res)

      // })

      console.log(this.allData, obj, update)
    },
    //添加到打包列表
    addZip() {
      let res = this.$ls.get(this.projectId) || JSON.stringify([])
      res = JSON.parse(res)
      res = res.concat(this.selectedRows)
      console.log(res, this.projectId)
      this.$ls.set(this.projectId, JSON.stringify(res))
      // res.forEach(e =>)
    },

    zipDoc() {
      this.zipVisible = true
    },

    zipCancel() {
      this.zipVisible = false
    },

    async zipOk() {
      console.log(this.selectedRows)
      if (!this.selectedRows.length) {
        this.$message.warning('请选择文件！')
        return
      }
      // let url = `http://${location.hostname}:15050/fs/zipFile`
      let newUrl = `${this.projectId}/` + this.zipName + '.zip'
      let fileList = []
      this.selectedRows.forEach(e => {
        var obj = { path: e.url + e.name, name: e.name }
        fileList.push(obj)
      })
      let res = await axios({
        url: '/fs/zipFile',
        method: 'post',
        data: { newZipPath: newUrl, fileList: JSON.stringify(fileList) }
      })
      console.log(res)
      // this.deleteFolder()
      var content = '压缩文件'
      var mutationString = `mutation {
          insert_Document(objects:[{
              url:"${this.projectId}/",
              name: "${this.zipName + '.zip'}", 
              property:1,#文件属性 0:目录 1:文件
              type:1, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档
              relatedId:"${this.projectId}",
              projectFileType:2 #项目文件类型 0:项目资料 1:过程文件 2:成果文件
              fileSize:${res.fileSize},
              isLocked:false,
              createdBy_id:"${this.userInfo.id}"
            }]){returning{id}}
            insert_Summary(objects:[
              { content: "${content}", createdBy_id: "${this.userInfo.id}",project_id:"${this.projectId}"}
            ]){
              returning{id}
            }
        }`

      let res2 = this.dbConn.mutation(mutationString)

      this.setFileList()
      this.zipVisible = false
      this.$message.success('打包成功')
      console.log(res)
    },

    setFileList() {
      var data = []
      this.secondData.forEach((e, i) => {
        if (this.selectedRowKeys.indexOf(i) == -1) {
          data.push(e)
        }
      })

      this.secondData = data
      this.$ls.set(this.projectId, JSON.stringify(data))
      this.selectedRowKeys = []
    }

    // download (data,record) {

    // }

    // renderItemFun(item, index) {
    //   var that = this
    //   return <a-list-item>{that.renderItemDiv(item, index, 1, true)}</a-list-item>
    // },

    // renderItemDiv(item, index, type, show) {
    //   var that = this

    //   return (
    //     <div class={show ? 'show' : 'hide'} style="width:100%;">
    //       {item.property == 0 ? (
    //         <div style={`width:100%;${type == 2 ? 'padding-left:30px' : ''}`}>
    //           <div style="height:40px;line-height:40px;border-bottom:1px solid #e8e8e8">
    //             <span class="pointer" style="margin-right:5px">
    //               {item.children ? !item.show ? <a-icon type="plus-square" /> : <a-icon type="minus-square" /> : ''}
    //             </span>
    //             <span>
    //               <span class="ellips" style="max-width:120px;font-size:16px;color: #555;">
    //                 {item.name}
    //               </span>
    //               <span style="margin-left:40px;color: #999;font-size:14px">
    //                 {type == 1 ? <a-icon type="plus" title="添加子节点" class="pointer" style="margin-left:5px" /> : ''}
    //                 <a-icon type="edit" title="修改名称" class="pointer" style="margin-left:5px" />
    //                 <a-icon type="delete" title="删除" class="pointer" style="margin-left:5px" />
    //               </span>
    //             </span>
    //             <span style="max-width:100px;margin-left:40px">
    //               <a-input type="text" style="max-width:100px" />
    //             </span>
    //             <span style="float:right">
    //               <a-button icon="upload">上传资料</a-button>
    //             </span>
    //           </div>
    //           {item.children
    //             ? item.children.length
    //               ? item.children.map(function(item2, index2) {
    //                   return that.renderItemDiv(item2, index2, 2, item.show)
    //                 })
    //               : ''
    //             : ''}
    //         </div>
    //       ) : (
    //         <div style={`width:100%;height:40px;line-height:40px; ${type == 2 ? 'padding-left:30px' : ''}`}>
    //           <a-row style="border-bottom:1px solid #e8e8e8">
    //             <a-col span="9">
    //               <span>
    //                 <my-icon type="icon-officeicon-1" style="" />
    //                 <a
    //                   href={item.url}
    //                   style="max-width:300px;margin-left:15px;display: inline-block;line-height: 18px;position: relative;top: 3px;"
    //                   class="ellips"
    //                 >
    //                   {item.name}.word
    //                 </a>
    //               </span>
    //             </a-col>
    //             <a-col span="2">
    //               <span>19.33KB</span>
    //             </a-col>
    //             <a-col span="3">2019-01-21 09:18:50 </a-col>
    //             <a-col span="3">上传人：吴立新</a-col>
    //             <a-col span="4">
    //               <a-input />
    //             </a-col>
    //             <a-col span="3" style="text-align:right;padding-right:10px">
    //               <a-icon type="export" title="移动" class="pointer" style="margin-left:5px" />
    //               <a-icon type="download" title="下载" class="pointer" style="margin-left:5px" />
    //               <a-icon type="delete" title="删除" class="pointer" style="margin-left:5px" />
    //             </a-col>
    //           </a-row>
    //         </div>
    //       )}
    //     </div>
    //   )
    // }
  }
}
</script>

<style>
.projectDocList .hide {
  display: none;
}
.projectDocList .show {
  display: block;
}
.projectDocList .pointer {
  cursor: pointer;
}
.ellips {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.projectDocList .ant-list-split .ant-list-item {
  border-bottom: none;
}

.projectDocList .remarkInput {
  border: none;
  line-height: 28px;
  height: 28px;
  font-size: 13px;
  padding: 0px;
}
.projectDocList .remarkInput:focus {
  box-shadow: none;
}

.projectDocList .ant-table-thead > tr > th,
.projectDocList .ant-table-tbody > tr > td {
  padding: 8px;
  font-size: 13px;
}

.projectDocList .ant-table-thead > tr > th.ant-table-selection-column,
.projectDocList .ant-table-tbody > tr > td.ant-table-selection-column {
  min-width: 26px;
  width: 26px;
}

.projectDoc .folderAdd,
.projectDoc .upload,
.projectDoc .delete {
  padding: 5px 10px;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 3px;
  margin-right: 10px;
}
.projectDoc .folderAdd:hover,
.projectDoc .upload:hover,
.projectDoc .delete:hover {
  border: 1px solid #8197d6;
  color: #78bb60;
}
.projectModal .ant-modal-footer {
  border-top: 0;
  text-align: center;
}
.leftInput {
  position: absolute;
  z-index: 9;
  width: 90%;
  border-radius: unset;
  left: 2px;
  outline: 0;
  box-shadow: none;
  height: 28px;
  top: 2px;
  border: 0;
}
.leftInput:hover {
  box-shadow: none;
  border-color: #fff;
}
.leftInput:focus {
  border-color: #fff;
  outline: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.rightSelect {
  width: 100%;
}
.download-a {
  max-width: 220px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  top: 4px;
}
.projectDoc .ant-tabs-nav-wrap {
  background: unset !important;
}
</style>


