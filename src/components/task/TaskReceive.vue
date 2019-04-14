<template>
  <div class="taskReceive">
    <a-row>
      <a-col :span="24" class="taskReceiveTable">
        <a-table :columns="columns" :dataSource="current" bordered :pagination="pagination" :loading="loading" >
          <span slot="name" slot-scope="text, record,index" class="task-name">
            <a class="font-blue" :title="text" v-if="record.type == 2" @click="goProjectDetail(record)">{{ text }}</a>
            <a class="font-blue" :title="record.title" v-else @click="goProjectDetail(record)">{{record.otherName}}</a>
          </span>
          <div slot="checkFile" slot-scope="text, record,index">
            <a class="font-blue" style="margin-right:5px" v-if="record.type == 2 &&((record.parent || {}).files || []).length" @click="showFileDialog(record.parent.files)">查看</a>
            <a class="font-blue" style="margin-right:5px" v-else-if="record.files.length" @click="showFileDialog(record.files)">查看</a>
          </div>
          <div slot="action" slot-scope="text,record,index">
            <div v-if="taskType == 1">
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
              <!-- <a
                v-if="(record.type===0||record.type===1)&&record.status > 2"
                class="font-blue"
                style="margin-right:5px"
                @click="finishTask(record)"
              >完成</a> -->
              <a
                v-if="(record.type===2)&&record.status===4"
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
              <a class="font-blue" style="margin-right:5px" @click="goProject(record)">项目</a>
            </div>
            <div v-else-if="taskType == 2">
              <a class="font-blue" style="margin-right:5px" @click="goProject(record)">项目</a>
              <!-- <a
                v-if="(record.type===0||record.type===1||record.type===3||record.type===4)&&(record.status===2||record.status===5)"
                class="font-blue"
                style="margin-right:5px"
                @click="submitTask(record)"
              >提交</a> -->
            </div>
          </div>
        </a-table>
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
import gql from 'graphql-tag'
import TaskSubmit from '@/components/dialog/task/TaskSubmitDialog'
import TaskReview from '@/components/dialog/task/TaskReviewDialog'

import TaskFile from '@/components/dialog/task/TaskFileDialog'

import moment from 'moment'

import { mapState } from 'vuex'

import { db } from '@/components/_util/db'
import { ArrayToString, ObjectToString } from '@/components/_util/StringUtil'

const columns = [
  {
    title: '任务名称',
    width: 300,
    align: 'left',
    key: 'name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '发起人',
    width: 80,
    align: 'center',
    key: 'createdBy',
    dataIndex: 'createdBy.name'
  },
  {
    title: '接收人',
    width: 80,
    align: 'center',
    key: 'handler',
    dataIndex: 'handler.name'
  },
  {
    title: '文件',
    width: 80,
    align: 'center',
    key: 'id',
    dataIndex: 'id',
    scopedSlots: { customRender: 'checkFile' }
  },
  {
    title: '截止日期',
    width: 120,
    align: 'center',
    key: 'endDate',
    dataIndex: 'endDate',
    customRender: value => {
      var d = ''
      if (value) {
        d = moment(value).format('YYYY-MM-DD')
      }
      return {
        children: d,
        attrs: {}
      }
    }
  },
  {
    title: '任务状态',
    width: 120,
    align: 'center',
    key: 'status',
    dataIndex: 'status',
    customRender: (value, row, index) => {
      var desc = ''
      console.log(value)
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
        children: desc,
        attrs: {}
      }
    }
  },
  {
    title: '操作',
    width: 180,
    align: 'right',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

// //对象转字符串
// function ObjectToString(obj) {
//   var type = Object.prototype.toString.call(obj)
//   var result = ''
//   if (type === '[object Object]') {
//     result += '{'
//     for (var o in obj) {
//       if (Object.prototype.toString.call(obj[o]) === '[object String]') {
//         result += o + ': "' + obj[o] + '",'
//       } else {
//         result += o + ': ' + obj[o] + ','
//       }
//     }
//     result += '}'
//   }
//   return result
// }
// //数组转字符串
// function ArrayToString(obj) {
//   var type = Object.prototype.toString.call(obj)
//   var result = ''
//   if (type === '[object Array]') {
//     result = '['
//     obj.forEach(ele => {
//       result += ObjectToString(ele)
//     })
//     result += ']'
//   } else if (type === '[object Object]') {
//     result += ObjectToString(obj)
//   }
//   return result
// }

export default {
  name: 'TaskReceive',
  components: {
    TaskSubmit,
    TaskReview,
    TaskFile
  },
  props: {
    tapType: {
      type: Number,
      default: 1
    },
    searchString: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openSubmit: false, //提交审核
      subName: '', //提交审核名称
      openReview: false, //审核任务
      columns,
      taskType: this.tapType,
      dbConn: new db(this.$apollo), //数据库操作
      //   pagination: this.pager(),
      current: [],
      pagination: {},
      pageSizeOptions: ['10', '20', '30'],
      currentPageSize: 10,
      defaultCurrent: 1,
      total: 20,
      user: {},
      currentTask: {},
      whereString: '',
      projectId: '',
      loading:true,
      openFile:false, //查看文件
      files:[], //上传的文件

    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    console.log(this.taskType, 'type')
    this.init()
    this.loading = true
    this.loadList()
  },
  methods: {
    init() {
      console.log(this.taskType)
      this.defaultCurrent = 1

      // if(this)
      switch (this.taskType) {
        case 1: //我接受的任务
          // this.whereString = `where:{_and:[{status:{_in:[1,2,4,5]}},{handler_id:{_eq:"${this.userInfo.id}"}},${
          //   this.searchString
          // }]}`
          this.whereString = `where:{_or:[{_and:[{status:{_in:[1,2,4]}},{handler_id:{_eq:"${this.userInfo.id}"}},${this.searchString}]},{_and:[{status:{_eq:5}},{type:{_in:[0,1,3,4]}},{handler_id:{_eq:"${this.userInfo.id}"}},${this.searchString}]}]}`
          break
        case 2: //我发起的任务
          this.whereString = `where:{_and:[{status:{_in:[1,2,3,4,5,6]}},{createdBy_id:{_eq:"${this.userInfo.id}"}},${
            this.searchString
          }]}`
          break
        case 3: //已完成的任务
          this.whereString = `where:{_and:[{status:{_in:[3,5,6,7]}},{_or:[{handler_id:{_eq:"${this.userInfo.id}"}},{createdBy_id:{_eq:"${this.userInfo.id}"}}]},${this.searchString}]}`
          break
      }
      console.log(this.whereString,'this.whereString')
    },
    //接口获取数据
    loadList() {
      const _this = this
      const skip = (this.defaultCurrent - 1) * this.currentPageSize
      this.$apollo
        .query({
          query: gql`
            query getTasks($skip: Int!, $pageSize: Int!)  {
              Task_aggregate(${this.whereString}){
                aggregate {
                  count
                }
              }

              Task(${this.whereString},order_by:[{updatedAt:desc}],offset: $skip, limit: $pageSize) {
                id
                handler {
                  id
                  name
                }
                type
                step
                name
                remark
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
                submitAmount
                approvedAmount
                unitPrice
                reviewResult
                status
                endDate
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
                  numParent {
                    id
                    name
                  }
                  type
                }
                numParent {
                  id
                  name
                  type
                  parent{
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: {
            skip: parseInt(skip),
            pageSize: parseInt(this.currentPageSize)
          },
          // fetchPolicy: 'network-only'
          fetchPolicy: 'no-cache'
        })
        .then(res => {
          console.log(res, 'res')
          _this.total = res.data.Task_aggregate.aggregate.count
          res.data.Task.forEach(ele => {
            if(ele.type != 2){
              ele.otherName = ''
              if(ele.numParent){
                if(ele.numParent.parent){
                  ele.otherName += ele.numParent.parent.name + '-'
                }
                ele.otherName+=ele.numParent.name + '-'
              }else if(ele.parent){
                ele.otherName += ele.parent.name + '-'
              }
              ele.otherName += ele.name
              ele.title = ele.otherName + `(${ele.project.name})`

              if(!ele.parent && !ele.numParent){
                ele.otherName = ele.name + `(${ele.project.name})`
                ele.title = ele.otherName
              }
            }
          })
          _this.current = res.data.Task
          _this.pagination = _this.pager()
          _this.loading = res.loading
        })
        .catch(err => {
          console.log(err)
          _this.total = 0
          _this.defaultCurrent = 1
          _this.current = []
          _this.pagination = _this.pager()
          _this.loading = false
        })
    },
    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      this.currentPageSize = pageSize
      this.loading = true
      this.loadList()
    },
    onPagerSizeChange(current, size) {
      this.defaultCurrent = current
      this.currentPageSize = size
      this.loading = true
      this.loadList()
    },
    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        showSizeChanger: true,
        current: this.defaultCurrent,
        pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent,
        onChange: this.onPagerChange,
        onShowSizeChange: this.onPagerSizeChange
      }
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
    //完成任务
    finishTask(record) {
      const _this = this
      this.$confirm({
        title: '完成任务',
        content: `你确定完成任务【${record.name}】吗？`,
        onOk() {
          console.log('完成任务', record)
          _this.updateTaskStatus(record, 7)
        },
        onCancel() {}
      })
    },
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
    goProject(record) {
      console.log(record)
      alert(`${record.project.id}, ${record.project.name}`)
    },
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

      if (data) {
        var pName = ''
        if (_this.currentTask.parent || _this.currentTask.numParent) {
          pName = `【${
            _this.currentTask.type == 0
              ? (_this.currentTask.parent || {}).name
              : (_this.currentTask.numParent || {}).name
          }】`
        }
        var mutateString = `
          update_Task(_set: { status: 4 }, where: { id: {_eq:"${_this.currentTask.id}" }}) {
            returning {id}
          }
          insert_Task(
            objects: [{
              project_id: "${_this.currentTask.project.id}"
              parent_id: "${_this.currentTask.id}" 
              type: ${data.type}
              handler_id: "${data.handler.id}"
              name: "${data.name}"
              step: ${data.step}
              submitAmount: ${data.submitAmount}
              approvedAmount: ${data.approvedAmount}
              unitPrice: ${data.unitPrice}
              remark: "${data.remark}"
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
          var summary = `【${_this.userInfo.name}】提交项目任务：【${pName}${
            _this.currentTask.name
          }】，让【${
            data.handler.name
          }】进行审核`
          var notification = `【${_this.userInfo.name}】提交了【${_this.currentTask.project.name}】项目中的【${pName}${
            _this.currentTask.name
          }】任务，需您审核`
          var notification2 = `【${_this.userInfo.name}】提交了【${_this.currentTask.project.name}】项目中的【${pName}${
            _this.currentTask.name
          }】任务给【${data.handler.name}】审核，需您知晓`
        } else {
          var notification = `【${_this.userInfo.name}】提交了【${_this.currentTask.name}】任务，需您审核`
          var notification2 = `【${_this.userInfo.name}】提交了【${_this.currentTask.name}】任务给【${
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
                status: 0
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
          status: 0
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
            _this.loadList()
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
        const _this = this
        var mutationString = ''
        if (data.isShowNextReview) {
          //发到下一级审核
          const reviewStatus = data.reviewResult === 1 ? 6 : 5
          const status = data.reviewResult === 1 ? 4 : 5 //4审核中5审核未通过
          const statusName = data.reviewResult === 1 ? '通过' : '不通过'
          const unitPrice = data.reviewResult === 1 ? data.unitPrice : '' 
          // debugger
          const taskName = data.type == 3 ? `[多]${_this.currentTask.name}` : _this.currentTask.name
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
                status: 0
                recipients: {
                  data: {recipient_id:"${_this.currentTask.createdBy.id}"}
                }
              },{
                type: 2
                name: "${notification2}"
                status: 0
                recipients: {
                  data: {recipient_id:"${data.nextHandler.id}"}
                }
              },{
                type: 2
                name: "${notification3}"
                status: 0
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
                reviewComment: "${data.reviewComment}",
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
          const taskName = data.type == 3 ? `[多]${_this.currentTask.name}` : _this.currentTask.name
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
          if(status == 6 && data.type == 3){ //多级复核审核通过要改变项目的审定金额
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
                status: 0
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
          `
        }

      
        console.log(mutationString, 'mutationString')
        // return
        _this
          .mutateApollo(mutationString)
          .then(res => {
            console.log(res, 'update and create next task success')
            _this.openReview = false
            _this.loadList()
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
            notification = `【${record.handler.name}】接受了【${record.project.name}】项目中的【[多]${
              record.name
            }】任务`
          } else {
            notification = `【${record.handler.name}】接受了【${record.project.name}】项目中的【${record.name}】任务`
          }
          recipients = [record.createdBy.id]
          break
        case 3: //拒绝
          if (record.type == 3) {
            notification = `【${record.handler.name}】拒绝了【${record.project.name}】项目中的【[多]${
              record.name
            }】任务`
          } else {
            notification = `【${record.handler.name}】拒绝了【${record.project.name}】项目中的【${record.name}】任务`
          }

          recipients = [record.createdBy.id]
          break
        case 7: //完成任务
          if (record.type == 3) {
            notification = `【${record.handler.name}】完成了【${record.project.name}】项目中的【[多]${
              record.name
            }】任务`
          } else {
            notification = `【${record.handler.name}】完成了【${record.project.name}】项目中的【${record.name}】任务`
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
            status: 0
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
          _this.loadList()
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
    goProjectDetail(item) {
      // alert('项目详情：' + id)
      // this.$router.push({ path:`/project?projectId=${id}`})
      let routeData = this.$router.resolve({
        name: "project",
        query:{projectId:item.project.id,name:item.project.name}
      });
      console.log(routeData.href)
      window.open(routeData.href, '_blank');
      // console.log(this.$router.go('/project'))
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
  },
  watch: {
    tapType(newT, oldT) {
      // console.log(this)
      this.taskType = newT
      this.init()
      this.loadList()
    },
    searchString(newT) {
      this.init()
      this.loadList()
    }
  }
}
</script>
<style>
.taskReceiveTable .ant-table-thead > tr > th,
.taskReceiveTable .ant-table-tbody > tr > td {
  padding: 8px 16px;
}
.taskReceiveTable .task-name {
  max-width: 380px;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

