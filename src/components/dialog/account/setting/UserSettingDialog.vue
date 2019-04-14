<template>
  <a-modal :visible="visible" class="user-setting" :footer="null" @cancel="cancel">
    <a-card :bodyStyle="{padding: '0'}" :bordered="false">
      <a-row slot="title">
        <a-col :span="24" style="text-align:center">
          <!-- <a-avatar :size="84" icon="user"/> -->
          <a-avatar :size="84" :src="headPortrail"/>
        </a-col>
      </a-row>
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="姓名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入标题' }]}
          ]"
            name="name"
            placeholder="姓名"
          />
        </a-form-item>

        <a-form-item
          label="性别"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-select v-decorator="['sex',{rules: [{ required: true, message: '请选择性别' }]}]">
            <a-select-option v-for="(item,index) in sexType" :key="index" :value="index">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="手机"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
            v-decorator="['mobile', {rules: [{required: true, validator: checkMobile }]}]"
            type="text"
            placeholder="手机"
          />
        </a-form-item>
        <a-form-item
          label="部门"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-tree-select
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="treeData"
            :value="departmentId"
            placeholder="选择部门"
            treeDefaultExpandAll
            @change="onChange"
          />
        </a-form-item>
        <a-form-item
          label="职务"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input v-decorator="['job', {rules: []}]" type="text" placeholder="职务"/>
        </a-form-item>
        <a-form-item
          label="专业"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 17} }"
          :required="false"
        >
          <a-checkbox-group v-decorator="['major']">
            <a-row>
              <a-col :span="5">
                <a-checkbox value="土建">土建</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="安装">安装</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="市政">市政</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="精装">精装</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="园林">园林</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="行业">行业</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="其他">其他</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item
          label="权限"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 17} }"
        >{{roleName}}</a-form-item>
        <a-form-item
          label="绑定微信"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <span v-if="isBind">{{weixinName}}</span>
          <img
            src="https://zma.net.cn/scanreq?id=0f17b2dc-8e73-4a74-b9a9-4828995acd40"
            width="120px"
            height="120px"
            v-else
          >
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">确定</a-button>
          <a-button style="margin-left: 8px" @click="cancel">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script>
import { db } from '@/utils/db'
export default {
  name: 'UserSettingDialog',
  props: {
    uVisible: {
      type: Boolean,
      default: false
    },
    uTitle: {
      type: String,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dbConn: new db(this.$apollo),
      visible: this.uVisible,
      title: this.uTitle,
      form: this.$form.createForm(this),
      sexType: ['男', '女'],
      treeData: [],
      departmentId: '',
      roleName: '',
      headPortrail: '',
      isBind: false,
      weixinName: '',
      mobile: { value: '' }
    }
  },
  methods: {
    async userInfo() {
      let queryString = `query {
          Employee(where:{id:{_eq:"${this.userId}"}}){
            id
            name
            sex
            department_id
            weixin
            major
            job
            username
            mobile
            openid
            headPortrail
            roles {
                id
                role {
                    id
                    name
                }
            }
        }
      }`
      console.log(queryString)
      const res = await this.dbConn.query(queryString)
      console.log(res)
      let data = res.data.Employee[0]
      if (data) {
        this.form.setFieldsValue({ name: data.name })
        this.form.setFieldsValue({ mobile: data.mobile })
        this.form.setFieldsValue({ sex: data.sex })
        this.form.setFieldsValue({ job: data.job })
        if (data.major) {
          let major = data.major.split(',')
          this.form.setFieldsValue({ major: major })
        }else {
            this.form.setFieldsValue({ major: [] })
        }

        this.mobile = { value: data.mobile }
        var roleName = ''
        data.roles.forEach((ele, index) => {
          if (data.roles.length - 1 == index) {
            roleName += ele.role.name
          } else {
            roleName += ele.role.name + ','
          }
        })
        this.roleName = roleName
        this.departmentId = data.department_id
        this.weixinName = ''
        if (data.weixin) {
          this.weixinName = data.weixin.nickname
          this.headPortrail = data.weixin.headimgurl || data.headPortrail
          this.isBind = true
        } else {
          this.headPortrail = data.headPortrail || '../../avatar.png'
          this.isBind = false
        }
      }
      this.loadAllDepart()
    },
    // 加载角色列表
    async loadAllDepart() {
      const res = await this.dbConn.query(`
          query{
              Department(where: {}, order_by: [{name: asc}]) {
                id
                name
                company {
                  id
                  name
                }
                employees {
                  id
                  name
                }
                parent {
                  id
                  name
                }
              }
          }
        `)
      var _data = res.data.Department
      this.company = _data[0].company
      this.departs = [
        {
          title: _data[0].company.name,
          key: _data[0].company.id,
          value: _data[0].company.id,
          type: 1,
          slots: { icon: 'home' },
          children: this.toTree(res.data.Department)
        }
      ]
      this.treeData = this.departs
      // this.departMap[_data[0].company.id] = this.departs[0]
    },
    //节点数据处理
    toTree(data) {
      // 删除 所有 children,以防止多次调用
      // var that = this
      // var _data = []
      data.forEach(function(item) {
        // var iobj = {};
        item.title = item.name
        item.key = item.id
        item.value = item.id
        item.slots = { icon: 'team' }
        item.scopedSlots = { title: 'title' }
        item.type = 2
        delete item.children
      })

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      const map = {}
      data.forEach(function(item) {
        // item.children = item.employees
        map[item.id] = item
      })
      this.departMap = map
      //        console.log(map);
      const val = []
      data.forEach(function(item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        item.parent = item.parent || {}
        const parent = map[item.parent.id]
        if (parent) {
          ;(parent.children || (parent.children = [])).push(item)
        } else {
          val.push(item)
        }
      })
      return val
    },

    cancel() {
      this.$emit('userCancel', false)
    },
    async handlerOk(value) {
      var mutationString = `mutation {
            update_Employee(where:{id:{_eq:"${this.userId}"}},_set:{
                name:"${value.name}"
                sex:${value.sex}
                mobile:"${value.mobile}"
                department_id:"${this.departmentId}",
                job:"${value.job}",
                major:"${(value.major || []).join(',')}"
            }){returning{id}}
        }`
        let res = await this.dbConn.mutation(mutationString)
      console.log(mutationString,res)
        this.$emit('userSave', false)
    },
    handleSubmit(e) {
      e.preventDefault()
      //   let valuess= {}
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
          //   valuess = values
          this.handlerOk(values)
        }
      })
      //   console.log(valuess)
    },
    async checkMobile(rule, value, callback) {
      if (!value || value === '') {
        callback('请输入手机')
      } else {
        if (value !== this.mobile.value) {
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
        } else {
          callback()
        }
      }
    },
    onChange(value) {
      this.departmentId = value
    },
    onCChange(e) {}
  },
  watch: {
    uVisible(newT) {
      this.visible = newT
      if (newT) {
        this.userInfo()
      }

      console.log(newT, 'showuser--------')
    }
  }
}
</script>

<style>
.user-setting .ant-modal-body {
  padding: 0px;
}
.user-setting .ant-card .ant-card-head {
  background: #5873c9;
}
</style>
