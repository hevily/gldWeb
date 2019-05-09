<template>
  <div class="company-doc">
    <a-row>
      <a-col :span="24" :style="{padding:'10px 0'}">
        <a-row>
          <!-- 面包屑 -->
          <a-col :span="12">
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
          <a-col :span="12" style="text-align:right">
            <!-- 添加目录 -->
            <a class="folderAdd" @click="addFolder" v-if="$auth('upload-project-document')">
              <a-icon type="folder-add"/>
            </a>
            <!-- 上传资料 -->
            <a-upload
              v-if="$auth('upload-project-document')"
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

            <!-- <a-input-search :style="{width:'45%'}" placeholder="请输入文档名称" enterButton="搜索"/> -->
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-table
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :columns="secondColumns"
          :dataSource="secondData"
          :pagination="false"
          @change="tableChange"
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
          <div slot="action" slot-scope="text,record,index">
            <!-- <a v-if="record.isQuick">
              <a-icon
                type="heart"
                theme="filled"
                style="color:#ff5738;font-size:14px"
                title="快捷面板"
                @click="changeStar(1,record,index)"
              />
            </a>
            <a v-else-if="!record.isQuick && record.property == 1">
              <a-icon
                type="heart"
                style="font-size:14px"
                @click="changeStar(2,record,index)"
                title="快捷面板"
              />
            </a>-->
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
          <a-input type="text" v-model="folderName"/>
        </a-col>
      </a-row>

      <template slot="footer">
        <div>
          <a-button type="primary" @click="addFolderOk">确定</a-button>
          <a-button type="default" @click="addFolderCancel">取消</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import { db } from '@/utils/db'
import moment from 'moment'

const secondColumns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 250, sorter: true, scopedSlots: { customRender: 'name' } },
  //   {
  //     title: '对象数量',
  //     dataIndex: 'objectNum',
  //     key: 'objectNum',
  //     width: 100,
  //     scopedSlots: { customRender: 'objectNum' }
  //   },
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
    align: 'center',
    customRender: (text, record) => {
      return moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { title: '文件大小', dataIndex: 'fileSize', key: 'fileSize', width: 120, sorter: true },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 160, scopedSlots: { customRender: 'remark' } },
  //   {
  //     title: '权限',
  //     dataIndex: 'authUsers',
  //     key: 'authUsers',
  //     align: 'center',
  //     width: 80,
  //     scopedSlots: { customRender: 'authUsers' }
  //   },
  { title: '操作', dataIndex: 'action', key: 'action', width: 50, scopedSlots: { customRender: 'action' } }
]
export default {
  name: 'WorkplaceSelfFile',
  props: {
    // projectId: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      companyId: '2c8356b2-a6a9-46d9-ad5b-f02337a5f53c',
      dbConn: null,
      secondColumns,
      secondData: [], //表格数据
      selectedRowKeys: [], //选择
      whereString: '',
      breadCrumb: [{ name: '公司文件' }],
      addFolderVisibled: false,
      addFolderTitle: '添加文件夹',
      folderName: '',
      favoriteDocument: [], //快捷数据
      moment
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    this.dbConn = new db(this.$apollo)

    console.log(this.userInfo)
    this.whereString = `_and:[{type:{_eq:2}}]`
    this.actionHref = `http://${location.hostname}:15050/upload?path=` + this.companyId
    // this.getFavorite()
    this.loadData()
  },
  methods: {
    ...mapMutations(['set_file']),
    async loadData(record, index, orderName) {
      let queryString = `query {
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
            parent {
              id
              name
            }
          }
        }`

      let res = await this.dbConn.query(queryString)
      console.log(res)
      if (index >= 0) {
        this.breadCrumb.splice(index + 1, this.breadCrumb.length)
      } else if (record) {
        this.breadCrumb.push(record)
      } else {
        this.breadCrumb = [{ name: '公司文件' }]
      }
      let data = res.data.Document
      if (this.breadCrumb.length == 1) {
        this.allData = res.data.Document
        data = data.filter(ele => !ele.parent)
        this.actionHref = `http://${location.hostname}:15050/upload?path=` + this.companyId
      } else {
        this.url = this.breadCrumb[this.breadCrumb.length - 1].url
        this.actionHref = `http://${location.hostname}:15050/upload?path=` + this.url
      }

      this.beforeFolderData(data)
    },

    async getFavorite() {
      var queryString = `query {
            FavoriteDocument(where:{project_id:{_eq:"${this.companyId}"},employee_id:{_eq:"${this.userInfo.id}"}}){
                id
                document{
                    id
                    name
                }
                project_id
                document_id
                employee_id
                
            }
        }`
      let res = await this.dbConn.query(queryString)
      this.favoriteDocument = res.data.FavoriteDocument
    },
    //下级数据处理
    beforeFolderData(beforeData) {
      console.log(beforeData, 'before folder data')
      this.isFirst = false
      beforeData.forEach(ele => {
        var childData = this.allData.filter(e => (e.parent ? ele.id == e.parent.id : ''))
        ele.objectNum = childData.length

        var hasFavorite = this.favoriteDocument.filter(e => e.document_id == ele.id)
        if (hasFavorite.length) {
          ele.isQuick = true
          ele.isQuickId = hasFavorite[0].id
        } else {
          ele.isQuick = false
        }

        if (ele.property == 1) {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1]
          ele.downLoadHref = `http://${location.hostname}:15050/upload/` + ele.url + ele.name
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
    //目录下级数据
    nextFolder(record, index, sort) {
      var _this = this
      this.selectedRowKeys = []
      this.selectedRows = []

      this.whereString = `_and:[{parent_id:{_eq:"${record.id}"}}]`
      this.loadData(record, index, sort)
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

        if (orderName == 'createdBy') {
          orderName = `{${orderName}:{name:asc}}`
        } else {
          orderName = `{${orderName}:asc}`
        }
      } else {
        if (orderName == 'createdBy') {
          orderName = `{${orderName}:{name:desc}}`
        } else {
          orderName = `{${orderName}:desc}`
        }
        // orderName += '_DESC'
      }
      //   debugger
      if (this.breadCrumb.length == 1) {
        this.loadData(null, null, orderName)
      } else {
        this.nextFolder(this.breadCrumb[this.breadCrumb.length - 1], this.breadCrumb.length, orderName)
      }

      console.log(orderName, 'table change orderby')
    },
    //面包屑跳转目录
    jumpDoc(item, index) {
      // debugger
      var _this = this
      this.selectedRows = []
      this.selectedRowKeys = []
      //   this.getFavorite()
      this.$emit('changeQuick')
      if (item.id) {
        this.nextFolder(item, index)
      } else {
        this.whereString = `_and:[{type:{_eq:2}}]`
        this.loadData()
      }
    },

    //修改备注
    async documentRemarkChange(record) {
      console.log(record, 'document remark change')
      var _this = this

      var mutate = `mutation{
          update_Document(
            _set:{remark:"${record.remark}"},
            where:{id:{_eq:"${record.id}"}}
          ){
            returning{id}
          }
        }`

      let res = await this.dbConn.mutation(mutate)
      //   this.$apollo
      //     .mutate({
      //       mutation: gql`mutation{
      //       update_Document(
      //         _set:{remark:"${record.remark}"},
      //         where:{id:{_eq:"${record.id}"}}
      //       ){
      //         returning{id}
      //       }
      //     }`
      //     })
      //     .then(res => {
      //       console.log(res, 'update document remark success')
      //       _this.$message.success('更新备注成功')
      //     })
      //     .catch(err => {
      //       console.log(err, 'update document remark error')
      //       _this.$message.error('更新备注失败')
      //     })
    },
    //上传文件
    async handleChange(info) {
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
        let content = '上传了个人资料'
        // if (this.activeKey == 1) {
        //   content = '上传了项目资料'
        // } else if (this.activeKey == 2) {
        //   content = '上传了过程资料'
        // } else {
        //   content = '上传了成果文件'
        // }
        console.log(info.file.name, 'done')
        let parentId = _this.breadCrumb[_this.breadCrumb.length - 1].id
        var url = this.breadCrumb[this.breadCrumb.length - 1].url || _this.companyId
        var mutationString = `mutation {
          insert_Document(objects:[{
              url:"${url}/",
              name: "${info.file.name}", 
              property:1,#文件属性 0:目录 1:文件
              type:2, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档
              fileSize:${info.file.size},
              ${parentId ? `parent_id:"${parentId}",` : ''}
              isLocked:false,
              createdBy_id:"${this.userInfo.id}"
            }]){returning{id}}
            
        }`

        let res = await this.dbConn.mutation(mutationString)
        this.jumpDoc(this.breadCrumb[this.breadCrumb.length - 1], this.breadCrumb.length)
        //   .then(res => {
        //     console.log(res, 'upload file success')

        //   })
        //   .catch(err => {
        //     console.log(err, 'upload file fail')
        //   })
        // console.log(mutationString)
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
        window.open(record.downLoadHref, '_blank')
        // let link = document.createElement('a')
        // link.style.display = 'none'
        // link.href = record.downLoadHref
        // link.setAttribute('download', record.name)

        // document.body.appendChild(link)
        // link.click()
      }
    },

    //添加目录弹框
    addFolder() {
      this.addFolderVisibled = true
      //   if (this.breadCrumb.length == 1) {
      //     this.addFolderTitle = '添加类别'
      //   } else {
      //     this.addFolderTitle = '添加子类别'
      //   }
    },
    //添加文件夹
    async addFolderOk() {
      var _this = this
      var docId = this.breadCrumb[this.breadCrumb.length - 1].id
      var url = this.breadCrumb[this.breadCrumb.length - 1].url || _this.companyId

      var addString = `mutation {
          insert_Document(objects:[
            {	
              name:"${_this.folderName}",
              property:0,
              type:2,
              url:"${url}",
              ${docId ? `parent_id: "${docId}"` : ''}
              createdBy_id:"${_this.userInfo.id}"
            }]){
            returning {
              id
            }
          }
        }`
      console.log(addString)
      let res = await this.dbConn.mutation(addString)
      var _did = res.data.insert_Document.returning[0].id
      var _url = url + '/' + _did

      let updateString = `mutation{
                update_Document(where:{id:{_eq:"${_did}"}},_set:{url:"${_url}"}){
                  returning {id}
                }
              }`

      let res2 = await this.dbConn.mutation(updateString)
      _this.addFolderVisibled = false
      _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)

      //
    },
    //取消添加目录
    addFolderCancel() {
      this.addFolderVisibled = false
    },
    //删除文件、文件夹
    async deleteFolder() {
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
        async onOk() {
          var deleteString = '['
          var deleteFavorate = '['
          _this.selectedRows.forEach(ele => {
            if (ele.property == 0) {
              deleteString += `{url:{_like:"%${ele.url}%"}},`
              deleteFavorate += `{document:{url:{_like:"%${ele.url}%"}}}`
            } else {
              deleteString += `{id:{_eq:"${ele.id}"}},`
              deleteFavorate += `{document:{id:{_eq:"${ele.id}"}}}`
            }

            // var obj = {url_contains:ele.url}
            // deleteArray.push(obj)
          })
          deleteString += ']'
          deleteFavorate += ']'
          console.log(deleteString, 'delete')
          let dString = `mutation{
              delete_FavoriteDocument(
                where:{ _or:${deleteFavorate} }
              ){
                returning { id }
              }
              delete_Document(
                where:{ _or:${deleteString} }
              ){
                returning { id }
              }
              
            }`
          console.log(dString)
          let res = await _this.dbConn.mutation(dString)
          _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)
        },
        onCancel() {}
      })
    },

    //表框选择
    onSelectChange(selectedRowKeys, selectedRows) {
      //表框选择
      //   console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
    async changeStar(type, record, index) {
      console.log(type, record, index, 'changestart')
      let mutateString = ``
      if (type == 1) {
        //取消
        mutateString = `mutation {
                delete_FavoriteDocument(where:{id:{_eq:"${record.isQuickId}"}}){returning{id}}
            }`
      } else {
        mutateString = `mutation {
                insert_FavoriteDocument(objects:[{
                    project_id:"${this.projectId}",
                    document_id:"${record.id}",
                    employee_id:"${this.userInfo.id}"
                }]){returning{id}}
            }`
      }
      console.log(mutateString)
      let res = await this.dbConn.mutation(mutateString)

      // this.getFavorite()
      this.jumpDoc(this.breadCrumb[this.breadCrumb.length - 1], this.breadCrumb.length)
    }
  }
}
</script>

<style>
.company-doc {
  padding: 0 10px 5px;
}
.company-doc .folderAdd,
.company-doc .upload,
.company-doc .delete {
  padding: 5px 10px;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 3px;
  margin-right: 10px;
}
.company-doc .folderAdd:hover,
.company-doc .upload:hover,
.company-doc .delete:hover {
  border: 1px solid #8197d6;
  color: #78bb60;
}
.company-doc .ant-table-thead > tr > th,
.company-doc .ant-table-tbody > tr > td {
  padding: 8px;
}
.company-doc .ant-table-thead > tr > th.ant-table-selection-column,
.company-doc .ant-table-tbody > tr > td.ant-table-selection-column {
  text-align: center;
  min-width: 30px;
  width: 30px;
}
.company-doc .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters,
.company-doc .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters {
  padding-right: 8px !important;
}
</style>
