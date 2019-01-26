<template>
  <div>
    <a-row>
      <a-col :span="12">
        <!-- <h3>项目成员</h3> -->
        <a-button type="default" icon="plus">添加类别</a-button>
      </a-col>
      <a-col :span="12" style="text-align:right"></a-col>
    </a-row>
    <div :style="{marginTop:'10px'}" class="projectDocList">
      <a-list :dataSource="data" :renderItem="renderItemFun"></a-list>
    </div>
  </div>
</template>
<script>
import { Icon } from 'ant-design-vue'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1018467_zbasjalz32.js' // 在 iconfont.cn 上生成
})

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Action', dataIndex: '', key: 'x', scopedSlots: { customRender: 'action' } }
]

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    property: 0,
    show: true,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    children: [
      {
        key: 11,
        name: 'John Brown2',
        age: 32,
        property: 0,
        show: true,
        address: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        children: [
          {
            key: 12,
            name: 'John Brown3',
            property: 1,
            age: 32,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
          },
          {
            key: 13,
            name: 'John Brown34',
            property: 1,
            age: 32,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
          }
        ]
      },
      {
        key: 122,
        name: 'John Brown3',
        property: 1,
        age: 32,
        address: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
      }
    ]
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    property: 0,
    // show: true,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    property: 0,
    // show: true,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
  }
]

export default {
  name: 'ProjectDoc',
  props: {},
  data() {
    return {
      columns,
      data
    }
  },
  components: {
    MyIcon
  },
  methods: {
    renderItemFun(item, index) {
      var that = this
      return <a-list-item>{that.renderItemDiv(item, index, 1, true)}</a-list-item>
    },

    renderItemDiv(item, index, type, show) {
      var that = this

      return (
        <div class={show ? 'show' : 'hide'} style="width:100%;">
          {item.property == 0 ? (
            <div style={`width:100%;${type == 2 ? 'padding-left:30px' : ''}`}>
              <div style="height:40px;line-height:40px;border-bottom:1px solid #e8e8e8">
                <span class="pointer" style="margin-right:5px">
                  {item.children ? !item.show ? <a-icon type="plus-square" /> : <a-icon type="minus-square" /> : ''}
                </span>
                <span>
                  <span class="ellips" style="max-width:120px;font-size:16px;color: #555;">
                    {item.name}
                  </span>
                  <span style="margin-left:40px;color: #999;font-size:14px">
                    {type == 1 ? <a-icon type="plus" title="添加子节点" class="pointer" style="margin-left:5px" /> : ''}
                    <a-icon type="edit" title="修改名称" class="pointer" style="margin-left:5px" />
                    <a-icon type="delete" title="删除" class="pointer" style="margin-left:5px" />
                  </span>
                </span>
                <span style="max-width:100px;margin-left:40px">
                  <a-input type="text" style="max-width:100px" />
                </span>
                <span style="float:right">
                  <a-button icon="upload">上传资料</a-button>
                </span>
              </div>
              {item.children
                ? item.children.length
                  ? item.children.map(function(item2, index2) {
                      return that.renderItemDiv(item2, index2, 2, item.show)
                    })
                  : ''
                : ''}
            </div>
          ) : (
            <div style={`width:100%;height:40px;line-height:40px; ${type == 2 ? 'padding-left:30px' : ''}`}>
              <a-row style="border-bottom:1px solid #e8e8e8">
                <a-col span="9">
                  <span>
                    <my-icon type="icon-officeicon-1" style="" />
                    <a
                      href={item.url}
                      style="max-width:300px;margin-left:15px;display: inline-block;line-height: 18px;position: relative;top: 3px;"
                      class="ellips"
                    >
                      {item.name}11111111111111111111111111111111111fffffffffffffffddddddddddddd
                    </a>
                  </span>
                </a-col>
                <a-col span="2">
                  <span>19.33KB</span>
                </a-col>
                <a-col span="3">2019-01-21 09:18:50 </a-col>
                <a-col span="3">上传人：吴立新</a-col>
                <a-col span="4">
                  <a-input />
                </a-col>
                <a-col span="3" style="text-align:right;padding-right:10px">
                  
                  <a-icon type="export" title="移动"  class="pointer" style="margin-left:5px"/>
                  <a-icon type="download" title="下载" class="pointer" style="margin-left:5px" />
                  <a-icon type="delete" title="删除" class="pointer" style="margin-left:5px" />
                </a-col>
              </a-row>
            </div>
          )}
        </div>
      )
    }
  }
}
</script>
<style scoped>
.projectDocList .hide {
  display: none;
}
.projectDocList .show {
  display: block;
}
.projectDocList .pointer {
  cursor: pointer;
}
.ellips {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.projectDocList .ant-list-split .ant-list-item {
  border-bottom: none;
}
</style>


