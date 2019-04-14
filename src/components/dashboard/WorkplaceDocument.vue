<template>
  <div style="overflow: auto;">
    <div style="min-width:1150px;    overflow: auto;height:508px">
      <projectDoc :projectId="projectId"/>
    </div>
    <!-- <div>
      <a-button type="primary" icon="plus">添加合同款</a-button>
    </div>
    <div class="empty_all">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-money"></use>
      </svg>
      <div>
        <span>目前合同总金额为0</span>
      </div>
    </div> -->
  </div>
</template>
<script>
import projectDoc from '@/components/project/ProjectDoc'

export default {
  name: 'WorkplaceDocument',
  props: {
    projectId: {
      type:String,
      default:'',
    }
  },
  components: {
    // MyIcon
    projectDoc
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style>
/* .icon {
  width: 4em;
  height: 4em;
  fill:#cbcbcb
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
} */
</style>

