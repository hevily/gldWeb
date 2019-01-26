<template>
  <div class="projectMember">
    <div>
      <a-row>
        <a-col :span="12">
          <h3>项目成员</h3>
        </a-col>
        <a-col :span="12" style="text-align:right">
          <a-button type="default" icon="plus">添加项目成员</a-button>
        </a-col>
      </a-row>
      <div :style="{marginTop:'10px'}" class="projectMemberTable">
        <a-table :columns="columns" :dataSource="data" :pagination="false">
          <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
          <a-avatar
            slot="img"
            slot-scope="text, record"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />

          <div slot="remark" slot-scope="text, record" class="remark">
            <a-input :value="text? text:'备注'" type="text"/>
          </div>
          <div slot="icon" slot-scope="text, record" :style="{textAlign:'right'}">
            <span :style="{padding:'2px',cursor:'pointer'}">
              <a-icon type="delete"/>
            </span>
          </div>
        </a-table>
      </div>
    </div>
    <div :style="{marginTop:'20px'}">
      <a-row>
        <a-col :span="12">
          <h3>外部联系人</h3>
        </a-col>
        <a-col :span="12" style="text-align:right">
          <a-button type="default" icon="plus">添加外部联系人</a-button>
        </a-col>
      </a-row>
      <div :style="{marginTop:'10px'}" class="projectMemberTable">
        <a-table :columns="columns" :dataSource="data" :pagination="false" v-if="data2.length">
          <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
          <a-avatar
            slot="img"
            slot-scope="text, record"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />

          <div slot="remark" slot-scope="text, record" class="remark">
            <a-input :value="text? text:'备注'" type="text"/>
          </div>
          <div slot="icon" slot-scope="text, record" :style="{textAlign:'right'}">
            <span :style="{padding:'2px',cursor:'pointer'}">
              <a-icon type="delete"/>
            </span>
          </div>
        </a-table>
        <div v-else class="empty-tip">
          <div :style="{fontSize:'50px'}">
            <a-icon type="project"/>
          </div>
          <div>暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: 'img',
    key: 'img',
    width: 60,
    //   slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '姓名',
    width: 120,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '职务',
    width: 120,
    dataIndex: 'work',
    key: 'work'
  },
  {
    title: '电话',
    width: 120,
    key: 'phone',
    dataIndex: 'phone'
  },
  {
    title: '备注',
    width: 120,
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    key: 'icon',
    scopedSlots: { customRender: 'icon' }
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    work: 32,
    phone: '13088987654',
    remark: 'nice'
  },
  {
    key: '2',
    name: 'Jim Green',
    work: 42,
    phone: '13088987654',
    remark: 'loser'
  },
  {
    key: '3',
    name: 'Joe Black',
    work: 32,
    phone: '13088987654'
    // remark: 'cool'
  }
]

export default {
  name: 'ProjectMember',
  props: {},
  data() {
    return {
      columns,
      data,
      data2: []
    }
  }
}
</script>
<style>
.projectMemberTable .ant-table-tbody > tr > td {
  padding: 4px 16px;
}
.projectMemberTable .ant-table-tbody > tr > td .remark input {
  border: 0px;
}
.projectMemberTable .ant-table-tbody > tr > td .remark input:focus {
  box-shadow: unset;
}
.projectMember .empty-tip {
    text-align: center;
    padding: 50px 0;
    color: #cbcbcb;
}
</style>


