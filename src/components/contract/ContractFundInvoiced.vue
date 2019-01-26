<template>
  <div>
    <div>
      <a-button type="primary" icon="plus" >添加合同款</a-button>
    </div>
    <div class="empty_all">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-form_edit_money"></use>
      </svg>
      <div>
        <span>目前还没有开票金额</span>
      </div>
    </div>
  </div>
</template>
<script>
// import { Icon } from 'ant-design-vue'
// const MyIcon = Icon.createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_1018467_38edakuhqw1.js' // 在 iconfont.cn 上生成
// })

export default {
  name: 'ContractFundAll',
  props: {},
  components: {
    // MyIcon
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style>
.icon {
  width: 4em;
  height: 4em;
  fill: #cbcbcb;
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
}
</style>

