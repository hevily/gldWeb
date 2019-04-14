<template>
  <div class="ProjectFundReceipts">
    <div v-if="ReceiptData.length">
      <a-table :columns="columns" :dataSource="ReceiptData" :pagination="false" bordered>

        <div slot="remark" slot-scope="text, record,index" class="remark">
          <a-input v-model="record.remark" type="text"/>
        </div>

        <div slot="amount" slot-scope="text, record,index" class="remark">
          <a-input v-model="record.amount" type="text"/>
        </div>

        <div slot="invoiceNo" slot-scope="text, record,index" class="remark">
          <a-input v-model="record.invoiceNo" type="text"/>
        </div>

        <div slot="receiptDate" slot-scope="text, record,index" class="remark">
          <a-date-picker v-if="!record.receiptDate" @change="e=> receiptDateChange(e,record)"></a-date-picker>
          <a-date-picker v-else :value="moment(record.receiptDate)" @change="e=> receiptDateChange(e,record)"></a-date-picker>
        </div>

        <div slot="receiptPerson" slot-scope="text, record,index" class="remark">
          <a-input :value="(record.receiptPerson||{}).name" type="text" readonly @click="showReceiptPerson(record)"/>
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
    <div class="empty_all" v-if="!ReceiptData.length">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-money1"></use>
      </svg>
      <div>
        <span>目前收款金额为0</span>
      </div>
    </div>
    <employeeTree :inivisible="eVisibled" :inititle="eTitle" @changeStatus="employeeChange"/>
  </div>
</template>

<script>

import { db } from '@/components/_util/db'
import { mapState } from 'vuex'
import moment from 'moment'


import employeeTree from '@/components/same/employeeTree'

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
    key: 'amount',
    scopedSlots: { customRender: 'amount' }
  },
  {
    title: '发票号',
    width: 120,
    align: 'center',
    key: 'invoiceNo',
    dataIndex: 'invoiceNo',
    scopedSlots: { customRender: 'invoiceNo' }
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



export default {
  name: 'ProjectFundReceipts',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns,
      ReceiptData:[],
      dbConn: new db(this.$apollo), //数据库操作,
      Record: {},
      eVisibled:false,
      eTitle: '添加人员',
      //   data2: [1]
    }
  },
  created() {
    this.loadData()
  },
  components: {
    employeeTree
  },
  methods: {
    moment, 
    loadData(){
      let _this = this
      var queryString = `query {
        Receipt(where:{project_id:{_eq:"${_this.projectId}"}}){
          project_id
          amount
          createdAt
          createdBy_id
          id
          invoiceNo
          no
          receiptDate
          receiptPerson_id
          receiptPerson {
            id
            name
          }
          remark
        }
      }`
       console.log(queryString)
      this.dbConn
        .query(queryString)
        .then(res => {
          _this.ReceiptData = res.data.Receipt
          
          console.log(res, 'get project Receipt and project success')
        })
        .catch(err => {
          console.log(err, 'get project Receipt and project fail')
        })
    },
    
    addRece() {
      let _this = this
      var mutationString = `mutation{
        insert_Receipt(objects:[{
          project_id:"${_this.projectId}",
          no:${_this.ReceiptData.length + 1}
        }]){
          returning{id}
        }
      }`
      this.dbConn.mutation(mutationString)
      .then(res => {
        // _this.$message.success('删除成功')
        _this.loadData()
      }).catch(err => {
        // _this.$message.error('删除失败')
      })
      // var obj = {
      //   no: '',
      //   amount: '',
      //   invoiceNo: '',
      //   receiptDate: '',
      //   receiptPerson: '',
      //   remark: ''
      // }
      // obj.no = this.data.length + 1
      // this.data.push(obj)
    },
    deleteRece(record, index) {
      console.log(record,index)
       let _this = this

      this.$confirm({
        title: '删除回款记录',
        content: `你确定删除该期回款记录？`,
        onOk() {
          var mutationString = `mutation{
            delete_Receipt(where:{id:{_eq:"${record.id}"}}){
              returning{id}
            }
          } `
          console.log(mutationString)
          _this.dbConn
            .mutation(mutationString)
            .then(res => {
              console.log(res, 'delete project Receipt')
              _this.$message.success('删除成功')
              _this.loadData()
              _this.$emit('updateTotal')
            })
            .catch(err => {
              console.log(err, 'delete project Receipt error')
            })
        },
        cancel() {}
      })
      // this.data.splice(index, 1)
      // this.data.map((ele, index) => {
      //   ele.no = index + 1
      // })
    },
    saveRece(record, index) {
        console.log(record,index)

        let _this = this
        var mutationString = `mutation{
           update_Receipt(where:{id:{_eq:"${record.id}"}},_set:{
            remark:"${record.remark || ''}"
           ${(record.receiptPerson||{}).id ? ` receiptPerson_id:"${record.receiptPerson.id}"`:''}
            invoiceNo:"${record.invoiceNo ||''}",
            ${record.receiptDate ? `receiptDate:"${record.receiptDate}",`:''}
            amount:${record.amount}
          }){returning{id}}
        }`
        console.log(mutationString)
        this.dbConn.mutation(mutationString)
        .then(res => {
          _this.$message.success('保存成功')
          _this.loadData()
          _this.$emit('updateTotal')
        }).catch(err => {
          console.log(err)
          // _this.$message.error('删除失败')
        })
    },
    showReceiptPerson(record) {
      this.Record = record
      this.eVisibled = true
    },
    employeeChange(obj){
      console.log(obj)
      if(obj.data.length){
        this.Record.receiptPerson = {
          id:obj.data[0].key,
          name:obj.data[0].title
        }
      }
      this.eVisibled = false
    },
    receiptDateChange(e,record){
      console.log(e,record)
      record.receiptDate = e.utc().format()
    }

  }
}
</script>
<style>
.ProjectFundReceipts .ant-table-thead > tr > th,
.ProjectFundReceipts .ant-table-tbody > tr > td {
  padding: 8px;
}
.ProjectFundReceipts .remark .ant-input {
  border:0
}
.ProjectFundReceipts .remark .ant-input:hover {
  box-shadow: unset
}
.ProjectFundReceipts .remark .ant-input:focus {
  box-shadow: unset
}
</style>


