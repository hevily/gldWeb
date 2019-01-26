<template>
  <div>
    <a-modal
      :title="title"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleOk"
      :maskClosable="maskClosable"
      :width="550"
    >
      <a-row>
        <a-col :span="24">
          <div style="height:40px">
            <a-input type="text" placeholder="姓名" style="width: 74%;"/>
            <a-button type="primary" style="width: 22%;float: right;">搜索</a-button>
          </div>
          <div class="treeDiv">
            
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'ContractDialog',
  props: [],
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

