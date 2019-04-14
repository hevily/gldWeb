<template>
  <div>
    <a-modal
      :title="title"
      v-model="visibled"
      @ok="handleOk"
      @cancel="cancel"
      :maskClosable="maskClosable"
      :width="800"
    >
      <a-row>
        <a-col :span="24">
          <!-- <div style="height:40px">
            <a-input type="text" placeholder="姓名" style="width: 74%;"/>
            <a-button type="primary" style="width: 22%;float: right;">搜索</a-button>
          </div>-->
          <div class="treeDiv">
            <a-radio-group @change="onChange" v-model="value" :style="{width:'100%'}">
              <a-table
                size="small"
                :bordered="true"
                :columns="columns"
                :dataSource="clientData"
                :pagination="false"
              >
                <div slot="name" slot-scope="text,record,index">
                  <a-radio :value="record.id">{{record.name}}</a-radio>
                </div>
                <div
                  slot="address"
                  slot-scope="text,record,index"
                >{{record.address.province + record.address.city + record.address.district + record.address.address}}</div>
              </a-table>
            </a-radio-group>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
// import gql from 'graphql-tag'
import { db } from '@/components/_util/db'

export default {
  name: 'ClientDialog',
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
    },
    cValue:{
      type:String,
      default:'',
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      value: this.cValue,
      dbConn: new db(this.$apollo), //数据库操作
      clientData: [],
      columns: [
        // {
        //   dataIndex: 'id',
        //   scopedSlots: { customRender: 'clientId' }
        // },
        {
          title: '委托人名称',
          dataIndex: 'name',
          width: '350px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '委托方地址',
          dataIndex: 'address',
          width: '350px',
          scopedSlots: { customRender: 'address' }
        }
      ]
    }
  },
  created() {
    // this.loadData()
  },
  methods: {
    handleOk() {
      var data = this.clientData.filter(ele => ele.id == this.value)
      this.$emit('changeStatus', { visibled: false, data: data })
    },
    cancel() {
      this.$emit('changeStatus', { visibled: false })
    },
    onChange(e) {
      console.log('radio checked', e.target.value)
    },
    //加载数据
    loadData() {
      var _this = this

      var queryString = `
        query {
          Client {
            id
            name
            address {
              id
              province
              city
              district
              address
            }
            account
            bankName
            licenseAddress
            licenseName
            phone
            taxNumber
          }
        }`

      this.dbConn
        .query(queryString)
        .then(res => {
          console.log(res, 'get project client')
          _this.clientData = res.data.Client
        })
        .catch(err => {
          console.log(err,'get project client error')
        })
    }
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
.treeDiv {
  padding: 0;
}
.treeDiv .ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
</style>

