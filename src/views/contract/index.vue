<template>
  <div class="page-header-index-wide">
    <contract-list :title="title" @changeCom="replaceModule" v-if="moduleType == 1"/>
    <contract-detail
      :title="title"
      :moduleType="moduleType"
      :tapType="tapType"
      @changeCom="replaceModule"
      v-else
    />
  </div>
</template>

<script>
import ContractList from '@/components/contract/ContractList'
import ContractDetail from '@/components/contract/ContractDetail'

export default {
  name: 'Analysis',
  components: {
    ContractList,
    ContractDetail
  },
  data() {
    return {
      loading: true,
      moduleType: 1,
      title: '合同管理',
      tapType: 1
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    replaceModule(param) {
      this.moduleType = param.type
      switch (param.type) {
        case 1:
          this.title = '合同管理'
          break
        case 2:
          this.title = '普通合同'
          break
        case 3:
          this.title = '框架合同'
          break
        case 4:
          this.title = '框架子合同'
          break
        case 5:
          this.title = param.name
      }

      // if (param.type == 1) {
      //   //合同列表
      // } else {
      //   param.type == 2
      // }
      console.log(param)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>