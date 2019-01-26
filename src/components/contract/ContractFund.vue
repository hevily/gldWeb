<template>
  <div class="contractFund">
    <a-tabs type="card">
      <a-tab-pane key="1">
        <template slot="tab">
          <div style="line-height:22px">合同总金额</div>
          <div class="fundS">123232.2
            <span>元</span>
          </div>
        </template>

        <contract-fund-all/>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template slot="tab">
          <div style="line-height:22px">已开票金额</div>
          <div class="fundS">123232.2
            <span>元</span>
          </div>
        </template>
        <contract-fund-invoiced/>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template slot="tab">
          <div style="line-height:22px">已回款金额</div>
          <div class="fundS">123232.2
            <span>元</span>
          </div>
        </template>
        <contract-fund-back/>
      </a-tab-pane>

      <!-- <template > -->
      <!-- </template> -->
    </a-tabs>
  </div>
</template>
<script>
import ContractFundAll from '@/components/contract/ContractFundAll'
import ContractFundBack from '@/components/contract/ContractFundBack'
import ContractFundInvoiced from '@/components/contract/ContractFundInvoiced'

export default {
  name: 'ContractFund',
  props: {},
  components: {
    ContractFundAll,
    ContractFundBack,
    ContractFundInvoiced
  },
  data() {
    return {
      dfdf: 'dfdfdf/brfdfd'
    }
  }
}
</script>

<style>
.contractFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container,
.contractFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container .ant-tabs-nav-wrap {
  height: 60px;
}
.contractFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container .ant-tabs-nav-wrap .ant-tabs-nav {
  width: 100%;
}
.contractFund .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container .ant-tabs-nav-wrap .ant-tabs-tab {
  padding-top: 9px;
  height: 60px;
  width: 33.333%;
  text-align: center;
}
.fundS {
  color: #fa8564;
  line-height: 22px;
  font-size: 18px;
}
</style>

