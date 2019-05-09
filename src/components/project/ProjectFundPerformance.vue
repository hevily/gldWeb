<template>
  <div>
    <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <th width="140">项目绩效总评分：</th>
          <td colspan="5">
            <a-input type="text" class="ui-input ui-w100"/>
            <span style="margin-left:10px">
              <a-button type="default" icon="upload">上传附件</a-button>
            </span>
          </td>
        </tr>
        <tr>
          <th class="th-top">绩效说明：</th>
          <td colspan="5">
            <a-textarea style="width: 845px"></a-textarea>
          </td>
        </tr>
        <tr>
          <th width="140">项目咨询服务费：</th>
          <td>{{money}}&nbsp;元</td>
          <th width="140">项目提成比例：</th>
          <td>
            <a-input
              type="text"
              style="text-align: right; width: 100px;"
              class="ui-input"
              maxlength="11"
              :value="Proportion"
            />&nbsp;%
          </td>
          <th width="140">项目提成金额：</th>
          <td>
            <a-input
              type="text"
              style="text-align: right; width: 100px;"
              class="ui-input"
              maxlength="11"
              :value="totalMoney"
            />&nbsp;元
          </td>
        </tr>
        <tr>
          <th></th>
          <td>
            <!-- <input class="ui-btn ui-btn_lg" value="保存" type="button"> -->
            <a-button type="primary">保存</a-button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="perTable">
      <a-row style="margin-bottom:10px">
        <a-col :span="12"></a-col>
        <a-col :span="12" style="text-align:right">
          <span>核算期：</span>
          <a-input v-model="accountingTime" @blur="changeDate" style="width:150px"/>
          <!-- <a-date-picker v-if="accountingTime" :value="moment(accountingTime,'YYYY-MM-DD')" @change="changeDate"></a-date-picker>
          <a-date-picker v-else @change="changeDate"></a-date-picker>-->
        </a-col>
      </a-row>
      <a-table :columns="columns" :dataSource="data" :pagination="false" :bordered="true">
        <!-- <a-icon type="plus-circl" slot="title" scopedSlots="text,record,index">新增</a-icon> -->
        <!-- <span slot="ok">
          {{ costName }}
          <a-icon type="plus-circle" @click="addDraft" style="color:#78bb60;"/>
        </span>-->
        <span slot="name" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input :style="{width:'70px',textAlign:'right'}" v-model="record.item"/>
        </span>
        <!-- 工作项 -->
        <span slot="item" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <!-- <a-select v-model="record.itme" @change="updatePer(record)">
            <a-select-option key="1" value="审核">审核</a-select-option>
            <a-select-option key="2" value="审核">编制</a-select-option>
            <a-select-option key="2" value="审核">复核</a-select-option>
            <a-select-option key="2" value="审核">拓展</a-select-option>
          </a-select>-->
          <a-input
            :style="{width:'70px',textAlign:'right'}"
            v-model="record.item"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="cost" slot-scope="text,record,index">
          <a-input-number
            v-if="data.length - 2 >= index"
            :min="0"
            :style="{width:'100px',textAlign:'right'}"
            v-model="record.cost"
            @change="getScale(record)"
            @blur="updatePer(record)"
          />
          <span v-else>{{parseFloat(record.cost).toFixed(2)}} </span>
        </span>
        <span slot="rate" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            :style="{width:'70px',textAlign:'right'}"
            v-model="record.rate"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="fee" slot-scope="text,record,index" >
          <a-input-number
            v-if="data.length - 2 >= index"
            :min="0"
            :style="{width:'70px',textAlign:'right'}"
            v-model="record.fee"
            @blur="updatePer(record)"
          />
          <span v-else>{{parseFloat(record.fee).toFixed(2)}}</span>
        </span>
        <span slot="ratios1" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            :defaultValue="0"
            :style="{width:'60px',textAlign:'right'}"
            v-model="((record.ratios||[]).filter(ele => ele.name == '专业系数')[0]||{}).value"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="ratios2" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            :defaultValue="0"
            :style="{width:'60px',textAlign:'right'}"
            v-model="((record.ratios||[]).filter(ele => ele.name == '难度系数')[0]||{}).value"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="ratios3" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            :defaultValue="0"
            
            :style="{width:'60px',textAlign:'right'}"
            v-model="((record.ratios||[]).filter(ele => ele.name == '规模系数')[0]||{}).value"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="ratios4" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            :defaultValue="0"
            :style="{width:'60px',textAlign:'right'}"
            v-model="((record.ratios||[]).filter(ele => ele.name == '调整系数')[0]||{}).value"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="ratios5" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            disabled
            :defaultValue="0"
            :style="{width:'60px',textAlign:'right'}"
            v-model="((record.ratios||[]).filter(ele => ele.name == '工期系数')[0]||{}).value"
            @blur="updatePer(record)"
          />
        </span>

        <span slot="adjust" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input-number
            :min="0"
            :defaultValue="0"
            :style="{width:'70px',textAlign:'right'}"
            v-model="record.adjust"
            @blur="updatePer(record)"
          />
        </span>
        <span slot="remark" slot-scope="text,record,index" v-if="data.length - 2 >= index">
          <a-input :style="{width:'70px'}" v-model="record.remark" @blur="updatePer(record)"/>
        </span>
        <!-- <span slot="littleTotal" slot-scope="text,record,index">
          <a-input :style="{width:'70px'}" v-model="record.littleTotal" readonly/>
        </span>
        <span slot="total" slot-scope="text,record,index">
          <a-input :style="{width:'70px'}" v-model="record.total" readonly/>
        </span>-->
        <span slot="ratiosNum">
          <a-input value="个人提成系数" style="width:150px;margin-right:5px" class/>
          <a-icon type="form" class="font-blue" style="cursor:pointer"/>
        </span>
        <span slot="baseNum">
          <a-input value="分配基数" style="width:150px;" class/>
        </span>
        <!-- 自定义操作 -->
        <template slot="operation" slot-scope="text, record, index" v-if="data.length - 2 >= index">
          <span style="font-size:12px">
            <a @click="insertRow(record,index)" class="font-blue">添加任务</a>
            <a-divider type="vertical"/>
            <a @click="deletePerformance(record,index)" class="font-blue">删除</a>
          </span>
        </template>
      </a-table>

      <div style="margin-top:5px">
        <a class="font-blue" style="font-size:12px" @click="addRow">
          <a-icon type="plus"/>添加行
        </a>
      </div>
    </div>
    <employeeTree :inivisible="eVisibled" :inititle="eTitle" @changeStatus="employeeChange"/>
  </div>
</template>

<script>
// const

import { db } from '@/components/_util/db'
import { ArrayToString } from '@/components/_util/StringUtil'
import { mapState } from 'vuex'
import employeeTree from '@/components/same/employeeTree'
import moment from 'moment'

export default {
  name: 'ProjectFundPerformance',
  props: {
    projectId: {
      type: String,
      default: ''
    },
    money: {
      type: Number,
      default: 0
    },
    urgentStatus: {
      type: Number,
      default: 0
    },
    accountingDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dbConn: new db(this.$apollo), //数据库操作,
      onlyName: [], //名称数组唯一
      sortNo: [],
      eVisibled: false,
      eTitle: '添加人员',
      Record: {},
      totalMoney: 0, //项目提成金额
      Proportion: 0, //提成比例
      columns: [
        {
          title: '项目成员',
          dataIndex: 'employee',
          key: 'employee',
          width: '100',
          align: 'center',
          scopedSlots: {
            customRender: 'name'
          },
          customCell: this.customCell,
          customRender: (value, row, index) => {
            // console.log(value, row, index)
            // debugger
            // console.log(this.data)
            const obj = {
              children: (value || {}).name,
              attrs: { rowSpan: row.rowSpan }
            }
            if (!(value || {}).name) {
              obj.children = ''
            } else {
            }

            // console.log(obj, index, 'index')
            return obj
          }
        },
        {
          title: '工作项',
          dataIndex: 'item',
          key: 'item',
          width: '60',
          align: 'center',
          scopedSlots: { customRender: 'item' }
        },
        {
          // title: '分配基数',
          dataIndex: 'baseNum',
          key: 'baseNum',
          width: '60',
          slots: {
            title: 'baseNum'
          },
          // scopedSlots: { customRender: 'baseNum' },
          children: [
            {
              title: '规模系数基础',
              dataIndex: 'cost',
              key: 'cost',
              width: '60',
              align: 'center',
              scopedSlots: { customRender: 'cost' }
            },
            // {
            //   title: '费率',
            //   dataIndex: 'rate',
            //   key: 'rate',
            //   width: '60',
            //   align: 'center',
            //   scopedSlots: { customRender: 'rate' }
            // },
            {
              title: '咨询费金额',
              dataIndex: 'fee',
              key: 'fee',
              width: '60',
              align: 'center',
              scopedSlots: { customRender: 'fee' }
            }
          ]
        },

        {
          // title: '个人提成系数',
          dataIndex: 'ratiosNum',
          key: 'ratiosNum',
          slots: {
            title: 'ratiosNum'
          },
          // scopedSlots: { customRender: 'ratiosNum' },
          children: [
            {
              title: '专业系数',
              dataIndex: 'ratios',
              key: '专业系数',
              width: '80',
              align: 'center',
              scopedSlots: { customRender: 'ratios1' }
            },
            {
              title: '难度系数',
              dataIndex: 'ratios',
              key: '难度系数',
              width: '80',
              align: 'center',
              scopedSlots: { customRender: 'ratios2' }
            },
            {
              title: '规模系数',
              dataIndex: 'ratios',
              key: '规模系数',
              width: '80',
              align: 'center',
              scopedSlots: { customRender: 'ratios3' }
            },
            
            {
              title: '工期系数',
              dataIndex: 'ratios',
              key: '工期系数',
              width: '80',
              align: 'center',
              scopedSlots: { customRender: 'ratios5' }
            },{
              title: '调整系数',
              dataIndex: 'ratios',
              key: '调整系数',
              width: '80',
              align: 'center',
              scopedSlots: { customRender: 'ratios4' }
            },
          ]
        },
        {
          title: '小计',
          dataIndex: 'littleTotal',
          key: 'littleTotal',
          width: '80',
          align: 'right',
          scopedSlots: { customRender: 'littleTotal' }
        },
        {
          title: '增减额',
          dataIndex: 'adjust',
          key: 'adjust',
          width: '100',
          align: 'center',
          scopedSlots: { customRender: 'adjust' }
        },
        {
          title: '合计',
          dataIndex: 'total',
          key: 'total',
          width: '100',
          align: 'right',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '100',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          //   fixed: 'right',
          align: 'center',
          width: '100',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      accountingTime: this.accountingDate
    }
  },
  created() {
    this.loadData()
  },
  components: {
    employeeTree
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  methods: {
    moment,
    loadData() {
      let _this = this
      var queryString = `query {
        Performance(where:{project_id:{_eq:"${_this.projectId}"}},order_by:[{sortNo:asc},{createdAt:asc}]){
          id
          sortNo
          adjust #增减额
          baseNum
          cost #工程造价
          employee_id
          employee {
            id
            name
          }
          fee #咨询费金额
          project_id
          formula 
          item #工作项
          rate #费率
          ratios #个人提成系数
          total #合计
        }
      }`
      this.dbConn
        .query(queryString)
        .then(res => {
          // _this.invoiceData = res.data.Invoice
          _this.initData(res.data.Performance)
          console.log(res, 'get project Performance and project success')
        })
        .catch(err => {
          console.log(err, 'get project Performance and project fail')
        })
    },
    initData(data) {
      this.data = [].concat(data)
      this.onlyName = []
      this.sortNo = []
      var allTotal = 0
      var costTotal = 0
      var feeTotal = 0
      // var onlyId = []
      this.data.forEach(ele => {
        ele.littleTotal = 0
        allTotal += ele.total || 0
        costTotal += ele.cost || 0
        feeTotal += ele.fee || 0
        ele.ratios.forEach(rat => {
          if (rat.name == '绩效分') {
            //改名
            rat.name = '调整系数'
          }
        })
        let projectRate = ele.ratios.filter(e => e.name == '工期系数')
        if (projectRate.length) {
          if (this.urgentStatus == 1) {
            projectRate[0].value = 1.05
          } else if (this.urgentStatus == 2) {
            projectRate[0].value = 1.1
          } else {
            projectRate[0].value = 1
          }
        } else {
          var obj = { name: '工期系数', value: 1 }
          if (this.urgentStatus == 1) {
            obj.value = 1.05
          } else if (this.urgentStatus == 2) {
            obj.value = 1.1
          }
          ele.ratios.push(obj)
        }
        // debugger
        console.log(ele.ratios)
        if (ele.fee) {
          ele.littleTotal = ele.fee || 0
          ele.ratios.forEach(rat => {
            if (rat.value) {
              ele.littleTotal = parseFloat((ele.littleTotal * (rat.value || 1)).toFixed(2))
              // console.log(ele.littleTotal ,'ele.littleTotal ')
            }
          })

          // if(this.urgentStatus == 1){
          //   ele.littleTotal = parseFloat((ele.littleTotal * 1.05).toFixed(2))
          // }else if(this.urgentStatus == 2){
          //   ele.littleTotal = parseFloat((ele.littleTotal * 1.1).toFixed(2))
          // }
        }
        // ele.rowSpan=0
        this.onlyName.push((ele.employee || {}).name)
        this.sortNo.push(ele.sortNo)
        // onlyId.push(ele.employeeId)
        if (!ele.employee_id) {
          ele.rowSpan = 1
        } else {
          var sameData = this.data.filter(e => e.employee_id == ele.employee_id)
          if (sameData.length == 1) {
            ele.rowSpan = 1
          } else {
            sameData.forEach((s, index) => {
              if (index == 0) {
                s.rowSpan = sameData.length
              } else {
                s.rowSpan = 0
              }
            })
          }
        }
      })

      this.data.push({
        employee: { name: '总计', id: 'total' },
        total: allTotal,
        cost:costTotal,
        fee:feeTotal
      })
      this.totalMoney = allTotal

      this.Proportion = ((this.totalMoney / (this.money || 1)) * 100).toFixed(2)

      this.onlyName = Array.from(new Set(this.onlyName))
      this.sortNo = Array.from(new Set(this.sortNo))

      //  console.log(document.getElementsByClassName('name'))
      // console.log(this.sortNo)
    },
    //添加任务相当于插入任务
    insertRow(record, index) {
      console.log(record, index)
      var obj = {
        project_id: this.projectId,
        employee_id: record.employee_id,
        employee: record.employee,
        sortNo: record.sortNo,
        rowSpan: 0,
        ratios: [
          { name: '专业系数', value: '' },
          { name: '难度系数', value: '' },
          { name: '规模系数', value: '' },
          { name: '调整系数', value: '' },
          { name: '工期系数', value: '' }
        ]
      }
      // console.log(this.data)
      this.data.splice(index + 1, 0, obj)
      this.data.splice(this.data.length - 1, 1)
      this.initData(this.data)
      // console.log(this.data)
    },
    //删除
    deletePerformance(record, index) {
      let _this = this
      if (record.id) {
        var mutationString = `mutation{
          delete_Performance(where:{id:{_eq:"${record.id}"}}){returning{id}}
        }`
        this.dbConn
          .mutation(mutationString)
          .then(res => {
            _this.$message.success('删除成功')
            _this.data.splice(index, 1)
            _this.loadData()
            // _this.initData(this.data)
            _this.$emit('updateTotal')
          })
          .catch(err => {})
        console.log(mutationString)
      } else {
        this.data.splice(index, 1)
        _this.loadData()
        // this.initData(this.data)
      }
      console.log(record)
    },
    //添加任务
    addRow() {
      this.data.splice(this.data.length - 1, 0, {
        project_id: this.projectId,
        employee_id: Math.random(1), //随机生成id
        sortNo:
          this.sortNo.sort(function(a, b) {
            return b - a
          })[0] + 1,
        ratios: [
          { name: '专业系数', value: '' },
          { name: '难度系数', value: '' },
          { name: '规模系数', value: '' },
          { name: '调整系数', value: '' },
          { name: '工期系数', value: '' }
        ]
      })
    },
    //更新计算
    updatePer(record) {
      console.log(record)
      let _this = this

      record.ratios.forEach(rat => {
        if (rat.name == '绩效分') {
          //改名
          rat.name = '调整系数'
        }
      })
      let projectRate = record.ratios.filter(e => e.name == '工期系数')
      if (projectRate.length) {
        if (this.urgentStatus == 1) {
          projectRate[0].value = 1.05
        } else if (this.urgentStatus == 2) {
          projectRate[0].value = 1.1
        } else {
          projectRate[0].value = 1
        }
      } else {
        var obj = { name: '工期系数', value: 1 }
        if (this.urgentStatus == 1) {
          obj.value = 1.05
        } else if (this.urgentStatus == 2) {
          obj.value = 1.1
        }
        record.ratios.push(obj)
      }
      if (record.fee) {
        record.littleTotal = record.fee || 0
        record.ratios.forEach(ele => {
          ele.value = ele.value || ''
          if (ele.value) {
            record.littleTotal = parseFloat((record.littleTotal * (ele.value || 1)).toFixed(2))
          }
        })
        // if (_this.urgentStatus == 1) {
        //   record.littleTotal = parseFloat((record.littleTotal * 1.05).toFixed(2))
        // } else if (_this.urgentStatus == 2) {
        //   record.littleTotal = parseFloat((record.littleTotal * 1.1).toFixed(2))
        // }

        if (record.adjust) {
          record.total = (record.littleTotal + parseFloat(record.adjust)).toFixed(2)
        } else {
          record.total = parseFloat(record.littleTotal || 0).toFixed(2)
        }
      } else if (record.adjust) {
        ele.value = ele.value || ''
        record.total = (0 + parseFloat(record.adjust)).toFixed(2)
      } else {
        ele.value = ele.value || ''
        record.total = parseFloat(0).toFixed(2)
      }

      // record.total = record.total *

      if (record.id) {
        //更新
        var mutationString = `
          mutation{
             update_Performance(where:{id:{_eq:"${record.id}"}},_set:{
              ratios:${ArrayToString(record.ratios)},
              item:"${record.item || ''}",
              cost:${record.cost || 0},
              fee:${record.fee || 0},
              rate:${record.rate || 0},
              adjust:${record.adjust | 0},
              total:${record.total || 0},
            }){returning{id}}
          }
        `
        _this.dbConn
          .mutation(mutationString)
          .then(res => {
            // _this.$message.success('更新成功')
            console.log(res, 'res')
            _this.loadData()
            _this.$emit('updateTotal')
          })
          .catch(err => {})
        // console.log(mutationString)
      } else {
        //新增
        if (!(record.employee || {}).id) {
          return false
        } else {
          var mutationString = `
            mutation{
              insert_Performance(objects:[{
                ratios:${ArrayToString(record.ratios)},
                employee_id:"${record.employee_id}",
                project_id:"${record.project_id}",
                sortNo:${record.sortNo},
                item:"${record.item || ''}",
                cost:${record.cost || 0},
                fee:${record.fee || 0},
                rate:${record.rate || 0},
                adjust:${record.adjust | 0},
                total:${record.total || 0},
              }]){returning{id}}
            }
          `
          _this.dbConn
            .mutation(mutationString)
            .then(res => {
              // _this.$message.success('更新成功')
              console.log(res, 'res')
              // _this.initData(_this.data)
              _this.loadData()
              _this.$emit('updateTotal')
            })
            .catch(err => {})
        }
      }
    },
    //项目成员
    customCell(record, rowIndex) {
      // console.log(record,index)
      let _this = this
      return {
        props: {},
        style: {},
        on: {
          // 事件
          click: () => {
            console.log(record, rowIndex)
            if (!(record.employee || {}).id) {
              _this.eVisibled = true
              _this.Record = record
            }
            // console.log(this)
          }
        }
      }
    },
    employeeChange(obj) {
      this.eVisibled = false
      let _this = this
      if (obj.data.length) {
        if (this.onlyName.indexOf(obj.data[0].title) > -1) {
          this.$message.error('已有该成员不能重复添加')
        } else {
          this.Record.employee = {
            id: obj.data[0].key,
            name: obj.data[0].title
          }
          var sameData = this.data.filter(ele => ele.employee_id == this.Record.employee_id)
          var performString = ``
          sameData.forEach(ele => {
            ele.employee_id = this.Record.employee.id
            performString += `{
              employee_id:"${ele.employee_id}"
              project_id:"${this.projectId}",
              ratios:[{name:"专业系数",value: ""},{name:"难度系数",value: ""},{name:"规模系数",value: ""},{name:"调整系数",value: ""},{name:"工期系数",value: ""}],
            }`
          })

          var mutationString = `mutation {
            insert_Performance(objects:[${performString}]){returning {id}}
          }`
          this.dbConn.mutation(mutationString).then(res => {
            _this.$message.success('保存成功')
            _this.loadData()
            // _this.initData(this.data)
          })
          console.log(mutationString)
          // this.initData(this.data)
        }
      }
    },
    //修改核算日期
    async changeDate(e) {
      console.log(e, 'dddd')
      // this.accountingTime = e.format('YYYY-MM-DD')
      // let accountingTime = e.add(8,'hours').utc().format()
      let accountingTime = this.accountingTime
      var mutation = `mutation {
        update_Project(where:{id:{_eq:"${this.projectId}"}},_set:{
          accountingDate:"${accountingTime}"
        }){returning{id}}
      }`
      console.log(mutation)
      let res = await this.dbConn.mutation(mutation)
      this.$emit('updateTotal')
    },
    getScale(record) {
      console.log(record, 'getScale')
      let money = this.computeScale(record.cost) / (record.cost || 1)
      if (record.ratios) {
        let obj = record.ratios.filter(ele => ele.name == '规模系数')[0] || {}
        obj.value = money.toFixed(2)
      }
      // ((record.ratios||[]).filter(ele => ele.name == '规模系数')[0]||{}).value = money
    },
    //计算规模系数
    computeScale(money) {
      // var formula = {
      //   '<1000': 1.6,
      //   '<2000': 1.5,
      //   '<5000': 1.4,
      //   '<10000': 1.3,
      //   '<30000': 1.2,
      //   '<50000': 1.1,
      //   '<100000': 1,
      //   '<300000': 0.9,
      //   '<500000': 0.8,
      //   '<1000000': 0.75,
      //   '>1000000': 0.7
      // }
      var formula = {
        '<1000': 1.7,
        '<10000': 1.3,
        '<30000': 1.1,
        '<100000': 0.9,
        '<300000': 0.85,
        '<500000': 0.75,
        '<800000': 0.7,
        '>800000': 0.6
      }
      let _price = money
      let _formulaArray = Object.keys(formula)
      let total = 0
      // console.log(_formulaArray)
      let _formulaString = ``
      let _formulaIndex = 0
      _formulaArray.forEach((ele, index) => {
        // let _value = ele
        // let preValue = _formulaArray[index - 1] || 0
        let _value = ele.slice(1)
        let preValue = (_formulaArray[index - 1] || '').slice(1) || 0

        //当前值减去上一个的值且不能为零 少于已减去的金额  且不能是最后一个
        if (_value - preValue <= _price && _value - preValue != 0 && index != _formulaArray.length - 1) {
          if (index == 0) {
            //第一个
            _price -= _value
            total += _value * formula[_formulaArray[index]]
            if (_price == 0) {
              _formulaString += `${_value}*${formula[_formulaArray[index]]}`
            } else {
              _formulaString += `${_value}*${formula[_formulaArray[index]]}+`
            }
          } else {
            _price -= _value - preValue
            total += (_value - preValue) * formula[_formulaArray[index]]
            if (_price == 0) {
              _formulaString += `${_value - preValue}*${formula[_formulaArray[index]]}`
            } else {
              _formulaString += `${_value - preValue}*${formula[_formulaArray[index]]}+`
            }
          }
        } else if (_price != 0) {
          //小于第一个或大于最后一个

          total += _price * formula[_formulaArray[index]]
          _formulaString += `${_price}*${formula[_formulaArray[index]]}`
          _price -= _price
        }
      })

      // if(_formulaIndex == 0){
      //   _formulaString +=`${_price} * ${formula[_formulaArray[0]]}`
      // }
      console.log(_formulaString, total)
      return total
      // return {
      //   _formulaString,
      //   total
      // }
    }
  }
}
</script>

<style>
.perTable {
  margin-top: 20px;
}

.perTable .ant-table-thead > tr > th,
.perTable .ant-table-tbody > tr > td {
  padding: 8px 8px;
}
.perTable .ant-table-tbody > tr > td .ant-input {
  border: 0;
  padding: 4px 2px;
}
.perTable .ant-table-tbody > tr > td .ant-input:hover,
.perTable .ant-table-tbody > tr > td .ant-input:focus {
  box-shadow: unset;
}

.perTable .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.perTable .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.perTable .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
.perTable .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
  background: #fff;
}
</style>


