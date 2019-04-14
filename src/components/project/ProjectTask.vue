<template>
  <div class="projectTask">
    <a-row style="margin-bottom:10px">
      <a-col :span="16">
        <!-- <a-button type="default" icon="export" style="margin-right: 15px;">导入项目计划</a-button>
        <a-button type="default" icon="swap" style="margin-right: 15px;">分配所有任务</a-button> -->
        <a-button type="primary" style="margin-right: 15px;" @click="createReview(3)">成果审核</a-button>
        <a-button type="primary" style="margin-right: 15px;" @click="createReview(4)">收费任务</a-button>
        <a-button type="default" icon="deployment-unit" style="margin-right: 15px;">查看人员负载</a-button>
      </a-col>
      <a-col :span="8" style="text-align:right">
        <a-input-search
          :style="{width:'75%'}"
          placeholder="任务名称、负责人、任务状态"
          @search="onSearch"
          enterButton
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" class="ui-new-table">
        <a-table :columns="columns" :dataSource="data" :pagination="false" bordered :loading="loading">
          <div
            slot="name"
            slot-scope="text,record,index"
            :style="{display:'inline-block',width:'80%'}"
          >
            <a-input :value="record.name" class="taskName" v-if="record.numParent || record.type == 3 || record.type == 4" readonly/>
            <a-input
              v-model="record.name"
              class="taskName"
              v-else
              @pressEnter="taskNameChange(record)"
              @blur="taskNameChange(record)"
              @focus="taskNameFocus(record)"
            />
          </div>
          <!-- 负责人 -->
          <div
            slot="handler"
            slot-scope="text,record,index"
            @click="showHandlerModel(record)"
            :style="{cursor:'pointer',height:'30px',width:'100%',lineHeight:'30px'}"
          >
            <a>{{Object.keys(record.handler||{}).length?record.handler.name : ''}}</a>
          </div>
          <!-- 提前天数 -->
          <div slot="advanceDays" slot-scope="text,record,index">
            <a-input-number v-model="record.advanceDays" :style="{width:'45px'}" @change="changeAdvance(record,$event)"/>
            <span v-if="(record.project||{}).endDate" :style="{marginLeft:'5px'}">{{moment(record.project.endDate).add(-record.advanceDays,'days').format('YYYY-MM-DD')}}</span>
            <!-- <a-date-picker
              @change="taskDateChange"
              @focus="taskDateFocus(record)"
              v-if="record.endDate"
              :value="moment(record.endDate,dateFormat)"
            /> -->
            <!-- <a-date-picker @change="taskDateChange" @focus="taskDateFocus(record)" v-else/> -->
          </div>

          <span
            slot="status"
            slot-scope="text,record,index"
          >{{ record.children ? '' : taskStatus[text] }}</span>

          <!-- 审核记录 -->
          <span slot="childTasks" slot-scope="text,record,index">
            <a
              v-if="(record.childTasks||[]).filter(ele => ele.type == 2).length"
              class="font-blue"
              @click="showReview(record)"
            >
              <a-icon type="message" @click="showReview(record)"/>查看
            </a>
          </span>
          <!-- <span slot="file" slot-scope="text,record,index">
            <a v-if="record.file.length" class="font-blue">
              <a-icon type="file-done"/>查看
            </a>
          </span>-->
          <a
            slot="remark"
            slot-scope="text,record,index"
            class="font-blue"
            @click="changeRemark(record)"
          >备注</a>

          <div slot="action" slot-scope="text,record,index">
            <div v-if="!record.numParent && !(record.numTasks||[]).length">
              <span v-if="record.name">
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="([0,3,5].indexOf(record.status) > -1 && $auth('assign-project-task') && !(record.childTasks||[]).length)"
                  @click="distribution(record,1)"
                >分配</a>
                <!-- <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="$auth('force-assign-project-task')"
                  @click="distribution(record,2)"
                >重新分配</a> -->
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status == 1 && $auth('cancel-project-task')"
                  @click="changTaskStatus(0,record)"
                >撤销</a>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status == 2 && $auth('edit-project-task')"
                  @click="changTaskStatus(8,record)"
                >暂停</a>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status == 8 && $auth('edit-project-task')"
                  @click="changTaskStatus(2,record)"
                >重新开始</a>
                <a class="font-blue" style="margin-right:5px" @click="insertTask(record,index)">插入</a>
              </span>
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" href="#">
                  <a-icon type="down-circle" style="font-size:16px;color:#999"/>
                </a>
                <a-menu slot="overlay">
                  <!-- <a-menu-item key="0" v-if="record.name && $auth('edit-project-task')">
                    <a>
                      <a-icon type="arrow-up"/>上移
                    </a>
                  </a-menu-item> -->
                  <!-- <a-menu-item key="1" v-if="record.name && $auth('edit-project-task')">
                    <a>
                      <a-icon type="arrow-up"/>下移
                    </a>
                  </a-menu-item> -->
                  <a-menu-item key="3" v-if="record.name && $auth('add-project-task') && !record.parent">
                    <a @click="addChildren(record,index)">
                      <a-icon type="share-alt"/>创建子任务
                    </a>
                  </a-menu-item>
                  <a-menu-item key="4" v-if="record.name && $auth('add-project-task')">
                    <a @click="copyTask(record)">
                      <a-icon type="copy"/>复制任务
                    </a>
                  </a-menu-item>
                  <a-menu-item key="5" v-if="$auth('delete-project-task')">
                    <a @click="deleteTask(record,index)">
                      <a-icon type="delete"/>删除任务
                    </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <!-- 造价任务 -->
            <div v-else>
              <span>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="[0,3,5].indexOf(record.status) > -1 && !(record.numTasks||[]).length && $auth('assign-project-task')"
                  @click="distribution(record,1)"
                >分配</a>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status > 0 && !(record.numTasks||[]).length && $auth('force-assign-project-task')"
                  @click="distribution(record,2)"
                >重新分配</a>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status == 1 && !(record.numTasks||[]).length && $auth('cancel-project-task')"
                  @click="changTaskStatus(0,record)"
                >撤销</a>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status == 2 && !(record.numTasks||[]).length && $auth('edit-project-task')"
                  @click="changTaskStatus(8,record)"
                >暂停</a>
                <a
                  class="font-blue"
                  style="margin-right:5px"
                  v-if="record.status == 8 && !(record.numTasks||[]).length && $auth('edit-project-task')"
                  @click="changTaskStatus(2,record)"
                >重新开始</a>
              </span>
            </div>
          </div>
        </a-table>
      </a-col>
    </a-row>
    <div class="addCostTask">
      <a href="javascript:void(0)" @click="addTask" v-if="$auth('add-project-task')">
        <a-icon type="plus"></a-icon>添加任务
      </a>
    </div>
    <a-row>
      <a-col :span="24"></a-col>
    </a-row>

    <employeeTree
      :inivisible="visibled"
      :inititle="title"
      :maskClosable="maskClosable"
      :type="type"
      @changeStatus="changeHanler"
    />
    <reviewDialog
      :visibled="rVisibled"
      :title="rTitle"
      :dataSource="rData"
      :maskClosable="maskClosable"
      @cancel="reviewDialogCancel"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'

import { mapState } from 'vuex'
import { db } from '@/utils/db'

import employeeTree from '@/components/same/employeeTree'
import reviewDialog from '@/components/dialog/project/reviewDialog'

const columns = [
  {
    title: '任务名称',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    width: 360,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '负责人',
    width: 100,
    align: 'center',
    dataIndex: 'handler',
    key: 'handler',
    scopedSlots: { customRender: 'handler' }
  },
  {
    title: '提前天数',
    width: 140,
    align: 'center',
    dataIndex: 'advanceDays',
    key: 'advanceDays',
    scopedSlots: { customRender: 'advanceDays' }
  },
  {
    title: '任务状态',
    width: 100,
    align: 'center',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '工程文件',
    width: 100,
    align: 'center',
    key: 'file',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '审核记录',
    width: 100,
    align: 'center',
    key: 'childTasks',
    dataIndex: 'childTasks',
    scopedSlots: { customRender: 'childTasks' }
  },
  {
    title: '备注',
    width: 80,
    align: 'center',
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    width: 120,
    align: 'right',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

// const data = [
//   {
//     key: '1',
//     name: '安装工程',
//     handler: '赵胜',
//     endDate: '2019-01-11',
//     status: 2,
//     remark: 'nice',
//     childTasks: [],
//     file: []
//   }
// ]

export default {
  name: 'ProjectTask',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns,
      data: [],
      dbConn: new db(this.$apollo),
      dateFormat: 'YYYY-MM-DD',
      visibled: false,
      title: '选择负责人',
      maskClosable: true,
      type: 1,
      taskRecord: {}, //列详情,
      searchString: '', //搜索条件
      taskStatus: {
        0: '未分配',
        1: '已分配',
        2: '已接受',
        3: '已拒绝',
        4: '审核中',
        5: '审核未通过',
        6: '审核通过',
        7: '已完成'
      },
      rVisibled: false, //审核列表显示
      rTitle: '', //审核列表标题
      rData: [],//审核列表数据
      members:[],//项目成员
      loading:true,

      principal_id:"", //项目负责人Id
      Task1:[],
    }
  },
  created() {
    this.loadTask()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  components: {
    employeeTree,
    reviewDialog
  },
  methods: {
    moment,
    loadTask() {
      var _this = this
      var whereString = `where:{_and:[
        {project:{id:{_eq:"${this.projectId}"}}},
        {type:{_in:[0,3,4]}},
        ${this.searchString}
      ]}`
      this.$apollo
        .query({
          query: gql`query {
          ProjectMember(where:{project_id:{_eq:"${this.projectId}"}}){
            id
            charger_id
            project_id
            member_id
            employee {
              id
              name
            }
            remark
          }
          Project(where:{id:{_eq:"${this.projectId}"}}){
            principal_id
          }
          Task1:Task(where:{type:{_eq:1},project_id:{_eq:"${this.projectId}"}}){
            name
          }
          Task(${whereString},order_by:[{sortNo:asc},{createdAt:asc}]){
            id
            type
            step
            name
            remark
            submitAmount
            approvedAmount
            status
            endDate
            advanceDays
            project{
              id
              name
              endDate
            }
            parent {
              id
              name
            }
            createdBy {id,name}
            createdAt
            handler_id
            handler {id,name}
            numTasks(order_by:[{sortNo:asc},{createdAt:asc}]) {
              id
              name
              type
              step
              name
              remark
              status
              endDate
              advanceDays
              project{name}
              createdBy {id,name}
              createdAt
              childTasks(order_by:[{step:asc},{createdAt:asc}]) {
                id,name,type,status,step,createdAt,reviewDate,createdBy{id,name},
                reviewResult,handler {id,name},approvedAmount,submitAmount,unitPrice
              }
              handler_id
              handler {id,name}
              parent {id, name}
              numParent {id, name}
              project{
                id
                name
                endDate
              }
            }
            childTasks(order_by:[{step:asc},{sortNo:asc},{createdAt:asc}]) {
              sortNo
              id
              name
       				id
              type
              step
              name
              remark
              submitAmount
              approvedAmount
              status
              reviewResult
              reviewDate
              endDate
              advanceDays
              unitPrice
              project{
                id
                name
                endDate
              }
              createdBy {id,name}
              parent {
                id
                name
              }
              createdAt
              handler_id
              handler {id,name}
              numTasks(order_by:[{sortNo:asc},{createdAt:asc}]) {
                id
                name
                type
                step
                name
                remark
                status
                endDate
                advanceDays
                project{
                  id
                  name
                  endDate
                }
                createdBy {id,name}
                createdAt
                childTasks(order_by:[{createdAt:asc}]) {
                  id,name,type,status,step,createdAt,reviewDate,
                  createdBy{id,name},reviewResult,handler {id,name},approvedAmount,submitAmount,unitPrice
                }
                handler_id
                handler {id,name}
                parent {id, name}
                numParent {id, name}
              }
            }
          }
        }`,
          // fetchPolicy: 'network-only'
          fetchPolicy: 'no-cache'
        })
        .then(res => {
          _this.members = res.data.ProjectMember
          _this.Task1 = res.data.Task1
          _this.principal_id = res.data.Project[0].principal_id
          _this.beforeData(res.data.Task)
          _this.loading  = false
          console.log(res, 'get project task data')
        })
        .catch(err => {
          console.log(err, 'get project task data')
        })
    },
    beforeData(data) {
      this.data = data.filter(ele => !ele.parent)
      this.data.forEach((ele, index) => {
        ele.key = index
        if (ele.childTasks.length) {
          ele.children = ele.childTasks.filter(ele => ele.type == 0) //筛选子任务 普通任务

          ele.children.forEach((cEle, cIndex) => {
            cEle.key = index + '_' + cIndex
            if ((cEle.numTasks||[]).length) {
              cEle.children = cEle.numTasks
              cEle.children.forEach((ccEle, ccIndex) => {
                ccEle.key = index + '_' + cIndex + '-' + ccIndex
              })
            }
          })
          if (!ele.children.length) {
            delete ele.children
          }
        } else {
          if ((ele.numTasks||[]).length) {
            ele.children = ele.numTasks
            ele.children.forEach((cEle, cIndex) => {
              cEle.key = index + '_' + cIndex
            })
          }
        }
      })
      // this.data = this.data.concat(data) //避免添加到数据缓存中
      console.log(this.data, 'function beforedata data')
    },
    //搜索
    onSearch(e) {
      // console.log(e)
      var status = -2
      for (var key in this.taskStatus) {
        // console.log(key,this.taskStatus[key])
        if (this.taskStatus[key] == e) {
          status = key
        }
      }
      if (e) {
        this.searchString = `{_or:[{name:{_like:"%${e}%"}},{handler:{name:{_like:"%${e}%"}}},{status:{_eq:${status}}}]}`
      } else {
        this.searchString = ''
      }
      this.loadTask()
    },
    //添加任务
    addTask() {
      var obj = {
        name: '',
        handler: {},
        endDate: '',
        status: 0,
        childTasks: [],
        remark: '',
        file: []
      }
      this.data.push(obj)
    },
    updateTask(string) {
      return this.$apollo.mutate({
        mutation: gql`
          ${string}
        `
      })
    },
    //获取当前行记录
    taskNameFocus(record) {
      this.taskRecord = Object.assign({}, record)
    },
    //修改任务名称
    taskNameChange(record) {
      console.log(record, 'task name change')
      if (!record.name) {
        this.$message.warning('任务名称不能为空')
        return
      }
      // debugger
      if (this.taskRecord.name == record.name) {
        return
      }
      var _this = this
      var mutationString = ``
      if (record.id) {
        mutationString = `
          mutation{
            update_Task(where:{id:{_eq:"${record.id}"}},_set:{
              name:"${record.name}"
            }){
              returning{id}
            }
          }
        `
      } else {
        mutationString = `
          mutation{
            insert_Task(objects:[{
              name:"${record.name}",
              ${record.parent_id ? `parent_id:"${record.parent_id}"`:''}
              project_id:"${this.projectId}",
              createdBy_id:"${this.userInfo.id}"
            }]){
              returning{id}
            }
          }
        `
      }

      _this
        .updateTask(mutationString)
        .then(res => {
          console.log(res, 'update task name success')
          this.loadTask()
          this.$message.success('添加成功')
        })
        .catch(err => {
          console.log(err, 'update task name error')
          this.$message.error('添加失败')
        })
    },

    //截止时间改变
    taskDateChange(e) {
      if (!e) {
        return
      }

      var _this = this
      var date = e.add(8, 'hours').format()
      if(_this.taskRecord.name == ''){
         _this.$message.warning('任务名称不能为空')
         return
      }
      // var date = e.zone("+08:00").format()
      console.log(date, 'endDate change')
      var mutationString = ``
      if (_this.taskRecord.id) {
        mutationString = `
          mutation{
            update_Task(where:{id:{_eq:"${_this.taskRecord.id}"}},_set:{
              endDate:"${date}"
            }){
              returning {endDate}
            }
          }
        `
      } else {
        mutationString = `
          mutation{
            insert_Task(objects:[{
              endDate:"${date}",
              ${_this.taskRecord.parent_id ? `parent_id:"${_this.taskRecord.parent_id}"`:''}
              project_id:"${_this.projectId}"
              createdBy_id:"${_this.userInfo.id}"
            }]){
              returning {endDate}
            }
          }
        `
      }
      console.log(mutationString)
      // return
      _this
        .updateTask(mutationString)
        .then(res => {
          console.log(res, 'update task endDate success')
          _this.loadTask()
          _this.$message.success('修改成功')
        })
        .catch(err => {
          console.log(err, 'update task endDate error')
          _this.loadTask()
          _this.$message.error('修改失败')
        })
    },
    //截止时间
    taskDateFocus(record) {
      this.taskRecord = record
      console.log(record, 'endDate focus')
    },
    //添加负责人
    showHandlerModel(record) {
      console.log(record, 'show modal handler')
      if (record.numParent || (record.numTasks||[]).length) {
        return
      }
      if (!record.name) {
        this.$message.error('还没输入任务名称')
        return
      }
      if(!record.id){
        return
      }
      if (record.status !== 0) {
        //已分配
        return
      }
      this.taskRecord = record
      this.visibled = true
    },
    //修改负责人
    changeHanler(obj) {
      console.log(obj)
      this.visibled = obj.visibled
      var handler = obj.data[0]
      var _this = this

      if (!handler) {
        return
      }
      var mutationString = ``
      if (_this.taskRecord.id) {
        mutationString = `
          mutation{
            update_Task(where:{id:{_eq:"${_this.taskRecord.id}"}},_set:{
              handler_id:"${handler.key}"
            }){
              returning {handler_id}
            }
          }
        `
        _this
          .updateTask(mutationString)
          .then(res => {
            console.log(res, 'update task endDate success')
            _this.loadTask()
            _this.$message.success('修改成功')
          })
          .catch(err => {
            console.log(err, 'update task endDate error')
            _this.loadTask()
            _this.$message.error('修改失败')
          })
      }
    },
    //删除任务
    deleteTask(record, index) {
      console.log(record, index, 'delete task')
      var _this = this
      this.$confirm({
        title: '删除任务',
        content: `你确定删除该任务？`,
        onOk() {
          if (record.id) {
            var mutationString = `
              mutation{
                delete_Task(where:{_or:[{id:{_eq:"${record.id}"}},{parent_id:{_eq:"${record.id}"}}]}){
                  returning{id}
                }
              }
            `
            _this
              .updateTask(mutationString)
              .then(res => {
                _this.loadTask()
                _this.$message.success('删除任务成功')
              })
              .catch(err => {
                _this.$message.error('删除任务失败')
              })
          } else {
            _this.data.splice(index)
          }
        },
        onCancel() {}
      })
    },
    //分配
    distribution(record,type) {
      var _this = this
      if (!record.handler_id) {
        _this.$message.error('请选择负责人')
        return
      }
      console.log(record,'record')
      // return
      // if (!record.endDate) {
      //   _this.$message.error('请选择截止日期')
      //   return
      // }
      let title = "分配任务"
      if(type == 2){
        title = "重新分配任务"
      }

      this.$confirm({
        title: title,
        content: `你确定${title}？`,
        onOk() {
          if (record.id) {
            var deleteTask = ``
            //强制分配清空子任务
            if(type == 2){
              deleteTask = `delete_Task(where:{parent_id:{_eq:"${record.id}"}}){returning{id}}`
            }

            let hasMember = _this.members.filter(e => e.member_id == record.handler_id)
            // debugger
            let addMember = ``
            let notiString = ``
            if(!hasMember.length){
              // addMember = ``
              var memberString = ``
              
              var performString = ``
              // data.forEach(ele => {
                memberString = `{
                  project_id:"${_this.projectId}",
                  member_id:"${record.handler_id}",
                },`
                performString = `{
                  employee_id:"${record.handler_id}"
                  project_id:"${_this.projectId}",
                  ratios:[{name:"专业系数",value: ""},{name:"难度系数",value: ""},{name:"规模系数",value: ""},{name:"绩效分",value: ""}],
                }`
                notiString = `{
                  type:3,
                  name: "【${_this.userInfo.name}】将您添加为【${record.project.name}】的项目组成员",
                  status: 0,
                  recipients:{
                    data:{
                      recipient_id:"${record.handler_id}"
                    }
                  },
                  createdBy_id:"${_this.userInfo.id}"
                },`
              // })
              var mutationString = `insert_ProjectMember(objects:[${memberString}]){returning{id}}`
              // var notificationString = `insert_Notification(objects:[${notiString}]){returning{id}}`

              var performanceString = `insert_Performance(objects:[${performString}]){returning {id}}`
              // console.log(mutationString,notificationString,'insert notification and projectMember string')
              addMember = mutationString  + '\n' + performanceString
            }

            var mutationString = `
              mutation{
                update_Task(where:{id:{_eq:"${record.id}"}},_set:{
                  status:1
                }){
                  returning{id}
                }
                ${addMember}
                ${deleteTask}
                insert_Notification(objects:
                  [
                    {
                      recipients:{
                        data:{
                          recipient_id:"${record.handler_id}"
                        }
                      },
                      createdBy_id:"${_this.userInfo.id}",
                      type:2,
                      status:0,
                      name:"【${_this.userInfo.name}】分配了【${record.project.name}】项目中的【${
              record.name
            }】任务给您，任务截止日期 ${record.project.endDate ? moment(record.project.endDate).add(-record.advanceDays,'days').format('YYYY-MM-DD') : ''}"
                    }
                    ${notiString}
                  ]
                ){
                  returning{id}
                }
              }
            `
            _this
              .updateTask(mutationString)
              .then(res => {
                _this.loadTask()
                _this.$message.success('分配任务成功')
              })
              .catch(err => {
                _this.$message.error('分配任务失败')
              })
          }
        },
        onCancel() {}
      })
    },
    //备注
    changeRemark(record) {
      console.log(record, 'change remark')
    },
    //改变任务状态
    async changTaskStatus(status, record) {
      let _this = this
      this.$confirm({
        title: '编辑任务',
        content: '确定修改任务状态？',
        async onOk() {
          console.log(status, record)
          var mutationString = `mutation {
            update_Task(where:{id:{_eq:"${record.id}"}},_set:{status:${status}}){returning{id}}
          }`
          let res = await _this.dbConn.mutation(mutationString)
          record.status = status
        },
        cancel() {}
      })
    },
    //显示任务审核列表
    showReview(record) {
      console.log(record)
      // for (var col in dataObj) {
      var step0Array = record.childTasks.filter(ele => ele.type == 2 && ele.step == 0)
      var stopOtherArray = record.childTasks.filter(ele => ele.type == 2 && ele.step != 0)

      var dataArray = []
      for (var i = 0; i < step0Array.length; i++) {
        var thisCreatedAt = step0Array[i].createdAt //当前一级审核时间
        var nextCreatedAt = (step0Array[i + 1] || {}).createdAt //下一次一级审核时间
        dataArray[i] = [step0Array[i]]
        for (var j = 0; j < stopOtherArray.length; j++) {
          var _thisCreatedAt = stopOtherArray[j].createdAt
          if (nextCreatedAt) {
            if (thisCreatedAt < _thisCreatedAt && _thisCreatedAt < nextCreatedAt) {
              //大于当前一级审核时间小于下一次一级审核时间归属到当前审核
              dataArray[i].push(stopOtherArray[j])
            }
          } else {
            if (_thisCreatedAt > thisCreatedAt) {
              //最后一个
              dataArray[i].push(stopOtherArray[j])
            }
          }
        }
      }
      console.log(dataArray)
      this.rVisibled = true
      this.rData = dataArray
      this.rTitle = record.name
      // dataObj[col] = dataArray
      // }
    },
    //隐藏任务审核列表
    reviewDialogCancel() {
      this.rVisibled = false
    },
    //创建子任务
    addChildren(record,index){
      var obj = {
        type:record.type,
        name: '',
        handler: {},
        parent_id:record.id,
        endDate: '',
        status: 0,
        childTasks: [],
        remark: '',
        file: []
      }
      record.childTasks.push(obj)
      this.data.splice(index,1,record)
      this.beforeData(this.data)
      console.log(record,index,'record')
    },
    //复制任务
    copyTask(record){
      console.log(record,'copy')
    },
    //插入任务
    insertTask(record,index){
      console.log(record,index,'insertTask')
    },
    //改变任务的提前天数
    async changeAdvance(record,e){
      console.log(record,e)
      let date = this.moment(record.project.endDate).add(-record.advanceDays,'days').format()
      let mutationString = `mutation {
        update_Task(where:{id:{_eq:"${record.id}"}},_set:{
          advanceDays:${record.advanceDays},
          endDate:"${date}"
        }){returning{id,endDate}}
      }`

      let res = await this.dbConn.mutation(mutationString)
      console.log(res,'change advance success')

    },

    //创建特殊任务
    async createReview(type) {
      let data = this.data.filter(ele => ele.type == type)
      console.log(data,this.Task1)
      
      
      
      if(type == 3){
        
        if(!this.Task1.length){
          this.$message.warning('项目还没设置稿件任务!')
          return
        }
        name = "成果审核"

        if(data.length){
          this.$message.warning('成果审核已存在')
        }
      }else {
        name = "收费任务"
        if(data.length){
          return
        }
      }
      if(!this.principal_id){
        this.$message.warning('项目还没选择负责人!')
        return
      }
      var obj = {
        name: name,
        handler_id:this.principal_id,
        status: 0,
        type:type,
        remark: '',
      }

      var mutation = `mutation {
        insert_Task(objects:[{
          name:"${name}"
          project_id:"${this.projectId}"
          handler_id:"${this.principal_id}"
          status:0,
          type:${type},
          createdBy_id:"${this.userInfo.id}"
        }]){
          returning {id}
        }
      }`

      let res = await this.dbConn.mutation(mutation)
      this.$message.success(`添加${name}成功`)
      this.loadTask()


      
    }
  }
}
</script>
<style>
.projectTask .ant-table-thead > tr > th,
.projectTask .ant-table-tbody > tr > td {
  padding: 8px 16px;
}
.projectTask .ui-new-table td {
  font-size: 13px;
}
.projectTask .taskName {
  border: 0px;
  box-shadow: unset;
}
.projectTask .taskName:hover {
  border: 0px;
  box-shadow: unset;
}
</style>

