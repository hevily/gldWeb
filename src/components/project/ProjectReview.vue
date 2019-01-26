<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" icon="file-done" style="margin-right:15px">提交审核</a-button>
        <a-button type="default" icon="file-done">整理成果文件</a-button>
        <!-- <span style="font-size: 100px;"><my-icon type="icon-shenpitongyi"/></span> -->
        <!-- <span style="font-size: 100px;"><my-icon type="icon-shenpibutongyi"/></span> -->
        
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">1</a-col>
      <a-col :span="24">2</a-col>
    </a-row>
  </div>
</template>

<script>

import { Icon } from 'ant-design-vue'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1018467_zbasjalz32.js' // 在 iconfont.cn 上生成
})

export default {
  name: 'ProjectReview',
  props: {},
  data() {
    return {}
  },
  components:{
    MyIcon
  },
  methods: {}
}
</script>

<style>
</style>

