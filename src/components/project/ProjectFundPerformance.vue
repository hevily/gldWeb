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
          <td>0&nbsp;元</td>
          <th width="140">项目提成比例：</th>
          <td>
            <a-input
              type="text"
              style="text-align: right; width: 100px;"
              class="ui-input"
              maxlength="11"
            />&nbsp;%
          </td>
          <th width="140">项目提成金额：</th>
          <td>
            <a-input
              type="text"
              style="text-align: right; width: 100px;"
              class="ui-input"
              maxlength="11"
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
      <a-table :columns="columns" :dataSource="data" :pagination="false" :bordered="true">
        <!-- <a-icon type="plus-circl" slot="title" scopedSlots="text,record,index">新增</a-icon> -->
        <!-- <span slot="ok">
          {{ costName }}
          <a-icon type="plus-circle" @click="addDraft" style="color:#5873c9;"/>
        </span>-->
        <span slot="专业系数" slot-scope="text,record,index">{{ text[0].value }}</span>
        <!-- </template> -->
        <!-- 自定义新增行 -->
        <!-- <template
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
            <a-input class="inputC" v-else :value="text" readonly/>
          </div>
        </template>-->
        <span slot="ratiosNum">
          <a-input value="个人提成系数" style="width:150px;margin-right:5px" class/>
          <a-icon type="form" class="font-blue" style="cursor:pointer"/>
        </span>
        <span slot="baseNum">
          <a-input value="分配基数" style="width:150px;" class/>
          <!-- <a-icon type="form" class="font-blue" style="cursor:pointer"/> -->
        </span>
        <!-- 自定义操作 -->
        <template slot="operation" slot-scope="text, record, index">
          <span>
            <a @click="saveRow(record.key)" class="font-blue">添加任务</a>
            <a-divider type="vertical"/>
            <a @click="cancel(record.key)" class="font-blue">删除</a>
          </span>
        </template>
      </a-table>

      <div style="margin-top:5px">
        <a class="font-blue" style="font-size:12px">
          <a-icon type="plus"/>添加行
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// const
export default {
  name: 'ProjectFundPerformance',
  props: {},
  data() {
    return {
      columns: [
        {
          title: '项目成员',
          dataIndex: 'name',
          //     colSpan:2,
          //   rowSpan: 1,
          key: 'name',
          width: '100',
          scopedSlots: {
            customRender: 'name'
          },
          customRender: (value, row, index) => {
            console.log(value, row, index)
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 0) {
              obj.attrs.rowSpan = 2
            }
            if (index === 1) {
              obj.attrs.rowSpan = 0
            }
            return obj
          }
        },
        {
          title: '工作项',
          dataIndex: 'item',
          key: 'item',
          width: '60',
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
              title: '工程造价',
              dataIndex: 'cost',
              key: 'cost',
              width: '60',
              scopedSlots: { customRender: 'cost' }
            },
            {
              title: '费率',
              dataIndex: 'rate',
              key: 'rate',
              width: '60',
              scopedSlots: { customRender: 'rate' }
            },
            {
              title: '咨询费金额',
              dataIndex: 'fee',
              key: 'fee',
              width: '60',
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
              scopedSlots: { customRender: '专业系数' }
            },
            {
              title: '规模系数',
              dataIndex: 'ratios',
              key: '规模系数',
              width: '80',
              scopedSlots: { customRender: '规模系数' }
            }
          ]
        },
        {
          title: '小计',
          dataIndex: 'littleTotal',
          key: 'littleTotal',
          width: '80',
          scopedSlots: { customRender: 'littleTotal' }
        },
        {
          title: '增减额',
          dataIndex: 'adjust',
          key: 'adjust',
          width: '100',
          scopedSlots: { customRender: 'adjust' }
        },
        {
          title: '合计',
          dataIndex: 'total',
          key: 'total',
          width: '100',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '100',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          //   fixed: 'right',
          width: '100',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          id: '成员ID1',
          name: '姓名1',
          item: '工作项',
          baseNum: '分配基数',
          cost: '工程造价',
          rate: '费率',
          fee: '咨询费金额',
          ratios: [
            { name: '专业系数', value: '值' },
            { name: '难度系数', value: '值' },
            { name: '规模系数', value: '值' },
            { name: '绩效分', value: '值' }
          ],
          adjust: '增减额'
        },
        {
          id: '成员ID1',
          name: '姓名1',
          item: '工作项',
          baseNum: '分配基数',
          cost: '工程造价',
          rate: '费率',
          fee: '咨询费金额',
          ratios: [
            { name: '专业系数', value: '值' },
            { name: '难度系数', value: '值' },
            { name: '规模系数', value: '值' },
            { name: '绩效分', value: '值' }
          ],
          adjust: '增减额'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style>
.perTable {
  margin-top: 20px;
}

.perTable .ant-table-thead > tr > th,
.perTable .ant-table-tbody > tr > td {
  padding: 8px 16px;
}

.perTable .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.perTable .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.perTable .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
.perTable .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
  background: #fff;
}
</style>


