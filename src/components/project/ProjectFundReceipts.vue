<template>
  <div class="ProjectFundReceipts">
    <div v-if="data.length">
      <a-table :columns="columns" :dataSource="data" :pagination="false" bordered>
        <div slot="remark" slot-scope="text, record,index" class="remark">
          <a-input :value="text? text:'备注'" type="text"/>
        </div>
        <div slot="action" slot-scope="text, record,index" :style="{textAlign:'left'}">
          <span
            :style="{padding:'4px',cursor:'pointer',color:'#999'}"
            title="保存"
            @click="saveRece(record,index)"
          >
            <a-icon type="save"/>
          </span>
          <span
            :style="{padding:'4px',cursor:'pointer',color:'#999'}"
            title="删除"
            @click="deleteRece(record,index)"
          >
            <a-icon type="delete"/>
          </span>
        </div>
      </a-table>
    </div>
    <div style="margin-top:10px">
      <a class="font-blue" @click="addRece">
        <a-icon type="plus"/>回款记录
      </a>
    </div>
    <div class="empty_all" v-if="!data.length">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-money1"></use>
      </svg>
      <div>
        <span>目前收款金额为0</span>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '期数',
    width: 120,
    align: 'center',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: '实收金额（元）',
    width: 120,
    align: 'center',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: '发票号',
    width: 120,
    align: 'center',
    key: 'invoiceNo',
    dataIndex: 'invoiceNo'
  },
  {
    title: '实收日期',
    width: 120,
    align: 'center',
    key: 'receiptDate',
    dataIndex: 'receiptDate',
    scopedSlots: { customRender: 'receiptDate' }
  },
  {
    title: '收款人',
    width: 120,
    align: 'center',
    key: 'receiptPerson',
    dataIndex: 'receiptPerson',
    scopedSlots: { customRender: 'receiptPerson' }
  },
  {
    title: '备注',
    width: 120,
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    width: 120,
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    no: '1',
    amount: '1233',
    invoiceNo: '1232',
    receiptDate: '212',
    receiptPerson: '11',
    remark: '121'
  }
]

export default {
  name: 'ProjectFundReceipts',
  props: {},
  data() {
    return {
      columns,
      data
      //   data2: [1]
    }
  },
  methods: {
    addRece() {
      var obj = {
        no: '',
        amount: '',
        invoiceNo: '',
        receiptDate: '',
        receiptPerson: '',
        remark: ''
      }
      obj.no = this.data.length + 1
      this.data.push(obj)
    },
    deleteRece(record, index) {
      this.data.splice(index, 1)
      this.data.map((ele, index) => {
        ele.no = index + 1
      })
    },
    saveRece(record, index) {
        console.log(record,index)
    }
  }
}
</script>
<style>
.ProjectFundReceipts .ant-table-thead > tr > th,
.ProjectFundReceipts .ant-table-tbody > tr > td {
  padding: 8px 16px;
}
</style>


