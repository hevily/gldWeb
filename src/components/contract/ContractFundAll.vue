<template>
  <div>
    <div>
      <a-button type="primary" icon="plus">添加合同款</a-button>
    </div>
    <div class="empty_all">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-money"></use>
      </svg>
      <div>
        <span>目前合同总金额为0</span>
      </div>
    </div>
  </div>
</template>
<script>


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
  fill:#cbcbcb
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
}
</style>

