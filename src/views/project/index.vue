<template>
  <div class="page-header-index-wide">
    <keep-alive include="project-list">
      <project-list
        :title="title"
        :moduleType="moduleType"
        @changeCom="replaceModule"
        v-if="moduleType == 1"
      />

      <project-detail
        :title="title"
        :moduleType="moduleType"
        :tapType="tapType"
        :projectId="projectId"
        @changeCom="replaceModule"
        v-else
      />
    </keep-alive>
  </div>
</template>

<script>
import ProjectList from '@/components/project/ProjectList'
import ProjectDetail from '@/components/project/ProjectDetail'
import { createECDH } from 'crypto'

export default {
  name: 'Analysis',
  components: {
    ProjectList,
    ProjectDetail
  },
  data() {
    return {
      loading: true,
      moduleType: 1, //1项目列表、2项目详情
      title: '项目管理',
      tapType: 1, //项目详情的默认标签页
      projectId: '' //项目ID
    }
  },
  created(e) {
    console.log(this.$route.query, 'create')
    if (this.$route.query.projectId) {
      this.replaceModule({
        type: 5,
        params: {
          id: this.$route.query.projectId,
          name: this.$route.query.name
        },
        tapType: this.$route.query.type
      })
    }
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    replaceModule(param) {
      // debugger
      this.moduleType = param.type
      this.tapType = String(param.tapType || 1)
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
          this.title = param.params.name
          this.projectId = param.params.id
      }
      console.log(param)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>