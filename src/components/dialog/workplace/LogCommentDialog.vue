<template>
  <a-row>
    <a-modal
      :title="title"
      v-model="visibled"
      :maskClosable="maskClosable"
      :width="650"
      :footer="null"
      @cancel="cancel"
      class="log-comment"
    >
      <a-row>
        <a-col :span="24">
          <a-list
            :style="{maxHeight:'400px',overflow:'auto'}"
            v-if="comments.length"
            :dataSource="comments"
            :header="`${comments.length} 条日志`"
            itemLayout="horizontal"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-comment
                :author="item.author"
                :avatar="item.avatar"
                :content="item.content"
                :datetime="item.dataTime"
              ></a-comment>
            </a-list-item>
          </a-list>
          <a-comment>
            <a-avatar slot="avatar" :src="avatar()" alt="Han Solo"/>
            <div slot="content">
              <a-form-item>
                <a-textarea :rows="4" @change="handleChange" :value="value"></a-textarea>
              </a-form-item>
              <a-form-item>
                <a-button
                  htmlType="submit"
                  :loading="submitting"
                  @click="handleSubmit"
                  type="primary"
                >发送</a-button>
              </a-form-item>
            </div>
          </a-comment>
        </a-col>
      </a-row>

      <!-- <template slot="footer">
        <div></div>
      </template>-->
    </a-modal>
  </a-row>
</template>
<script>
import gql from 'graphql-tag'
import { db } from '@/utils/db'
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'LogCommentDialog',
  props: {
    inititle: {
      type: String,
      default: ''
    },
    inivisible: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      //点击蒙层是否允许关闭
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: ''
    },
    nowTime: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      data: [],
      value: '',
      submitting: false,
      dbConn: null,
      moment,
      comments: [],
      minId: '',
      maxId: '',
      sortNo: ''
    }
  },
  created() {
    this.dbConn = new db(this.$apollo)
    this.comments = []
    this.data = []
    let minId = this.moment(this.nowTime).format('YYYY-MM-DD 00:00:00')
    let maxId = this.moment(this.nowTime).format('YYYY-MM-DD 23:59:59')
    this.minId = this.moment(minId)
      .utc()
      .format()
    this.maxId = this.moment(maxId)
      .utc()
      .format()
    this.getLastMessage()
    console.log('created log')
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  methods: {
    ...mapGetters(['nickname', 'avatar']),
    handleChange(e) {
      this.value = e.target.value
    },
    async handleSubmit() {
      this.submitting = true

      let createdAt = this.moment(this.nowTime).format('YYYY-MM-DD') + ' ' + this.moment().format('HH:mm:ss')
      createdAt = this.moment(createdAt)
        .utc()
        .format()
      const res = await this.dbConn.mutation(
        `
            mutation insertMessage($body: jsonb) {
              insert_ProjectMessage(objects: [
                {
                  type: 3
                  body: $body
                  project_id: "${this.projectId}"
                  sender_id: "${this.userInfo.id}",
                  createdAt:"${createdAt}"
                }
              ]){
                returning {
                  id
                }
              }
            }
          `,
        {
          body: {
            text: this.value
          }
        }
      )

      console.log(res, 'send message')

      if (!res.data) {
        this.$message.success('发送失败，请重试')
      } else {
        this.message = ''
        this.value = ''
      }
    },
    async getLastMessage() {
      console.log(`
          query {
            ProjectMessage(where: {_and:[{project_id:{_eq: "${this.projectId}"}},{type:{_eq:3}},{createdAt:{_gt:"${
        this.minId
      }"}},{createdAt:{_lt:"${this.maxId}"}}]}, order_by: [{sortNo: desc}]){
              id
              type
              project_id
              sortNo
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
      var res = await this.dbConn.query(`
          query {
            ProjectMessage(where: {_and:[{project_id:{_eq: "${this.projectId}"}},{type:{_eq:3}},{createdAt:{_gt:"${
        this.minId
      }"}},{createdAt:{_lt:"${this.maxId}"}}]}, order_by: [{sortNo: desc}]){
              id
              type
              project_id
              sortNo
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
        this.data = this.data.concat(res.data.ProjectMessage)
        console.log(this.data, 'danqian')
        this.sortNo = (this.data[0] || {}).sortNo || 0
        this.beforeData(this.data)
        this.getActivity()
      }
    },
    //实时监听
    getActivity() {
      const _this = this
      const subQuery = gql`subscription {
        ProjectMessage(where: {_and:[{project_id:{_eq: "${this.projectId}"}},{type:{_eq:3}},{createdAt:{_gt:"${
          this.minId
          }"}},{createdAt:{_lt:"${this.maxId}"}},${
            this.sortNo ? `{sortNo:{_gt:"${this.sortNo}"}}` : ''
          }]}, order_by: [{sortNo: desc}], limit: 1){
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
          }`

      const observer = this.$apollo.subscribe({
        query: subQuery,
        variables: {}
      })

      console.log(observer, 'observerobserver')
      observer.subscribe({
        next(data) {
          console.log(data, 'getActivity')
          if (data.data.ProjectMessage.length) {
            _this.data = [data.data.ProjectMessage[0], ..._this.data]
            _this.beforeData(_this.data)
          }

          _this.submitting = false
        },
        error(error) {
          console.error(error)
        }
      })
    },

    beforeData(data) {
      console.log(data, 'datatt--------------')
      let beforeData = []
      data.forEach(ele => {
        let obj = {
          author: ele.sender.name,
          avatar: this.avatar(),
          content: ele.body.text,
          dataTime: this.moment(ele.createdAt).format('HH:mm:ss')
        }
        beforeData.push(obj)
      })
      console.log(beforeData, 'beforeDatabeforeDatabeforeData')
      this.comments = beforeData
    },
    cancel() {
      this.$emit('logCancel')
    }
  },
  watch: {
    inivisible(newT) {
      console.log(newT)
      this.visibled = newT
      if (newT) {
      }
    }
  }
}
</script>
<style>
.log-comment .ant-list-item {
  padding: 0px;
}
</style>


