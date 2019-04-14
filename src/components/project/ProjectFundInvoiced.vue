<template>
  <div class="showInvoiceDetail">
    <div class="add-invoice">
      <a-button type="primary" icon="plus" @click="showInvoiceDialog">开票登记</a-button>
    </div>
    <div v-if="invoiceData.length">
      <a-table
        bordered
        :columns="columns"
        :dataSource="invoiceData"
        :pagination="false"
        class="showInvoiceDetailTable"
      >
        <template slot="issueOffice" slot-scope="text,record,index">
          <a class="block ellipsis" :style="{width:'170px'}" :title="text" @click="editInvoice(record.id)">{{text}}</a>
        </template>
        <template slot="action" slot-scope="text,record,index">
          <a @click="deleteInvoice(record)">
            <a-icon type="delete"/>
          </a>
        </template>
      </a-table>
    </div>
    <div class="empty_all" v-else>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-form_edit_money"></use>
      </svg>
      <div>
        <span>目前还没有开票金额</span>
      </div>
    </div>
    <ProjectInvoices
      :iVisibled="iVisibled"
      :iTitle="iTitle"
      :projectId="projectId"
      :invoiceId="invoiceId"
      @invoicesSave="invoicesSave"
      @invoicesCancel="invoicesCancel"
    />
  </div>
</template>
<script>
import ProjectInvoices from '@/components/dialog/project/ProjectInvoices'
import { db } from '@/components/_util/db'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'ProjectFundInvoiced',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  components: {
    // MyIcon
    ProjectInvoices
  },
  created() {
    this.loadData()
  },
  data() {
    return {
      iVisibled: false,
      iTitle: '添加开票登记',
      invoiceId: '', //编辑记录id
      invoiceData: [], //开票记录
      dbConn: new db(this.$apollo), //数据库操作,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 70,
          align: 'center',
          scopedSlots: { customRender: 'index' },
          customRender: (text, record, index) => index + 1
        },
        {
          title: '开票日期',
          dataIndex: 'createdAt',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'createdAt' },
          customRender: (text, record) => this.moment(record.createdAt).format('YYYY-MM-DD')
        },
        {
          title: '开票单位',
          dataIndex: 'issueOffice',
          align: 'center',
          scopedSlots: { customRender: 'issueOffice' }
        },
        {
          title: '帐号',
          dataIndex: 'client',
          align: 'center',
          scopedSlots: { customRender: 'client' },
          customRender: (text, record) => record.client.account
        },
        {
          title: '开票金额（元）',
          dataIndex: 'amount',
          align: 'center',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '登记人',
          dataIndex: 'createdBy',
          align: 'center',
          scopedSlots: { customRender: 'createdBy' },
          customRender: (text, record) => (record.createdBy||{}).name
        },
        {
          title: '开票人',
          dataIndex: 'invoicePerson',
          align: 'center',
          scopedSlots: { customRender: 'invoicePerson' },
          customRender: (text, record) => record.invoicePerson.name
        },
        {
          title: '发票号',
          dataIndex: 'invoiceNo',
          align: 'center',
          scopedSlots: { customRender: 'invoiceNo' }
        },
        {
          title: '开票情况',
          dataIndex: 'invoiceStatus',
          align: 'center',
          scopedSlots: { customRender: 'invoiceStatus' }
        },
        {
          title: '附件',
          dataIndex: 'fileUrl',
          align: 'center',
          scopedSlots: { customRender: 'fileUrl' }
        },
        {
          title: '',
          dataIndex: 'action',
          align: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    moment,
    loadData() {
      var _this = this

      var queryString = `query {
        Invoice(where:{project_id:{_eq:"${this.projectId}"}}){
          invoiceNo
          amount
          id
          client{
            taxNumber
            account
            licenseAddress
            licenseName
            bankName
            name
            id
          }
          remark
          issueOffice
          createdAt
          project_id
          invoicePerson_id
          invoicePerson{
            id
            name
          }
          fileUrl
          createdBy{
            id
            name
          }
        }
        
      }`

      this.dbConn
        .query(queryString)
        .then(res => {
          _this.invoiceData = res.data.Invoice

          console.log(res, 'get project invoice and project success')
        })
        .catch(err => {
          console.log(err, 'get project invoice and project fail')
        })
    },
    //确认添加开票登记
    invoicesSave() {
      this.iVisibled = false
      this.loadData()
      console.log('updateTotal')
      this.$emit('updateTotal')
    },
    //取消添加开票登记
    invoicesCancel() {
      this.iVisibled = false
    },
    showInvoiceDialog() {
      this.invoiceId = ''
      this.iVisibled = true
    },
    editInvoice(id){
      console.log(id)
      this.invoiceId = id
      this.iVisibled = true
    },
    //删除开票记录
    deleteInvoice(record){
      let _this = this
      this.$confirm({
        title: '删除开票记录',
        content: `你确定该删除开票记录吗？`,
        onOk() {
          // console.log('拒绝任务', record)
          _this.deleteInvoiceSuccess(record)
        },
        onCancel() {}
      })
    },
    //确认删除
    deleteInvoiceSuccess(record){
      let _this = this
      let mutationString = `mutation {
        delete_Invoice(where:{id:{_eq:"${record.id}"}}){returning {id}}
      }`
      this.dbConn.mutation(mutationString)
      .then(res => {
        _this.$message.success('删除成功')
        _this.loadData()
        _this.$emit('updateTotal')
      }).catch(err => {
        _this.$message.error('删除失败')
      })
      console.log(record,'deleteInvoiceSuccess')
    }
  }
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
.showInvoiceDetail {
  padding: 10px;
}
.showInvoiceDetail .add-invoice {
  margin-bottom: 10px;
}
.showInvoiceDetail .block {
  display: block;
}
.showInvoiceDetail .ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.showInvoiceDetail .showInvoiceDetailTable .ant-table-thead > tr > th,
.showInvoiceDetail .showInvoiceDetailTable .ant-table-tbody > tr > td {
  padding: 8px;
}
</style>

