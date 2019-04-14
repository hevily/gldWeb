<template>
  <a-modal

    :maskClosable="maskClosable"
    :title="title"
    
    :visible="rVisibled"
    @cancel="cancel"
    :footer="null"
    :width="800"
  >
    <template slot="footer" slot-scope="text">
        
    </template>
    <a-steps v-for="(col,index) in dataSource" :key="index">
      <a-step status="finish">
        <span slot="title" style="font-size:14px">发起审核</span>
        <a-icon type="eye" slot="icon"/>
        <template slot="description">
          <div style="margin-top: 10px;font-size:13px;color: #555;">
            <p>
              <span>发起人：</span>
              {{col[0].createdBy?col[0].createdBy.name:''}}
            </p>
            <p>
              <span>发起日期：</span>
              {{moment(col[0].createdAt).format('YYYY-MM-DD')}}
            </p>
             <p>
              <span>送审造价：</span>
              {{col[0].submitAmount}}
            </p>
            <p>
              <span>审定造价：</span>
              {{col[0].approvedAmount}}
            </p>
            <p>
              <span>附件：</span>
            </p>
            <p>
              <span>说明：</span>
            </p>
            <p>
              <a>
                <a-icon type="audit"/>审核纪要
              </a>
            </p>
          </div>
        </template>
      </a-step>
      <a-step
        v-for="num in 3"
        :key="num"
        :status="col[num-1] ?(col[num-1].reviewResult == 0?'error':(col[num-1].reviewResult == -1?'wait':'finish')):'wait'"
      >
        <span slot="title" style="font-size:14px" v-if="num == 1">一级审核</span>
        <span slot="title" style="font-size:14px" v-else-if="num == 2">二级审核</span>
        <span slot="title" style="font-size:14px" v-else-if="num == 3">三级审核</span>

        <template v-if="col[num-1]">
          <a-icon type="close-circle" slot="icon" v-if="col[num-1].reviewResult == 0"/>
          <a-icon type="check-circle" slot="icon" v-else/>
        </template>
        <a-icon type="check-circle" slot="icon" v-else/>

        <template slot="description" v-if="col[num-1]">
          <div style="margin-top: 10px;font-size:13px;color: #555;">
            <p>
              <span>审核人：</span>
              {{(col[num-1].handler||{}).name}}
            </p>
            <p>
              <span>审核日期：</span>
              {{col[num-1].reviewDate? moment(col[num-1].reviewDate).format('YYYY-MM-DD'):''}}
            </p>
            <p>
              <span>复核造价：</span>
              {{col[num-1].unitPrice}}
            </p>
            <p>
              <span>准确率：</span>
              {{((1-(Math.abs(col[num-1].unitPrice-col[num-1].approvedAmount) / (col[num-1].approvedAmount||1))) * 100 ).toFixed(2)}}%
            </p>
            <p>
              <span>附件：</span>
            </p>
            <p>
              <span>说明：</span>
              {{col[num-1].reviewComment}}
            </p>
          </div>
        </template>
      </a-step>
    </a-steps>
  </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ReviewDialog',
  props: {
    dataSource: {
      type: Array,
      default: function() {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    visibled: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rVisibled: this.visibled,
      rTitle: this.title
    }
  },
  methods: {
    moment,
    cancel() {
      this.$emit('cancel')
    }
  },
  watch: {
    visibled(newT) {
      this.rVisibled = newT

      console.log(this.title)
    }
  }
}
</script>

<style>
</style>
