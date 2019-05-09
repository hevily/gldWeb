<template>
  <div>
    <a-card :bordered="false" :body-style="{padding: '10px',minWidth:'1200px'}">
      <a-tabs
        default-active-key="1"
        size="large"
        :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
      >
        <a-tab-pane loading="true" :tab="title" key="1">
          <!-- 操作栏 -->
          <a-row :style="{marginBottom: '12px'}">
            <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
              <a-button type="primary" icon="plus" @click="showModal" v-if="$auth('add-contract')">创建合同</a-button>
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
          <a-row class="contractList">
            <a-table
              :size="size"
              :bordered="bordered"
              :loading="loading"
              :columns="columns"
              :dataSource="current"
              :rowKey="record => record.id"
              :pagination="pagination"
              :scroll="{ x: 1500 }"
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
                  style="width:270px;display:block;"
                  :title="record.name"
                  @click="goContractDetail(record)"
                >{{ record.name }}</a>
                <span style="position:absolute;right:-5px;top:0px">
                  <a v-if="record.isFavorite">
                    <a-icon
                      type="star"
                      theme="filled"
                      style="color:#ffaf38;font-size:16px"
                      @click="changeStar(1,record,index)"
                    />
                  </a>
                  <a v-else-if="moveStar == record.contractNo">
                    <a-icon type="star" style="font-size:16px" @click="changeStar(2,record,index)"/>
                  </a>
                </span>
              </div>

              <div slot="scans" slot-scope="text,record,index" style="max-width: 120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                <a v-for="(col,i) in record.scans" :key="i" :title="col.name" @click="downloadFile(col)">{{col.name}}/</a>
              </div>

              <div slot="action" slot-scope="text,record,index">
                <a class="font-blue" style="margin-right:5px" @click="goContractFund(record)" v-if="$auth('contact-money')">款项</a>
                <a class="font-blue" style="margin-right:5px" @click="deleteContract(record)" v-if="$auth('delete-contract')">删除</a>
                <a-dropdown v-if="record.catalog===1 && $auth('add-contract')">
                  <a class="ant-dropdown-link" href="#">
                    <a-icon type="down-circle" class="icon-blue" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a class="font-blue" style="margin-right:5px" @click="addSubContract(record)"><a-icon type="cluster" />&nbsp;添加子合同</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>

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
                slot="statusDropdown"
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
              <a-icon slot="filterIcon" theme="filled" slot-scope="filtered" type="filter" :style="{ color: filtered ? '#78bb60' : undefined }" />
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
// import { mapState, mapMutations } from 'vuex'

export default {
  name: 'contract-list',
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
      filteredInfo: null,
      sortedInfo: null,
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
        { label: '进行中', value: '0' },
        { label: '已完成', value: '1' },
        { label: '暂停', value: '2' }
      ],
      filterStatus: ['0', '1', '2'],
      indeterminate: false,
      checkAll: true,
      columns: [
        {
          title: '合同编号',
          width: 150,
          dataIndex: 'contractNo',
          sorter: true,
          scopedSlots: { customRender: 'contractNo' }
        },
        {
          title: '合同名称',
          width: 300,
          dataIndex: 'name',
          sorter: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '委托人',
          dataIndex: 'client.name',
          sorter: true
        },
        {
          title: '负责人',
          width: 100,
          dataIndex: 'principal.name',
          sorter: true
        },
        {
          title: '签约日期',
          width: 120,
          align: 'center',
          dataIndex: 'signDate',
          key: 'signDate',
          scopedSlots: {
            filterDropdown: 'signDateDropdown',
            filterIcon: 'filterIcon',
            // customRender: 'customRender'
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              this.visibled = visible
            }
          },
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
        {
          title: '已回款/总金额(元)',
          width: 150,
          align: 'right',
          dataIndex: 'projects',
          customRender: (value) => {
            let s = ''
            let total = 0
            let totalReceipt = 0
            if (value) {
              value.forEach(ele => {
                total += ele.moneys_aggregate.aggregate.sum.total
                totalReceipt += ele.receipts_aggregate.aggregate.sum.amount
              })
              s = `${total.toFixed(2)}/${totalReceipt.toFixed(2)}`
            }
            return {
              children: s,
              attrs: {}
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {
            filterDropdown: 'statusDropdown',
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
              case 0:
                desc = '进行中'
                break
              case 1:
                desc = '已完成'
                break
              case 2:
                desc = '暂停'
                break
            }
            return {
              children: desc,
              attrs: {},
            }
          }
        },
        {
          title: '纸质合同',
          dataIndex: 'returnedDate',
          // scopedSlots: { customRender: 'scans' }
          customRender: (value,record) => {
            
            var date = ''
            if(record.returnedDate){
              date = moment(record.returnedDate).format('YYYY-MM-DD')
            }else if(record.sendedDate) {
              date = moment(record.sendedDate).format('YYYY-MM-DD')
            }

            return {
              children: date
            }
          }
        },
        {
          title: '附件',
          dataIndex: 'scans',
          scopedSlots: { customRender: 'scans' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    //数据请求参数配置
    console.log('createList')
    this.loading = true
    this.currentPageSize = this.$ls.get('contractPageSize') || 10
    this.loadList()
  },
  mounted(){
      // debugger
     
  },
  methods: {
    handleChange (pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      // debugger
      this.defaultCurrent = pagination.current
      this.currentPageSize = pagination.pageSize || 10

      this.$ls.set('contractPageSize',this.currentPageSize)

      this.filteredInfo = filters
      this.sortedInfo = sorter
      if(sorter.field){
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
      for(const key in filters){
        switch (key){
          case 'status':
            if(filters[key].length > 0){
              where += `${key}:{_in: [`
              for(let i = 0; i < filters[key].length; i++){
                where += `${filters[key][i]},`
              }
              where += `]},`
            }
            break
          case 'signDate':
            // debugger
            if(filters[key].length > 0){
              where += `signDate: {${filters[key][0] ? `_gte: "${filters[key][0]}",`:''} ${filters[key][1] ? `_lte: "${filters[key][1]}"`:''}},`
            }
            break
        }
      }
      this.filterWhere = where
      this.loadList()
    },
    handleOk(setSelectedKeys, confirm) {
      let startTime = ''
      let endTime = ''
      if(this.startDate){
        startTime = this.startDate.format('YYYY-MM-DD')
      }
      if(this.endDate){
        endTime = this.endDate.format('YYYY-MM-DD')
      }

      setSelectedKeys([startTime, endTime]) //只能是字符
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
        filterStatus: e.target.checked ? ['0','1','2'] : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
      if(!e.target.checked){
        this.filterStatus.push(['-1'])
      }
      debugger
      setSelectedKeys(this.filterStatus)
      confirm()
    },
    //接口获取数据
    loadList() {
      this.where = this.filterWhere + this.searchWhere
      var _this = this
      var skip = (this.defaultCurrent -1) * this.currentPageSize
      this.$apollo
        .query({
          query: gql`
            query contrackList($skip: Int!, $pageSize: Int!) {
              Contract_aggregate(where: {catalog: {_in: [0,1]}, ${this.where}}) {
                aggregate {
                  count
                }
              }

              Contract(where: {catalog: {_in: [0,1]}, ${this.where}}, offset: $skip, limit: $pageSize, order_by: [{isFavorite: desc_nulls_last}, {${this.sortedField}: ${this.sortedOrder}}]) {
                id
                isFavorite
                contractNo
                businessType
                catalog
                name
                returnedDate
                sendedDate
                client {
                  id
                  name
                  address {
                    id
                    province
                    city
                    district
                    address
                  }
                }
                principal {
                  name
                }
                status
                signDate
                projects {
                  id
                  name
                  moneys {
                    id
                    feeStandard
                    feeName
                    feeItem
                    total
                  }
                  invoices {
                    id
                    client {
                      name
                      account
                    }
                    invoiceNo
                    issueOffice
                    amount
                    fileUrl
                    invoicePerson {
                      name
                    }
                    createdBy {
                      name
                    }
                    createdAt
                  }
                  receipts {
                    id
                    no
                    amount
                    receiptPerson {
                      name
                    }
                    createdAt
                    remark
                  }
                  moneys_aggregate {
                    aggregate {
                      sum {
                        total
                      }
                    }
                  }
                  invoices_aggregate {
                    aggregate {
                      sum {
                        amount
                      }
                    }
                  }
                  receipts_aggregate {
                    aggregate {
                      sum {
                        amount
                      }
                    }
                  }
                }
                scans {
                  id
                  name
                  url
                }
                contracts {
                  id
                  isFavorite
                  contractNo
                  businessType
                  catalog
                  name
                  client {
                    id
                    name
                    address {
                      id
                      province
                      city
                      district
                      address
                    }
                  }
                  principal {
                    name
                  }
                  status
                  signDate
                  projects {
                    id
                    name
                    moneys {
                      id
                      feeStandard
                      feeName
                      feeItem
                      total
                    }
                    invoices {
                      id
                      client {
                        name
                        account
                      }
                      invoiceNo
                      issueOffice
                      amount
                      fileUrl
                      invoicePerson {
                        name
                      }
                      createdBy {
                        name
                      }
                      createdAt
                    }
                    receipts {
                      id
                      no
                      amount
                      receiptPerson {
                        name
                      }
                      createdAt
                      remark
                    }
                    moneys_aggregate {
                      aggregate {
                        sum {
                          total
                        }
                      }
                    }
                    invoices_aggregate {
                      aggregate {
                        sum {
                          amount
                        }
                      }
                    }
                    receipts_aggregate {
                      aggregate {
                        sum {
                          amount
                        }
                      }
                    }
                  }
                  scans {
                    id
                    name
                    url
                  }
                }
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
          _this.total = res.data.Contract_aggregate.aggregate.count
          _this.current = res.data.Contract
          _this.current.forEach(ele => {
            ele.children = ele.contracts.length > 0 ? ele.contracts: null
          })
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
            {contractNo: {_like: "%${value}%"}},
            {name: {_like: "%${value}%"}},
            {principal: {name: {_like: "%${value}%"}}},
            {client: {name: {_like: "%${value}%"}}}
           ]
          `
      }else{
        this.searchWhere = ``
      }
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
          id: record.contractNo
        },
        ref: record.contractNo,
        // refInFor: true,
        on: {
          // 事件
          click: () => {
            // 鼠标移入行,改变状态
            var allChildren = document.getElementById(record.contractNo).parentNode.children
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

            this.moveStar = record.contractNo
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
    },
    //跳进创建合同界面
    createContract(bol) {
      if(bol){
        this.$emit('changeCom', { type: this.value, activeKey: '1', data: {} })
      }
      this.modal1Visible = false
    },
    //合同详细界面
    goContractDetail(record){
      console.log(record)
      this.$emit('changeCom', { type:5, id: record.id, name: record.name, catalog: record.catalog, data: record })
    },
    //合同款项界面
    goContractFund(record){
      console.log(record)
      this.$emit('changeCom', { type:5, id: record.id, name: record.name, catalog: record.catalog, activeKey: '3' })
    },
    //添加子合同
    addSubContract(record){
      console.log(record)
      this.$emit('changeCom', { type:4, id: record.id, name: record.name, client: record.client, businessType: record.businessType, activeKey: '1' })
    },
    //删除合同界面
    deleteContract(record){
      const _this = this
      this.$confirm({
        title: '删除合同',
        content: `你确定删除合同【${record.name}】吗？`,
        onOk() {
          console.log('删除合同', record)
          const _gql = gql`
              mutation {
                delete_Contract(where: {id: {_eq: "${record.id}"}}){
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
              console.log(res, 'res')
              _this.reload()
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel() {
        }
      })
    },
    //收藏合同
    favoriteContract(record) {
      const _this = this
      const _gql = gql`
        mutation {
          update_Contract (where: {id: {_eq: "${record.id}"}},
            _set: {
              isFavorite: ${record.isFavorite}
            }){
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
          console.log(res, 'res')
          _this.reload()
        })
        .catch(err => {
          console.log(err)
        })
    },
     //下载文件
    downloadFile(record){
      if(this.$auth('download-project-document')){ //拥有下载权限
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = `http://${location.hostname}:15050/upload/` + record.url  + record.name
        link.setAttribute('download', record.name)

        document.body.appendChild(link)
        link.click()
      }
    },
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
  color: #78bb60;
  font-size: 13px;
}
.icon-blue {
  color: #78bb60;
  font-size: 14px!important;
}
.contractList .ant-table-bordered .ant-table-thead > tr > th,
.contractList .ant-table-bordered .ant-table-tbody > tr > td {
  font-size: 13px;
}
</style>
