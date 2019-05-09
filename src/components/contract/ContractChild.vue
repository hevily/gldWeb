<template>
  <div class="contractChild">
    <a-row :style="{marginBottom: '12px'}">
        <a-button type="primary" icon="plus" @click="addSubContract">创建子合同</a-button>
    </a-row>

    <a-row v-for="(item,i) in data.contracts" :key="i" :style="{marginBottom: '12px'}">
      <div class="sub-contract">
        <table width="100%" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="70">合同编号：</th>
            <td width="200">{{item.contractNo}}</td>
            <th width="70">合同名称：</th>
            <td width="550">{{item.name}}</td>
            <th width="50">状态：</th>
            <td><a-icon :type="statusArr[item.status.toString()].icon"/>&nbsp;{{statusArr[item.status.toString()].name}}</td>
            <td class="font-right"><a-icon type="delete" style="cursor:pointer" @click="deleteSubContract(item, i)"></a-icon></td>
          </tr>
          </thead>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
          <tr>
            <th width="90px">合同负责人：</th>
            <td width="90px">{{item.principal ? item.principal.name: ''}}</td>
            <th width="70px">业务类型：</th>
            <td width="409px">{{item.businessType}}</td>
            <th width="70">签约时间：</th>
            <td width="182">{{formatDate(item.signDate)}}</td>
            <th width="70">合同原件：</th>
            <td><!--ms-if--></td>
          </tr>
          <tr>
            <th class="th-top">关联项目：</th>
            <td colspan="7">
              <ul class="child-project">
                <!--repeat514967941437-->
                <!--repeat514967941437:end-->
                <li v-for="(project,j) in item.projects" :key="j">
                  {{project.name}}
                </li>
              </ul>
            </td>
          </tr>
          </tbody>
        </table>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tfoot>
          <tr><th width="70">合同金额：</th>
            <td><em class="font-red">{{item.totalMoney}}</em>元</td>
            <th width="70">开票金额：</th>
            <td><em class="font-red">{{item.totalInvoice}}</em>元</td>
            <th width="70">收款金额：</th>
            <td><em class="font-red">{{item.totalReceipt}}</em>元</td>
          </tr></tfoot>
        </table>
      </div>
    </a-row>
  </div>
</template>
<script>

import gql from 'graphql-tag'
import moment from 'moment'

export default {
  name: 'ContractChild',
  inject: ['reload'],
  props: {
    data: {
      type: Object,
      default: function (value) {
        return { value }
      }
    }
  },
  components: {
  },
  
  data() {
    return {
      statusArr: {
        '0': {
          name: '进行中',
          value: 0,
          background: '#78bb61',
          border: '#78bb60',
          icon: 'clock-circle'
        },
        '1': {
          name: '已完成',
          value: 1,
          background: '#5d9cec',
          border: '#8bb8f1',
          icon: 'check-circle'
        },
        '2': {
          name: '暂停',
          value: 2,
          background: '#f19149',
          border: '#f09a5d',
          icon: 'pause-circle'
        }
      }
    }
  },
  created(){
    // debugger
    console.log(this.data,'childdata')

    if((this.data.children||[]).length){
      this.data.children.forEach(ele => {
        ele.totalMoney = 0
        ele.totalInvoice = 0
        ele.totalReceipt = 0
        if((ele.projects||[]).length){
          ele.projects.forEach(project => {
              ele.totalMoney += project.moneys_aggregate.aggregate.sum.total || 0
              ele.totalInvoice += project.invoices_aggregate.aggregate.sum.amount || 0
              ele.totalReceipt += project.receipts_aggregate.aggregate.sum.amount || 0
          })
        }
      })
    }

  },
  updated(){
    // debugger
    console.log(this.data,'childdata')
  },
  methods: {
    //添加子合同
    addSubContract(){
      this.$emit('changeCom', { type:4, id: this.data.id, name: this.data.name, client: this.data.client, businessType: this.data.businessType })
    },
    //删除合同界面
    deleteSubContract(record, i){
      const _this = this
      this.$confirm({
        title: '删除子合同',
        content: `你确定删除子合同【${record.name}】吗？`,
        onOk() {
          console.log('删除子合同', record)
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
              _this.data.contracts.splice(i, 1)
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel() {
        }
      })
    },
    formatDate(date){
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style>
  .sub-contract {
    border: 1px solid #bbcbdf;
    border-radius: 2px;
    padding: 0 10px;
    font-size: 14px;
    background-color: #f9fcfd;
    margin-bottom: 10px;
  }

  .sub-contract table thead th, .sub-contract table thead td {
    padding: 10px 0;
    border-bottom: 1px solid #bbcbdf;
  }

  .sub-contract th, .sub-contract td {
    font-weight: normal;
    padding: 5px 0;
    text-align: left;
  }

  .th-top {
    padding-top: 9px!important;
  }

  .child-project {
    list-style: none;
    padding-inline-start: 0px;
  }
</style>

