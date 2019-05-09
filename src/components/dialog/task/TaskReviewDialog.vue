<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="inititle"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="maskClosable"
      
      :width="700"
    >
      <a-row class="task-review-dialog">
        <a-col :span="24">
          <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <th width="80">审核主题：</th>
                <td colspan="3">
                  <a-select
                    showSearch
                    placeholder="审核主题"
                    optionFilterProp="children"
                    v-model="name"
                    style="width: 555px"
                    disabled
                  >
                    <a-select-option value="初稿">初稿</a-select-option>
                    <a-select-option value="二稿">二稿</a-select-option>
                    <a-select-option value="成果审核">成果审核</a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr>
                <th width="80"></th>
                <td class="ui-radio_group" style="width: 160px">
                  <a-radio-group
                    v-model="reviewResult"
                    @change="reviewResultChange"
                    name="radioGroup"
                  >
                    <a-radio :value="1">同意</a-radio>
                    <a-radio :value="0">不同意</a-radio>
                  </a-radio-group>
                </td>
                <th width="80">审核阶段：</th>
                <td>
                  <a-select v-model="step" style="width: 120px" disabled>
                    <a-select-option value="0">一级审核</a-select-option>
                    <a-select-option value="1">二级审核</a-select-option>
                    <a-select-option value="2">三级审核</a-select-option>
                    <a-select-option value="3">一般审核</a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr v-if="type == 5">
                <th class="th-top">暂停原因：</th>
                <td colspan="3">
                  <a-textarea
                    v-model="remark"
                    style="width:100%"
                    rows="3"
                    disabled
                    placeholder=""
                  ></a-textarea>
                </td>
              </tr>
              <tr>
                <th class="th-top">审核意见：</th>
                <td colspan="3">
                  <a-textarea
                    v-model="reviewComment"
                    style="width:100%"
                    rows="3"
                    placeholder="审核意见"
                  ></a-textarea>
                </td>
              </tr>
              <tr v-if="taskType != 0 && taskType != 4 && type != 5">
                <th>关键指标：</th>
                <td colspan="3">
                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody v-if="businessType.indexOf('编制') == -1">
                      <tr>
                        <th width="90">送审金额：</th>
                        <td>
                          <a-input-number
                            v-model="submitAmount"
                            :min="0"
                            :step="0.1"
                            style="width: 140px"
                            disabled
                          />&nbsp;元
                        </td>
                        <th width="90">审定金额：</th>
                        <td>
                          <a-input-number
                            v-model="approvedAmount"
                            :min="0"
                            :step="0.1"
                            style="width: 140px"
                            disabled
                          />&nbsp;元
                        </td>
                      </tr>
                      <tr>
                        <th>审增审减额：</th>
                        <td>
                          <a-input-number
                            v-model="differenceValue"
                            :min="0"
                            :step="0.1"
                            style="width: 140px"
                            readonly
                            disabled
                          />&nbsp;元
                        </td>
                        <!-- <th>复核造价：</th>
                        <td>
                          <a-input-number
                            v-model="unitPrice"
                            :min="0"
                            :step="0.1"
                            style="width: 110px"
                          />&nbsp;元
                        </td> -->
                      </tr>
                      <!-- <tr>
                        <th width="90">准确率：</th>
                        <td>
                          <a-input-number
                            v-model="rate"
                            :min="0"
                            :step="0.1"
                            style="width: 110px"
                            disabled
                          />
                        </td>
                      </tr> -->
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <th width="90">审定金额：</th>
                        <td>
                          <a-input-number
                            v-model="approvedAmount"
                            :min="0"
                            :step="0.1"
                            style="width: 140px"
                            disabled
                          />&nbsp;元
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- 审核阶段 -->
              <tr v-if="auditData.length && taskType != 0 && taskType != 4 && type != 5">
                <th></th>
                <td colspan="3">
                  <a-table
                    :columns="columns"
                    :dataSource="auditData"
                    size="middle"
                    :pagination="false"
                  >
                    <div slot="unitPrice" slot-scope="text,record,index" v-if="index < auditData.length - 1">
                      <a-input-number :disabled="record.step != step" v-model="record.unitPrice" @change="changeUnitPrice" style="min-width:120px"/>
                    </div>
                  </a-table>
                </td>
              </tr>

              <tr v-if="files.length">
                <th class="th-top">附件：</th>
                <td colspan="3">
                  <div v-for="(record,index) in files" :key="index">
                    <span :style="{color:record.iconColor,marginRight:'10px'}">
                      <a-icon
                        :type="record.iconType"
                        :theme="record.iconType == 'file-jpg'?'outlined':'filled'"
                        style="font-size: 16px;"
                      />
                    </span>
                    <a
                      @click="downloadFile(record)"
                      class="download-a"
                      :title="record.name"
                    >{{ record.name }}</a>
                  </div>
                </td>
                <!-- <td colspan="3">
                  <a-upload name="file" :multiple="false" :action="uploadHref"
                            @change="uploadChange">
                    <a-button>
                      <a-icon type="upload"/>
                      添加文件
                    </a-button>
                  </a-upload>
                </td>-->
              </tr>
              <tr class="nextTrClass">
                <th width="80"></th>
                <td>
                  <a-checkbox
                    @change="toNextReviewer"
                    v-model="isShowNextReview"
                    :disabled="isNextHandler"
                  >是否给下一审核人</a-checkbox>
                </td>
              </tr>
              <tr id="nextTr" :class="isShowNextReview ? showNextReview : hideNextReview">
                <th width="80">下一阶段：</th>
                <td>
                  <a-select v-model="nextStep" style="width: 120px" disabled>
                    <a-select-option value="0">一级审核</a-select-option>
                    <a-select-option value="1">二级审核</a-select-option>
                    <a-select-option value="2">三级审核</a-select-option>
                  </a-select>
                </td>
                <th width="80">
                  <label class="ant-form-item-required">审核人：</label>
                </th>
                <td width="230">
                  <a-input
                    type="text"
                    v-model="nextHandler.name"
                    placeholder
                    readonly
                    maxlength="200"
                    @click="showEModal(1, 1, true)"
                  />
                  <!--ms-if-->
                </td>
              </tr>
            </tbody>
          </table>
        </a-col>
        
      </a-row>
      <a-row slot="footer">
        <a-col :span="24" >
          <a-col :span="8" style="text-align:left">
            <a-button type="primary" @click="goDetail" v-if="auditData.length && taskType != 0 && taskType != 4 && type != 5">项目造价</a-button>
          </a-col>
          <a-col :span="16" >
            <a-button type="primary" @click="handleOk">确定</a-button>
            <a-button type="default" @click="handleCancel">取消</a-button>
          </a-col>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visible"
      :type="employeeType"
      :isOne="isOne"
      @changeStatus="changeEMStatus"
    />
  </div>
</template>

<script>
import employeeTree from '@/components/same/employeeTree'
import moment from 'moment'
import { db } from '@/utils/db'

const columns = [
  {
    title: '审核阶段',
    dataIndex: 'auditName'
  },
   {
    title: '提交造价',
    dataIndex: 'approvedAmount',
    scopedSlots: { customRender: 'approvedAmount' }
  },
  {
    title: '复核造价',
    dataIndex: 'unitPrice',
    scopedSlots: { customRender: 'unitPrice' }
  },
  {
    title: '准确率',
    dataIndex: 'rate'
  },
  {
    title: '差错率',
    dataIndex: 'error'
  }
]

export default {
  props: {
    inititle: {
      type: String,
      default: ''
    },
    initvisibled: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    currentTask: {
      type: Object,
      default: null
    }
  },
  components: {
    employeeTree
  },
  data() {
    return {
      showNextReview: 'showNextReview',
      hideNextReview: 'hideNextReview',
      visible: false,
      visibled: this.initvisibled,
      isShowNextReview: false,
      dbConn: new db(this.$apollo),
      employeeType: 1, //1显示员工 2只显示部门
      subType: 1, //1：负责人 2：通知到
      isOne: true, //true: 只选一个 false: 可以多选
      emTitle: '添加人员',
      name: '成果审核', //审核主题
      step: '0', //审核阶段
      type: 1, //任务审核任务
      taskType: 0,//当前父任务类型
      sendTo: [], //通知到的人
      sendDesc: '',
      handler: {}, //审核人id
      submitAmount: 0, //送审金额
      approvedAmount: 0, //审定金额
      unitPrice: 0, //单方造价
     
      remark: 0, //审核纪要
      reviewResult: 0, //审核结果 -1：未审核 0:不同意 1:同意
      reviewComment: '', //审核意见
      reviewDate: new moment().format(), //审核日期
      isNextHandler: false, //是否禁止给下一级
      nextStep: '1', //下级审核阶段
      nextHandler: {}, //下级审核人
      files: [], //上传文件,
      uploadHref: '',
      columns,
      obj: {0:'一级审核',1:'二级审核',2:'三级审核'},
      auditData: [],
      taskData:[],
      businessType:'',
    }
  },
  computed: {
    differenceValue: function() {
      return parseFloat(((this.approvedAmount || 0) - (this.submitAmount || 0)).toFixed(2))
    },
    rate:function() {
      return ((1-(Math.abs((this.unitPrice || 0)-(this.approvedAmount || 0)) / (this.approvedAmount || 0)))* 100).toFixed(2) + '%'
    }
  },
  methods: {
    handleOk() {
      if(this.taskType != 0 && this.taskType != 4 && this.type != 5){
        if((this.unitPrice||0) <= 0 && this.reviewResult == 1){
          this.$message.warning('请输入复核造价')
          return
        }
      }
      this.$emit('reviewSave', this)
    },
    handleCancel() {
      this.$emit('reviewCancel')
    },
    toNextReviewer(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    async renewDocument(task) {
      let where = ``
      if(!task.parent){
        return
      }
      // if (task.type == 3) {
      //   //多级复核
      //   where = `_and:[{relatedId:{_eq:"${task.project.id}"}},{projectFileType:{_eq:2}}]`
      // } else {
      //   where = `_and:[{taskId:{_eq:"${task.parent.id}"}},{type:{_eq:4}}]`
      // }
      where = `_and:[{taskId:{_eq:"${task.parent.id}"}}]`
      var queryString = `query {
          Document(where:{${where}}){
            id
            name
            property
            url
          }
        }`
      console.log(queryString)
      let res = await this.dbConn.query(queryString)
      this.files = res.data.Document
      console.log(res, 'res')

      this.files.forEach(ele => {
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
    },
    //显示人员或部门弹框
    showEModal(type, subType, isOne) {
      this.employeeType = type
      this.subType = subType
      this.isOne = isOne
      this.visible = true
      if (subType === 1) {
        this.emTitle = '选择审核人'
      } else {
        this.emTitle = '通知到'
      }
    },
    //人员/部门弹框状态改变
    changeEMStatus(obj) {
      console.log(obj)
      this.visible = obj.visibled
      if (!obj.data.length) {
        return
      }
      if (this.subType === 1) {
        this.nextHandler.id = obj.data[0].key
        this.nextHandler.name = obj.data[0].title
        //员工
      } else {
        this.sendTo = obj.data
        this.sendDesc = ''
        const _this = this
        obj.data.forEach(function(item) {
          _this.sendDesc = _this.sendDesc + item.title + ', '
        })
      }
    },
    reviewResultChange(e) {
      // console.log(e.target.value)
      if (this.nextStep == 3) {
        this.isNextHandler = true
        return
      }
      if (e.target.value == 0) {
        // console.log(this.nextStep,'nextStep')
        this.isNextHandler = true
        this.isShowNextReview = false
      } else {
        this.isNextHandler = false
        // this.isShowNextReview = true/
      }
    },
    uploadChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList, 'uploading')
        this.files = info.fileList.filter(ele => !ele.error)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
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
    //获取审核阶段
    async auditPhase(task) {
      if(this.type == 5){
        return
      }
      let where = ``
      if (task.type == 3) {
        //多级复核
        where = `_and:[{project_id:{_eq:"${task.project.id}"}},{type:{_eq:3}}]`
      } else {
        //任务审核
        where = `_and:[{parent_id:{_eq:"${task.parent.id}"}},{type:{_eq:2}}]`
      }

      let queryString = `query {
        Task(where:{${where}},order_by:[{step:asc},{createdAt:asc}]){
          id
          name
          step
          status
          type
          approvedAmount
          unitPrice
          createdAt
        }
      }`

      let res = await this.dbConn.query(queryString)
      this.taskData = res.data.Task
      console.log(res,2)
      this.beforeData(this.taskData)
      // console.log(res,2)
      
      
    },

    beforeData(data) {
      let step0 = data.filter(e => e.step == 0)
      let lastStep = step0[step0.length - 1]
      this.auditData = []
      var totalError = 0
      if(lastStep){
        // if(lastStep.status == 6){
        lastStep.auditName = this.obj[lastStep.step]
        lastStep.rate =  1-(Math.abs((lastStep.unitPrice || 0)-(lastStep.approvedAmount || 0)) / (lastStep.approvedAmount || 0))
        lastStep.error = 1 - lastStep.rate 
        totalError += lastStep.error
        lastStep.error =(lastStep.error * 100).toFixed(2) + '%'
        // totalError +=
        lastStep.rate = (lastStep.rate * 100).toFixed(2) + '%'
        this.auditData.push(lastStep)
      }
      let lastCreatedAt = lastStep.createdAt
      let approvedAmount = lastStep.unitPrice
      let otherStep = data.filter(e => e.step != 0)
      if(otherStep.length){
        otherStep.forEach(ele => {
          if(ele.createdAt > lastCreatedAt){
            // var approvedAmount = otherStep
            if(ele.step == 1){ //二级复核
              ele.approvedAmount = approvedAmount
            }else {

              ele.approvedAmount = otherStep.filter(e => e.step == ele.step - 1 && e.createdAt > lastCreatedAt)[0].unitPrice
            }
            ele.auditName = this.obj[ele.step]
            ele.rate =  1-(Math.abs((ele.unitPrice || 0)-(ele.approvedAmount || 0)) / (ele.approvedAmount || 0))
            // ele.error =((1 - ele.rate ) * 100).toFixed(2) + '%'
            ele.error = 1 - ele.rate 
            totalError += ele.error
            ele.error =(ele.error * 100).toFixed(2) + '%'

            // lastStep.error =(lastStep.error * 100).toFixed(2) + '%'
            ele.rate = (ele.rate * 100).toFixed(2) + '%'
            this.auditData.push(ele)
          }
        })
        
      }
      var obj = {auditName:'总差错率',approvedAmount:'',unitPrice:'',rate:'',error:(totalError * 100).toFixed(2) + '%'}
      this.auditData.push(obj)
      console.log(this.auditData,'this.auditData')
    },

    changeUnitPrice(e){
      console.log(e)
      this.unitPrice = e
      this.beforeData(this.taskData)
    },
    //跳转到项目项目造价
    goDetail() {
      console.log(this.currentTask.project)

      let routeData = this.$router.resolve({
        name: "project",
        query:{projectId:this.currentTask.project.id,name:this.currentTask.project.name,type:7}
      });
      // console.log(routeData.href)
      window.open(routeData.href, '_blank');

    }
  },
  watch: {
    initvisibled(newT, oldT) {
      console.log(newT, oldT, '-------')
      this.visibled = newT
      if (this.currentTask) {
        console.log(this.currentTask,'this.currentTask')
        this.name = this.currentTask.name
        this.step = this.currentTask.step.toString()
        this.type = this.currentTask.type
        this.remark = this.currentTask.remark

        this.taskType = (this.currentTask.parent||{}).type

        this.submitAmount = this.currentTask.submitAmount
        this.approvedAmount = this.currentTask.approvedAmount
        this.unitPrice = this.currentTask.unitPrice
        this.nextStep = (this.currentTask.step + 1).toString()
        this.reviewResult = 1
        this.isShowNextReview = false
        this.businessType = this.currentTask.project.businessType
        if (newT) {
          this.renewDocument(this.currentTask)
          this.auditPhase(this.currentTask)
        }

        // this.uploadHref = '/apis/upload?path=' + encodeURI(this.currentTask.project.id)
        this.uploadHref = `http://${location.hostname}:15050/upload?path=` + this.currentTask.project.id
        if (this.nextStep == 3) {
          this.isNextHandler = true
        } else {
          this.isNextHandler = false
        }
      }
    },
    currentTask: function(task) {
      console.log(task,'task')
      // alert('currentTask change')
      // debugger
      // 设置审核任务的信息
      if (this.currentTask) {
        // debugger
        this.name = task.name
        this.step = task.step.toString()
        this.type = task.type
        this.submitAmount = task.submitAmount
        this.approvedAmount = task.approvedAmount
        this.unitPrice = task.unitPrice
        this.nextStep = (task.step + 1).toString()
        this.reviewResult = 1
        this.isShowNextReview = false

        this.businessType = task.project.businessType
        // this.uploadHref = '/apis/upload?path=' + encodeURI(this.currentTask.project.id)
        this.uploadHref = `http://${location.hostname}:15050/upload?path=` + this.currentTask.project.id
        if (this.nextStep == 3) {
          this.isNextHandler = true
        }
        if (this.visibled) {
          this.renewDocument(task)
          this.auditPhase(task)
        }
      }
    }
  }
}
</script>
<style>
.ui-w115 {
  width: 115px !important;
}

.form-table th,
.form-table td {
  padding: 5px 0;
  font-size: 14px;
  position: relative;
}

.th-right {
  text-align: right;
}

.th-top {
  padding-top: 9px !important;
  vertical-align: top;
}

.add-task_dialog th {
  text-align: right;
}

.showNextReview {
  display: table-row;
}

.hideNextReview {
  display: none;
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
.audits {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  line-height: 30px;
}
</style>

