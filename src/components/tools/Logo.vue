<template>
  <div class="logo">
    <router-link :to="{name:'home'}">
      <img src="~@/assets/logo.png" alt="logo">
      <!-- <router-link to="/home"> -->
      <h1 v-if="showTitle">{{ title }}</h1>
      <!-- </router-link> -->
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Logo',
    props: {
      title: {
        type: String,
        default: '咨询微平台',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>