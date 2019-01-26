<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0',minWidth:'1200px'}">
      <a-tabs
        default-active-key="1"
        size="large"
        :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
      >
        <a-tab-pane loading="true" :tab="title" key="1">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <a-button type="primary" icon="plus" @click="showModal">创建合同</a-button>
            </a-col>

            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{float: 'right',width: '60%',maxWidth:'400px'}">
                <a-input-search
                  placeholder="合同编号、合同名称、合同负责人、委托人"
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
              :rowKey="rowKey"
              :pagination="pagination"
              :scroll="{ x: 1500 }"
              :customRow="changeRow"
            >
              <a slot="description" slot-scope="text" href="javascript:;">{{ text }}</a>

              <!-- 合同编号slot -->
              <div slot="descripti1on" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  style="width:120px;display: block;"
                  :title="record.description"
                  @click="goContractDetail(record)"
                >{{ record.description }}1232323232323</a>
                <a v-if="record.star" style="position:absolute;right:-5px;top:0px">
                  <a-icon
                    type="star"
                    theme="filled"
                    style="color:#ffaf38;font-size:16px"
                    @click="changeStar(1,record,index)"
                  />
                </a>
                <a v-else-if="moveStar == record.no" style="position:absolute;right:-5px;top:0px">
                  <a-icon type="star" style="font-size:16px" @click="changeStar(2,record,index)"/>
                </a>
              </div>

              <!-- 签约日期筛选 -->
              <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="Modal"
                  v-model="visibled"
                  :maskClosable="maskClosabled"
                  okText="确认"
                  cancelText="取消"
                >
                  <a-input
                    ref="searchInput"
                    placeholder="Search name"
                    :value="selectedKeys[0]"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="() => handleSearch(selectedKeys, confirm)"
                  />
                  <a-button type="primary" @click="() => handleSearch(selectedKeys, confirm)">Search</a-button>
                  <a-button @click="() => handleReset(clearFilters)">Reset</a-button>
                </a-modal>
              </div>
            </a-table>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <div>
      <a-modal
        title="选择合同类型"
        style="top: 20px;"
        :width="250"
        :visible="modal1Visible"
        @ok="() => createContract(true)"
        @cancel="() => createContract(false)"
      >
        <a-radio-group v-model="value">
          <a-radio :style="radioStyle" :value="2">普通合同</a-radio>
          <a-radio :style="radioStyle" :value="3">框架合同</a-radio>
        </a-radio-group>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getServiceList } from '@/api/manage'

export default {
  name: 'TableList',
  props: {
    title: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: true
    },

    responseParamsName: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    rowKey: {
      type: String,
      default: 'no'
    }
  },
  data() {
    return {
      loading: true, //加载动态
      pageSizeOptions: ['10', '20', '30'],
      
      total: 0,
      currentPageSize: 10,
      defaultCurrent: 1,
      sortParams: {}, //排序参数
      queryParam: {},
      current: [],
      pagination: {},
      paramsName: {},
      maskClosabled: false,
      visibled: false,
      moveStar: '',
      selectedIndex: -1,
      modal1Visible: false,
      value: 2,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      // 表头
      columns: [
        {
          title: '合同编号',
          dataIndex: 'no',
          sorter: true
        },
        {
          title: '合同名称',
          dataIndex: 'descripti1on',
          sorter: true,
          width: '150px',
          scopedSlots: { customRender: 'descripti1on' }
        },
        {
          title: '委托人',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true,
          customRender: text => text + ' 次'
        },
        {
          title: '负责人',
          dataIndex: 'callNos',
          sorter: true,
          needTotal: true,
          customRender: text => text + ' 次'
        },

        {
          title: '签约日期',
          dataIndex: 'updatedAt',
          // sorter: true
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => {
            console.log(value, record)
          },
          onFilterDropdownVisibleChange: visible => {
            // debugger;
            // this._visible = visible
            if (visible) {
              this.visibled = visible
              setTimeout(() => {
                this.$refs.searchInput.focus()
              })
            }
          }
        },
        {
          title: '已回款/总金额(元)',
          dataIndex: 'yuan'
        },
        {
          title: '状态',
          dataIndex: 'status',
          // sorter: true
          filters: [
            {
              text: 'London',
              value: 'London'
            },
            {
              text: 'New York',
              value: 'New York'
            }
          ],
          onFilter: (value, record) => {
            console.log(value, record, 'record,value')
          }
        },
        {
          title: '纸质合同',
          dataIndex: 'statuss'
        },
        {
          title: '操作',
          dataIndex: 'description',
          width: '150px',
          fixed: 'right',
          scopedSlots: { customRender: 'description' }
        }
      ],
      data: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res, 'res')
          return res.result
        })
      }
    }
  },
  created() {
    //数据请求参数配置
    this.paramsName = Object.assign(
      {},
      {
        pageNumber: 'pageNo',
        pageSize: 'pageSize',
        total: 'totalCount',
        results: 'data',
        sortColumns: 'sortColumns'
      },
      this.responseParamsName
    )
    console.log(this.paramsName, 'paramsName')
    this.loadData({ pageNum: this.pageNumber })
  },
  methods: {
    //接口获取数据
    loadData(params) {
      const that = this
      that.loading = true
      params = Object.assign({}, params)
      const remoteParams = Object.assign({}, that.sortParams)
      remoteParams[that.paramsName.pageNumber] = params.pageNum || that.defaultCurrent
      remoteParams[that.paramsName.pageSize] = params.pageSize || that.currentPageSize

      if (params.pageNum) {
        that.defaultCurrent = params.pageNum
      }
      if (params.pageSize) {
        that.currentPageSize = params.pageSize
      }
      //返回promise axios请求
      const dataPromise = that.data(remoteParams)

      dataPromise.then(
        response => {
          if (!response) {
            that.loading = false
            return
          }
          let results = response[that.paramsName.results]
          results = (results instanceof Array && results) || []
          // var d = results[2]
          // results.length ? results[0]['children'] = [d] : ''
          // results[0]['children'] ? results[0]['children'][0]['key'] = 11:''
          that.current = results

          that.total = response[that.paramsName.total] * 1
          that.pagination = that.pager()
          that.loading = false
        },
        () => {
          that.loading = false
        }
      )
    },

    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      this.pageSize = pageSize
      // console.log(page, pageSize,'changePager')
      this.loadData({ pageNum: page })
    },
    onPagerSizeChange(current, size) {
      // console.log(current, size,'changeSize');
      this.defaultCurrent = current
      this.pageSize = size
      this.loadData({ pageSize: size })
    },

    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent,
        onChange: this.onPagerChange,
        onShowSizeChange: this.onPagerSizeChange
      }
    },

    onSearch() {},
    //表格单元格自定义函数
    changeRow(record, index) {
      return {
        props: {},
        style: {
          // backgroundColor:this.selectedIndex == index ? 'yellow':''
        },
        attrs: {
          id: record.no
        },
        ref: record.no,
        // refInFor: true,
        on: {
          // 事件
          click: () => {
            // 鼠标移入行,改变状态
            var allChildren = document.getElementById(record.no).parentNode.children
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

            this.moveStar = record.no
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
    changeStar(type, record, index) {
      if (type == 2) {
        record.star = true
        this.current.splice(index, 1, record)
      } else {
        record.star = false
        this.current.splice(index, 1, record)
      }
    },
    handleSearch(selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },

    handleReset(clearFilters) {
      clearFilters()
      this.searchText = ''
    },

    showModal() {
      this.modal1Visible = true
    },
    //跳进创建合同界面
    createContract(bol) {
      if(bol){
        this.$emit('changeCom', { type: this.value })
      }
      this.modal1Visible = false
    },
    goContractDetail(params){
      console.log(params)
      this.$emit('changeCom', { type:5,name:'测试项目啦' })
    }
  },
  watch: {
    // 'selectedRows': function (selectedRows) {
    //   this.needTotalList = this.needTotalList.map(item => {
    //     return {
    //       ...item,
    //       total: selectedRows.reduce( (sum, val) => {
    //         return sum + val[item.dataIndex]
    //       }, 0)
    //     }
    //   })
    // }
  }
}
</script>

<style>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
