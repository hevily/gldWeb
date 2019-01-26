<template>
  <div class="projectFund">
    <div style="line-height: 32px; margin-bottom: 10px;font-size:16px" class="font-blue">项目款项</div>
    <a-tabs type="card">
      <a-tab-pane key="1">
        <template slot="tab">
          <div style="line-height:22px">咨询费</div>
          <div class="fundS">
            123232.2
            <span>元</span>
          </div>
        </template>

        <ProjectFundMoneys />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template slot="tab">
          <div style="line-height:22px">开票金额</div>
          <div class="fundS">
            123232.2
            <span>元</span>
          </div>
        </template>
        <ProjectFundInvoiced/>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template slot="tab">
          <div style="line-height:22px">已收款金额</div>
          <div class="fundS">
            123232.2
            <span>元</span>
          </div>
        </template>
        <ProjectFundReceipts />
      </a-tab-pane>
      <a-tab-pane key="4">
        <template slot="tab">
          <div style="line-height:22px">项目绩效</div>
          <div class="fundS">
            123232.2
            <span>元</span>
          </div>
        </template>
        <ProjectFundPerformance/>
      </a-tab-pane>
      <!-- <template > -->
      <!-- </template> -->
    </a-tabs>
  </div>
</template>
<script>
import ProjectFundMoneys from '@/components/project/ProjectFundMoneys'
import ProjectFundInvoiced from '@/components/project/ProjectFundInvoiced'
import ProjectFundReceipts from '@/components/project/ProjectFundReceipts'
import ProjectFundPerformance from '@/components/project/ProjectFundPerformance'

export default {
  name: 'ProjectFund',
  props: {},
  components: {
    ProjectFundMoneys,
    ProjectFundInvoiced,
    ProjectFundReceipts,
    ProjectFundPerformance
  },
  data() {
    return {
      dfdf: 'dfdfdf/brfdfd'
    }
  }
}
</script>

<style>
.projectFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container,
.projectFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container .ant-tabs-nav-wrap {
  height: 60px;
}
.projectFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container .ant-tabs-nav-wrap .ant-tabs-nav {
  width: 100%;
}
.projectFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container .ant-tabs-nav-wrap .ant-tabs-tab {
  padding-top: 9px;
  height: 60px;
  width: 25%;
  text-align: center;
}
.fundS {
  color: #fa8564;
  line-height: 22px;
  font-size: 18px;
}
</style>

