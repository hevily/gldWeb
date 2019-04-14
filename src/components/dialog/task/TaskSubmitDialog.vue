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
                <th width="80">审核阶段：</th>
                <td>
                  <a-select v-model="step" style="width: 120px">
                    <a-select-option value="0">一级审核</a-select-option>
                    <a-select-option value="1">二级审核</a-select-option>
                    <a-select-option value="2">三级审核</a-select-option>
                    <a-select-option value="3">一般审核</a-select-option>
                  </a-select>
                </td>
                <th width="80">
                  <label class="ant-form-item-required">审核人：</label>
                </th>
                <td width="230">
                  <a-input
                    type="text"
                    v-model="handler.name"
                    placeholders
                    readonly
                    maxlength="200"
                    v-decorator="[
                      'name',
                      {rules: [{ required: true, message: '请选择审核人!' }]}
                    ]"
                    @click="showEModal(1, 1, true)"
                  />
                  <!--ms-if-->
                </td>
              </tr>
              <tr>
                <th>通知到：</th>
                <td colspan="3">
                  <a-input
                    type="text"
                    v-model="sendDesc"
                    placeholder="通知到"
                    readonly
                    maxlength="200"
                    @click="showEModal(1, 2, false)"
                  />
                </td>
              </tr>
              <tr v-if="taskType != 0 && taskType != 4">
                <th>关键指标：</th>
                <td colspan="3">
                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody v-if="businessType.indexOf('编制') == -1">
                      <tr>
                        <th width="90">送审金额：</th>
                        <td>
                          <a-input-number v-model="submitAmount" :min="0" :step="0.1" style="width: 140px"/>&nbsp;元
                        </td>
                        <th width="90">审定金额：</th>
                        <td>
                          <a-input-number v-model="approvedAmount" :min="0" :step="0.1" style="width: 140px"/>&nbsp;元
                        </td>
                      </tr>
                      <tr>
                        <th>审增审减额：</th>
                        <td>
                          <a-input-number v-model="differenceValue" :min="0" :step="0.1" style="width: 140px" readonly disabled/>&nbsp;元
                        </td>
                        <!-- <th>复核造价：</th>
                        <td>
                          <a-input-number v-model="unitPrice" :min="0" :step="0.1" style="width: 110px"/>&nbsp;元
                        </td> -->
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <th width="90">审定金额：</th>
                        <td>
                          <a-input-number v-model="approvedAmount" :min="0" :step="0.1" style="width: 140px"/>&nbsp;元
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th class="th-top">描述：</th>
                <td colspan="3">
                  <a-textarea v-model="remark" style="width:100%" rows="3" placeholder="审核纪要"></a-textarea>
                </td>
              </tr>
              <tr>
                <th class="th-top">附件：</th>
                <td colspan="3">
                  <a-upload name="file" :multiple="false" :action="uploadHref"
                            @change="uploadChange"  :remove="fileRemove">
                    <a-button>
                      <a-icon type="upload"/>
                      添加文件
                    </a-button>
                  </a-upload>
                </td>
              </tr>
            </tbody>
          </table>
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
  import { db } from '@/utils/db'

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
      subName: {
        type:String,
        default:''
      },
      projectId: {
        type:String,
        default:''
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
        dbConn: new db(this.$apollo),
        visible: false,
        visibled: this.initvisibled,
        employeeType: 1, //1显示员工 2只显示部门
        subType: 1,     //1：负责人 2：通知到
        isOne: true,     //true: 只选一个 false: 可以多选
        emTitle: '添加人员',
        name: this.subName, //审核主题
        step: '0',  //审核阶段
        type: 2, //任务审核任务
        taskType: 0,//当前任务类型
        sendTo: [], //通知到的人数组
        sendDesc: '',//通知到的人字符
        handler: {}, //审核人id
        submitAmount: 0, //送审金额
        approvedAmount: 0, //审定金额
        unitPrice: 0, //单方造价
        remark: '', //审核纪要
        files: [], //上传文件,
        uploadHref:'', //上传路劲
        total:0,
        businessType:'',
      }
    },
    computed: {
      differenceValue: function() {
        // return this.approvedAmount - this.submitAmount
        return parseFloat(((this.approvedAmount||0) - (this.submitAmount||0)).toFixed(2))
      }
    },
    methods: {
      handleOk() {
        // debugger
        if(this.taskType != 0 && this.taskType != 4){
          if((this.submitAmount||0) <= 0 && this.businessType.indexOf('编制') == -1){
            this.$message.warning('请输入送审金额')
            return
          }
          if((this.approvedAmount||0) <= 0){
            this.$message.warning('请输入审定金额')
            return
          }
        }
        // if(this.total != this.approvedAmount){
        //   this.$message.warning('审定金额与最后一稿金额不符，请更正后提交')
        //   return
        // }
        

        this.$emit('submitSave2', this)
      },
      handleCancel() {
        this.$emit('submitCancel')
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
          this.handler.id = obj.data[0].key
          this.handler.name = obj.data[0].title
          //员工
        } else {
          this.sendTo = obj.data
          this.sendDesc = ''
          const _this = this
          obj.data.forEach(function(item){
            _this.sendDesc = _this.sendDesc + item.title + ', '
          })
        }
      },
      uploadChange(info) {
        this.files = []
        if (info.file.status !== 'uploading') {
          this.files = info.fileList.filter(ele => !ele.error)
        }
        if (info.file.status === 'done') {
          console.log(info.fileList)
          console.log(this.file)
          this.$message.success(`${info.file.name} 上传成功`)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`)
        }
      },
      //移除文件
      fileRemove(file){
        if(!file.error){
          console.log(file,'debugger')
        }
      },
     async getAllMoney() {
        let query = `
            query {
              Project(where: {id:{_eq:"${this.projectId}"}}) {
                docNum
                tasks(where:{type:{_eq:0}},order_by:[{sortNo:asc},{createdAt:asc}]) {
                  sortNo
                  id
                  name
                  submitAmount
                  approvedAmount
                  unitPrice
                  childTasks{
                    id
                  }
                  numTasks(order_by:[{sortNo:asc}]){
                    sortNo
                    id
                    unitPrice
                    submitAmount
                    approvedAmount
                  }
                }
              }
            }
          `


          let res = await this.dbConn.query(query)
          let docNum = res.data.Project[0].docNum
          let task = res.data.Project[0].tasks
          let total = 0
          let totalSubmitAmount = 0
          task.forEach(e => {
            if(e.childTasks){
              total += e.unitPrice || 0
              totalSubmitAmount += e.submitAmount || 0
            }
          })
          this.submitAmount = totalSubmitAmount.toFixed(2)
          this.approvedAmount = total
          // this.total = total
          console.log(total,totalSubmitAmount)
          console.log(res,'getalltask')
      }
    },
    watch: {
      initvisibled(newT, oldT) {
        console.log(newT, oldT, this.name,this.currentTask,'-------')
        this.visibled = newT
        // this.uploadHref = '/apis/upload?path=' + encodeURI(this.projectId)  
        this.uploadHref = `http://${location.hostname}:15050/upload?path=` + this.projectId
        if(this.currentTask){
          this.submitAmount = this.currentTask.submitAmount
          this.approvedAmount = this.currentTask.approvedAmount
          this.unitPrice = this.currentTask.unitPrice
          this.taskType = this.currentTask.type
          this.businessType = this.currentTask.project.businessType || ''
          console.log(this.businessType,'this.this.this.')
          if(this.taskType == 3){
            this.getAllMoney()
          }
          
          // this.name = this.currentTask.name
          // this.step = this.currentTask.step.toString()
          // this.type = this.currentTask.type
          // this.submitAmount = this.currentTask.submitAmount
          // this.approvedAmount = this.currentTask.approvedAmount
          // this.unitPrice = this.currentTask.unitPrice
          // this.nextStep = (this.currentTask.step + 1).toString()
          // this.reviewResult = 1
          // this.isShowNextReview = false
          // // this.uploadHref = '/apis/upload?path=' + encodeURI(this.currentTask.project.id)  
          // this.uploadHref = `http://${location.hostname}:15050/upload?path=` + this.currentTask.project.id
          // if(this.nextStep == 3){
          //   this.isNextHandler = true
          // }
        }
        console.log(this.uploadHref)
      },
      subName(newT){
        this.name = newT
        this.sendTo = []
        this.sendDesc = ''
        this.remark= '' 
        // this.submitAmount= 0 
        // this.approvedAmount= 0 
        // this.unitPrice= 0 
        
      },
      currentTask: function(task) {
        // alert('currentTask change')
        console.log(task)
        // debugger
        // 设置审核任务的信息
        if(this.currentTask){
          // debugger
          // this.sendTo = []
          // this.sendDesc = ''
          // this.remark= '' 
          // this.name = task.name
          // this.step = task.step.toString()
          // this.type = task.type
          this.submitAmount = task.submitAmount
          this.approvedAmount = task.approvedAmount
          this.unitPrice = task.unitPrice
          this.taskType = task.type
          this.businessType = task.project.businessType || ''
          console.log(this.businessType,'this.this.this.')
          if(this.taskType == 3){
            this.getAllMoney()
          }
          // this.nextStep = (task.step + 1).toString()
          // this.reviewResult = 1
          // this.isShowNextReview = false
          // this.uploadHref = '/apis/upload?path=' + encodeURI(this.currentTask.project.id)  
          // this.uploadHref = `http://${location.hostname}:15050/upload?path=` + this.currentTask.project.id
          // if(this.nextStep == 3){
          //   this.isNextHandler = true
          // }
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
</style>

