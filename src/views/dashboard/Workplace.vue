<template>
  <div style="height: 100%;min-height:576px">
    <!-- <div class="title" :title="name">
      {{name}}
    </div>
    <a-tabs defaultActiveKey="1" :tabBarStyle="{margin: '0px'}" @change="tabChange">
      <a-tab-pane key="1">
        <span slot="tab"><a-icon type="wechat" title="会话" style="font-size: 18px"/></span>
        <a-row>
          <a-card
            class="message-card"
            :loading="loading"
            :title="name"
            :bordered="false"
            :head-style="{backgroundColor: '#fff', display: 'none'}"
            :body-style="{borderBottom: 'solid 1px #e7e7e7', backgroundColor: '#f7f7f7', height: '385px', overflow: 'hidden', overflowY: 'auto'}"
          >
            <div v-if="loadingMore" style="text-align: center">
            </div>
            <a-list class="message-list" size="small" :dataSource="activities">
              <div slot="renderItem" class="message-item" slot-scope="item, index">
                <div class="message_cell" v-if="item.sender.id === userInfo.id">
                  <a-avatar :src="item.sender.headPortrail || '../../avatar.png'" style="float:right"/>
                  <div class="sender" style="text-align: right;">
                    {{ formatTime(item.createdAt) }}
                  </div>
                  <div style="text-align: right;">
                    <div class="send-body">{{ getTypeDesc(item) }}</div>
                  </div>
                </div>
                <div class="message_cell" v-else>
                  <a-avatar :src="item.sender.headPortrail || '../../avatar.png'" style="float:left"/>
                  <div class="sender">
                    {{ item.sender.name }}&nbsp;&nbsp;{{ formatTime(item.createdAt) }}
                  </div>
                  <div>
                    <div class="send-body">{{ getTypeDesc(item) }}</div>
                  </div>
                </div>
              </div>
              <div id="msg_end" style="height:0px; overflow:hidden"></div>
            </a-list>
          </a-card>
        </a-row>
        <a-row style="background-color: #f7f7f7; padding: 5px">
          <a-col>
            <a-select defaultValue="0" style="width: 90px" @change="onTypeChange">
              <a-select-option value="0">文本</a-select-option>
              <a-select-option value="3">日志</a-select-option>
            </a-select>
            &nbsp;&nbsp;
            <a href="#" title="文件"><a-icon type="upload" style="font-size: 18px"/></a>
            &nbsp;&nbsp;
            <a href="#" title="图片"><a-icon type="picture" style="font-size: 18px"/></a>
          </a-col>
        </a-row>
        <a-row>
          <a-textarea class="message-input" placeholder="输入消息内容" :rows="4" :value="message" @pressEnter="onSend" @change="onMessageChange"/>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab"><a-icon type="file" title="项目资料" style="font-size: 18px"/></span>
        <WorkplaceDocument :projectId="projectId"/>
      </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab"><a-icon type="folder-open" title="公共文档" style="font-size: 18px"/></span>
        <WorkplaceFile :projectId="projectId"/>
      </a-tab-pane>
      <a-tab-pane key="4">
        <span slot="tab"><a-icon type="form" title="项目日志" style="font-size: 18px"/></span>
        <WorkplaceLog :projectId="projectId" ref="workplaceLog"/>
      </a-tab-pane>
    </a-tabs>-->
    <a-row style="height: 100%">
      <a-col :span="12" class="setHeight right-bottom">
        <WorkplaceInfo :projectId="projectId" @messageAddPre="messageAddPre"/>
      </a-col>
      <a-col :span="12" class="setHeight" style="border-bottom: 1px solid #ccc;">
        <WorkplaceQuick :projectId="projectId" ref="WorkplaceQuick" @changeFile="changeFile"/>
      </a-col>
      <a-col :span="12" class="setHeight" style="border-right: 1px solid #ccc;">
        <WorkplaceSelfFile
          :projectId="projectId"
          ref="WorkplaceSelfFile"
          @changeQuick="changeQuick"
        />
      </a-col>
      <a-col :span="12" class="setHeight">
        <WorkplaceWechat v-if="projectId" :projectId="projectId" ref="WorkplaceWechat"/>
      </a-col>
    </a-row>

   <uploadProgress />
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'

import PageLayout from '@/components/page/PageLayout'
import HeadInfo from '@/components/tools/HeadInfo'
import Radar from '@/components/chart/Radar'

import WorkplaceWechat from '@/components/dashboard/WorkplaceWechat'
import WorkplaceInfo from '@/components/dashboard/WorkplaceInfo'
import WorkplaceDocument from '@/components/dashboard/WorkplaceDocument'
import WorkplaceFile from '@/components/dashboard/WorkplaceFile'
import WorkplaceLog from '@/components/dashboard/WorkplaceLog'
import WorkplaceSelfFile from '@/components/dashboard/WorkplaceSelfFile'
import WorkplaceQuick from '@/components/dashboard/WorkplaceQuick'

import uploadProgress from '@/components/same/uploadProgress'

// import { getRoleList, getServiceList } from '@/api/manage'
import gql from 'graphql-tag'
import moment from 'moment'
import { db } from '@/utils/db.js'
import { mapState } from 'vuex'
// import { ArrayToString } from '@/utils/util.js'

const DataSet = require('@antv/data-set')

export default {
  name: 'Workplace',
  components: {
    PageLayout,
    HeadInfo,
    Radar,
    WorkplaceWechat,
    WorkplaceDocument,
    WorkplaceFile,
    WorkplaceLog,
    WorkplaceInfo,
    WorkplaceSelfFile,
    WorkplaceQuick,
    uploadProgress
  },
  props: {
    // name: {
    //   type: String,
    //   default: '【2019-1001】中山东路（新津河-莲凤路）道路桥梁及配套工程——龙湖片区'
    // }
  },
  data() {
    return {
      dbConn: null,
      name: '',
      timeFix: timeFix(),
      projectId: '',
      avatar: '',
      messageType: '0',
      message: '',
      user: {},
      limit: 50,
      loadingMore: false,

      projects: [],
      loading: false,
      radarLoading: false,
      activities: [],
      teams: [],
      minId: '', //加载更多使用的比较Id
      maxId: '', //实时订阅使用的比较Id
      sendingMsg: false,

      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [
        {
          dataKey: 'score',
          min: 0,
          max: 80
        }
      ],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      radarData: [],
      
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    //初始化数据库连接
    console.log(this.$route.query, 'his.$route.query')

    this.dbConn = new db(this.$apollo)
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    this.projectId = this.$route.query.projectId
    this.name = this.$route.query.name
    // this.getLastMessage()
    // getRoleList().then(res => {
    //   console.log('workplace -> call getRoleList()', res)
    // })
    //
    // getServiceList().then(res => {
    //   console.log('workplace -> call getServiceList()', res)
    // })
  },
  mounted() {
    // this.getProjects()

    // this.getActivity()
    // this.getTeams()
    // this.initRadar()
    let _this = this
    // document.getElementsByClassName('message-card')[0].getElementsByClassName('ant-card-body')[0].addEventListener('scroll', this.onScroll)
    // window.addEventListener("message", function(event){
    //     var data = event.data;
    //     console.log(data,'postMessage')
    //     if(data.params){
    //       _this.projectId = data.params.projectId
    //       _this.name = data.params.name
    //       _this.activities = []

    //     }

    //     switch (data.cmd) {
    //       case 'getFormJson':
    //           // 处理业务逻辑
    //           break;
    //       }
    //   });
  },
  updated() {
    // this.scrollToEnd()
  },
  methods: {
    ...mapGetters(['nickname', 'welcome']),

    changeQuick() {
      this.$refs.WorkplaceQuick.getFavorite()
    },
    changeFile() {
      // debugger
      this.$refs.WorkplaceSelfFile.initLoad()
    },
    messageAddPre(name) {
      this.$refs.WorkplaceWechat.messageAddPre(name)
    },
    
  }
}
</script>

<style lang="scss">
body {
  padding-right: 0 !important;
}

.title {
  padding: 5px;
  font-weight: bold;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-input {
  border: solid 0 #ededed;
  background-color: #f7f7f7;
  resize: none;
}

.message-input:focus {
  border: solid 0 #ededed;
  box-shadow: 0 0 0 0 #fff;
}

.message-input:active {
  border: solid 0 #ededed;
}

.message-card {
  /*background-color: #f7f7f7;*/
  .message-list {
  }

  .message-item {
    border-bottom: 0px;
    margin: 10px;
  }

  .sender {
    font-weight: 400;
    color: #999999;
    font-size: 12px;
    padding: 0px 40px 2px 40px;
  }

  .send-time {
    font-weight: 400;
    color: #999999;
    font-size: 12px;
  }

  .send-body {
    color: #333333;
    width: auto;
    display: inline-block !important;
    display: inline;
    background-color: #fff;
    padding: 8px;
    border-radius: 5px;
    margin-left: 7px;
    margin-right: 7px;
  }
}

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #78bb60;
      }
    }
  }
  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #78bb60;
      }
    }
    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }
  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;
    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }
    &:hover {
      span {
        color: #78bb60;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}

.setHeight {
  height: 50%;
  overflow: auto;
}

.right-bottom {
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #ccc;
}
.left-top {
  border-left: 1px solid #cccccc;
  border-top: 1px solid #ccc;
}

</style>