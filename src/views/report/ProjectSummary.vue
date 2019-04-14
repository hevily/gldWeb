<template>
  <div class="ProjectSummary">
    <a-row>
      <a-col :span="24">
        <!-- 操作栏 -->
        <a-row :style="{marginBottom: '12px'}">
          <a-col :span="16" style="line-height: 32px">
            <a-input-search
              placeholder="姓名"
              @search="onEmployeeSearch"
              enterButton="搜索"
            />
          </a-col>
          <a-col :span="8">
            <div :style="{float: 'right',width: '100%',maxWidth:'400px'}">
              <a-button class="ant-button" icon="plus">导出EXCEL</a-button>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-table
            :size="size"
            :bordered="bordered"
            :loading="loading"
            :columns="columns"
            :dataSource="current"
            :rowKey="record => record.id"
            :scroll="{ x: 1500, y: 400 }"
            :pagination="false"
          >
          </a-table>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'
  import moment from 'moment'
  import { db } from '@/utils/db.js'
  // import { ArrayToString } from '@/utils/util.js'
  // import uuid from 'uuid'

  export default {
    components: {
    },
    mixins: [mixin],
    props: {
    },
    data () {
      return {
        bordered: true,
        size: 'small',
        rowKey: 'no',
        filterWhere: '', //过滤条件
        searchWhere: '', //搜索条件
        where: '',       //最终查询条件
        loading: false, //加载动态
        pageSizeOptions: ['10', '20', '30'],
        total: 0,
        currentPageSize: 20,
        defaultCurrent: 1,
        sortParams: {}, //排序参数
        queryParam: {},
        columns: [
          {
            title: '编号',
            width: 100,
            dataIndex: 'projectNo',
            key: 'projectNo'
          },
          {
            title: '委托单位',
            width: 100,
            dataIndex: 'client.name'
          },
          {
            title: '项目名称',
            width: 100,
            dataIndex: 'name'
          },
          {
            title: '送审金额(元)',
            width: 120,
            dataIndex: 'department.name'
          },
          {
            title: '定案金额(元)',
            width: 120,
            align: 'center',
            dataIndex: 'roles',
            key: 'roles'
          },
          {
            title: '核减金额(元)',
            width: 120,
            dataIndex: 'reduceAmount',
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = Math.abs(record.submitAmount - record.approvedAmount).toFixed(2)
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '经办人',
            width: 70,
            dataIndex: 'principal.name',
            align: 'center'
          },
          {
            title: '复核人',
            width: 70,
            dataIndex: 'reviewName',
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = record.tasks.length > 0 && record.tasks[0].childTasks.length > 0 ? record.tasks[0].childTasks[0].handler.name: ''
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '工程规模',
            width: 80,
            dataIndex: 'projectScale',
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = record.projectScale + record.projectScaleUnit
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '定案日期',
            width: 100,
            dataIndex: 'finishTime',
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = record.steps.length > 0 ? moment(record.steps[0].finishTime).format('MM-DD'): ''
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '施工单位',
            width: 120,
            dataIndex: 'organization',
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = record.organizations.length > 0 ? record.organizations[0].name: ''
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '应收(元)',
            width: 100,
            dataIndex: 'moneys_aggregate',
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = (record.moneys_aggregate.aggregate.sum.total || 0).toFixed(2)
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '已收(元)',
            dataIndex: 'receipts_aggregate',
            width: 100,
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = (record.receipts_aggregate.aggregate.sum.amount || 0).toFixed(2)
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '收费日期',
            dataIndex: 'createdAt',
            width: 100,
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = record.moneys.length > 0 ? moment(record.moneys[0].createdAt).format('MM-DD'): ''
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '未收(元)',
            dataIndex: 'unReceipt',
            width: 100,
            align: 'center',
            customRender: (text, record, index) => {
              let desc = ''
              desc = ((record.moneys_aggregate.aggregate.sum.total || 0) - (record.receipts_aggregate.aggregate.sum.amount || 0)).toFixed(2)
              return {
                children: desc,
                attrs: {},
              }
            }
          }
        ],
        current: [],
        dbConn: null
      }
    },
    created() {
      //初始化数据库连接
      this.dbConn = new db(this.$apollo)
      //加载角色列表
      this.loadProjectSummary()
    },
    methods: {
      //接口获取数据
      async loadProjectSummary() {
        this.where = this.filterWhere + this.searchWhere
        const _this = this
        const gql = `
          query {
            Project_aggregate(where: {${this.where}}) {
              aggregate {
                count
              }
            }

            Project (where: {}, order_by: [{projectNo:asc}]){
              id
              businessType
              projectNo
              client {
                id
                name
              }
              name
              submitAmount
              approvedAmount
              principal {
                id
                name
              }
              steps(where:{name: {_eq: "取回报告书"}}) {
                id
                name
                finishTime
              }
              organizations(where: {type: {_eq: "施工单位"}}){
                id
                type
                name
              }
              tasks (where: {type: {_eq:3}}){
                name
                childTasks(where: {step: {_eq:0}}) {
                  id
                  name
                  step
                  handler {
                    id
                    name
                  }
                }
              }
              projectScale
              projectScaleUnit
              contract_id
              name
              status
              principal {
                id
                name
              }
              moneys(order_by: [{createdAt: asc}], limit: 1) {
                createdAt
              }
              moneys_aggregate {
                aggregate {
                  sum {
                    total
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
          }
          `
        const res = await this.dbConn.query(gql, {})
        if(res.data.Project.length > 0){
          console.log(res,'res')
          _this.current = res.data.Project
          _this.loading = res.loading
        }else{
          _this.total = 0
          _this.current = []
          _this.loading = false
        }
      },
      onEmployeeSearch(value) {
        // alert(value)
        if(value !== ''){
          this.searchWhere = `
          _or: [
            {name: {_like: "%${value}%"}},
            {mobile: {_like: "%${value}%"}}
           ]
          `
        }else{
          this.searchWhere = ``
        }
        this.defaultCurrent = 1
        this.loadEmployeeList()
      }
    },
    computed: {
    },
    watch: {
    }
  }
</script>

<style scoped>
  .treeDiv {
    height: 400px;
    border: 1px solid #e8e8e8;
    overflow: auto;
    padding: 5px;
    border-radius: 4px;
  }
  table td {
    padding: 4px 0px;
  }
  table th {
    padding: 4px 0px;
    text-align: right;
  }
  .borderBottom {
    border-bottom: 1px solid #e8e8e8;
    margin-right: 20px;
  }
  .sameWidth {
    width: 260px;
  }
  .th-right {
    text-align: right;
  }
  .th-top {
    /* text-align: top !important; */
    padding-top: 9px !important;
    vertical-align: top;
  }
  .auth-div {
    margin-bottom: 10px;
  }
  .auth-title {
    padding-top: 5px;
    border-bottom: 1px solid rgb(233, 233, 233);
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .auth-parent {
    font-size: 13px;
    font-weight: bold;
  }
  .auth-item {
    font-size: 13px;
  }

  .ant-form-item {
    margin-bottom: 0px;
  }

  .fixWidth {
    width: 460px;
    font-size: 13px;
    /*padding-left: 10px;*/
    margin-top: 2px;
    margin-bottom: 5px;
  }

  .auth-item .ant-checkbox-wrapper  {
    margin-left: 0px;
  }

  .depart-button {
    color: #5873c9;
    padding-right: 3px;
  }

  .ant-table td { white-space: nowrap; }
</style>