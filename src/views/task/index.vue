<template>
  <div class="page-header-index-wide">
    <div>
      <a-card :loading="loading" :bordered="false" :body-style="{padding: '0',minWidth:'1200px'}">
        <a-tabs
          default-active-key="1"
          size="large"
          :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
        >
          <a-tab-pane loading="true" :tab="title" key="1">
            <!-- 操作栏 -->
            <a-row :style="{marginBottom: '12px',minWidth:'1200px'}">
              <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                <a-button type="primary" icon="plus" @click="createTask(true)">创建任务</a-button>
              </a-col>

              <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                <div :style="{float: 'right',width: '60%'}">
                  <!-- <a-button type="primary" icon="search" :style="{width:'25%'}">选择部门</a-button> -->
                  <a-input-search
                    :style="{width:'100%'}"
                    placeholder="任务名称、发起人、接收人"
                    @search="onSearch"
                    enterButton="搜索"
                  />
                </div>
              </a-col>
            </a-row>
            <!-- 面板 -->
            <a-row>
              <!-- <a-tab-pane loading="true" key="1" style="overflow:auto"> -->
              <div class="taskType">
                <a-tabs type="card" defaultActiveKey="1" @change="tabChange" @tabClick="tabClick">
                  <a-tab-pane tab="我接收的任务" key="1"></a-tab-pane>
                  <a-tab-pane tab="我发起的任务" key="2"></a-tab-pane>
                  <a-tab-pane tab="已完成的任务" key="3"></a-tab-pane>
                </a-tabs>
                <TaskReceive :tapType="tapType"/>
              </div>
              <!-- </a-tab-pane> -->
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    <TaskCreate inititle="添加任务" :initvisibled="createVisi" @toggle="toggle"/>
  </div>
</template>

<script>
import TaskReceive from '@/components/task/TaskReceive'
import TaskCreate from '@/components/dialog/task/TaskCreateDialog'
// import ProjectDetail from '@/components/project/ProjectDetail'

export default {
  name: 'TaskIndex',
  components: {
    TaskReceive,
    TaskCreate
    // ProjectList,
    // ProjectDetail
  },
  data() {
    return {
      loading: true,
      moduleType: 1,
      title: '任务管理',
      tapType: 1,
      createVisi: false
    }
  },
 
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  
  methods: {
    toggle(e) {
      this.createVisi = e
    },
    createTask() {
      this.createVisi = true
    },
    onSearch() {},
    tabChange(activeKey) {
      this.tapType = parseInt(activeKey)
      // console.log(activeKey)
    },
    tabClick(activeKey) {
      this.tapType = parseInt(activeKey)
      console.log(activeKey)
    }
  }
}
</script>

<style>
.taskType .ant-tabs-card .ant-tabs-content .ant-tabs-tabpane {
  background: #fff;
  /* padding: 16px; */
}

.taskType .ant-tabs-nav-container .ant-tabs-nav-wrap {
  background: #eee;
}
.taskType .ant-tabs-card .ant-tabs-bar {
  border-color: #fff;
}

.taskType .ant-tabs-card .ant-tabs-bar .ant-tabs-tab {
  border-color: #ddd;
  background: #eee;
  margin-right: 0;
  border-radius: 0;
  border: 0;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.taskType .ant-tabs-card .ant-tabs-bar .ant-tabs-tab:nth-child(1) {
  border-left: 1px solid #ddd;
}

.taskType .ant-tabs-card .ant-tabs-bar .ant-tabs-tab-active {
  /* border-color: #fff; */
  background: #fff;
}
</style>