<template>
  <div class="contractFund">
    <a-tabs type="card">
      <a-tab-pane key="1">
        <template slot="tab">
          <div style="line-height:22px">合同总金额</div>
          <div class="fundS">{{totalMoney}}
            <span>元</span>
          </div>
        </template>
        <contract-fund-all :data="data" :total="totalMoney"/>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template slot="tab">
          <div style="line-height:22px">已开票金额</div>
          <div class="fundS">{{totalInvoice}}
            <span>元</span>
          </div>
        </template>
        <contract-fund-invoiced :data="data" :total="totalInvoice"/>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template slot="tab">
          <div style="line-height:22px">已回款金额</div>
          <div class="fundS">{{totalReceipt}}
            <span>元</span>
          </div>
        </template>
        <contract-fund-back :data="data" :total="totalReceipt"/>
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
  props: {
    data: {
      type: Array,
      default: function (value) {
        return { value }
      }
    }
  },
  components: {
    ContractFundAll,
    ContractFundBack,
    ContractFundInvoiced
  },
  data() {
    return {
      totalMoney: 0,
      totalInvoice: 0,
      totalReceipt: 0
    }
  },
  created() {
    //数据请求参数配置
    const _this = this
    this.data.forEach(ele => {
      _this.totalMoney += ele.moneys_aggregate.aggregate.sum.total || 0
      _this.totalInvoice += ele.invoices_aggregate.aggregate.sum.amount || 0
      _this.totalReceipt += ele.receipts_aggregate.aggregate.sum.amount || 0
    })
  },
  methods: {

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

