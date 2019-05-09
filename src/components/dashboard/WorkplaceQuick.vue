<template>
<div style="height:100%">
  <a-dropdown :trigger="['contextmenu']">
    <div id="QuickList">
      <a-row class="file-list">
        <a-col
          :span="8"
          v-for="(item,key) in favoriteDocument"
          :key="key"
          :class="['file-item',selectId == item.id || item.checked ? 'file-checked' :'']"
          @mouseover="showQuick(item)"
          @mouseout="hideQuick"
        >
          <div class="item">
            <!-- <span class="checkbox checked"></span> -->
            <a-checkbox class="checkbox" :checked="item.checked" @change="onChange(item,$event)"></a-checkbox>
            <div class="file-img" @click="openDoc(item)">
              <a
                :style="{color:item.document.iconColor}"
                v-if="item.document.iconType != 'file-jpg'"
              >
                <a-icon
                  :type="item.document.iconType"
                  :theme="item.document.iconType == 'file-jpg'?'outlined':'filled'"
                  style="font-size: 38px;"
                />
              </a>
              <a v-else>
                <img
                  style="width: 100%;height: 100%;"
                  :src="`http://${location.hostname}:15050/upload/` + item.document.url + item.document.name"
                >
              </a>
            </div>
            <div class="file-title-box">
              <span class="file-title" :title="item.document.name">{{item.document.name}}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-menu slot="overlay" style="width:100px" @click="oparateFavorite">
      <a-menu-item key="1">删除</a-menu-item>
      <a-menu-item key="2">新建</a-menu-item>
    </a-menu>
  </a-dropdown>
  <a-modal :visible="addShow" title="新建快捷方式" :footer="null" @cancel="cancel">
    <a-row>
      <a-col :span="24" style="margin-bottom:10px">
        <a-row>
          <a-col :span="4" style="text-align:right;line-height:30px">名称：</a-col>
          <a-col :span="18"><a-input v-model="addName"/></a-col>
        </a-row>
      </a-col>
      <a-col :span="24" style="margin-bottom:20px">
        <a-row>
          <a-col :span="4" style="text-align:right;line-height:30px">网址：</a-col>
          <a-col :span="18"><a-input v-model="addUrl"/></a-col>
        </a-row>
      </a-col>
      <a-col :span="24" style="text-align:center">
        <a-button type="primary" style="margin-right:10px;" @click="handlerOk">确定</a-button>
        <a-button type="default" @click="cancel">取消</a-button>
      </a-col>
    </a-row>
  </a-modal>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '@/utils/db'
import moment from 'moment'

export default {
  name: 'WorkplaceQuick',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dbConn: null,
      favoriteDocument: [],
      selectId: '',
      client: {},
      isRight: false,
      location,
      addShow:false,
      addName:'',
      addUrl:'',
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    this.dbConn = new db(this.$apollo)
    this.getFavorite()
    let _this = this
    // window.onclick = function() {
    //   console.log(this.isRight, 'click0000000000000')
    //   _this.isRight = false
    // }
  },
  methods: {
    async getFavorite() {
      var queryString = `query {
            FavoriteDocument(where:{project_id:{_eq:"${this.projectId}"},employee_id:{_eq:"${this.userInfo.id}"}}){
                id
                document{
                    id
                    name
                    url
                    type
                }
                project_id
                document_id
                employee_id
                
            }
        }`
      let res = await this.dbConn.query(queryString)
      var data = res.data.FavoriteDocument.filter(ele => ele.document)
      this.hideQuick()
      console.log(data, 'datagdocumentfavorite')
      data.forEach(e => {
        // debugger
        if (e.document) {
          var ele = e.document
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1] || ''
          fileFormat = fileFormat.toLocaleLowerCase()
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
      this.favoriteDocument = data
    },
    showQuick(item) {
      console.log(item)
      this.selectId = item.id
    },
    hideQuick() {
      // console.log()
      this.selectId = ''
    },
    openDoc(item) {
      console.log(item.document,'item')
      let url = `http://${location.hostname}:15050/upload/` + item.document.url + item.document.name
      if(item.document.type == 5){
        url = item.document.url
      }
      
      window.open(url, '_blank')
    },
    onChange(item, e) {
      console.log(item, e.target.checked)
      item.checked = e.target.checked
    },
    // showRightBotton(event){
    //   event.preventDefault ? event.preventDefault():(event.returnValue = false);
    //   // if()
    //   let selectData = this.favoriteDocument.filter(ele => ele.checked)
    //   if(!selectData.length){
    //     return
    //   }
    //   this.isRight = true
    //   this.client = {
    //     X:event.clientX + 'px',
    //     Y:event.clientY + 'px'
    //   }
    //   console.log(event)
    // },
    async oparateFavorite(e) {
      console.log(e)
      // e.stopPropagation() //阻止冒泡
      if(e.key == 1){
        let selectData = this.favoriteDocument.filter(ele => ele.checked)
        if (!selectData.length) {
          return
        }
        var deleteString = ''
        selectData.forEach(ele => {
          deleteString += `{id:{_eq:"${ele.id}"}},`
        })
        var mutation = `mutation {
          delete_FavoriteDocument(where:{_or:[${deleteString}]}){returning{id}}
        }`

        let res = await this.dbConn.mutation(mutation)
        this.isRight = false

        this.getFavorite()
        this.$emit('changeFile')
      }else if(e.key == 2){
        this.addShow = true
      }
      
      // console.log(selectData, 'elete')
    },

    cancel(){
      this.addShow = false
    },
    async handlerOk(){

      var mutationString = `mutation {
          insert_Document(objects:[{
            url:"${this.addUrl}",
            name: "${this.addName}", 
            property:1,#文件属性 0:目录 1:文件
            type:5, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档 4:任务文档 5:快捷方式
            relatedId:"${this.projectId}",
            projectFileType:4 #项目文件类型 0:项目资料 1:过程文件 2:成果文件 3:公共文档 4:个人文档
            fileSize:0,
            isLocked:false,
            createdBy_id:"${this.userInfo.id}"
          }]){returning{id}}
        }`

        let res = await this.dbConn.mutation(mutationString)

        mutationString = `mutation {
          insert_FavoriteDocument(objects:[{
              project_id:"${this.projectId}",
              document_id:"${res.data.insert_Document.returning[0].id}",
              employee_id:"${this.userInfo.id}"
          }]){returning{id}}
        }`

        let res2 = await this.dbConn.mutation(mutationString)
        this.addShow = false
        this.getFavorite()
        this.$emit('changeFile')
    },
  }
}
</script>

<style>
#QuickList {
  height: 100%;
}
.file-list {
  padding: 4px 0 0 4px;
  overflow: auto;
}
.file-list .file-item {
  float: left;
  height: 90px;
  width: 95px;
  margin-top: 5px;
  margin-left: 5px;
  overflow: hidden;
}
.file-list .file-item .item {
  position: relative;
  box-sizing: border-box;
  width: 90px;
  height: auto;
  border: 1px solid #fff;
  cursor: pointer;
}
.file-list .file-title-box span {
  display: block;
  max-height: 34px;
  line-height: 17px;
  max-width: 200px;
  padding-top: 5px;
  word-wrap: break-word;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.file-list .item .file-img {
  width: 100%;
  height: 54px;
  padding: 16px 2px 2px 2px;
  text-align: center;
}
.file-list .item .checkbox {
  position: absolute;
  left: -1px;
  top: -1px;
  width: 30px;
  height: 30px;
  /* background: url(../img/ico.png) no-repeat 0 -370px; */
  display: none;
}

.checkbox {
  margin: 0;
}
.file-list .file-checked .checked {
  background-position: 0 -420px;
}

.file-list .item .checkbox {
  position: absolute;
  left: -1px;
  top: -1px;
  /* width: 30px;
  height: 30px; */
  width: 16px;
  height: 16px;
  /* background: url(../img/ico.png) no-repeat 0 -370px; */
  display: none;
}
.file-list .item .checkbox .ant-checkbox {
  top: -4px;
}
.file-list .file-checked .checkbox {
  display: block;
}
.file-list .item .file-title-box {
  font-size: 12px;
  padding: 5px;
  text-align: center;
}
.file-list .file-checked .item {
  background: #f3f9fe;
  border: 1px solid #c3d8f0;
  transition: 0.1s;
}
.file-list .file-checked .checked {
  background-position: 0 -420px;
}
.ant-dropdown {
  min-width: 100px !important
}
</style>
