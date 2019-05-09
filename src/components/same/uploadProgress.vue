
<template>
  <div
    :class="['mod-tasks',isShow?'expand':''] "
    :style="{visibility: 'visible',display:isClose?'none':'block'}"
  >
    <div class="operation">
      <span class="btn">
        <a-icon type="down" v-if="isShow" @click="showList"/>
        <a-icon type="up" v-else @click="showList"/>
      </span>
      <span aria-label="关闭" class="btn" @click="closeList">
        <a-icon type="close"/>
      </span>
    </div>
    <div class="tasks-header tasking-nor">
      <div class="summary-wrapper">
        <span class="icon icon-status">
          <!-- <a-icon
            type="check-circle"
            style="font-size: 20px;line-height: 20px; position: absolute;"
          />-->
          <a-progress
            type="circle"
            :percent="getText().percent"
            :width="24"
            :status="getText().status"
            style="font-size: 9px;position: absolute;"
          />
        </span>
        <p class="txt">{{getText().text}}</p>
      </div>
      <div class="title-wrapper">
        <div class="info">
          <p class="txt txt-sub"></p>
        </div>
        <h2 class="title">{{getText().text}}</h2>
      </div>
    </div>
    <div class="tasks-body">
      <div class="tasks-cont">
        <div class="tasks-group-wrapper">
          <div class="tasks-group-viewport">
            <div class="tasks-list-wrapper" style="padding:0 10px">
              <a-list :dataSource="files">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta :description="getSize(item.size)">
                    <a slot="title" :title="item.name">{{item.name}}</a>
                    <a-avatar icon="file" slot="avatar" style="backgroundColor:#87d068"/>
                  </a-list-item-meta>
                  <div>
                    <a-progress
                      type="circle"
                      :percent="parseInt(item.percent)"
                      :width="32"
                      :status="getStatus(item.status)"
                    />
                  </div>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'UploadProgress',
  data() {
    return {
      isClose: true,
      isShow: false,
      data: [
        { email: 222, name: { last: '343' } },
        { email: 222, name: { last: '343' } },
        { email: 222, name: { last: '343' } },
        { email: 222, name: { last: '343' } }
      ]
    }
  },
  computed: {
    ...mapState({
      files: state => state.files
    })
  },
  methods: {
    ...mapMutations(['set_file']),
    showList() {
      this.isShow = !this.isShow
    },
    closeList() {
      this.isClose = true
      this.set_file([])
    },
    getText() {
      let done = this.files.filter(ele => ele.status == 'done')
      if (done.length == this.files.length) {
        return { text: '任务已完成', status: 'success', percent: 100 }
      } else {
        return {
          text: `${done.length}/${this.files.length}文件上传中`,
          status: 'normal',
          percent: (done.length / this.files.length) * 100
        }
      }
    },
    getSize(size) {
      if (size / (1024 * 1024 * 1024) > 1) {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + 'G'
      } else if (size / (1024 * 1024) > 1) {
        return (size / (1024 * 1024)).toFixed(2) + 'M'
      } else if (size / 1024 > 1) {
        return (size / 1024).toFixed(2) + 'K'
      } else {
        size + 'B'
      }
    },
    getStatus(status) {
      // return 'normal'
      if (status == 'done') {
        return 'success'
      } else if (status == 'error') {
        return 'exception'
      } else {
        return 'normal'
      }
    },
    getIconColor(item) {
      var fileFormat = item.name.split('.')
      fileFormat = fileFormat[fileFormat.length - 1] || ''
      fileFormat = fileFormat.toLocaleLowerCase()
      //   item.downLoadHref = `http://${location.hostname}:15050/upload/` + item.url + item.name
      if (['doc', 'docx'].indexOf(fileFormat) > -1) {
        item.iconType = 'file-word'
        item.iconColor = '#2b82c5'
      } else if (['xls', 'xlsx'].indexOf(fileFormat) > -1) {
        item.iconType = 'file-excel'
        item.iconColor = '#3d9364'
      } else if (['png', 'jpg', 'jpeg', 'gif'].indexOf(fileFormat) > -1) {
        item.iconType = 'file-jpg'
        item.iconColor = '#40d5b3'
      } else if (['pdf'].indexOf(fileFormat) > -1) {
        item.iconType = 'file-pdf'
        item.iconColor = '#de5657'
      } else if (['ppt', 'pptx'].indexOf(fileFormat) > -1) {
        item.iconType = 'file-ppt'
        item.iconColor = '#ff8a00'
      } else if (['txt'].indexOf(fileFormat) > -1) {
        item.iconType = 'file-text'
        item.iconColor = '#666'
      } else {
        item.iconType = 'file-unknown'
        item.iconColor = '#666'
      }
    }
  },
  watch: {
    files(newT) {
      console.log(newT, 'files')
      if ((newT || []).length) {
        this.isClose = false
      } else {
        this.isClose = true
      }
    }
  }
}
</script>

<style>
.mod-tasks {
  position: fixed;
  z-index: 40;
  right: 40px;
  bottom: 20px;
  width: 540px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 1px 4px 0 rgba(15, 32, 66, 0.2);
  background-color: #fff;
  border: 1px solid rgba(5, 13, 27, 0.16);
  border-top: none;
  overflow: hidden;
  height: 56px;
  transition: height 0.3s ease;
}
.mod-tasks.expand {
  height: 342px;
  line-height: 1.2;
}
.mod-tasks::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-top: 2px solid #00a4ff;
  border-bottom: 2px solid #00a4ff;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
}
.mod-tasks .operation {
  position: absolute;
  z-index: 1;
  right: 20px;
  top: 13px;
  line-height: 0;
  font-size: 0;
}
.mod-tasks .operation .btn {
  border: none;
  outline: 0;
  background: 0 0;
  padding: 0;
  color: transparent;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  border-radius: 100%;
  font-size: 0;
}

.mod-tasks .operation .btn:last-of-type {
  margin-right: 0;
}
.mod-tasks .operation .btn .anticon {
  font-size: 16px;
  color: #646262;
  line-height: 30px;
}
.mod-tasks .tasks-header {
  position: relative;
  z-index: 0;
}

.mod-tasks.expand .tasks-header .title-wrapper .title {
  font-size: 26px;
  color: #000;
  margin-top: 10px;
}

.mod-tasks.expand .result-fail.tasks-header,
.mod-tasks.expand .result-succ.tasks-header,
.mod-tasks.expand .tasking-offline.tasks-header,
.mod-tasks.expand .tasks-header {
  padding-left: 28px;
}
.mod-tasks.expand .tasks-header {
  height: 94px;
  box-sizing: border-box;
  padding-top: 35px;
  padding-left: 28px;
}
.mod-tasks.expand .tasks-header .summary-wrapper,
.mod-tasks.expand .tasks-header .summary-wrapper .before {
  display: none;
}
.mod-tasks .summary-wrapper {
  padding-left: 19px;
  height: 56px;
  line-height: 56px;
  font-size: 0;
}
.mod-tasks .tasks-header .before {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: transparent;
  pointer-events: none;
  -webkit-transform-origin: 0 50%;
  transform-origin: 0 50%;
}

.mod-tasks .tasks-body,
.mod-tasks .tasks-header .title-wrapper {
  display: none;
}
.mod-tasks.expand .tasks-body,
.mod-tasks.expand .tasks-header .title-wrapper {
  display: block;
}

.mod-tasks.expand .tasks-body {
  border-top: 1px solid #eee;
}

.mod-tasks .summary-wrapper .txt {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  font-weight: 500;
  font-size: 14px;
  margin: 0;
}
.mod-tasks .summary-wrapper .icon-status {
  margin-right: 16px;
  width: 25px;
  height: 25px;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.icon {
  position: relative;
  display: inline-block;
  background-repeat: no-repeat;
  font-size: 0;
  overflow: hidden;
  -webkit-text-size-adjust: none;
  vertical-align: middle;
}
.mod-tasks .ant-list-item-meta-avatar {
  line-height: 48px;
}

.mod-tasks .ant-progress-text {
  font-size: 9px;
}
.mod-tasks .ant-list-item-meta-title {
  height: 22px;
}
.mod-tasks .ant-list-item-meta-title a {
  display: inline-block;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mod-tasks .tasks-group-wrapper {
  width: 100%;
  height: 245px;
  overflow: auto;
  overflow-x: hidden;
  white-space: nowrap;
}
.tasks-group-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 16px;
  background-color: #f5f5f5;
}
.tasks-group-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #d8dce5;
}
.tasks-group-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
</style>

