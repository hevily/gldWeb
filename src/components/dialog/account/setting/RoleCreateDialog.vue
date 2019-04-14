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
        <a-row class="add-role_dialog">
          <a-col :span="24">
            <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <th width="90">
                    <label class="ant-form-item-required">角色名称：</label>
                  </th>
                  <td>
                    <a-form-item hasFeedback>
                      <a-input
                        v-decorator="['name', {rules: [{ validator: checkName }]}]"
                        type="text"
                        style="width:210px"
                        placeholder="角色名称"
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
    }
    
  },
  created(){
    //初始化数据库连接
    this.dbConn = new db(this.$apollo)
  },
  data() {
    return {
      form: this.$form.createForm(this),
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
          _this.$emit('addRole', values.name)
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
        callback('请输入角色名称')
      }else{
        const res = await this.dbConn.query(`
          query{
            Role(where: {name: {_eq: "${value}"}}){
              id
            }
          }
        `)
        if(res.data.Role.length > 0){
          callback('角色名称已存在')
        }else{
          callback()
        }
      }
    }
  },
  watch: {
    initvisibled(newT, oldT) {
      console.log(newT, oldT, '-------')
      this.visibled = newT
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

