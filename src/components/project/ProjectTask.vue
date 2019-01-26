<template>
  <div class="projectTask">
    <a-row style="margin-bottom:10px">
      <a-col :span="16">
        <a-button type="default" icon="export" style="margin-right: 15px;">导入项目计划</a-button>
        <a-button type="default" icon="swap" style="margin-right: 15px;">分配所有任务</a-button>
        <a-button type="default" icon="deployment-unit" style="margin-right: 15px;">查看人员负载</a-button>
      </a-col>
      <a-col :span="8" style="text-align:right">
        <a-input-search
          :style="{width:'75%'}"
          placeholder="任务名称、负责人、任务状态"
          @search="onSearch"
          enterButton
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" class="ui-new-table">
        <a-table :columns="columns" :dataSource="data" :pagination="false" bordered>
          <a-date-picker
            slot="endData"
            slot-scope="text,record,index"
            :defaultValue="moment(text, dateFormat)"
            :format="dateFormat"
            :disabled="record.status == 5"
          />

          <span slot="status" slot-scope="text,record,index">{{ text }}1</span>
          <span slot="reviews" slot-scope="text,record,index">
            <a v-if="record.reviews.length" class="font-blue">
              <a-icon type="message"/>查看
            </a>
          </span>
          <span slot="file" slot-scope="text,record,index">
            <a v-if="record.file.length" class="font-blue">
              <a-icon type="file-done"/>查看
            </a>
          </span>
          
          <a slot="remark" slot-scope="text,record,index" class="font-blue">备注</a>
          
          <span slot="action" slot-scope="text,record,index">
            <a class="font-blue" style="margin-right:5px">撤销</a>
            <a class="font-blue" style="margin-right:5px">插入</a>
            <a-dropdown :trigger="['click']" >
              <a class="ant-dropdown-link" href="#">
                <a-icon type="down-circle" style="font-size:16px;color:#999"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a>
                    <a-icon type="arrow-up"/>上移
                  </a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a>
                    <a-icon type="arrow-up"/>下移
                  </a>
                </a-menu-item>
                <a-menu-item key="3">
                  <a>
                    <a-icon type="share-alt"/>创建子任务
                  </a>
                </a-menu-item>
                <a-menu-item key="4">
                  <a>
                    <a-icon type="copy"/>复制任务
                  </a>
                </a-menu-item>
                <a-menu-item key="5">
                  <a>
                    <a-icon type="delete"/>删除任务
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <div class="addCostTask">
      <a href="javascript:void(0)">
        <a-icon type="plus"></a-icon>添加任务
      </a>
    </div>
    <a-row>
      <a-col :span="24"></a-col>
    </a-row>
  </div>
</template>

<script>
const columns = [
  {
    title: '任务名称',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    width: 360,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '负责人',
    width: 100,
    align: 'center',
    dataIndex: 'handler',
    key: 'handler',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '截止时间',
    width: 140,
    align: 'center',
    dataIndex: 'endData',
    key: 'endData',
    scopedSlots: { customRender: 'endData' }
  },
  {
    title: '任务状态',
    width: 100,
    align: 'center',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '工程文件',
    width: 100,
    align: 'center',
    key: 'file',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '审核记录',
    width: 100,
    align: 'center',
    key: 'reviews',
    dataIndex: 'reviews',
    scopedSlots: { customRender: 'reviews' }
  },
  {
    title: '备注',
    width: 80,
    align: 'center',
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    width: 120,
    align: 'center',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    key: '1',
    name: '安装工程',
    handler: '赵胜',
    endData: '2019-01-11',
    status: 2,
    remark: 'nice',
    reviews: [],
    file: []
  }
]
import moment from 'moment'
export default {
  name: 'ProjectTask',
  props: {},
  data() {
    return {
      columns,
      data,
      dateFormat: 'YYYY-MM-DD'
    }
  },
  methods: {
    moment,
    onSearch() {}
  }
}
</script>
<style>
.projectTask .ant-table-thead > tr > th,
.projectTask .ant-table-tbody > tr > td {
  padding: 8px 16px;
}
.projectTask .ui-new-table td {
  font-size: 13px;
}
</style>

