<template>
  <div>
    <a-row>
      <a-col :span="18" :style="{height:this.screen.height/2 + 'px'}">
        <a-row>
          <a-card
            class="message-card"
            :loading="loading"
            :title="name"
            :bordered="false"
            :head-style="{backgroundColor: '#fff', display: 'none'}"
            :body-style="{borderBottom: 'solid 1px #e7e7e7', backgroundColor: '#f7f7f7', height: this.screen.height/2 - 133 + 'px', overflow: 'hidden', overflowY: 'auto'}"
          >
            <div v-if="loadingMore" style="text-align: center">
              <!--<a-spin/>-->
            </div>
            <a-list class="message-list" size="small" :dataSource="activities">
              <div slot="renderItem" class="message-item" slot-scope="item, index">
                <!-- 我的 -->
                <div class="message_cell" v-if="item.sender.id === userInfo.id">
                  <a-avatar
                    :src="item.sender.headPortrail || '../../avatar.png'"
                    style="float:right"
                  />
                  <div class="sender" style="text-align: right;">{{ formatTime(item.createdAt) }}</div>
                  <div style="text-align: right;">
                    <a-dropdown :trigger="['contextmenu']">
                      <div
                        class="send-body"
                        v-if="[0,3].indexOf(item.type) > -1"
                      >{{ getTypeDesc(item) }}</div>
                      <div class="send-body" v-else-if="item.type == 1">
                        <img
                          :style="{width:'70px',height:'70px'}"
                          @click="openDoc(item)"
                          :src="item.body.src"
                        >
                      </div>
                      <div class="send-body" v-else>
                        <a @click="openDoc(item)">{{item.body.name}}</a>
                      </div>
                      <a-menu slot="overlay" style="width:100px" @click="deleteMessage(item,index)">
                        <a-menu-item key="1">删除</a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                </div>
                <!-- 别人的 -->
                <div class="message_cell" v-else>
                  <a-avatar
                    :src="item.sender.headPortrail || '../../avatar.png'"
                    style="float:left"
                  />
                  <div
                    class="sender"
                  >{{ item.sender.name }}&nbsp;&nbsp;{{ formatTime(item.createdAt) }}</div>
                  <div>
                    <div
                      class="send-body"
                      v-if="[0,3].indexOf(item.type) > -1"
                    >{{ getTypeDesc(item) }}</div>
                    <!-- 图片 -->
                    <div class="send-body" v-else-if="item.type == 1">
                      <img
                        :style="{width:'70px',height:'70px'}"
                        @click="openDoc(item)"
                        :src="item.body.src"
                      >
                    </div>
                    <!-- 文件 -->
                    <div class="send-body" v-else>
                      <a @click="openDoc(item)">{{item.body.name}}</a>
                    </div>
                  </div>
                </div>
              </div>
              <div id="msg_end" style="height:0px; overflow:hidden"></div>
            </a-list>
          </a-card>
        </a-row>
        <a-row style="background-color: #f7f7f7; padding: 5px">
          <a-col>
            <a-select defaultValue="0" style="width: 90px" @change="onTypeChange">
              <a-select-option value="0">文本</a-select-option>
              <a-select-option value="3">日志</a-select-option>
            </a-select>&nbsp;&nbsp;
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="true"
              :action="actionSrc"
              @change="handleChange"
            >
              <a href="#" title="文件">
                <a-icon type="upload" style="font-size: 18px"/>
              </a>
            </a-upload>&nbsp;&nbsp;
            <a-upload
              name="file"
              accept="image/png, image/jpeg"
              :showUploadList="false"
              :multiple="true"
              :action="actionSrc"
              @change="handleChange"
            >
              <a href="#" title="图片">
                <a-icon type="picture" style="font-size: 18px"/>
              </a>
            </a-upload>
            <!-- <a href="#" title="文件">
              <a-icon type="upload" style="font-size: 18px"/>
            </a>
            &nbsp;&nbsp;
            <a href="#" title="图片">
              <a-icon type="picture" style="font-size: 18px"/>
            </a>-->
          </a-col>
        </a-row>
        <a-row>
          <a-textarea
            class="message-input"
            placeholder="输入消息内容"
            :rows="4"
            :value="message"
            @pressEnter="onSend"
            @change="onMessageChange"
          />
        </a-row>
      </a-col>
      <a-col :span="6" class="setScroll" :style="{height:this.screen.height/2 + 'px'}">
        <div style="text-align: center;margin-top: 5px;">
          <a-radio-group
            :defaultValue="1"
            buttonStyle="solid"
            :value="this.activityKey"
            @change="filterDoc"
          >
            <a-radio-button :value="1">
              <a-icon type="file-jpg" title="图片"/>
            </a-radio-button>
            <a-radio-button :value="2">
              <a-icon type="file-word" title="文档"/>
            </a-radio-button>
            <a-radio-button :value="3">
              <a-icon type="file-text" title="图纸"/>
            </a-radio-button>
            <a-radio-button :value="4">
              <a-icon type="ellipsis" title="其他"/>
            </a-radio-button>
          </a-radio-group>
          <!-- <a-button type="default" style="margin-right:5px">照片</a-button>
          <a-button type="default">文件</a-button>-->
        </div>
        <a-list :dataSource="documents" class="docList" v-if="activityKey != 1">
          <a-list-item slot="renderItem" slot-scope="item, index" style="width: 100%;">
            <a-dropdown :trigger="['contextmenu']">
              <div
                style="width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor:pointer"
                @click="openDoc2(item)"
              >
                <span :style="{color:item.iconColor,marginRight:'5px'}">
                  <a-icon
                    :type="item.iconType"
                    :theme="item.iconType == 'file-jpg'?'outlined':'filled'"
                    style="font-size: 16px;"
                  />
                </span>
                {{item.name}}
              </div>
              <a-menu slot="overlay" style="width:100px" @click="copyFile(item,$event)">
                <a-menu-item key="1">拷贝</a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-list-item>
          <!-- <div slot="header">Header</div>
          <div slot="footer">Footer</div>-->
        </a-list>

        <a-row v-else style="margin-top:10px" id="container">
          <a-col :span="12" v-for="(item,key) in documents" :key="key" class="box1">
            <a-dropdown :trigger="['contextmenu']">
              <div style="margin:2px" @click="openDoc2(item)" class="box_img">
                <img :src="item.downLoadHref" style>
              </div>
              <a-menu slot="overlay" style="width:100px" @click="copyFile(item,$event)">
                <a-menu-item key="1">拷贝</a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
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
import moment from 'moment'
import { db } from '@/utils/db.js'
import { mapState } from 'vuex'

import moveTemplate from '@/components/same/moveTemplate'
import { axios } from '@/utils/request'

export default {
  name: 'WorkplaceWechat',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dbConn: null,
      name: '',
      // timeFix: timeFix(),
      // projectId: '',
      avatar: '',
      messageType: '0',
      message: '',
      user: {},
      limit: 20,
      minId: '', //加载更多使用的比较Id
      maxId: '', //实时订阅使用的比较Id
      activities: [],
      loadingMore: false,
      loading: false,
      actionSrc: '', //上传路径
      location, //window.location
      documents: [], //展示的文件
      allDocArray: [], //聊天中所有的文件
      screen: {}, //屏幕像素
      activityKey: 1,
      pictureType: [
        'bmp',
        'jpg',
        'png',
        'tif',
        'gif',
        'pcx',
        'tga',
        'exif',
        'fpx',
        'svg',
        'psd',
        'cdr',
        'pcd',
        'dxf',
        'ufo',
        'eps',
        'ai',
        'raw',
        'WMF',
        'webp'
      ],
      mVisible: false, //移动弹框
      mTitle: '送审资料',
      mType: 0,
      filterId: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  components: {
    moveTemplate
  },
  created() {
    this.dbConn = new db(this.$apollo)

    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    this.projectId = this.$route.query.projectId
    this.actionSrc = `http://${location.hostname}:15050/upload?path=` + this.projectId
    this.name = this.$route.query.name
    this.getLastMessage()
  },
  mounted() {
    let _this = this
    _this.screen = {
      height: document.body.clientHeight
    }

    // window.onresize = () => {
    //   console.log('resize')
    //   return (() => {
    //       _this.screen = {
    //         height:document.body.clientHeight
    //       }
    //   })()
    // }
    document
      .getElementsByClassName('message-card')[0]
      .getElementsByClassName('ant-card-body')[0]
      .addEventListener('scroll', this.onScroll)
  },
  methods: {
    //更多
    async getMoreMessage() {
      const gql = `
          query {
            ProjectMessage(where: {project_id:{_eq: "${this.projectId}"},type:{_in:[0,1,2]}, createdAt:{_lt: "${
        this.minId
      }"}}, order_by: [{createdAt: desc}], limit: ${this.limit}){
              id
              type
              project_id
              sender {
                id
                name
                headPortrail
              }
              body
              createdAt
            }
          }
        `
      var res = await this.dbConn.query(gql)

      if (res.data && res.data.ProjectMessage.length > 0) {
        const more = res.data.ProjectMessage
        more.reverse()
        this.minId = more[0].createdAt
        this.activities = more.concat(this.activities)
        this.activitiesBefore(this.activities)
      }
      this.loadingMore = false
    },
    async getLastMessage() {
      var res = await this.dbConn.query(`
          query {
            ProjectMessage(where: {project_id:{_eq: "${
              this.projectId
            }"},type:{_in:[0,1,2]}}, order_by: [{createdAt: desc}], limit: ${this.limit}){
              id
              type
              project_id
              sender {
                id
                name
                headPortrail
              }
              body
              createdAt
            }
          }
        `)

      if (res.data) {
        this.activities = this.activities.concat(res.data.ProjectMessage)
        this.maxId = (this.activities[0] || {}).createdAt || ''
        this.activities.reverse()
        this.minId = (this.activities[0] || {}).createdAt

        this.sendingMsg = true
        this.activitiesBefore(this.activities)
        this.getActivity()
        // this.getDocument()
      }
    },

    //实时监听
    getActivity() {
      // this.$http.get('/workplace/activity')
      //   .then(res => {
      //     this.activities = res.result
      //   })
      const _this = this
      const subQuery = gql`subscription {
            ProjectMessage(where: {project_id:{_eq: "${this.projectId}"},type:{_in:[0,1,2]},${
        this.maxId ? `createdAt:{_gt:"${this.maxId}"}` : ''
      }}, order_by: [{createdAt: desc}], limit: 1){
              id
              type
              project_id
              sender {
                id
                name
                headPortrail
              }
              body
              createdAt
            }
          }`

      const observer = this.$apollo.subscribe({
        query: subQuery,
        variables: {}
      })

      console.log(observer, 'observerobserver')
      observer.subscribe({
        next(data) {
          console.log(data, 'getActivity')
          // _this.activities = data.data.ProjectMessage
          _this.activities = _this.activities.concat(data.data.ProjectMessage)
          _this.activitiesBefore(_this.activities)
          _this.getDocument()
          setTimeout(function() {
            _this.scrollToEnd()
          }, 0)
        },
        error(error) {
          console.error(error)
        }
      })
    },

    activitiesBefore(data) {
      console.log(data, 'activitiesBefore')
      data.forEach(e => {
        if (
          e.type == 1 &&
          moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss') > moment('2019-04-16').format('YYYY-MM-DD HH:mm:ss')
        ) {
          var newNameArray = e.body.name.split('.')
          newNameArray[newNameArray.length - 2] = newNameArray[newNameArray.length - 2] + '_small'
          e.body.src = `http://${location.hostname}:15050/upload/` + e.body.url + '/' + newNameArray.join('.')
        } else {
          e.body.src = `http://${location.hostname}:15050/upload/` + e.body.url + '/' + e.body.name
        }
      })
      this.activities = data
    },
    //滚动到底部
    scrollToEnd() {
      // debugger
      const msg_end = document.getElementById('msg_end')
      if (msg_end) {
        msg_end.scrollIntoView()
      }
    },
    onScroll(e) {
      // console.log(e)
      if (e.target.scrollTop < 10) {
        console.log('滚动到顶')
        this.loadingMore = true
        this.getMoreMessage()
        e.target.scrollTop = 10
      }
    },
    formatTime(d) {
      return moment(d).format('HH:mm')
    },
    async onSend(e) {
      this.sendingMsg = true
      const res = await this.dbConn.mutation(
        `
            mutation insertMessage($body: jsonb) {
              insert_ProjectMessage(objects: [
                {
                  type: ${this.messageType}
                  body: $body
                  project_id: "${this.projectId}"
                  sender_id: "${this.userInfo.id}"
                }
              ]){
                returning {
                  id
                }
              }
            }
          `,
        {
          body: {
            text: e.currentTarget.value
          }
        }
      )

      console.log(res, 'send message')

      if (!res.data) {
        this.$message.success('发送失败，请重试')
      } else {
        this.message = ''
      }
    },
    //消息类型
    onTypeChange(value) {
      this.messageType = value
    },
    onMessageChange(e) {
      this.message = e.target.value
    },
    messageAddPre(name) {
      this.message = '@' + name
    },
    onUpload(e) {
      alert('upload')
    },
    getTypeDesc(item) {
      let desc = ''
      switch (item.type) {
        case 0: //文本
          desc = item.body.text
          break
        case 1: //图片
          // desc = `<img src="${item.body.url}">`
          break
        case 2: //文件
          // desc = `<a href="${item.body.url}">${item.body.name}</a>`
          break
        case 3: //日志
          desc = `[日志]${item.body.text}`
          break
      }
      return desc
    },

    //上传文件
    async handleChange(info) {
      let _this = this
      if (info.file.status == 'uploading') {
        //上传中
        console.log(info.file.name, 'info')
        // this.$message.success('上传中')
      }
      if (info.file.status == 'done') {
        //上传完成
        // this.$message.success('上传完成')
        // let content = ''
        // if(this.activeKey == 1){
        //   content = '上传了项目资料'
        // }else if(this.activeKey == 2){
        //   content = '上传了过程资料'
        // }else {
        //   content = '上传了成果文件'
        // }
        console.log(info.file.name, 'done')
        // let parentId = _this.breadCrumb[_this.breadCrumb.length - 1].id
        var url = _this.projectId
        var mutationString = `mutation {
          insert_Document(objects:[{
              url:"${url}/",
              name: "${info.file.name}", 
              property:1,#文件属性 0:目录 1:文件
              type:1, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档
              relatedId:"${this.projectId}",
              projectFileType:3 #项目文件类型 0:项目资料 1:过程文件 2:成果文件 3:公共文档 4:个人文档
              fileSize:${info.file.size},
              isLocked:false,
              createdBy_id:"${this.userInfo.id}"
            }]){returning{id}}
           
        }`
        console.log(mutationString)
        let res = await this.dbConn.mutation(mutationString)
        if (!res.data) {
          return
        }

        // let pictureType = [
        //   'bmp',
        //   'jpg',
        //   'png',
        //   'tif',
        //   'gif',
        //   'pcx',
        //   'tga',
        //   'exif',
        //   'fpx',
        //   'svg',
        //   'psd',
        //   'cdr',
        //   'pcd',
        //   'dxf',
        //   'ufo',
        //   'eps',
        //   'ai',
        //   'raw',
        //   'WMF',
        //   'webp'
        // ]
        let nameArray = info.file.name.split('.')
        let fileFormat = nameArray[nameArray.length - 1]
        fileFormat = fileFormat.toLocaleLowerCase()
        let messageType = this.pictureType.indexOf(fileFormat) > -1 ? 1 : 2
        //  ? messageType = 1: messageType = 2
        this.sendingMsg = true
        const res2 = await this.dbConn.mutation(
          `
            mutation insertMessage($body: jsonb) {
              insert_ProjectMessage(objects: [
                {
                  type: ${messageType}
                  body: $body
                  project_id: "${this.projectId}"
                  sender_id: "${this.userInfo.id}"
                }
              ]){
                returning {
                  id
                }
              }
            }
          `,
          {
            body: {
              text: info.file.name,
              url: `${url}`,
              name: info.file.name,
              docId: res.data.insert_Document.returning[0].id
            }
          }
        )

        console.log(res2, 'send message')

        if (!res2.data) {
          this.$message.success('上传失败')
        } else {
          this.message = ''
        }
        // this.dbConn
        //   .mutation(mutationString)
        //   .then(res => {
        //     console.log(res, 'upload file success')
        //     _this.jumpDoc(_this.breadCrumb[_this.breadCrumb.length - 1], _this.breadCrumb.length)
        //   })
        //   .catch(err => {
        //     console.log(err, 'upload file fail')
        //   })
        // console.log(mutationString)
      }
      if (info.file.status == 'error') {
      }
    },

    //打开文件
    openDoc(item) {
      var url = `http://${location.hostname}:15050/upload/` + item.body.url + '/' + item.body.name

      window.open(url, '_blank')
    },
    //打开文件
    openDoc2(item) {
      var url = item.downLoadHref

      window.open(url, '_blank')
    },
    //删除聊天记录
    async deleteMessage(item, index) {
      console.log(item, index, this.activities)
      var mutationString = ``
      if (item.type == 1 || item.type == 2) {
        mutationString = `mutation{
          delete_ProjectMessage(where:{id:{_eq:"${item.id}"}}){returning{id}}
          ${item.body.docId ? `delete_Document(where:{id:{_eq:"${item.body.docId}"}}){returning{id}}` : ''}
        }`
      } else {
        mutationString = `mutation{
          delete_ProjectMessage(where:{id:{_eq:"${item.id}"}}){returning{id}}
        }`
      }
      console.log(mutationString)
      let res = await this.dbConn.mutation(mutationString)
      if (res.data) {
        this.activities.splice(index, 1)
      }

      console.log(item, index, this.activities)
    },
    async getDocument() {
      var query = `query {
        Document(where:{relatedId:{_eq:"${this.projectId}"},type:{_eq:1},projectFileType:{_eq:3}}){
          id
          name
          url
          type
          fileSize
          createdAt
          property
          relatedId
        }
      }`

      let res = await this.dbConn.query(query)
      this.allDocArray = res.data.Document
      var data = this.allDocArray.filter(ele => {
        var fileFormat = ele.name.split('.')
        fileFormat = fileFormat[fileFormat.length - 1] || ''
        fileFormat = fileFormat.toLocaleLowerCase()
        return this.pictureType.indexOf(fileFormat) > -1
      })
      // this.beforeDocument(data)
      this.filterDoc({ target: { value: this.activityKey || 1 } })
      console.log(res, 'getAllDataT')
    },
    beforeDocument(data) {
      data.forEach(ele => {
        if (ele.property == 1) {
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
          } else if (this.pictureType.indexOf(fileFormat) > -1) {
            //在这个时间后才有缩略图
            // debugger
            if (
              moment(ele.createdAt).format('YYYY-MM-DD HH:mm:ss') > moment('2019-04-16').format('YYYY-MM-DD HH:mm:ss')
            ) {
              var newNameArray = ele.name.split('.')
              newNameArray[newNameArray.length - 2] = newNameArray[newNameArray.length - 2] + '_small'
              ele.downLoadHref = `http://${location.hostname}:15050/upload/` + ele.url + newNameArray.join('.')
            }

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
      // console.log()
      this.documents = data
      let _this = this

      if (this.activityKey == 1) {
        setTimeout(function() {
          _this.imgLocation('container', 'box1')
        }, 100)
      }
      // this.filterDoc(this.activityKey || 1)
    },

    //类型选择
    filterDoc(e) {
      // console.log(e.target.checked)
      this.activityKey = e.target.value
      var data = []

      var workType = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'ppt', 'pptx', 'txt']
      if (e.target.value == 1) {
        data = this.allDocArray.filter(ele => {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1] || ''
          fileFormat = fileFormat.toLocaleLowerCase()
          return this.pictureType.indexOf(fileFormat) > -1
        })
      } else if (e.target.value == 2) {
        data = this.allDocArray.filter(ele => {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1] || ''
          fileFormat = fileFormat.toLocaleLowerCase()
          return workType.indexOf(fileFormat) > -1
        })
      } else if (e.target.value == 3) {
        data = this.allDocArray.filter(ele => {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1] || ''
          fileFormat = fileFormat.toLocaleLowerCase()
          return ['dwg'].indexOf(fileFormat) > -1
        })
      } else {
        data = this.allDocArray.filter(ele => {
          var fileFormat = ele.name.split('.')
          fileFormat = fileFormat[fileFormat.length - 1] || ''
          fileFormat = fileFormat.toLocaleLowerCase()
          return (
            workType.indexOf(fileFormat) == -1 &&
            this.pictureType.indexOf(fileFormat) == -1 &&
            ['dwg'].indexOf(fileFormat) == -1
          )
        })
      }
      this.beforeDocument(data)
    },
    imgLocation(parent, content) {
      //将parent下所有的content全部取出
      // debugger
      var cparent = document.getElementById(parent)
      var ccontent = this.getChildElement(cparent, content)
      console.log(ccontent)
      var imgWidth = ccontent[0].clientWidth - 2 //得到第一张图片的宽度
      console.log(imgWidth)
      console.log(document.getElementById(parent).clientWidth)
      //  （页面宽度/一张图片的宽度）  固定一排盛放的个数
      var cols = Math.floor(document.getElementById(parent).clientWidth / imgWidth)
      console.log(cols, 'cols')
      // cparent.style.cssText = 'width:' + imgWidth * cols + 'px;margin:0 auto'
      //承载第一排盒子的高度
      var BoxHeightArr = []
      for (var i = 0; i < ccontent.length; i++) {
        // 存放图片的高度
        if (i < cols) {
          BoxHeightArr[i] = ccontent[i].offsetHeight
          console.log(BoxHeightArr[i], 'BoxHeightArr[i]')
        } else {
          var minheight = Math.min.apply(null, BoxHeightArr)
          // console.log(minheight);
          var minIndex = this.getminheightLocation(BoxHeightArr, minheight)
          ccontent[i].style.position = 'absolute'
          ccontent[i].style.top = minheight + 'px'
          ccontent[i].style.left = ccontent[minIndex].offsetLeft + 'px'
          BoxHeightArr[minIndex] = BoxHeightArr[minIndex] + ccontent[i].offsetHeight
          console.log(BoxHeightArr[minIndex], ' BoxHeightArr[minIndex]')
        }
      }
    },
    getminheightLocation(BoxHeightArr, minHeight) {
      for (var i in BoxHeightArr) {
        if (BoxHeightArr[i] == minHeight) {
          return i
        }
      }
    },
    getChildElement(parent, content) {
      var contentArr = []
      var allcontent = parent.getElementsByTagName('*') //得到所有内容
      for (var i = 0; i < allcontent.length; i++) {
        if (allcontent[i].className.indexOf(content) > -1) {
          contentArr.push(allcontent[i]) //追加到contentArr数组
        }
      }
      return contentArr
    },

    copyFile(item, e) {
      // console.log(item,e)
      this.moveItem = item
      this.mVisible = true
    },

    moveCancel() {
      this.mVisible = false
    },
    async moveSave(obj) {
      console.log(this.selectedRows, obj)
      //只支持文件
      var update = []
      var _obj = {
        id: this.moveItem.id,
        parent_id: obj.id,
        url: obj.url + '/',
        oldUrl: this.moveItem.url,
        oldParent_id: this.moveItem.parent_id,
        name: this.moveItem.name,
        property: this.moveItem.property,
        fileSize: this.moveItem.fileSize
      }
      update.push(_obj)
      // this.selectedRows.forEach(e => {
      //   if (e.property == 1) {

      //   }
      // })
      console.log(update)
      // return
      for (const e of update) {
        let mutationString = `mutation{insert_Document(objects:[
          {
            name:"${e.name}",
            property:${e.property},
            type:1,
            url:"${e.url}",
            fileSize:${e.fileSize},
            relatedId:"${this.projectId}",
            projectFileType:${obj.projectFileType},
            ${e.parent_id ? `parent_id: "${e.parent_id}"` : ''}
            createdBy_id:"${this.userInfo.id}"
          }]
        ){returning{id}}}`
        console.log(mutationString, e)
        if (e.property == 1) {
          let res = await axios({
            url: '/fs/copy',
            method: 'post',
            data: { oldPath: e.oldUrl + e.name, newPath: e.url, name: e.name }
          })
        }
        let res2 = await this.dbConn.mutation(mutationString)
      }
      this.$message.success('拷贝成功')
      this.mVisible = false
      // let data = this.selectedRows.filter(e => )
    }
  }
}
</script>

<style  lang="scss">
body {
  padding-right: 0 !important;
}
.message-input {
  border: solid 0 #ededed;
  background-color: #f7f7f7;
  resize: none;
}

.message-input:focus {
  border: solid 0 #ededed;
  box-shadow: 0 0 0 0 #fff;
}

.message-input:active {
  border: solid 0 #ededed;
}

.message-card {
  /*background-color: #f7f7f7;*/
  .message-list {
  }

  .message-item {
    border-bottom: 0px;
    margin: 10px;
  }

  .sender {
    font-weight: 400;
    color: #999999;
    font-size: 12px;
    padding: 0px 40px 2px 40px;
  }

  .send-time {
    font-weight: 400;
    color: #999999;
    font-size: 12px;
  }

  .send-body {
    color: #333333;
    width: auto;
    display: inline-block !important;
    display: inline;
    background-color: #fff;
    padding: 8px;
    border-radius: 5px;
    margin-left: 7px;
    margin-right: 7px;
  }
}

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #78bb60;
      }
    }
  }
  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #78bb60;
      }
    }
    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }
  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;
    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }
    &:hover {
      span {
        color: #78bb60;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
.docList {
  .ant-list-item {
    padding: 5px;
    .ant-list-item-content {
      width: 100%;
    }
  }
}
.setScroll {
  max-height: 518px;
  overflow: auto;
  .ant-radio-button-wrapper {
    padding: 0 8px;
  }
}
.setScroll::-webkit-scrollbar {
  width: 5px;
  background-color: #eee;
}

.setScroll::-webkit-scrollbar-track {
  background-color: #eee;
}

.setScroll::-webkit-scrollbar-thumb {
  // background: #3db6a4;
}

.setScroll::-webkit-scrollbar-button:start {
  // background: url(./imgs/up.png) no-repeat;
  background-size: 12px 12px;
}

.setScroll::-webkit-scrollbar-button:end {
  // background: url(./imgs/down.png) no-repeat;
  background-size: 12px 12px;
}
#container {
  position: relative;
}
.box1 {
  // padding: 5px;
  float: left;
}
.box_img {
  padding: 5px;
  border: 1px solid #cccccc;
  box-shadow: 0 0 5px #cccccc;
  border-radius: 5px;
}
.box_img img {
  width: 100%;
  height: auto;
}
</style>
