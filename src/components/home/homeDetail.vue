<template>
  <div class="homeDetail">
    <a-row :style="{margin: '10px 0'}">
      <a-col :span="24">
        <span style="color:#fff">
          <a-icon type="bell"/>消息公告：
        </span>
        <a>{{lastBell}}</a>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="10" :style="{paddingRight:'10px'}">
        <a-card :bodyStyle="{padding:'10px',height:'380px'}">
          <a-row :style="{position:'relative'}">
            <!-- 四分一放大 -->
            <a-col
              :span="6"
              :class="['grip4', 'grip-hover']"
              :style="quickPosition(currentProject)"
              @click="goProjectDetail(currentProject,1)"
              @mouseenter="showBig(currentProject)"
              @mouseleave="hideBig"
              v-if="nowProjectId"
            >
              <div :style="{backgroundColor:statusColor[currentProject.status]}">
                <div
                  :span="24"
                  class="ellipsis"
                  :title="currentProject.projectNo"
                >{{currentProject.projectNo}}</div>
                <div
                  :span="24"
                  class="ellipsis"
                  :title="currentProject.name"
                >{{currentProject.name}}</div>
                <div
                  :span="24"
                  class="ellipsis"
                  :title="(currentProject.principal||{}).name"
                >{{(currentProject.principal||{}).name}}</div>
              </div>
            </a-col>
            <!-- 16宫格 -->
            <a-col :span="6" v-for="(item,index) in quickData" :key="index" :class="['grip4']">
              <div
                :style="{backgroundColor:statusColor[item.status]}"
                @mouseenter="showBig(item)"
                @mouseleave="hideBig"
                v-if="item.id != nowProjectId"
              >
                <div :span="24" class="ellipsis" :title="item.projectNo">{{item.projectNo}}</div>
                <div :span="24" class="ellipsis" :title="item.name">{{item.shortName || item.name}}</div>
              </div>
              <div
                :style="{backgroundColor:statusColor[item.status]}"
                v-else
                 @mouseenter="showBig(item)"
              >
                <div :span="24" class="ellipsis" :title="item.projectNo">{{item.projectNo}}</div>
                <div :span="24" class="ellipsis" :title="item.name">{{item.name}}</div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card :bodyStyle="{padding:'10px',height:'380px',overflow: 'auto',paddingBottom:'10px'}">
          <a-row :style="{lineHeight:'40px'}">
            <a-col :span="12">
              <h3 :style="{margin:0}">我的任务</h3>
            </a-col>
            <a-col :span="12" :style="{textAlign:'right',fontSize:'13px',paddingRight:'5px'}">
              <a @click="goTaskDetail">
                更多
                <a-icon type="right"/>
              </a>
            </a-col>
          </a-row>
          <a-table
            :columns="taskColumns"
            :bordered="false"
            :pagination="false"
            :dataSource="taskData"
          >
            <!-- <div slot="name" slot-scope="text,record,index" class="taskName" :title="text">
              <a @click="goProjectDetail(record.project,1)">{{text}}</a>
            </div> -->
            <span slot="name" slot-scope="text, record,index" class="taskName">
              <a class="font-blue taskName" :title="text" v-if="record.type == 2" @click="goProjectDetail(record.project,1)">{{ text }}</a>
              <a class="font-blue taskName" :title="record.title" v-else @click="goProjectDetail(record.project,1)">{{record.otherName}}</a>
            </span>
            <div slot="checkFile" slot-scope="text, record,index">
              <a class="font-blue" style="margin-right:5px" v-if="record.type == 2 &&((record.parent || {}).files || []).length" @click="showFileDialog(record.parent.files)">查看</a>
              <a class="font-blue" style="margin-right:5px" v-else-if="record.files.length" @click="showFileDialog(record.files)">查看</a>
            </div>
            <div slot="action" slot-scope="text,record,index">
              <div>
                <a
                  v-if="([0,1,3,4].indexOf(record.type) > -1)&&record.status===1"
                  class="font-blue"
                  style="margin-right:5px"
                  @click="acceptTask(record)"
                >接受</a>
                <a
                  v-if="([0,1,3,4].indexOf(record.type) > -1)&&record.status===1"
                  class="font-blue"
                  style="margin-right:5px"
                  @click="rejectTask(record)"
                >拒绝</a>
                <a
                  v-if="record.status===2&&record.status===4"
                  class="font-blue"
                  style="margin-right:5px"
                  @click="commentTask(record)"
                >讨论</a>
                <a
                  v-if="([0,1,3,4].indexOf(record.type) > -1)&&(record.status===2||record.status===5)"
                  class="font-blue"
                  style="margin-right:5px"
                  @click="submitTask(record)"
                >提交</a>
                <a
                  v-if="(record.type===2 || record.type == 5)&&record.status===4"
                  class="font-blue"
                  style="margin-right:5px"
                  @click="reviewTask(record)"
                >审核</a>
                <a
                  v-if="(record.type===2||record.type===3)&&record.status===4"
                  class="font-blue"
                  style="margin-right:5px"
                  @click="taskRemark(record)"
                >纪要</a>
                <!-- <a class="font-blue" style="margin-right:5px" @click="goProject(record)">项目</a> -->
              </div>
            </div>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" :style="{marginTop:'10px'}">
        <a-card :bodyStyle="{padding:'10px'}">
          <a-tabs defaultActiveKey="1" @change="tabChange">
            <a-tab-pane tab="最近的项目" key="1"></a-tab-pane>
            <a-tab-pane tab="我关注的项目" key="2"></a-tab-pane>
          </a-tabs>
          <a-table
            :columns="projectColumns"
            :bordered="false"
            :pagination="false"
            :dataSource="projectData"
          >
            <div slot="name" slot-scope="text,record,index" class="projectName" :title="text">
              <a @click="goProjectDetail(record,1)">{{text}}</a>
            </div>
            <div slot="status" slot-scope="text,record,index">
              <span
                :style="{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',marginRight:'5px',backgroundColor:statusColor[record.status||0]}"
              ></span>
              <span>{{ statusObject[record.status||0] }}</span>
            </div>
            <div slot="action" slot-scope="text,record,index" class="projectName" :title="text">
              <a style="margin-right:10px" @click="goProjectDetail(record,5)">项目任务</a>
              <a style="margin-right:10px" @click="goProjectDetail(record,6)">多级复核</a>
              <a style="margin-right:10px" @click="goProjectDetail(record,8)">内部核算</a>
            </div>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <TaskSubmit
      inititle="提交审核"
      :subName="subName"
      :projectId="projectId"
      :initvisibled="openSubmit"
      @submitSave2="submitSave"
      @submitCancel="submitCancel"
      :currentTask="currentTask"
    />
    <TaskReview
      inititle="审核"
      :initvisibled="openReview"
      @reviewSave="reviewSave"
      @reviewCancel="reviewCancel"
      :currentTask="currentTask"
    />
    <TaskFile
      fTitle="文件"
      :fVisibled="openFile"
      @fileCancel="fileCancel"
      :dataSource="files"
    />
  </div>
</template>




<script>
import { db } from '@/utils/db'
import { mapState } from 'vuex'
import gql from 'graphql-tag'
import TaskSubmit from '@/components/dialog/task/TaskSubmitDialog'
import TaskReview from '@/components/dialog/task/TaskReviewDialog'
import TaskFile from '@/components/dialog/task/TaskFileDialog'
import moment from 'moment'
import uuid from 'uuid'

const statusObject = {
  0: '未开始',
  1: '进行中',
  2: '已完成',
  3: '已归档',
  4: '暂停',
  5: '延期',
  6: '延误'
}
// const reverseStatusObject = {
//    '未开始': 0,
//    '进行中': 1,
//    '已完成': 2,
//    '已归档': 3,
//    '暂停': 4,
//    '延期': 5,
//    '延误': 6
//   }

const statusColor = {
  0: '#aaa',
  1: '#78bb59',
  2: '#f19149',
  3: '#d09c20',
  4: '#5d9cec',
  5: '#f19149',
  6: '#f19149'
}


const taskColumns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: '350px',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '发起人',
    dataIndex: 'createdBy',
    width: '350px',
    scopedSlots: { customRender: 'createdBy' },
    customRender: (text, record) => {
      return {
        children: (text || {}).name || '',
        attr: {}
      }
    }
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    width: '350px',
    scopedSlots: { customRender: 'status' },
    customRender: (value, row, index) => {
      var desc = ''
      switch (value) {
        case 0:
          desc = '未分配'
          break
        case 1:
          desc = '已分配'
          break
        case 2:
          desc = '已接受'
          break
        case 3:
          desc = '已拒绝'
          break
        case 4:
          desc = '审核中'
          break
        case 5:
          desc = '审核未通过'
          break
        case 6:
          desc = '审核通过'
          break
        case 7:
          desc = '已完成'
          break
        case 8:
          desc = '暂停中'
          break
      }
      return {
        children: desc
      }
    }
  },
  {
    title: '文件',
    dataIndex: 'file',
    width: '350px',
    scopedSlots: { customRender: 'checkFile' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '350px',
    scopedSlots: { customRender: 'action' }
  }
]

const projectColumns = [
  {
    title: '项目编号',
    dataIndex: 'projectNo',
    width: '350px',
    scopedSlots: { customRender: 'projectNo' }
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    width: '350px',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    width: '350px',
    scopedSlots: { customRender: 'principal' },
    customRender: (text, record) => {
      return {
        children: (text || {}).name || '',
        attr: {}
      }
    }
  },
  {
    title: '项目状态',
    dataIndex: 'status',
    width: '350px',
    scopedSlots: { customRender: 'status' }
    // customRender: (value, row, index) => {
    //   var desc = statusObject[row.status] || ''
    //   return {
    //     children: desc
    //   }
    // }
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    width: '350px',
    scopedSlots: { customRender: 'businessType' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '350px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'HomeDetail',
  props: {},
  data() {
    return {
      taskColumns,
      projectColumns,
      taskData: [],
      projectData: [], //关注和最近项目
      quickData:[], //快捷项目
      notificationData: [],
      dbConn: new db(this.$apollo),
      statusObject, //项目状态
      statusColor, //项目状态颜色
      projectSearch: '', //项目条件

      whereString:'',
      lastBell: '', //最后一条消息
      openSubmit: false,
      subName: '', //提交审核任务名称
      projectId: '', //项目id
      currentTask: {}, //当前任务
      openReview: false, //是否打开审核窗口
      nowProjectId: '', //当前项目id
      currentProject: {}, //当前项目,
      currentPage:1,
      currentPageSize:4,
      actionKey:1,
      openFile:false, //查看文件
      files:[], //上传的文件
    }
  },
  components: {
    TaskSubmit,
    TaskReview,
    TaskFile
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  mounted() {
    this.whereString = '_or:[{isFavorite:{_eq:1}},{isQuick:{_eq:1}}]'
    this.taskList()
    this.projectList()
    this.notificationList()
    this.quickList()
  },
  methods: {
    async taskList() {
      let whereString = `where:{_or:[{_and:[{status:{_in:[1,2,4]}},{handler_id:{_eq:"${this.userInfo.id}"}}]},{_and:[{status:{_eq:5}},{type:{_in:[0,1,3,4]}},{handler_id:{_eq:"${this.userInfo.id}"}}]}]}`
      var queryString = `query {
            Task(${whereString},order_by:[{updatedAt:desc}]){
               id
                handler {
                  id
                  name
                }
                type
                step
                name
                remark
                submitAmount
                approvedAmount
                unitPrice
                reviewResult
                status
                endDate
                files {
                  id
                  name
                  fileSize
                  url
                  createdAt
                  createdBy {
                    id
                    name
                  }
                }
                createdBy {
                  id
                  name
                }
                createdAt
                project {
                  id
                  name
                  businessType
                }
                parent {
                  id
                  name
                  type
                  files {
                    id
                    name
                    fileSize
                    url
                    createdAt
                    createdBy {
                      id
                      name
                    }
                  }
                }
                numParent {
                  id
                  name
                  type
                }
            }
        }`
      //   console.log(queryString)
      let res = await this.dbConn.query(queryString)
      res.data.Task.forEach(ele => {
        if(ele.type != 2){
          ele.otherName = ''
          if(ele.numParent){
            if(ele.numParent.parent){
              ele.otherName += ele.numParent.parent.name + '-'
            }
            ele.otherName+=ele.numParent.name
          }else if(ele.parent){
            ele.otherName += ele.parent.name 
          }
          ele.otherName = `【${ele.name}】-` + ele.otherName
          ele.title = ele.otherName + `-${ele.project.name}`

          if(!ele.parent && !ele.numParent){
            ele.otherName = ele.name + `-${ele.project.name}`
            ele.title = ele.otherName
          }
        }
      })
      this.taskData = res.data.Task
    },
    async projectList() {
      var queryString = `query proje($skip: Int!, $pageSize: Int!) {
            Project(where:{${this.projectSearch}},offset:$skip,limit: $pageSize,order_by:[{createdAt:desc}]){
                id
                isFavorite
                projectNo
                name
                principal {
                    id
                    name
                }
                status
                businessType
                createdAt
            }
        }`
        
      let res = await this.dbConn.query(queryString, { skip: 0, pageSize: this.currentPageSize })
      console.log(queryString,res)
      this.projectData = res.data.Project
    },
    //快捷面板和收藏列表
    async quickList() {
      var queryString = `query proje($skip: Int!, $pageSize: Int!) {
            projectex(
              args: { empid: "${this.userInfo.id}" }
              where: {${this.whereString}},
              order_by:[{createdAt:desc_nulls_last}] ,
              offset: $skip, 
              limit: $pageSize
            ) {
              id
              contract {
                id
                name
              }
              businessType
              projectType
              projectNo
              name
              principal {
                id
                name
              }
              approvedAmount
              submitAmount
              status
              money
              remark
              stepName
              endDate
              isFavorite
              isQuick
          }
        }`
         console.log(queryString)
      let res = await this.dbConn.query(queryString, { skip: 0, pageSize: 200 })
      console.log(queryString,res)
      this.quickData = res.data.projectex.filter(ele => ele.isQuick)
      if(this.actionKey == 2){
        this.projectData = res.data.projectex.filter(ele => ele.isFavorite)
      } 
      
    },
    //消息公告
    async notificationList() {
      var queryString = `query notifi($skip: Int!, $pageSize: Int!){
            Notification(where:{recipients:{recipient_id:{_eq:"${
              this.userInfo.id
            }"}}},offset:$skip,limit: $pageSize,order_by:{createdAt:desc}){
    			    recipients{
                recipient_id
                id
              }
              name,
              status,
            }
        }`
      //
      let res = await this.dbConn.query(queryString, { skip: 1, pageSize: this.currentPageSize })
      console.log(res, 'Notification')
      this.notificationData = res.data.Notification
      this.lastBell = this.notificationData[0].name
    },
    tabChange(activeKey) {
      console.log(activeKey)
      this.actionKey = activeKey
      if (activeKey == 1) {
        this.projectSearch = ''
        this.currentPageSize = 4
        this.projectList()
      } else {
        this.whereString = '_or:[{isFavorite:{_eq:1}},{isQuick:{_eq:1}}]'
        this.quickList()
        // this.projectSearch = `_and:[{isFavorite:{_eq:true}}]`
        // this.currentPageSize = 20
      }
      // console.log(this.projectSearch)
      
    },
    //页面跳转
    goProjectDetail(record, type) {
      let routeData = this.$router.resolve({
        name: 'project',
        query: { projectId: record.id, name: record.name, type: type }
      })
      window.open(routeData.href, '_blank')
    },
    goTaskDetail(record) {
      let routeData = this.$router.resolve({
        name: 'task'
      })
      window.open(routeData.href, '_blank')
    },


    //接受任务
    acceptTask(record) {
      const _this = this
      this.$confirm({
        title: '接受任务',
        content: `你确定接受任务【${record.name}】吗？`,
        onOk() {
          console.log('接受任务', record)
          _this.updateTaskStatus(record, 2)
        },
        onCancel() {}
      })
    },

    //拒绝任务
    rejectTask(record) {
      const _this = this
      this.$confirm({
        title: '拒绝任务',
        content: `你确定拒绝任务【${record.name}】吗？`,
        onOk() {
          console.log('拒绝任务', record)
          _this.updateTaskStatus(record, 3)
        },
        onCancel() {}
      })
    },

    //讨论
    commentTask(record) {
      console.log(record.comments)
    },
    submitTask(record) {
      console.log(record)
      this.currentTask = record
      var pName = ''
      if (this.currentTask.parent || this.currentTask.numParent) {
        pName = `【${
          this.currentTask.type == 0 ? (this.currentTask.parent || {}).name : (this.currentTask.numParent || {}).name
        }】`
      }
      // this.subName = pName + this.currentTask.name
      this.subName = record.otherName
      // console.log(this.subName)
      this.projectId = this.currentTask.project.id
      this.openSubmit = true
    },
    reviewTask(record) {
      console.log(record)
      this.currentTask = record
      this.projectId = this.currentTask.project.id
      this.openReview = true
    },
    //纪要
    taskRemark(record) {
      alert(record.remark)
    },
    //提交审核
    submitSave(data) {
      const _this = this

      console.log(data, _this.currentTask)

      // return
      // debugger
      if (!(data.handler || {}).id) {
        _this.$message.warning('请选择审核人')
        return
      }
      // return
      let newId = uuid()
      if (data) {
        var pName = ''
        // if (_this.currentTask.parent || _this.currentTask.numParent) {
        //   pName = `【${
        //     _this.currentTask.type == 0
        //       ? (_this.currentTask.parent || {}).name
        //       : (_this.currentTask.numParent || {}).name
        //   }】`
        // }
        var mutateString = `
          update_Task(_set: { status: 4 }, where: { id: {_eq:"${_this.currentTask.id}" }}) {
            returning {id}
          }
          insert_Task(
            objects: [{
              id:"${newId}"
              project_id: "${_this.currentTask.project.id}"
              parent_id: "${_this.currentTask.id}" 
              type: ${data.type}
              handler_id: "${data.handler.id}"
              name: "${data.name}"
              step: ${data.step}
              submitAmount: ${data.submitAmount}
              approvedAmount: ${data.approvedAmount}
              unitPrice: ${data.unitPrice}
              remark: "${(data.remark||'').replace(/\n/g,'')}"
              status: 4
              reviewResult: "-1",
              createdBy_id: "${_this.userInfo.id}",
            }]
          ) {
            returning {id}
          }
        `
        var summary = ''
        var notification = ''
        var notification2 = ''

        if ((_this.currentTask.project || {}).name) {
          var summary = `【${_this.userInfo.name}】提交项目任务：【${data.name}】，让【${
            data.handler.name
          }】进行审核`
          var notification = `【${_this.userInfo.name}】提交了【${_this.currentTask.project.name}】项目中的【${data.name}】任务，需您审核`
          var notification2 = `【${_this.userInfo.name}】提交了【${_this.currentTask.project.name}】项目中的【${data.name}】任务给【${data.handler.name}】审核，需您知晓`
        } else {
          var notification = `【${_this.userInfo.name}】提交了【${data.name}】任务，需您审核`
          var notification2 = `【${_this.userInfo.name}】提交了【${data.name}】任务给【${
            data.handler.name
          }】审核，需您知晓`
        }

        var summaryString = ``
        var notificationString = ``
        var notification2String = ``
        var totalNotification = ``
        //添加项目纪要
        if (summary) {
          summaryString = `
          insert_Summary(objects:[{
            project_id:"${_this.currentTask.project.id}",
            content:"${summary}",
            createdBy_id:"${_this.userInfo.id}",
          }]){returning{id}}`
        }
        //通知需要通知的人
        if (data.sendTo.length) {
          data.sendTo.forEach(ele => {
            notification2String += `
              {
                type: 2
                name: "${notification2}"
                status: 0,
                project_id:"${this.projectId}",
                task_id:"${newId}"
                recipients: {
                  data: {recipient_id:"${ele.key}"}
                }
              }
            `
          })
        }
        //通知负责人
        notificationString = `{
          type: 2
          name: "${notification}"
          status: 0,
          project_id:"${this.projectId}",
          task_id:"${newId}"
          recipients: {
            data: {recipient_id:"${data.handler.id}"}
          }
        }`
        totalNotification = `insert_Notification(objects:[${notificationString}${notification2String}]){returning {id}}`
        mutateString += '\n' + summaryString + '\n' + totalNotification

        var documentString = ``
        //添加过程文件（附件）
        if (data.files.length) {
          var documentObj = ``
          var docType = 4
          var projectFileType = 1
          var taskId = this.currentTask.id
          // if(this.currentTask.type != 3){
          //   docType = 4
          //   taskId = this.currentTask.id
          //   projectFileType = 1
          // }
          data.files.forEach(ele => {
            documentObj += `{
              url:"${this.projectId}/",
              name: "${ele.name}", 
              property:1,#文件属性 0:目录 1:文件
              type:${docType}, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档 4:任务文档
              relatedId:"${this.projectId}",
              taskId:"${taskId}"
              projectFileType:${projectFileType} #项目文件类型 0:项目资料 1:过程文件 2:成果文件
              fileSize:${ele.size},
              isLocked:false,
              createdBy_id:"${this.userInfo.id}"
            }`
          })
          documentString = `insert_Document(objects:[${documentObj}]){returning{id}}`
          mutateString += '\n' + documentString
        }
        console.log(mutateString, 'mutateString')
        // return
        _this
          .mutateApollo(mutateString)
          .then(res => {
            console.log(res, 'submit task success')
            _this.$message.success('提交审核成功')
            _this.taskList()
            _this.openSubmit = false
          })
          .catch(err => {
            console.log(err, 'submit task fail')
            _this.$message.error('提交审核失败')
          })
        // console.log(mutateString, 'mutateString')
        // console.log(summary, notification, notification2)
      }
    },
    submitCancel() {
      this.openSubmit = false
    },
    //审核任务
    reviewSave(data) {
      // debugger
      if (data) {
        let newId = uuid()
        const _this = this
        var mutationString = ''
        if (data.isShowNextReview) {
          //发到下一级审核
          const reviewStatus = data.reviewResult === 1 ? 6 : 5
          const status = data.reviewResult === 1 ? 4 : 5 //4审核中5审核未通过
          const statusName = data.reviewResult === 1 ? '通过' : '不通过'
          const unitPrice = data.reviewResult === 1 ? data.unitPrice : '' 
          // debugger
          const taskName = data.taskType == 3 ? `[多]${_this.currentTask.name}` : _this.currentTask.name
          //每一次审核都要添加纪要
          // 通过与否纪要
          const reviewSummary = `【${taskName}】任务审核由【${_this.currentTask.handler.name}】审核${statusName}`
          // 生成下级审核任务纪要
          const nextReviewSummary = `【${_this.currentTask.handler.name}】提交项目任务：【${taskName}】，让【${
            data.nextHandler.name
          }】进行审核`

          var allSummary = ` 
            insert_Summary(objects:[{
              project_id:"${_this.currentTask.project.id}",
              content:"${reviewSummary}",
              createdBy_id:"${_this.userInfo.id}",
            },{
              project_id:"${_this.currentTask.project.id}",
              content:"${nextReviewSummary}",
              createdBy_id:"${_this.userInfo.id}",
            }]){returning{id}}
          `

          // 给下级审核人通知 data.nextHandler.id/name
          var notification2 = `【${_this.userInfo.name}】提交了【${
            _this.currentTask.project.name
          }】项目中的【${taskName}】任务，需您审核`
          // 给任务发起人通知 this.currentTask.createdBy.name/id
          var notification = `【${_this.userInfo.name}】审核通过了【${
            _this.currentTask.project.name
          }】项目中的【${taskName}】任务，审核意见为【${data.reviewComment}】`
          // 给任务发起人通知 this.currentTask.createdBy.name/id
          var notification3 = `【${_this.currentTask.handler.name}】提交了【${
            _this.currentTask.project.name
          }】项目中的【${taskName}】任务给【${data.nextHandler.name}】审核，需您知晓`

          var allNotification = `
            insert_Notification(
              objects: [{
                type: 2
                name: "${notification}"
                status: 0,
                project_id:"${_this.currentTask.project.id}",
                task_id:"${_this.currentTask.id}"
                recipients: {
                  data: {recipient_id:"${_this.currentTask.createdBy.id}"}
                }
              },{
                type: 2
                name: "${notification2}"
                status: 0,
                project_id:"${_this.currentTask.project.id}",
                task_id:"${newId}"
                recipients: {
                  data: {recipient_id:"${data.nextHandler.id}"}
                }
              },{ #任务发起人/上级审核人
                type: 2
                name: "${notification3}"
                status: 0,
                project_id:"${_this.currentTask.project.id}",
                task_id:"${newId}"
                recipients: {
                  data: {recipient_id:"${_this.currentTask.createdBy.id}"}
                }
              }]
            ) {
              returning {id}
            }
          `

          mutationString = `
            # 更新审核任务的审核意见为同意或者不同意，状态为审核通过/不通过
            update_Task(
              _set: {
                status: ${reviewStatus},
                reviewResult: "${data.reviewResult}",
                reviewComment: "${(data.reviewComment||'').replace(/\n/g,'')}",
                reviewDate: "${data.reviewDate}",
                unitPrice: ${data.unitPrice || 0}
              },
              where: {
                id: {_eq:"${_this.currentTask.id}"}
              }
            ) {
              returning {id}
            }
            # 更新父任务的状态为审核通过/不通过并更新复核造价到父任务
            ${
              _this.currentTask.parent
                ? `udpateTask2:update_Task(
              _set: {
                status: ${status}
                ${unitPrice != '' ? `unitPrice:${unitPrice} `:''}
              }, where: {
                id: {_eq:"${_this.currentTask.parent.id}"}
              }
            ) {
              returning {id}
            }`
                : ''
            }

            # 新增下一级审核任务
            insert_Task(
              objects: [{
                id:"${newId}"
                project_id: "${_this.currentTask.project.id}"
                ${_this.currentTask.parent ? `parent_id: "${_this.currentTask.parent.id}"` : ''}
                type: ${data.type}
                handler_id: "${data.nextHandler.id}"
                name: "${_this.currentTask.name}"
                step: ${data.nextStep}
                submitAmount: ${data.submitAmount}
                approvedAmount: ${data.approvedAmount}
                unitPrice: ${data.unitPrice || 0}
                remark: "${data.remark}"
                status: 4
                reviewResult: "-1",
                createdBy_id:"${_this.currentTask.createdBy.id}"
                ${_this.currentTask.projectStep_id ? `projectStep_id:"${_this.currentTask.projectStep_id}"`:''}
              }]
            ) {
              returning {id}
            }
            #项目纪要
            ${allSummary}
            #消息提醒
            ${allNotification}
          `
        } else {
          //审核结束
          const status = data.reviewResult === 1 ? 6 : 5
          const statusName = data.reviewResult === 1 ? '通过' : '不通过'
          const taskName = data.taskType == 3 ? `[多]${_this.currentTask.name}` : _this.currentTask.name
          const unitPrice = data.reviewResult == 1 ? data.unitPrice : '' 
          console.log(data.reviewResult == 1,data.unitPrice,'data.unitPrice')
          // debugger
          var reviewSummary = ''
          var notification = ''
          //纪要
          reviewSummary = `【${taskName}】任务审核由【${_this.currentTask.handler.name}】审核${statusName}`
          //消息提醒 给任务发起人通知 this.currentTask.createdBy.name/id
          notification = `【${_this.currentTask.handler.name}】审核${statusName}了【${
            _this.currentTask.project.name
          }】项目中的【${taskName}】任务，审核意见为【${data.reviewComment}】`


          var updateProject = ``
          if(status == 6 && data.taskType == 3){ //多级复核审核通过要改变项目的审定金额
            updateProject = `
              update_Project(where:{id:{_eq:"${_this.currentTask.project.id}"}},
              _set:{
                approvedAmount:${_this.currentTask.approvedAmount}
                ${unitPrice != '' ? `unitPrice:${unitPrice} `:''}
              }){returning{id}}
            `
          }

          var allSummary = ` 
            insert_Summary(objects:[{
              project_id:"${_this.currentTask.project.id}",
              content:"${reviewSummary}",
              createdBy_id:"${_this.userInfo.id}",
            }]){returning{id}}
          `

          var allNotification = `
            insert_Notification(
              objects: [{
                type: 2
                name: "${notification}"
                status: 0,
                project_id:"${_this.currentTask.project.id}",
                task_id:"${_this.currentTask.id}"
                recipients: {
                  data: {recipient_id:"${_this.currentTask.createdBy.id}"}
                },
                createdBy_id:"${_this.userInfo.id}",
              }]
            ) {
              returning {id}
            }
          `


          //
          var updateProjectStatus = ''
          var projectPause = ''
          var projectSummary = ''
          var projectStep = ""
          var stepId = _this.currentTask.projectStep_id
          if(data.type == 5 && status == 6){ //暂停任务通过后暂停项目
            updateProjectStatus = `
              updateProjectStatus:update_Project(where:{id:{_eq:"${_this.currentTask.project.id}"}},
              _set:{
                status:4
              }){returning{id}}
            `

            projectPause = `
              insert_ProjectPause(objects:[{
                startTime:"${moment().format()}" 
                createdBy_id:"${_this.userInfo.id}"  
                project_id:"${_this.currentTask.project.id}"  
                reason:"${data.remark}" 
              }]){returning{id}}`

              if(stepId){
               projectStep =  `update_Step(where:{id:{_eq:"${stepId}"}},_set:{
                  status: 4,
                }){
                  returning{
                    id
                  }
                }`
              }

              projectSummary = `projectSummary:insert_Summary(objects:
              [
                ${
                  stepId
                    ? `{step_id:"${stepId}",content:"变更状态【暂停中】",createdBy_id:"${_this.userInfo.id}"},`
                    : ''
                }
                
                
                {project_id:"${_this.currentTask.project.id}"content:"调整项目状态为暂停，暂停原因：${data.remark}",createdBy_id:"${_this.userInfo.id}"},
                 
              ]){
              returning{
                id
              }
            }`


          }

          mutationString = `
            # 更新审核任务的审核意见为同意或者不同意，状态为审核通过/不通过
            update_Task(
              _set: {
                status: ${status},
                reviewResult: "${data.reviewResult}",
                reviewComment: "${data.reviewComment}",
                reviewDate: "${data.reviewDate}"
                ${unitPrice != '' ? `unitPrice:${unitPrice} `:''}
              },
              where: {
                id: {_eq:"${_this.currentTask.id}"}
              }
            ) {
              returning {id}
            }
            # 更新父任务的状态为审核通过/不通过和复核造价
            ${
              _this.currentTask.parent
                ? `updateTask2:update_Task(_set: { 
                    status: ${status}
                    ${unitPrice != '' ? `unitPrice:${unitPrice} `:''}
                    }, where: { id: {_eq:"${
                    _this.currentTask.parent.id
                  }"} }) {
              returning {id}
            }`
             : ''
            } 
            # 更新父任务的父任务的复核造价
            ${
              (_this.currentTask.parent || {}).numParent ?
              `updateTask3:update_Task(_set: { 
                    ${unitPrice != '' ? `unitPrice:${unitPrice} `:''}
                    }, where: { id: {_eq:"${
                    _this.currentTask.parent.numParent.id
                  }"} }) {
              returning {id}
            }`:''
            }
            
            #项目纪要
            ${allSummary}
            #消息提醒
            ${allNotification}
            #更新审定金额
            ${updateProject}
            #更新暂停项目
            ${updateProjectStatus}
            ${projectPause}
            ${projectStep}
            ${projectSummary}
          `
        }

      
        console.log(mutationString, 'mutationString',data.taskType)
        // return
        _this
          .mutateApollo(mutationString)
          .then(res => {
            console.log(res, 'update and create next task success')
            _this.openReview = false
            _this.taskList()
          })
          .catch(err => {
            console.log(err, 'update and create next task error')
          })
      }
    },
    reviewCancel() {
      this.openReview = false
    },
     //更新任务状态
    updateTaskStatus(record, status) {
      record.status = status
      let notification = ''
      let recipients = []
      let _this = this
      switch (status) {
        case 2: //接受
          if (record.type == 3) {
            notification = `【${record.handler.name}】接受了【${record.project.name}】项目中的【[多]${record.otherName ||record.name}】任务`
          } else {
            notification = `【${record.handler.name}】接受了【${record.project.name}】项目中的【${record.otherName ||record.name}】任务`
          }
          recipients = [record.createdBy.id]
          break
        case 3: //拒绝
          if (record.type == 3) {
            notification = `【${record.handler.name}】拒绝了【${record.project.name}】项目中的【[多]${record.otherName ||record.name}】任务`
          } else {
            notification = `【${record.handler.name}】拒绝了【${record.project.name}】项目中的【${record.otherName ||record.name}】任务`
          }

          recipients = [record.createdBy.id]
          break
        case 7: //完成任务
          if (record.type == 3) {
            notification = `【${record.handler.name}】完成了【${record.project.name}】项目中的【[多]${record.otherName ||record.name}】任务`
          } else {
            notification = `【${record.handler.name}】完成了【${record.project.name}】项目中的【${record.otherName ||record.name}】任务`
          }
          recipients = [record.createdBy.id]
          break
        // case 5: //审核未通过
        //   if (record.type === 2) {
        //     //任务审核
        //     notification = `【${record.handler.name}】审核未通过了【${record.project.name}】项目中的【${
        //       record.name
        //     }】任务，审核意见为【${record.reviewComment}】`
        //     recipients = [record.createdBy.id]
        //   } else {
        //     //项目多级复核
        //     notification = `【${record.handler.name}】审核未通过了【${record.project.name}】项目中的【[多]${
        //       record.name
        //     }】任务，审核意见为【${record.reviewComment}】`
        //     recipients = [record.createdBy.id]
        //   }
        //   break
        // case 6: //审核通过
        //   if (record.type === 2) {
        //     //任务审核
        //     notification = `【${record.handler.name}】审核通过了【${record.project.name}】项目中的【${record.name}】任务，审核意见为【${record.reviewComment}】`
        //     recipients = [record.createdBy.id]
        //   } else {
        //     //项目多级复核
        //     notification = `【${record.handler.name}】审核通过了【${record.project.name}】项目中的【[多]${
        //       record.name
        //     }】任务，审核意见为【${record.reviewComment}】`
        //     recipients = [record.createdBy.id]
        //   }
        //   break
      }

      var mutateString = `
        update_Task(
          _set: {
            status: ${status}
          }
          where: { id: {_eq:"${record.id}"} }
        ) {
          returning{id}
        }
        #推送消息
        insert_Notification(
          objects: [{
            type: 2
            name: "${notification}"
            status: 0,
            project_id:"${record.project.id}",
            task_id:"${record.id}",
            recipients: {
              data: {recipient_id:"${recipients[0]}"}
            }
          }]
        ) {
          returning {id}
        }
      `
      this.mutateApollo(mutateString)
        .then(res => {
          console.log(res, 'updateTaskStatus')
          _this.taskList()
        })
        .catch(err => {
          console.log(err, 'err')
        })
    },
    //apollo操作
    mutateApollo(mutate) {
      console.log(mutate)
      return this.$apollo.mutate({
        mutation: gql`mutation { ${mutate} }`
      })
    },



    showBig(record) {
      // console.log(record, 'big')
      this.currentProject = record
      this.nowProjectId = record.id
    },
    hideBig(e) {
      this.nowProjectId = ''
      this.currentProject = {}
      // console.log(e, 'd')
    },
    //快捷面板的位置
    quickPosition(currentProject){
      console.log(currentProject,'currentProject')
      let currentProjectIndex = 0
      this.quickData.forEach((ele,index) => {
        if(ele.id == currentProject.id){
          currentProjectIndex = index
        }
      })
      console.log(currentProjectIndex)
      var obj = {}
      if(currentProjectIndex > 7){
        obj['bottom'] = 0
        if(currentProjectIndex%4 >1){
          obj['right'] = 0
        }
      }else {
        if(currentProjectIndex%4 >1){
          obj['right'] = 0
        }
      }
      // console.log(obj,'obj')
      return obj
    },
    //打开查看文件弹框
    showFileDialog(data){
      console.log('showfile')
      this.files = data
      this.openFile = true
    },
    //关闭查看文件弹框
    fileCancel() {
      console.log('hide')
      this.openFile = false
    }

  }
}
</script>

<style>
.homeDetail .ant-card {
  border-radius: 5px;
}
.homeDetail .taskName {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;
}
.homeDetail .ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
.homeDetail .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th {
  background: #eee;
}
.homeDetail .projectName {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.homeDetail .ant-table-thead > tr > th,
.homeDetail .ant-table-tbody > tr > td {
  padding: 8px;
}
.homeDetail .grip4 {
  height: 90px;
  background: #fff;
  padding: 5px;
  position: relative;
}
.homeDetail .grip4 > div {
  height: 100%;
  /* border: 1px solid #ccc; */
  border-radius: 2px;
  color: #fff;
  text-align: center;
  padding: 0 3px;
  padding-top: 18px;
  cursor: pointer;
}
.homeDetail .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.homeDetail .grip-hover {
  position: absolute;
  width: 50%;
  z-index: 2;
  height: 180px;
}
</style>
