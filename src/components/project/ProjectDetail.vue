<template>
  <div :style="{maxWidth:'unset',margin:'0 auto'}">
    <a-card
      :loading="loading"
      :bordered="false"
      :body-style="{padding: '0 10px 40px',minWidth:'1150px'}"
    >
      <a-tabs
        default-active-key="1"
        size="large"
        :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
      >
        <a-tab-pane loading="true" :tab="title" key="1" >
          <ProjectInfo :type="type" v-if="type < 4"  />
          <div class="contractType" v-else>
            <a-tabs
              type="card"
              :defaultActiveKey="tapType"
              @change="tabChange"
              @tabClick="tabClick"
            >
              <a-tab-pane tab="项目进度" key="1"></a-tab-pane>
              <a-tab-pane tab="项目信息" key="2">
                <!-- <ProjectInfo :dataSource="iniDataSource"/> -->
              </a-tab-pane>
              <a-tab-pane tab="项目成员" key="3">
                <!-- <ProjectMember/> -->
              </a-tab-pane>
              <a-tab-pane tab="项目资料" key="4">
                <!-- <ProjectDoc/> -->
              </a-tab-pane>
              <a-tab-pane tab="项目任务" key="5">
                <!-- <ProjectTask /> -->
              </a-tab-pane>
              <a-tab-pane tab="多级复核" key="6">
                <!-- <ProjectReview/> -->
              </a-tab-pane>
              <a-tab-pane tab="项目造价" key="7">
                <!-- <ProjectCost/> -->
              </a-tab-pane>
              <a-tab-pane tab="内部核算" key="8">
                <!-- <ProjectFund/> -->
              </a-tab-pane>
            </a-tabs>

            <ProjectProgress :projectId="proId" v-if="activeTab == 1"/>
            
            <ProjectInfo :projectId="proId" :type="type" v-else-if="activeTab == 2"/>

            <ProjectMember :projectId="proId" v-else-if="activeTab == 3"/>

            <ProjectDoc :projectId="proId" v-else-if="activeTab == 4"/>
            
            <ProjectTask :projectId="proId" v-else-if="activeTab == 5"/>

            <ProjectReview :projectId="proId" v-else-if="activeTab == 6"/>

            <ProjectCost :projectId="proId" v-else-if="activeTab == 7"/>

            <ProjectFund :projectId="proId" v-else-if="activeTab == 8"/>
          </div>
        </a-tab-pane>
        <a slot="tabBarExtraContent" @click="backList">
          <a-icon type="rollback"/>返回项目列表
        </a>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { getServiceList } from '@/api/manage'

import employeeTree from '@/components/same/employeeTree'
import ProjectInfo from '@/components/project/ProjectInfo'
import ContractFund from '@/components/contract/ContractFund'
import ProjectCost from '@/components/project/ProjectCost'
import ProjectProgress from '@/components/project/ProjectProgress'
import ProjectMember from '@/components/project/ProjectMember'
import ProjectDoc from '@/components/project/ProjectDoc'
import ProjectTask from '@/components/project/ProjectTask'
import ProjectReview from '@/components/project/ProjectReview'
import ProjectFund from '@/components/project/ProjectFund'

export default {
  name: 'TableDetail',
  props: {
    title: {
      type: String,
      default: ''
    },
    moduleType: {
      type: Number,
      default: 2
    },
    tapType: {
      type: String,
      default: '1'
    },
    projectId: {
      type:String,
      default:''
    }

  },
  components: {
    employeeTree,
    ProjectInfo,
    ContractFund,
    ProjectCost,
    ProjectProgress,
    ProjectMember,
    ProjectDoc,
    ProjectTask,
    ProjectReview,
    ProjectFund
  },
  data() {
    return {
      loading: false,   //加载状态
      type: String(this.moduleType),  //默认类型
      activeTab: this.tapType, //标签页key
      proId:this.projectId, //项目ID
    }
  },
  created() {
    //数据请求参数配置
  },
  methods: {
    //接口获取数据
    loadData() {},
    backList() { //返回项目列表
      // console.log(1)
      this.$emit('changeCom', { type: 1 })
    },
    //标签页切换
    tabChange(activeKey) {
      this.activeTab = activeKey
      // console.log(activeKey,'tabchange')
    },
    tabClick(activeKey) {
      // console.log(activeKey,'tabclick')
    }
  },
  watch: {}
}
</script>

<style>
.ant-form-item-required:before {
  display: inline-block;
  margin-right: 4px;
  content: '*';
  font-family: SimSun;
  line-height: 1;
  font-size: 14px;
  color: #f5222d;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ant-tabs-extra-content {
  line-height: 55px;
}

.divItem {
  padding: 10px 0;
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
.label-title {
  margin: 30px 0 10px 0;
  color: #555;
}

.contractType .ant-tabs-card .ant-tabs-content .ant-tabs-tabpane {
  background: #fff;
  /* padding: 16px; */
}

.contractType .ant-tabs-nav-container .ant-tabs-nav-wrap {
  background: #eee;
}
.contractType .ant-tabs-card .ant-tabs-bar {
  border-color: #fff;
}

.contractType .ant-tabs-card .ant-tabs-bar .ant-tabs-tab {
  border-color: #ddd;
  background: #eee;
  margin-right: 0;
  border-radius: 0;
  border: 0;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.contractType .ant-tabs-card .ant-tabs-bar .ant-tabs-tab:nth-child(1) {
  border-left: 1px solid #ddd;
}

.contractType .ant-tabs-card .ant-tabs-bar .ant-tabs-tab-active {
  /* border-color: #fff; */
  background: #fff;
}
</style>
