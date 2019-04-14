<template>
  <div class="showProjectDetil">
    <div class="add-button">
      <a-button type="primary" icon="plus" @click="showCalculator">添加收费项</a-button>
    </div>
    <div v-if="moneys.length">
      <div class="project-results_item" v-for="(item,key) in moneys" :key="key">
        <div class="project-results_title">
          <span class="f-left" v-if="item.feeName">
            {{item.feeName}}
            <a
              href="javascript:void(0)"
              class="iconfont font-blue ui-ml20 calculate-show"
            >
              <a-icon type="form"/>
            </a>
          </span>
          <span class="f-right">
            计取标准：{{item.feeStandard}}
            <a
              href="javascript:void(0)"
              class="iconfont font-gray ui-ml20"
              @click="deleteMoney(item.id)"
            >
              <a-icon type="delete"/>
            </a>
          </span>
        </div>
        <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr v-for="(col,index) in item.feeItem" :key="index">
              <th>{{col.item}}：</th>
              <td width="220">
                <a-input type="text" maxlength="10" v-model="col.price" class="ui-input ui-w100"/>&nbsp;元&nbsp;
                <a href="javascript:void(0)" class="iconfont font-blue">
                  <a-icon type="form"/>
                </a>
              </td>
              <th width="80">{{col.otherName||'基本费'}}：</th>
              <td width="170">
                <a-input
                  type="text"
                  disabled="disabled"
                  class="ui-input ui-w100"
                  v-model="col.value"
                />&nbsp;元
              </td>
              <td width="10" class="font-center">×</td>
              <th width="70">折扣：</th>
              <td width="80">
                <a-input type="text" class="ui-input ui-w60" v-model="col.discount" maxlength="5"/>&nbsp;%
              </td>
              <td width="60" class="font-center">=</td>
              <td width="220">
                <a-input type="text" disabled="disabled" class="ui-input ui-w100"/>&nbsp;元
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7"></td>
              <td width="60" class="font-center">总价：</td>
              <td>
                <a-input
                  class="ui-input ui-w100"
                  v-model="item.total"
                  type="text"
                  maxlength="12"
                  title="null"
                  style="color: rgb(250, 133, 100);"
                />&nbsp;元
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="empty_all" v-else>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-money"></use>
      </svg>
      <div>
        <span>目前咨询费为0</span>
      </div>
    </div>
    <ProjectMoney
      :mVisibled="mVisibled"
      :mTitle="mTitle"
      :projectId="projectId"
      @moneySave="moneySave"
      @moneyCancel="moneyCancel"
    />
  </div>
</template>
<script>
import ProjectMoney from '@/components/dialog/project/ProjectMoney'
import { db } from '@/components/_util/db'
import { mapState } from 'vuex'

export default {
  name: 'ProjectFundMoneys',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  components: {
    // MyIcon
    ProjectMoney
  },
  data() {
    return {
      mVisibled: false,
      mTitle: '咨询费计算',
      dbConn: new db(this.$apollo), //数据库操作,
      moneys: []
    }
  },
  created() {
    console.log('created')
    this.loadData()
  },
  updated() {
    console.log('update')
  },
  methods: {
    loadData() {
      let _this = this
      var queryString = `
      query{
        Money(where:{project_id:{_eq:"${_this.projectId}"}}){
          id
          total
          feeItem
          feeName
          feeStandard
          createdBy_id
          project_id
        }
      }`
      // console.log(queryString)
      this.dbConn
        .query(`${queryString}`)
        .then(res => {
          console.log(res, 'get project Money')
          _this.moneys = res.data.Money
        })
        .catch(err => {
          console.log(err, 'get project Money error')
        })
    },
    showCalculator() {
      this.mVisibled = true
    },
    moneySave(obj) {
      this.mVisibled = false
      this.loadData()
      this.$emit('updateTotal')
    },
    moneyCancel(e) {
      this.mVisibled = false
    },
    deleteMoney(id) {
      console.log(id)
      let _this = this

      this.$confirm({
        title: '删除收费项',
        content: `你确定删除该收费项？`,
        onOk() {
          var mutationString = `mutation{
            delete_Money(where:{id:{_eq:"${id}"}}){
              returning{id}
            }
          } `
          console.log(mutationString)
          _this.dbConn
            .mutation(mutationString)
            .then(res => {
              console.log(res, 'delete project Money')
              _this.$message.success('删除成功')
              _this.loadData()
              _this.$emit('updateTotal')
            })
            .catch(err => {
              console.log(err, 'delete project Money error')
            })
        },
        cancel() {}
      })
    }
  }
}
</script>
<style>
/* .icon {
  width: 4em;
  height: 4em;
  fill:#cbcbcb
}
.empty_all {
  padding: 50px 0;
  color: #cbcbcb;
  font-size: 13px;
  text-align: center;
} */
.ui-w60 {
  width: 60px;
}
.ui-ml20 {
  margin-left: 20px !important;
}
.font-gray {
  color: #555 !important;
}
.showProjectDetil {
  padding: 10px;
}
.showProjectDetil .add-button {
  margin-bottom: 10px;
}
.showProjectDetil tfoot tr {
  background: #e7f1fc;
}
.showProjectDetil .project-results_item {
  background-color: #f9fcfd;
  border: 1px solid #bbcbdf;
  border-radius: 2px;
  padding: 10px;
  position: relative;
  margin-bottom: 10px;
}
.showProjectDetil .project-results_title {
  height: 31px;
  line-height: 20px;
  position: relative;
  font-size: 16px;
  border-bottom: 1px solid #bbcbdf;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.showProjectDetil .f-left {
  float: left;
  display: inline;
}
.showProjectDetil .f-right {
  float: right;
  display: inline;
}
</style>

