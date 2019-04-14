<template>
  <div :style="{borderBottom: 'solid 1px #e7e7e7', backgroundColor: '#f7f7f7', height: '525px', overflow: 'hidden', overflowY: 'auto'}">
    <a-list
      class="demo-loadmore-list"
      :loading="loading"
      itemLayout="horizontal"
      :dataSource="logs"
    >
      <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        <a-spin v-if="loadingMore" />
        <a-button v-else @click="getMoreLogs">加载更多</a-button>
      </div>
      <a-list-item class="log-item" slot="renderItem" slot-scope="item, index">
        <a-list-item-meta
          :description="item.body.text || ''"
        >
          <a slot="title" href="#">{{ item.sender.name }}</a>
          <a-avatar slot="avatar" :src="item.sender.headPortrail || '../../avatar.png'" />
        </a-list-item-meta>
        <div>{{ formatTime(item.createdAt) }}</div>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>

  import { db } from '@/utils/db.js'
  import moment from 'moment'

export default {
  name: 'WorkplaceLog',
  props: {
    projectId: {
      type: String,
      default: '526adf50-66fa-478f-9245-74dd5f61a7df'
    }
  },
  components: {
    // MyIcon
  },
  data() {
    return {
      loading: true,
      logs: [],
      minId: '',
      maxId:'',
      limit: 50,
      showLoadingMore:false,
      loadingMore:false
    }
  },
  created() {
    //初始化数据库连接
    this.dbConn = new db(this.$apollo)
  },
  mounted() {
    this.getLastLogs()
  },
  methods: {
    formatTime(d) {
      return moment(d).format('HH:mm')
    },
    async getLastLogs() {
      // debugger
      var res = await this.dbConn.query(`
          query {
            ProjectMessage(where: {project_id:{_eq: "${this.projectId}"}, type: {_eq: 3}}, order_by: [{createdAt: desc}], limit: ${this.limit}){
              id
              type
              project_id
              sender {
                id
                name
                headPortrail
              }
              body
              createdAt
            }
          }
        `)
      
      if (res.data) {
        this.logs = res.data.ProjectMessage
        this.minId = (this.logs[0] || {}).createdAt
        this.maxId = (this.logs[this.logs.length - 1] || {}).createdAt
        if(this.logs.length) {
          this.showLoadingMore = true
          this.loadingMore = false
        }
      }
      this.loading = false
    },

    async getMoreLogs() {
      var res = await this.dbConn.query(`
          query {
            ProjectMessage(where: {project_id:{_eq: "${this.projectId}"}, type: {_eq: 3},createdAt:{_lt:"${this.maxId}"}}, order_by: [{createdAt: desc}], limit: ${this.limit}){
              id
              type
              project_id
              sender {
                id
                name
                headPortrail
              }
              body
              createdAt
            }
          }
        `)
      
      if (res.data) {
        this.logs = this.logs.concat(res.data.ProjectMessage)
        // this.minId = (this.logs[0] || {}).createdAt
        this.maxId = (this.logs[this.logs.length - 1] || {}).createdAt
        if(res.data.ProjectMessage.length) {
          this.showLoadingMore = true
          this.loadingMore = false
        }else {
          this.showLoadingMore = false
        }
      }
    },
  }
}
</script>
<style>
/* .icon {
  width: 4em;
  height: 4em;
  fill:#cbcbcb
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
} */
.log-item {
  border-bottom: 0px;
  margin: 10px;
}
</style>

