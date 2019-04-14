<template>
  <div>
    <a-modal
      :title="title"
      v-model="visibled"
      @cancel="cancel"
      :maskClosable="maskClosable"
      :width="800"
      :footer="null"
      class="projectListDialog"
    >
      <a-row>
        <a-col :span="24">
          <div class="treeDiv">
            <a-table
              size="small"
              :bordered="true"
              :columns="columns"
              :dataSource="current"
              :pagination="pagination"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              @change="tableChange"
            >
              <div slot="projectName" slot-scope="text,record,index">
                <a
                  :style="{display:'block',maxWidth:'150px',overflow:'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}"
                >{{record.name}}</a>
              </div>
              <template slot="principal" slot-scope="text,record,index">
                <span>{{record.principal.name}}</span>
              </template>
            </a-table>
          </div>
        </a-col>
        <a-col :span="24" :style="{textAlign:'center',marginTop:'10px'}">
          <a-button type="primary" :style="{marginRight:'10px'}" @click="handleOk">确定</a-button>
          <a-button type="default" @click="cancel">取消</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
// import gql from 'graphql-tag'
// import { db } from '@/components/_util/db'
import { db } from '@/utils/db'
import moment from 'moment'

export default {
  name: 'ProjectListDialog',
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
    // cValue: {
    //   type: String,
    //   default: ''
    // },
    defaultSelectArray: {
      type: Array,
      default: function(value) {
        // console.log(value,'defaultSelectArray value')
        return []
      }
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      // value: this.cValue,
      dbConn: new db(this.$apollo), //数据库操作
      current: [],
      selectedRowKeys: [],
      total: 0, //总数
      currentPageSize: 10, //表格页的列数
      defaultCurrent: 1, //表格当前页
      pagination: {},
      whereString: '',
      order_byString:'',
      defaultSelectKeys: [],
      hasSelectKeys: [],
      columns: [
        {
          title: '项目编号',
          dataIndex: 'projectNo',
          width: '200px',
          sorter: true,

          scopedSlots: { customRender: 'projectNo' }
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          width: '350px',
          sorter: true,
          scopedSlots: { customRender: 'projectName' }
        },
        {
          title: '负责人',
          dataIndex: 'principal',
          width: '350px',
          sorter: true,
          align: 'center',
          scopedSlots: { customRender: 'principal' }
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          width: '350px',
          sorter: true,
          align: 'center',
          // scopedSlots: { customRender: 'endDate' }
          customRender: (text, record) => {
            let endDate = ''
            if (record.endDate) {
              endDate = moment(record.endDate).format('YYYY-MM-DD')
            }
            return {
              children: endDate,
              attr: {}
            }
          }
        }
      ]
    }
  },
  created() {
    // var orderByArray = [{createdAt:"desc"}]
    // this.order_byString = this.orderByS(this.order_by)
    // this.loadData()
  },
  methods: {
    handleOk() {
      // var data = this.clientData.filter(ele => ele.id == this.value)
      // if(this.defaultSelectKeys.length > this.)
      var data = []
      // if(this.defaultSelectKeys.length <= this.selectedRowKeys.length){ //已关联的不取消关联
      this.selectedRowKeys.forEach(s => {
        let hasArray = this.defaultSelectKeys.filter(d => d == s)
        if(!hasArray.length){
          // console.log(this.current,this.current[s])
          let obj = this.current[s]
          data.push(obj)
        }
      })
      // }else {
      //   this.selectedRowKeys.forEach(s => {
      //     let hasArray = this.defaultSelectKeys.filter(d => d == s)
      //     if(!hasArray.length){
      //       // console.log(this.current,this.current[s])
      //       let obj = this.current[s]
      //       data.push(obj)
      //     }
      //   })
      // }
      // console.log(data,'filterData')

      this.$emit('changeStatus', { visibled: false, data: data })
    },
    cancel() {
      this.$emit('changeStatus', { visibled: false })
    },
    onChange(e) {
      console.log('radio checked', e.target.value)
    },
    //加载数据
    async loadData() {
      var _this = this
      var skip = (this.defaultCurrent - 1) * this.currentPageSize
      var queryString = `
        query proje($skip: Int!, $pageSize: Int!) {
          Project_aggregate(where: {${_this.whereString}}){
            aggregate{
              count
            }
          }
          Project(order_by:${this.order_byString},offset: $skip, limit: $pageSize) {
            id
            name
            endDate
            principal {
              id
              name
            }
            projectNo
          }
        }`
      console.log(queryString,skip,this.currentPageSize)
      let res = await this.dbConn.query(queryString, {
        skip: parseInt(skip),
        pageSize: parseInt(this.currentPageSize)
      })
      _this.total = res.data.Project_aggregate.aggregate.count
      _this.current = res.data.Project
      this.selectedRowKeys = []
      this.defaultSelectKeys = []
      _this.current.forEach((ele, index) => {
        ele.principal = ele.principal || {}
        var hasSelect = this.defaultSelectArray.filter(e => e.id == ele.id)
        console.log(hasSelect,'hasSelect')
        if (hasSelect.length) {
          this.selectedRowKeys.push(index)
          this.defaultSelectKeys.push(index)
        }
      })
      console.log(res,this.selectedRowKeys,this.defaultSelectKeys)

      _this.pagination = _this.pager()
      _this.loading = res.loading
      // console.log(queryString, res)
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    //分页
    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        showSizeChanger: false,
        // pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent
      }
    },
    //分页、排序、筛选变化时触发
    tableChange(pagination, filters, sorter) {
      console.log(pagination,sorter)

      this.defaultCurrent = pagination.current
      this.currentPageSize = pagination.pageSize
      // this.order_by=[{isFavorite:"desc"}]
      var orderByArray = []
      
      if(Object.keys(sorter || {}).length){
        var obj = {}
        if(sorter.order == "descend"){
          obj[sorter.field] = "desc"
        }else {
          obj[sorter.field] = "asc"
        }
        orderByArray.push(obj)
      }else {
        orderByArray=[{createdAt:'asc'}]
      }
      
      this.order_byString = this.orderByS(orderByArray)
      // console.log( this.order_byString,'tablechange')
      this.loadData()

      // console.log(JSON.stringify(this.order_by))
    },
     //排序
    orderByS(data){
      console.log(data,'orderBys')
      var order_byS = '[{'
      data.forEach(ele => {
        if(Object.keys(ele)[0] == 'principal'){
          order_byS += `principal:{name:${ele[Object.keys(ele)[0]]}},`
        }else {
          order_byS += `${Object.keys(ele)[0]}:${ele[Object.keys(ele)[0]]},`
        }
      })
      order_byS += '}]'
      return order_byS
    },

  },
  watch: {
    inivisible(newT) {
      console.log(newT)
      this.visibled = newT
      if (newT) {
        // this.value = -2
        this.currentPageSize= 10
        this.defaultCurrent = 1
        var orderByArray = [{createdAt:"asc"}]
        this.order_byString = this.orderByS(orderByArray)
        this.loadData()
        console.log(this.defaultSelectArray, 'new defaultSelectArray')
      }
    },
    defaultSelectArray(newT) {
      console.log(newT, 'new defaultSelectArray')
    }
  }
}
</script>
<style>
.projectListDialog .treeDiv {
  padding: 0;
  border: 0;
  /* border-bottom: 1px solid #eee; */
  border-radius: 0;
}
.projectListDialog .treeDiv .ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
.projectListDialog .ant-table-pagination.ant-pagination {
  /* margin: 16px 0;
    float: right; */
  width: 100%;
  text-align: center;
}
</style>

