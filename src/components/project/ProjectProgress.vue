<template>
  <div style="padding:10px">
    <div style="margin-bottom:20px">
      <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <!--ms-if-->
            <td width="200">
              负责人：
              <span class="font16">
                <img
                  class="project-leader"
                  style="cursor: pointer;"
                  src="http://tvips.glodon.com/api/org/emp/downHeadImgByEmployeeIdNew/2586"
                >
                <span class="font16">
                  <input
                    class="font-blue"
                    type="text"
                    readonly="readonly"
                    value="郑会龙"
                    style="border-style: none; width: 90px; cursor: pointer;"
                  >
                </span>
              </span>
            </td>

            <td width="210">
              开始日期：
              <span class="ui-date">
                <a-date-picker style="width:120px"/>
              </span>
            </td>
            <td width="210">
              截止日期：
              <span class="ui-date">
                <a-date-picker style="width:120px"/>
              </span>
            </td>
            <td width="80">
              <div class="ui-dropdown">
                <a-select value="2">
                  <a-select-option value="2">工作日</a-select-option>
                  <a-select-option value="1">自然日</a-select-option>
                </a-select>
              </div>
            </td>
            <td width="240" class="font-center">
              <div class="project-date">
                <b class="current-date font-red">4</b>
                <span>/</span>
                <b class="all-date">4</b>
                <i>天</i>
              </div>
            </td>
            <!-- <a-icon type="check-circle" />已完成 -->
            <!-- <a-icon type="clock-circle" /> 进行中-->
            <!-- <a-icon type="minus-circle" /> 未开始 -->
            <!-- <a-icon type="exclamation-circle" /> 延期/延误 -->
            <!-- <a-icon type="pause-circle" /> 暂停 -->
            <!-- <a-icon type="save" /> 已归档 -->
            <td width="240">
              <div id="select-project_status" class="project-complete" value="3">
                <div class="select-box">
                  <div class="select-content">
                    <span class="select-contentL">
                      <a-icon type="check-circle" />
                      <span style="position: relative; top: -1px;">已完成</span>
                    </span>
                    <a-icon type="down"/>
                  </div>
                </div>
                <!--ms-if-->
                <div class="select-list j-drop" style="display: none;">
                  <span class="project-notstarted" value="1">
                    <i class="iconfont"></i>未开始
                  </span>
                  <span class="project-ongoing" value="2">
                    <i class="iconfont"></i>进行中
                  </span>
                  <span class="project-delay" value="5">
                    <i class="iconfont"></i>延期
                  </span>
                  <span class="project-delay" value="7">
                    <i class="iconfont"></i>延误
                  </span>
                  <span class="project-complete" value="3">
                    <i class="iconfont"></i>已完成
                  </span>
                  <span class="project-filed" value="4">
                    <i class="iconfont"></i>已归档
                  </span>
                  <span class="project-stop" value="6">
                    <i class="iconfont"></i>暂停
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin-bottom:20px">
      <h3>
        <span style="margin-right:20px">项目进展</span>
        <span style="font-size:14px;color:#5873c9">
          <a-icon type="edit"></a-icon>编辑节点
        </span>
      </h3>
    </div>
    <div style="margin-bottom:20px">
      <h3>项目计划</h3>
      <a-table :columns="columns" :dataSource="data" bordered size="small" :pagination="false">
        <template slot="name" slot-scope="text">
          <a href="javascript:;">{{ text }}</a>
        </template>
      </a-table>
      <div style="font-size:10px;color:#5873c9">
        <a-icon type="plus"></a-icon>添加计划项
      </div>
    </div>
    <div class="progress">
      <h3>项目纪要</h3>
      <a-timeline mode="left" :pending="true">
        <a-icon slot="pendingDot" type="clock-circle-o" style="font-size: 0px;"/>

        <a-timeline-item>
          <p>2015-09-01</p>
          <p>这个一项事项</p>
          <p>这是二项事项</p>
          <p>这是二项事项</p>
        </a-timeline-item>
        <a-timeline-item>
          <p>2015-09-01</p>
          <p>这个一项事项</p>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>


<script>
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
]

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     money: '￥300,000.00',
//     address: 'New York No. 1 Lake Park'
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     money: '￥1,256,000.00',
//     address: 'London No. 1 Lake Park'
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     money: '￥120,000.00',
//     address: 'Sidney No. 1 Lake Park'
//   }
// ]
export default {
  name: 'ProjectProgress',
  props: {},
  data() {
    return {
      data: [],
      columns
    }
  },
  created() {},
  methods: {}
}
</script>

<style>
.project-leader {
  width: 28px;
  height: 28px;
  border-radius: 100%;
  margin-right: 5px;
}
div.project-complete {
    background-color: #5d9cec;
}
.select-box {
    padding: 5px;
    border-radius: 2px;
}
div.project-complete .select-content {
    border-color: #8bb8f1;
}
.select-content {
    height: 43px;
    border: 1px solid;
    color: #fff;
    border-radius: 2px;
    position: relative;
    cursor: pointer;
}
.select-content span.select-contentL {
    line-height: 43px;
    font-size: 18px;
    margin-left: 10px;
}
.select-content .anticon-down {
    color: #fff;
    position: absolute;
    top: 12px;
    right: 10px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
}
.select-content span i {
    font-size: 20px;
    margin-right: 10px;
}
.font-blue {
  color: #5873c9 !important;
}
.font-red {
    color: #fa8564!important;
}
.font-center {
    text-align: center!important;
}

.project-date b {
    font-size: 30px;
}
.project-date span {
    font-size: 36px;
    margin: 0 5px;
}
.progress .ant-timeline-item {
  padding-bottom: 0px;
}
.progress .ant-timeline-item-tail {
  /* position: absolute;
    left: 4px;
    top: 0.75em;
    height: 100%; */
  border-left: 2px solid #7abb65;
}
.progress .ant-timeline.ant-timeline-pending .ant-timeline-item-last .ant-timeline-item-tail {
  border-left: 2px solid #7abb65;
  display: block;
}
</style>

