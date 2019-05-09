<template>
  <div class="user-wrapper">
    <!-- <span class="action">
      <a-icon type="question-circle-o"></a-icon>
      消息提醒
    </span>-->
    <span class="header-notice">
      <router-link :to="{ name: 'notification' }" class="notification">
        <a-badge
          :count="notiCount"
          :overflowCount="99"
          :offset="[0, 3]"
          :numberStyle="{height: '18px',lineHeight: '18px', boxShadow: '0 0 0 0 #f5222d', padding: '0 6px'}"
        >
          <a-icon style="font-size: 18px; padding: 4px" type="bell"/>
        </a-badge>
        <span>消息提醒</span>
      </router-link>
    </span>
    <!-- <header-notice class="action"/> -->
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="avatar()"/>
        <span>{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper" @click="showUser">
        <!-- <a-menu-item key="0">
          <router-link :to="{ name: 'center' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>-->
        <a-menu-item key="2">
          <!-- <router-link :to="{ name: 'settings' }"> -->
          <a-icon type="user"/>
          <span>个人中心</span>
          <!-- </router-link> -->
        </a-menu-item>
        <a-menu-item key="1" v-if="$auth('system')">
          <router-link :to="{ name: 'settings' }">
            <a-icon type="setting"/>
            <span>系统设置</span>
          </router-link>
        </a-menu-item>
        <!--<a-menu-item key="2" disabled>-->
        <!--<a-icon type="setting"/>-->
        <!--<span>测试</span>-->
        <!--</a-menu-item>-->
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <UserSettingDialog
      :uVisible="uVisible"
      :uTitle="uTitle"
      :userId="userInfo.id"
      @userCancel="userCancel"
      @userSave="userSave"
    />
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'

import UserSettingDialog from '@/components/dialog/account/setting/UserSettingDialog'

import { mapActions, mapGetters } from 'vuex'
import gql from 'graphql-tag'
import { mapState } from 'vuex'
import { db } from '@/utils/db'
import moment from 'moment'

export default {
  name: 'UserMenu',
  components: {
    HeaderNotice,
    UserSettingDialog
  },
  data() {
    return {
      notiCount: 0,
      dbConn: new db(this.$apollo),
      interval: null,
      uVisible: false,
      uTitle: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    this.setTimeoutUpdate()
    console.log('create usermenu---------------------------------')
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    console.log('destroyed usermenu---------------------------------')
  },
  mounted() {
    // 更新消息提醒计数
    this.updateCount()
  },
  methods: {
    moment,
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    updateCount() {
      const _this = this
      const subQuery = gql`subscription {
            Notification_aggregate(
              where: {
                recipients: {
                  recipient_id: { _eq: "${this.userInfo.id}" }
                  status: { _eq: 0 }
                }
              }
            ) {
              aggregate {
                count
              }
            }
          }`

      const observer = this.$apollo.subscribe({
        query: subQuery,
        variables: {}
      })

      observer.subscribe({
        next(data) {
          console.log(data)
          if (data.data) {
            _this.notiCount = data.data.Notification_aggregate.aggregate.count
          }
        },
        error(error) {
          console.error(error)
        }
      })
    },

    setTimeoutUpdate() {
      console.log('this.settimeoutupdate')
      let _this = this
      if (this.interval) {
        clearInterval(this.interval)
      }
      _this.updateOnline()
      this.interval = setInterval(function() {
        console.log('this.settimeoutupdated')
        _this.updateOnline()
        // _this.setTimeoutUpdate()
      }, 30000)
    },
    async updateOnline() {
      var update = `mutation {
          update_Employee(where:{id:{_eq:"${this.userInfo.id}"}},_set:{onlineTime:"${this.moment()
        .utc()
        .format()}"}){
            returning {id}
          }
        }`
      console.log(update)
      let res = await this.$apollo.mutate({
        mutation: gql`
          ${update}
        `
      })
      // let res = await this.dbConn.mutation(update)
    },
    showUser(e) {
      console.log(e,'showuser')
      if(e.key == 2){
         this.uVisible = true
      }
     
    },
    userCancel(){
      this.uVisible = false
    },
    userSave() {
      this.uVisible = false
    }
  }
}
</script>

<style scoped>
.notification {
  /* color: #c3dcf9; */
  color: #fff
}
.user-wrapper .user-dropdown-menu {
  color: #fff
}
</style>