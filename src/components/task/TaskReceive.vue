<template>
  <a-row>
    <a-col :span="24" class="taskReceiveTable">
      <a-table :columns="columns" :dataSource="data" bordered :pagination="pagination">
        <span slot="name" slot-scope="text, record,index">
          <a class="font-blue">{{ text }}</a>
        </span>
        <div slot="action" slot-scope="text, record,index">
          <a class="font-blue" style="margin-right:5px">讨论</a>
          <a class="font-blue" style="margin-right:5px">审核</a>
          <a class="font-blue" style="margin-right:5px">纪要</a>
          <a class="font-blue" style="margin-right:5px">项目</a>
        </div>
      </a-table>
    </a-col>
  </a-row>
</template>
<script>
import gql from 'graphql-tag'

const columns = [
  {
    title: '任务名称',
    width: 200,
    align: 'center',
    key: 'name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '发起人',
    width: 80,
    align: 'center',
    key: 'createdBy',
    dataIndex: 'createdBy',
    scopedSlots: { customRender: 'createdBy' }
  },
  {
    title: '负责人',
    width: 80,
    align: 'center',
    key: 'handler',
    dataIndex: 'handler',
    scopedSlots: { customRender: 'handler' }
  },
  {
    title: '文件',
    width: 80,
    align: 'center',
    key: 'file',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '截止日期',
    width: 80,
    align: 'center',
    key: 'endData',
    dataIndex: 'endData',
    scopedSlots: { customRender: 'endData' }
  },
  {
    title: '任务状态',
    width: 80,
    align: 'center',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    width: 180,
    align: 'center',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

var data = [{ name: '【 安装部分 】 任务已完成，请审核！' }]

export default {
  name: 'TaskReceive',
  props: {
    tapType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      columns,
      data,
      taskType: this.tapType,
      //   pagination: this.pager(),
      pagination: {},
      pageSizeOptions: ['10', '20', '30'],
      currentPageSize: 10,
      defaultCurrent: 1,
      total: 20,
      user: {}
    }
  },
  // apollo: {
  //   user: {
  //     query: gql`
  //       query {
  //         departmentsConnection {
  //           aggregate {
  //             count
  //           }
  //         }
  //         departments(where: {}) {
  //           id
  //           name
  //           employees {
  //             id
  //             name
  //           }
  //         }
  //       }
  //     `
  //   }
  //   // users: {
  //   //   // GraphQL 查询
  //   //   query: gql`
  //   //     query users($skip: Int!, $pageSize: Int!) {
  //   //       users(where: {}, skip: $skip, first: $pageSize) {
  //   //         id
  //   //         name
  //   //       }
  //   //     }
  //   //   `,
  //   //   // 初始变量
  //   //   variables: {
  //   //     skip: 0,
  //   //     pageSize: 2,
  //   //     hasMore: false
  //   //   }
  //   // }
  // },
  created() {
    console.log(this.taskType, 'type')

    setTimeout(() => {
      //   this.loading = !this.loading
      this.pagination = this.pager()
    }, 100)
  },
  methods: {
    init() {
      console.log(this.taskType)
    },

    getData() {
      this.$apollo
        .query({
          query: gql`
            query departments($skip: Int!, $pageSize: Int!){
              departmentsConnection {
                aggregate {
                  count
                }
              }
              departments(where: {}, skip: $skip, first: $pageSize) {
                id
                name
                employees {
                  id
                  name
                }
              }
            }
          `,
          // 初始变量
          variables: {
            skip: 6,
            pageSize: 2,
            hasMore: false
          }
        })
        .then(res => {
          console.log(res, 'res')
        })
        .catch(err => {
          console.log(err, 'err')
        })
    },

    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent,
        onChange: this.onPagerChange,
        onShowSizeChange: this.onPagerSizeChange
      }
    },
    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      //   this.pageSize = pageSize
      // console.log(page, pageSize,'changePager')
      //   this.loadData({ pageNum: page })
    },
    onPagerSizeChange(current, size) {
      // console.log(current, size,'changeSize');
      this.defaultCurrent = current
      //   this.pageSize = size
      //   this.loadData({ pageSize: size })
    }
  },
  watch: {
    tapType(newT, oldT) {
      // var that = this
      this.getData()
      // console.log(this.$apollo, 'use')
      console.log(this)
      this.taskType = newT
      this.init()
    }
  }
}
</script>
<style>
.taskReceiveTable .ant-table-thead > tr > th,
.taskReceiveTable .ant-table-tbody > tr > td {
  padding: 8px 16px;
}
</style>

