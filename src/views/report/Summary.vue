<template>
  <div class="reportList">
    <a-card :bordered="false" :body-style="{padding: '10px',minWidth:'1200px'}">
      <a-tabs
        default-active-key="1"
        size="large"
        :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
        @change="tabChange"
      >
        <a-tab-pane loading="true" tab="项目汇总" key="1">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <a-select
                labelInValue
                :defaultValue="{ key: '12' }"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="12">最近一年</a-select-option>
                <a-select-option value="1">最近一月</a-select-option>
                <a-select-option value="3">最近三月</a-select-option>
                <a-select-option value="6">最近六月</a-select-option>
                <a-select-option value>全部</a-select-option>
              </a-select>
            </a-col>

            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{float: 'right',width: '100%',maxWidth:'450px'}">
                <a-input-search
                  :style="{width:'70%',marginRight:'10px'}"
                  v-model="searchValue"
                  placeholder="项目编号、项目名称、项目负责人、委托人、归档号"
                  @search="onSearch"
                  enterButton="搜索"
                />
                <a-button type="default" @click="downloadOutline" :disabled="loading">导出excel</a-button>
              </div>
            </a-col>
          </a-row>
          <!-- 列表 -->
          <a-row>
            <a-table
              :size="size"
              :bordered="bordered"
              :loading="loading"
              :columns="columns"
              :dataSource="current"
              :pagination="false"
              :scroll="{ x: 1760, y: 400 }"
            >
              <!-- <a slot="description" slot-scope="text" href="javascript:;">{{ text }}</a> -->

              <!-- 合同名称slot -->
              <div slot="name" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  style="width:300px;display: block;"
                  :title="record.name"
                >{{ record.name }}</a>
              </div>

              <!-- 合同名称slot -->
              <div slot="org" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  style="width:100px;display: block;"
                  :title="record.organizations.length > 0 ? record.organizations[0].name: ''"
                >{{ record.organizations.length > 0 ? record.organizations[0].name: '' }}</a>
              </div>
            </a-table>
          </a-row>
        </a-tab-pane>
        <a-tab-pane loading="true" tab="项目绩效" key="2">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <!-- <span>开始日期：</span>
              <a-date-picker v-model="startDate" class="sameWidth"/>&nbsp;&nbsp;
              <span>结束日期：</span>
              <a-date-picker v-model="endDate" class="sameWidth"/>-->
              <a-select
                mode="multiple"
                v-model="accountingDate"
                style="width: 60%"
                placeholder="核算期"
              >
                <a-select-option v-for="(item,key) in times" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-col>

            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{float: 'right',width: '100%',maxWidth:'450px'}">
                <a-input-search
                  :style="{width:'70%',marginRight:'10px'}"
                  v-model="searchValuePerformance"
                  placeholder="项目编号、项目名称、经办人、工作项、核算期"
                  @search="onSearchPerformance"
                  enterButton="搜索"
                />
                <a-button type="default" @click="downloadOutline2" :disabled="loading">导出excel</a-button>
              </div>
            </a-col>
          </a-row>
          <!-- 列表 -->
          <a-row>
            <a-table
              :size="size"
              :bordered="bordered"
              :loading="loading"
              :columns="columnsPerformance"
              :dataSource="currentPerformace"
              :pagination="false"
              :filtered="true"
              :scroll="{ x: 2560, y: 400 }"
            >
              <!-- 项目名称slot -->
              <div slot="name" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  style="width:300px;display: block;"
                  :title="record.project.name"
                >{{ record.project.name }}</a>
              </div>

              <!-- 项目状态筛选 -->
              <div
                slot="statusFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                class="custom-filter-dropdownS"
              >
                <a-row style="width:188px">
                  <a-col :span="24">
                    <a-checkbox
                      :indeterminate="statusIndeterminate"
                      @change="statusCheckAllChange"
                      :checked="statusCheckAll"
                    >全选</a-checkbox>
                  </a-col>
                  <a-checkbox-group @change="statusCheckChange" v-model="statusCheckedList">
                    <a-col :span="24" v-for="(item,index) in statusArray" :key="index">
                      <a-checkbox :value="item">{{ item }}</a-checkbox>
                    </a-col>
                  </a-checkbox-group>
                </a-row>
              </div>

              <!-- 项目状态处理 -->
              <div slot="status" slot-scope="text,record,index">
                <div v-if="!record.project.status"></div>
                <div v-else>
                  <span
                    :style="{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',marginRight:'5px',backgroundColor:statusColor[record.project.status||0]}"
                  ></span>
                  <span>{{ statusObject[record.project.status||0] }}</span>
                </div>
              </div>
            </a-table>
          </a-row>
        </a-tab-pane>
        <a-tab-pane loading="true" tab="人员绩效" key="3">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <!-- <span>开始日期：</span>
              <a-date-picker v-model="startDate" class="sameWidth"/>&nbsp;&nbsp;
              <span>结束日期：</span>
              <a-date-picker v-model="endDate" class="sameWidth"/>-->
              <a-select
                mode="multiple"
                v-model="accountingDate"
                style="width: 60%"
                placeholder="核算期"
              >
                <a-select-option v-for="(item,key) in times" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-col>

            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{float: 'right',width: '100%',maxWidth:'450px'}">
                <a-input-search
                  :style="{width:'70%',marginRight:'10px'}"
                  v-model="searchValuePerformance"
                  placeholder="姓名、项目名称"
                  @search="onSearchPerformance"
                  enterButton="搜索"
                />
                <a-button type="default" @click="downloadOutline3" :disabled="loading">导出excel</a-button>
              </div>
            </a-col>
          </a-row>
          <!-- 列表 -->
          <a-row>
            <a-table
              :size="size"
              :bordered="bordered"
              :loading="loading"
              :columns="columnsPerformance2"
              :dataSource="currentPerformace2"
              :pagination="false"
              :filtered="true"
              :scroll="{ x: 1800, y: 400 }"
            >
              <!-- 项目名称slot -->
              <div slot="name" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  style="width:300px;display: block;"
                  :title="record.project.name"
                >{{ record.project.name }}</a>
              </div>

              <!-- 项目状态筛选 -->
              <div
                slot="statusFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                class="custom-filter-dropdownS"
              >
                <a-row style="width:188px">
                  <a-col :span="24">
                    <a-checkbox
                      :indeterminate="statusIndeterminate"
                      @change="statusCheckAllChange"
                      :checked="statusCheckAll"
                    >全选</a-checkbox>
                  </a-col>
                  <a-checkbox-group @change="statusCheckChange" v-model="statusCheckedList">
                    <a-col :span="24" v-for="(item,index) in statusArray" :key="index">
                      <a-checkbox :value="item">{{ item }}</a-checkbox>
                    </a-col>
                  </a-checkbox-group>
                </a-row>
              </div>

              <!-- 项目状态处理 -->
              <div slot="status" slot-scope="text,record,index">
                <div v-if="!record.project.status"></div>
                <div v-else>
                  <span
                    :style="{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',marginRight:'5px',backgroundColor:statusColor[record.project.status||0]}"
                  ></span>
                  <span>{{ statusObject[record.project.status||0] }}</span>
                </div>
              </div>
            </a-table>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
// import { getServiceList } from '@/api/manage'

import { db } from '@/utils/db'
import gql from 'graphql-tag'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { mapState, mapMutations } from 'vuex'

import downloadExcel from 'vue-json-excel'

var BusinessType = [
  '可行性经济评价',
  '全过程工程造价管理',
  '工程造价鉴定',
  '工程造价信息咨询服务',
  '其他工程造价咨询工作',
  '审核投资估算',
  '审核设计概算',
  '审核施工图预算',
  '审核清单控制价',
  '审核工程变更',
  '审核竣工结算',

  '编制投资估算',
  '编制设计概算',
  '编制施工图预算',
  '编制工程量清单',
  '编制工程量清单控制价',
  '编制投标报价',
  '编制竣工结算',
  '编制竣工决算'
]

const statusObject = {
  0: '未开始',
  1: '进行中',
  2: '已完成',
  3: '已归档',
  4: '暂停',
  5: '延期',
  6: '延误'
}
const reverseStatusObject = {
  未开始: 0,
  进行中: 1,
  已完成: 2,
  已归档: 3,
  暂停: 4,
  延期: 5,
  延误: 6
}

const statusColor = {
  0: '#ccc',
  1: '#78bb60',
  2: '#8bb8f1',
  3: '#e2b241',
  4: '#f09a5d',
  5: '#f09a5d',
  6: '#f09a5d'
}
const statusArray = ['未开始', '进行中', '已完成', '已归档', '暂停', '延期', '延误']

var times = []
// var start = 2018
for (var i = 2018; i < 2018 + 20; i++) {
  for (var j = 1; j < 5; j++) {
    var start = i + '0' + j
    times.push(start)
  }
}
console.log(times, 'timestimestimes')

export default {
  name: 'report',
  props: {
    title: {
      type: String,
      default: '项目汇总'
    },
    bordered: {
      type: Boolean,
      default: true
    },

    moduleType: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      dbConn: new db(this.$apollo), //数据库操作,
      loading: true, //加载动态
      times, //季度
      pageSizeOptions: ['10', '20', '30'],

      total: 0,
      totalPerformance: 0,
      currentPageSize: 20, //表格页的列数
      defaultCurrent: 1, //表格当前页
      sortParams: {}, //排序参数
      queryParam: {},
      current: [],
      currentPerformace: [],
      currentPerformace2: [],
      pagination: {},
      paramsName: {},

      currentProject: {}, //当前项目
      maskClosabled: false, //弹框是否点击空白隐藏

      businessTypeVisibled: false, //业务类型筛选
      BusinessType, //业务类型数组
      BusIndeterminate: false, //全选/不选中间值
      BusCheckAll: true, //业务类型是否全选
      BusCheckedList: BusinessType, //已选择的业务类型

      ProjectTypeVisibled: false, //项目类型
      ProjectTypeValue: '', //项目类型的值

      submitAmountVisibled: false, //送审金额
      submitAmountStart: '', //送审金额起始值
      submitAmountEnd: '', //送审金额结束值

      approvedAmountVisibled: false, //审定金额
      approvedAmountStart: '', //审定金额起始值
      approvedAmountEnd: '', //审定金额结束值

      backAsckVisibled: false, //已回款
      backAsckStart: '', //已回款起始值
      backAsckEnd: '', //已回款结束值

      endDataVisibled: false, //截止时间筛选
      endDataStart: '', //截止时间开始
      endDataEnd: '', //截止时间结束
      dateFormat: 'YYYY-MM-DD', //时间格式

      statusObject, //项目状态对象
      reverseStatusObject, //项目状态对象翻转
      statusArray, //项目状态数组
      statusColor, //项目状态颜色

      statusIndeterminate: false, //全选/不选中间值
      statusCheckAll: true, //项目状态是否全选
      statusCheckedList: statusArray, //已选择的业务类型
      // statusVisibled: false,

      finishVisible: false, //归档弹框是否显示

      employeeTitle: '选择组织', //部门弹框标题
      employeeVisibled: false, //部门弹框是否显示
      employeeType: 2, //部门弹框类型（人员/部门）

      moveStar: '', //移入行是否显示星星

      whereString: '', //筛选条件
      performanceWhereString: '', //项目字段过滤掉件
      performanceWhereString2: '',
      order_by: [{ isFavorite: 'desc_nulls_last' }, { createdAt: 'desc_nulls_last' }],
      order_byString: '', //排序条件
      // selectedIndex: -1,
      modal1Visible: false,
      value: 2,
      searchValue: '',
      searchValuePerformance: '',
      tabkey: 1,
      searchDate: '12', //默认为一年
      startDate: moment().subtract(1, 'months'),
      endDate: moment(),
      accountingDate: [],
      urgentObject: {
        0: { name: '正常', color: '#78bb61' },
        1: { name: '赶工', color: '#e3ba5d' },
        2: { name: '加急', color: '#df662c' }
      },
      // 表头项目编号，项目名称，业务类型，负责人，项目类型，送审金额，审定金额，已回款/咨询，截止日期，项目状态，项目进展，项目备注，操作（讨论 归档 核算 创建子项目 删除）
      columns: [
        {
          title: '项目编号',
          width: '120px',
          dataIndex: 'projectNo'
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          width: '350px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '送审金额',
          width: '130px',
          dataIndex: 'submitAmount',
          align: 'right',
          customRender: (text, record) => {
            return {
              children: parseFloat(record.submitAmount || 0).toFixed(2)
            }
          }
        },
        {
          title: '审定金额',
          width: '130px',
          dataIndex: 'approvedAmount',
          align: 'right',
          customRender: (text, record) => {
            return {
              children: parseFloat(record.approvedAmount || 0).toFixed(2)
            }
          }
        },
        {
          title: '核减金额(元)',
          width: 130,
          dataIndex: 'reduceAmount',
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = Math.abs(record.submitAmount - record.approvedAmount).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '负责人',
          width: 100,
          dataIndex: 'principal',
          align: 'center',
          customRender: text => (text || {}).name || ''
        },
        {
          title: '复核人',
          width: 100,
          dataIndex: 'reviewName',
          align: 'center',
          customRender: (text, record) => {
            let desc = ''
            desc =
              record.tasks.length > 0 && record.tasks[0].childTasks.length > 0
                ? record.tasks[0].childTasks[0].handler.name
                : ''
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '工程规模',
          width: 80,
          dataIndex: 'projectScale',
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = record.projectScale + record.projectScaleUnit
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '定案日期',
          width: 100,
          dataIndex: 'finishTime',
          align: 'center',
          customRender: (text, record) => {
            let desc = ''
            desc =
              record.steps.length > 0 && record.steps[0].finishTime
                ? moment(record.steps[0].finishTime).format('MM-DD')
                : ''
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '施工单位',
          width: 120,
          dataIndex: 'organization',
          align: 'left',
          scopedSlots: { customRender: 'org' }
        },
        {
          title: '应收(元)',
          width: 100,
          dataIndex: 'moneys_aggregate',
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = (record.moneys_aggregate.aggregate.sum.total || 0).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '已收(元)',
          dataIndex: 'receipts_aggregate',
          width: 100,
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = (record.receipts_aggregate.aggregate.sum.amount || 0).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '收费日期',
          dataIndex: 'createdAt',
          width: 100,
          align: 'center',
          customRender: (text, record) => {
            let desc = ''
            desc = record.moneys.length > 0 ? moment(record.moneys[0].createdAt).format('MM-DD') : ''
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '未收(元)',
          dataIndex: 'unReceipt',
          width: 100,
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = (
              (record.moneys_aggregate.aggregate.sum.total || 0) - (record.receipts_aggregate.aggregate.sum.amount || 0)
            ).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        }
      ],
      columnsPerformance: [
        {
          title: '项目编号',
          width: '120px',
          dataIndex: 'project.projectNo'
        },
        {
          title: '项目名称',
          dataIndex: 'project.name',
          width: '350px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '项目状态',
          dataIndex: 'project.status',
          align: 'center',
          width: '100px',
          // filters: [
          //   {
          //     text: '未开始',
          //     value: 0
          //   }, {
          //     text: '进行中',
          //     value: 1
          //   }, {
          //     text: '已完成',
          //     value: 2
          //   }, {
          //     text: '已归档',
          //     value: 3
          //   }, {
          //     text: '暂停',
          //     value: 4
          //   }, {
          //     text: '延期',
          //     value: 5
          //   }, {
          //     text: '延误',
          //     value: 6
          //   }
          // ],
          // onFilter: (value, record) => record.project.status === value,
          scopedSlots: {
            filterDropdown: 'statusFilter',
            customRender: 'status'
          },
          onFilterDropdownVisibleChange: visible => {
            console.log(visible)
          }
        },
        {
          title: '送审金额',
          width: '130px',
          dataIndex: 'submitAmount',
          align: 'right',
          customRender: (text, record) => {
            return {
              children: !record.project.submitAmount ? '' : parseFloat(record.project.submitAmount || 0).toFixed(2)
            }
          }
        },
        {
          title: '审定金额',
          width: '130px',
          dataIndex: 'approvedAmount',
          align: 'right',
          customRender: (text, record) => {
            return {
              children: !record.project.approvedAmount ? '' : parseFloat(record.project.approvedAmount || 0).toFixed(2)
            }
          }
        },
        {
          title: '核减金额(元)',
          width: 130,
          dataIndex: 'reduceAmount',
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = !record.project.submitAmount
              ? ''
              : Math.abs(record.project.submitAmount - record.project.approvedAmount).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '经办人',
          width: 100,
          dataIndex: 'principal',
          align: 'center',
          customRender: (text, record) => (record.employee || {}).name || ''
        },
        {
          title: '复核人',
          width: 100,
          dataIndex: 'reviewName',
          align: 'center',
          customRender: (text, record) => {
            let desc = ''
            desc =
              record.project.tasks.length > 0 && record.project.tasks[0].childTasks.length > 0
                ? record.project.tasks[0].childTasks[0].handler.name
                : ''
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '定案日期',
          width: 100,
          dataIndex: 'finishTime',
          align: 'center',
          customRender: (text, record) => {
            let desc = ''
            desc =
              record.project.steps.length > 0 && record.project.steps[0].finishTime
                ? moment(record.project.steps[0].finishTime).format('MM-DD')
                : ''
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '应收(元)',
          width: 100,
          dataIndex: 'moneys_aggregate',
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = (record.project.moneys_aggregate.aggregate.sum.total || 0).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '已收(元)',
          dataIndex: 'receipts_aggregate',
          width: 100,
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = (record.project.receipts_aggregate.aggregate.sum.amount || 0).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '收费日期',
          dataIndex: 'createdAt',
          width: 100,
          align: 'center',
          customRender: (text, record) => {
            let desc = ''
            desc = record.project.moneys.length > 0 ? moment(record.project.moneys[0].createdAt).format('MM-DD') : ''
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '未收(元)',
          dataIndex: 'unReceipt',
          width: 100,
          align: 'right',
          customRender: (text, record) => {
            let desc = ''
            desc = (
              (record.project.moneys_aggregate.aggregate.sum.total || 0) -
              (record.project.receipts_aggregate.aggregate.sum.amount || 0)
            ).toFixed(2)
            return {
              children: desc,
              attrs: {}
            }
          }
        },
        {
          title: '工作项',
          width: 100,
          dataIndex: 'item',
          align: 'center'
        },
        {
          title: '计提绩效',
          width: 100,
          dataIndex: 'total',
          align: 'right',
          customRender: text => text.toFixed(2)
        },
        {
          title: '专业系数',
          width: 100,
          dataIndex: 'proRatio',
          align: 'right',
          customRender: (text, record) =>
            record.ratios.length === 0
              ? ''
              : parseFloat(record.ratios.find(item => item.name === '专业系数').value || 1)
        },
        {
          title: '规模系数',
          width: 100,
          dataIndex: 'sizeRatio',
          align: 'right',
          customRender: (text, record) =>
            record.ratios.length === 0
              ? ''
              : parseFloat(record.ratios.find(item => item.name === '规模系数').value || 1)
        },
        {
          title: '难度系数',
          width: 100,
          dataIndex: 'hardRatio',
          align: 'right',
          customRender: (text, record) =>
            record.ratios.length === 0
              ? ''
              : parseFloat(record.ratios.find(item => item.name === '难度系数').value || 1)
        },
        {
          title: '工期系数',
          width: 100,
          dataIndex: 'urgentRatio',
          align: 'right',
          customRender: (text, record) =>
            record.project.urgentStatus === undefined
              ? ''
              : record.project.urgentStatus === 0
              ? 1
              : record.project.urgentStatus === 1
              ? 1.05
              : 1.1
        },
        {
          title: '总系数',
          width: 100,
          dataIndex: 'totalRatio',
          align: 'right',
          customRender: (text, record) =>
            record.ratios.length === 0
              ? ''
              : (
                  parseFloat(record.ratios.find(item => item.name === '专业系数').value || 1) *
                  parseFloat(record.ratios.find(item => item.name === '规模系数').value || 1) *
                  parseFloat(record.ratios.find(item => item.name === '难度系数').value || 1)
                ).toFixed(2)
        },
        {
          title: '增减额',
          width: 100,
          dataIndex: 'adjust',
          align: 'right'
        },
        {
          title: '核算期',
          width: 100,
          dataIndex: 'project.accountingDate',
          align: 'center'
        }
      ],
      columnsPerformance2: [
        {
          title: '姓名',
          width: '120px',
          dataIndex: 'employee.name',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: { rowSpan: row.rowSpan }
            }
            return obj
          }
        },
        {
          title: '项目名称',
          dataIndex: 'project.name',
          width: '360px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '业务类型',
          dataIndex: 'project.businessType',
          width: '300px'
          // scopedSlots: { customRender: 'name' }
        },
        {
          title: '项目状态',
          dataIndex: 'project.status',
          align: 'center',
          width: '100px',
          scopedSlots: {
            // filterDropdown: 'statusFilter',
            customRender: 'status'
          }
          // onFilterDropdownVisibleChange: visible => {
          //   console.log(visible)
          // }
        },
        {
          title: '工作项',
          width: '130px',
          dataIndex: 'item',
          align: 'right'
        },
        {
          title: '工程造价',
          width: '130px',
          dataIndex: 'fee',
          align: 'right'
        },
        {
          title: '提成金额',
          width: '130px',
          dataIndex: 'total',
          align: 'right'
        },
        {
          title: '核算期',
          width: '130px',
          dataIndex: 'project.accountingDate',
          align: 'right'
        },
        {
          title: '项目数合计',
          width: '100px',
          dataIndex: 'projectTotal',
          align: 'right',
          customRender: (value, row, index) => {
            const obj = {
              children: row.rowSpan,
              attrs: { rowSpan: row.rowSpan }
            }
            return obj
          }
        },
        {
          title: '任务数合计',
          width: '100px',
          dataIndex: 'taskTotal',
          align: 'right',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: { rowSpan: row.rowSpan }
            }
            return obj
          }
        },
        {
          title: '造价合计',
          width: '100px',
          dataIndex: 'allFee',
          align: 'right',
          customRender: (value, row, index) => {
            const obj = {
              children: parseFloat(value).toFixed(2),
              attrs: { rowSpan: row.rowSpan }
            }
            return obj
          }
        },
        {
          title: '提成合计',
          width: '100px',
          dataIndex: 'allTotal',
          align: 'center',
          customRender: (value, row, index) => {
            const obj = {
              children: parseFloat(value).toFixed(2),
              attrs: { rowSpan: row.rowSpan }
            }
            return obj
          }
        }
      ]
    }
  },
  components: {
    downloadExcel
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      globalProjectId: state => state.projectId
    })
  },
  created() {
    // //数据请求参数配置
    console.log('createList')
    console.log(this.globalProjectId, 'globalProjectId')
    // console.log(moment().endOf('day'))
    // console.log()
    this.loading = true
    this.beforeFilter()
    // this.order_byString = this.orderByS(this.order_by)
    // this.currentPageSize = this.$ls.get('pageSize')
    this.loadList()
  },
  mounted() {
    console.log(this.$ls.get('pageSize'), 'mouted')
    this.currentPageSize = this.$ls.get('pageSize')
  },
  methods: {
    moment,
    ...mapMutations(['set_project']),
    //接口获取数据
    loadList() {
      var _this = this

      var queryString = `
        query {
          Project_aggregate(where: {${this.whereString}}) {
            aggregate {
              count
            }
          }

          Project(where: {${this.whereString}}, order_by: [{ projectNo: desc }]) {
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
            steps(where: { name: { _eq: "取回报告书" } }) {
              id
              name
              finishTime
            }
            organizations(where: { type: { _eq: "施工单位" } }) {
              id
              type
              name
            }
            tasks(where: { type: { _eq: 3 } }) {
              name
              childTasks(where: { step: { _eq: 0 } }) {
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
            moneys(order_by: [{ createdAt: asc }], limit: 1) {
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

      // console.log(queryString)
      this.$apollo
        .query({
          query: gql`
            ${queryString}
          `,
          variables: {},
          fetchPolicy: 'network-only'
          // fetchPolicy:'no-cache'
        })
        .then(res => {
          console.log(res, 'get project list')
          _this.total = res.data.Project_aggregate.aggregate.count
          _this.current = res.data.Project
          _this.loading = res.loading
        })
        .catch(err => {
          console.log(err)
          _this.total = 0
          _this.defaultCurrent = 1
          _this.current = []
          _this.loading = false
        })
    },
    loadPerformanceList() {
      var _this = this

      var queryString = `
        query {
          Performance_aggregate(where: {${this.performanceWhereString}}) {
            aggregate {
              count
            }
          }

          Performance(
            where: {${this.performanceWhereString}},
            order_by: [{ project: {projectNo: asc} }]
          ) {
            id
            employee {
              id
              name
            }
            item
            adjust
            total
            ratios
            project {
              id
              businessType
              projectNo
              client {
                id
                name
              }
              name
              status
              urgentStatus
              accountingDate
              submitAmount
              approvedAmount
              principal {
                id
                name
              }
              steps(where: { name: { _eq: "取回报告书" } }) {
                id
                name
                finishTime
              }
              organizations(where: { type: { _eq: "施工单位" } }) {
                id
                type
                name
              }
              tasks(where: { type: { _eq: 3 } }) {
                name
                childTasks(where: { step: { _eq: 0 } }) {
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
              moneys(order_by: [{ createdAt: asc }], limit: 1) {
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
        }
      `

      // console.log(queryString)
      this.$apollo
        .query({
          query: gql`
            ${queryString}
          `,
          variables: {},
          fetchPolicy: 'network-only'
          // fetchPolicy:'no-cache'
        })
        .then(res => {
          console.log(res, 'get project performance list')
          _this.totalPerformance = res.data.Performance_aggregate.aggregate.count
          _this.currentPerformace = res.data.Performance
          const total = {
            total: 0,
            ratios: [],
            project: {
              name: '合计',
              steps: [],
              tasks: [],
              moneys: [],
              moneys_aggregate: {
                aggregate: {
                  sum: {
                    total: 0
                  }
                }
              },
              receipts_aggregate: {
                aggregate: {
                  sum: {
                    amount: 0
                  }
                }
              }
            }
          }
          _this.currentPerformace.forEach(item => {
            total.total += item.total || 0
            total.project.moneys_aggregate.aggregate.sum.total += item.project.moneys_aggregate.aggregate.sum.total || 0
            total.project.receipts_aggregate.aggregate.sum.amount +=
              item.project.receipts_aggregate.aggregate.sum.amount || 0
          })
          _this.currentPerformace.push(total)
          _this.loading = res.loading
        })
        .catch(err => {
          console.log(err)
          _this.totalPerformance = 0
          _this.currentPerformace = []
          _this.loading = false
        })
    },
    async loadPerformanceList2() {
      var _this = this

      var queryString = `
        query {
          Performance_aggregate(where: {${this.performanceWhereString}},order_by:{employee:{name:asc}}) {
            aggregate {
              count
            }
          }

          Performance(
            where: {${this.performanceWhereString}},
            order_by:{employee:{name:asc}}
          ) {
            id
            employee_id
            employee {
              id
              name
            }
            item
            fee
            adjust
            total
            ratios
            project {
              id
              businessType
              projectNo
              client {
                id
                name
              }
              name
              status
              urgentStatus
              accountingDate
              submitAmount
              approvedAmount
              principal {
                id
                name
              }
              steps(where: { name: { _eq: "取回报告书" } }) {
                id
                name
                finishTime
              }
              organizations(where: { type: { _eq: "施工单位" } }) {
                id
                type
                name
              }
              tasks(where: { type: { _eq: 3 } }) {
                name
                childTasks(where: { step: { _eq: 0 } }) {
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
              moneys(order_by: [{ createdAt: asc }], limit: 1) {
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
        }
      `

      // console.log(queryString)

      let res = await this.dbConn.query(queryString)
      _this.totalPerformance = res.data.Performance_aggregate.aggregate.count

      let data = res.data.Performance
      var obj = {}
      var obj2 = {}
      data.forEach(ele => {
        if (obj[ele.employee_id]) {
          ele.rowSpan = 0
          obj2[ele.employee_id].rowSpan++
          obj2[ele.employee_id].allTotal += ele.total || 0
          obj2[ele.employee_id].allFee += ele.fee || 0
          obj[ele.employee_id].push(ele)
        } else {
          obj2[ele.employee_id] = {
            rowSpan: 1,
            allTotal: ele.total || 0,
            allFee: ele.fee || 0
          }
          obj[ele.employee_id] = [ele]
        }
      })
      console.log(obj)
      var newDate = []
      for (var o in obj) {
        obj[o][0].rowSpan = obj2[o].rowSpan
        obj[o][0].allTotal = obj2[o].allTotal
        obj[o][0].allFee = obj2[o].allFee
        newDate = newDate.concat(obj[o])
      }

      console.log(newDate, 'newDate')

      _this.currentPerformace2 = newDate
      // const total = {
      //   total: 0,
      //   ratios: [],
      //   project: {
      //     name: '合计',
      //     steps: [],
      //     tasks: [],
      //     moneys: [],
      //     moneys_aggregate: {
      //       aggregate: {
      //         sum: {
      //           total: 0
      //         }
      //       }
      //     },
      //     receipts_aggregate: {
      //       aggregate: {
      //         sum: {
      //           amount: 0
      //         }
      //       }
      //     }
      //   }
      // }
      // _this.currentPerformace.forEach(item => {
      //   total.total += item.total || 0
      //   total.project.moneys_aggregate.aggregate.sum.total += item.project.moneys_aggregate.aggregate.sum.total || 0
      //   total.project.receipts_aggregate.aggregate.sum.amount +=
      //     item.project.receipts_aggregate.aggregate.sum.amount || 0
      // })
      // _this.currentPerformace.push(total)
      _this.loading = res.loading

      // this.$apollo
      //   .query({
      //     query: gql`
      //       ${queryString}
      //     `,
      //     variables: {},
      //     fetchPolicy: 'network-only'
      //     // fetchPolicy:'no-cache'
      //   })
      //   .then(res => {
      //     console.log(res, 'get project performance list')
      //     _this.totalPerformance = res.data.Performance_aggregate.aggregate.count
      //     _this.currentPerformace = res.data.Performance

      //   })
      //   .catch(err => {
      //     console.log(err)
      //     _this.totalPerformance = 0
      //     _this.currentPerformace = []
      //     _this.loading = false
      //   })
    },
    onSearch(e) {
      console.log(e)
      this.searchValue = e
      this.beforeFilter()
      this.loadList()
    },
    onSearchPerformance(e) {
      console.log(e)
      this.loading = true
      this.searchValuePerformance = e
      this.beforeFilterPerformance()
      if (this.tabkey == 2) {
        this.loadPerformanceList()
      } else if (this.tabkey == 3) {
        this.loadPerformanceList2()
      }
    },
    handleChange(e) {
      this.loading = true
      this.searchDate = e.key
      this.beforeFilter()
      this.loadList()
    },
    tabChange(e) {
      console.log(e)
      const _this = this
      this.tabkey = e
      setTimeout(function() {
        switch (e) {
          case '1': //项目汇总
            if (_this.current.length === 0) {
              _this.loading = true
              _this.loadList()
            }
            break
          case '2': //人员绩效
            if (_this.currentPerformace.length === 0) {
              _this.loading = true
              _this.loadPerformanceList()
            }
            break
          case '3':
            if (_this.currentPerformace2.length === 0) {
              _this.loading = true
              _this.loadPerformanceList2()
            }
        }
      }, 500)
    },
    //项目状态全选
    statusCheckAllChange(e) {
      Object.assign(this, {
        statusCheckedList: e.target.checked ? statusArray : [],
        statusIndeterminate: false,
        statusCheckAll: e.target.checked
      })
      this.loading = true
      this.beforeFilterPerformance()
      this.loadPerformanceList()
      // console.log(this.statusCheckedList,'all project status select')
    },
    //项目状态多选
    statusCheckChange(checkedList) {
      console.log(checkedList, 'a project status select')
      this.statusIndeterminate = !!checkedList.length && checkedList.length < statusArray.length
      this.statusCheckAll = checkedList.length === statusArray.length
      this.loading = true
      this.beforeFilterPerformance()
      this.loadPerformanceList()
    },
    //筛选条件整合
    beforeFilter() {
      var seaString = `` //搜索条件

      if (this.searchValue) {
        seaString = `_or:[
        {projectNo:{_like:"%${this.searchValue}%"}},
        {name:{_like:"%${this.searchValue}%"}},
        {principal:{name:{_like:"%${this.searchValue}%"}}},
        {outcomeDocumentNo:{_like:"%${this.searchValue}%"}}
        ],`
      } else {
        seaString = ''
      }

      if (this.searchDate) {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - parseInt(this.searchDate))
        seaString += `createdAt: {_gte: "${moment(start).format('YYYY-MM-DD HH:mm:ss')}", _lte: "${moment(end).format(
          'YYYY-MM-DD HH:mm:ss'
        )}"}`
      }

      this.whereString = seaString
      return true
    },
    //人员绩效筛选条件整合
    beforeFilterPerformance() {
      var seaString = `` //搜索条件
      if (this.tabkey == 2) {
        if (this.searchValuePerformance) {
          seaString = `_or:[
          {project: {projectNo:{_like:"%${this.searchValuePerformance}%"}}},
          {project: {name:{_like:"%${this.searchValuePerformance}%"}}},
          {project: {accountingDate:{_like:"%${this.searchValuePerformance}%"}}},
          {employee:{name:{_like:"%${this.searchValuePerformance}%"}}},
          {item:{_like:"%${this.searchValuePerformance}%"}}
          ],`
        } else {
          seaString = ''
        }

        if (this.statusCheckedList.length) {
          var _statusString = ''
          this.statusCheckedList.forEach(ele => {
            _statusString += reverseStatusObject[ele] + ','
          })
          seaString += `project: {status:{_in:[${_statusString}]}}`
        } else {
          seaString += `project: {status:{_in:[]}}`
        }
      } else if (this.tabkey == 3) {
        if (this.searchValuePerformance) {
          seaString = `_or:[
            {project: {name:{_like:"%${this.searchValuePerformance}%"}}},
            {employee:{name:{_like:"%${this.searchValuePerformance}%"}}},
            ],`
        } else {
          seaString = ''
        }
      }

      var accountingDate = ''
      if (this.accountingDate.length) {
        // console.log(this.accountingDate)
        accountingDate += '_or:['
        this.accountingDate.forEach(ele => {
          accountingDate += `{project:{accountingDate:{_eq:"${ele}"}}},`
        })
        accountingDate += ']'
        seaString += accountingDate
      }

      // if (this.startDate && this.endDate) {
      //   const end = this.endDate
      //   const start = this.startDate
      //   seaString += `createdAt: {_gte: "${start.format('YYYY-MM-DD HH:mm:ss')}", _lte: "${end.format(
      //     'YYYY-MM-DD HH:mm:ss'
      //   )}"},`
      // }

      this.performanceWhereString = seaString
      console.log(this.performanceWhereString)
      return true
    },
    endDataStartF(date, dateString) {
      this.endDataStart = dateString
      // console.log(date,dateString)
    },
    disabledStartDate(current) {
      console.log(moment(current).format(this.dateFormat), 'current')
      var now = moment(current).format(this.dateFormat)
      if (!this.endDataEnd) {
        return false
      } else {
        return this.endDataEnd < now
      }
      // Can not select days before today and today
      // return current && current < moment().endOf('day');
    },
    disabledEndDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    endDataEndF(date, dateString) {
      this.endDataEnd = dateString
      // console.log(date,dateString)
    },
    //导出项目汇总
    downloadOutline() {
      const { export_json_to_excel } = require('@/vendor/Export2Excel')
      const { export_get_title_time } = require('@/vendor/Export2Excel')
      const { format_json } = require('@/vendor/Export2Excel')
      const tHeader = [
        '项目编号',
        '项目名称',
        '送审金额',
        '审定金额',
        '核减金额(元)',
        '负责人',
        '复核人',
        '工程规模',
        '定案日期',
        '施工单位',
        '应收(元)',
        '已收(元)',
        '收费日期',
        '未收(元)'
      ]
      const filterVal = [
        'projectNo',
        'name',
        'submitAmount',
        'approvedAmount',
        'reduceAmount',
        'principal',
        'reviewName',
        'projectScale',
        'finishTime',
        'organization',
        'moneys_aggregate',
        'receipts_aggregate',
        'createdAt',
        'unReceipt'
      ]

      var nowList = []
      this.current.forEach(record => {
        var reviewName =
          record.tasks.length > 0 && record.tasks[0].childTasks.length > 0
            ? record.tasks[0].childTasks[0].handler.name
            : ''
        var finishTime =
          record.steps.length > 0 && record.steps[0].finishTime
            ? moment(record.steps[0].finishTime).format('MM-DD')
            : ''
        var organization = record.organizations.length > 0 ? record.organizations[0].name : ''
        var obj = {
          projectNo: record.projectNo,
          name: record.name,
          submitAmount: parseFloat(record.submitAmount || 0).toFixed(2),
          approvedAmount: parseFloat(record.approvedAmount || 0).toFixed(2),
          reduceAmount: Math.abs(record.submitAmount - record.approvedAmount).toFixed(2),
          principal: (record.principal || {}).name,
          reviewName: reviewName,
          projectScale: record.projectScale + record.projectScaleUnit,
          finishTime: finishTime,
          organization: organization,
          moneys_aggregate: (record.moneys_aggregate.aggregate.sum.total || 0).toFixed(2),
          receipts_aggregate: (record.receipts_aggregate.aggregate.sum.amount || 0).toFixed(2),
          createdAt: record.moneys.length > 0 ? moment(record.moneys[0].createdAt).format('MM-DD') : '',
          unReceipt: (
            (record.moneys_aggregate.aggregate.sum.total || 0) - (record.receipts_aggregate.aggregate.sum.amount || 0)
          ).toFixed(2)
        }
        nowList.push(obj)
      })

      var merges = []
      const data = format_json(filterVal, nowList)
      const currentdate = export_get_title_time()
      export_json_to_excel(tHeader, data, '项目汇总' + '(' + currentdate + ')', merges)
    },
    //导出项目绩效
    downloadOutline2() {
      const { export_json_to_excel } = require('@/vendor/Export2Excel')
      const { export_get_title_time } = require('@/vendor/Export2Excel')
      const { format_json } = require('@/vendor/Export2Excel')
      const tHeader = [
        '项目编号',
        '项目名称',
        '项目状态',
        '送审金额',
        '审定金额',
        '核减金额(元)',
        '经办人',
        '复核人',
        '定案日期',
        '应收(元)',
        '已收(元)',
        '收费日期',
        '未收(元)',
        '工作项',
        '计提绩效',
        '专业系数',
        '规模系数',
        '难度系数',
        '工期系数',
        '总系数',
        '增减额',
        '核算期'
      ]
      const filterVal = [
        'projectNo',
        'name',
        'status',
        'submitAmount',
        'approvedAmount',
        'reduceAmount',
        'principal',
        'reviewName',
        'finishTime',
        'moneys_aggregate',
        'receipts_aggregate',
        'createdAt',
        'unReceipt',
        'item',
        'total',
        'proRatio',
        'sizeRatio',
        'hardRatio',
        'urgentRatio',
        'totalRatio',
        'adjust',
        'accountingDate'
      ]

      var nowList = []
      this.currentPerformace.forEach(record => {
        // debugger
        var reviewName =
          record.project.tasks.length > 0 && record.project.tasks[0].childTasks.length > 0
            ? record.project.tasks[0].childTasks[0].handler.name
            : ''
        var finishTime =
          record.project.steps.length > 0 && record.project.steps[0].finishTime
            ? moment(record.project.steps[0].finishTime).format('MM-DD')
            : ''
        // var organization = record.organizations.length > 0 ? record.organizations[0].name: ''
        var submitAmount = !record.project.submitAmount ? '' : parseFloat(record.project.submitAmount || 0).toFixed(2)
        var approvedAmount = !record.project.approvedAmount
          ? ''
          : parseFloat(record.project.approvedAmount || 0).toFixed(2)
        var reduceAmount = !record.project.submitAmount
          ? ''
          : Math.abs(record.project.submitAmount - record.project.approvedAmount).toFixed(2)
        var reviewName =
          record.project.tasks.length > 0 && record.project.tasks[0].childTasks.length > 0
            ? record.project.tasks[0].childTasks[0].handler.name
            : ''
        var finishTime =
          record.project.steps.length > 0 && record.project.steps[0].finishTime
            ? moment(record.project.steps[0].finishTime).format('MM-DD')
            : ''
        var unReceipt = (
          (record.project.moneys_aggregate.aggregate.sum.total || 0) -
          (record.project.receipts_aggregate.aggregate.sum.amount || 0)
        ).toFixed(2)
        var proRatio =
          record.ratios.length === 0 ? '' : parseFloat(record.ratios.find(item => item.name === '专业系数').value || 1)
        var sizeRatio =
          record.ratios.length === 0 ? '' : parseFloat(record.ratios.find(item => item.name === '规模系数').value || 1)
        var hardRatio =
          record.ratios.length === 0 ? '' : parseFloat(record.ratios.find(item => item.name === '难度系数').value || 1)
        var urgentRatio =
          record.project.urgentStatus === undefined
            ? ''
            : record.project.urgentStatus === 0
            ? 1
            : record.project.urgentStatus === 1
            ? 1.05
            : 1.1

        var totalRatio =
          record.ratios.length === 0
            ? ''
            : (
                parseFloat(record.ratios.find(item => item.name === '专业系数').value || 1) *
                parseFloat(record.ratios.find(item => item.name === '规模系数').value || 1) *
                parseFloat(record.ratios.find(item => item.name === '难度系数').value || 1)
              ).toFixed(2)

        var obj = {
          projectNo: record.project.projectNo,
          name: record.project.name,
          status: this.statusObject[record.project.status || 0],
          submitAmount: submitAmount,
          approvedAmount: approvedAmount,
          reduceAmount: reduceAmount,
          principal: (record.employee || {}).name || '',
          reviewName: reviewName,
          finishTime: finishTime,
          moneys_aggregate: (record.project.moneys_aggregate.aggregate.sum.total || 0).toFixed(2),
          receipts_aggregate: (record.project.receipts_aggregate.aggregate.sum.amount || 0).toFixed(2),
          createdAt: record.project.moneys.length > 0 ? moment(record.project.moneys[0].createdAt).format('MM-DD') : '',
          unReceipt: unReceipt,
          item: record.item,
          total: parseFloat(record.total).toFixed(2),
          proRatio: parseFloat(proRatio || 1).toFixed(2),
          sizeRatio: parseFloat(sizeRatio || 1).toFixed(2),
          hardRatio: parseFloat(hardRatio || 1).toFixed(2),
          urgentRatio: parseFloat(urgentRatio || 1).toFixed(2),
          totalRatio: parseFloat(totalRatio).toFixed(2),
          adjust: parseFloat(record.adjust || 0).toFixed(2),
          accountingDate: record.project.accountingDate
        }
        nowList.push(obj)
      })
      console.log(nowList)

      var merges = []
      const data = format_json(filterVal, nowList)
      const currentdate = export_get_title_time()
      export_json_to_excel(tHeader, data, '项目绩效' + '(' + currentdate + ')', merges)
    },
    //导出人员绩效
    downloadOutline3() {
      const { export_json_to_excel } = require('@/vendor/Export2Excel')
      const { export_get_title_time } = require('@/vendor/Export2Excel')
      const { format_json } = require('@/vendor/Export2Excel')
      const tHeader = [
        '姓名',
        '项目名称',
        '业务类型',
        '项目状态',
        '工作项',
        '工程造价',
        '提成造价',
        '核算期',
        '项目合计数',
        '任务合计数',
        '造价合计',
        '提成合计'
      ]
      const filterVal = [
        'name',
        'projectName',
        'businessType',
        'status',
        'item',
        'fee',
        'total',
        'accountingDate',
        'projectTotal',
        'taskTotal',
        'feeTotal',
        'allTotal'
      ]

      var nowList = []
      var merges = []
      this.currentPerformace2.forEach((record,index) => {
        var status = this.statusObject[record.project.status || 0]

        var col= [0,8,9,10,11]
        if(record.rowSpan){
          col.forEach(e =>{
            var obj = {s: {//s为开始
                    c: e,//开始列
                    r: index+1//开始取值范围
                },
                e: {//e结束
                    c: e,//结束列
                    r: index + record.rowSpan//结束范围
                }}
                merges.push(obj)
          })
          
         
            
        }

        var obj = {
          name: record.employee.name,
          projectName: record.project.name,
          businessType: record.project.businessType,
          status: status,
          item: record.item,
          fee: parseFloat(record.fee).toFixed(2),
          total: parseFloat(record.total).toFixed(2),
          accountingDate: record.project.accountingDate,
          projectTotal: parseFloat(record.rowSpan).toFixed(2),
          taskTotal: parseFloat(record.taskTotal || 0).toFixed(2),
          feeTotal: parseFloat(record.allFee||0).toFixed(2),
          allTotal: parseFloat(record.allTotal||0).toFixed(2)
        }
        nowList.push(obj)
      })
      console.log(nowList,merges)

      
      const data = format_json(filterVal, nowList)
      const currentdate = export_get_title_time()
      export_json_to_excel(tHeader, data, '人员绩效' + '(' + currentdate + ')', merges)
    }
  },
  watch: {
    moduleType(newT, oldT) {
      //模块切换
      console.log(newT, oldT, 'moduleType')
    },
    submitAmountStart(val) {
      if (!/^\d*\.?\d{0,2}$/.test(val)) {
        //不是数值清空
        this.submitAmountStart = ''
      }
    },
    submitAmountEnd(val) {
      if (!/^\d*\.?\d{0,2}$/.test(val)) {
        //不是数值清空
        this.submitAmountEnd = ''
      }
    },
    approvedAmountStart(val) {
      if (!/^\d*\.?\d{0,2}$/.test(val)) {
        //不是数值清空
        this.approvedAmountStart = ''
      }
    },
    approvedAmountEnd(val) {
      if (!/^\d*\.?\d{0,2}$/.test(val)) {
        //不是数值清空
        this.approvedAmountEnd = ''
      }
    }
  }
}
</script>

<style>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.leftInput {
  position: absolute;
  z-index: 9;
  width: 90%;
  border-radius: unset;
  left: 2px;
  outline: 0;
  box-shadow: none;
  height: 28px;
  top: 2px;
  border: 0;
}
.leftInput:hover {
  box-shadow: none;
  border-color: #fff;
}
.leftInput:focus {
  border-color: #fff;
  outline: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.rightSelect {
  width: 100%;
}

.ProjectType .ant-modal-body {
  padding: 15px;
}

.ProjectType .ant-modal-footer {
  border-top: 0px;
  text-align: center;
}
.custom-filter-dropdownS {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.reportList .ant-table-bordered .ant-table-thead > tr > th,
.reportList .ant-table-bordered .ant-table-tbody > tr > td {
  /* border-right: 1px solid #e8e8e8; */
  font-size: 13px;
}
/* .projectList .leftInput:hover {

} */
</style>
