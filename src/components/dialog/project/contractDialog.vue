<template>
  <div>
    <a-modal
      :title="title"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleOk"
      :maskClosable="maskClosable"
      :width="750"
    >
      <a-row>
        <a-col :span="24">
          <a-row>
            <a-col :span="16">
              <div style="height:40px">
                <a-input type="text" placeholder="合同名称、合同编号、委托人" style="width: 74%;" v-model="searchValue"/>
                <a-button type="primary" style="width: 22%;float: right;" @click="search">搜索</a-button>
              </div>
            </a-col>
          </a-row>

          <div>
            <a-radio-group @change="onChange" v-model="value">
              <a-table
                size="small"
                :bordered="true"
                :columns="columns"
                :dataSource="contractData"
                :pagination="pagination"
              >
                <div slot="contractId" slot-scope="text,record,index">
                  <a-radio :value="index"></a-radio>
                </div>
                <div slot="name" slot-scope="text,record,index" :title="text" class="ellipsis-name">{{text}}</div>
                <div slot="client" slot-scope="text,record,index">{{(record.client||{}).name}}</div>
              </a-table>
            </a-radio-group>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import { db } from '@/components/_util/db'

export default {
  name: 'ContractDialog',
  props: {
    inititle: {
      type: String,
      default: ''
    },
    inivisible: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      //点击蒙层是否允许关闭
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      value: 1,
      searchValue: '', //搜索值
      whereString: '', //条件
      // pageSizeOptions: ['10', '20', '30'],
      total: 0,
      currentPageSize: 10 , //表格页的列数
      defaultCurrent: 1, //表格当前页
      pagination: {}, //分页参数
      contractData: [],
      
      dbConn: new db(this.$apollo), //数据库操作
      columns: [
        {
          dataIndex: 'id',
          scopedSlots: { customRender: 'contractId' }
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo',
          width: '200px',
          scopedSlots: { customRender: 'contractNo' }
        },
        {
          title: '合同名称',
          dataIndex: 'name',
          width: '350px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '委托人',
          dataIndex: 'client',
          width: '350px',
          scopedSlots: { customRender: 'client' }
        }
      ]
    }
  },
  created() {
    // this.loadData()
  },
  methods: {
    handleOk() {
      var data = this.contractData[this.value]
      this.$emit('changeStatus', { visibled: false, data: data })
    },
    cancel() {
      this.$emit('changeStatus', { visibled: false })
    },
    onChange(e) {
      console.log('radio checked', e.target.value)
    },
    //加载合同数据
    loadData() {
      var _this = this
      var queryString = `query {
        Contract_aggregate(where: {${_this.whereString}}){
          aggregate{
            count
          }
        }
        Contract(where:{${this.whereString}},order_by:[{contractNo:asc}]) {
          id
          name 
          contractNo
          client {
            id
            name
            address {
              province
              city
              district
              address
            }
          }
        }
      }`
      this.dbConn
        .query(queryString)
        .then(res => {
          console.log(res, 'get Contract')
           _this.total = res.data.Contract_aggregate.aggregate.count
          _this.contractData = res.data.Contract
           _this.pagination = _this.pager()
        })
        .catch(err => {
          console.log(err, 'get Contract error')
        })
        
       
    },
    search() {
      // console.log(e)
      if (!this.searchValue) {
        this.whereString = ``
        return
      }
      this.whereString = `_or:[
        {contractNo:{_like:"%${this.searchValue}%"}},
        {name:{_like:"%${this.searchValue}%"}},
        {client:{name:{_like:"%${this.searchValue}%"}}}
      ]`
      this.loadData()
    },
    //分页
    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        // showSizeChanger: true,
        // pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent,
        onChange: this.onPagerChange,
        // onShowSizeChange: this.onPagerSizeChange
      }
    },
    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      this.currentPageSize = pageSize
      this.loading = true
      this.loadData()
    },
  },
  watch: {
    inivisible(newT) {
      // console.log(newT)
      this.visibled = newT
      if (newT) {
        this.value = -2
        this.loadData()
      }
    }
  }
}
</script>
<style>
.ellipsis-name {
  overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 300px;
}
</style>
