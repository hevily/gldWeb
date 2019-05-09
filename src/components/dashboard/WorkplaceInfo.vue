<template>
  <div class="WorkplaceInfo">
    <a-layout style="height:100%">
      <a-layout style="overflow:auto;background:#fff">
        <a-layout-header style="border-bottom: 1px solid #eee;">
          <a-row class="f12">
            <a-col
              :span="24"
              style="line-height: 33px;font-size: 14px;font-weight: 600;max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
              :title="info.name"
            >{{info.name}}</a-col>
            <a-col :span="12" style="line-height: 28px;">
              负责人：
              <a-avatar class="avatar" size="small" :src="avatar()"/>
              {{(info.principal||{}).name}}
            </a-col>
            <a-col
              :span="12"
              style="line-height: 35px;"
            >截止日期：{{info.endDate ? moment(info.endDate).format('YYYY-MM-DD'):''}}</a-col>
            <a-col :span="12" style="line-height: 24px;">送审金额：{{info.submitAmount || 0}}</a-col>
            <a-col :span="12" style="line-height: 24px;">
              <a-icon
                type="profile"
                title="项目进展"
                style="font-size:18px;margin-right:5px;cursor:pointer"
                @click="goProjectDetail(1)"
              />
              <a-icon
                type="folder"
                title="项目资料"
                style="font-size:18px;cursor:pointer"
                @click="goProjectDetail(4)"
              />
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content style="margin-top: 5px;">
          <a-row :style="{ width: '100%', borderRadius: '4px',margin:'0 auto' }">
            <a-col :span="24">
              <a-calendar :fullscreen="false" @panelChange="onPanelChange" @select="dateSelect"/>
            </a-col>
          </a-row>
        </a-layout-content>
        <!-- <a-layout-footer>Footer</a-layout-footer> -->
      </a-layout>
      <!-- 项目成员 -->
      <a-layout-sider>
        <a-row>
          <a-col :span="24" style="line-height:30px;background:#eee;padding-left: 10px;">项目成员</a-col>
          <a-col :span="24">
            <a-tree
              :treeData="treeData"
              showIcon
              :expandedKeys="defaultExpandedKeys"
              :defaultExpandAll="true"
              @expand="changeExpand"
              @select="onSelect"
              style="margin-top: 5px;"
            >
              <span slot="title" slot-scope="record">{{record.name}}</span>
              <!-- <a-icon slot="home" type="home" style="color:#78bb60;font-weight: bolder;"/>
              <a-icon slot="team" type="team" style="color:#78bb60;font-weight: bolder;"/>-->
              <!-- <a-icon slot="male" type="user" style="color:#78bb60"/> -->
              <a-avatar
                class="avatar"
                slot="online"
                size="small"
                :src="avatar()"
                style="position: relative;top: -2px;"
              />
              <a-avatar
                class="avatar offline"
                slot="offline"
                size="small"
                :src="avatar()"
                style="position: relative;top: -2px;"
              />
              <!-- <a-icon slot="female" type="user" style="color:#fa8564"/> -->
            </a-tree>
          </a-col>
        </a-row>
      </a-layout-sider>
    </a-layout>
    <LogCommentDialog
      v-if="logVisible"
      :nowTime="nowTime"
      :projectId="projectId"
      inititle="日志"
      :inivisible="logVisible"
      @logCancel="logCancel"
    />
  </div>
</template>

<script>
import { db } from '@/utils/db.js'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import LogCommentDialog from '@/components/dialog/workplace/LogCommentDialog'

export default {
  name: 'WorkplaceInfo',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dbConn: new db(this.$apollo),
      info: {},
      defaultExpandedKeys: ['内部', '外部'],
      treeData: [],
      logVisible: false,
      nowTime: ''
    }
  },
  components: {
    LogCommentDialog
  },
  created() {
    this.projectInfo()
  },
  methods: {
    moment,
    ...mapGetters(['nickname', 'avatar']),
    async projectInfo() {
      let queryString = `query {
            Project(where:{id:{_eq:"${this.projectId}"}}){
                principal {
                    id
                    name
                }
                name
                id
                endDate
                submitAmount
                chargers {
                    id
                    charger_id
                    employee {
                        id
                        name
                        sex
                        onlineTime
                    }
                }
                members {
                    id
                    member_id
                    charger_id
                    type
                    employee {
                        id
                        name
                        sex
                        onlineTime
                    }
                }
            }
        }`
      let res = await this.dbConn.query(queryString)
      this.info = res.data.Project[0]
      this.getTreeData(this.info)
    },

    getTreeData(obj) {
      let members = obj.members
      let chargers = obj.chargers

      //      let members = this.members.concat(data[0].members || [])
      //   this.chargers = this.chargers.concat(data[0].chargers || [])
      //   this.projectName = data[0].name

      let allMember = []
      let External = []

      if (!chargers.length) {
        //没有专业负责人
        members.forEach((mem, index) => {
          mem.employee.member_id = mem.id
          mem.employee._remark = mem.remark
          mem.employee.key = index
          mem.employee.type = mem.type

          let onlineTime = mem.employee.onlineTime ? new Date(mem.employee.onlineTime).getTime() : 0
          let nowTime = new Date().getTime()

          //   mem.employee.title = mem.employee.name
          mem.employee.slots = {
            icon: nowTime - onlineTime > 60 * 1000 ? 'offline' : 'online'
          }
          mem.employee.scopedSlots = {
            title: 'title'
          }
          var _employee = Object.assign({}, mem.employee)

          allMember.push(_employee)

          this.defaultExpandedKeys.push(mem.id)
          // mem.employee.key = mem.employee.id
        })

        External = allMember.filter(e => e.type == 1)

        var objArray = [
          {
            name: '内部',
            key: '内部',
            scopedSlots: { title: 'title' },
            children: allMember.filter(e => e.type == 0)
          },
          {
            name: '外部',
            key: '外部',
            scopedSlots: { title: 'title' },
            children: External
          }
        ]

        this.treeData = objArray
        // console.log(this.treeData, 'this.treeDat2a')
        // return
      } else {
        //专业负责人

        let NeiBuArray = this.members.filter(ele => ele.type == 0)
        let WaiBuArray = this.members.filter(ele => ele.type == 1)

        WaiBuArray.forEach((mem, index) => {
          mem.employee.member_id = mem.id
          mem.employee._remark = mem.remark
          mem.employee.key = index
          mem.employee.type = mem.type

          let onlineTime = mem.employee.onlineTime ? new Date(mem.employee.onlineTime).getTime() : 0
          let nowTime = new Date().getTime()

          //   mem.employee.title = mem.employee.name
          mem.employee.slots = {
            icon: nowTime - onlineTime > 60 * 1000 ? 'offline' : 'online'
          }
          mem.employee.scopedSlots = {
            title: 'title'
          }
          var _employee = Object.assign({}, mem.employee)

          External.push(_employee)
          this.defaultExpandedKeys.push(mem.id)
        })


        chargers.forEach((ele, index) => {
          ele.employee.children = []
          ele.employee.key = ele.employee.id
          ele.employee.charger_id = ele.id
          ele.employee._remark = ele.remark || ''
          ele.employee.key = index

          let onlineTime = ele.employee.onlineTime ? new Date(ele.employee.onlineTime).getTime() : 0
          let nowTime = new Date().getTime()

          ele.employee.slots = {
            icon: nowTime - onlineTime > 60 * 1000 ? 'offline' : 'online'
          }
          ele.employee.scopedSlots = {
            title: 'title'
          }
          var _employee = Object.assign({}, ele.employee)
          allMember.push(_employee)
        })

        var filterMember = {}
        // var neiBuArray = allMember.filter(ele => ele.type != 1)

        allMember.forEach(ele => {
          this.defaultExpandedKeys.push(ele.id)

          NeiBuArray.forEach(mem => {
            mem.employee.member_id = mem.id
            mem.employee._remark = mem.remark
            mem.employee.key = mem.employee.id
            mem.employee.type = mem.type

            let onlineTime = mem.employee.onlineTime ? new Date(mem.employee.onlineTime).getTime() : 0
            let nowTime = new Date().getTime()
            mem.employee.slots = {
              icon: nowTime - onlineTime > 60 * 1000 ? 'offline' : 'online'
            }
            mem.employee.scopedSlots = {
              title: 'title'
            }
            // mem.employee.key = mem.employee.id

           if (ele.id == mem.charger_id) {
              //归属在专业负责人下面
              // mem.employee.key = mem.employee.id
              this.defaultExpandedKeys.push(mem.employee.id)

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
        //   console.log(filterMember, 'no in chargers')
        for (var key in filterMember) {
          if (filterMember[key] !== 1) {
            allMember.push(filterMember[key])
          }
        }


        var objArray = [
          {
            name: '内部',
            key: '内部',
            scopedSlots: { title: 'title' },
            children: allMember
          },
          {
            name: '外部',
            key: '外部',
            scopedSlots: { title: 'title' },
            children: External
          }
        ]
        this.treeData = objArray
      }

      // console.log(this.treeData, 'this.treeData')
    },
    onPanelChange(value, mode) {
      console.log(value, mode)
    },
    //节点收起和展开
    changeExpand(expandedKeys, { expanded: bool, node }) {
      this.defaultExpandedKeys = expandedKeys
      // console.log(expandedKeys)
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, info)
      if (!selectedKeys.length) {
        //第二次点击没有key值
        this.$emit('messageAddPre', info.node.dataRef.name)
        return
      }
    },
    dateSelect(date) {
      this.nowTime = date.format('YYYY-MM-DD HH:mm:ss')
      this.logVisible = true
      console.log(this.nowTime, 'd')
    },
    logCancel() {
      this.logVisible = false
    },
    //跳转到项目详细页
    goProjectDetail(type) {
      // alert('项目详情：' + id)
      // this.$router.push({ path:`/project?projectId=${id}`})
      let routeData = this.$router.resolve({
        name: 'project',
        query: { projectId: this.projectId, name: this.info.name, type: type }
      })
      console.log(routeData.href)
      window.open(routeData.href, '_blank')
      // console.log(this.$router.go('/project'))
    }
  }
}
</script>

<style>
.WorkplaceInfo {
  height: 100%;
  min-height: 280px;
  min-width: 610px;
}
.WorkplaceInfo .ant-layout-sider,
.WorkplaceInfo .ant-layout-header,
.WorkplaceInfo .ant-layout-content {
  background: #fff;
}
.WorkplaceInfo .ant-layout-header {
  padding: 0;
  padding-left: 10px;
  height: 100px;
}
.WorkplaceInfo .f12 {
  font-size: 12px;
}
.WorkplaceInfo .ant-tree li span.ant-tree-iconEle {
  width: unset;
  height: unset;
  margin-right: 5px;
}
.WorkplaceInfo .offline {
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
}
</style>
