<template>
  <div class="page-header-index-wide">
    <keep-alive include="contract-list">
      <contract-list :title="title" @changeCom="replaceModule" v-if="moduleType === 1"/>
      <contract-detail
        :title="title"
        :moduleType="moduleType"
        :mode="mode"
        :catalog="catalog"
        :contractId="contractId"
        :dataSource="dataSource"
        :data="data"
        :activeKey="activeKey"
        @changeCom="replaceModule"
        v-else
      />
    </keep-alive>
  </div>
</template>

<script>
import ContractList from '@/components/contract/ContractList'
import ContractDetail from '@/components/contract/ContractDetail'
import { db } from '@/utils/db'

export default {
  name: 'Analysis',
  components: {
    ContractList,
    ContractDetail
  },
  data() {
    return {
      loading: true,
      dbConn: new db(this.$apollo),
      moduleType: 1,
      title: '合同管理',
      mode: 1,
      contractId: '',
      catalog: 0,
      dataSource: {}
    }
  },
  async created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    // debugger
    if (this.$route.query.contractId) {
      let contractId = this.$route.query.contractId
      var queryString = `query {
        Contract(where:{id:{_eq:"${contractId}"}}){
          id
          isFavorite
          contractNo
          businessType
          catalog
          name
          client {
            id
            name
            address {
              id
              province
              city
              district
              address
            }
          }
          principal {
            name
          }
          status
          signDate
          projects {
            id
            name
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
          }
          scans {
            id
            name
            url
          }
          contracts {
            id
            isFavorite
            contractNo
            businessType
            catalog
            name
            client {
              id
              name
              address {
                id
                province
                city
                district
                address
              }
            }
            principal {
              name
            }
            status
            signDate
            projects {
              id
              name
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
            }
            scans {
              id
              name
              url
            }
          }
        }
      }`
      console.log(queryString)
      let res = await this.dbConn.query(queryString)
      let data = res.data.Contract[0]
      this.replaceModule({
        type: 5,
        id: contractId,
        name: this.$route.query.name,
        activeKey: '1',
        catalog: data.catalog,
        data: data
      })
    }
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
          this.mode = 1
          this.catalog = 0
          this.activeKey = param.activeKey
          break
        case 3:
          this.title = '框架合同'
          this.mode = 1
          this.catalog = 1
          this.activeKey = param.activeKey
          break
        case 4:
          this.title = '框架子合同'
          this.contractId = param.id
          this.mode = 1
          this.catalog = 2
          this.dataSource = param
          this.activeKey = param.activeKey
          break
        case 5:
          this.title = param.name
          this.contractId = param.id
          this.mode = 2
          this.catalog = param.catalog
          this.data = param.data
          this.activeKey = param.activeKey
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