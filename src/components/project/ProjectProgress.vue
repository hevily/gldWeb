<template>
  <div style="padding:10px">
    <div style="margin-bottom:20px">
      <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <!--ms-if-->
            <td width="150">
              负责人：
              <span class="font16" @click="showEmployee(1)">
                <img
                  class="project-leader"
                  style="cursor: pointer;"
                  src="http://tvips.glodon.com/api/org/emp/downHeadImgByEmployeeIdNew/2586"
                >
                <span class="font16">
                  <input
                    class="font-blue nofocus"
                    type="text"
                    readonly="readonly"
                    :value="principal.name"
                    style="border-style: none; width: 55px; cursor: pointer;"
                  >
                </span>
              </span>
            </td>

            <td width="180">
              开始日期：
              <span class="ui-date">
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  style="width:60%"
                  v-if="startDate"
                  :value="moment(startDate,'YYYY-MM-DD')"
                  @change="projectStartDate"
                />
                <a-date-picker
                  style="width:60%"
                  v-else
                  @change="projectStartDate"
                  :disabledDate="disabledStartDate"
                />
              </span>
            </td>
            <td width="180">
              截止日期：
              <span class="ui-date">
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  style="width:60%"
                  v-if="endDate"
                  :value="moment(endDate,'YYYY-MM-DD')"
                  @change="projectEndDate"
                />
                <a-date-picker
                  style="width:60%"
                  v-else
                  @change="projectEndDate"
                  :disabledDate="disabledEndDate"
                />
              </span>
            </td>
            <td width="20">
              <a-input-number style="width:60px" v-model="countDay" :min="0" @change="countDayChange"/>
            </td>
            <td width="80">
              <div class="ui-dropdown">
                <a-select :value="settlement" @change="timeChange">
                  <a-select-option value="2">工作日</a-select-option>
                  <a-select-option value="1">自然日</a-select-option>
                </a-select>
              </div>
            </td>
            <td width="140" class="font-center">
              <div class="project-date">
                <a class="current-date font-red">{{hasDate}}</a>
                <span>/</span>
                <a class="all-date">{{totalDate}}</a>
                <i>天</i>

                <span style="font-size: 26px;font-weight: 400;color:green;font-family: fantasy;">{{totalDate - hasDate}}</span>
              </div>
            </td>
            <!-- <a-icon type="check-circle" />已完成 -->
            <!-- <a-icon type="clock-circle" /> 进行中-->
            <!-- <a-icon type="minus-circle" /> 未开始 -->
            <!-- <a-icon type="exclamation-circle" /> 延期/延误 -->
            <!-- <a-icon type="pause-circle" /> 暂停 -->
            <!-- <a-icon type="save" /> 已归档 -->

            <!-- 项目赶工 -->
            <td width="110">
              <div
                id="select-project_status"
                class="project-complete"
                :style="{backgroundColor:nowUrgentColor}"
              >
                <div class="select-box">
                  <div
                    class="select-content"
                    @click="showStatusList(1)"
                    :style="{borderColor:nowUrgentBorderColor}"
                  >
                    <span class="select-contentL">
                      <a-icon :type="nowUrgentIcon"/>
                      <span style="position: relative; top: -1px;">{{ nowUrgent }}</span>
                    </span>
                    <a-icon type="down"/>
                  </div>
                </div>
                <!--ms-if-->
                <div class="select-list" style="width: 126.6px;" ref="urgentDiv" v-if="urgentListShow">
                  <a-row>
                    <a-col
                      :span="25"
                      v-for="(urgent,index) in urgentArray"
                      :key="index"
                      :style="{display: urgent.name != nowUrgent ? 'block':'none'}"
                    >
                      <a
                        :value="urgent.value"
                        @click="urgentListClick(urgent)"
                        style="color:#fff;font-size:18px;display: block;padding: 10px;"
                      >
                        <a-icon :type="urgent.icon" style="margin-right: 5px;"/>
                        {{ urgent.name }}
                      </a>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </td>
            <td width="5"></td>
            <!-- 项目状态 -->
            <td width="140">
              <div
                id="select-project_status"
                class="project-complete"
                :style="{backgroundColor:nowStatusColor}"
              >
                <div class="select-box">
                  <div
                    class="select-content"
                    @click="showStatusList(2)"
                    :style="{borderColor:nowStatusBorderColor}"
                  >
                    <span class="select-contentL">
                      <a-icon :type="nowStatusIcon"/>
                      <span style="position: relative; top: -1px;">{{ nowStatus }}</span>
                    </span>
                    <a-icon type="down"/>
                  </div>
                </div>
                <!--ms-if-->
                <div class="select-list" ref="statusDiv" v-if="statusListShow">
                  <a-row>
                    <a-col
                      :span="25"
                      v-for="(statusItem,index) in statusArr"
                      :key="index"
                      :style="{display: statusItem.name != nowStatus ? 'block':'none'}"
                    >
                      <a
                        :value="statusItem.value"
                        @click="StatusListClick(statusItem)"
                        style="color:#fff;font-size:18px;display: block;padding: 10px;"
                      >
                        <a-icon :type="statusItem.icon" style="margin-right: 5px;"/>
                        {{ statusItem.name }}
                      </a>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin-bottom:20px" id="steps">
      <h3>
        <span style="margin-right:20px">项目进展</span>
        <span
          style="font-size:14px;color:#5873c9;cursor:pointer"
          @click="showStepsDialog(0)"
          v-if="$auth('edit-project-status')"
        >
          <a-icon type="edit"/>编辑节点
        </span>
      </h3>
      <div class="project-flow" ref="flowDiv">
        <!-- 小于6个的时候 -->
        <a-row v-if="steps.length < 6" class="project-flow_l">
          <a-col
            class="flow-item"
            :span="4"
            v-for="(items,index) in steps"
            :key="index"
            @mouseenter="flowMove(index)"
            @mouseleave="removeMove"
          >
            <div class="flow-status" :style="{visibility: move == index ? 'unset':'hidden'}">
              <a
                title="已完成"
                @click="stepStatusChange(items,2,0)"
                class="font-blue"
                :style="{display: items.status == 2 ? 'none':'inline-block'}"
              >
                <a-icon type="check-circle" style="width: 18px;"/>
              </a>
              <a
                title="进行中"
                @click="stepStatusChange(items,1,0)"
                class="font-green"
                :style="{display: items.status == 0 || items.status == 1 ? 'none':'inline-block'}"
              >
                <a-icon type="clock-circle" style="width: 18px;"/>
              </a>
              <a
                title="暂停"
                @click="stepStatusChange(items,4,0)"
                class="font-red"
                :style="{display: items.status == 4 ? 'none':'inline-block'}"
              >
                <a-icon type="pause-circle" style="width: 18px;"/>
              </a>
            </div>
            <dl class="flow-box flow-box1">
              <dt
                @click="showStepSummary(items,0)"
                :title="items.name"
                :style="{borderColor:stepStatusColor[items.status],color:stepStatusFontColor[items.status],background:items.type == 1?'rgba(88, 166, 240, 0.28)': items.type == 2 ? 'rgba(120, 187, 97, 0.27)': '#fff'}"
              >
                <i>{{  index + 1  }}</i>
                {{ items.name }}
              </dt>
              <dd>
                <i
                  :style="{backgroundColor:stepStatusFontColor[items.status||1],padding: '2px 3px'}"
                >{{items.status == 1 || items.status == 0 ? '计':items.status == 2 ? '完':items.status == 4?'暂':''}}</i>
                <a-date-picker
                  placeholder="点击选择日期"
                  @change="changePlanTime"
                  @focus="changePlanTimeFocus(items)"
                  class="flow-time"
                  v-if="items.planTime ||items.finishTime"
                  :value="moment((items.planTime ||items.finishTime), 'YYYY-MM-DD')"
                >
                  <span slot="suffixIcon" type></span>
                </a-date-picker>
                <a-date-picker
                  placeholder="点击选择日期"
                  @change="changePlanTime"
                  @focus="changePlanTimeFocus(items)"
                  class="flow-time"
                  size="small"
                  v-else
                >
                  <span slot="suffixIcon" type></span>
                </a-date-picker>
                <!-- <input type="text" readonly="readonly" placeholder="点击选择日期" class="flow-time"> -->
              </dd>
            </dl>
            <div
              class="flow-content"
              v-if="items.summarys.length"
              :style="{display:stepSummary == items.order ? 'block': 'none'}"
            >
              <span class="flow-content-arrow"></span>
              <a-row v-for="(sum,sumIndex) in items.summarys" :key="sumIndex">
                <a-col :span="16">{{sum.content}}</a-col>
                <a-col :span="8">{{format(sum.createdAt,'YYYY-MM-DD')}}</a-col>
              </a-row>
            </div>
            <a class="flow-arrow" style="font-size:20px" v-if="index < steps.length-1">
              <a-icon type="right"/>
            </a>
          </a-col>
        </a-row>
        <!-- 大于6个的时候 -->
        <div v-else>
          <!-- 单双行 -->
          <a-row
            v-for="item in Math.ceil(steps.length/6)"
            :key="item"
            :class="[item%2 == 0 ?'project-flow_r':'project-flow_l']"
          >
            <!-- 循环遍历项目进展在范围内 -->
            <a-col
              class="flow-item"
              :span="4"
              v-for="(items,index) in steps"
              :key="index"
              v-if="((item*6 >index) && ((item-1)*6 <= index))"
              @mouseenter="flowMove(index)"
              @mouseleave="removeMove"
            >
              <div class="flow-status" :style="{visibility: move == index ? 'unset':'hidden'}">
                <a
                  title="已完成"
                  @click="stepStatusChange(items,2,0)"
                  class="font-blue"
                  :style="{display: items.status == 2 ? 'none':'inline-block'}"
                >
                  <a-icon type="check-circle" style="width: 18px;"/>
                </a>
                <a
                  title="进行中"
                  @click="stepStatusChange(items,1,0)"
                  class="font-green"
                  :style="{display: items.status == 0 || items.status == 1 ? 'none':'inline-block'}"
                >
                  <a-icon type="clock-circle" style="width: 18px;"/>
                </a>
                <a
                  title="暂停"
                  @click="stepStatusChange(items,4,0)"
                  class="font-red"
                  :style="{display: items.status == 4 ? 'none':'inline-block'}"
                >
                  <a-icon type="pause-circle" style="width: 18px;"/>
                </a>
              </div>
              <dl class="flow-box flow-box1" @click="showStepSummary(items,0)">
                <dt
                  :title="items.name"
                  :style="{borderColor:stepStatusColor[items.status],color:stepStatusFontColor[items.status],background:items.type == 1?'rgba(88, 166, 240, 0.28)': items.type == 2 ? 'rgba(120, 187, 97, 0.27)': '#fff'}"
                >
                  <i>{{ index + 1 }}</i>
                  {{ items.name }}
                </dt>
                <dd>
                  <i
                    :style="{backgroundColor:stepStatusFontColor[items.status||1],padding: '2px 3px'}"
                  >{{items.status == 1 || items.status == 0 ? '计':items.status == 2 ? '完':items.status == 4?'暂':''}}</i>
                  <a-date-picker
                    placeholder="点击选择日期"
                    @change="changePlanTime"
                    @focus="changePlanTimeFocus(items)"
                    class="flow-time"
                    v-if="items.planTime ||items.finishTime"
                    :value="moment((items.planTime ||items.finishTime), 'YYYY-MM-DD')"
                  >
                    <span slot="suffixIcon" type></span>
                  </a-date-picker>
                  <a-date-picker
                    placeholder="点击选择日期"
                    @change="changePlanTime"
                    @focus="changePlanTimeFocus(items)"
                    class="flow-time"
                    size="small"
                    v-else
                  >
                    <span slot="suffixIcon" type></span>
                  </a-date-picker>
                </dd>
              </dl>
            
              <div
                class="flow-content"
                v-if="items.summarys.length"
                :style="{display:stepSummary == items.order ? 'block': 'none'}"
              >
                <span class="flow-content-arrow"></span>
                <a-row v-for="(sum,sumIndex) in items.summarys" :key="sumIndex">
                  <a-col :span="16">{{sum.content}}</a-col>
                  <a-col :span="8">{{format(sum.createdAt,'YYYY-MM-DD')}}</a-col>
                </a-row>
              </div>
              <a class="flow-arrow" style="font-size:20px" v-if="index < steps.length-1">
                <a-icon v-if="(index+1)%6 == 0" type="down"/>
                <a-icon v-else :type="item%2 == 0 ? 'left':'right'"/>
              </a>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div style="margin-bottom:20px" id="moneySteps">
      <h3>
        <span style="margin-right:20px">财务进展</span>
        <span
          style="font-size:14px;color:#5873c9;cursor:pointer"
          @click="showStepsDialog(1)"
          v-if="$auth('edit-project-status')"
        >
          <a-icon type="edit"/>编辑节点
        </span>
      </h3>
      <div class="project-flow" ref="flowDiv">
        <!-- 小于6个的时候 -->
        <a-row v-if="moneySteps.length < 6" class="project-flow_l">
          <a-col
            class="flow-item"
            :span="4"
            v-for="(items,index) in moneySteps"
            :key="index"
            @mouseenter="flowMove(index)"
            @mouseleave="removeMove"
          >
            <div class="flow-status" :style="{visibility: move == index ? 'unset':'hidden'}">
              <a
                title="已完成"
                @click="stepStatusChange(items,2,1)"
                class="font-blue"
                :style="{display: items.status == 2 ? 'none':'inline-block'}"
              >
                <a-icon type="check-circle" style="width: 18px;"/>
              </a>
              <a
                title="进行中"
                @click="stepStatusChange(items,1,1)"
                class="font-green"
                :style="{display: items.status == 0 || items.status == 1 ? 'none':'inline-block'}"
              >
                <a-icon type="clock-circle" style="width: 18px;"/>
              </a>
              <a
                title="暂停"
                @click="stepStatusChange(items,4,1)"
                class="font-red"
                :style="{display: items.status == 4 ? 'none':'inline-block'}"
              >
                <a-icon type="pause-circle" style="width: 18px;"/>
              </a>
            </div>
            <dl class="flow-box flow-box2">
              <dt
                @click="showStepSummary(items,1)"
                :title="items.name"
                :style="{borderColor:stepStatusColor[items.status],color:stepStatusFontColor[items.status],background:items.type == 1?'rgba(88, 166, 240, 0.28)': items.type == 2 ? 'rgba(120, 187, 97, 0.27)': '#fff'}"
              >
                <i>{{  index + 1  }}</i>
                {{ items.name }}
              </dt>
              <dd>
                <i
                  :style="{backgroundColor:stepStatusFontColor[items.status||1],padding: '2px 3px'}"
                >{{items.status == 1 || items.status == 0 ? '计':items.status == 2 ? '完':items.status == 4?'暂':''}}</i>
                <a-date-picker
                  placeholder="点击选择日期"
                  @change="changePlanTime"
                  @focus="changePlanTimeFocus(items)"
                  class="flow-time"
                  v-if="items.planTime ||items.finishTime"
                  :value="moment((items.planTime ||items.finishTime), 'YYYY-MM-DD')"
                >
                  <span slot="suffixIcon" type></span>
                </a-date-picker>
                <a-date-picker
                  placeholder="点击选择日期"
                  @change="changePlanTime"
                  @focus="changePlanTimeFocus(items)"
                  class="flow-time"
                  size="small"
                  v-else
                >
                  <span slot="suffixIcon" type></span>
                </a-date-picker>
              </dd>
            </dl>
            <div
              class="flow-content"
              v-if="items.summarys.length"
              :style="{display:moneyStepSummary == items.order ? 'block': 'none'}"
            >
              <span class="flow-content-arrow"></span>
              <a-row v-for="(sum,sumIndex) in items.summarys" :key="sumIndex">
                <a-col :span="16">{{sum.content}}</a-col>
                <a-col :span="8">{{format(sum.createdAt,'YYYY-MM-DD')}}</a-col>
              </a-row>
            </div>
            <a class="flow-arrow" style="font-size:20px" v-if="index < moneySteps.length-1">
              <a-icon type="right"/>
            </a>
          </a-col>
        </a-row>
        <!-- 大于6个的时候 -->
        <div v-else>
          <!-- 单双行 -->
          <a-row
            v-for="item in Math.ceil(moneySteps.length/6)"
            :key="item"
            :class="[item%2 == 0 ?'project-flow_r':'project-flow_l']"
          >
            <!-- 循环遍历项目进展在范围内 -->
            <a-col
              class="flow-item"
              :span="4"
              v-for="(items,index) in moneySteps"
              :key="index"
              v-if="((item*6 >index) && ((item-1)*6 <= index))"
              @mouseenter="flowMove(index)"
              @mouseleave="removeMove"
            >
              <div class="flow-status" :style="{visibility: move == index ? 'unset':'hidden'}">
                <a
                  title="已完成"
                  @click="stepStatusChange(items,2,1)"
                  class="font-blue"
                  :style="{display: items.status == 2 ? 'none':'inline-block'}"
                >
                  <a-icon type="check-circle" style="width: 18px;"/>
                </a>
                <a
                  title="进行中"
                  @click="stepStatusChange(items,1,1)"
                  class="font-green"
                  :style="{display: items.status == 0 || items.status == 1 ? 'none':'inline-block'}"
                >
                  <a-icon type="clock-circle" style="width: 18px;"/>
                </a>
                <a
                  title="暂停"
                  @click="stepStatusChange(items,4,1)"
                  class="font-red"
                  :style="{display: items.status == 4 ? 'none':'inline-block'}"
                >
                  <a-icon type="pause-circle" style="width: 18px;"/>
                </a>
              </div>
              <dl class="flow-box flow-box2" @click="showStepSummary(items,1)">
                <dt
                  :title="items.name"
                  :style="{borderColor:stepStatusColor[items.status],color:stepStatusFontColor[items.status],background:items.type == 1?'rgba(88, 166, 240, 0.28)': items.type == 2 ? 'rgba(120, 187, 97, 0.27)': '#fff'}"
                >
                  <i>{{  index + 1  }}</i>
                  {{ items.name }}
                </dt>
                <dd>
                  <i
                    :style="{backgroundColor:stepStatusFontColor[items.status||1],padding: '2px 3px'}"
                  >{{items.status == 1 || items.status == 0 ? '计':items.status == 2 ? '完':items.status == 4?'暂':''}}</i>
                  <a-date-picker
                    placeholder="点击选择日期"
                    @change="changePlanTime"
                    @focus="changePlanTimeFocus(items)"
                    class="flow-time"
                    v-if="items.planTime ||items.finishTime"
                    :value="moment((items.planTime ||items.finishTime), 'YYYY-MM-DD')"
                  >
                    <span slot="suffixIcon" type></span>
                  </a-date-picker>
                  <a-date-picker
                    placeholder="点击选择日期"
                    @change="changePlanTime"
                    @focus="changePlanTimeFocus(items)"
                    class="flow-time"
                    size="small"
                    v-else
                  >
                    <span slot="suffixIcon" type></span>
                  </a-date-picker>
                </dd>
              </dl>
              <div
                class="flow-content"
                v-if="items.summarys.length"
                :style="{display:moneyStepSummary == items.order ? 'block': 'none'}"
              >
                <span class="flow-content-arrow"></span>
                <a-row v-for="(sum,sumIndex) in items.summarys" :key="sumIndex">
                  <a-col :span="16">{{sum.content}}</a-col>
                  <a-col :span="8">{{format(sum.createdAt,'YYYY-MM-DD')}}</a-col>
                </a-row>
              </div>
              <a class="flow-arrow" style="font-size:20px" v-if="index < moneySteps.length-1">
                <a-icon v-if="(index+1)%6 == 0" type="down"/>
                <a-icon v-else :type="item%2 == 0 ? 'left':'right'"/>
              </a>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div style="margin-bottom:20px">
      <h3>项目计划</h3>
      <a-table :columns="columns" :dataSource="data" bordered size="small" :pagination="false">
        <!-- <template slot="name" slot-scope="text">
          <a href="javascript:;">{{ text }}</a>
        </template>-->
        <div slot="name" slot-scope="text,record,index">
          <a-input v-model="record.name"/>
        </div>
        <div slot="startDate" slot-scope="text,record,index">
          <a-date-picker/>
        </div>
        <div slot="endDate" slot-scope="text,record,index">
          <a-date-picker/>
        </div>
        <div slot="principal" slot-scope="text,record,index">
          <a-input v-model="record.principal" readonly="readonly"/>
        </div>
        <div slot="members" slot-scope="text,record,index">
          <a-input v-model="record.members" readonly="readonly"/>
        </div>
        <div slot="status" slot-scope="text,record,index">
          <a-select v-model="record.status" style="width:100px">
            <a-select-option key="0" :value="0">未开始</a-select-option>
            <a-select-option key="1" :value="1">进行中</a-select-option>
            <a-select-option key="2" :value="2">已完成</a-select-option>
            <a-select-option key="3" :value="3">延期</a-select-option>
          </a-select>
        </div>
        <div slot="remark" slot-scope="text,record,index">
          <a-input v-model="record.remark"/>
        </div>
        <div slot="action" slot-scope="text,record,index">
          <a-icon
            type="save"
            title="保存计划"
            class="font-blue"
            style="width: 25px;line-height: 25px;cursor:pointer;color:#999"
          />
          <a-icon
            type="close-circle"
            title="取消编辑"
            style="width: 25px;line-height: 25px;cursor:pointer;color:#999"
          />
          <a-icon
            type="delete"
            title="删除计划"
            style="width: 25px;line-height: 25px;cursor:pointer;color:#999"
          />
        </div>
      </a-table>
      <div style="font-size:10px;color:#5873c9;cursor:pointer" @click="addPlans">
        <a-icon type="plus"></a-icon>添加计划项
      </div>
    </div>
    <div class="progress">
      <h3>项目纪要</h3>
      <a-timeline mode="left" :pending="true">
        <a-icon slot="pendingDot" type="clock-circle-o" style="font-size: 0px;"/>

        <a-timeline-item v-for="(value, key, index) in summarysData" :key="index">
          <p style="font-size: 15px;color: #000;">{{ key }}</p>
          <p v-for="val in value" :key="val.id" style="font-size: 12px;">
            <span style="color: #999;margin-right: 10px;">{{ val.time }}</span>
            <span style="color: #000;font-weight:600 ;margin-right: 5px;">{{ val.createdBy.name }}</span>
            <span>{{ val.content }}</span>
          </p>
        </a-timeline-item>
      </a-timeline>
    </div>

    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visibled"
      :type="employeeType"
      :isOne="isOne"
      @changeStatus="changeEMStatus"
    />
    <stepsDialog
      inititle="编辑节点"
      :stepType="stepType"
      :inivisible="stepsVisibled"
      :projectId="projectId"
      @changeStatus="stepsChange"
    />
    <!-- 项目暂停 -->
    <a-modal
      :visible="statusStopVisibled"
      title="暂停信息"
      class="ProjectType"
      @cancel="statusStopCancel"
    >
      <a-row>
        <a-col :span="5" style="text-align: right">暂停原因：</a-col>
        <a-col :span="17">
          <a-textarea rows="5" placeholder="暂停原因" v-model="stopReason"/>
        </a-col>
      </a-row>
      <template slot="footer">
        <div>
          <a-button type="primary" @click="statusStopOk">确定</a-button>
          <a-button type="default" @click="statusStopCancel">取消</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 项目延期 -->
    <a-modal
      :visible="statusDelayVisibled"
      title="延期信息"
      class="ProjectType"
      @cancel="statusDelayCancel"
    >
      <a-row>
        <a-col :span="5" style="text-align: right;line-height:32px">责任人：</a-col>
        <a-col :span="17">
          <a-input placeholder="责任人" style="width:50%"/>
        </a-col>
      </a-row>
      <a-row :style="{margin:'10px 0'}">
        <a-col :span="5" style="text-align: right;line-height:32px">延期到：</a-col>
        <a-col :span="17">
          <a-date-picker @change="delayDateChange"></a-date-picker>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="5" style="text-align: right">延期原因：</a-col>
        <a-col :span="17">
          <a-textarea rows="4" placeholder="延期原因" v-model="stopReason"/>
        </a-col>
      </a-row>
      <template slot="footer">
        <div>
          <a-button type="primary" @click="statusDelayOk">确定</a-button>
          <a-button type="default" @click="statusDelayCancel">取消</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 项目归档 -->
    <FinishDialog
      inititle="项目归档"
      :inivisible="statusFinishVisibled"
      :maskClosable="false"
      @changeStatus="finishDialogStatus"
    />
  </div>
</template>


<script>
// id,name,status,remark,endDate,startDate,principal,members

import gql from 'graphql-tag'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import employeeTree from '@/components/same/employeeTree'
import stepsDialog from '@/components/dialog/project/stepsDialog'
import FinishDialog from '@/components/dialog/project/finishDialog'

import { mapState, mapMutations } from 'vuex'
import { db } from '@/utils/db'
import { countWorkDay, getDuration,countEndDate } from '@/components/_util/StringUtil'

const columns = [
  {
    title: '计划项',
    dataIndex: 'name',
    width: 150,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    width: 150,
    scopedSlots: { customRender: 'startDate' }
  },
  {
    title: '截止时间',
    dataIndex: 'endDate',
    width: 150,
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    width: 150,
    scopedSlots: { customRender: 'principal' }
  },
  {
    title: '参与人',
    dataIndex: 'members',
    width: 150,
    scopedSlots: { customRender: 'members' }
  },
  {
    title: '完成情况',
    dataIndex: 'status',
    width: 150,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    width: 150,
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '',
    dataIndex: 'action',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ProjectProgress',
  props: {
    projectId: {
      type: String,
      defalut: ''
    }
  },
  data() {
    return {
      dbConn: new db(this.$apollo), //数据库操作,
      data: [],
      columns,
      startDate: '', //项目开始时间
      endDate: '', //项目截止时间

      nowStatus: '',
      statusListShow: false,
      nowStatusColor: '', //项目状态颜色
      nowStatusBorderColor: '', //项目状态边框颜色
      nowStatusIcon: '', //项目状态图标

      nowUrgent:'',
      urgentListShow:false,
      nowUrgentColor:'',
      nowUrgentBorderColor:'',
      nowUrgentIcon:'',

      emTitle: '', //人员弹框标题
      visibled: false, //人员弹框是否显示
      isOne: true, //人员是否多选
      employeeType: 1, //部门人员弹框类型
      type: 1, //结果类型
      countDay:0, //天数

      stepsVisibled: false, //编辑节点弹框是否显示
      stepStatus: {
        //节点状态
        0: '未开始',
        1: '进行中',
        2: '已完成',
        4: '暂停中'
      },
      stepStatusColor: {
        //节点边框颜色
        0: '#aaa',
        1: '#78bb61',
        2: '#58a6f0',
        4: '#f19149'
      },
      stepStatusFontColor: {
        //节点字体颜色
        0: '#555',
        1: '#78bb61',
        2: '#58a6f0',
        4: '#f19149'
      },

      stepSummary: 0, //节点纪要显示
      moneyStepSummary: 0, //节点纪要显示

      statusStopVisibled: false, //项目暂停显示
      stopReason: '',
      statusFinishVisibled: false, //项目归档显示
      statusDelayVisibled: false, //项目延期显示
      delayPricinpel: '', //延期负责人
      delayReason: '', //延期原因
      delayDate: '', //延期时间

      stopReason: '', //项目暂停原因
      stepId: '', //当前节点
      nextStepId: '', //下一个节点

      principal: {}, //负责人
      steps: [], //项目进展数组
      moneySteps:[], //财务节点
      stepType:0, //节点属性

      summarys: [], //项目纪要
      summarysData: {}, //处理过的数据
      plans: [], //项目计划
      endData: '', //开始时间
      startData: '', //截止时间
      status: '', //项目状态
      move: -1, //移入移出节点
      projectName: '',
      settlement: '2',
      totalDate: 0,
      hasDate: 0,
      pauses: [],
      urgentArray: [
        {
          name: '正常',
          value: 0,
          background: '#78bb61',
          borderColor: '#96ca85',
          icon: 'clock-circle'
        },
        {
          name: '赶工',
          value: 1,
          background: '#e3ba5d',
          borderColor: '#e9ce80',
          icon: 'check-circle'
        },
        {
          name: '加急',
          value: 2,
          background: '#df662c',
          borderColor: '#e1865a',
          icon: 'minus-circle'
        }
      ],
      statusArr: [
        //项目状态信息
        {
          name: '未开始',
          value: 0,
          background: '#aaa',
          borderColor: '#ccc',
          icon: 'minus-circle'
        },
        {
          name: '进行中',
          value: 1,
          background: '#78bb61',
          borderColor: '#96ca85',
          icon: 'clock-circle'
        },
        {
          name: '已完成',
          value: 2,
          background: '#5d9cec',
          borderColor: '#8bb8f1',
          icon: 'check-circle'
        },
        {
          name: '已归档',
          value: 3,
          background: '#d09c20',
          borderColor: '#e2b241',
          icon: 'minus-circle'
        },
        {
          name: '暂停',
          value: 4,
          background: '#f19149',
          borderColor: '#f5ae78',
          icon: 'pause-circle'
        },
        {
          name: '延期',
          value: 5,
          background: '#f19149',
          borderColor: '#f5ae78',
          icon: 'exclamation-circle'
        },
        {
          name: '延误',
          value: 6,
          background: '#f19149',
          borderColor: '#f5ae78',
          icon: 'exclamation-circle'
        }
      ]
    }
  },
  components: {
    employeeTree,
    stepsDialog,
    FinishDialog
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    this.loadData(this.projectId)
    console.log(moment().format(), this.startDate, this.endDate, 'startDate')
    
    // console.log(moment("2019-01-28T10:35:48.791Z").format('YYYY-MM-DD'))
  },
  mounted() {
    document.removeEventListener('click', this.handleDocumentClick)
    document.addEventListener('click', this.handleDocumentClick)
    // document.getElementById('steps').removeEventListener('mousemove',this.removeMove)
    // document.getElementById('steps').addEventListener('mousemove', this.removeMove)
  },
  destroyed() {
    document.removeEventListener('click', this.handleDocumentClick)
    console.log('progress destroyed')
  },
  methods: {
    moment,
    countWorkDay,
    countEndDate,
    getDuration,
    loadData(id) {
      var _this = this
      this.$apollo
        .query({
          query: gql`
            query {
              Project(where: {id:{_eq:"${id}"}}) {
                id
                name
                principal{
                  id
                  name
                }
                projectNo
                endDate
                startDate
                status
                urgentStatus
                pauses {
                  createdBy_id
                  project_id
                  id
                  reason
                  duration
                  endTime
                  startTime
                  
                }
                steps(where:{},order_by:[{order:asc}]) {
                  id
                  name
                  order
                  status
                  planTime
                  finishTime
                  property
                  type
                  summarys (order_by:[{createdAt:desc}]){
                    content
                    createdBy {
                      id
                      name
                    }
                    createdAt
                  }
                }
                plans{
                  id
                  name
                  status
                  remark
                  endDate
                  startDate
                  principal_id
                  members{
                    id
                  }
                }
                summarys(order_by:[{createdAt:desc}]) {
                  id
                  content
                  createdBy {
                    id
                    name
                  }
                  createdAt
                }
                
              }
              
            }
          `,
          fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res, 'get project info')
          _this.initInfo(res.data.Project)
        })
        .catch(err => {
          console.log(err)
        })
    },

    //初始化数据
    initInfo(data) {
      this.projectName = data[0].name
      this.principal = data[0].principal || {}
      this.startDate = data[0].startDate || ''
      this.endDate = data[0].endDate || ''

      this.pauses = data[0].pauses

      this.settlementTime()

      console.log(this.startDate ? 1 : 2, this.endDate ? 3 : 4)
      this.steps = data[0].steps.filter(ele => ele.property == 0)
      this.moneySteps = data[0].steps.filter(ele => ele.property == 1)
      this.summarys = data[0].summarys
      this.plans = data[0].plans
      this.status = data[0].status


      if(this.status == 0 ){
        if(this.startDate) {
          if(this.startDate < this.moment().format()){
            this.changeProjectStatus(1, '调整项目状态为进行中')
            // console.log(this.startDate, this.moment().format(),'进行中---------------')
          }
        }
      }


      if (this.status == 1) {
        //进行中
        if (this.endDate) {
          if (this.totalDate < this.hasDate) {
            console.log('延误')
            // debugger
            this.changeProjectStatus(6, '调整项目状态为延误')
          }
        }
      }

      if (this.status == 6) {
        if (this.endDate) {
          if (this.totalDate > this.hasDate) {
            // console.log('进行中')
            this.changeProjectStatus(1, '调整项目状态为进行中')
          }
        }
      }

      var statusData = this.statusArr.filter(ele => ele.value == this.status)
      this.nowStatus = statusData[0].name
      this.nowStatusColor = statusData[0].background
      this.nowStatusBorderColor = statusData[0].borderColor
      this.nowStatusIcon = statusData[0].icon

      this.nowUrgent = data[0].urgentStatus
      let urgentData = this.urgentArray.filter(ele => ele.value == this.nowUrgent)
      this.nowUrgent = urgentData[0].name
      this.nowUrgentColor = urgentData[0].background
      this.nowUrgentBorderColor = urgentData[0].borderColor
      this.nowUrgentIcon = urgentData[0].icon


      this.summarysData = {}
      this.summarys.forEach(_sum => {
        var time = moment(_sum.createdAt).format('YYYY-MM-DD')
        var obj = Object.assign({}, _sum)
        obj.time = moment(_sum.createdAt).format('HH:mm')
        if (this.summarysData[time]) {
          this.summarysData[time].push(obj)
        } else {
          this.summarysData[time] = [obj]
        }
      })
      console.log(this.summarysData)
    },
    //页面点击事件/项目状态改变/节点纪要
    handleDocumentClick(e) {
      console.log('document click')
      let summary = 0
      if(this.stepType == 0){
        summary = this.stepSummary
      }else {
        summary = this.moneyStepSummary
      }
      if (summary > 0) {
        if(this.stepType == 0){
          if (!document.getElementsByClassName('flow-box1')[this.stepSummary - 1].contains(e.target)) {
            this.stepSummary = 0
          }
        }else {
          if (!document.getElementsByClassName('flow-box2')[this.moneyStepSummary - 1].contains(e.target)) {
            this.moneyStepSummary = 0
          }
        }
        
      }

      if (this.$refs.statusDiv) {
        this.statusListShow = false
      }
      if(this.$refs.urgentDiv){
        this.urgentListShow = false
      }
    },

    //显示项目状态列表
    showStatusList(type) {
      // console.log(this.$auth)
      if (!this.$auth('edit-project-status')) {
        return
      }
      if(type == 1){
        this.urgentListShow = true
      }else {
        this.statusListShow = true
      } 
      
    },

    // 切换项目是否赶工
    async urgentListClick(record) {
      console.log(record,this.projectId)
      var mutationString = `mutation {
        update_Project(where:{id:{_eq:"${this.projectId}"}},_set:{urgentStatus:${record.value}}){returning {id}}
      }`
      // console.log(projectId)
      let res = await this.dbConn.mutation(mutationString)

      this.loadData(this.projectId)



    },

    //切换项目状态
    StatusListClick(record) {
      console.log(record)
      var _this = this
      _this.stepId = ''
      var content = '调整项目状态为'
      var statusValue = ''
      if ([0, 1, 2].indexOf(record.value) > -1) {
        if (record.value == 0) {
          statusValue = '未开始'
        } else if (record.value == 1) {
          statusValue = '进行中'
        } else {
          statusValue = '已完成'
        }
        content += statusValue
        this.$confirm({
          title: '项目状态',
          content: `你确定修改项目状态为${statusValue}？`,
          onOk() {
            _this.changeProjectStatus(record.value, content)
          },
          onCancel() {}
        })
      } else {
        switch (record.value) {
          case 3:
            _this.statusFinishVisibled = true
            break
          case 4:
            _this.statusStopVisibled = true

            break
          case 5:
            _this.statusDelayVisibled = true
            break
          case 6:
            break
        }
      }

      // statusDelayVisibled
      // this.nowStatus = record.name
      // this.nowStatusColor = record.background
      // this.nowStatusBorderColor = record.borderColor
      // this.nowStatusIcon = record.icon
      // this.statusListShow = false
    },
    changeProjectStatus(status, content) {
      var _this = this

      let projectPause = ''
      let updatePauses = ''
      let pauses = this.pauses.filter(ele => ele.endTime == null)
      let endDate = this.moment().format()
      if (status != '') {
        pauses.forEach((ele, index) => {
          let _endDate = this.moment(endDate).format('YYYY-MM-DD hh:mm:ss')
          let _startDate = this.moment(ele.startTime).format('YYYY-MM-DD hh:mm:ss')
          let duration = this.getDuration(_endDate, _startDate)
          updatePauses += `update_ProjectPause_${index}:update_ProjectPause(where:{id:{_eq:"${ele.id}"}},_set:{
            endTime:"${endDate}",
            duration:${parseInt(duration)}
          }){returning{id}}`
        })
        if (status == 4) {
          //暂停
          projectPause = `
            insert_ProjectPause(objects:[{
              startTime:"${moment().format()}" 
              createdBy_id:"${_this.userInfo.id}"  
              project_id:"${_this.projectId}"  
              reason:"${this.stopReason}" 
            }]){returning{id}}`
        }
      }

      let mutationString = `
        mutation{
          update_Project(where:{id:{_eq:"${_this.projectId}"}},_set:{
            status:${status},
          }){
            returning {
              id
              status
            }
          }
          insert_Summary(objects:[
            {project_id:"${_this.projectId}",content:"${content}",createdBy_id:"${_this.userInfo.id}"}
          ]){
            returning{
              id
            }
          }
          ${projectPause}
          ${updatePauses}
        }
      `
      // console.log(mutationString)
      // return
      this.$apollo
        .mutate({
          mutation: gql`
            ${mutationString}
          `
        })
        .then(res => {
          console.log(res, 'update project status success')
          _this.loadData(_this.projectId)
          _this.statusStopVisibled = false
        })
        .catch(err => {
          console.log(err, 'update project status error')
        })
    },
    //人员弹框返回结果
    changeEMStatus(obj) {
      this.visibled = obj.visibled
      if (this.type == 1 && obj.data.length) {
        //修改项目负责人
        if (this.principal.id == obj.data[0].key) {
          return
        }
        this.principal.id = obj.data[0].key
        this.principal.name = obj.data[0].title

        this.updatePrincipal()
      }
    },
    //人员弹框显示
    showEmployee(type) {
      this.visibled = true
      this.type = type
    },
    //修改项目开始时间
    projectStartDate(date, dateString) {
      if (!date) {
        return
      }
      var startDate = date
        .add(8, 'hours')
        .utc()
        .format()
      var _this = this
      this.$apollo
        .mutate({
          mutation: gql`
            mutation {
              update_Project(where: { id: {_eq:"${this.projectId}"} }, _set: { startDate: "${startDate}" }) {
                returning{startDate}
              }
            }
          `
        })
        .then(res => {
          _this.$message.success('修改开始日期成功')
          _this.startDate = res.data.update_Project.returning[0].startDate
          _this.settlementTime()
          console.log(res, 'update project startDate success')
        })
        .catch(err => {
          _this.$message.error('修改开始日期失败')
          console.log(err, 'update project startDate fail')
        })
    },
    //修改项目截止时间
    projectEndDate(date, dateString) {
      // console.log(date, dateString, 'change project endDate')
      if (!date) {
        return
      }
      var endDate = date
        .add(8, 'hours')
        .utc()
        .format()
      var _this = this
      this.$apollo
        .mutate({
          mutation: gql`
            mutation {
              update_Project(where: { id: {_eq:"${this.projectId}"} }, _set: { endDate: "${endDate}" }) {
                returning{endDate}
              }
            }
          `
        })
        .then(res => {
          _this.$message.success('修改截止日期成功')
          _this.endDate = res.data.update_Project.returning[0].endDate
          _this.settlementTime()
          console.log(res, 'update project endDate success')
        })
        .catch(err => {
          _this.$message.error('修改截止日期失败')
          console.log(err, 'update project endDate fail')
        })
    },
    //工作日、自然日
    timeChange(e) {
      this.settlement = e
      this.settlementTime()
      console.log(e)
    },

    //计算项目时间
    settlementTime() {
      this.totalDate = 0
      this.hasDate = 0

      let pausesDuration = 0

      this.pauses.forEach(ele => {
        pausesDuration += ele.duration
      })

      let otherDate = Math.floor(pausesDuration/1440) //暂停时间

      if (this.startDate) {
        // console.log(countEndDate(this.moment(this.startDate).format('YYYY-MM-DD'),5,1),'startDateendDatedate')
        if (this.endDate) {
          console.log(this.endDate, 'endDate')
          this.totalDate = this.countWorkDay(
            this.moment(this.startDate).format('YYYY-MM-DD'),
            this.moment(this.endDate).format('YYYY-MM-DD'),
            this.settlement
          )
          this.countDay = this.totalDate
          this.totalDate += otherDate
        }
        this.hasDate = this.countWorkDay(
          this.moment(this.startDate).format('YYYY-MM-DD'),
          this.moment().format('YYYY-MM-DD'),
          this.settlement
        )
      }
    },

    disabledStartDate(startValue) {
      const endValue = this.endDate
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() >= moment(endValue).valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startDate
      if (!endValue || !startValue) {
        return false
      }
      return moment(startValue).valueOf() > endValue.valueOf()
    },

    addPlans() {
      this.data.push({
        name: '',
        status: 0,
        remark: '',
        endDate: '',
        startDate: '',
        principal: '',
        members: ''
      })
    },

    //显示节点编辑弹框
    showStepsDialog(type) {
      this.stepType = type
      // 
      this.stepsVisibled = true
    },
    //节点编辑关闭后
    stepsChange(obj) {
      this.stepsVisibled = obj.visibled
      debugger
      console.log(this.stepType)
      if (obj.steps) {
        if(this.stepType == 1){
          this.moneySteps = obj.steps
        }else {
          this.steps = obj.steps
        }
        // console.log(obj.steps, 'ddfdf')
        // this.steps = obj.steps
      }
      // console.log(obj)
    },

    //修改项目负责人
    updatePrincipal() {
      var _this = this

      var mutationString = `
        mutation{
          update_Project(where:{id:{_eq:"${_this.projectId}"}},_set:{
            principal_id:"${_this.principal.id}"
          }){
            returning{ id }
          }
          insert_Summary(objects:[
             { content: "修改了项目负责人为【${_this.principal.name}】", createdBy_id: "${
        _this.userInfo.id
      }",project_id:"${_this.projectId}"}
          ]){
            returning{id}
          }
          insert_Notification(objects:[{
            type:3,
            name: "【${_this.projectName}】项目被【${_this.userInfo.name}】委托给您负责。",
            status: 0,
            recipients:{
              data:{
                recipient_id:"${_this.principal.id}"
              }
            },
            createdBy_id:"${this.userInfo.id}"
          }]){returning{id}}
        }
      `
      this.dbConn
        .mutation(mutationString)
        .then(res => {
          console.log('update project principal success')
          _this.$message.success('修改负责人成功')
          _this.loadData(_this.projectId)
        })
        .catch(err => {
          console.log(err, 'update project principal error')
          _this.$message.success('修改负责人失败')
        })
    },
    //进展节点移入事件
    flowMove(i) {
      if (!this.$auth('edit-project-status')) {
        return
      }
      this.move = i
    },
    //进展节点移出事件
    removeMove() {
      // console.log('mousemove')
      this.move = -1
    },

    //显示节点纪要
    showStepSummary(record,type) {
      this.stepSummary = record.order
      this.stepType = type
      if(type == 0){
        this.stepSummary = record.order
        this.moneyStepSummary = 0
      }else {
        this.moneyStepSummary = record.order
        this.stepSummary = 0
      }
      console.log(this.stepSummary, 'showStepSummary')
    },

    //节点状态变更
    stepStatusChange(record, status,type) {
      this.stepId = record.id
      this.stepType = type
      // console.log(record,this.steps)

      // console.log(record,this.nextStepId)
      // return
      var _this = this
      switch (status) {
        case 1: //进行中
          this.statusDoing()
          break
        case 2: //完成
          // this.$confirm({
          //   title: '项目节点完成',
          //   content: `你确定项目节点【${record.name}】已完成？`,
          //   onOk() {

          //   },
          //   onCancel() {}
          // })
          if(this.stepType == 0){
            _this.nextStepId = (_this.steps.filter(ele => ele.order == record.order + 1 && ele.status == 0)[0] || []).id
          }
          _this.statusFinish()
          break
        case 4: //暂停
          this.statusStopVisibled = true
          this.stopReason = ''
          break
      }
    },
    //变更状态为已暂停
    statusStopOk() {
      var _this = this
      var projectStatus = ''
      var summaryContent = ''
      if (this.stepId) {
        console.log(this.steps)
        if(this.stepType == 0){
          var finishStep = this.steps.filter(ele => ele.type == 1)
          var nowStep = this.steps.filter(ele => ele.id == this.stepId)
          var startStep = this.steps.filter(ele => ele.type == 2)
          if (finishStep.length) {
            if (
              ((finishStep[0] || {}).order || 0) > nowStep[0].order &&
              ((startStep[0] || {}).order || 0) < nowStep[0].order
            ) {
              projectStatus = 4
            } else {
              projectStatus = ''
            }
          } else {
            projectStatus = ''
          }
          summaryContent = `调整项目状态为暂停，暂停原因：${this.stopReason}`

        }
        var stepSummaryContent = '变更状态【暂停中】'
        _this.updateStatus(4, stepSummaryContent, this.stepId, summaryContent, projectStatus)
      } else {
        var summaryContent = `调整项目状态为暂停，暂停原因：${this.stopReason}`
        _this.changeProjectStatus(4, summaryContent)
      }
    },
    //暂停原因取消
    statusStopCancel() {
      this.statusStopVisibled = false
    },

    //变更状态为已完成
    statusFinish() {
      var _this = this
      var stepSummaryContent = '变更状态【已完成】'
      var summaryContent = '调整项目状态为已完成'
      var nowStep = []
      if(this.stepType == 0){
        nowStep = this.steps.filter(ele => ele.id == this.stepId)
      }else {
        nowStep = this.moneySteps.filter(ele => ele.id == this.stepId)
      }

      if (nowStep[0].type == 1) {
        //完成节点
        // this.changeProjectStatus(record.value, content)
        _this.updateStatus(2, stepSummaryContent, this.stepId, summaryContent, 2)
        if(this.moneySteps.length){
          _this.updateStatus(1, '变更状态为进行中', this.moneySteps[0].id)
        }
       
      } else if (nowStep[0].type == 2) {
        //开始节点
        _this.updateStatus(2, stepSummaryContent, this.stepId)
        var summaryContent = '调整项目状态为进行中'
        var stepSummaryContent = '变更状态【进行中】'
        _this.updateStatus(1, stepSummaryContent, this.nextStepId, summaryContent, 1)
      } else {
        _this.updateStatus(2, stepSummaryContent, this.stepId)
      }

      if (this.nextStepId) {
        var nextStepSummaryContent = '变更状态【进行中】'
        _this.updateStatus(1, nextStepSummaryContent, this.nextStepId)
      }
    },
    //变更状态为进行中
    statusDoing() {
      var _this = this
      var projectStatus = ''
      var summaryContent = ''
      if(this.stepType == 0){
        var finishStep = this.steps.filter(ele => ele.type == 1)
        var startStep = this.steps.filter(ele => ele.type == 2)
        var nowStep = this.steps.filter(ele => ele.id == this.stepId)
        if (finishStep.length) {
          if (
            ((finishStep[0] || {}).order || 0) > nowStep[0].order &&
            ((startStep[0] || {}).order || 0) < nowStep[0].order
          ) {
            projectStatus = 1
          } else {
            projectStatus = ''
          }
        } else {
          projectStatus = ''
        }
        summaryContent = '调整项目状态为进行中'
      }
      var stepSummaryContent = '变更状态【进行中】'
      _this.updateStatus(1, stepSummaryContent, this.stepId, summaryContent, projectStatus)
    },

    //更新项目节点及项目状态
    updateStatus(status, stepSummaryContent, stepId, summaryContent, projectStatus) {
      var _this = this

      var mutationString = ''
      if (projectStatus) {
        let projectPause = ''
        let updatePauses = ''
        let pauses = this.pauses.filter(ele => ele.endTime == null)
        let endDate = this.moment().format()
        if (status != '') {
          pauses.forEach((ele, index) => {
            let _endDate = this.moment(endDate).format('YYYY-MM-DD hh:mm:ss')
            let _startDate = this.moment(ele.startTime).format('YYYY-MM-DD hh:mm:ss')
            let duration = this.getDuration(_endDate, _startDate)
            updatePauses += `update_ProjectPause_${index}:update_ProjectPause(where:{id:{_eq:"${ele.id}"}},_set:{
              endTime:"${endDate}",
              duration:${parseInt(duration)}
            }){returning{id}}`
          })
          if (status == 4) {
            //暂停
            projectPause = `
              insert_ProjectPause(objects:[{
                startTime:"${moment().format()}" 
                createdBy_id:"${_this.userInfo.id}"  
                project_id:"${_this.projectId}"  
                reason:"${this.stopReason}" 
              }]){returning{id}}`
          }
        }
        mutationString = `
          ${
            projectStatus == status
              ? `update_Project(where:{id:{_eq:"${this.projectId}"}},_set:{
                  status:${status},
              }){
                returning{
                  id
                }
              }
              `
              : ''
          }
          ${
            stepId
              ? `update_Step(where:{id:{_eq:"${stepId}"}},_set:{
              status: ${status},
              ${status == 2 ? `finishTime:"${moment().format()}"` : ''}
            }){
              returning{
                id
              }
            }`
              : ''
          }
          insert_Summary(objects:
            [
              ${
                stepId
                  ? `{step_id:"${stepId}",content:"${stepSummaryContent}",createdBy_id:"${_this.userInfo.id}"},`
                  : ''
              }
              ${
                projectStatus == status
                  ? `{project_id:"${this.projectId}"content:"${summaryContent}",createdBy_id:"${_this.userInfo.id}"},`
                  : ''
              }
            ]){
            returning{
              id
            }
          }
          ${projectPause}
          ${updatePauses}
        `
      } else {
        mutationString = `
          ${
            stepId
              ? `update_Step(where:{id:{_eq:"${stepId}"}},_set:{
              status: ${status},
              ${status == 2 || status == 1 ? `finishTime:"${moment().format()}"` : ''}
            }){
              returning{
                id
              }
            }`
              : ''
          }
          insert_Summary(objects:
            [
              ${
                stepId
                  ? `{step_id:"${stepId}",content:"${stepSummaryContent}",createdBy_id:"${_this.userInfo.id}"},`
                  : ''
              }
              ${
                status == 2 || status == 1
                  ? `{step_id:"${stepId}",content:"变更时间【${moment().format('YYYY-MM-DD')}】",createdBy_id:"${
                      _this.userInfo.id
                    }"},`
                  : ''
              }
            ]){
            returning{
              id
            }
          }
        `
      }

      console.log(mutationString)

      this.$apollo
        .mutate({
          mutation: gql`mutation {
            ${mutationString}
          }`
        })
        .then(res => {
          console.log(res, 'update project step or update project success')
          _this.loadData(_this.projectId)
          _this.statusStopVisibled = false
        })
        .catch(err => {
          console.log(err, 'updateStepStatusError')
        })
    },
    //更改节点时间
    changePlanTime(record) {
      // console.log(record.add(1, 'days').utc().format(),this.stepId,'changePlanTime')
      var time = record
        .add(8, 'hours')
        .utc()
        .format()
      var _this = this
      this.$apollo
        .mutate({
          mutation: gql`mutation {
          update_Step(where:{id:{_eq:"${_this.stepId}"}},_set:{
            planTime:"${time}",
          }){
            returning{
              id
              name
            }
          }
          insert_Summary(objects:[
            {content:"变更时间【${moment(time).format('YYYY-MM-DD')}】",createdBy_id:"${_this.userInfo.id}",step_id:"${
            _this.stepId
          }"}
          ]){
            returning{
              id
            }
          }
        }`
        })
        .then(res => {
          console.log(res, 'update step planTime success')
          _this.loadData(_this.projectId)
        })
        .catch(err => {
          console.log(err, 'update step planTime error')
        })
    },
    //获得计划时间节点id
    changePlanTimeFocus(record) {
      this.stepId = record.id
      console.log(record, 'panelChangePlanTime')
    },

    //项目状态更改为延期
    statusDelayOk() {},
    //取消更改项目状态为延期
    statusDelayCancel() {
      this.statusDelayVisibled = false
    },
    delayDateChange(date) {
      this.delayDate = moment(date).format('YYYY-MM-DD hh:mm:ss')
      console.log(this.delayDate, 'changeDelayDate')
    },

    //项目状态更改为已归档
    // finishDialogStatus(obj) {
    //   this.statusFinishVisibled = obj.visibled
    // },

    //归档弹框隐藏
    async finishDialogStatus(obj) {
      console.log(obj, 'finish')
      this.statusFinishVisibled = obj.visibled
      if ((obj.data || []).length) {
        var mutationString = `
          mutation {
            update_Project(where:{id:{_eq:"${this.projectId}"}},_set:{
              documentNo:"${obj.data[0].documentNo}"
              outcomeDocumentNo: "${obj.data[0].outcomeDocumentNo}"
              documentCheck: "${obj.data[0].documentCheck}"
              status:3
            }){returning{id}}
             insert_Summary(objects:[{ content: "调整项目状态为已归档", createdBy_id: "${
               this.userInfo.id
             }",project_id:"${this.projectId}"}]){returning{id}}
          }
        `
        let res = await this.dbConn.mutation(mutationString)
        this.loadData(this.projectId)
        // console.log(res)
      }
    },
    //格式化时间
    format(value, formatString) {
      // console.log(value,formatString)
      return moment(value).format(formatString)
    },
    //天数改变
    countDayChange(e){
      if(this.startDate){
        let endDate = this.countEndDate(this.moment(this.startDate).format('YYYY-MM-DD'),e - 1,this.settlement)
        this.projectEndDate(this.moment(endDate))
        console.log(endDate)
      }
      // console.log(e,this.countEndDate(this.moment(this.startDate).format('YYYY-MM-DD'),e,this.settlement))
      
    }
  }
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
  /* background-color: #5d9cec; */
  background: #aaaaaa
}
.select-box {
  padding: 5px;
  border-radius: 2px;
}
div.project-complete .select-content {
  /* border-color: #8bb8f1; */
  border-color:#aaaaaa
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

.select-list {
  position: absolute;
  width: 162px;
  background: inherit;
  z-index: 2;
}
.font-blue {
  color: #5873c9 !important;
}
.font-red {
  color: #fa8564 !important;
}
.font-green {
  color: #7fb144 !important;
}
.font-center {
  text-align: center !important;
}

.project-date a {
  font-size: 32px;
  font-weight: 600;
}
.project-date span {
  font-size: 34px;
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
.nofocus:focus {
  outline: none;
  box-shadow: none;
}

.project-flow {
  max-width: 1250px;
  margin: 0 auto;
}
.project-flow .project-flow_l {
  *zoom: 1;
  padding: 0 0 40px 25px;
}
.project-flow .project-flow_l .flow-item {
  padding-right: 30px;
  float: left;
  display: inline;
}
.project-flow .flow-item {
  position: relative;
  /* width: 190px; */
}
.project-flow .flow-status {
  visibility: hidden;
  margin-bottom: 5px;
}
.project-flow .flow-box dt {
  display: inline-block;
  color: #555;
  width: 150px;
  font-size: 16px;
  padding: 10px;
  border: 2px solid #aaa;
  border-radius: 50px;
  margin-bottom: 5px;
  cursor: pointer;
  white-space: nowrap;
}
.project-flow .flow-box dt i {
  margin-right: 10px;
  font-style: italic;
}
.project-flow .flow-box dd {
  font-size: 9px;
}
.project-flow .flow-box dd i {
  font-style: normal;
  padding: 0 3px;
  color: #fff;
  border-radius: 2px;
  margin-right: 5px;
  background-color: #7fb144;
}
.project-flow .flow-time {
  vertical-align: top;
  border: 0;
  font-size: 10px;
}

.project-flow .flow-time input {
  font-size: 10px;
  padding: 0;
  border: 0;
  line-height: 13px;
  height: 13px;
  color: #000;
}
.project-flow .flow-time input:focus {
  box-shadow: none;
}

.project-flow .flow-time .anticon.anticon-close-circle {
  display: none;
}
.project-flow .project-flow_l .flow-arrow {
  position: absolute;
  right: 5px;
  top: 37px;
}
.project-flow .flow-arrow {
  font-size: 16px;
  color: #aaa;
}
.project-flow .project-flow_l .flow-item:nth-child(6) .flow-arrow {
  right: 100px;
  top: 105px;
}
.project-flow .project-flow_r .flow-item:nth-child(6) .flow-arrow {
  left: 85px;
  top: 105px;
}

.project-flow .project-flow_r {
  *zoom: 1;
  padding: 0 28px 40px 0;
}

.project-flow .project-flow_r .flow-item {
  padding-left: 30px;
  float: right;
  display: inline;
}
.project-flow .project-flow_r .flow-arrow {
  position: absolute;
  left: 4px;
  top: 37px;
}
.project-flow .project-flow_r .flow-item {
  padding-left: 30px;
  float: right;
  display: inline;
}

.project-flow .flow-content {
  position: absolute;
  width: 240px;
  top: 85px;
  left: 100px;
  z-index: 5;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  font-size: 10px;
}
.project-flow .flow-content .flow-content-arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  border-right-color: #fff;
  border-bottom-color: #fff;
  transform: rotate(45deg);
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.2);
  top: -5px;
  left: 20px;
}
.project-flow .project-flow_l .flow-item:nth-child(6) .flow-content .flow-content-arrow {
  left: auto;
  right: 20px;
}
.project-flow .project-flow_r .flow-item:nth-child(1) .flow-content .flow-content-arrow {
  left: auto;
  right: 20px;
}

.project-flow .project-flow_r .flow-content {
  left: 130px;
}
.project-flow .project-flow_l .flow-item:nth-child(6) .flow-content {
  left: auto;
  right: 30px;
}
.project-flow .project-flow_r .flow-item:nth-child(1) .flow-content {
  left: auto;
  right: 0;
}
</style>

