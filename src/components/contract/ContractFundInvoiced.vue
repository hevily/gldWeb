<template>
  <div>
    <!--<div>-->
      <!--<a-button type="primary" icon="plus" >添加合同款</a-button>-->
    <!--</div>-->
    <div class="empty_all" v-if="current.length === 0">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-form_edit_money"></use>
      </svg>
      <div>
        <span>目前还没有开票金额</span>
      </div>
    </div>
    <div class="invoiced" v-else>
      <a-table
        :size="size"
        :bordered="bordered"
        :loading="loading"
        :columns="columns"
        :dataSource="current"
        :rowKey="record => record.id"
        :pagination="pagination"
      >
      </a-table>
    </div>
  </div>
</template>
<script>

import moment from 'moment'

export default {
  name: 'ContractFundAll',
  props: {
    data: {
      type: Array,
      default: function (value) {
        return { value }
      }
    },
    total: {
      type: Number,
      default: function (value) {
        return { value }
      }
    },
    bordered: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    rowKey: {
      type: String,
      default: 'no'
    },
    pagination: {
      type: Boolean,
      default: false
    },
  },
  components: {
    // MyIcon
  },
  created(){
    console.log(this.data)
    const _this = this
    let no = 1
    this.data.forEach(project => {
      project.invoices.forEach(invoice => {
        invoice.projectName = project.name
        invoice.no = no++
      })
      _this.current = [..._this.current, ...project.invoices]
    })
    this.loading = false
  },
  data() {
    return {
      loading: true, //加载动态
      current: [],
      columns: [
        {
          title: '序号',
          width: 50,
          dataIndex: 'no'
        },
        {
          title: '开票日期',
          width: 120,
          align: 'center',
          dataIndex: 'createdAt',
          key: 'createdAt',
          customRender: (value) => {
            var d = ''
            if (value) {
              d = moment(value).format('YYYY-MM-DD')
            }
            return {
              children: d,
              attrs: {}
            }
          }
        },
        {
          title: '开票单位',
          width: 150,
          align: 'issueOffice',
          dataIndex: 'issueOffice'
        },
        {
          title: '账号',
          width: 150,
          dataIndex: 'client.account'
        },
        {
          title: '开票金额',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: '登记人',
          width: 100,
          dataIndex: 'createdBy.name',
          key: 'createdBy.name'
        },
        {
          title: '开票人',
          width: 60,
          dataIndex: 'invoicePerson.name',
          key: 'invoicePerson.name'
        },
        {
          title: '发票号',
          dataIndex: 'invoiceNo',
          key: 'invoiceNo'
        },
        {
          title: '对应项目',
          width: 120,
          dataIndex: 'projectName',
          key: 'projectName'
        },
        {
          title: '附件',
          dataIndex: 'fileUrl'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '100px',
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'action' }
        // }
      ]
    }
  },
  methods: {}
}
</script>
<style>
.icon {
  width: 4em;
  height: 4em;
  fill: #cbcbcb;
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
}
.invoiced {
  padding-bottom: 20px;
}
</style>

