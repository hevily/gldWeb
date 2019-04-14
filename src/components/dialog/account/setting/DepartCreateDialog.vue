<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="inititle"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="maskClosable"
      :width="350"
    >
      <a-form
        :form="form"
      >
        <a-row class="add-depart_dialog">
          <a-col :span="24">
            <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <th width="90">
                    <label class="ant-form-item-required">部门名称：</label>
                  </th>
                  <td>
                    <a-form-item hasFeedback>
                      <a-input
                        v-decorator="['name', {rules: [{ validator: checkName }]}]"
                        type="text"
                        style="width:210px"
                        placeholder="部门名称"
                      />
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
    name: {
      type: Object,
      default: function (value) {
        return { value }
      }
    }
  },
  beforeUpdate(){
    // this.form.setFieldsValue({name: this.name})
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
            })
          }
        },
        onValuesChange(_, values) {
          console.log(values)
        }
      }),
      visibled: this.initvisibled,
      dbConn: null
    }
  },
  methods: {
    validateFunction () {
      const _this = this
      return (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values, _this)
          _this.$emit('addDepart', values.name)
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
        callback('请输入部门名称')
      }else{
        if(value !== this.name.value){
          const res = await this.dbConn.query(`
          query{
            Department(where: {name: {_eq: "${value}"}}){
              id
            }
          }
        `)
          if(res.data.Department.length > 0){
            callback('部门名称已存在')
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
    }
  },
  watch: {
    initvisibled(newT, oldT) {
      console.log(newT, oldT, '-------')
      // if(newT){
      //   this.form.setFieldsValue({name: this.name})
      // }
      this.visibled = newT
    },
    name () {
      this.form.updateFields({
        name: this.$form.createFormField({
          ...this.name,
          value: this.name.value
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
</style>

