<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '10px',minWidth:'1200px'}">
      <a-tabs
        default-active-key="1"
        size="large"
        :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
      >
        <a-tab-pane loading="true" :tab="title" key="1">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24" >
              <a-button class="ant-button" icon="check" @click="allReaded">标记全部已读</a-button>
              <!--<a-button class="ant-button" icon="delete" @click="showModal">清空已读消息</a-button>-->
              <a-button class="ant-button" type="primary" icon="setting" @click="showModal">设置</a-button>
            </a-col>

            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{float: 'right',width: '60%',maxWidth:'400px'}">
                <a-input-search
                  placeholder="消息内容"
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
              :rowKey="record => record.id"
              :pagination="pagination"
              :customRow="changeRow"
              @change="handleChange"
            >
              <!-- 合同名称slot -->
              <span slot="contractNo" slot-scope="text,record,index" style="position:relative">
                <span v-if="record.catalog === 1" class="kj-project">框</span>
                {{record.contractNo}}
              </span>

              <!-- 合同名称slot -->
              <div slot="name" slot-scope="text,record,index" style="position:relative">
                <a
                  href="javascript:;"
                  class="ellipsis"
                  :style="record.recipients[0].status === 0 ? {width:'850px', display:'block', color: '#5873c9'}: {width:'850px', display:'block', color: '#a2a2a2'}"
                  :title="record.name"
                  @click="notiReaded(record)"
                >{{ record.name }}</a>
              </div>

              <!-- 签约日期筛选 -->
              <div
                slot="signDateDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-filter-dropdown"
              >
                <a-modal
                  title="请选择时间段"
                  v-model="visibled"
                  :maskClosable="maskClosabled"
                  okText="确认"
                  cancelText="清空"
                  @ok="() => handleOk(setSelectedKeys, confirm)"
                  @cancel="() => handleCancel(clearFilters)"
                >
                  <a-row>
                    <a-col :span="12">开始日期：
                      <a-date-picker v-model="startDate" style="width:55%; margin-right:10px"/>至
                    </a-col>
                    <a-col :span="12">结束日期：
                      <a-date-picker v-model="endDate" style="width:55%"/>
                    </a-col>
                  </a-row>
                </a-modal>
              </div>
              <!-- 状态筛选 -->
              <div
                slot="typeDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
                class="custom-status-dropdown"
              >
                <a-checkbox
                  :indeterminate="indeterminate"
                  @change="onCheckAllChange(setSelectedKeys, confirm, $event)"
                  :checked="checkAll"
                >全选
                </a-checkbox>
                <br />
                <a-checkbox-group :options="options" v-model="filterStatus" v-if="statusVisibled" @change="() => handleStatus(setSelectedKeys, confirm)">
                  <!--<a-row style="width: 117px;background-color:#fff; border:solid 1px #e8e8e8;padding:5px">-->
                    <!--<a-col :span="24"><a-checkbox value="">全选</a-checkbox></a-col>-->
                    <!--<a-col :span="24"><a-checkbox value="0">进行中</a-checkbox></a-col>-->
                    <!--<a-col :span="24"><a-checkbox value="1">已完成</a-checkbox></a-col>-->
                    <!--<a-col :span="24"><a-checkbox value="2">暂停</a-checkbox></a-col>-->
                  <!--</a-row>-->
                </a-checkbox-group>
              </div>
              <a-icon slot="filterIcon" theme="filled" slot-scope="filtered" type="filter" :style="{ color: filtered ? '#5873c9' : undefined }" />
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
import gql from 'graphql-tag'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'
import { ArrayToString } from '@/utils/util.js'

export default {
  name: 'TableList',
  inject: ['reload'],
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
      filteredInfo: {},
      sortedInfo: {},
      sortedField: 'createdAt',
      sortedOrder: 'desc_nulls_last',
      startDate: null,
      endDate: null,
      filterWhere: '', //过滤条件
      searchWhere: '', //搜索条件
      where: '',       //最终查询条件
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
      statusVisibled: false,
      moveStar: '',
      selectedIndex: -1,
      modal1Visible: false,
      value: 2,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      options: [
        { label: '公司公告', value: '1' },
        { label: '任务通知', value: '2' },
        { label: '团队组建', value: '3' },
        { label: '资料更新', value: '4' },
        { label: '任务预警', value: '5' },
        { label: '消息通知', value: '6' }
      ],
      filterStatus: ['1', '2', '3', '4', '5', '6'],
      indeterminate: false,
      checkAll: true,
      columns: [
        {
          title: '',
          width: 60,
          dataIndex: 'recipients[0].status',
          key: 'recipients[0].status',
          customRender: (value) => {
            let desc = ''
            console.log(value)
            switch (value) {
              case 0:
                desc = '[未读]'
                break
              case 1:
                desc = '[已读]'
                break
            }
            return {
              children: desc,
              attrs: {},
            }
          }
        },
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '消息类型',
          width: 120,
          align: 'center',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: {
            filterDropdown: 'typeDropdown',
            filterIcon: 'filterIcon',
            // customRender: 'customRender'
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              this.statusVisibled = visible
            }
          },
          customRender: (value) => {
            let desc = ''
            console.log(value)
            switch (value) {
              case 1:
                desc = '公司公告'
                break
              case 2:
                desc = '任务通知'
                break
              case 3:
                desc = '团队组建'
                break
              case 4:
                desc = '资料更新'
                break
              case 5:
                desc = '任务预警'
                break
              case 6:
                desc = '消息通知'
                break
            }
            return {
              children: desc,
              attrs: {},
            }
          }
        },
        {
          title: '接收时间',
          width: 120,
          align: 'center',
          dataIndex: 'createdAt',
          key: 'createdAt',
          customRender: (value) => {
            var d = ''
            if (value) {
              d = moment(value).format('YYYY-MM-DD')
            }
            return {
              children: d,
              attrs: {}
            }
          }
        },
      ]
    }
  },
  created() {
    //数据请求参数配置
    console.log('createList')
    this.loading = true
    this.loadList()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  methods: {
    handleChange (pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.defaultCurrent = pagination.current
      this.currentPageSize = pagination.pageSize
      this.loading = true
      this.filteredInfo = pagination.current === pagination.defaultCurrent ? filters: this.filteredInfo
      this.sortedInfo = pagination.current === pagination.defaultCurrent ? sorter: this.sortedInfo
      if(this.sortedInfo.field){
        const p = sorter.field.indexOf('.')
        if(p > -1){
          this.sortedField = sorter.field.substr(0, p)
          this.sortedOrder = '{' + sorter.field.substr(p + 1, sorter.field.length - p - 1) + ':' + (sorter.order === 'descend' ?   'desc_nulls_last': 'asc_nulls_last') + '}'
        }else{
          this.sortedField = sorter.field || 'createdAt'
          this.sortedOrder = sorter.order === 'descend' ? 'desc_nulls_last': 'asc_nulls_last'
        }
      }
      let where = ''
      for(const key in this.filteredInfo){
        switch (key){
          case 'type':
            if(this.filteredInfo[key].length > 0){
              where += `${key}:{_in: [`
              for(let i = 0; i < this.filteredInfo[key].length; i++){
                where += `${this.filteredInfo[key][i]},`
              }
              where += `]},`
            }
            break
        }
      }
      this.filterWhere = where
      this.loadList()
    },
    handleOk(setSelectedKeys, confirm) {
      setSelectedKeys([this.startDate, this.endDate])
      confirm()
      this.visibled = false
    },
    handleCancel(clearFilters) {
      clearFilters()
    },
    handleStatus(setSelectedKeys, confirm) {
      this.indeterminate = !!this.filterStatus.length && (this.filterStatus.length < this.options.length)
      this.checkAll = this.filterStatus.length === this.options.length
      setSelectedKeys(this.filterStatus)
      confirm()
    },
    onCheckAllChange (setSelectedKeys, confirm, e) {
      Object.assign(this, {
        filterStatus: e.target.checked ? ['1', '2', '3', '4', '5', '6'] : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
      if(!e.target.checked){
        this.filterStatus.push(['0'])
      }
      setSelectedKeys(this.filterStatus)
      confirm()
    },
    //接口获取数据
    loadList() {
      this.where = this.filterWhere + this.searchWhere
      var _this = this
      var skip = (this.defaultCurrent - 1) * this.currentPageSize
      this.$apollo
        .query({
          query: gql`
            query notificationList($skip: Int!, $pageSize: Int!) {
              Notification_aggregate(where: {recipients: {recipient_id: {_eq: "${_this.userInfo.id}"}}, ${this.where}}) {
                aggregate {
                  count
                }
              }

              Notification(where: {recipients: {recipient_id: {_eq: "${_this.userInfo.id}"}}, ${this.where}}, offset: $skip, limit: $pageSize, order_by: [{${this.sortedField}: ${this.sortedOrder}}]) {
                id
                type
                name
                recipients(where: {recipient_id:{_eq: "${_this.userInfo.id}"}}) {
                  recipient_id
                  status
                }
                createdBy_id
                createdAt
              }
            }
          `,
          variables: {
            skip: parseInt(skip),
            pageSize: parseInt(this.currentPageSize),
          },
          fetchPolicy: 'no-cache'
        })
        .then(res => {
          console.log(res,'res')
          _this.total = res.data.Notification_aggregate.aggregate.count
          _this.current = res.data.Notification
          _this.manyNotiReaded(_this.current)
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
    notiReaded(record){
      const _gql = gql`
          mutation {
            update_NotificationRecipient(where: {recipient_id:{_eq: "${record.recipients[0].recipient_id}"}, notification_id:{_eq: "${record.id}"}}, _set: {
              status: 1
            }){
              affected_rows
              returning {
                id
              }
            }
          }
          `

      this.$apollo
        .mutate({
          mutation: _gql
        })
        .then(res => {
          console.log(res, 'update notification status to 1')
          record.recipients[0].status = 1
        })
        .catch(err => {
          console.log(err)
        })
    },
    manyNotiReaded(records){
      var ids = []
      records.forEach(record => {
        ids.push(record.id)
      })
      const _gql = gql`
          mutation {
            update_NotificationRecipient(where: {recipient_id:{_eq: "${this.userInfo.id}"}, notification_id:{_in: ${ArrayToString(ids)}}}, _set: {
              status: 1
            }){
              affected_rows
              returning {
                id
              }
            }
          }
          `

      this.$apollo
        .mutate({
          mutation: _gql
        })
        .then(res => {
          console.log(res, 'update this page of notification status to 1')
          records.forEach(record => {
            record.recipients[0].status = 1
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    allReaded(){
      const _this = this
      this.$confirm({
        title: '全部已读',
        content: `你确定要标记全部消息已读吗？`,
        onOk() {
          const _gql = gql`
          mutation {
            update_NotificationRecipient(where: {recipient_id:{_eq: "${_this.userInfo.id}"}}, _set: {
              status: 1
            }){
              affected_rows
              returning {
                id
              }
            }
          }
          `

          _this.$apollo
            .mutate({
              mutation: _gql
            })
            .then(res => {
              console.log(res, 'update all notification status to 1')
              _this.loadList()
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel() {
        }
      })
    },
    onPagerChange(page, pageSize) {
      this.defaultCurrent = page
      this.currentPageSize = pageSize || 10
      this.loading = true
      this.loadList()
    },
    onPagerSizeChange(current, size) {
      // console.log(current, size,'changeSize');
      // debugger
      this.defaultCurrent = current
      this.currentPageSize = size
      this.loading = true
      this.loadList()
    },

    pager() {
      return {
        total: this.total,
        showTotal: total => `共有 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: this.pageSizeOptions,
        pageSize: this.currentPageSize,
        defaultCurrent: this.defaultCurrent,
        // onChange: this.onPagerChange,
        onShowSizeChange: this.onPagerSizeChange
      }
    },
    onSearch(value) {
      // alert(value)
      if(value !== ''){
        this.searchWhere = `
          _or: [
            {name: {_like: "%${value}%"}}
           ]
          `
      }else{
        this.searchWhere = ``
      }
      this.defaultCurrent = 1
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
          id: record.id
        },
        ref: record.id,
        // refInFor: true,
        on: {
          // 事件
          click: () => {
            // 鼠标移入行,改变状态
            // var allChildren = document.getElementById(record.id).parentNode.children
            // for (var i = 0; i < allChildren.length; i++) {
            //   if (i == index) {
            //     // console.log(allChildren[i].className = allChildren[i].className + ' dd' )
            //     allChildren[i].style.backgroundColor = '#ffe48d'
            //   } else {
            //     allChildren[i].style.backgroundColor = 'white'
            //   }
            // }
          },
          mouseover: () => {
            // 鼠标移入行,改变状态
            // console.log(record,index,'index2')

            // this.moveStar = record.contractNo
            // console.log(this.dataset)
          },
          mouseout: () => {
            // 鼠标移入行,改变状态
            // console.log(record,index,'index3')
            // this.moveStar = false
          }
        }
      }
    },
    //置顶事件
    changeStar(type, record, index) {
      if (type === 2) {
        record.isFavorite = true
        this.current.splice(index, 1, record)
      } else {
        record.isFavorite = false
        this.current.splice(index, 1, record)
      }
      this.favoriteContract(record)
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

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-status-dropdown {
  margin-top: -4px;
  width: 117px;
  border: solid 1px #e8e8e8;
  padding: 5px;
  background-color: #fff;
  margin-left: 176px;
}
.kj-project {
  background-color: #34c2ac;
  color: #fff;
  width: 18px;
  height: 18px;
  display: inline-block;
  border-radius: 9px;
  text-align: center;
  margin-right: 3px;
  font-size: 12px;
}
.font-blue{
  color: #5873c9;
  font-size: 13px;
}
.icon-blue {
  color: #5873c9;
  font-size: 14px!important;
}
.ant-btn {
  margin-right: 8px;
}
</style>


