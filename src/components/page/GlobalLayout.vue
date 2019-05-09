<template>
  <a-layout class="layout" :class="[device]">
    <template v-if="isSideMenu()">
      <a-drawer
        v-if="isMobile()"
        :wrapClassName="'drawer-sider ' + navTheme"
        :closable="false"
        :visible="collapsed"
        placement="left"
        @close="() => this.collapsed = false"
      >
        <side-menu
          :menus="menus"
          :theme="navTheme"
          :collapsed="false"
          :collapsible="true"
          mode="inline"
          @menuSelect="menuSelect"
        ></side-menu>
      </a-drawer>

      <side-menu
        v-else
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </template>
    <!-- 下次优化这些代码 -->
    <template v-else>
      <a-drawer
        v-if="isMobile()"
        :wrapClassName="'drawer-sider ' + navTheme"
        placement="left"
        @close="() => this.collapsed = false"
        :closable="false"
        :visible="collapsed"
      >
        <side-menu
          :menus="menus"
          :theme="navTheme"
          :collapsed="false"
          :collapsible="true"
          mode="inline"
          @menuSelect="menuSelect"
        ></side-menu>
      </a-drawer>
    </template>

    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: fixSiderbar && isDesktop() ? `${sidebarOpened ? 256 : 80}px` : '0', minHeight: '100vh' }"
    >
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content
        :style="{ margin: '24px 24px 0', height: '100%', paddingTop: fixedHeader ? '80px' : '0' }"
      >
        <slot></slot>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer style="padding: 0px">
        <global-footer/>
      </a-layout-footer>

      <!-- <setting-drawer></setting-drawer> -->
      <div class="fix-right-v3" id="back-top" daty-id="index" log-mod="sidebar">
        <a-menu
          :defaultSelectedKeys="['1']"
          :defaultOpenKeys="['']"
          mode="inline"
          theme="light"
          :inlineIndent="12"
          :inlineCollapsed="true"
          @click="handleClick"
        >
          <a-menu-item key="1" style="padding: 0px 12px!important;">
            <a-icon type="pie-chart"/>
            <span>创建合同</span>
          </a-menu-item>
          <a-menu-item key="2" style="padding: 0px 12px!important;">
            <a-icon type="desktop"/>
            <span>创建项目</span>
          </a-menu-item>
          <a-menu-item key="3" style="padding: 0px 12px!important;">
            <a-icon type="inbox"/>
            <span>写日志</span>
          </a-menu-item>
          <a-sub-menu key="sub1" style="margin-right: 30px!important">
            <div slot="title">
              <a-icon type="appstore" style="margin: 0px -20px!important;"/>
              <span>书签栏</span>
            </div>
            <a-menu-item v-for="(col,index) in quickData" :key="col.id">{{col.name}}</a-menu-item>
            <!-- <a-menu-item key="4">汕头市档案馆建设项目数字档案馆信息化系统项目</a-menu-item> -->
          </a-sub-menu>
        </a-menu>
        <a-menu
          :defaultSelectedKeys="['']"
          :defaultOpenKeys="['']"
          :selectedKeys="showWorkPlace"
          mode="inline"
          theme="light"
          :inlineIndent="12"
          :inlineCollapsed="true"
          @select="onWorkPlaceSelect"
          @click="onWorkPlaceClick"
        >
          <a-menu-item key="1" style="padding: 0px 12px!important;">
            <a-icon type="desktop"/>
            <span>工作台</span>
          </a-menu-item>
        </a-menu>
      </div>
      <div
        class="work-place"
        :style="{display:showWorkPlace.length > 0 && showWorkPlace[0] === '1'? 'block':'none'}"
      >
        <iframe
          :src="src"
          height="99%"
          width="100%"
          ref="iframe"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
        ></iframe>
      </div>
      <!-- <setting-drawer></setting-drawer> -->
    </a-layout>
    <uploadProgress/>
  </a-layout>
</template>

<script>
import SideMenu from '@/components/menu/SideMenu'
import GlobalHeader from '@/components/page/GlobalHeader'
import GlobalFooter from '@/components/page/GlobalFooter'
// import SettingDrawer from '@/components/setting/SettingDrawer'
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin.js'

import uploadProgress from '@/components/same/uploadProgress'

import { db } from '@/utils/db'

export default {
  name: 'GlobalLayout',
  components: {
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    uploadProgress
    // SettingDrawer
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      dbConn: new db(this.$apollo),
      collapsed: false,
      showWorkPlace: [],
      menus: [],
      iframeWin: {},
      quickData: [],
      src: ''
    }
  },
  computed: {
    ...mapState({
      // 主路由
      mainMenu: state => state.permission.addRouters,
      userInfo: state => state.user.info,
      globalProjectId: state => {
        console.log(state, 'dfdfdfdfdlayout')
        return state.projectId
      },
      projectName: state => {
        console.log(state, 'dfdfdfdfdlayout')
        return state.projectName
      }
    })
  },
  mounted() {
    if (this.$refs.iframe) {
      console.log(this.$refs.iframe.contentWindow)
      this.iframeWin = this.$refs.iframe.contentWindow
    }
    //
  },

  created() {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    console.log('created/sidebarOpened', this.sidebarOpened)
    this.collapsed = !this.sidebarOpened
    this.quickList()
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle() {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    menuSelect() {
      // debugger
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    onWorkPlaceSelect(e) {
      // debugger
      if (this.globalProjectId) {
        this.showWorkPlace = e.selectedKeys
        this.src = `/workplace?projectId=${this.globalProjectId}&name=${this.projectName}`
        this.iframeWin.location.reload(true)
        // this.sendMessage()
      } else {
        this.$message.warning('请点击项目列表的某个项目')
      }

      // setTimeout(function(){

      // this.iframeWin = this.$refs.iframe.contentWindow

      // },1000)

      console.log(this.globalProjectId, 'dfdfdf')
    },
    onWorkPlaceClick() {
      // debugger
      if (this.showWorkPlace && this.showWorkPlace.length > 0) {
        this.showWorkPlace = []
      }
    },
    sendMessage() {
      // 外部vue向iframe内部传数据
      this.iframeWin.postMessage(
        {
          cmd: 'getFormJson',
          params: {
            projectId: this.globalProjectId,
            name: this.projectName
          }
        },
        '*'
      )
    },
    //快捷面板和收藏列表
    async quickList() {
      var queryString = `query proje($skip: Int!, $pageSize: Int!) {
            projectex(
              args: { empid: "${this.userInfo.id}" }
              where: {isQuick:{_eq:1}},
              order_by:[{createdAt:desc_nulls_last}] ,
              offset: $skip, 
              limit: $pageSize
            ) {
              id
              contract {
                id
                name
              }
              businessType
              projectType
              projectNo
              name
              principal {
                id
                name
              }
              approvedAmount
              submitAmount
              status
              money
              remark
              stepName
              endDate
              isFavorite
              isQuick
          }
        }`
      console.log(queryString)
      let res = await this.dbConn.query(queryString, { skip: 0, pageSize: 10 })
      console.log(queryString, res)
      this.quickData = res.data.projectex.filter(ele => ele.isQuick)
      // if (this.actionKey == 2) {
      //   this.projectData = res.data.projectex.filter(ele => ele.isFavorite)
      // }
    },
    handleClick(e) {
      console.log(e)
      let id = e.key
      let record = this.quickData.filter(e => e.id == id)[0]
      if (record) {
        this.goProjectDetail(record, 1)
      }
    },
    //页面跳转
    goProjectDetail(record, type) {
      let routeData = this.$router.resolve({
        name: 'project',
        query: { projectId: record.id, name: record.name, type: type }
      })
      window.open(routeData.href, '_blank')
    }
  },
  watch: {
    globalProjectId(newT) {
      console.log(newT, 'newT')
      // this.iframeWin = this.$refs.iframe.contentWindow
      if (this.showWorkPlace.length > 0 && this.showWorkPlace[0] === '1') {
        this.src = `/workplace?projectId=${newT}&name=${this.projectName}`
        this.iframeWin.location.reload(true)
        // this.sendMessage()
      }
    },
    projectName(newT) {
      console.log(newT)
    },
    sidebarOpened(val) {
      console.log('sidebarOpened', val)
      this.collapsed = !val
    }
  }
}
</script>

<style lang="scss">
.userLayout {
  padding: 0;
}
body {
  // 打开滚动条固定显示
  padding-right: 40px;
  overflow-y: scroll;
  &.colorWeak {
    filter: invert(80%);
  }
}
.layout.ant-layout {
  overflow-x: hidden;
  &.desktop {
    .ant-layout {
      background: #6f6847;
    }
  }
  &.mobile,
  &.tablet {
    .ant-layout-content {
      .content {
        margin: 24px 0 0;
      }
    }
    /**
       * ant-table-wrapper
       * 覆盖的表格手机模式样式，如果想修改在手机上表格最低宽度，可以在这里改动
       */
    .ant-table-wrapper {
      .ant-table-content {
        overflow-y: auto;
      }
      .ant-table-body {
        min-width: 800px;
      }
    }
    .sidemenu {
      .ant-header-fixedHeader {
        &.ant-header-side-opened,
        &.ant-header-side-closed {
          width: 100%;
        }
      }
    }
    .topmenu {
      /* 必须为 topmenu  才能启用流式布局 */
      &.content-width-Fluid {
        .header-index-wide {
          margin-left: 0;
        }
      }
    }
  }
  &.ant-layout-has-sider {
    flex-direction: row;
  }
  .trigger {
    font-size: 20px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .topmenu {
    .ant-header-fixedHeader {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      transition: width 0.2s;
      &.ant-header-side-opened {
        width: 100%;
      }
      &.ant-header-side-closed {
        width: 100%;
      }
    }
    /* 必须为 topmenu  才能启用流式布局 */
    &.content-width-Fluid {
      .header-index-wide {
        max-width: unset;
        //   margin-left: 24px;
        padding-left: 24px;
        // color: #ccc;
        font-size: 14px;
        color: #c3dcf9;
      }
      .page-header-index-wide {
        max-width: unset;
        margin-top: 20px;
      }
    }
  }
  .sidemenu {
    .ant-header-fixedHeader {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      transition: width 0.2s;
      &.ant-header-side-opened {
        width: calc(100% - 256px);
      }
      &.ant-header-side-closed {
        width: calc(100% - 80px);
      }
    }
  }
  .header {
    height: 64px;
    padding: 0 12px 0 0;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
  }
  .header,
  .top-nav-header-index {
    .user-wrapper {
      float: right;
      padding-right: 40px;
      height: 100%;
      .action {
        cursor: pointer;
        padding: 0 12px;
        display: inline-block;
        transition: all 0.3s;
        height: 100%;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
        .avatar {
          // margin: 20px 8px 20px 0;
          // color: #78bb60;
          // background: hsla(0, 0%, 100%, .85);
          // vertical-align: middle;
          margin: 10px 8px 10px 0;
          color: #78bb60;
          background: hsla(0, 0%, 100%, 0.85);
          vertical-align: middle;
          top: -2px;
        }
        .icon {
          font-size: 16px;
          padding: 4px;
        }
      }
    }
    &.dark {
      .user-wrapper {
        .action {
          color: rgba(255, 255, 255, 0.85);
          &:hover {
            background: rgba(255, 255, 255, 0.16);
          }
        }
      }
    }
  }
  &.mobile,
  &.tablet {
    .top-nav-header-index {
      .header-index-wide {
        .header-index-left {
          .trigger {
            color: rgba(255, 255, 255, 0.85);
            padding: 0 12px;
          }
          .logo.top-nav-header {
            text-align: center;
            width: 56px;
            line-height: 58px;
          }
        }
      }
      &.light {
        .header-index-wide {
          .header-index-left {
            .trigger {
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
        //
      }
    }
  }
  &.tablet {
    // overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
    .top-nav-header-index {
      .header-index-wide {
        .header-index-left {
          .logo > a {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .top-nav-header-index {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    transition: background 0.3s, width 0.2s;
    .header-index-wide {
      max-width: 1200px;
      margin: auto;
      padding-left: 0;
      display: flex;
      height: 50px;
      .ant-menu.ant-menu-horizontal {
        border: none;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        position: absolute;
        left: 50%;
        // margin-left: -108px
        margin-left: -252.5px;
      }
      .header-index-left {
        flex: 1 1;
        display: flex;
        .logo.top-nav-header {
          width: 385px;
          height: 60px;
          position: relative;
          line-height: 60px;
          transition: all 0.3s;
          overflow: hidden;
          img {
            display: inline-block;
            vertical-align: middle;
            // height: 38px;
            height: 45px;
          }
          h1 {
            color: #fff;
            display: inline-block;
            vertical-align: top;
            font-size: 16px;
            margin: 0 0 0 12px;
            font-weight: 400;
          }
        }
      }
      .header-index-right {
        float: right;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
      }
    }
    &.light {
      background-color: #fff;
      .header-index-wide {
        .header-index-left {
          .logo {
            h1 {
              // color: #002140;
              color: #fff;
            }
          }
        }
      }
    }
  }
  // 内容区
  .layout-content {
    margin: 24px 24px 0px;
    height: 100%;
    height: 64px;
    padding: 0 12px 0 0;
  }
}
.topmenu {
  .page-header-index-wide {
    max-width: 1250px;
    margin: 0 auto;
  }
}
// drawer-sider 自定义
.ant-drawer.drawer-sider {
  .sider {
    box-shadow: none;
  }
  &.dark {
    .ant-drawer-content {
      background-color: rgb(0, 21, 41);
    }
  }
  &.light {
    box-shadow: none;
    .ant-drawer-content {
      background-color: #fff;
    }
  }
  .ant-drawer-body {
    padding: 0;
  }
}
// 菜单样式
.sider {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  position: relative;
  z-index: 10;
  &.ant-fixed-sidemenu {
    position: fixed;
    height: 100%;
  }
  .logo {
    height: 64px;
    position: relative;
    line-height: 64px;
    padding-left: 24px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    background: #002140;
    overflow: hidden;
    img,
    h1 {
      display: inline-block;
      vertical-align: middle;
    }
    img {
      height: 32px;
    }
    h1 {
      color: #fff;
      font-size: 20px;
      margin: 0 0 0 12px;
      font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      font-weight: 600;
    }
  }
  &.light {
    background-color: #fff;
    box-shadow: 2px 0px 8px 0px rgba(29, 35, 41, 0.05);
    .logo {
      background: #fff;
      box-shadow: 1px 1px 0px 0px #e8e8e8;
      h1 {
        color: unset;
      }
    }
    .ant-menu-light {
      border-right-color: transparent;
    }
  }
}
// 外置的样式控制
.user-dropdown-menu-wrapper.ant-dropdown-menu {
  padding: 4px 0;
  .ant-dropdown-menu-item {
    width: 160px;
  }
  .ant-dropdown-menu-item > .anticon:first-child,
  .ant-dropdown-menu-item > a > .anticon:first-child,
  .ant-dropdown-menu-submenu-title > .anticon:first-child .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }
}
// 数据列表 样式
.table-alert {
  margin-bottom: 16px;
}
.table-page-search-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;
      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }
      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
.content {
  .table-operator {
    margin-bottom: 18px;
    button {
      margin-right: 8px;
    }
  }
}
.work-place {
  position: fixed;
  // right: 40px;
  bottom: 0px;
  // width: 400px;
  // height: 600px;
  width: 100%;
  height: 100%;
  background: #fff;
  -webkit-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  z-index: 44;
  padding-right: 23px;
  overflow-y: scroll;
  overflow-x: auto;
  iframe {
    min-height: 576px;
  }
}
.fix-right-v3 {
  position: fixed;
  right: 0;
  top: 0;
  width: 38px;
  height: 100%;
  background: #fff;
  -webkit-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  z-index: 1002;
}
.fix-right-v3 table,
.fix-right-v3 td {
  margin: 0;
  padding: 0;
  border: 0;
  border-spacing: 0;
  border-collapse: collapse;
}
.fix-right-v3 table {
  width: 100%;
  height: 100%;
}
.fix-right-v3 .sidebar-item {
  position: relative;
  margin: 7px 0;
}
dl,
dt,
dd,
ul,
ol,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.fix-right-v3 .sidebar-item {
  position: relative;
  margin: 7px 0;
}
.fix-right-v3 .mycart > a {
  height: 38px;
  line-height: 38px;
  background-position: -38px -421px;
}
.fix-right-v3 .sidebar-item > a {
  display: block;
  width: 38px;
  font-size: 0;
  /*background-image: url(img/home/sidebar_spriteV5.png?v=modifyCompare);*/
  /*background-image: -webkit-image-set(url(img/home/sidebar_spriteV5.png?v=modifyCompare) 1x, url(img/home/sidebar_spriteV5@2x.png?v=modifyCompare) 2x);*/
  overflow: hidden;
  cursor: pointer;
}
.fix-right-v3 .sidebar-line {
  width: 19px;
  height: 1px;
  margin: 7px auto;
  background: #ccc;
}
.padding-fix {
  padding: 0px 12px !important;
}
.ant-layout-footer {
  background: #6f6847 !important;
}
// .ant-btn{
  
// }
</style>