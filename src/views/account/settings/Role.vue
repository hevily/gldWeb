<template>
  <div class="roleManage">
    <a-row>
    </a-row>
    <a-row>
      <a-col :span="6" style="border-right: solid 1px #e8e8e8; padding-right: 20px">
        <div style="height:40px">
          <a-input-search type="text" placeholder="角色名称" style="width: 140px;" @search="onSearch"/>
          <a-button type="primary" style="width: 60px;float: right;" @click="createRole">新建</a-button>
        </div>
        <div class="treeDiv">
          <a-tree
            :treeData="roles"
            @select="onSelect"
            @expand="onExpand"
            defaultExpandAll
            :defaultSelectedKeys="selectedRole"
            :selectedKeys="selectedRole"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
          />
        </div>
      </a-col>
      <a-col :span="18">
        <table class="form-table table-layout" width="620" cellspacing="0" border="0">
          <tr>
            <th width="120" class="th-right">
              <label title="角色名称" class="ant-form-item-required">角色名称：</label>
            </th>
            <td width="500" colspan="2">
                <a-input v-model="name" type="text" placeholder="角色名称为必填项目" maxlength="200" style="width:400px"/>
            </td>
          </tr>
          <tr>
            <th width="120" class="th-right">
              <label title="备注" class="ant-form-item">备注：</label>
            </th>
            <td width="500" colspan="2">
                <a-input v-model="remark" type="text" placeholder="输入备注" maxlength="200" style="width:400px"/>
            </td>
          </tr>
          <tr>
            <th width="120" class="th-top">成员：</th>
            <td width="400">
              <!--ms-if-->
              <a-textarea
                v-model="memberString"
                rows="5"
                placeholder="选择成员"
                style="height: 160px;"
                read-only
              ></a-textarea>
            </td>
            <td width="100" style="padding-left: 5px; vertical-align: top">
              <a-button type="primary" style="width: 100px;float: right;" @click="showEModal">维护成员</a-button>
            </td>
          </tr>
          <tr>
            <th width="120" class="th-top">权限：</th>
            <td width="500" colspan="2">
              <a-checkbox-group v-model="checkedList">
                <div class="auth-div" v-for="(item,i) in data" :key="i">
                  <div class="auth-title">
                    <a-checkbox @change="onChange(item, $event)" :value="item.id">{{ item.name }}</a-checkbox>
                  </div>
                  <div class="auth-item">
                    <span v-for="(child,j) in item.children" :key="j">
                      <a-checkbox
                        :value="child.id"
                        @change="onChange(child, $event)"
                        style="vertical-align: top"
                      >
                        <span class="auth-parent">{{child.name}}</span>
                      </a-checkbox>
                          <div class="fixWidth">
                            <a-checkbox class="auth-item" v-for="(subChild,k) in child.children" :key="k" :value="subChild.id">{{subChild.name}}</a-checkbox>
                          </div>
                      <!--<br v-if="child.children" />-->
                    </span>
                  </div>
                </div>
              </a-checkbox-group>
            </td>
          </tr>
        </table>
      </a-col>
    </a-row>
    <a-row style="padding-top: 10px; padding-bottom: 10px">
      <a-col :span="24">
        <div style="text-align:center">
          <a-button :disabled="id === ''" type="primary" style="margin-right:10px" @click="saveRole">保存</a-button>
          <a-button :disabled="id === ''" type="default" @click="deleteRole">删除</a-button>
        </div>
      </a-col>
    </a-row>

    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visible"
      :type="employeeType"
      :initSelected="members"
      :isOne="isOne"
      @changeStatus="changeEMStatus"
    />

    <!-- 新建角色弹框 -->
    <RoleCreate inititle="新建角色" :initvisibled="openRole" @addRole="addRole" @cancel="cancel"/>
  </div>
</template>

<script>
  // import { colorList } from '@/components/tools/setting'
  // import ASwitch from 'ant-design-vue/es/switch'
  // import AList from 'ant-design-vue/es/list'
  // import AListItem from 'ant-design-vue/es/list/Item'
  import RoleCreate from '@/components/dialog/account/setting/RoleCreateDialog'
  import employeeTree from '@/components/same/employeeTree'
  import { mixin } from '@/utils/mixin.js'
  // import moment from 'moment'
  import { db } from '@/utils/db.js'
  import { ArrayToString } from '@/utils/util.js'
  // import uuid from 'uuid'

  export default {
    components: {
      RoleCreate,
      employeeTree
    },
    mixins: [mixin],
    data () {
      return {
        selectedRole: [''],
        autoExpandParent: true,
        expandedKeys: [],
        openRole: false,
        visible: false,
        isOne: false,
        employeeType: 1, //1显示员工 2只显示部门
        emTitle: '选择角色成员',
        defaultChecked: false,
        id: '',
        name: '',
        remark: '',
        members: [],
        memberString: '',
        checkedList: [],
        dbConn: null,
        data: [],
        roles: [{
          title: '角色列表',
          key: '',
          children: [],
        }]
      }
    },
    created() {
      //初始化数据库连接
      this.dbConn = new db(this.$apollo)
      //加载角色列表
      this.loadAllRole()
      //加载权限列表
      this.loadAuthorization()
    },
    methods: {
      //显示人员或部门弹框
      showEModal() {
        this.visible = true
      },
      //人员/部门弹框状态改变
      changeEMStatus(obj) {
        console.log(obj)
        this.visible = obj.visibled
        this.members = obj.data
      },
      onChange (child, e) {
        console.log(child, e)
        if(child && child.children){
          const setCheck = (children, e) => {
            children.forEach(ele => {
              const p = this.checkedList.indexOf(ele.id)
              if(e.target.checked && p === -1){
                this.checkedList.push(ele.id)
              }else if(!e.target.checked && p > -1){
                this.checkedList.splice(p, 1)
              }
              if(ele.children && ele.children.length > 0){
                setCheck(ele.children, e)
              }
            })
          }
          setCheck(child.children, e)
        }
      },
      createRole(){
        this.openRole = true
      },
      async addRole(name){
        const res = await this.dbConn.mutation(`
          mutation {
            insert_Role(objects: {
                name: "${name}"
              }){
                returning {
                  id
                }
              }
            }
        `)

        if(res.data){
          this.loadAllRole()
          const id = res.data.insert_Role.returning[0].id
          this.selectedRole = [`${id}`]
          this.loadRole(id)
          this.openRole = false
        }else{
          this.$message.error('保存失败，请重试')
        }
      },
      cancel(){
        this.openRole = false
      },
      async saveRole(){
        console.log(this.checkedList)
        const members = []
        const authorizations = []
        this.members.forEach(ele => {
          members.push({
            role_id: this.id,
            member_id: ele.key
          })
        })
        this.checkedList.forEach(ele => {
          authorizations.push({
              role_id: this.id,
              authorization_id: ele
          })
        })
        const res = await this.dbConn.mutation(`
          mutation {
            update_Role (where: {id: {_eq: "${this.id}"}}, _set: {
              name: "${this.name}"
              remark: "${this.remark}"
            }){
              affected_rows
              returning {
                id
              }
            }

            delete_RoleMember(where: {role_id: {_eq: "${this.id}"}}){
              returning {
                id
              }
            }

            delete_RoleAuthorization(where: {role_id: {_eq: "${this.id}"}}){
              returning {
                id
              }
            }

            insert_RoleMember(objects: ${ArrayToString(members)}){
              returning {
                id
              }
            }

            insert_RoleAuthorization(objects: ${ArrayToString(authorizations)}){
              returning {
                id
              }
            }
          }
        `)

        if(res.data){
          this.$message.success('保存成功')
        }else{
          this.$message.error('保存失败，请重试')
        }
      },
      async deleteRole(){
        const _this = this
        this.$confirm({
          title: '完成任务',
          content: `你确定删除角色【${this.name}】吗？`,
          async onOk() {
            const res = await _this.dbConn.mutation(`
              mutation {
                delete_RoleMember(where: {role_id: {_eq: "${_this.id}"}}){
                  returning {
                    id
                  }
                }

                delete_RoleAuthorization(where: {role_id: {_eq: "${_this.id}"}}){
                  returning {
                    id
                  }
                }

                delete_Role(where: {id: {_eq: "${_this.id}"}}){
                  returning {
                    id
                  }
                }
              }
            `)

            if(res.data){
              _this.loadAllRole()
              _this.loadRole('')
            }else{
              _this.$message.error('删除失败，请重试')
            }
          },
          onCancel() {
          }
        })
      },
      // 加载角色列表
      async loadAllRole(){
        const res = await this.dbConn.query(`
          query{
            Role(where: {}, order_by: [{createdAt: asc}]){
              id
              name
            }
          }
        `)
        const children = []
        res.data.Role.forEach(ele => {
          children.push({
            title: ele.name,
            key: ele.id
          })
        })
        this.roles[0].children = children
      },
      async loadRole(id){
        if(id){
          const res = await this.dbConn.query(`
            query{
              Role(where: {id: {_eq: "${id}"}}){
                id
                name
                remark
                members {
                  employee {
                    id
                    name
                  }
                }
                authorizations {
                  authorization {
                    id
                  }
                }
              }
            }
          `)
          if(res.data.Role.length > 0){
            this.id = res.data.Role[0].id
            this.name = res.data.Role[0].name
            this.remark = res.data.Role[0].remark || ''
            // this.members = res.data.Role[0].members
            this.checkedList = []
            res.data.Role[0].authorizations.forEach(ele => {
              this.checkedList.push(ele.authorization.id)
            })
            // this.memberString = ''
            this.members = []
            res.data.Role[0].members.forEach(ele => {
              // this.memberString += ele.employee.name + ','
              this.members.push({
                key: ele.employee.id,
                title: ele.employee.name
              })
            })
          }
        }else{
          this.id = ''
          this.name = ''
          this.remark = ''
          this.checkedList = []
          this.members = []
        }
      },
      // 加载权限列表
      async loadAuthorization(){
        const res = await this.dbConn.query(`
          query {
            Authorization(where: {type: {_eq: 1}, parent_id: {_is_null: true}}){
              id
              type
              key
              name
              parent_id
              children {
                id
                type
                key
                name
                parent_id
                children(order_by: [{sortNo: asc}]) {
                  id
                  type
                  key
                  name
                  parent_id
                }
              }
            }
          }
        `)
        this.data = res.data.Authorization
      },
      onSelect(selectedKeys, info) {
        console.log(selectedKeys, info)
        if(selectedKeys.length > 0){
          this.loadRole(selectedKeys[0])
        }
        this.selectedRole = selectedKeys
      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onSearch (value) {
        console.log(value)
        // this.roles[0].children.forEach(ele => {
        //   if(ele.title.indexOf(value) > -1){
        //     this.selectedRole = [`${ele.key}`]
        //     this.loadRole(ele.key)
        //   }
        // })
        const val = (value || '').trim()
        for(let i= 0; i < this.roles[0].children.length; i++){
          const ele = this.roles[0].children[i]
          if(ele.title.indexOf(val) > -1){
            this.selectedRole = [ele.key]
            this.expandedKeys = [ele.key]
            this.autoExpandParent = true
            this.loadRole(ele.key)
            break
          }
        }
      }
    },
    watch: {
      members(newT) {
        console.log(newT)
        this.memberString = ''
        this.members.forEach(ele => {
          this.memberString += ele.title + ','
        })
        if(this.memberString !== ''){
          this.memberString = this.memberString.substr(0, this.memberString.length - 1)
        }
      }
    }
  }
</script>

<style scoped>
  .treeDiv {
    height: 1320px;
    border: 1px solid #e8e8e8;
    overflow: auto;
    padding: 5px;
    border-radius: 4px;
  }
  table td {
    padding: 4px 0px;
  }
  table th {
    padding: 4px 0px;
    text-align: right;
  }
  .borderBottom {
    border-bottom: 1px solid #e8e8e8;
    margin-right: 20px;
  }
  .sameWidth {
    width: 260px;
  }
  .th-right {
    text-align: right;
  }
  .th-top {
    /* text-align: top !important; */
    padding-top: 9px !important;
    vertical-align: top;
  }
  .auth-div {
    margin-bottom: 10px;
  }
  .auth-title {
    padding-top: 5px;
    border-bottom: 1px solid rgb(233, 233, 233);
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .auth-parent {
    font-size: 13px;
    font-weight: bold;
  }
  .auth-item {
    font-size: 13px;
  }

  .ant-form-item {
    margin-bottom: 0px;
  }

  .fixWidth {
    width: 460px;
    font-size: 13px;
    /*padding-left: 10px;*/
    margin-top: 2px;
    margin-bottom: 5px;
  }

  .auth-item .ant-checkbox-wrapper  {
    margin-left: 0px;
  }
</style>