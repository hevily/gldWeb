<template>
  <div>
    <a-row>
      <!-- <a-col :span="24">
        <a-button type="primary" icon="file-done" style="margin-right:15px" @click="showReview" v-if="$auth('commit-multi-review')">提交审核</a-button>
        <a-button type="default" icon="file-done">整理成果文件</a-button>
      </a-col> -->
    </a-row>
    <a-row class="ProjectReview">
      <!-- 任务审核任务 -->
      <a-col :span="24" v-for="(value,key,i) in data" :key="key" style="margin-top:10px">
        <a-card
          :title="((value[value.length-1]||[])[0]||[]).name"
          :headStyle="{height:'48px',lineHeight:'48px',background:'#eee',padding:'0 10px'}"
        >
          <a-row>
            <a-col :span="18">
              <a-steps>
                <a-step status="finish">
                  <span slot="title" style="font-size:14px">发起审核</span>
                  <a-icon type="eye" slot="icon"/>
                  <template slot="description">
                    <div v-for="num in value[0].length" :key="num"  :class="['firstDescription',num-1 > 0 ? 'nextDescription':'']">
                      <p>
                        <span>发起人：</span>
                        {{value[0][num-1].createdBy?value[0][num-1].createdBy.name:''}}
                      </p>
                      <p>
                        <span>发起日期：</span>{{moment(value[0][num-1].createdAt).format('YYYY-MM-DD')}}
                      </p>
                      <p>
                        <span>送审造价：</span>
                        {{value[0][num-1].submitAmount}}
                      </p>
                      <p>
                        <span>审定造价：</span>
                        {{value[0][num-1].approvedAmount}}
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
                  :status="setStepStatus(value,num)"
                >
                  <span slot="title" style="font-size:14px" v-if="num == 1">一级审核</span>
                  <span slot="title" style="font-size:14px" v-else-if="num == 2">二级审核</span>
                  <span slot="title" style="font-size:14px" v-else-if="num == 3">三级审核</span>

                  <template>
                    <a-icon type="close-circle" slot="icon" v-if="setStepStatus(value,num) == 0"/>
                    <a-icon type="check-circle" slot="icon" v-else/>
                  </template>
                  <!-- <a-icon type="check-circle" slot="icon" v-else/> -->

                  <template slot="description" >
                    <div v-for="(col,index) in value[num-1]" :key="index"  :class="['firstDescription',index > 0 ? 'nextDescription':'']">
                      <p>
                        <span>审核人：</span>
                        {{(col.handler||{}).name}}
                        <span  :style="{border: '1px solid #eee',padding: '2px 4px',borderRadius: '5px',color:setStepAuditColor(col),borderColor:setStepAuditColor(col)}">第{{value[num-1].length - index}}次</span>
                      </p>
                      <p>
                        <span>审核日期：</span>
                        {{col.reviewDate? moment(col.reviewDate).format('YYYY-MM-DD'):''}}
                      </p>
                      
                      <p>
                        <span>复核造价：</span>
                        {{col.unitPrice}}
                      </p>
                      <p v-if="num == 1">
                        <span>准确率：</span>
                        {{((1-(Math.abs(col.unitPrice-col.approvedAmount) / (col.approvedAmount||1))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-else>
                        <span>准确率：</span>
                        {{((1-(Math.abs(col.unitPrice-col.preUnitPrice) / (col.preUnitPrice||1))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-if="num == 1">
                        <span>差错率：</span>
                        {{((1-(1-(Math.abs(col.unitPrice-col.approvedAmount) / (col.approvedAmount||1)))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-else>
                        <span>差错率：</span>
                        {{((1-(1-(Math.abs(col.unitPrice-col.preUnitPrice) / (col.preUnitPrice||1)))) * 100 ).toFixed(2)}}%
                      </p>
                      <p>
                        <span>附件：</span>
                      </p>
                      <p>
                        <span>说明：</span>
                        {{col.reviewComment}}
                      </p>
                    </div>
                  </template>
                </a-step>
              </a-steps>
            </a-col>
            <a-col :span="6" style="height: 248px;line-height: 248px;position:relative">
              <div
                style="display:flex;align-items:center;justify-content: center;width:100%;height:100%;"
              >
                <MyIcon
                  type="icon-shenpitongyi"
                  style="font-size:100px"
                  v-if="setStepsStatus(value) == 1"
                />
                <MyIcon
                  type="icon-shenpibutongyi"
                  style="font-size:100px"
                  v-if="setStepsStatus(value) == 0"
                />
                <MyIcon
                  type="icon-shenhezhong"
                  style="font-size:100px"
                  v-if="setStepsStatus(value) == -1"
                />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <!-- 多级复核任务 -->
      <!-- <a-col :span="24" v-for="(value, key, i) in reviewData" :key="key" style="margin-top:10px">
        <a-card
          :title="key"
          v-if="value.length"
          :headStyle="{height:'48px',lineHeight:'48px',background:'#eee',padding:'0 10px'}"
        >
          <a slot="extra" @click="deleteReview(value)"><a-icon type="delete"></a-icon></a>
          <a-row>
            <a-col :span="18">
              <a-steps v-for="(col,index) in value" :key="index">
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
                        {{col[num-1].handler?col[num-1].handler.name:''}}
                      </p>
                      <p>
                        <span>审核日期：</span>
                        {{col[num-1].reviewDate? moment(col[num-1].reviewDate).format('YYYY-MM-DD'):''}}
                      </p>
                      <p>
                        <span>复核造价：</span>
                        {{col[num-1].unitPrice}}
                      </p>
                      <p v-if="num == 1">
                        <span>准确率：</span>
                        {{((1-(Math.abs(col[num-1].unitPrice-col[num-1].approvedAmount) / (col[num-1].approvedAmount||1))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-else>
                        <span>准确率：</span>
                        {{((1-(Math.abs(col[num-1].unitPrice-col[num-2].unitPrice) / (col[num-2].unitPrice||1))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-if="num == 1">
                        <span>差错率：</span>
                        {{((1-(1-(Math.abs(col[num-1].unitPrice-col[num-1].approvedAmount) / (col[num-1].approvedAmount||1)))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-else>
                        <span>差错率：</span>
                        {{((1-(1-(Math.abs(col[num-1].unitPrice-col[num-2].unitPrice) / (col[num-2].unitPrice||1)))) * 100 ).toFixed(2)}}%
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
            </a-col>
            <a-col :span="6" style="height: 248px;line-height: 248px;position:relative" v-if="value.length">
              <div
                style="display:flex;align-items:center;justify-content: center;width:100%;height:100%;"
              >
                <MyIcon
                  type="icon-shenpitongyi"
                  style="font-size:100px"
                  v-if="value[value.length-1][value[value.length-1].length-1].reviewResult == 1"
                />
                <MyIcon
                  type="icon-shenpibutongyi"
                  style="font-size:100px"
                  v-if="value[value.length-1][value[value.length-1].length-1].reviewResult == 0"
                />
                <MyIcon
                  type="icon-shenhezhong"
                  style="font-size:100px"
                  v-if="value[value.length-1][value[value.length-1].length-1].reviewResult == -1"
                />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col> -->
       <a-col :span="24" v-for="(value,key,i) in reviewData" :key="key" style="margin-top:10px">
        <a-card
          :title="key"
          :headStyle="{height:'48px',lineHeight:'48px',background:'#eee',padding:'0 10px'}"
        >
          <a slot="extra" @click="deleteReview(value)"><a-icon type="delete"></a-icon></a>
          <a-row>
            <a-col :span="18">
              <a-steps>
                <a-step status="finish">
                  <span slot="title" style="font-size:14px">发起审核</span>
                  <a-icon type="eye" slot="icon"/>
                  <template slot="description">
                    <div v-for="num in value[0].length" :key="num"  :class="['firstDescription',num-1 > 0 ? 'nextDescription':'']">
                      <p>
                        <span>发起人：</span>
                        {{value[0][num-1].createdBy?value[0][num-1].createdBy.name:''}}
                      </p>
                      <p>
                        <span>发起日期：</span>{{moment(value[0][num-1].createdAt).format('YYYY-MM-DD')}}
                      </p>
                      <p>
                        <span>送审造价：</span>
                        {{value[0][num-1].submitAmount}}
                      </p>
                      <p>
                        <span>审定造价：</span>
                        {{value[0][num-1].approvedAmount}}
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
                  :status="setStepStatus(value,num)"
                >
                  <span slot="title" style="font-size:14px" v-if="num == 1">一级审核</span>
                  <span slot="title" style="font-size:14px" v-else-if="num == 2">二级审核</span>
                  <span slot="title" style="font-size:14px" v-else-if="num == 3">三级审核</span>

                  <template>
                    <a-icon type="close-circle" slot="icon" v-if="setStepStatus(value,num) == 0"/>
                    <a-icon type="check-circle" slot="icon" v-else/>
                  </template>
                  <!-- <a-icon type="check-circle" slot="icon" v-else/> -->

                  <template slot="description" >
                    <div v-for="(col,index) in value[num-1]" :key="index"  :class="['firstDescription',index > 0 ? 'nextDescription':'']">
                      <p>
                        <span>审核人：</span>
                        {{(col.handler||{}).name}}
                        <span  :style="{border: '1px solid #eee',padding: '2px 4px',borderRadius: '5px',color:setStepAuditColor(col),borderColor:setStepAuditColor(col)}">第{{value[num-1].length - index}}次</span>
                      </p>
                      <p>
                        <span>审核日期：</span>
                        {{col.reviewDate? moment(col.reviewDate).format('YYYY-MM-DD'):''}}
                      </p>
                      
                      <p>
                        <span>复核造价：</span>
                        {{col.unitPrice}}
                      </p>
                      <p v-if="num == 1">
                        <span>准确率：</span>
                        {{((1-(Math.abs(col.unitPrice-col.approvedAmount) / (col.approvedAmount||1))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-else>
                        <span>准确率：</span>
                        {{((1-(Math.abs(col.unitPrice-col.preUnitPrice) / (col.preUnitPrice||1))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-if="num == 1">
                        <span>差错率：</span>
                        {{((1-(1-(Math.abs(col.unitPrice-col.approvedAmount) / (col.approvedAmount||1)))) * 100 ).toFixed(2)}}%
                      </p>
                      <p v-else>
                        <span>差错率：</span>
                        {{((1-(1-(Math.abs(col.unitPrice-col.preUnitPrice) / (col.preUnitPrice||1)))) * 100 ).toFixed(2)}}%
                      </p>
                      <p>
                        <span>附件：</span>
                      </p>
                      <p>
                        <span>说明：</span>
                        {{col.reviewComment}}
                      </p>
                    </div>
                  </template>
                </a-step>
              </a-steps>
            </a-col>
            <a-col :span="6" style="height: 248px;line-height: 248px;position:relative">
              <div
                style="display:flex;align-items:center;justify-content: center;width:100%;height:100%;"
              >
                <MyIcon
                  type="icon-shenpitongyi"
                  style="font-size:100px"
                  v-if="setStepsStatus(value) == 1"
                />
                <MyIcon
                  type="icon-shenpibutongyi"
                  style="font-size:100px"
                  v-if="setStepsStatus(value) == 0"
                />
                <MyIcon
                  type="icon-shenhezhong"
                  style="font-size:100px"
                  v-if="setStepsStatus(value) == -1"
                />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col>
        <div class="example" v-if="loading">
          <a-spin />
        </div>
        <div class="empty-tip" v-else-if="!Object.keys(data).length && !Object.keys(reviewData).length">
          <a-icon type="audit" class="iconfont"/>目前没有审核记录
          <br>点击左上角“提交审核”按钮提交审核记录
        </div>
        <!-- </a-card> -->
        <!-- <div class="empty-tip">
          <a-icon type="audit" class="iconfont"/>目前没有审核记录
          <br>点击左上角“提交审核”按钮提交审核记录
        </div> -->
      </a-col>
    </a-row>

    <!-- <ProjectReviewDialog 
    
    />-->
    <ProjectReviewDialog
      inititle="提交审核"
      :initvisibled="openReview"
      :projectId="projectId"
      @reviewSave="reviewSave"
      @reviewCancel="reviewCancel"
    />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1018467_iiigzla0x.js' // 在 iconfont.cn 上生成
})
//at.alicdn.com/t/font_1018467_zbasjalz32.js

import ProjectReviewDialog from '@/components/dialog/project/ProjectReviewDialog'
import gql from 'graphql-tag'
import moment from 'moment'

import { mapState, mapMutations } from 'vuex'
import { ArrayToString } from '@/components/_util/StringUtil'
import { db } from '@/utils/db' 

export default {
  name: 'ProjectReview',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openReview: false,
      dbConn:new db(this.$apollo),
      data: {},
      reviewData: {},
      reviewDataArray: [],
      stepArr: ['一级审核', '二级审核', '三级审核'],
      project: {},
      loading:true
    }
  },
  components: {
    MyIcon,
    ProjectReviewDialog
  },
  created() {
    this.loadData(this.projectId)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  methods: {
    moment,
    loadData() {
      var _this = this
      _this.$apollo
        .query({
          query: gql`
            query {
              Project(where:{id:{_eq:"${_this.projectId}"}}){
                name
              }
              Task(where: {project_id:{_eq:"${_this.projectId}"}},order_by:[{createdAt:asc}]) {
                id
                name
                type
                step
                reviewComment
                createdAt
                reviewResult
                approvedAmount
                submitAmount
                unitPrice
                reviewDate
                createdBy {
                  id
                  name
                }
                handler{
                  id
                  name
                }
                project{
                  id
                  name
                }
                parent {
                  id
                  name
                  status
                  createdBy {
                    id
                    name
                  }
                  childTasks(order_by:[{createdAt:asc}]) {
                    id
                    name
                    type
                    step
                    reviewComment
                    createdAt
                    unitPrice
                    reviewResult
                    approvedAmount
                    submitAmount
                    reviewDate
                    handler{
                      id
                      name
                    }
                    createdBy {
                      id
                      name
                    }
                    updatedAt
                  }
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res.data.Task, 'get project review task')
          _this.project = res.data.Project[0]
          //任务审核任务
          _this.data = res.data.Task.filter(ele => ele.type == 2 && ele.step == 0)

          var dataObj = {}
          _this.data.forEach(ele => {
            if(ele.parent){
               dataObj[ele.parent.id + '_' + ele.parent.name] = ele.parent.childTasks
            }
           
          })
          console.log(dataObj, 'dataObj')

          for(var col in dataObj){

            dataObj[col].forEach((e,index) => {
              if(e.step > 0){
                e.preUnitPrice = dataObj[col][index - 1].unitPrice
              }
            })

            let step0 = dataObj[col].filter(ele => ele.type == 2 && ele.step == 0).reverse() //一级审核
            let step1 = dataObj[col].filter(ele => ele.type == 2 && ele.step == 1).reverse() //二级审核
            let step2 = dataObj[col].filter(ele => ele.type == 2 && ele.step == 2).reverse() //三级审核
            var dataArray = []
            if(step0.length) {
              dataArray.push(step0)
            }
            if(step1.length) {
              dataArray.push(step1)
            }
            if(step2.length) {
              dataArray.push(step2)
            }
            dataObj[col] = dataArray
          }
          _this.data = dataObj
          console.log(_this.data,dataObj, 'dataObj')
          // debugger
          // for (var col in dataObj) {
          //   var step0Array = dataObj[col].filter(ele => ele.type == 2 && ele.step == 0)
          //   var stopOtherArray = dataObj[col].filter(ele => ele.type == 2 && ele.step != 0)

          //   var dataArray = []
          //   for (var i = 0; i < step0Array.length; i++) {
          //     var thisCreatedAt = step0Array[i].createdAt //当前一级审核时间
          //     var nextCreatedAt = (step0Array[i + 1] || {}).createdAt //下一次一级审核时间
          //     dataArray[i] = [step0Array[i]]
          //     for (var j = 0; j < stopOtherArray.length; j++) {
          //       var _thisCreatedAt = stopOtherArray[j].createdAt
          //       if (nextCreatedAt) {
          //         if (thisCreatedAt < _thisCreatedAt && _thisCreatedAt < nextCreatedAt) {
          //           //大于当前一级审核时间小于下一次一级审核时间归属到当前审核
          //           dataArray[i].push(stopOtherArray[j])
          //         }
          //       } else {
          //         if (_thisCreatedAt > thisCreatedAt) {
          //           //最后一个
          //           dataArray[i].push(stopOtherArray[j])
          //         }
          //       }
          //     }
          //   }

          //   dataObj[col] = dataArray
          // }
          // _this.data = dataObj
          // console.log(dataObj, 'dataObj')

          //多级复核任务
          // debugger
          var reviewData = res.data.Task.filter(ele => ele.type == 3)

          reviewData.forEach((e,index) => {
            if(e.step > 0){
              e.preUnitPrice = reviewData[index - 1].unitPrice
            }
          })


          let step0 = reviewData.filter(ele => ele.type == 3 && ele.step == 0).reverse() //一级审核
          let step1 = reviewData.filter(ele => ele.type == 3 && ele.step == 1).reverse() //二级审核
          let step2 = reviewData.filter(ele => ele.type == 3 && ele.step == 2).reverse() //三级审核

          // var reViewDataStep0 = res.data.Task.filter(ele => ele.type == 3 && ele.step == 0) //获取一级审核

          // var reViewDataStepOther = res.data.Task.filter(ele => ele.type == 3 && ele.step != 0) //获取非一级审核

          var reviewDataArray = []
          //  var dataArray = []
          if(step0.length) {
            reviewDataArray.push(step0)
          }
          if(step1.length) {
            reviewDataArray.push(step1)
          }
          if(step2.length) {
            reviewDataArray.push(step2)
          }

          // for (var i = 0; i < reViewDataStep0.length; i++) {
          //   var thisCreatedAt = reViewDataStep0[i].createdAt //当前一级审核时间
          //   var nextCreatedAt = (reViewDataStep0[i + 1] || {}).createdAt //下一次一级审核时间
          //   reviewDataArray[i] = [reViewDataStep0[i]]
          //   for (var j = 0; j < reViewDataStepOther.length; j++) {
          //     var _thisCreatedAt = reViewDataStepOther[j].createdAt
          //     if (nextCreatedAt) {
          //       if (thisCreatedAt < _thisCreatedAt && _thisCreatedAt < nextCreatedAt) {
          //         //大于当前一级审核时间小于下一次一级审核时间归属到当前审核
          //         reviewDataArray[i].push(reViewDataStepOther[j])
          //       }
          //     } else {
          //       if (_thisCreatedAt > thisCreatedAt) {
          //         //最后一个
          //         reviewDataArray[i].push(reViewDataStepOther[j])
          //       }
          //     }
          //   }
          // }
          if(reviewDataArray.length){
            // _this.reviewData['成果审核'] = reviewDataArray
          }else {
            _this.reviewData={}
          }
          
          console.log(_this.data, _this.reviewData, reviewDataArray, 'show allData and reviewData')
          _this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    showReview() {
      //
      // console.log(this.reviewData['成果审核'])
      let reviewArray = this.reviewData['成果审核'] || []
      // console.log(this.setStepsStatus(reviewArray))
      // return
      // debugger
      if(reviewArray.length){
        if (this.setStepsStatus(reviewArray) == -1) {
          this.$message.warning('该任务还在审核中')
          return
        }
      }
      
      this.openReview = true
    },
    //提交成果审核
    reviewSave(data) {
      console.log(data, 'create project review data')
      var _this = this
      console.log(data.sendTo)
      if(!data.NextHandler.id){
        _this.$message.warning('请选择审核人')
        return
      }
      if (!data.sendTo.length) {
        _this.$message.warning('请选择通知接收人')
        return
      }
     
      if((data.submitAmount||0) <=0 ){
        _this.$message.warning('请输入送审金额')
        return
      }
      if((data.approvedAmount||0) <=0 ){
        _this.$message.warning('请输入审定金额')
        return
      }
      console.log('return')
      // return
      var notificationString = `insert_Notification(objects:[`
      data.sendTo.forEach((ele, index) => {
        notificationString += `{
            recipients:{
              data:{
                recipient_id:"${ele.key}"
              }
            },
            createdBy_id:"${_this.userInfo.id}",
            type:2,
            status:0,
            name:"【${_this.userInfo.name}】提交了【${_this.project.name}】项目中的【[多]${data.name}】任务给【${
          data.NextHandler.name
        }】审核，需您知晓"
          },`
      })
      notificationString += `{
          recipients:{
            data:{
              recipient_id:"${data.NextHandler.id}"
            }
          },
          createdBy_id:"${_this.userInfo.id}",
          type:2,
          status:0,
          name:"【${_this.userInfo.name}】提交了【${_this.project.name}】项目中的【[多]${data.name}】任务，需您审核"
        }]){returning{id}}`

      var summaryString = `
        insert_Summary(objects:[{
          project_id:"${_this.projectId}",
          createdBy_id:"${_this.userInfo.id}",
          content:"【${_this.userInfo.name}】提交项目任务：【[多]${data.name}】，让【${
        data.NextHandler.name
      }】进行审核",
        }]){returning{id}}
      `

      var documentString = ``
      if((data.files||[]).length){
        
        var singleFile = ``
        data.files.forEach(ele => {
          singleFile += `{
            url:"${this.projectId}/",
            name: "${ele.name}", 
            property:1,#文件属性 0:目录 1:文件
            type:1, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档
            relatedId:"${this.projectId}",
            projectFileType:2 #项目文件类型 0:项目资料 1:过程文件 2:成果文件
            fileSize:${ele.size},
            parent_id:"${this.projectId}",
            isLocked:false,
            createdBy_id:"${this.userInfo.id}"
          }`
        })
        documentString = `insert_Document(objects:[${singleFile}]){returning{id}}`
      }
      // 【操作人】提交项目任务：【[多]任务名称】，让【审核人】进行审核

      // console.log(notificationString,documentString)
      // return

      this.$apollo
        .mutate({
          mutation: gql`
          mutation {
            insert_Task(
              objects: [{
                project_id:"${_this.projectId}"
                type: 3
                handler_id:"${data.NextHandler.id}"
                name: "${data.name}"
                step: ${data.step}
                submitAmount: ${data.submitAmount}
                approvedAmount: ${data.approvedAmount}
                unitPrice: ${data.unitPrice || 0}
                remark: "${data.remark}"
                status: 4
                reviewResult: "-1"
                createdBy_id:"${_this.userInfo.id}"
              }]
            ) {
              returning{
                id
              }
            }
            ${notificationString}
            ${summaryString}
            ${documentString}
          }`
        })
        .then(res => {
          console.log(res, 'create project review task success')
          _this.openReview = false
          _this.$message.success('添加任务成功')
          _this.loadData()
        })
        .catch(err => {
          console.log(err, 'create project review task error')
          _this.$message.error('添加任务失败')
          console.log(err)
        })
    },
    reviewCancel() {
      this.openReview = false
    },
    //删除成果审核
    async deleteReview(data){

      let deleteId  = []
      // debugger
      data.forEach(ele => {
        ele.forEach(e => {
          deleteId.push(e.id)
        })
      })
      let mutation = `mutation {
        delete_Task(where:{id:{_in:${ArrayToString(deleteId)}}}){returning {id}}
      }`
      
      console.log(mutation)
      let res = await this.dbConn.mutation(mutation)
      this.loadData()
      this.$message.success('删除成功')

      // console.log(ArrayToString(deleteId))
    },

    //设置步骤条图标状态
    setStepStatus(value,num){
      // console.log(value,num,'valuewait')
      var step = value[num - 1] || []
      if(step.length){
        if(step[0].reviewResult == 1){
          return "finish"
        }else if(step[0].reviewResult == 0){
          return "error"
        }else {
          return "wait"
        }
      }else {
        return "wait"
      }
    },
    //设置任务的最终状态
    setStepsStatus(value){
      let i = 0
      let now = 0
      value.forEach((ele,index) => {
        if(ele.length >= now){
          i = index
          now = ele.length
        }
      })
      return value[i][0].reviewResult
    },
    //设置审核状态颜色
    setStepAuditColor(col){
      if(col.reviewResult == -1){
        return '#aaa'
      } else if(col.reviewResult == 0){
        return '#ff0000'
      } else {
        return '#0fc00f'
      }
    }
  }
}
</script>

<style>
.ProjectReview {
  /* margin-top: 10px; */
}
.ProjectReview .ant-card-head-title {
  padding: 0;
}
.ProjectReview .ant-card-wider-padding .ant-card-body {
  padding: 15px;
}
.ProjectReview p {
  margin-bottom: 5px;
}
.ProjectReview .empty-tip {
  text-align: center;
  box-sizing: content-box;
  padding: 50px 0;
  height: 100px;
  font-size: 20px;
  color: #cbcbcb;
  font-size: 13px;
}
.ProjectReview .empty-tip .iconfont {
  display: block;
  font-size: 45px;
}
.ProjectReview .ant-steps-item.ant-steps-item-custom {
  width: 24%;
}
.ProjectReview .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-description {
  max-width:160px;
}
.ProjectReview .ant-card-extra{
  padding:0
}
.ProjectReview .firstDescription {
  margin-top: 10px;
  font-size:13px;
  color: #555;
}
.ProjectReview .nextDescription {
  margin-top:20px;
  padding-top:20px;
  border-top: 1px solid #eee
}
.ProjectReview .example {
  text-align: center;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>

