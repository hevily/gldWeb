<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="inititle"
      :treeData="treeData"
      :departmentId="departmentId"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="maskClosable"
      :width="450"
    >
      <a-form
        :form="form"
      >
        <a-row class="add-depart_dialog">
          <a-col :span="24">
            <table class="form-table float-right" width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <th width="90">
                    <label class="ant-form-item-required">姓名：</label>
                  </th>
                  <td>
                    <a-form-item hasFeedback>
                      <a-input
                        v-decorator="['name', {rules: [{ validator: checkName }]}]"
                        type="text"
                        style="width:260px"
                        placeholder="姓名"
                      />
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <th width="90">
                    <label class="ant-form-item-required">手机：</label>
                  </th>
                  <td>
                    <a-form-item hasFeedback>
                      <a-input
                        v-decorator="['mobile', {rules: [{ validator: checkMobile }]}]"
                        type="text"
                        style="width:260px"
                        placeholder="手机"
                      />
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <th width="90">
                    <label>性别：</label>
                  </th>
                  <td>
                    <a-form-item>
                      <a-select v-decorator="['sex']" style="width: 260px">
                        <a-select-option
                          v-for="(item,index) in sexType"
                          :key="index"
                          :value="index"
                        >{{ item }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <th width="90">
                    <label>部门：</label>
                  </th>
                  <td>
                      <a-tree-select
                        style="width: 260px"
                        :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                        :treeData="treeData"
                        :value="departmentId"
                        placeholder='选择部门'
                        treeDefaultExpandAll
                        @change="onChange"
                      />
                  </td>
                </tr>
                <tr>
                  <th width="90">
                    <label>职务：</label>
                  </th>
                  <td>
                    <a-form-item>
                      <a-input
                        v-decorator="['job', {rules: []}]"
                        type="text"
                        style="width:260px"
                        placeholder="职务"
                      />
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <th width="90">
                    <label>职称：</label>
                  </th>
                  <td>
                    <a-form-item>
                      <a-select mode="multiple" v-decorator="['title']" style="width: 260px">
                        <a-select-option
                          v-for="(item) in titleType"
                          :key="item"
                          :value="item"
                        >{{ item }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import { db } from '@/utils/db.js'

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
    treeData: {
      type: Array,
      default() {
        return {}
      }
    },
    pdepartmentId: {
      type: String,
      default: ''
    },
    mode: {
      type: Number,
      default: 1
    },
    name: {
      type: Object,
      default: function (value) {
        return { value }
      }
    },
    mobile: {
      type: Object,
      default: function (value) {
        return { value }
      }
    },
    sex: {
      type: Object,
      default: function (value) {
        return { value }
      }
    },
    job: {
      type: Object,
      default: function (value) {
        return { value }
      }
    },
    title: {
      type: Object,
      default: function (value) {
        return { value }
      }
    }
  },
  created(){
    //初始化数据库连接
    this.dbConn = new db(this.$apollo)
  },
  data() {
    return {
      form: this.$form.createForm(this, {
        onFieldsChange: (_, changedFields) => {
          console.log(changedFields)
        },
        mapPropsToFields: () => {
          return {
            name: this.$form.createFormField({
              ...this.name,
              value: this.name.value
            }),
            mobile: this.$form.createFormField({
              ...this.mobile,
              value: this.mobile.value
            }),
            sex: this.$form.createFormField({
              ...this.sex,
              value: this.sex.value
            }),
            job: this.$form.createFormField({
              ...this.job,
              value: this.job.value
            }),
            title: this.$form.createFormField({
              ...this.title,
              value: this.title.value
            })
          }
        },
        onValuesChange(_, values) {
          console.log(values)
        }
      }),
      visibled: this.initvisibled,
      departmentId:this.pdepartmentId,
      dbConn: null,
      sexType: [
        '男',
        '女'
      ],
      titleType: [
        '高级工程师（教授级）',
        '助理审计师',
        '助理统计师',
        '高级会计师',
        '高级审计师',
        '高级统计师',
        '高级经济师',
        '高级工程师',
        '助理会计师',
        '助理经济师',
        '助理讲师',
        '助理造价工程师',
        '注册造价工程师',
        '助理工程师',
        '工程师',
        '会计师',
        '审计师',
        '经济师',
        '统计师'
      ]
    }
  },
  methods: {
    validateFunction () {
      const _this = this
      return (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values, _this)
          values.departmentId = _this.departmentId
          _this.$emit('addEmployee', values)
        }else{
          for(const key in err){
            document.getElementById(key).focus()
            break
          }
        }
      }
    },
    handleOk() {
      // this.$emit('addRole', this.name)
      this.form.validateFields(this.validateFunction())
    },
    handleCancel() {
      this.form.resetFields()
      this.$emit('cancel')
    },
    async checkName(rule, value, callback) {
      if (!value || value === '') {
        callback('请输入姓名')
      }else{
        if(value !== this.name.value) {
          const res = await this.dbConn.query(`
            query{
              Employee(where: {name: {_eq: "${value}"}}){
                id
              }
            }
          `)
          if (res.data.Employee.length > 0) {
            callback('姓名已存在')
          } else {
            callback()
          }
        }else{
          callback()
        }
      }
    },
    async checkMobile(rule, value, callback) {
      if (!value || value === '') {
        callback('请输入手机')
      }else{
        if(value !== this.mobile.value) {
          const res = await this.dbConn.query(`
            query{
              Employee(where: {mobile: {_eq: "${value}"}}){
                id
              }
            }
          `)
          if (res.data.Employee.length > 0) {
            callback('手机已存在')
          } else {
            callback()
          }
        }else{
          callback()
        }
      }
    },
    onChange (value) {
      this.departmentId = value
    }
  },
  watch: {
    initvisibled(newT, oldT) {
      console.log(newT, oldT, this.pdepartmentId,'-------')
      this.departmentId = this.pdepartmentId
      this.visibled = newT
      if(this.mode === 1){
        this.form.resetFields()
      }
    },
    name () {
      this.form.updateFields({
        name: this.$form.createFormField({
          ...this.name,
          value: this.name.value
        }),
      })
    },
    mobile () {
      this.form.updateFields({
        mobile: this.$form.createFormField({
          ...this.mobile,
          value: this.mobile.value
        }),
      })
    },
    sex () {
      this.form.updateFields({
        sex: this.$form.createFormField({
          ...this.sex,
          value: this.sex.value
        }),
      })
    },
    job () {
      this.form.updateFields({
        job: this.$form.createFormField({
          ...this.job,
          value: this.job.value
        }),
      })
    },
    title () {
      this.form.updateFields({
        title: this.$form.createFormField({
          ...this.title,
          value: this.title.value
        }),
      })
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
  margin-bottom: 0px;
}
.sameWidth {
  width: 260px;
}
.float-right th {
  text-align: right;
}
</style>

