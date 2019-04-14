<template>
  <div>
    <div class="cost-title">项目指标</div>
    <a-row class="cost-rowLine">
      <a-col :span="6">
        <span class="cost-span">项目负责人：</span>
        <span>{{(principal||{}).name}}</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">业务类型：</span>
        <span>{{businessType}}</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">工程规模：</span>
        <span>{{projectScale}}{{projectScaleUnit}}</span>
      </a-col>
    </a-row>
    <a-row class="cost-rowLine">
      <a-col :span="6">
        <span class="cost-span">送审金额：</span>
        <a-input-number
          class="ui-w100 f12"
          :max="2147483647"
          v-model="submitAmount"
          @blur="setAmount(1,$event)"
        />
        <span>元</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">审定金额：</span>
        <a-input-number
          class="ui-w100 f12"
          :max="2147483647"
          v-model="approvedAmount"
          @blur="setAmount(2,$event)"
        />
        <span>元</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">核增核减额：</span>
        <a-input-number class="ui-w100 f12" :max="2147483647" v-model="differenceValue" disabled/>
        <span>元</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">复核造价：</span>
        <a-input-number
          class="ui-w100 f12"
          :max="2147483647"
          @blur="setAmount(3,$event)"
          v-model="unitPrice"
        />
        <span>元/{{projectScaleUnit}}</span>
      </a-col>
    </a-row>

    <!-- 任务表格 -->
    <div style="margin-top:20px" class="costTable">
      <a-table
        :columns="columns"
        :dataSource="tasksData"
        :pagination="false"
        size="small"
        :bordered="true"
        :scroll="{x:scrollX}"
        :loading="loading"
      >
        <!-- <a-icon type="plus-circl" slot="title" scopedSlots="text,record,index">新增</a-icon> -->
        <span slot="ok">
          {{ costName }}
          <a-popconfirm placement="top" okText="确定" cancelText="取消" @confirm="addDraft">
            <template slot="title">
              <p>是否添加{{ costName }}，添加后无法删除</p>
            </template>
            <a-icon type="plus-circle" style="color:#5873c9;"/>
          </a-popconfirm>
        </span>

        <!-- </template> -->
        <!-- 造价任务 -->
        <template v-for="(col, i) in costNameArr" :slot="col" slot-scope="text, record, index">
          <div :key="col" :data-item="col">
            <!-- 有父任务 -->
            <div v-if="record.parent">
              <a-input
                class="inputC"
                style="text-align:right;width:105px;font-size:12px"
                v-model="record.numTasks[i].unitPrice"
                :disabled="[0,3,5].indexOf(record.numTasks[i].status) == -1? true :false"
                placeholder="复核造价"
                @blur="saveRow(record)"
              />
            </div>
            <!-- 没有父任务 -->
            <div v-else>
              <a-input
                class="inputC"
                v-if="index <= tasksData.length-2"
                style="text-align:right;width:105px;font-size:12px"
                :disabled="[0,3,5].indexOf(record.numTasks[i].status) == -1? true :false"
                v-model="record.numTasks[i].unitPrice"
                placeholder="复核造价"
              />
              <!-- 最后一行 -->
              <a-input
                class="inputC"
                v-else
                style="text-align:right;width:105px;font-weight:600;font-size:12px"
                :value="Number(record.numTasks[i].unitPrice).toFixed(2)"
                readonly
              ></a-input>
            </div>
          </div>
        </template>

        <!-- 任务名称 -->
        <div
          slot="name"
          slot-scope="text,record,index"
          style="display: inline-block;width:100%"
          :title="record.name"
        >
          <div v-if="record.parent">
            <a-input
              class="inputC"
              :style="{textAlign:'left',width:nameWidth,maxWidth:'800px',fontSize:'12px'}"
              v-model="record.name"
              :placeholder="placeholer[0]"
              @blur="saveRow(record)"
            />
          </div>
          <div v-else>
            <a-input
              class="inputC"
              v-if="index <= tasksData.length-2"
              :style="{textAlign:'left',width:nameWidth,maxWidth:'800px',fontSize:'12px'}"
              v-model="record.name"
              :placeholder="placeholer[0]"
              @blur="saveRow(record)"
            />
            <div
              class="inputC"
              v-else
              style="text-align:center;line-height: 30px;font-weight:600;"
            >{{ text }}</div>
          </div>
        </div>
        <!-- 送审金额 -->
        <div slot="submitAmount" slot-scope="text,record,index">
          <div v-if="record.parent">
            <a-input
              class="inputC"
              style="text-align:right;min-width:90px;max-width:90px;font-size:12px"
              v-model="record.submitAmount"
              :placeholder="placeholer[1]"
              @blur="saveRow(record)"
            />
          </div>
          <div v-else>
            <a-input
              class="inputC"
              v-if="(record.childTasks||[]).length"
              style="text-align:right;min-width:90px;max-width:90px;font-size:12px"
              v-model="record.submitAmount"
              readonly
              :placeholder="placeholer[1]"
            />
            <a-input
              class="inputC"
              v-else-if="index <= tasksData.length-2"
              style="text-align:right;min-width:90px;max-width:90px;font-size:12px"
              v-model="record.submitAmount"
              :placeholder="placeholer[1]"
            />
            <a-input
              class="inputC"
              v-else
              style="text-align:right;min-width:90px;max-width:90px;font-size:12px;font-weight:600"
              :value="Number(text).toFixed(2)"
              readonly
            ></a-input>
          </div>
        </div>

        
        
        
        <div slot="difference"  slot-scope="text,record,index">
          <a-input
            class="inputC"
            style="text-align:right;min-width:80px;max-width:105px;font-size:12px"
            :value="record.difference"
            readonly
            />
        </div>
        <div slot="ratio"  slot-scope="text,record,index">
          <a-input
            class="inputC"
            style="text-align:right;min-width:80px;max-width:80px;font-size:12px"
            :value="record.ratio"
            readonly
            />
        </div>
        <div slot="increaseOrDecrease"  slot-scope="text,record,index">
          <a-input
            class="inputC"
            style="text-align:right;min-width:80px;max-width:105px;font-size:12px"
            :value="record.increaseOrDecrease"
            readonly
            />
        </div>
        <div slot="increaseOrDecreaseRatio"  slot-scope="text,record,index">
          <a-input
            class="inputC"
            style="text-align:right;min-width:80px;max-width:80px;font-size:12px"
            :value="record.increaseOrDecreaseRatio"
            readonly
            />
        </div>
        <!-- 终稿造价 复核造价 -->
        <div slot="unitPrice" slot-scope="text,record,index">
          <div v-if="record.parent">
            <a-input
              class="inputC"
              style="text-align:right;max-width:120px;font-size:12px"
              v-model="record.unitPrice"
              :placeholder="placeholer[2]"
              @blur="saveRow(record)"
            />
          </div>
          <div v-else>
            <a-input
              class="inputC"
              v-if="index <= tasksData.length-2"
              style="text-align:right;max-width:120px;font-size:12px"
              v-model="record.unitPrice"
              :placeholder="placeholer[2]"
            />
            <div
              class=""
              v-else
            >
             <a-input
              class="inputC"
              style="text-align:right;max-width:120px;font-size:12px"
              :value="parseFloat(record.unitPrice).toFixed(2)"
              readonly
            />
            </div>
          </div>
        </div>

        <!-- 负责人 -->
        <template slot="handler" slot-scope="text, record, index">
          <a-input
            class="inputC"
            readonly="readonly"
            style="text-align:center;max-width: 80px;"
            :value="text? text.name:''"
            placeholder="负责人"
            v-if="index <= tasksData.length-2"
            @click="showEmployee(record,index)"
          />
          <a-input
            class="inputC"
            readonly="readonly"
            style="text-align:center;max-width: 80px;"
            :value="text? text.name:''"
            placeholder="负责人"
            v-else-if="record.parent"
            @click="showEmployee(record,index)"
          />
        </template>
        <!-- 自定义操作 -->
        <template slot="operation" slot-scope="text, record, index">
          <span v-if="Object.keys(record.parent||{}).length">
            <!-- 子任务 -->
            <a @click="saveRow(record)" style="padding:5px" v-if="!record.parent">
              <a-icon type="save" title="保存"/>
            </a>

            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="down-circle" style="font-size:16px"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0" v-if="record.name && $auth('edit-project-task')">
                  <a @click="moveChild(record,index,1)">
                    <a-icon type="arrow-up"/>上移
                  </a>
                </a-menu-item>
                <a-menu-item key="1" v-if="record.name && $auth('edit-project-task')">
                  <a @click="moveChild(record,index,2)">
                    <a-icon type="arrow-up"/>下移
                  </a>
                </a-menu-item>
                <a-menu-item key="3" v-if="record.name && $auth('add-project-task')">
                  <a @click="insertRow(record,index,2)">
                    <a-icon type="api"/>插入
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a
              @click="deleteTask(record,index)"
              style="padding:5px"
              v-if="!(record.numTasks.filter(ele => ele.status > 0)||[]).length || $auth('delete-project-finish-task')"
            >
              <a-icon type="delete" title="删除"/>
            </a>
            <a
              @click="shareTask(record,index)"
              v-if="Object.keys(record.handler||{}).length && isDistribution(record)"
              style="padding:5px"
            >
              <a-icon type="share-alt" title="分配"/>
            </a>
          </span>
          <!-- 父任务 -->
          <span v-else-if="index <= tasksData.length-2">
            <a @click="saveRow(record)" style="padding:5px">
              <a-icon type="save" title="保存"/>
            </a>
            <a
              @click="deleteTask(record,index)"
              style="padding:5px"
              v-if="!record.numTasks.filter(ele => ele.status > 0).length"
            >
              <a-icon type="delete" title="删除"/>
            </a>
            <!-- <a @click="addChild(record,index)" v-if="!record.parent" style="padding:5px">
              <a-icon type="down-circle" title="创建子任务"/>
            </a>-->
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="down-circle" style="font-size:16px"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0" v-if="record.name && $auth('edit-project-task')">
                  <a @click="moveChild(record,index,1)">
                    <a-icon type="arrow-up"/>上移
                  </a>
                </a-menu-item>
                <a-menu-item key="1" v-if="record.name && $auth('edit-project-task')">
                  <a @click="moveChild(record,index,2)">
                    <a-icon type="arrow-up"/>下移
                  </a>
                </a-menu-item>
                <a-menu-item key="3" v-if="record.name && $auth('add-project-task')">
                  <a @click="addChild(record,index)">
                    <a-icon type="share-alt"/>创建子任务
                  </a>
                </a-menu-item>
                <a-menu-item key="4" v-if="record.name && $auth('add-project-task')">
                  <a @click="insertRow(record,index,1)">
                    <a-icon type="api"/>插入任务
                  </a>
                </a-menu-item>
                <!-- <a-menu-item key="4" v-if="record.name && $auth('add-project-task')">
                  <a @click="copyTask(record)">
                    <a-icon type="copy"/>复制任务
                  </a>
                </a-menu-item>
                <a-menu-item key="5" v-if="$auth('delete-project-task')">
                  <a @click="deleteTask(record,index)">
                    <a-icon type="delete"/>删除任务
                  </a>
                </a-menu-item>-->
              </a-menu>
            </a-dropdown>
            <a
              @click="shareTask(record,index)"
              v-if="Object.keys(record.handler||{}).length && record.id && isDistribution(record)"
              style="padding:5px"
            >
              <a-icon type="share-alt" title="分配"/>
            </a>
          </span>
        </template>

        <!-- <template slot="footer" slot-scope="currentPageData">{{ currentPageData }}</template> -->
      </a-table>

      <div class="addCostTask">
        <a href="javascript:void(0)" @click="addCost">
          <a-icon type="plus"></a-icon>添加任务
        </a>
      </div>
    </div>

    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visibled"
      :type="employeeType"
      :isOne="isOne"
      @changeStatus="changeEMStatus"
    />
  </div>
</template>
<script>
import gql from 'graphql-tag'
import employeeTree from '@/components/same/employeeTree'
import { ArrayToString, ObjectToString } from '@/components/_util/StringUtil'

import { mapState, mapMutations } from 'vuex'
import moment from 'moment'

import {db} from '@/utils/db'
// //对象转字符串
// function ObjectToString(obj) {
//   var type = Object.prototype.toString.call(obj)
//   var result = ''
//   if (type === '[object Object]') {
//     result += '{'
//     for (var o in obj) {
//       if (Object.prototype.toString.call(obj[o]) === '[object String]') {
//         result += o + ': "' + obj[o] + '",'
//       } else if (Object.prototype.toString.call(obj[o]) === '[object Object]') {
//         result += o + ': ' + ObjectToString(obj[o]) + ','
//       } else if (Object.prototype.toString.call(obj[o]) === '[object Array]') {
//         result += o + ': ' + ArrayToString(obj[o]) + ','
//       } else {
//         result += o + ': ' + obj[o] + ','
//       }
//     }
//     result += '}'
//   }
//   return result
// }
// //数组转字符串
// function ArrayToString(obj) {
//   var type = Object.prototype.toString.call(obj)
//   var result = ''
//   if (type === '[object Array]') {
//     result = '['
//     obj.forEach(ele => {
//       result += ObjectToString(ele)
//     })
//     result += ']'
//   } else if (type === '[object Object]') {
//     result += ObjectToString(obj)
//   }
//   return result
// }

export default {
  name: 'ProjectCost',
  props: {
    projectId: {
      type: String,
      defalut: ''
    }
  },
  data() {
    return {
      dbConn:new db(this.$apollo),
      loading:true,
      costName: '初稿',
      projectName: '',
      nameWidth:'100%',
      principal: {}, //项目负责人
      businessType: '', //业务类型
      submitAmount: 0, //送审金额
      approvedAmount: 0, //审定金额
      projectScale: 0, //工程规模
      projectScaleUnit: '平方米', //工程规模单位
      unitPrice: 0, //复核造价
      scrollX: 1550,
      emTitle: '', //人员弹框标题
      visibled: false, //人员弹框是否显示
      isOne: true, //人员是否多选
      employeeType: 1, //部门人员弹框类型
      tasks: [], //原始数据
      tasksData: [], //处理过的数据
      docNum: 1, //稿数
      handler: {}, //负责人
      endDate: '', //项目的截止日期
      selectPId: '',
      selectIndex: 0,
      selectRecord: {},
      members:[],

      costNameArr: ['numTasks1'],
      enEditCost: ['numTasks1'],

      placeholer: ['任务名称', '送审金额', '偏差原因'],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: '100',
          align: 'left',
          scopedSlots: {
            customRender: 'serialNumber'
          },
          customRender: (text, record, index) => {
            // console.log(text, record, record.key)
            var index = record.key
            if (record.key == 0) {
              index = ''
            }
            return {
              children: (
                <span style="min-width:25px;display: inline-block;height: 17px;line-height:17px;float: right;">
                  {index}
                </span>
              )
            }
          }
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          width: '800',
          align: 'left',
          scopedSlots: {
            customRender: 'name'
          }
        },
        {
          title: '负责人',
          dataIndex: 'handler',
          key: 'handler',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'handler' }
        },
        {
          title: '送审金额',
          dataIndex: 'submitAmount',
          key: 'submitAmount',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'submitAmount' }
        },
        {
          title: '造价金额',
          dataIndex: 'numTasks',
          key: 'numTasks',
          align: 'center',
          // width: '300',
          children: [
            {
              // title: '初稿',
              dataIndex: 'numTasks',
              key: 'numTasks1',
              width: '100',
              align: 'center',
              slots: {
                title: 'ok'
              },
              scopedSlots: { customRender: 'numTasks1' }
            }
          ]
        },
        
        {
          title:'最后两稿差额',
          dataIndex:'difference',
          key: 'difference',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'difference' }
        },
        {
          title:'比率',
          dataIndex:'ratio',
          key: 'ratio',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'ratio' }
        },
        {
          title:'终稿',
          dataIndex:'unitPrice',
          key: 'unitPrice',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title:'增减额',
          dataIndex:'increaseOrDecrease',
          key: 'increaseOrDecrease',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'increaseOrDecrease' }
        },
        {
          title:'增减比率',
          dataIndex:'increaseOrDecreaseRatio',
          key: 'increaseOrDecreaseRatio',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'increaseOrDecreaseRatio' }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '180',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  components: {
    employeeTree
  },
  created() {
    this.loadData(this.projectId)
    console.log(this.userInfo.id, 'info')
    
    // console.log(this.$apollo)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    }),
    differenceValue: function() {
      return (this.approvedAmount || 0) - (this.submitAmount || 0)
    }
  },
  methods: {
    loadData() {
      var _this = this

      this.$apollo
        .query({
          query: gql`
            query {
              Project(where: {id:{_eq:"${_this.projectId}"}}) {
                id
                name
                businessType
                projectScale
                projectScaleUnit
                submitAmount
                approvedAmount
                unitPrice
                docNum
                members {
                  id
                  member_id
                }
                endDate
                principal {
                  name
                  id
                }
                tasks(where:{type:{_eq:0}},order_by:[{sortNo:asc},{createdAt:asc}]) {
                  sortNo
                  id
                  name
                  type
                  handler_id
                  handler{
                    id
                    name
                  }
                  parent{
                    id
                    name
                    type
                  }
                  project {
                    id
                    name
                  }
                  submitAmount
                  approvedAmount
                  unitPrice
                  deviationReason
                  status
                  childTasks(order_by:[{sortNo:asc},{createdAt:asc}]) {
                    sortNo
                    id
                    name
                    remark
                    type
                    handler_id
                    submitAmount
                    approvedAmount
                    unitPrice
                    deviationReason
                    status
                    createdAt
                    project {
                      id
                      name
                    }
                    parent{
                      id
                      name
                      type
                    }
                    handler{
                      name
                      id
                    }
                    numTasks(order_by:[{sortNo:asc}]) {
                      sortNo
                      id
                      name
                      remark
                      status
                      submitAmount
                      approvedAmount
                      unitPrice
                      type
                      handler {
                        name
                        id
                      }
                      childTasks {
                        sortNo
                        id
                        name
                        remark
                        status
                        submitAmount
                        approvedAmount
                        unitPrice
                        handler {
                          name
                          id
                        }
                      }
                    }
                  }
                  numTasks(order_by:[{sortNo:asc}]){
                    sortNo
                    id
                    name
                    remark
                    status
                    type
                    unitPrice
                    submitAmount
                    approvedAmount
                    handler {
                      name
                      id
                    }
                    childTasks {
                      id
                      name
                      remark
                      status
                      submitAmount
                      unitPrice
                      approvedAmount
                      handler {
                        name
                        id
                      }
                    }
                  }
                }
              }
            }
          `,
          fetchPolicy: 'no-cache'
          //  fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res, 'res')
          _this.members = res.data.Project[0].members
          _this.initInfo(res.data.Project)
          _this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    //初始化数据
    initInfo(data) {
      console.log(data)
      if (!data.length) {
        return
      }
      this.projectName = data[0].name
      this.endDate = data[0].endDate
      this.principal = data[0].principal || {}
      this.businessType = data[0].businessType
      this.projectScale = data[0].projectScale
      this.projectScaleUnit = data[0].projectScaleUnit
      this.unitPrice = data[0].unitPrice

      this.submitAmount = data[0].submitAmount
      this.approvedAmount = data[0].approvedAmount

      this.tasks = []
      var _tasks = data[0].tasks.filter(ele => ele.type == 0 && !ele.parent && ele.numTasks.length)
      this.tasks = [].concat(_tasks)
      console.log(this.tasks, 'this.tasks ')
      this.tasksData = []
      this.costNameArr = []



      if(this.businessType.indexOf('编制')> -1){
      this.columns =  [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: '100',
          align: 'left',
          scopedSlots: {
            customRender: 'serialNumber'
          },
          customRender: (text, record, index) => {
            // console.log(text, record, record.key)
            var index = record.key
            if (record.key == 0) {
              index = ''
            }
            return {
              children: (
                <span style="min-width:25px;display: inline-block;height: 17px;line-height:17px;float: right;">
                  {index}
                </span>
              )
            }
          }
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          width: '800',
          align: 'left',
          scopedSlots: {
            customRender: 'name'
          }
        },
        {
          title: '负责人',
          dataIndex: 'handler',
          key: 'handler',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'handler' }
        },
       
        {
          title: '造价金额',
          dataIndex: 'numTasks',
          key: 'numTasks',
          align: 'center',
          // width: '300',
          children: [
            {
              // title: '初稿',
              dataIndex: 'numTasks',
              key: 'numTasks1',
              width: '100',
              align: 'center',
              slots: {
                title: 'ok'
              },
              scopedSlots: { customRender: 'numTasks1' }
            }
          ]
        },
        {
          title:'终稿',
          dataIndex:'unitPrice',
          key: 'unitPrice',
          width: '120',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title:'差额',
          dataIndex:'difference',
          key: 'difference',
          width: '120',
          align: 'center',
          customRender: (text, record, index) => {
            return {
              children: (
                <div style="min-width:80px;text-align:right;line-height: 17px;">
                  {text}
                </div>
              )
            }
          }
        },
        {
          title:'比率',
          dataIndex:'ratio',
          key: 'ratio',
          width: '120',
          align: 'center',
          customRender: (text, record, index) => {
            return {
              children: (
                <div style="min-width:80px;text-align:right;line-height: 17px;">
                  {text}
                </div>
              )
            }
          }
        },
        
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '480',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]
      // this.scrollX = 1250
    
    }
      // this.enEditCost = ['numTasks1']
      // debugger

      //编制类任务不显示送审金额
      // if(this.businessType.indexOf('编制') > -1){
      //   this.columns = this.columns.filter(ele => ele.dataIndex != 'submitAmount')
      // }

      this.docNum = data[0].docNum || 1
      var obj = { 1: '初稿', 2: '二稿', 3: '三稿', 4: '四稿', 5: '五稿', 6: '六稿', 7: '终稿' }
      var draftObj = {}
      var draftIndex = 0
      this.columns.forEach((ele, index) => {
        if (ele.title == '造价金额') {
          draftObj = ele
          draftObj.children = []
          draftIndex = index
        }
      })
      for (var i = 0; i < this.docNum; i++) {
        var numName = 'numTasks' + (i + 1)
        var _obj = {
          dataIndex: 'numTasks',
          key: numName,
          width: '100',
          align: 'center',
          scopedSlots: { customRender: numName }
        }
        if (i == this.docNum - 1) {
          this.costName = obj[i + 1]
          _obj.slots = { title: 'ok' }
        } else {
          _obj.title = obj[i + 1]
        }
        this.costNameArr.push(numName)
        draftObj.children.push(_obj)
      }
      this.columns.splice(draftIndex, 1, draftObj)
      if(this.businessType.indexOf('编制')> -1){
        this.nameWidth = '600px'
        this.scrollX = 1100
      }else {
        this.nameWidth = '100%'
        this.scrollX = 1100
      }
      
      this.scrollX += this.docNum * 140
      console.log(this.columns, this.scrollX, 'this.columns')

      this.beforeTable(this.tasks)
    },

    mutateApollo(string) {
      return this.$apollo.mutate({
        mutation: gql`mutation {
          ${string}
        }`
      })
    },
    //保存
    saveRow(record) {
      console.log(record)
      // return
      var numTasks = []
      record.numTasks.forEach(ele => {
        var obj = {
          name: ele.name,
          status: 0,
          type: 1,
          project_id: this.projectId,
          submitAmount: parseFloat(record.submitAmount || 0),
          approvedAmount: parseFloat(ele.approvedAmount || 0),
          unitPrice: parseFloat(ele.unitPrice || 0),
          createdBy_id: this.userInfo.id,
          sortNo: ele.sortNo
        }
        if (this.endDate) {
          obj.endDate = moment(this.endDate)
            .subtract(1, 'days')
            .format()
        }
        numTasks.push(obj)
      })

      var _this = this
      if (record.id) {
        //已经存在列表中需要更新数据库中的数据

        var needNum = record.numTasks.filter(ele => [0, 3, 5].indexOf(ele.status) > -1)
        var updateTask = ``
        var numTaskString = ''
        updateTask = `
          update_Task(_set:{
            ${Object.keys(record.handler || {}).length ? `handler_id:"${record.handler.id}"` : ''}
            name:"${record.name}"
            submitAmount:${record.submitAmount || 0}
            deviationReason:"${record.deviationReason || ''}",
            unitPrice:${record.unitPrice || 0}
          },where:{id:{_eq:"${record.id}"}})
          {returning {id}}
        `

        if (needNum.length) {
          needNum.forEach((ele, numI) => {
            numTaskString +=
              `
              update${numI}:update_Task(_set:{
                ${Object.keys(record.handler || {}).length ? `handler_id:"${record.handler.id}"` : ''}
                submitAmount:${record.submitAmount || 0}
                approvedAmount:${ele.approvedAmount || 0}
                unitPrice:${ele.unitPrice || 0}
              },where:{id:{_eq:"${ele.id}"}})
              {returning {id}}
            ` + '\n'
          })
        }

        var totalSting = updateTask + '\n' + numTaskString
        console.log(totalSting, 'g')
        // return
        _this
          .mutateApollo(totalSting)
          .then(res => {
            console.log(res, 'update project task success')
            _this.$message.success(`任务保存成功`)
            _this.loadData()
          })
          .catch(err => {
            _this.$message.error(`任务保存失败`)
            console.log(err, 'update project task error')
          })
      } else {
        // 创建
        //不存在则添加到数据库中
        if (record.parent.id) {
          let parentTask = {}
          this.tasks.forEach((e, i) => {
            if (e.id == record.parent.id) {
              parentTask = e
            }
          })

          var updateTask = ``
          parentTask.childTasks.forEach((ele, uIndex) => {
            if (ele.id) {
              updateTask +=
                `updateTask_${uIndex}:update_Task(where:{id:{_eq:"${ele.id}"}},_set:{sortNo:${
                  ele.sortNo
                }}){returning{id}}` + '\n'
            }
          })

          //如果是子任务
          var insertChildString = ''
          insertChildString = `
            insert_Task(objects:[
              { 
                name:"${record.name}"
                ${Object.keys(record.handler || {}).length ? `handler_id:"${record.handler.id}"` : ''}
                parent_id:"${record.parent.id}"
                project_id:"${_this.projectId}"
                submitAmount:${record.submitAmount || 0}
                unitPrice:${record.unitPrice || 0}
                ${record.sortNo ? `sortNo:${record.sortNo}` : ''}
                type:0,
                status:0,
                numTasks: {
                  data:${ArrayToString(numTasks)}
                }
                createdBy_id: "${_this.userInfo.id}"
              }
            ]){returning {id}}
            ${updateTask}
          `
          console.log(insertChildString, numTasks)
          // return
          _this
            .mutateApollo(insertChildString)
            .then(res => {
              console.log('create child cost task success')
              _this.$message.success(`创建子任务成功`)
              _this.loadData()
            })
            .catch(err => {
              _this.$message.error(`创建子任务失败`)
              console.log('create child cost task error')
            })
        } else {
          //父任务

          var updateTask = ``
          this.tasks.forEach((ele, uIndex) => {
            if (ele.id) {
              updateTask +=
                `updateTask_${uIndex}:update_Task(where:{id:{_eq:"${ele.id}"}},_set:{sortNo:${
                  ele.sortNo
                }}){returning{id}}` + '\n'
            }
          })

          var parentTaskSting = `
            insert_Task(objects: [{
              name:"${record.name}"
              ${Object.keys(record.handler || {}).length ? `handler_id:"${record.handler.id}"` : ''}
              project_id:"${_this.projectId}"
              submitAmount:${record.submitAmount || 0}
              unitPrice:${record.unitPrice || 0}
              type:0,
              status:0,
              ${record.sortNo ? `sortNo:${record.sortNo}` : ''}
              numTasks: {
                data:${ArrayToString(numTasks)}
              },
              createdBy_id: "${_this.userInfo.id}"
            }]){returning{id}}
            ${updateTask}
          `
          console.log(parentTaskSting)

          // return
          _this
            .mutateApollo(parentTaskSting)
            .then(res => {
              console.log(res, 'create parent cost task success')
              _this.$message.success(`创建任务成功`)
              _this.loadData()
            })
            .catch(err => {
              _this.$message.error(`创建任务失败`)
              console.log(err, 'create parent cost task error')
            })
        }
      }
    },

    //删除任务
    deleteTask(record, index) {
      console.log(record)
      // return
      var _this = this
      if (record.id) {
        //已经存在列表中需要删除数据库中的数据
        if ((record.childTasks || []).length) {
          this.$message.error('存在子任务无法删除')
          return
        } else {
          var deleteArrString = `"${record.id}",`
          // deleteArr.push(record.id)
          record.numTasks.forEach(ele => {
            deleteArrString += `"${ele.id}",`
            if (ele.childTasks) {
              ele.childTasks.forEach(e => {
                deleteArrString += `"${e.id}",`
              })
            }
          })
          // console.log(deleteArr)
          var deleteString = `delete_Task(where:{id:{_in:[${deleteArrString}]}}){ returning{id}}`
          console.log(deleteString)
          // return
          this.mutateApollo(deleteString)
            .then(res => {
              console.log(res, 'delete cost task success')
              _this.$message.success('删除成功')
              _this.loadData()
            })
            .catch(err => {
              //  console.log(deleteString)
              console.log(res, 'delete cost task error')
              _this.$message.error('删除失败')
            })
        }
      } else {
        //不存在则直接删除数据
        if (Object.keys(record.parent || {}).length) {
          //删除子任务
          var _task, _taskIndex

          this.tasks.forEach((ele, i) => {
            if ((ele.id = record.parent.id)) {
              _task = ele
              _taskIndex = i
            }
          })
          console.log(_task.childTasks, _taskIndex)
          _task.childTasks.splice(index, 1)
          this.tasks.splice(_taskIndex, 1, _task)
          // console.log(_task,this.tasks)
        } else {
          this.tasks.splice(index, 1)
        }
        this.beforeTable(this.tasks)
      }
    },

    //添加子任务
    addChild(record, index) {
      var obj = {
        name: '',
        handler: {},
        project: { id: this.projectId },
        parent: { id: record.id },
        type: 0,
        submitAmount: record.submitAmount,
        numTasks: []
      }

      for (var i = 0; i < this.docNum; i++) {
        var objName = { 1: '初稿', 2: '二稿', 3: '三稿', 4: '四稿', 5: '五稿', 6: '六稿', 7: '终稿' }
        var numTobj = {
          name: objName[i + 1],
          handler: {},
          project: { id: this.projectId },
          type: 1,
          status: 0,
          submitAmount: '',
          childTasks: [],
          sortNo: i + 1
        }
        obj.numTasks.push(numTobj)
      }
      record.childTasks.push(obj)
      this.tasks.splice(index, 1, record)
      this.beforeTable(this.tasks)
    },

    //插入父/子任务
    insertRow(record, index, type) {
      console.log(record, index)
      var obj = {
        name: '',
        handler: {},
        project: { id: this.projectId },

        type: 0,
        submitAmount: record.submitAmount,
        numTasks: [],
        sortNo: record.sortNo
      }

      for (var i = 0; i < this.docNum; i++) {
        var objName = { 1: '初稿', 2: '二稿', 3: '三稿', 4: '四稿', 5: '五稿', 6: '六稿', 7: '终稿' }
        var numTobj = {
          name: objName[i + 1],
          handler: {},
          project: { id: this.projectId },
          type: 1,
          status: 0,
          submitAmount: 0,
          approvedAmount: 0,
          unitPrice: 0,
          childTasks: [],
          sortNo: i + 1
        }
        obj.numTasks.push(numTobj)
      }
      //父任务
      if (type == 1) {
        obj.parent = {}
        this.tasks.splice(index + 1, 0, obj)
        this.tasks.forEach((ele, tIndex) => {
          ele.sortNo = tIndex + 1
        })
        this.beforeTable(this.tasks)
      } else {
        //子任务
        obj.parent = { id: record.parent.id }
        //获取父级任务
        let parentIndex = 0
        let parentTask = {}
        this.tasks.forEach((e, i) => {
          if (e.id == record.parent.id) {
            parentIndex = i
            parentTask = e
          }
        })
        console.log(obj)
        parentTask.childTasks.splice(index + 1, 0, obj)

        parentTask.childTasks.forEach((ele, tcIndex) => {
          ele.sortNo = tcIndex + 1
        })
        this.tasks.splice(parentIndex, 1, parentTask)
        this.beforeTable(this.tasks)
      }
    },
    //分配任务
    shareTask(record) {
      console.log(record)
      var _this = this
      this.$confirm({
        title: '分配任务',
        content: `你确定分配任务【${record.name}】吗？`,
        onOk() {
          // var numT = record.numTasks.filter(ele => ele.status == 0)
          let hasMember = _this.members.filter(e => e.member_id == record.handler_id)
          let addMember = ``
          let notiString = ``
          if(!hasMember.length){
            // addMember = ``
            var memberString = ``
            
            var performString = ``
            // data.forEach(ele => {
              memberString = `{
                project_id:"${_this.projectId}",
                member_id:"${record.handler_id}",
              },`
              performString = `{
                employee_id:"${record.handler_id}"
                project_id:"${_this.projectId}",
                ratios:[{name:"专业系数",value: ""},{name:"难度系数",value: ""},{name:"规模系数",value: ""},{name:"绩效分",value: ""}],
              }`
              notiString = `{
                type:3,
                name: "【${_this.userInfo.name}】将您添加为【${record.project.name}】的项目组成员",
                status: 0,
                recipients:{
                  data:{
                    recipient_id:"${record.handler_id}"
                  }
                },
                createdBy_id:"${_this.userInfo.id}"
              },`
            // })
            var mutationString = `insert_ProjectMember(objects:[${memberString}]){returning{id}}`
            // var notificationString = `insert_Notification(objects:[${notiString}]){returning{id}}`

            var performanceString = `insert_Performance(objects:[${performString}]){returning {id}}`
            // console.log(mutationString,notificationString,'insert notification and projectMember string')
            addMember = mutationString  + '\n' + performanceString
          }
          var numT = (record.numTasks || []).filter(ele => [0, 3, 5].indexOf(ele.status) > -1)
          var updateString = `
            update_Task(_set:{
              ${Object.keys(record.handler || {}).length ? `handler_id:"${record.handler.id}"` : ''}
              name:"${record.name}"
              submitAmount:${record.submitAmount}
              deviationReason:"${record.deviationReason || ''}"
            },where:{id:{_eq:"${record.id}"}})
            {returning {id}}
          `
          var notifiString = ``
          if (!numT.length) {
            _this.$message.warning('无造价任务分配')
            return
          }
          numT.forEach((ele, i) => {
            updateString += `
              update_${i}:update_Task(where:{id:{_eq:"${ele.id}"}},_set:{
                ${Object.keys(record.handler || {}).length ? `handler_id:"${record.handler.id}"` : ''}
                status:1
              }){returning{id}}
            `
            notifiString += `{
              type: 2
              name: "【郑会龙】分配了【${_this.projectName}】项目中的【${ele.name}】任务给您，任务截止日期 2019-01-23"
              status: 0
              recipients: {
                data: {recipient_id:"${record.handler.id}"}
              }
            }`
          })

          var totalString = updateString + `insert_Notification(objects:[${notifiString}${notiString}]){returning{id}}` + addMember

          console.log(record, 'shareTask', totalString)
          // return
          _this
            .mutateApollo(totalString)
            .then(res => {
              _this.loadData()
              _this.$message.success('造价任务分配成功')
              console.log(res, 'Distribution success')
            })
            .catch(err => {
              console.log(err, 'Distribution error')
            })
        },
        onCancel() {}
      })
    },

    //添加稿数
    addDraft() {
      var draftObj = {}
      var draftIndex = 0
      this.columns.forEach((ele, index) => {
        if (ele.title == '造价金额') {
          draftObj = ele
          draftIndex = index
        }
      })
      // for(var o in draftObj){
      var draftCL = draftObj['children'] //造价金额子表头
      var draftCLL = draftCL.length //稿数长度

      if (draftCLL > 6) {
        return
      }

      this.docNum = draftCLL + 1

      var costObj = { 1: '初稿', 2: '二稿', 3: '三稿', 4: '四稿', 5: '五稿', 6: '六稿', 7: '终稿' }
      var _costName = costObj[this.docNum]

      var _this = this

      var updateProjectString = `
        update_Project(where:{id:{_eq:"${_this.projectId}"}},_set:{
          docNum: ${this.docNum}
        }){
          returning {id}
        }
      `

      var updateTaskString = ``
      var _updateTaskString = ``

      _this.tasks.forEach((ele, index) => {
        _updateTaskString += `
          {
            name:"${_costName}"
            submitAmount:${ele.submitAmount || 0}
            project_id:"${_this.projectId}"
            numParent_id:"${ele.id}"
            ${Object.keys(ele.handler || {}).length ? `handler_id:"${ele.handler.id}"` : ''}
            type:1
            status:0,
            createdBy_id: "${_this.userInfo.id}",
            sortNo:${this.docNum}
            ${
              _this.endDate
                ? `endDate:"${moment(this.endDate)
                    .subtract(1, 'days')
                    .format()}"`
                : ''
            }
          },
        `
        if (ele.childTasks.length) {
          ele.childTasks.forEach((e, i) => {
            _updateTaskString += `
             {
                name:"${_costName}"
                submitAmount:${e.submitAmount || 0}
                project_id:"${_this.projectId}"
                numParent_id:"${e.id}"
                ${Object.keys(e.handler || {}).length ? `handler_id:"${e.handler.id}"` : ''}
                type:1
                status:0
                createdBy_id: "${_this.userInfo.id}",
                sortNo:${this.docNum}
                ${
                  _this.endDate
                    ? `endDate:"${moment(this.endDate)
                        .subtract(1, 'days')
                        .format()}"`
                    : ''
                }
            },
            `
          })
        }
      })
      if (_this.tasks.length) {
        updateTaskString = `insert_Task(objects:[${_updateTaskString}]){returning {id}}`
      }

      // console.log(updateProjectString,updateTaskString)

      var totalString = updateProjectString + '\n' + updateTaskString
      console.log(totalString)
      _this
        .mutateApollo(totalString)
        .then(res => {
          console.log(res, 'update project docNum and insert cost task success')
          _this.$message.success(`创建${this.costName}成功`)
          _this.loadData()
        })
        .catch(err => {
          _this.$message.error(`创建${this.costName}失败`)
          console.log(err, 'update project docNum and insert cost task error')
        })
    },

    //显示负责人
    showEmployee(record, index) {
      console.log(record)
      if (record.parent) {
        this.selectPId = record.parent.id
      }
      if (!record.id) {
        return
      }

      this.selectIndex = index
      this.selectRecord = record
      this.visibled = true
    },
    //人员关闭后操作
    changeEMStatus(obj) {
      this.visibled = obj.visibled
      if (!obj.data.length) {
        return
      }
      this.handler = {
        id: obj.data[0].key,
        name: obj.data[0].title
      }
      // debugger
      this.selectRecord.handler = this.handler
      if (this.selectPId) {
        var _i = 0
        this.tasks.forEach((e, i) => {
          if (e.id == this.selectPId) {
            _i = i
          }
        })
        var Arr = this.tasks[_i]
        Arr[this.selectIndex] = this.selectRecord
        this.tasks.splice(_i, 1, Arr)
        // debugger
        this.saveRow(this.selectRecord)
      } else {
        this.tasks.splice(this.selectIndex, 1, this.selectRecord)
      }
      // console.log(obj)
    },

    //添加父任务
    addCost() {
      var obj = {
        name: this.projectName,
        handler: this.principal,
        project: { id: this.projectId },
        parent: {},
        type: 0,
        submitAmount: this.submitAmount,
        unitPrice:0,
        numTasks: []
      }
      if (this.docNum == 1) {
        obj.numTasks = [
          {
            name: '初稿',
            handler: {},
            project: { id: this.projectId },
            type: 1,
            submitAmount: '',
            approvedAmount: 0,
            unitPrice: 0,
            sortNo: 1
          }
        ]
      } else {
        for (var i = 0; i < this.docNum; i++) {
          var objName = { 1: '初稿', 2: '二稿', 3: '三稿', 4: '四稿', 5: '五稿', 6: '六稿', 7: '终稿' }
          var numTobj = {
            name: objName[i + 1],
            handler: {},
            project: { id: this.projectId },
            type: 1,
            status: 0,
            submitAmount: '',
            approvedAmount: 0,
            unitPrice: 0,
            sortNo: i + 1
          }
          // debugger
          obj.numTasks.push(numTobj)
        }
      }
      console.log(obj, 'ob--------------')
      this.tasks.push(obj)
      this.beforeTable(this.tasks)
    },

    //数据展示前处理
    beforeTable(data) {
      var obj = {
        name: '汇总',
        submitAmount: 0,
        deviationReason: '',
        deviationRate: '',
        numTasks: [],
        unitPrice:0,
        key: 0
      }

      for (var i = 0; i < this.docNum; i++) {
        obj.numTasks.push({ submitAmount: 0, approvedAmount: 0, unitPrice: 0 })
      }

      //复制数组
      this.tasksData = []
      data.forEach(ele => {
        this.tasksData.push(Object.assign({}, ele))
      })

      // console.log(this.tasksData)
      // debugger
      //获取子任务
      this.tasksData.forEach((ele, index) => {
        if (ele.childTasks) {
          if (ele.childTasks.length) {
            ele.children = []
            ele.childTasks = ele.children.concat(ele.childTasks)
            ele.children = ele.children.concat(ele.childTasks)
            ele.key = index + 1
            if (ele.children.length) {
              ele.children.forEach((e, i) => {
                e.key = index + 1 + '.' + (i + 1)
              })
            }
          } else {
            ele.key = index + 1
          }
        } else {
          ele.key = index + 1
        }
      })

      this.tasksData.forEach(ele => {
        // ele.finally = 0
        // debugger
        if (ele.children) {
          if (ele.children.length) {
            //存在子任务
            ele.submitAmount = 0
            ele.approvedAmount = 0
            ele.unitPrice = 0
            ele.children.forEach((tE, ti) => {
              //加小数点两位
              tE.submitAmount = this.toFixed2r(tE.submitAmount || 0)
              tE.approvedAmount = this.toFixed2r(tE.approvedAmount || 0)
              tE.unitPrice = this.toFixed2r(tE.unitPrice || 0)

              ele.unitPrice += this.toFixed2(tE.unitPrice || 0)
              // if (tE.submitAmount > 0 && parseFloat(tE.numTasks[tE.numTasks.length - 1].unitPrice || 0) > 0) {
              //   tE.deviationRate =
              //     (parseFloat(tE.submitAmount) - parseFloat(tE.numTasks[tE.numTasks.length - 1].unitPrice || 0)) /
              //     parseFloat(tE.submitAmount)
              // }
              ele.submitAmount += this.toFixed2(tE.submitAmount || 0)
              // ele.approvedAmount += this.toFixed2(tE.approvedAmount || 0)
              // ele.unitPrice += this.toFixed2(tE.unitPrice || 0)

              tE.numTasks.forEach((tcE, tci) => {
                if (tcE.childTasks.length) {
                  // tcE.approvedAmount = 0
                  // tcE.submitAmount = 0
                  // tcE.unitPrice = 0
                  // //获取审核后的最后一个审定金额
                  // tcE.approvedAmount = this.toFixed2r(tcE.childTasks[tcE.childTasks.length - 1].approvedAmount || 0)
                  // tcE.submitAmount = this.toFixed2r(tcE.childTasks[tcE.childTasks.length - 1].submitAmount || 0)
                  // tcE.unitPrice = this.toFixed2r(tcE.childTasks[tcE.childTasks.length - 1].unitPrice || 0)
                } else {
                  //加小数点两位
                  tcE.approvedAmount = this.toFixed2r(tcE.approvedAmount || 0)
                  tcE.submitAmount = this.toFixed2r(tcE.submitAmount || 0)
                  tcE.unitPrice = this.toFixed2r(tcE.unitPrice || 0)
                }
              })
            })

            ele.unitPrice = this.toFixed2r(ele.unitPrice)

            //父任务稿件审定金额由子任务稿件审定金额的叠加
            ele.numTasks.forEach((nE, ni) => {
              nE.approvedAmount = 0
              nE.submitAmount = 0
              nE.unitPrice = 0
              ele.childTasks.forEach((tE, ti) => {
                // nE.submitAmount += this.toFixed2(tE.numTasks[ni].submitAmount || 0)
                // nE.approvedAmount += this.toFixed2(tE.numTasks[ni].approvedAmount || 0)
                nE.unitPrice += this.toFixed2(tE.numTasks[ni].unitPrice || 0)
                
              })

              //加小数点两位
              // nE.submitAmount = this.toFixed2r(nE.submitAmount)
              // nE.approvedAmount = this.toFixed2r(nE.approvedAmount)
              nE.unitPrice = this.toFixed2r(nE.unitPrice)

              
              // obj.numTasks[ni].submitAmount += this.toFixed2(nE.submitAmount || 0)
              // obj.numTasks[ni].approvedAmount += this.toFixed2(nE.approvedAmount || 0)
              obj.numTasks[ni].unitPrice += this.toFixed2(nE.unitPrice || 0)
              
            })

           

            // if (ele.submitAmount > 0 && parseFloat(ele.numTasks[ele.numTasks.length - 1].unitPrice || 0) > 0) {
            //   ele.deviationRate =
            //     (parseFloat(ele.submitAmount) - parseFloat(ele.numTasks[ele.numTasks.length - 1].unitPrice || 0)) /
            //     parseFloat(ele.submitAmount)
            // }
          } else {
            ele.numTasks.forEach((nE, ni) => {
              nE.childTasks = nE.childTasks || []
              // if (nE.childTasks.length) {
              //   nE.approvedAmount = 0
              //   nE.unitPrice = 0
              //   nE.submitAmount = 0
              //   //获取审核后的最后一个审定金额
              //   nE.unitPrice = this.toFixed2r(nE.childTasks[nE.childTasks.length - 1].unitPrice || 0)
              //   nE.approvedAmount = this.toFixed2r(nE.childTasks[nE.childTasks.length - 1].approvedAmount || 0)
              //   nE.submitAmount = this.toFixed2r(nE.childTasks[nE.childTasks.length - 1].submitAmount || 0)
              // }
              obj.numTasks[ni].submitAmount += this.toFixed2(nE.submitAmount || 0)
              obj.numTasks[ni].approvedAmount += this.toFixed2(nE.approvedAmount || 0)
              obj.numTasks[ni].unitPrice += this.toFixed2(nE.unitPrice || 0)
            })

            // if (ele.submitAmount > 0 && parseFloat(ele.numTasks[ele.numTasks.length - 1].unitPrice || 0)) {
            //   ele.deviationRate =
            //     (parseFloat(ele.submitAmount) - parseFloat(ele.numTasks[ele.numTasks.length - 1].unitPrice || 0)) /
            //     parseFloat(ele.submitAmount)
            // }
          }
        } else {
          ele.submitAmount = this.toFixed2r(ele.submitAmount)
          ele.approvedAmount = this.toFixed2r(ele.approvedAmount)
          ele.unitPrice = this.toFixed2r(ele.unitPrice)
          // if (ele.submitAmount > 0 && parseFloat(ele.numTasks[ele.numTasks.length - 1].unitPrice || 0)) {
          //   ele.deviationRate =
          //     (parseFloat(ele.submitAmount) - parseFloat(ele.numTasks[ele.numTasks.length - 1].unitPrice || 0)) /
          //     parseFloat(ele.submitAmount)
          // }
          ele.numTasks.forEach((nE, ni) => {
            nE.childTasks = nE.childTasks || []
            // if (nE.childTasks.length) {
            //   nE.unitPrice = 0
            //   nE.approvedAmount = 0
            //   nE.submitAmount = 0
            //   //获取审核后的最后一个审定金额
            //   nE.approvedAmount = this.toFixed2r(nE.childTasks[nE.childTasks.length - 1].approvedAmount || 0)
            //   nE.unitPrice = this.toFixed2r(nE.childTasks[nE.childTasks.length - 1].unitPrice || 0)
            //   nE.submitAmount = this.toFixed2r(nE.childTasks[nE.childTasks.length - 1].submitAmount || 0)
            // }
            obj.numTasks[ni].submitAmount += this.toFixed2(nE.submitAmount || 0)
            obj.numTasks[ni].approvedAmount += this.toFixed2(nE.approvedAmount || 0)
            obj.numTasks[ni].unitPrice += this.toFixed2(nE.unitPrice || 0)
          })
        }
        obj.submitAmount += this.toFixed2(ele.submitAmount || 0)
        obj.approvedAmount += this.toFixed2(ele.approvedAmount || 0)
        obj.unitPrice += this.toFixed2(ele.unitPrice || 0)

        //加小数点两位
        ele.submitAmount = this.toFixed2r(ele.submitAmount)
        ele.approvedAmount = this.toFixed2r(ele.approvedAmount)
        ele.unitPrice = this.toFixed2r(ele.unitPrice)

      })
      //汇总
      // this.tasksData.forEach(ele => {
      //   if((ele.children || []).length){
      //     ele.childTasks.forEach(e => {
      //       e.finally = ele.numTasks[ele.numTasks.length -1].unitPrice
      //     })
      //   }else {
      //     ele.finally = ele.unitPrice
      //   }
      // })

      this.tasksData.forEach(ele => {
        ele.unitPrice = parseFloat(ele.unitPrice).toFixed(2)
        if((ele.children || []).length){
          ele.children.forEach((e,index) => {
            // debugger
            e.unitPrice = parseFloat(e.unitPrice).toFixed(2)
            e.difference = (Math.abs(e.numTasks[e.numTasks.length -1].unitPrice - ((e.numTasks[e.numTasks.length -2] || {}).unitPrice || 0))).toFixed(2)
            e.ratio = ((e.difference/((e.numTasks[e.numTasks.length -2]||{}).unitPrice || 1)) * 100).toFixed(2) + '%'
            e.increaseOrDecrease = (Math.abs(e.unitPrice - e.submitAmount)).toFixed(2)
            e.increaseOrDecreaseRatio = ((e.increaseOrDecrease/(parseFloat(e.submitAmount) || 1)) * 100).toFixed(2) + '%'
          })
        }
        // debugger
        ele.difference = (Math.abs(ele.numTasks[ele.numTasks.length -1].unitPrice - ((ele.numTasks[ele.numTasks.length -2]||{}).unitPrice || 0))).toFixed(2)
        ele.ratio = ((parseFloat(ele.difference)/(parseFloat((ele.numTasks[ele.numTasks.length -2]||{}).unitPrice) || 1)) * 100).toFixed(2) + '%'
        ele.increaseOrDecrease = (Math.abs(ele.unitPrice - ele.submitAmount)).toFixed(2)
        ele.increaseOrDecreaseRatio = ((ele.increaseOrDecrease/(ele.submitAmount || 1)) * 100).toFixed(2) + '%'
      })

      this.tasksData.push(obj)
      console.log(this.tasksData, this.tasks, 'get SummaryTask and Tasks')
    },

    toFixed2(amount) {
      return parseFloat(parseFloat(amount).toFixed(2))
    },
    toFixed2r(amount) {
      return parseFloat(amount).toFixed(2)
    },
    //设置项目金额
    setAmount(type, e) {
      console.log(type, e.target.value)
      var mutationString = ``
      if (e.target.value == '') {
        return
      }
      if (type == 1) {
        mutationString = `update_Project(_set:{submitAmount:${e.target.value || 0}},where:{id:{_eq:"${
          this.projectId
        }"}}){returning{id}}`
      } else if (type == 2) {
        mutationString = `update_Project(_set:{approvedAmount:${e.target.value || 0}},where:{id:{_eq:"${
          this.projectId
        }"}}){returning{id}}`
      } else if (type == 3) {
        mutationString = `update_Project(_set:{unitPrice:${e.target.value || 0}},where:{id:{_eq:"${
          this.projectId
        }"}}){returning{id}}`
      }
      this.mutateApollo(mutationString)
        .then(res => {
          console.log(res, 'set Amount success')
        })
        .catch(err => {
          console.log(err, 'set Amount error')
        })
      console.log(mutationString)
    },
    //判断是否要分配
    isDistribution(record) {
      let hasNumTask = (record.numTasks || []).filter(ele => [0, 3, 5].indexOf(ele.status) > -1)
      return hasNumTask.length
    },
    //移动
    async moveChild(record, index, type) {
      console.log(record, index, type, this.tasksData)
      let data = []
      if (record.id) {
        if ((record.parent || {}).id) {
          //子任务
          let parentTask = {}
          this.tasks.forEach((e, i) => {
            if (e.id == record.parent.id) {
              parentTask = e
            }
          })
          data = parentTask.childTasks
        } else {
          data = this.tasks
        }

        var updateTask = ``

        if (type == 1) {
            //上移
            if (index != 0) {
              let previous = data[index - 1]
              let prevoiusSortNo = previous.sortNo
              if(previous.id){
                updateTask +=
                `updateTask_0:update_Task(where:{id:{_eq:"${previous.id}"}},_set:{sortNo:${
                  record.sortNo
                }}){returning{id}}` + '\n'

                updateTask +=
                `updateTask_1:update_Task(where:{id:{_eq:"${record.id}"}},_set:{sortNo:${
                  prevoiusSortNo
                }}){returning{id}}` + '\n'
              }
              
              let res = this.dbConn.mutation(`mutation {${updateTask}}`)
              this.loadData()

                console.log(updateTask,'updateTaskupdateTaskupdateTask')
            }
          } else {
            //下移
            if(data.length - 1 != index){
              let next = data[index + 1]
              let nextSortNo = next.sortNo
              if(next.id){
                updateTask +=
                `updateTask_0:update_Task(where:{id:{_eq:"${next.id}"}},_set:{sortNo:${
                  record.sortNo
                }}){returning{id}}` + '\n'

                updateTask +=
                `updateTask_1:update_Task(where:{id:{_eq:"${record.id}"}},_set:{sortNo:${
                  nextSortNo
                }}){returning{id}}` + '\n'
                console.log(updateTask,'updateTaskupdateTaskupdateTask')
                let res = this.dbConn.mutation(`mutation {${updateTask}}`)
                this.loadData()
              }
            }
          }
      }
    }
  }
}
</script>

<style>
.ui-w100 {
  width: 130px;
}
.cost-span {
  display: inline-block;
  width: 90px;
  text-align: right;
}
.cost-title {
  color: #5873c9;
  line-height: 32px;
  margin-bottom: 10px;
  font-size: 16px;
}
.cost-rowLine {
  /* height: 28px; */
  /* line-height: 28px; */
  margin-bottom: 10px;
}

.addCostTask {
  margin-top: 10px;
  font-size: 12px;
}
.addCostTask a {
  color: #5873c9;
}

.costTable .ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
.costTable .ant-table-thead tr th {
  background-color: #eee !important;
}
.costTable .ant-table-small .ant-table-content .ant-table-body .ant-table-row td {
  padding: 0;
  line-height: 0px;
  font-size: 13px;
}
.costTable .ant-table-row-hover td {
  background: #fff !important;
}
.costTable .ant-table-thead {
  font-size: 13px;
}
.costTable input {
  padding: 3px
}
.inputC {
  margin: -5px 0;
  text-align: 'center';
  border: 0;
}
.inputC:focus {
  box-shadow: unset;
}
.costTable .ant-table-row-spaced {
  display: none;
}
.f12 {
  font-size: 12px;
}
.ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-tbody > tr > td {
  padding: 8px 5px
}
</style>

