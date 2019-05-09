<template>
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <a-layout-header
    v-if="!headerBarFixed"
    :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
    :style="{ 'padding': '0','height': device === 'mobile' ? '50px':'100px' }"
  >
    <!-- 侧边栏导航 -->
    <div v-if="mode === 'sidemenu'" class="header">
      <a-icon
        v-if="device==='mobile'"
        class="trigger"
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        @click="toggle"
      ></a-icon>
      <a-icon
        v-else
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggle"
      />

      <user-menu></user-menu>
    </div>

    <!-- 顶部栏导航 -->
    <div v-else :class="['top-nav-header-index', theme]">
      <div class="header-index-wide linear">
        <div class="header-index-left">
          <logo class="top-nav-header" :show-title="device !== 'mobile'"/>

          <a-icon
            v-if="device === 'mobile'"
            class="trigger"
            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
            @click="toggle"
          ></a-icon>
        </div>
        <user-menu class="header-index-right"></user-menu>
      </div>
      <div class="header-index-wide">
        <s-menu
          class="custom-menu"
          v-if="device !== 'mobile'"
          mode="horizontal"
          :menu="menus"
          :theme="theme"
          @click="onClick"
          @select="onSelect"
        ></s-menu>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../menu/'
import Logo from '../tools/Logo'

import { mixin } from '@/utils/mixin.js'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo
  },
  mixins: [mixin],
  inject: ['reload'],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data() {
    return {
      headerBarFixed: false
      // deHeight: '50px'
    }
  },
  mounted() {
    // this.deHeight = this.
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (this.autoHideHeader) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 100) {
          this.headerBarFixed = true
        } else {
          this.headerBarFixed = false
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle() {
      this.$emit('toggle')
    },
    //点击菜单
    onClick(obj) {
      // console.log(obj.key)
      this.reload() //刷新页面
    },
    //选择菜单
    onSelect() {
      // console.log('click223')
    }
  }
}
</script>

<style >
.top-nav-header-index .header-index-wide {
  background: -webkit-linear-gradient(left, #978342, #d2cb9d, #978342, #d2cb9d); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #978342, #d2cb9d, #978342, #d2cb9d); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #978342, #d2cb9d, #978342, #d2cb9d); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #978342, #d2cb9d, #978342, #d2cb9d); /* 标准的语法 */
}
.top-nav-header-index .header-index-wide .custom-menu {
  background: unset;
}


.top-nav-header-index .header-index-wide .custom-menu .ant-menu-item {
  background: #d8b664;
  border-bottom: 0;
  top: 0;
  margin-right: 5px;
  border-radius: 5px 5px 0px 0px;
  line-height: 40px;
  /* text-shadow: -1px -1px 1px #000, 1px 1px 1px #fff !important; */
  box-shadow:0 0 6px #d2cb9d;
  line-height: 30px
  /* padding-top: 1px;
  padding-bottom:1px; */
  /* padding-left: 12px; */
  /* padding-right: 12px; */
  /* box-shadow: inset 0 -4px 0 #d8b664; */
}
.top-nav-header-index .header-index-wide .custom-menu .ant-menu-item a{
  color: #fff
}

.top-nav-header-index .header-index-wide .custom-menu .ant-menu-item-selected,
.top-nav-header-index .header-index-wide .custom-menu .ant-menu-item-active {
  background: #e8a427;
  box-shadow: 0 0 6px #978342
}
.top-nav-header-index .header-index-wide .custom-menu .ant-menu-item-selected a ,
.top-nav-header-index .header-index-wide .custom-menu .ant-menu-item-active a{
  color:#211707
}

</style>