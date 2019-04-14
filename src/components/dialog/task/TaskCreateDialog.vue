<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="inititle"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleOk"
      :maskClosable="maskClosable"
      :width="550"
      :footer="null"
    >
      <a-row class="add-task_dialog">
        <a-form :form="form" @submit="handleSubmit">
          <a-col :span="24">
            <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <th width="90" class="th-top">
                    <label class="ant-form-item-required">任务：</label>
                  </th>
                  <td colspan="3">
                    <a-form-item>
                      <a-textarea
                        v-decorator="[
                          'name',
                          {rules: [{ required: true, message: '名称不能为空' }]}
                        ]"
                        class
                        rows="3"
                        style="width:370px"
                      ></a-textarea>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <th width="90">
                    <label class="ant-form-item-required">负责人：</label>
                  </th>
                  <td>
                    <a-input
                      type="text"
                      style="width:120px"
                      readonly="readonly"
                      placeholder="负责人"
                      :value="handler.name"
                      @click="showEmModal(1)"
                    />
                  </td>
                  <th width="90">
                    <label class="ant-form-item-required">发起人：</label>
                  </th>
                  <td>
                    <a-input
                      type="text"
                      style="width:120px"
                      readonly="readonly"
                      placeholder="发起人"
                      :value="createdBy.name"
                      @click="showEmModal(2)"
                    />
                  </td>
                </tr>
                <tr>
                  <th width="90">开始日期：</th>
                  <td>
                    <span class="ui-date">
                      <a-date-picker style="width:120px" v-model="startDate"/>
                    </span>
                  </td>
                  <th width="90">
                    <label class="ant-form-item-required">截止日期：</label>
                  </th>
                  <td>
                    <span class="ui-date">
                      <a-form-item>
                        <a-date-picker
                          v-decorator="[
                            'endDate',
                            {rules: [{ required: true, message: '截止日期不能为空' }]}
                          ]"
                          style="width:120px"
                          :disabledDate="disabledDate"
                        />
                      </a-form-item>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th class="th-top" width="90">关联项目：</th>
                  <td colspan="3">
                    <a-input
                      type="text"
                      style="width:370px"
                      readonly="readonly"
                      placeholder="所属项目"
                      :value="project.name"
                      @click="showTPLDialog"
                    />
                    <!--ms-if-->
                  </td>
                </tr>
                <tr>
                  <th class="th-top" width="90">备注：</th>
                  <td colspan="3">
                    <a-textarea style="width:370px" rows="3" placeholder="任务描述" v-model="remark"></a-textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :span="24" :style="{textAlign:'center'}">
            <a-button type="primary" html-type="submit" :style="{marginRight:'10px'}">确定</a-button>
            <a-button type="default" @click="cancel">取消</a-button>
          </a-col>
        </a-form>
      </a-row>
    </a-modal>
    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="emVisibled"
      :type="emType"
      :isOne="isOne"
      @changeStatus="changeEMStatus"
    />
    <TaskProjectListDialog 
      :pVisibled="pVisibled"
      :pTitle="pTitle"
      @changeDialog="changeTPLDialog"
    />
  </div>
</template>

<script>

import employeeTree from '@/components/same/employeeTree'
import TaskProjectListDialog from '@/components/dialog/task/TaskProjectListDialog'
import moment from 'moment'
import { mapState } from 'vuex'
import gql from 'graphql-tag'

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
    }
  },
  inject: ['reload'], //刷新页面
  data() {
    return {
      form: this.$form.createForm(this),
      visibled: this.initvisibled,
      startDate: moment(), //开始日期
      endDate: moment(), //截止日期
      createdBy: {}, //发起人
      handler: {},//负责人
      type:1,
      emTitle:'添加人员',
      emVisibled:false,
      emType:1,
      isOne:true,
      pVisibled:false,
      pTitle:'选择项目',
      project:{}, //关联项目,
      remark:'' //备注
    }
  },
  components:{
    employeeTree,
    TaskProjectListDialog
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    this.initInfo()
  },
  methods: {
    moment,
    initInfo() {
      this.startDate = moment()
      // this.endDate = moment()
      this.form.setFieldsValue({endDate: moment()})
      this.createdBy = {
        name: this.userInfo.name,
        id: this.userInfo.id
      }
      this.handler = Object.assign({}, this.createdBy)
    },
    disabledDate(current) {
      if (this.startDate) {
        console.log((current || moment()).format())
        return current && current <= this.startDate.endOf('day')
      } else {
        return false
      }
    },
    handleOk() {
      // this.toggle()
      this.reload()
    },
    toggle() {
      this.$emit('toggle', false)
    },
    cancel(){
      this.$emit('toggle',false)
    },
    handleSubmit(e) {
      console.log(e,'sumbit')
     
      e.preventDefault()
      var errorObj = {}
      var _this = this
      var _values = {}
      
      this.form.validateFields((err, values) => {
        // console.log(err)
        if (!err) {
          _values = values
          console.log('Received values of form: ', values);
        }else {
          // return
          errorObj = err
        }
      });
      // console.log(errorObj)
      if(Object.keys(errorObj).length){
        if(Object.keys(errorObj)[0] == 'name'){
          this.$message.error('请输入任务名称')
        }else if(Object.keys(errorObj)[0] == 'endDate'){
          this.$message.error('请选择截止日期')
        }
        return false
      }
      if(!Object.keys(this.handler).length){
        this.$message.error('请选择负责人')
         return false
      }
      if(!Object.keys(this.handler).length){
        this.$message.error('请选择负责人')
        return false
      }

      if(!Object.keys(this.project).length){
        this.$message.error('请选择关联项目')
        return false
      }
      var mutationString = `
      insert_Task(objects:[{
        endDate:"${_values['endDate'].format()}"
        remark:"${_this.remark}"
        ${_this.project.id ? `project_id:"${_this.project.id}"`:''}
        createdBy_id:"${_this.createdBy.id}"
        handler_id:"${_this.handler.id}"
        type:0,
        status: 1
        name:"${_values['name']}"
      }]){
        returning{id}
      }
      `
      console.log(mutationString)
      this.mutateApollo(mutationString)
      .then(res => {
        console.log(res,'create task success')
        this.reload()
      }).catch(err => {
        console.log(err,'create task fail')
      })
      // this.$emit('toggle', false)
      // this.reload()
     
    },
    //显示人员弹框
    showEmModal(type){
      this.emVisibled = true
      this.type = type
    },
    //人员弹框隐藏
    changeEMStatus(obj){
      this.emVisibled = obj.visibled
      if(obj.data.length){
        if(this.type == 2){
          this.createdBy = {
            name: obj.data[0].title,
            id:obj.data[0].key
          }
        }else {
          this.handler = {
            name:obj.data[0].title,
            id:obj.data[0].key
          }
        }
      }
      console.log(obj)
    },
    //关联项目显示
    showTPLDialog(){
      this.pVisibled = true
    },
    //关联项目弹框隐藏
    changeTPLDialog(obj){
      console.log(obj,'get correlation project info')
      this.pVisibled = obj.visibled
      if(obj.data.length){
        this.project = obj.data[0]
      }else {
        this.project = {}
      }
    },

    mutateApollo(mutation){
      return this.$apollo.mutate({
        mutation:gql`mutation{
          ${mutation}
        }`
      })
    }
  },
  watch: {
    initvisibled(newT, oldT) {
      console.log(newT, oldT, '-------')
      this.visibled = newT
      if (newT) {
        this.initInfo()
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
.ant-form-item {
  margin-bottom:0
}
</style>

