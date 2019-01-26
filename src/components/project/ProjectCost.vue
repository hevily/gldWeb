<template>
  <div>
    <div class="cost-title">项目指标</div>
    <a-row class="cost-rowLine">
      <a-col :span="6">
        <span class="cost-span">项目负责人：</span>
        <span>陈康然</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">业务类型：</span>
        <span>审核施工图预算</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">工程规模：</span>
        <span>0平方米</span>
      </a-col>
    </a-row>
    <a-row class="cost-rowLine">
      <a-col :span="6">
        <span class="cost-span">送审金额：</span>
        <a-input class="ui-w100" maxlength="12"/>
        <span>元</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">审定金额：</span>
        <a-input class="ui-w100" maxlength="12"/>
        <span>元</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">核增核减额：</span>
        <a-input class="ui-w100" maxlength="12"/>
        <span>元</span>
      </a-col>
      <a-col :span="6">
        <span class="cost-span">单方造价：</span>
        <a-input class="ui-w100" maxlength="12"/>
        <span>元/平方米</span>
      </a-col>
    </a-row>

    <!-- 任务表格 -->
    <div style="margin-top:20px" class="costTable">
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        size="small"
        :bordered="true"
        :scroll="{x:scrollX}"
      >
        <!-- <a-icon type="plus-circl" slot="title" scopedSlots="text,record,index">新增</a-icon> -->
        <span slot="ok">
          {{ costName }}
          <a-icon type="plus-circle" @click="addDraft" style="color:#5873c9;"/>
        </span>

        <!-- </template> -->
        <!-- 自定义新增行 -->
        <template
          v-for="(col, i) in ['name', 'workId', 'department']"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <a-input
              class="inputC"
              v-if="index <= data.length-2"
              :value="text"
              :placeholder="columns[i].title"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- <span v-else>{{ text }}</span> -->
            <a-input class="inputC" v-else :value="text" readonly/>
          </div>
        </template>
        <!-- 自定义操作 -->
        <template slot="operation" slot-scope="text, record, index">
          <span>
            <a @click="saveRow(record.key)">
              <a-icon type="save"/>
            </a>
            <a-divider type="vertical"/>
            <a @click="cancel(record.key)">
              <a-icon type="delete"/>
            </a>
          </span>
        </template>

        <!-- <template slot="footer" slot-scope="currentPageData">{{ currentPageData }}</template> -->
      </a-table>

      <div class="addCostTask">
        <a href="javascript:void(0)">
          <a-icon type="plus"></a-icon>添加任务
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectCost',
  props: {},
  data() {
    return {
      costName: '初稿',
      scrollX: 1200,
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
          width: '100',
          scopedSlots: {
            customRender: 'name'
          }
        },
        {
          title: '负责人',
          dataIndex: 'workId',
          key: 'workId',
          width: '60',
          scopedSlots: { customRender: 'workId' }
        },
        {
          title: '复核人',
          dataIndex: 'department',
          key: 'department',
          width: '60',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '送审金额',
          dataIndex: 'department2',
          key: 'department2',
          width: '80',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '造价金额',
          dataIndex: 'd',
          key: 'department3',
          // width: '300',
          children: [
            {
              // title: '初稿',
              dataIndex: 'department2',
              key: 'department5',
              width: '80',
              slots: {
                title: 'ok'
              },
              scopedSlots: { customRender: 'department' }
            }
          ]
        },
        {
          title: '偏差率',
          dataIndex: 'department2',
          key: 'department12',
          width: '80',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '偏差原因',
          dataIndex: 'department2',
          key: 'department11',
          width: '100',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: '100',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          key: '1',
          name: '小明',
          workId: '001',
          editable: false,
          department: '行政部'
        },
        {
          key: '2',
          name: '李莉',
          workId: '002',
          editable: false,
          department: 'IT部'
        },
        {
          key: '3',
          name: '王小帅',
          workId: '003',
          editable: false,
          department: '财务部'
        }
      ]
    }
  },

  created() {},
  methods: {
    remove(key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    saveRow(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
    },
    toggle(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    getRowByKey(key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
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
      var draftCL = draftObj['children']
      var draftCLL = draftCL.length

      if (draftCLL > 6) {
        return
      }
      var obj = { 1: '二稿', 2: '三稿', 3: '四稿', 4: '五稿', 5: '六稿', 6: '终稿' }
      var lastDraft = Object.assign({}, draftCL[draftCLL - 1])
      draftCL[draftCLL - 1].title = this.costName
      delete draftCL[draftCLL - 1].slots
      // debugger;
      this.costName = obj[draftCLL]
      draftCL.push(lastDraft)
      draftObj['children'] = draftCL
      this.columns.splice(draftIndex, 1, draftObj)
      this.scrollX += draftCLL * 40

      // switch(draftCLL){

      // }

      // }
      // console.log(column)
    }
  }
}
</script>

<style>
.ui-w100 {
  width: 112px;
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
}
.costTable .ant-table-row-hover td{
  background: #fff !important;
}
.inputC {
  margin: -5px 0;
  text-align: 'center';
  border: 0;
}
.inputC:focus {
  box-shadow:unset
}
</style>

