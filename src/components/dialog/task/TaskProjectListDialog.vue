<template>
  <div>
    <a-modal
      :visible="visibled"
      :title="title"
      :maskClosable="maskClosable"
      :footer="null"
      @cancel="cancel"
      :width="800"
    >
      <a-row class="TaskProjectListDialog">
        <a-col :span="24">
          <a-input-search
            :style="{width:'45%'}"
            placeholder="项目编号、项目名称、项目负责人"
            @search="onSearch"
            enterButton="搜索"
          />
        </a-col>
        <a-col :span="24" :style="{margin:'10px 0'}">
          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :bordered="true"
            :columns="column"
            :dataSource="data"
            :pagination="pagination"
            @change="tableChange"
          >
            <template slot="name" slot-scope="text,record">
              <a
                :style="{width:'200px',display:'block'}"
                class="ellipsis"
                :title="record.name"
              >{{record.name}}</a>
            </template>
          </a-table>
        </a-col>
        <a-col :span="24" :style="{textAlign:'center'}">
          <a-button type="primary" @click="handlerOk" :style="{marginRight:'10px'}">确定</a-button>
          <a-button type="default" @click="cancel">取消</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'TaskProjectListDialog',
  props: {
    pVisibled: {
      type: Boolean,
      default: false
    },
    pTitle: {
      type: String,
      default: ''
    },
    maskClosable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visibled: this.pVisibled,
      title: this.pTitle,
      data: [],
      pageSizeOptions: ['10', '20', '30'], //分页列数
      total: 0, //总数
      currentPageSize: 10, //表格页的列数
      defaultCurrent: 1, //表格当前页
      pagination: {}, //分页对象
      loading: true, //加载
      selectedRowKeys: [], //所选项目
      order_byString: '', //排序字符
      whereString: '', //查询条件
      column: [
        {
          title: '项目编号',
          dataIndex: 'projectNo',
          key: 'projectNo',
          width: 120,
          sorter: true
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
          width: 350,
          sorter: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '负责人',
          dataIndex: 'principal',
          key: 'principal',
          width: 100,
          align: 'center',
          sorter: true,
          customRender: text => (text || {}).name
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          key: 'endDate',
          width: 100,
          sorter: true
        }
      ]
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      var _this = this
      var skip = (_this.defaultCurrent - 1) * _this.currentPageSize
      this.$apollo
        .query({
          query: gql`
            query {
              Project_aggregate(where: {${_this.whereString}}) {
                aggregate {
                  count
                }
              }
              Project(where: {${_this.whereString}},${
            _this.order_byString ? `order_by:${_this.order_byString},` : ''
          } offset: ${skip}, limit: ${_this.currentPageSize} ) {
                projectNo
                id
                principal {
                  id
                  name
                }
                name
                endDate
              }
            }
          `,
          fetchPolicy: 'no-cache'
        })
        .then(res => {
          console.log(res, 'get all project list success')
          _this.total = res.data.Project_aggregate.aggregate.count
          _this.loading = res.loading
          _this.beforeData(res.data.Project)
        })
        .catch(err => {
          console.log(err, 'get all project list error')
        })
    },
    //数据处理
    beforeData(data) {
      this.data = data
      this.pagination = this.pager()
      this.selectedRowKeys = []
    },
    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      this.currentPageSize = pageSize
      this.loading = true
      this.loadData()
    },
    onPagerSizeChange(current, size) {
      this.defaultCurrent = current
      this.currentPageSize = size
      this.loading = true
      this.loadData()
    },
    //分页
    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent,
        onChange: this.onPagerChange,
        onShowSizeChange: this.onPagerSizeChange
      }
    },

    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]]
      //   console.log(this.selectedRowKeys)
    },
    //搜索
    onSearch(e) {
      console.log(e, 'search')
      if (!e) {
        this.whereString = ''
      }
      this.whereString = ` _and:[{_or:[{projectNo:{_like:"%${e}%"}}, {name:{_like:"%${e}%"}},{principal:{name:{_like:"%${e}%"}}} ]}]`
      this.defaultCurrent = 1
      this.loadData()
    },
    //分页、排序、筛选变化时触发
    tableChange(pagination, filters, sorter) {
      console.log(sorter)
      this.order_by = []

      if (Object.keys(sorter || {}).length) {
        var obj = {}
        if (sorter.field == 'principal') {
          sorter.field = 'principal.name'
        }
        if (sorter.order == 'descend') {
          obj[sorter.field] = 'desc'
        } else {
          obj[sorter.field] = 'asc'
        }
        this.order_by.push(obj)
        this.order_byString = this.orderByS(this.order_by)
        console.log(this.order_byString)
      } else {
        this.order_byString = ''
      }

      this.loadData()
      // console.log(JSON.stringify(this.order_by))
    },
    //排序
    orderByS(data) {
      var order_byS = '[{'
      data.forEach(ele => {
        var eleArray = Object.keys(ele)[0].split('.')
        if (eleArray.length == 1) {
          order_byS += `${Object.keys(ele)[0]}:${ele[Object.keys(ele)[0]]},`
        } else {
          eleArray.forEach((aEle, aIndex) => {
            if (aIndex == eleArray.length - 1) {
              order_byS += aEle + ':'
            } else {
              order_byS += aEle + ':{'
            }
          })
          order_byS += ele[Object.keys(ele)[0]]
          eleArray.forEach((aEle, aIndex) => {
            if (aIndex != eleArray.length - 1) {
              order_byS += '}'
            }
          })
        }
      })
      order_byS += '}]'
      return order_byS
    },
    cancel() {
      this.$emit('changeDialog', { visibled: false, data: [] })
    },
    handlerOk() {
      if (this.selectedRowKeys.length) {
        this.$emit('changeDialog', { visibled: false, data: [this.data[this.selectedRowKeys[0]]] })
      } else {
        this.cancel()
      }
    }
  },
  watch: {
    pVisibled(newT, oldT) {
      //   console.log(newT, oldT, '-------')
      this.visibled = newT
      if (newT) {
        // this.initInfo()
        this.loadData()
      }
    }
  }
}
</script>
<style>
.TaskProjectListDialog .ant-table-thead > tr > th,
.TaskProjectListDialog .ant-table-tbody > tr > td {
  padding: 8px;
}
</style>

