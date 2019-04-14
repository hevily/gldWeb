<template>
  <div class="page-header-index-wide">
    <notification-list :title="title"/>
  </div>
</template>

<script>
import NotificationList from '@/components/notification/NotificationList'

export default {
  name: 'Notification',
  components: {
    NotificationList
  },
  data() {
    return {
      loading: true,
      title: '消息提醒',
      mode: 1,
      dataSource: {}
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>