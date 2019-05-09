<template>
  <div class="projectList">
    <a-card :bordered="false" :body-style="{padding: '10px',minWidth:'1150px'}">
      <a-tabs
        default-active-key="1"
        size="large"
        :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
      >
        <a-tab-pane loading="true" :tab="title" key="1">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <a-button type="primary" icon="plus" @click="createProject(true)" v-if="$auth('add-project')">创建项目</a-button>
            </a-col>

            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{float: 'right',width: '80%',maxWidth:'450px'}">
                <a-button
                  type="primary"
                  icon="search"
                  :style="{width:'25%'}"
                  @click="employeeTreeShow"
                >选择部门</a-button>
                <a-input-search
                  :style="{width:'75%'}"
                  v-model="searchValue"
                  placeholder="项目编号、项目名称、项目负责人、备注"
                  @search="onSearch"
                  enterButton="搜索"
                />
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
              :pagination="pagination"
              :scroll="{ x: 2000 }"
              :customRow="changeRow"
              @change="tableChange"
              class="project-list-table"
            >
              <!-- <a slot="description" slot-scope="text" href="javascript:;">{{ text }}</a> -->

              <!-- 合同名称slot -->
              <div slot="name" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  style="width:300px;display: block;"
                  :title="record.name"
                  @click="goProjectDetail(record,1)"
                >{{ record.name }}</a>

                <span style="position:absolute;right:-5px;top:0px">
                  <a v-if="record.urgentStatus">
                    <a-icon
                      type="thunderbolt"
                      :theme="record.urgentStatus == 1 ? 'outlined':'filled'"
                      :style="{color:urgentObject[record.urgentStatus].color,fontSize:'14px'}"
                      :title="urgentObject[record.urgentStatus].name"
                    />
                  </a>
                  <a v-if="isShowFavarios(1,record)">
                    <a-icon
                      type="heart"
                      theme="filled"
                      style="color:#ff5738;font-size:14px"
                      @click="changeStar(1,1,record,index)"
                      title="快捷面板"
                    />
                  </a>
                  <a v-else-if="moveStar == record.projectNo">
                    <a-icon type="heart" style="font-size:14px" @click="changeStar(1,2,record,index)"  title="快捷面板"/>
                  </a>
                  <a v-if="isShowFavarios(0,record)">
                    <a-icon
                      type="star"
                      theme="filled"
                      style="color:#ffaf38;font-size:14px"
                      @click="changeStar(0,1,record,index)"
                      title="收藏"
                    />
                  </a>
                  <a v-else-if="moveStar == record.projectNo">
                    <a-icon type="star" style="font-size:14px" @click="changeStar(0,2,record,index)"  title="收藏"/>
                  </a>
                  
                  <a v-if="$auth('check-contract') && record.contract"  @click="goContractDetail(record)">
                    <a-icon type="link"/>
                  </a>
                </span>
              </div>

              <!-- 业务类型筛选 -->
              <div slot="businessType" slot-scope="text,record,index" style="position:relative"> 
                <span
                    href="javascript:;"
                    class="ellipsis"
                    style="width:150px;display: block;"
                    :title="record.businessType"
                  >{{ record.businessType }}
                </span>
              </div>
              <div
                slot="businessTypeFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="业务类型"
                  v-model="businessTypeVisibled"
                  :maskClosable="maskClosabled"
                  okText="确认"
                  cancelText="取消"
                  @ok="tableFilter(1,setSelectedKeys,confirm,clearFilters)"
                  class="ProjectType"
                >
                  <a-row>
                    <a-col :span="24">
                      <a-checkbox
                        :indeterminate="BusIndeterminate"
                        @change="BusCheckAllChange"
                        :checked="BusCheckAll"
                      >全选</a-checkbox>
                    </a-col>
                    <a-checkbox-group @change="BusCheckChange" v-model="BusCheckedList">
                      <a-col :span="12" v-for="(item,index) in BusinessType" :key="index">
                        <a-checkbox :value="item">{{ item }}</a-checkbox>
                      </a-col>
                    </a-checkbox-group>
                  </a-row>
                </a-modal>
              </div>

              <!-- 项目类型筛选 -->
              <div
                slot="ProjectTypeFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="请选择或填写要查询的项目类型"
                  v-model="ProjectTypeVisibled"
                  :maskClosable="maskClosabled"
                  class="ProjectType"
                >
                  <a-row>
                    <a-col :span="24">
                      <div style="position:relative;margin:0 80px">
                        <a-input v-model="ProjectTypeValue" class="leftInput"/>
                        <a-select class="rightSelect" v-model="ProjectTypeValue">
                          <a-select-option key="1" value="银行">银行</a-select-option>
                        </a-select>
                      </div>
                    </a-col>
                  </a-row>
                  <template slot="footer">
                    <a-button key="submit" type="primary" @click="tableFilter(2)">确认</a-button>
                    <a-button key="empty" @click="tableFilterEmpty(2)">清空</a-button>
                  </template>
                </a-modal>
              </div>

              <!-- 送审金额筛选 -->
              <div
                slot="submitAmountFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="请填写送审金额查询范围"
                  v-model="submitAmountVisibled"
                  :maskClosable="maskClosabled"
                  class="ProjectType"
                >
                  <a-row>
                    <a-col :span="4" style="line-height: 30px;text-align: right;">送审金额：</a-col>
                    <a-col :span="9">
                      <a-input v-model="submitAmountStart"/>
                    </a-col>
                    <a-col :span="1" style="line-height: 30px;text-align: center;">至</a-col>
                    <a-col :span="9">
                      <a-input v-model="submitAmountEnd"/>
                    </a-col>
                  </a-row>
                  <template slot="footer">
                    <a-button key="submit" type="primary" @click="tableFilter(3)">确认</a-button>
                    <a-button key="empty" @click="tableFilterEmpty(3)">清空</a-button>
                  </template>
                </a-modal>
              </div>

              <!-- 审定金额筛选 -->
              <div
                slot="approvedAmountFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="请填写审定金额查询范围"
                  v-model="approvedAmountVisibled"
                  :maskClosable="maskClosabled"
                  class="ProjectType"
                >
                  <a-row>
                    <a-col :span="4" style="line-height: 30px;text-align: right;">审定金额：</a-col>
                    <a-col :span="9">
                      <a-input v-model="approvedAmountStart"/>
                    </a-col>
                    <a-col :span="1" style="line-height: 30px;text-align: center;">至</a-col>
                    <a-col :span="9">
                      <a-input v-model="approvedAmountEnd"/>
                    </a-col>
                  </a-row>
                  <template slot="footer">
                    <a-button key="submit" type="primary" @click="tableFilter(4)">确认</a-button>
                    <a-button key="empty" @click="tableFilterEmpty(4)">清空</a-button>
                  </template>
                </a-modal>
              </div>

              <!-- 已回款/咨询筛选 -->
              <div
                slot="backAsckFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="请填写咨询费查询范围"
                  v-model="backAsckVisibled"
                  :maskClosable="maskClosabled"
                  class="ProjectType"
                >
                  <a-row>
                    <a-col :span="4" style="line-height: 30px;text-align: right;">咨询费：</a-col>
                    <a-col :span="9">
                      <a-input v-model="backAsckStart"/>
                    </a-col>
                    <a-col :span="1" style="line-height: 30px;text-align: center;">至</a-col>
                    <a-col :span="9">
                      <a-input v-model="backAsckEnd"/>
                    </a-col>
                  </a-row>
                  <template slot="footer">
                    <a-button key="submit" type="primary" @click="tableFilter(5)">确认</a-button>
                    <a-button key="empty" @click="tableFilterEmpty(5)">清空</a-button>
                  </template>
                </a-modal>
              </div>

              <!-- 截止日期筛选 -->
              <div
                slot="endDataFilter"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="请选择时间段"
                  v-model="endDataVisibled"
                  :maskClosable="maskClosabled"
                  class="ProjectType"
                >
                  <a-row>
                    <a-col :span="11">开始日期：
                      <a-date-picker
                        style="width:63%"
                        @change="endDataStartF"
                        :disabledDate="disabledStartDate"
                      />
                    </a-col>
                    <a-col :span="1" style="line-height: 32px;text-align: center;">至</a-col>
                    <a-col :span="11">结束日期：
                      <a-date-picker style="width:63%" @change="endDataEndF"/>
                    </a-col>
                  </a-row>
                  <template slot="footer">
                    <a-button key="submit" type="primary" @click="tableFilter(6)">确认</a-button>
                    <a-button key="empty" @click="tableFilterEmpty(6)">清空</a-button>
                  </template>
                </a-modal>
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
                <span
                  :style="{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',marginRight:'5px',backgroundColor:statusColor[record.status||0]}"
                ></span>
                <span>{{ statusObject[record.status||0] }}</span>
              </div>

              <!-- 项目备注处理 -->
              <div slot="remark" slot-scope="text,record,index">
                <a-input
                  v-model="record.remark"
                  placeholder="点击输入备注"
                  style="width:80%;border: none;box-shadow: none;font-size:12px;height: 19px; padding: 0px 2px;border-radius: 0px;"
                  @blur="projectRemarkChange(record,$event)"
                />
              </div>

              <!-- 操作 -->
              <span slot="action" slot-scope="text,record,index">
                <a class="font-blue" style="margin-right:5px">讨论</a>
                <a class="font-blue" style="margin-right:5px" @click="finishDilogShow(record)" v-if="$auth('file-project')">归档</a>
                <a class="font-blue" style="margin-right:5px" @click="goProjectDetail(record,8)" v-if="$auth('project-money')">核算</a>
                <a-dropdown :trigger="['click']" v-if="$auth('add-child-project') || $auth('delete-project')">
                  <a class="ant-dropdown-link" href="#">
                    <a-icon type="down-circle" style="font-size:16px;color:#999"/>
                  </a>
                  <a-menu slot="overlay">
                    <!-- <a-menu-item key="3" v-if="$auth('add-child-project')">
                      <a @click="createChildren">
                        <a-icon type="share-alt"/>创建子项目
                      </a>
                    </a-menu-item> -->
                    <a-menu-item key="5" v-if="$auth('delete-project')">
                      <a @click="deleteProject(record)"  >
                        <a-icon type="delete"/>删除项目
                      </a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </a-table>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 项目归档 -->
    <FinishDialog
      inititle="项目归档"
      :inivisible="finishVisible"
      :maskClosable="false"
      :businessType="currentProject.businessType"
      @changeStatus="finishDialogStatus"
    />
    <!-- 人员弹框 -->
    <employee-tree
      :inititle="employeeTitle"
      :inivisible="employeeVisibled"
      :type="employeeType"
      @changeStatus="employeeTreeStatus"
    />
  </div>
</template>

<script>
// import { getServiceList } from '@/api/manage'

import {db} from '@/utils/db'
import gql from 'graphql-tag'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { mapState, mapMutations } from 'vuex'
import FinishDialog from '@/components/dialog/project/finishDialog'
import employeeTree from '@/components/same/employeeTree'

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
  '审核进度款',
  '项目复审复核',

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
   '未开始': 0,
   '进行中': 1,
   '已完成': 2,
   '已归档': 3,
   '暂停': 4,
   '延期': 5,
   '延误': 6
  }

const statusColor = {
  0: '#ccc',
  1: '#78bb60',
  2: '#f09a5d',
  3: '#e2b241',
  4: '#8bb8f1',
  5: '#f09a5d',
  6: '#f09a5d'
}
const statusArray = ['未开始', '进行中', '已完成', '已归档', '暂停', '延期', '延误']

export default {
  name: 'project-list',
  props: {
    title: {
      type: String,
      default: ''
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
      pageSizeOptions: ['10', '20', '30'],

      total: 0,
      currentPageSize: 20, //表格页的列数
      defaultCurrent: 1, //表格当前页
      sortParams: {}, //排序参数
      queryParam: {},
      current: [],
      pagination: {},
      paramsName: {},

      currentProject:{}, //当前项目
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

      statusIndeterminate: true, //全选/不选中间值
      statusCheckAll: false, //项目状态是否全选
      statusCheckedList: statusArray.filter(e => e != '已归档'), //已选择的业务类型
      // statusVisibled: false,

      finishVisible: false, //归档弹框是否显示

      employeeTitle: '选择组织', //部门弹框标题
      employeeVisibled: false, //部门弹框是否显示
      employeeType: 2, //部门弹框类型（人员/部门）

      moveStar: '', //移入行是否显示星星

      whereString: '', //筛选条件
      order_by:[{isFavorite:"desc_nulls_last"},{createdAt:"desc_nulls_last"}],
      order_byString: '', //排序条件
      // selectedIndex: -1,
      modal1Visible: false,
      value: 2,
      searchValue:'',
      urgentObject:{
        0:{name:'正常',color:'#78bb61'},
        1:{name:'赶工',color:'#78bb60'},
        2:{name:'加急',color:'#ff5738'}
      },
      // 表头项目编号，项目名称，业务类型，负责人，项目类型，送审金额，审定金额，已回款/咨询，截止日期，项目状态，项目进展，项目备注，操作（讨论 归档 核算 创建子项目 删除）
      columns: [
        {
          title: '项目编号',
          dataIndex: 'projectNo',
          sorter: true
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          sorter: true,
          width: '350px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '业务类型',
          dataIndex: 'businessType',
          scopedSlots: {
            filterDropdown: 'businessTypeFilter',
            customRender: 'businessType'
          },
          onFilterDropdownVisibleChange: visible => {
            console.log(visible)
            if (visible) {
              this.businessTypeVisibled = visible
            }
          }
        },
        {
          title: '负责人',
          dataIndex: 'principal',
          sorter: true,
          align: 'center',
          customRender: text => (text||{}).name || ''
        },
        {
          title: '项目类型',
          dataIndex: 'projectType',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'ProjectTypeFilter',
            customRender: 'ProjectType'
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              this.ProjectTypeVisibled = visible
            }
          }
        },
        {
          title: '送审金额',
          dataIndex: 'submitAmount',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'submitAmountFilter',
            customRender: 'submitAmount'
          },
          customRender: (text,record) => {
            return {
              children: parseFloat(record.submitAmount || 0).toFixed(2)
            }
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              this.submitAmountVisibled = visible
            }
          }
        },
        {
          title: '审定金额',
          dataIndex: 'approvedAmount',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'approvedAmountFilter',
            customRender: 'approvedAmount'
          },
          customRender: (text,record) => {
            return {
              children: parseFloat(record.approvedAmount || 0).toFixed(2)
            }
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              this.approvedAmountVisibled = visible
            }
          }
        },
        {
          title: '已回款/咨询',
          dataIndex: 'backAsck',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'backAsckFilter',
            // customRender: 'backAsck'
          },
          customRender: (value,record) => {
            // debugger
            let s = ''
            let total = 0
            let totalReceipt = 0
            if (record) {
              // record.forEach(ele => {
                // total += record.moneys_aggregate.aggregate.sum.total
                // totalReceipt += record.receipts_aggregate.aggregate.sum.amount
              // })
              s = `${(record.money||0).toFixed(2)}/${(record.receipt||0).toFixed(2)}`
            }
            return {
              children: s,
              attrs: {}
            }
          },
          onFilterDropdownVisibleChange: visible => {
            console.log(visible)
            if (visible) {
              this.backAsckVisibled = visible
            }
          }
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'endDataFilter',
            customRender: 'endDate'
          },
          onFilterDropdownVisibleChange: visible => {
            console.log(visible)
            if (visible) {
              this.endDataVisibled = visible
            }
          },
          customRender: (value,record) => {
            var s = value
            if(value){
              s = this.moment(value).format('YYYY-MM-DD')
            }
            return {
              children:s,
              attr:{}
            }
          }
        },

        {
          title: '项目状态',
          dataIndex: 'status',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'statusFilter',
            customRender: 'status'
          },
          onFilterDropdownVisibleChange: visible => {
            console.log(visible)
          }
        },
        {
          title: '项目进展',
          dataIndex: 'stepName',
          scopedSlots: {
            customRender: 'steps'
          },
          customRender:(text,record) => {
            let value = record.stepName
            if(record.status == 4){
              value  = record.reason
            }
            if(record.fStepName){
              value += '/' + record.fStepName
            }
            return {
              children:<div title={value} style="max-width:120px;overflow:hidden;text-overflow:ellipsis; white-space: nowrap;">{value}</div>
            }
          }
        },
        {
          title: '项目备注',
          dataIndex: 'remark',
          scopedSlots: {
            customRender: 'remark'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'right',
          width: '150px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  components: {
    FinishDialog,
    employeeTree
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
    console.log(this.globalProjectId,'globalProjectId')
    // console.log(moment().endOf('day'))
    // console.log()
    this.loading = true
    this.beforeFilter()
    this.order_byString = this.orderByS(this.order_by)
    this.currentPageSize = this.$ls.get('pageSize')
    this.loadList()
  },
  mounted(){
    console.log(this.$ls.get('pageSize'),'mouted')
    this.currentPageSize = this.$ls.get('pageSize')
    
  },
  methods: {
    moment,
    ...mapMutations(['set_project']),
    //接口获取数据
    loadList() {
      var _this = this
      var skip = (this.defaultCurrent - 1) * this.currentPageSize

      var queryString = `
        query project($skip: Int!, $pageSize: Int!) {
          projectex_aggregate(
            args: { empid: "${this.userInfo.id}" }
            where: {${_this.whereString}}
          ) {
            aggregate {
              count
            }
          }

          projectex(
            args: { empid: "${this.userInfo.id}" }
            where: {${_this.whereString}},
            order_by:${this.order_byString} ,
            offset: $skip, 
            limit: $pageSize
          ) {
            id
            contract {
              id
              name
            }
            businessType
            projectType
            projectNo
            urgentStatus
            name
            principal {
              id
              name
            }
            approvedAmount
            submitAmount
            status
            money
            remark
            stepName
            reason
            fStepName
            endDate
            isFavorite
            isQuick
          }
        }
      `
      
      // console.log(queryString)
      this.$apollo
        .query({
          query: gql`${queryString}`,
          variables: {
            skip: parseInt(skip),
            pageSize: parseInt(this.currentPageSize)
          },
          // fetchPolicy: 'network-only'
          fetchPolicy:'no-cache'
        })
        .then(res => {
          console.log(res, 'get project list')
          _this.total = res.data.projectex_aggregate.aggregate.count
          _this.current = res.data.projectex

          // _this.current.forEach(ele => {
          //   ele.principal = ele.principal || {}
          //   ele.stepsString = ''
          //   ele.steps.forEach(sE => {
          //     if (sE.status == 1) {
          //       ele.stepsString = sE.name
          //     }
          //   })
          // })
          _this.pagination = _this.pager()
          _this.loading = res.loading
        })
        .catch(err => {
          console.log(err)
          _this.total = 0
          _this.defaultCurrent = 1
          _this.current = []
          _this.pagination = _this.pager()
          _this.loading = false
        })
    },

    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      this.currentPageSize = pageSize
      this.loading = true
      this.loadList()
      // console.log(page, pageSize,'changePager')
      // this.loadData({ pageNum: page })
    },
    onPagerSizeChange(current, size) {
      // console.log(current, size,'changeSize');
      // debugger
      this.defaultCurrent = current
      this.currentPageSize = size
      this.loading = true
      this.loadList()
      // this.loadData({ pageSize: size })
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
        // onChange: this.onPagerChange,
        // onShowSizeChange: this.onPagerSizeChange
      }
    },

    onSearch(e) {
      console.log(e)
      this.searchValue = e
      this.defaultCurrent = 1
      this.beforeFilter()
      this.loadList()
    },
    //表格单元格自定义函数
    changeRow(record, index) {
      return {
        props: {},
        style: {
          // backgroundColor:this.selectedIndex == index ? 'yellow':''
        },
        attrs: {
          id: record.projectNo
        },
        ref: record.projectNo,
        // refInFor: true,
        on: {
          // 事件
          click: () => {
            // 鼠标移入行,改变状态
            var allChildren = document.getElementById(record.projectNo).parentNode.children
            this.set_project(record)
            console.log(this.globalProjectId)
            for (var i = 0; i < allChildren.length; i++) {
              if (i == index) {
                // console.log(allChildren[i].className = allChildren[i].className + ' dd' )
                allChildren[i].style.backgroundColor = '#ffe48d'
              } else {
                allChildren[i].style.backgroundColor = 'white'
              }
            }
          },
          mouseover: () => {
            // 鼠标移入行,改变状态
            // console.log(record,index,'index2')

            this.moveStar = record.projectNo
            // console.log(this.dataset)
          },
          mouseout: () => {
            // 鼠标移入行,改变状态
            // console.log(record,index,'index3')
            this.moveStar = false
          }
        }
      }
    },
    //置顶事件
    async changeStar(type,type2, record, index) {

      console.log(record)
      var _this = this
      
      var updateString = ``
      if (type2 == 2) {
        updateString = `insert_FavoriteProject(
          objects: {
            project_id: "${record.id}"
            empolyee_id: "${this.userInfo.id}",
            type:${type}
          }
        ) {
          returning {
            id
          }
        }`
      } else {
         updateString = `delete_FavoriteProject(
            where: {
              project_id:{_eq:"${record.id}"},
              empolyee_id: {_eq:"${this.userInfo.id}"},
              type:{_eq:${type}}
            }
          ) {
            returning {
              id
            }
          }
        `
        console.log(updateString)
      }
      let res = await _this.mutateApollo(updateString)
      _this.loadList()
    
    },
    //显示收藏和快捷面板
    isShowFavarios(type,record){
      // let favoritePersons = record.favoritePersons.filter(e => e.empolyee_id == this.userInfo.id && e.type == type)
      if(type == 0){
        if(record.isFavorite == 1){
          return true
        }else {
          return false
        }
      }else {
        if(record.isQuick == 1){
          return true
        }else {
          return false
        }
      } 
      
    },


    // async changeHeart(type,record,index){
    //   var isQuick
    //   var _this = this
    //   if (type == 2) {
    //     isQuick = true
    //   } else {
    //     isQuick = false
    //   }
    //   var updateString = `update_Project(where:{id:{_eq:"${record.id}"}},_set:{isQuick:${isQuick}}){returning{id,isQuick}}`
    //   let res = await _this.mutateApollo(updateString)
    //   console.log(res)
    //   // _this.$message.success('加入快捷面板成功')
    //   if(isQuick){
    //     _this.$message.success('加入快捷面板成功')
    //   }else {
    //     _this.$message.success('取消加入快捷面板成功')
    //   }
    //   _this.loadList()
    // },

    //分页、排序、筛选变化时触发
    tableChange(pagination, filters, sorter) {
      console.log(pagination,sorter)

      this.defaultCurrent = pagination.current
      this.currentPageSize = pagination.pageSize

      this.$ls.set('pageSize',this.currentPageSize)
      this.order_by=[{isFavorite:"desc_nulls_last"}]
      
      if(Object.keys(sorter || {}).length){
        var obj = {}
        if(sorter.order == "descend"){
          obj[sorter.field] = "desc_nulls_last"
        }else {
          obj[sorter.field] = "asc_nulls_last"
        }
        this.order_by.push(obj)
      }else {
        this.order_by=[{isFavorite:"desc_nulls_last"},{createdAt:"desc_nulls_last"}]
      }
      
      this.order_byString = this.orderByS(this.order_by)
      console.log( this.order_byString,'tablechange')
      this.loadList()

      // console.log(JSON.stringify(this.order_by))
    },
    //排序
    orderByS(data){
      console.log(data,'orderBys')
      var order_byS = '[{'
      this.order_by.forEach(ele => {
        if(Object.keys(ele)[0] == 'principal'){
          order_byS += `principal:{name:${ele[Object.keys(ele)[0]]}},`
        }else {
          order_byS += `${Object.keys(ele)[0]}:${ele[Object.keys(ele)[0]]},`
        }
      })
      order_byS += '}]'
      return order_byS
    },

    //业务类型全选
    BusCheckAllChange(e) {
      Object.assign(this, {
        BusCheckedList: e.target.checked ? BusinessType : [],
        BusIndeterminate: false,
        BusCheckAll: e.target.checked
      })
    },
    //业务类型选择
    BusCheckChange(checkedList) {
      this.BusIndeterminate = !!checkedList.length && checkedList.length < BusinessType.length
      this.BusCheckAll = checkedList.length === BusinessType.length
      this.BusCheckedList = checkedList
    },

    //项目状态全选
    statusCheckAllChange(e) {
      
      Object.assign(this, {
        statusCheckedList: e.target.checked ? statusArray : [],
        statusIndeterminate: false,
        statusCheckAll: e.target.checked
      })
      this.beforeFilter(this.statusCheckedList)
      this.defaultCurrent = 1
      this.loadList()
      // console.log(this.statusCheckedList,'all project status select')

    },
    //项目状态多选
    statusCheckChange(checkedList) {
      console.log(checkedList,'a project status select')
      this.statusIndeterminate = !!checkedList.length && checkedList.length < statusArray.length
      this.statusCheckAll = checkedList.length === statusArray.length
      this.beforeFilter(this.statusCheckedList)
      this.defaultCurrent = 1
      this.loadList()
    },

    //筛选
    tableFilter(type,setSelectedKeys,confirm,clearFilters) {
      console.log('submit', type)
      // this.beforeFilter()
      this.loading = true
     
      if (!this.beforeFilter()) {
        return
      }
      this.defaultCurrent = 1
      // debugger
      if(setSelectedKeys){
        setSelectedKeys([this.whereString])
        confirm()
      }else {
        this.loadList()
      }
      
     
      // this.loadList()
      switch (type) {
        case 1: //业务类型
          this.businessTypeVisibled = false
          if(this.BusCheckedList.length = this.BusinessType.length){
            clearFilters()
          }
          // console.log(this.BusCheckedList.join(','))
          break
        case 2: //项目类型
          this.ProjectTypeVisibled = false
          break
        case 3: //送审金额
          this.submitAmountVisibled = false
          break
        case 4: //审定金额
          this.approvedAmountVisibled = false
          break
        case 5: //回款金额
          this.backAsckVisibled = false
          break
        case 6: //截止时间
          this.endDataVisibled = false
          break
      }
    },
    //清空
    tableFilterEmpty(type) {
      console.log('clear', type)
      switch (type) {
        case 2: //项目类型
          this.ProjectTypeVisibled = false
          this.ProjectTypeValue = ''
          break
        case 3: //送审金额
          this.submitAmountVisibled = false
          this.submitAmountStart = ''
          this.submitAmountEnd = ''
          break
        case 4: //审定金额
          this.approvedAmountVisibled = false
          this.approvedAmountStart = ''
          this.approvedAmountEnd = ''
          break
        case 5: //回款金额
          this.backAsckVisibled = false
          break
        case 6: //截止时间
          this.endDataVisibled = false
          this.endDataStart = ''
          this.endDataEnd = ''
          break
      }
      this.beforeFilter()
      this.defaultCurrent = 1
      this.loadList()
    },

    //筛选条件整合
    beforeFilter() {
      var busString = `` //业务类型条件
      var proString = `` //项目类型条件
      var subString = `` //送审金额条件
      var appString = `` //审定金额条件
      var backString = `` //回款金额条件
      var endString = `` //截止时间条件
      var depString = `` //部门条件
      var seaString = `` //搜索条件
      var statusString = `` //项目状态条件

      var authorString = `` //项目负责人

      if(!this.$auth('check-all-project')){
        authorString = `{_or:[{principal_id:{_eq:"${this.userInfo.id}"}} ,{members:{member_id:{_eq:"${this.userInfo.id}"}}},{chargers:{charger_id:{_eq:"${this.userInfo.id}"}}}]}`
      }
      console.log(authorString,'authorString')


      if (this.BusCheckedList.length == 0) {
        busString = `{businessType:{_eq:""}},`
      } else {
        busString = `{_or:[`
        this.BusCheckedList.forEach(be => {
          busString += `{businessType:{_like:"%${be}%"}},`
        })
        busString += ']},'
      }

      if (this.ProjectTypeValue) {
        proString = `{projectType:{_like:"%${this.ProjectTypeValue}%"}},`
      }

      if (this.submitAmountStart || this.submitAmountStart) {
        if (parseInt(this.submitAmountStart) > parseInt(this.submitAmountEnd)) {
          this.$message.error('数值错误')
          return false
        }
        subString = `{_and:[${this.submitAmountStart ? `{submitAmount:{_gte:${this.submitAmountStart}}},` : ``}${
          this.submitAmountEnd ? `{submitAmount:{_lte:${this.submitAmountEnd}}},` : ``
        }]}`
      }

      if (this.approvedAmountStart || this.approvedAmountStart) {
        if (parseInt(this.approvedAmountStart) > parseInt(this.approvedAmountEnd)) {
          this.$message.error('数值错误')
          return false
        }
        appString = `{_and:[${this.approvedAmountStart ? `{approvedAmount:{_gte:${this.approvedAmountStart}}},` : ``}${
          this.approvedAmountEnd ? `{approvedAmount:{_lte:${this.approvedAmountEnd}}},` : ``
        }]}`
      }

      if (this.endDataStart || this.endDataEnd) {
        endString += `{_and:[`
        if(this.endDataStart){
          endString += `{endDate:{_gt:"${this.endDataStart}"}}`
        }
        if(this.endDataEnd){
          endString += `{endDate:{_lt:"${this.endDataEnd}"}}`
        }
        endString += `]}`
      }

      if(this.statusCheckedList.length){
        var _statusString = ''
        this.statusCheckedList.forEach(ele => {
          _statusString += reverseStatusObject[ele] + ','
        })
        statusString = `{status:{_in:[${_statusString}]}}`
      }else {
        statusString = `{status:{_in:[]}}`
      }

      var defaultString = `
        {_or:[
          {principal_id:{_eq:"${this.userInfo.id}"}},
          {members:{member_id:{_eq:"${this.userInfo.id}"}}},
          {chargers:{charger_id:{_eq:"${this.userInfo.id}"}}}
          {createdBy_id:{_eq:"${this.userInfo.id}"}}
        ]}
      `
      if(this.$auth('check-all-project')){
        defaultString = ``
      }


      if(this.searchValue){
        seaString = `{_or:[{projectNo:{_like:"%${this.searchValue}%"}},{name:{_like:"%${this.searchValue}%"}},{remark:{_like:"%${this.searchValue}%"}},{principal:{name:{_like:"%${this.searchValue}%"}}}]}`
      }else {
        seaString = ''
      }

      var str = `_and: [
        ${busString}
        ${proString}
        ${subString}
        ${appString}
        ${statusString}
        ${defaultString}
        ${authorString}
        ${seaString}
        ${endString}
      ]`
      console.log(str, defaultString,'striing-------------------------')
      this.whereString = str
      return true
    },

    //归档弹框隐藏
    async finishDialogStatus(obj) {
      console.log(obj, 'finish')
      this.finishVisible = obj.visibled
      if((obj.data||[]).length){
        
        var mutationString  = `
          mutation {
            update_Project(where:{id:{_eq:"${this.currentProject.id}"}},_set:{
              documentNo:"${obj.data[0].documentNo}"
              outcomeDocumentNo: "${obj.data[0].outcomeDocumentNo}"
              documentCheck: "${obj.data[0].documentCheck}"
              status:3
            }){returning{id}}
             insert_Summary(objects:[
                  { content: "调整项目状态为已归档", createdBy_id: "${this.userInfo.id}",project_id:"${this.currentProject.id}"}]){returning{id}}
          }
        `
        let res = await this.dbConn.mutation(mutationString)
        this.loadList()
        // console.log(res)
      }


    },
    //归档弹框显示
    finishDilogShow(record) {
      this.finishVisible = true
      this.currentProject = record
    },

    //部门弹框结束操作
    employeeTreeStatus(obj) {
      this.employeeVisibled = obj.visibled
    },
    // 部门弹框显示
    employeeTreeShow() {
      this.employeeVisibled = true
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

    //跳进创建项目界面
    createProject(bol) {
      if (bol) {
        this.$emit('changeCom', { type: this.value })
      }
      this.modal1Visible = false
    },
    //跳转到合同详情界面
    // goContractDetail(params) {
    //   console.log(params)
    //   // this.$emit('changeCom', { type: 5, params: params })
    // },
    //跳转到项目详情页面的内部核算标签页
    goProjectDetail(params,type) {
      this.$emit('changeCom', { type: 5, tapType: type, params: params })
    },

    //删除项目
    deleteProject(record) {
      var _this = this
      this.$confirm({
        title: '删除项目',
        content: `你确定删除项目【${record.name}】吗？`,
        onOk() {
          console.log('删除项目', record)
          var mutationString = `
          delete_ProjectCharger(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Comment(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Invoice(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Money(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Organization(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_ProjectPause(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_ProjectMember(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Performance(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Plan(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Receipt(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Step(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Summary(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Task(where:{project_id:{_eq:"${record.id}"}}){returning{id}}
          delete_Document(where:{relatedId:{_eq:"${record.id}"}}){returning{id}}
          delete_Project(where:{id:{_eq:"${record.id}"}}){returning {id}}
          `
          _this.mutateApollo(mutationString)
          .then(res => {
            console.log(res,'delete project success')
            _this.loadList()
          })
          .catch(err => {
            console.log(err, 'delete project error')
          })
        },
        onCancel() {
        }
      })
    },
    //创建子项目
    createChildren() {},
    //修改项目备注
    projectRemarkChange(record,e) {
      console.log(record,e.target.value)
      let _this = this
      let mutationString = `
        update_Project(where:{id:{_eq:"${record.id}"}},_set:{
          remark:"${e.target.value}"
        }){returning{id}}
        insert_Summary(objects:[
          {project_id:"${record.id}",content:"修改项目备注为${e.target.value}",createdBy_id:"${_this.userInfo.id}"}
        ]){
          returning{
            id
          }
        }
      `
      this.mutateApollo(mutationString)
      .then(res => {
        console.log(res,'change project remark success')
      }).catch(err => {
        console.log(err,'change project remark error')
        _this.remark = ''
      })
    },
    //跳转到合同详细页
    goContractDetail(item) {
      let routeData = this.$router.resolve({
        name: "contract",
        query:{contractId:item.contract.id,name:item.contract.name}
      });
      // console.log(routeData.href)
      window.open(routeData.href, '_blank');
      // console.log(this.$router.go('/project'))
    },
    
    mutateApollo(mutationString){
      console.log(mutationString)
      return this.$apollo.mutate({
        mutation:gql`mutation {
          ${mutationString}
        }`
      })
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
}

.projectList .ant-table-bordered .ant-table-thead > tr > th,
.projectList .ant-table-bordered .ant-table-tbody > tr > td {
  /* border-right: 1px solid #e8e8e8; */
  font-size: 13px;
}
.projectList .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-tbody > tr > td {
    padding: 8px;
}

.projectList .project-list-table .ant-table-content{
  min-height: 250px;
}
/* .projectList .leftInput:hover {

} */
</style>
