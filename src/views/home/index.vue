<template>
  <div class="page-header-index-wide" :style="{margin: 0}">
    <homeDetail/>
  </div>
</template>

<script>
// import ContractList from '@/components/contract/ContractList'
import homeDetail from '@/components/home/homeDetail'
// import {db} from '@/utils/db'

export default {
  name: 'Analysis',
  components: {
    // ContractList,
    homeDetail
  },
  data() {
    return {
    
    }
  },
  async created() {
    
  }
}
</script>

<style lang="scss" scoped>
</style>