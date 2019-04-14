<template>
  
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
          <a-dropdown :trigger="['contextmenu']" >
              <div class="item">
                <!-- <span class="checkbox checked"></span> -->
                <a-checkbox class="checkbox" :checked="item.checked" @change="onChange(item,$event)"></a-checkbox>
                <div class="file-img" @click="openDoc(item)">
                  <a :style="{color:item.document.iconColor}">
                    <a-icon
                      :type="item.document.iconType"
                      :theme="item.document.iconType == 'file-jpg'?'outlined':'filled'"
                      style="font-size: 38px;"
                    />
                  </a>
                </div>
                <div class="file-title-box">
                  <span class="file-title" :title="item.document.name">{{item.document.name}}</span>
                </div>
              </div>
            <a-menu slot="overlay" style="width:100px" @click="deleteFavorite">
              <a-menu-item key="1">删除</a-menu-item>
              
            </a-menu>
          </a-dropdown>
        </a-col>
      </a-row>

      <!-- 右键菜单 -->
      <!-- <div v-if="isRight" :style="{position:'fixed',top:client.Y,left:client.X}"> -->
      <!-- <a-button type="danger" @click="deleteFavorite">删除</a-button> -->
      <!-- <a-menu
        style="width: 256px"
        mode="vertical"
        
      >
        <a-menu-item key="1">
          <a-icon type="delete" />
          删除
        </a-menu-item>
      </a-menu>-->
      <!-- </div> -->
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
      isRight: false
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
      let url = `http://${location.hostname}:15050/upload/` + item.document.url + item.document.name
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
    async deleteFavorite() {
      // e.stopPropagation() //阻止冒泡
      let selectData = this.favoriteDocument.filter(ele => ele.checked)
      if(!selectData.length){
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
      console.log(selectData, 'elete')
    }
  }
}
</script>

<style>
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
</style>
