<template>
  <div class="page-header-index-wide">
    <project-list :title="title" @changeCom="replaceModule" v-if="moduleType == 1"/>
    <project-detail
      :title="title"
      :moduleType="moduleType"
      :tapType="tapType"
      @changeCom="replaceModule"
      v-else
    />
  </div>
</template>

<script>
import ProjectList from '@/components/project/ProjectList'
import ProjectDetail from '@/components/project/ProjectDetail'

export default {
  name: 'Analysis',
  components: {
    ProjectList,
    ProjectDetail
  },
  data() {
    return {
      loading: true,
      moduleType: 1,
      title: '项目管理',
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
          this.title = '项目管理'
          break
        case 2:
          this.title = '创建项目'
          break
        // case 3:
        //   this.title = '框架合同'
        //   break
        // case 4:
        //   this.title = '框架子合同'
        //   break
        case 5:
          this.title = param.name
      }
      console.log(param)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>