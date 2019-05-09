<template>
  <div class="projectMember">
    <div>
      <a-row>
        <a-col :span="12">
          <h3>项目成员</h3>
        </a-col>
        <a-col :span="12" style="text-align:right">
          <a-button
            type="default"
            icon="plus"
            @click="showEmployee(1)"
            :style="{marginRight:'10px'}"
            v-if="$auth('edit-project-member') && principal_id == userInfo.id"
          >添加专业负责人</a-button>
          <a-button
            type="default"
            icon="plus"
            @click="showEmployee(2)"
            v-if="$auth('edit-project-member')"
          >添加项目成员</a-button>
        </a-col>
      </a-row>
      <div :style="{marginTop:'10px'}" class="projectMemberTable">
        <a-table
          :columns="columns"
          :dataSource="allMember"
          :pagination="false"
          :defaultExpandedRowKeys="defaultExpandedRowKeys"
         
        >
          <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
          <a-avatar
            slot="img"
            slot-scope="text, record"
            src="http://tvips.glodon.com/api/img/file/images/download?fileId="
          />

          <div slot="remark" slot-scope="text, record" class="remark">
            <a-input
              v-model="record._remark"
              type="text"
              placeholder="备注"
              @pressEnter="changeRemark(record)"
              @blur="changeRemark(record)"
              @focus="recordFocus(record)"
              :style="{paddingLeft:'0px'}"
            />
          </div>
          <div slot="icon" slot-scope="text, record" :style="{textAlign:'right'}">
            <span
              :style="{padding:'2px',cursor:'pointer'}"
              @click="deleteMember(record)"
              v-if="$auth('edit-project-member')"
            >
              <a-icon type="delete"/>
            </span>
          </div>
        </a-table>
      </div>
    </div>
    <div :style="{marginTop:'20px'}">
      <a-row>
        <a-col :span="12">
          <h3>外部联系人</h3>
        </a-col>
        <a-col :span="12" style="text-align:right">
          <a-button type="default" icon="plus" @click="showEmployee(2,true)">添加外部联系人</a-button>
        </a-col>
      </a-row>
      <div :style="{marginTop:'10px'}" class="projectMemberTable">
        <a-table
          :columns="columns2"
          :dataSource="external"
          :pagination="false"
          v-if="external.length"
        >
          <a slot="name" slot-scope="text,record" href="javascript:;">{{ text }}</a>
          <a-avatar
            slot="img"
            slot-scope="text, record"
            src="http://tvips.glodon.com/api/img/file/images/download?fileId="
          />

          <div slot="remark" slot-scope="text, record" class="remark">
            <a-input
              v-model="record._remark"
              type="text"
              placeholder="备注"
              @pressEnter="changeRemark(record)"
              @blur="changeRemark(record)"
            />
          </div>
          <div slot="icon" slot-scope="text, record" :style="{textAlign:'right'}">
            <span :style="{padding:'2px',cursor:'pointer'}" @click="deleteMember(record)">
              <a-icon type="delete"/>
            </span>
          </div>
        </a-table>
        <div v-else class="empty-tip">
          <div :style="{fontSize:'50px'}" >
            <a-icon type="project"/>
          </div>
          <div>暂无数据</div>
        </div>
      </div>
    </div>

    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visibled"
      :type="type"
      :isOne="isOne"
      :type2="employeeType"
      :filterData="employeeFilter"
      @changeStatus="changeEMStatus"
    />
  </div>
</template>
<script>
import employeeTree from '@/components/same/employeeTree'
import gql from 'graphql-tag'
import { mapState } from 'vuex'

const columns = [
  {
    dataIndex: 'img',
    key: 'id',
    width: 120,
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '姓名',
    width: 120,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '职务',
    width: 120,
    dataIndex: 'job',
    key: 'job'
  },
  {
    title: '电话',
    width: 160,
    key: 'mobile',
    dataIndex: 'mobile'
  },
  {
    title: '备注',
    width: 420,
    key: '_remark',
    dataIndex: '_remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    key: 'icon',
    scopedSlots: { customRender: 'icon' }
  }
]
const columns2 = [
  {
    dataIndex: 'img',
    key: 'id',
    width: 120,
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '姓名',
    width: 120,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '职务',
    width: 120,
    dataIndex: 'job',
    key: 'job'
  },
  // {
  //   title: '电话',
  //   width: 160,
  //   key: 'mobile',
  //   dataIndex: 'mobile'
  // },
  {
    title: '备注',
    width: 420,
    key: '_remark',
    dataIndex: '_remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    key: 'icon',
    scopedSlots: { customRender: 'icon' }
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
  name: 'ProjectMember',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns,
      columns2,
      principal_id: '', //项目负责人id
      members: [], //项目成员
      allMembers:[],
      chargers: [], //项目专业负责人
      allMember: [],
      external: [], //外部人员
      emTitle: '添加人员',
      isOne: false,
      visibled: false,
      type: 1,
      employeeType: 0,
      isExternal:false,
      projectName: '', //项目名称
      employeeFilter: [], //人员筛选
      sRecord: {}, //当前选中行,
      defaultExpandedRowKeys:[], //默认展开行
    }
  },
  components: {
    employeeTree
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      var _this = this
      this.$apollo
        .query({
          query: gql`
            query {
              Project(where: {id:{_eq:"${this.projectId}"}}) {
                id
                name
                principal_id
                members {
                  id
                  member_id
                  charger_id
                  project_id
                  remark
                  type
                  employee {
                    id
                    sex
                    name
                    mobile
                    job
                  }
                }
                chargers {
                  id
                  charger_id
                  project_id
                  remark
                  employee {
                    id
                    sex
                    name
                    mobile
                    job
                  }
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res, 'res')
          _this.initInfo(res.data.Project)
        })
        .catch(err => {
          console.log(err)
        })
    },

    //初始化数据
    initInfo(data) {
      this.members = []
      this.chargers = []
      this.external = []
      this.principal_id = data[0].principal_id
      let members = data[0].members
      this.allMembers = members
      this.members = members.filter(ele => ele.type == 0)
      // this.external = members.filter(ele => ele.type == 1)
      members.forEach(ele => {
        if(ele.type == 1){
          ele.employee.member_id = ele.id
          ele.employee._remark = ele.remark
          var _employee = Object.assign({}, ele.employee)
          this.external.push(_employee)
        }
      })
      console.log(this.external)
      this.chargers = this.chargers.concat(data[0].chargers || [])
      this.projectName = data[0].name
      this.allMember = []

      if (!this.chargers.length) {
        this.members.forEach(mem => {
          mem.employee.member_id = mem.id
          mem.employee._remark = mem.remark
          var _employee = Object.assign({}, mem.employee)
          
          this.allMember.push(_employee)
          // this.defaultExpandedRowKeys.push(mem.id)
          // mem.employee.key = mem.employee.id
        })
        return
      }
      this.chargers.forEach(ele => {
        ele.employee.children = []
        ele.employee.key = ele.employee.id
        ele.employee.charger_id = ele.id
        ele.employee._remark = ele.remark || ''
        var _employee = Object.assign({}, ele.employee)
        this.allMember.push(_employee)
       
      })
      var filterMember = {}
      this.allMember.forEach(ele => {
        this.defaultExpandedRowKeys.push(ele.id)
        this.members.forEach(mem => {
          mem.employee.member_id = mem.id
          mem.employee._remark = mem.remark
          if (ele.id == mem.charger_id) {
            mem.employee.key = mem.employee.id
            this.defaultExpandedRowKeys.push(mem.employee.id)
            var _employee = Object.assign({}, mem.employee)
            ele.children.push(_employee)
            filterMember[mem.id] = 1
          } else {
            if (filterMember[mem.id] !== 1) {
              filterMember[mem.id] = Object.assign({}, mem.employee)
            }
          }
        })
      })
      console.log(filterMember, 'no in chargers')
      for (var key in filterMember) {
        if (filterMember[key] !== 1) {
          this.allMember.push(filterMember[key])
        }
      }

      console.log(this.allMember, this.defaultExpandedRowKeys,'this.defaultExpandedRowKeys','all project member')
    },
    //添加人员弹框
    showEmployee(type,isExternal) {
      console.log(type,isExternal)
      this.visibled = true
      this.isExternal = isExternal
      this.employeeType = type
      if(isExternal){
        this.employeeType = 4
      }
      this.employeeFilter = []
      if (type == 1) {
        this.chargers.forEach(ele => {
          this.employeeFilter.push(ele.charger_id)
        })
      } else if (type == 2) {
        this.allMembers.forEach(ele => {
          this.employeeFilter.push(ele.member_id)
        })
      }
    },
    //添加项目成员
    changeEMStatus(obj) {
      console.log(obj)

      this.visibled = obj.visibled
      if(obj.isCancel){
        return
      }
      var data = []
      if (!obj.data.length) {
        return
      }
      obj.data.forEach(ele => {
        var obj = { id: ele.key, name: ele.title }
        data.push(obj)
      })
      if (this.employeeType == 1) {
        this.addChargers(data)
      } else if (this.employeeType == 2 || this.employeeType == 4 ) {
        this.addMembers(data)
      }
    },

    mutateApollo(string) {
      return this.$apollo.mutate({
        mutation: gql`mutation {
          ${string}
        }`
      })
    },
    //添加项目成员
    addMembers(data) {
      console.log(data, 'addMember')
      var memberString = ``
      var notiString = ``
      var performString = ``
      data.forEach(ele => {
        memberString += `{
          charger_id:"${this.userInfo.id}",
          project_id:"${this.projectId}",
          member_id:"${ele.id}",
          type: ${this.isExternal ? 1 : 0}
        },`
        // performString += `{
        //   employee_id:"${ele.id}"
        //   project_id:"${this.projectId}",
        //   ratios:[{name:"专业系数",value: ""},{name:"难度系数",value: ""},{name:"规模系数",value: ""},{name:"调整系数",value: ""},{name:"工期系数",value: ""}],
        // }`
        notiString += `{
          type:3,
          name: "【${this.userInfo.name}】将您添加为【${this.projectName}】的项目组成员",
          status: 0,
          project_id:"${this.projectId}",
          recipients:{
            data:{
              recipient_id:"${ele.id}"
            }
          },
          createdBy_id:"${this.userInfo.id}"
        },`
      })
      var mutationString = `insert_ProjectMember(objects:[${memberString}]){returning{id}}`
      var notificationString = `insert_Notification(objects:[${notiString}]){returning{id}}`

      // var performanceString = `insert_Performance(objects:[${performString}]){returning {id}}`
      // console.log(mutationString,notificationString,'insert notification and projectMember string')
      var total = mutationString + '\n' + notificationString
      // console.log(total,performanceString)
      // return
      var _this = this
      this.mutateApollo(total)
        .then(res => {
          console.log(res, 'insert projectMember and notification success')
          _this.loadData()
          this.$message.success('添加项目成员成功')
        })
        .catch(err => {
          console.log(err, 'insert projectMember and notification fail')
          this.$message.error('添加项目成员失败')
        })
    },
    //添加专业负责人
    addChargers(data) {
      console.log(data, 'addMember')
      var chargerString = ``
      var notiString = ``
      var performString = ``
      data.forEach(ele => {
        chargerString += `{
          charger_id:"${ele.id}",
          project_id:"${this.projectId}",

        },`

        performString += `{
          employee_id:"${ele.id}"
          project_id:"${this.projectId}",
          ratios:[{name:"专业系数",value: ""},{name:"难度系数",value: ""},{name:"规模系数",value: ""},{name:"调整系数",value: ""},{name:"工期系数",value: ""}],
        }`
        notiString += `{
          type:3,
          name: "【${this.userInfo.name}】将您添加为【${this.projectName}】的项目组专业负责人",
          status: 0,
          project_id:"${this.projectId}",
          recipients:{
            data:{
              recipient_id:"${ele.id}"
            }
          },
          createdBy_id:"${this.userInfo.id}"
        },`
      })
      var mutationString = `insert_ProjectCharger(objects:[${chargerString}]){returning{id}}`
      var notificationString = `insert_Notification(objects:[${notiString}]){returning{id}}`
      var performanceString = `insert_Performance(objects:[${performString}]){returning {id}}`
      var total = mutationString + '\n' + notificationString + '\n' + performanceString
      console.log(total)
      // return
      var _this = this
      this.mutateApollo(total)
        .then(res => {
          console.log(res, 'insert ProjectCharger and notification success')
          _this.loadData()
          this.$message.success('添加专业负责人成功')
        })
        .catch(err => {
          console.log(err, 'insert ProjectCharger and notification fail')
          this.$message.error('添加专业负责人失败')
        })
      // console.log(mutationString,notificationString,'insert notification and projectMember string')
    },
    //删除
    deleteMember(record) {
      console.log(record)
      debugger
      var mutationString = ``
      var notificationString = ``
      var content = ''
      var _this = this
      if (record.charger_id) {
        //专业负责人
        if (record.children.length) {
          _this.$message.warning('下级还有项目成员，无法删除！')
          return
        }
        mutationString = `
        delete_ProjectCharger(where:{id:{_eq:"${record.charger_id}"}}){returning{id}}
        delete_Performance(where:{project_id:{_eq:"${_this.projectId}"},employee_id:{_eq:"${
          record.charger_id
        }"}}){returning{id}}
        `
        content = '专业负责人'
      } else if (record.member_id) {
        //项目成员
        mutationString = `
        delete_ProjectMember(where:{id:{_eq:"${record.member_id}"}}){returning{id}}
        #delete_Performance(where:{project_id:{_eq:"${_this.projectId}"},employee_id:{_eq:"${
          record.member_id
        }"}}){returning{id}}
        `
        content = '项目成员'
      }

      notificationString = `
        insert_Notification(objects:[{
          type:3,
          name: "【${_this.userInfo.name}】将您从【${_this.projectName}】的项目组${content}中移除",
          status: 0,
          project_id:"${_this.projectId}",
          recipients:{
            data:{
              recipient_id:"${record.id}"
            }
          },
          createdBy_id:"${_this.userInfo.id}"
        },]){returning{id}}`
      var total = mutationString + '\n' + notificationString
      this.$confirm({
        title: '删除成员',
        content: `你确定删除项目${content}吗？`,
        onOk() {
          _this
            .mutateApollo(total)
            .then(res => {
              console.log(res, 'delete project member or charger success')
              _this.$message.success('删除成功')
              _this.loadData()
            })
            .catch(err => {
              _this.$message.error('删除失败')
              console.log(res, 'delete project member or charger error')
            })
        },
        onCancel() {}
      })
    },
    //获取当前行记录
    recordFocus(record) {
      this.sRecord = Object.assign({}, record)
    },
    //修改备注
    changeRemark(record) {
      console.log(record)
      if (record._remark == this.sRecord._remark) {
        return
      }
      this.sRecord._remark = record._remark
      var mutationString = ``
      var _this = this
      if (record.charger_id) {
        //专业负责人
        mutationString = `
          update_ProjectCharger(where:{id:{_eq:"${record.charger_id}"}},_set:{
            remark:"${record._remark}"
          }){returning{id}}`
      } else if (record.member_id) {
        //项目成员
        mutationString = `
          update_ProjectMember(where:{id:{_eq:"${record.member_id}"}},_set:{
            remark:"${record._remark}"
          }){returning{id}}`
      }

      this.mutateApollo(mutationString)
        .then(res => {
          console.log(res, 'delete project member or charger success')
          _this.$message.success('修改备注成功')
          _this.loadData()
        })
        .catch(err => {
          _this.$message.error('修改备注失败')
          console.log(res, 'delete project member or charger error')
        })
    }
  }
}
</script>
<style>
.projectMemberTable .ant-table-tbody > tr > td {
  padding: 4px 16px;
}
.projectMemberTable .ant-table-tbody > tr > td .remark input {
  border: 0px;
}
.projectMemberTable .ant-table-tbody > tr > td .remark input:focus {
  box-shadow: unset;
}
.projectMember .empty-tip {
  text-align: center;
  padding: 50px 0;
  color: #cbcbcb;
}
/* .projectMember .ant-table-row {
  display: block;
} */
</style>


