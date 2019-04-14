<template>
  <div>
    <!--<div>-->
      <!--<a-button type="primary" icon="plus">添加合同款</a-button>-->
    <!--</div>-->
    <div class="empty_all" v-if="data.length === 0">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-money"></use>
      </svg>
      <div>
        <span>目前合同总金额为0</span>
      </div>
    </div>
    <div class="contract-results_item" v-else>
      <div class="contract-results" v-for="(item, i) in data" :key="i">
        <div class="contract-results_title" :title="item.name">{{item.name}}</div>
        <div class="contract-results_box">
          <table class="table-layout" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
            <!--repeat034331770456-->
            <tr v-for="(feeItem, j) in item.moneys" :key="j">
              <th width="80">计取标准：</th>
              <td width="200" class="td-hidden" title="包干价">{{feeItem.feeStandard}}</td>
              <th width="60">计取项：</th>
              <td width="130" class="td-hidden">{{feeItem.feeName}}</td>
              <th width="60">咨询费：</th>
              <td width="140">
                <em>{{feeItem.total}}</em>
                元&nbsp;
                <!--<a class="iconfont font-blue" href="javascript:void(0)" title="编辑费用"></a>-->
              </td>
              <td width="" class="font-right">
                <!--<a class="iconfont icon-link" href="javascript:void(0)"></a>-->
              </td>
            </tr>
            <!--repeat034331770456--><!--repeat034331770456:end-->
            </tbody>
          </table>
          <div class="contract-results_price">
            <p>总价：<em>{{item.moneys_aggregate.aggregate.sum.total}}</em></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


export default {
  name: 'ContractFundAll',
  props: {
    data: {
      type: Array,
      default: function (value) {
        return { value }
      }
    },
    total: {
      type: Number,
      default: function (value) {
        return { value }
      }
    }
  },
  components: {
    // MyIcon
  },
  data() {
    return {}
  },
  created(){
    console.log(this.data)
  },
  methods: {}
}
</script>
<style>
.icon {
  width: 4em;
  height: 4em;
  fill:#cbcbcb
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
}
.contract-results_item .contract-results {
  *zoom: 1;
  border: 1px solid #bbcbdf;
  border-radius: 2px;
  padding: 0 10px;
  font-size: 14px;
  background-color: #f9fcfd;
  margin-bottom: 10px;
  overflow:hidden
}
.contract-results_item .contract-results:before, .contract-results_item .contract-results:after {
  content: "";
  display: table;
  height: 0;
}
.contract-results_item .contract-results_title {
  float: left;
  display: inline;
  width: 240px;
  padding: 10px 0;
  margin-right: 20px;
}
.contract-results_item .contract-results_box {
  float: left;
  display: inline;
  width: 860px;
  position: relative;
  padding-bottom: 10px;
}
.contract-results_item .contract-results_box table {
  width: 700px;
  float: left;
  display: inline;
  display: table;
}
.contract-results_item .contract-results_title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contract-results_item .contract-results_box .contract-results_price {
  float: right;
  display: inline;
  text-align: right;
}
.contract-results_item .contract-results_box .contract-results_price p {
  position: absolute;
  top: 50%;
  right: 5px;
  margin-top: -22px;
}
.contract-results_item .contract-results_box .contract-results_price em {
  display: block;
  font-size: 18px;
}
.contract-results_item .contract-results_box em {
  color: #fa8564;
}
.contract-results_item .contract-results_box table {
  width: 700px;
  float: left;
  display: inline;
  display: table;
}
.contract-results_item .contract-results_box td, .contract-results_item .contract-results_box th {
  font-weight: normal;
  padding: 10px 0 0;
}
.contract-results_item .contract-results_box td {
  padding-right: 10px;
}
.td-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

