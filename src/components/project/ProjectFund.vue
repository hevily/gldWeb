<template>
  <div class="projectFund">
    <div style="line-height: 32px; margin-bottom: 10px;font-size:16px" class="font-blue">项目款项</div>
    <a-tabs type="card" @change="tabChange" @tabClick="tabClick">
      <a-tab-pane key="1">
        <template slot="tab">
          <div style="line-height:22px">咨询费</div>
          <div class="fundS">
            {{totalMoney}}
            <span>元</span>
          </div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template slot="tab">
          <div style="line-height:22px">开票金额</div>
          <div class="fundS">
            {{totalInvoice}}
            <span>元</span>
          </div>
        </template>
        <!-- <ProjectFundInvoiced/> -->
      </a-tab-pane>
      <a-tab-pane key="3">
        <template slot="tab">
          <div style="line-height:22px">已收款金额</div>
          <div class="fundS">
            {{totalReceipt}}
            <span>元</span>
          </div>
        </template>
        <!-- <ProjectFundReceipts/> -->
      </a-tab-pane>
      <a-tab-pane key="4">
        <template slot="tab">
          <div style="line-height:22px">项目绩效</div>
          <div class="fundS">
            {{totalPerformances}}
            <span>元</span>
          </div>
        </template>
        <!-- <ProjectFundPerformance/> -->
      </a-tab-pane>
      <!-- <template > -->
      <!-- </template> -->
    </a-tabs>

    <ProjectFundMoneys :projectId="projectId" v-if="activeTab == 1" @updateTotal="loadData"/>
    <ProjectFundInvoiced :projectId="projectId" v-else-if="activeTab == 2" @updateTotal="loadData"/>
    <ProjectFundReceipts :projectId="projectId" v-else-if="activeTab == 3" @updateTotal="loadData"/>
    <ProjectFundPerformance
      :projectId="projectId"
      v-else-if="activeTab == 4"
      @updateTotal="loadData"
      :money="totalMoney"
      :urgentStatus="urgentStatus"
      :accountingDate="accountingDate"
    />
  </div>
</template>
<script>
import ProjectFundMoneys from '@/components/project/ProjectFundMoneys'
import ProjectFundInvoiced from '@/components/project/ProjectFundInvoiced'
import ProjectFundReceipts from '@/components/project/ProjectFundReceipts'
import ProjectFundPerformance from '@/components/project/ProjectFundPerformance'
import { METHODS } from 'http'

import { db } from '@/components/_util/db'

export default {
  name: 'ProjectFund',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  components: {
    ProjectFundMoneys,
    ProjectFundInvoiced,
    ProjectFundReceipts,
    ProjectFundPerformance
  },
  data() {
    return {
      // dfdf: 'dfdfdf/brfdfd',
      activeTab: '1',
      totalMoney: 0,
      totalInvoice: 0,
      totalReceipt: 0,
      totalPerformances: 0,
      dbConn: new db(this.$apollo), //数据库操作,
      urgentStatus: 0,
      accountingDate: ''
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      let _this = this
      let mutationString = `query {
        Project(where:{id:{_eq:"${this.projectId}"}}) {
          id
          name
          urgentStatus
          accountingDate
          moneys {
            id
            feeStandard
            feeName
            feeItem
            total
          }
          invoices {
            id
            client {
              name
              account
            }
            invoiceNo
            issueOffice
            amount
            fileUrl
            invoicePerson {
              name
            }
            createdBy {
              name
            }
            createdAt
          }
          receipts {
            id
            no
            amount
            receiptPerson {
              name
            }
            createdAt
            remark
          }
          moneys_aggregate {
            aggregate {
              sum {
                total
              }
            }
          }
          invoices_aggregate {
            aggregate {
              sum {
                amount
              }
            }
          }
          receipts_aggregate {
            aggregate {
              sum {
                amount
              }
            }
          }
          performances_aggregate {
            aggregate {
              sum {
                total
              }
            }
          }
        }
      }`
      // console.log(mutationString)
      this.dbConn.query(mutationString).then(res => {
        console.log(res, 'all total ')
        _this.urgentStatus = res.data.Project[0].urgentStatus
        _this.accountingDate = res.data.Project[0].accountingDate
        _this.totalMoney = res.data.Project[0].moneys_aggregate.aggregate.sum.total || 0
        _this.totalInvoice = res.data.Project[0].invoices_aggregate.aggregate.sum.amount || 0
        _this.totalReceipt = res.data.Project[0].receipts_aggregate.aggregate.sum.amount || 0
        _this.totalPerformances = res.data.Project[0].performances_aggregate.aggregate.sum.total || 0
      })
    },
    tabChange(activeKey) {
      this.activeTab = activeKey
    },
    tabClick() {}
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

