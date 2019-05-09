<template>
  <div class="contractInfo">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-row style="min-width: 1190px;">
        <!-- 左边 -->
        <a-col :span="18">
          <!-- 第一段 -->
          <div class="divItem borderBottom">
            <table class="form-table table-layout" width="870" cellspacing="0" border="0">
              <tbody>
              <tr>
                <th width="120" class="th-right">
                  <label title="合同编号" class="ant-form-item-required">合同编号：</label>
                </th>
                <td width="370">
                  <a-form-item hasFeedback>
                    <a-input
                      v-decorator="['contractNo', {rules: [{ required: true, message: '请输入合同编号' }]}]"
                      type="text"
                      class="sameWidth"
                      placeholder="合同编号为系统自动生成"
                      maxlength="90"
                    />
                  </a-form-item>
                </td>
                <!--<th width="120" class="th-right">-->
                <!--&lt;!&ndash; <i class="iconfont font-red"></i>所属公司： &ndash;&gt;-->
                <!--<label title="所属公司" class="ant-form-item-required">所属公司：</label>-->
                <!--</th>-->
                <!--<td>-->
                <!--<a-select v-model="company" defaultValue="lucy" class="sameWidth">-->
                <!--<a-select-option value="lucy">广东恒正工程造价咨询有限公司</a-select-option>-->
                <!--</a-select>-->
                <!--</td>-->
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="合同名称" class="ant-form-item-required">合同名称：</label>
                </th>
                <td width="750" colspan="3">
                  <a-form-item hasFeedback>
                    <a-input v-decorator="['name', {rules: [{ required: true, message: '请输入合同名称' }]}]" type="text" placeholder="合同名称为必填项目" maxlength="200"/>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="catalog !== 2">
                <th width="120" class="th-right">合同类型：</th>
                <td width="390">
                  <a-form-item>
                    <a-select class="sameWidth" v-decorator="['type']">
                      <a-select-option
                        v-for="(item,index) in ContractType"
                        :key="index"
                        :value="item"
                      >{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </td>
                <th width="100" class="th-right">合同来源：</th>
                <td width="260">
                  <a-form-item>
                    <a-select class="sameWidth" v-decorator="['source']">
                      <a-select-option
                        v-for="(item,index) in ContractSource"
                        :key="index"
                        :value="item"
                      >{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="业务类型" class="ant-form-item-required">业务类型：</label>
                </th>
                <td width="750" colspan="3" style="position:relative">
                  <a-form-item hasFeedback>
                    <a-input
                      type="text"
                      placeholder
                      read-only
                      maxlength="200"
                      @click="showBusItem"
                      v-decorator="['businessType', {rules: [{ required: true, message: '请选择业务类型' }]}]"
                    />
                  </a-form-item>
                  <a-row class="bussT" ref="busDiv" v-if="isShow">
                    <a-col :span="24">
                      <a-checkbox-group
                        @change="busItemChange"
                        style="width:100%"
                        :value="businessType"
                      >
                        <a-row>
                          <a-col :span="8" v-for="(Bitem,index) in BusinessType" :key="index">
                            <div v-for="(sBitem,sindex) in Bitem" :key="sindex">
                              <a-checkbox :value="sBitem">{{ sBitem }}</a-checkbox>
                            </div>
                          </a-col>
                        </a-row>
                      </a-checkbox-group>
                    </a-col>
                  </a-row>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">开始日期：</th>
                <td width="390">
                  <a-date-picker v-model="startDate" class="sameWidth"/>
                </td>
                <th width="100" class="th-right">截止日期：</th>
                <td width="260">
                  <a-date-picker v-model="endDate" class="sameWidth"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- 第二段 -->
          <div class="divItem borderBottom">
            <table class="form-table table-layout" width="870" cellspacing="0" border="0">
              <tbody>
              <tr>
                <th width="120" class="th-right">
                  <label title="委托人" class="ant-form-item-required">委托人：</label>
                </th>
                <td width="750" colspan="3">
                  <a-form-item hasFeedback style="float:left">
                    <a-input
                      v-decorator="['client_name', {rules: [{ required: true, message: '请选择委托人' }]}]"
                      type="text"
                      placeholder="委托人为必填项目"
                      maxlength="200"
                      style="width: 680px;margin-right: 5px"
                      @blur="clientBlur"
                    />
                  </a-form-item>
                  <a-button type="primary" @click="showClientDialog" style="margin-top: 4px">选择</a-button>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="委托方地址">委托方地址：</label>
                </th>
                <td width="750" colspan="3">
                  <a-form-item>
                    <a-select
                      v-decorator="['selectProvince2']"
                      style="width: 120px;margin-right:5px"
                      @change="changeAreaData2(1, $event)"
                    >
                      <a-select-option
                        v-for="province in provices2"
                        :key="province"
                        :value="province"
                      >{{ province }}</a-select-option>
                    </a-select>
                    <a-select
                      v-decorator="['selectCity2']"
                      style="width: 120px;margin-right:5px"
                      @change="changeAreaData2(2, $event)"
                    >
                      <a-select-option v-for="city in cities2" :key="city" :value="city">{{ city }}</a-select-option>
                    </a-select>
                    <a-select
                      v-decorator="['selectArea2']"
                      style="width: 120px;margin-right:5px"
                    >
                      <a-select-option v-for="area in areas2" :key="area" :value="area">{{ area }}</a-select-option>
                    </a-select>
                    <a-input
                      type="text"
                      v-decorator="['address2']"
                      placeholder="输入详细地址"
                      style="width: 375px"
                    />
                  </a-form-item>
                </td>
              </tr>

              <tr v-if="catalog !== 1">
                <th width="120" class="th-right">
                  <label title="项目地址">项目地址：</label>
                </th>
                <td width="750" colspan="3">
                  <a-form-item>
                    <a-select
                      v-decorator="['selectProvince']"
                      style="width: 120px;margin-right:5px"
                      @change="changeAreaData(1, $event)"
                    >
                      <a-select-option
                        v-for="province in provices"
                        :key="province"
                        :value="province"
                      >{{ province }}</a-select-option>
                    </a-select>
                    <a-select
                      v-decorator="['selectCity']"
                      style="width: 120px;margin-right:5px"
                      @change="changeAreaData(2, $event)"
                    >
                      <a-select-option v-for="city in cities" :key="city" :value="city">{{ city }}</a-select-option>
                    </a-select>
                    <a-select
                      v-decorator="['selectArea']"
                      style="width: 120px;margin-right:5px">
                      <a-select-option v-for="area in areas" :key="area" :value="area">{{ area }}</a-select-option>
                    </a-select>
                    <a-input
                      type="text"
                      placeholder="输入详细地址"
                      v-decorator="['address']"
                      style="width: 375px"/>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="catalog !== 1">
                <th width="120"></th>
                <td width="750">
                  <table width="750" class="form-table table-layout person-table" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                      <td width="90">联系人</td>
                      <td width="130">联系方式</td>
                      <td width="120">职务</td>
                      <td width="320">备注</td>
                      <td width="40"></td>
                    </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(it,i) in contacts" :key="i">
                        <td width="90">
                          <a-input
                            type="text"
                            style="width: 90px;"
                            placeholder
                            class="sameWidth"
                            v-model="it.name"
                          />
                        </td>
                        <td width="130">
                          <a-input
                            type="text"
                            style="width: 130px;"
                            placeholder
                            class="sameWidth"
                            v-model="it.phone"
                          />
                        </td>
                        <td width="120">
                          <a-input
                            type="text"
                            style="width: 120px;"
                            placeholder
                            class="sameWidth"
                            v-model="it.job"
                          />
                        </td>
                        <td width="330">
                          <a-input
                            type="text"
                            style="width: 330px;"
                            placeholder
                            class="sameWidth"
                            v-model="it.remark"
                          />
                        </td>
                        <td width="40">
                          <a-icon type="delete" style="cursor:pointer" @click="delContact(i)"></a-icon>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <a @click="addContact">
                    <a-icon type="plus"></a-icon>添加联系人
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- 第三段 -->
          <div class="divItem borderBottom">
            <table class="form-table table-layout" width="870" cellspacing="0" border="0">
              <tbody>
              <tr>
                <th width="120" class="th-right">
                  <label title="合同份数">合同份数：</label>
                </th>
                <td width="370">
                  <a-input v-model="contractCount" type="text" class="sameWidth" placeholder="合同份数" maxlength="90"/>
                </td>
                <th width="120" class="th-right">
                  <!-- <i class="iconfont font-red"></i>所属公司： -->
                  <label title="合同存放地址">合同存放地址：</label>
                </th>
                <td>
                  <a-input v-model="contractAddress" type="text" class="sameWidth" placeholder maxlength="90"/>
                </td>
              </tr>
              <tr>
                <th v-if="catalog !== 1" width="120" class="th-right">负责人：</th>
                <td v-if="catalog !== 1" width="260">
                  <a-input
                    v-model="principal.name"
                    type="text"
                    class="sameWidth"
                    placeholder="点击选择负责人"
                    read-only
                    @click="showEModal(1, 1)"
                  />
                </td>
                <th width="100" class="th-right">合同预估金额：</th>
                <td width="260">
                  <a-input v-model="estimatedAmount" type="text" class="sameWidth" placeholder="合同预估金额"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">签约人：</th>
                <td width="260">
                  <a-input
                    v-model="signatory.name"
                    type="text"
                    class="sameWidth"
                    placeholder="点击选择签约人"
                    read-only
                    @click="showEModal(1, 2)"
                  />
                </td>
                <th width="100" class="th-right">签约时间：</th>
                <td width="260">
                  <a-date-picker v-model="signDate" class="sameWidth"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">登记人：</th>
                <td width="260">
                  <a-input
                    v-model="registrant.name"
                    type="text"
                    class="sameWidth"
                    placeholder="点击选择登记人"
                    read-only
                    @click="showEModal(1, 3)"
                  />
                </td>
                <th width="100" class="th-right">登记时间：</th>
                <td width="260">
                  <a-date-picker v-model="regDate" class="sameWidth"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- 第四段 -->
          <div class="divItem">
            <table class="form-table" width="870" cellspacing="0" cellpadding="0">
              <tbody>
              <tr>
                <th width="120" class="th-top">计取方式：</th>
                <td width="750">
                  <!--ms-if-->
                  <a-textarea
                    v-model="calcMethod"
                    rows="5"
                    placeholder="最多1000字"
                    maxlength="1000"
                    style="height: 160px;"
                  ></a-textarea>
                </td>
              </tr>
              <tr>
                <th class="th-top">支付方式：</th>
                <td width="750">
                  <a-textarea
                    v-model="payMethod"
                    rows="5"
                    placeholder="最多1000字"
                    maxlength="1000"
                    style="height: 160px;"
                  ></a-textarea>
                </td>
              </tr>
              <tr>
                <th class="th-top">合同备注：</th>
                <td width="750">
                  <a-textarea
                    v-model="remark"
                    rows="5"
                    placeholder="最多1000字"
                    maxlength="1000"
                    style="height: 160px;"
                  ></a-textarea>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </a-col>
        <!-- 右边 -->
        <a-col :span="6">
          <div class="divItem">
            <div
              id="select-project_status"
              class="project-complete"
              :style="{backgroundColor:nowStatusColor}"
            >
              <div class="select-box">
                <div class="select-content" @click="showStatusList" :style="{borderColor:nowBorderColor}">
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
            <div>
              <a-checkbox v-model="sendedOut" class="label-title">纸质合同已送出</a-checkbox>
              <div>
                <label title="送出时间">送出时间：</label>
                <a-date-picker v-model="sendedDate"/>
              </div>
            </div>
            <div>
              <a-checkbox v-model="returned" class="label-title">纸质合同已收回</a-checkbox>
              <div>
                <label title="收回时间">收回时间：</label>
                <a-date-picker v-model="returnedDate" />
              </div>
            </div>
          </div>
          <div>
            <div class="label-title">
              关联项目：<a href="javascript:void(0)" @click="showProjectList"><a-icon type="plus-square" /></a>
            </div>
            <hr>
            <!--<ul class="new-project_item">-->
              <!--<li>-->
                <!--<a href="javascript:void(0)" title="【2018-1077】拼车集报业务功能模块信息系统项目" class="project-name project-name-blue"><a-icon type="clock-circle"/><em>【2018-1077】拼车集报业务功能模块信息系统项目</em>——郑会龙</a>-->
                <!--<span class="project-opt"><a href="javascript:void(0)" title="取消关联"><a-icon type="close-circle" /></a></span>-->
              <!--</li>-->
            <!--</ul>-->
            <a-list
              size="small"
              :dataSource="projects"
              class="new-project_item"
            >
              <a-list-item
                slot="renderItem"
                slot-scope="item, index"
                @mouseover="projectMouseOver(item.id)"
                @mouseout="projectMouseOut()"
              >
                <a-icon
                  :type="projectStatus[item.status.toString()].icon"
                  :style="'margin-top: 3px; margin-right: 7px; color:' + projectStatus[item.status.toString()].background"
                />
                <a
                  href="javascript:;"
                  :title="item.name"
                  @click="goProjectDetail(item)"
                >
                  <div style="width: 100px;float:left" class="ellipsis">{{item.name}}</div>
                  {{ item.principal ? '——' + item.principal.name: '' }}
                </a>
                <a
                  href="javascript:;"
                  title="取消关联"
                  v-if="selectedProjectId === item.id"
                  @click="unbindProject(item.id)"
                >
                  <a-icon
                    type="close-circle"
                    style="margin-top: 3px; margin-left: 50px; color:#5b76c9"
                  />
                </a>
              </a-list-item>
            </a-list>
          </div>
          <div>
            <div class="label-title">合同原件：</div>
            <a-upload
              :style="{display:'inline-block'}"
              :action="actionHref"
              :multiple="true"
              :showUploadList="false"
              @change="handleChange"
            >
              <a-button>
                <a-icon type="upload"/>上传原件
              </a-button>
            </a-upload>
            <div>
              <a-list
                size="small"
                :dataSource="documents"
                class="new-project_item"
              >
                <a-list-item
                  slot="renderItem"
                  slot-scope="item, index"
                  @mouseover="projectMouseOver(item.id)"
                  @mouseout="projectMouseOut()"
                >
                  <a-icon
                    type="file"
                    :style="'margin-top: 3px; margin-right: 7px; color: #ccc' "
                  />
                  <a
                    href="javascript:;"
                    :title="item.name"
                    @click="downloadFile(item)"
                  >
                    <div style="width: 100px;float:left" class="ellipsis">{{item.name}}</div>
                    <!-- {{ item.principal ? '——' + item.principal.name: '' }} -->
                  </a>
                  <a
                    href="javascript:;"
                    title="删除"
                    v-if="selectedProjectId === item.id"
                    @click="deleteDocument(item.id)"
                  >
                    <a-icon
                      type="close-circle"
                      style="margin-top: 3px; margin-left: 50px; color:#5b76c9"
                    />
                  </a>
                </a-list-item>
              </a-list>
            </div>
            <!-- <a-button icon="upload">上传原件</a-button> -->
          </div>
        </a-col>
      </a-row>
      <a-row style="padding-bottom: 10px">
        <a-col :span="24">
          <div style="text-align:center">
            <a-button type="primary" html-type="submit" style="margin-right:10px">保存</a-button>
            <a-button type="default">取消</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visible"
      :type="employeeType"
      @changeStatus="changeEMStatus"
    />
    <!-- 委托人 -->
    <cilentDialog
      :inititle="clientTitle"
      :inivisible="clientVisible"
      @changeStatus="changeClStatus"
    />
    <projectListDialog 
      :inititle="projectTitle"
      :inivisible="projectVisible"
      :defaultSelectArray="projects"
      @changeStatus="changePLStatus"
    />
  </div>
</template>

<script>
import employeeTree from '@/components/same/employeeTree'
import cilentDialog from '@/components/dialog/project/clientDialog'
import projectListDialog from '@/components/dialog/contract/projectListDialog'
import { AreaData } from '@/components/same/area'
import { getNo } from '@/utils/code'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import uuid from 'uuid'
import { db } from '@/components/_util/db'
import { mapState } from 'vuex'

// import uuid from 'uuid'



import gql from 'graphql-tag'

// Todo 后面改为从数据库中读取
const codeRule = {
  'rule': '[%日期%]%流水号%',
  'dateFormat': 'YYYY',
  'serialLen': 3,
  'serialStart': 1,
  'businessType': {
    '编制投资估算': '估编',
    '编制设计概算': '概编',
    '编制施工图预算': '预编',
    '编制工程量清单': '清编',
    '编制工程量清单控制价': '控编',
    '编制投标报价': '报编',
    '编制竣工结算': '结编',
    '编制竣工决算': '决编',
    '审核投资估算': '估审',
    '审核设计概算': '概审',
    '审核施工图预算': '预审',
    '审核清单控制价': '控审',
    '审核工程变更': '变审',
    '审核竣工结算': '结审',
    '可行性经济评价': '经评',
    '全过程工程造价管理': '全过程',
    '工程造价鉴定': '造鉴',
    '工程造价信息咨询服务': '咨询',
    '其他工程造价咨询工作': '其他'
  }
}

const pad = (num, n) => {
  var len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

const generateNo = (codeRule, businessType, lastSerial) => {
  // debugger
  var no = ''
  //替换日期
  var d = moment().format(codeRule.dateFormat)
  no = codeRule.rule.replace('%日期%', d)
  //替换业务类型
  if(businessType){
    const type = codeRule.businessType[businessType]
    no = no.replace('%业务%', type)
  }
  //替换流水号
  const serial = lastSerial ? pad(lastSerial + 1, codeRule.serialLen): pad(codeRule.serialStart, codeRule.serialLen)
  no = no.replace('%流水号%', serial)
  return no
}

// var deparArr = ['施工单位', '监理单位', '编制单位', '项目业主', '设计单位', '咨询单位', '代建单位', '其他']
// var moneySourceArr = ['内资项目', '外资项目', '港资项目', '其它']
// var measurArr = ['平方米', '立方米', '公里', '米', '公斤', '吨', '工日', '其他']
var ContractSource = [
  '业主直接委托',
  '招标',
  '法院委托',
  '其他委托',
  '政府采购合同'
]
var ContractType = [
  '造价咨询服务合同',
  '招标代理服务合同'
]

var BusinessType = [
  [
    '编制投资估算',
    '编制设计概算',
    '编制施工图预算',
    '编制工程量清单',
    '编制工程量清单控制价',
    '编制投标报价',
    '编制竣工结算',
    '编制竣工决算'
  ],
  ['审核投资估算', '审核设计概算', '审核施工图预算', '审核清单控制价', '审核工程变更', '审核竣工结算'],
  ['可行性经济评价', '全过程工程造价管理', '工程造价鉴定', '工程造价信息咨询服务', '其他工程造价咨询工作']
]

//对象转字符串
function ObjectToString(obj) {
  var type = Object.prototype.toString.call(obj)
  var result = ''
  if (type === '[object Object]') {
    result += '{'
    for (var o in obj) {
      if(o !== '__typename'){
        if (Object.prototype.toString.call(obj[o]) === '[object String]') {
          result += o + ': "' + obj[o] + '",'
        } else {
          result += o + ': ' + obj[o] + ','
        }
      }
    }
    result += '}'
  }
  return result
}
//数组转字符串
function ArrayToString(obj) {
  var type = Object.prototype.toString.call(obj)
  var result = ''
  if (type === '[object Array]') {
    result = '['
    obj.forEach(ele => {
      result += ObjectToString(ele)
    })
    result += ']'
  } else if (type === '[object Object]') {
    result += ObjectToString(obj)
  }
  return result
}

export default {
  name: 'ContractInfo',
  inject: ['reload'],
  props: {
    mode: {
      type: Number,
      default: 1 //1: 新增合同 1: 新增子合同 2：修改合同
    },
    catalog: {
      type: Number, //0: 普通合同 1: 框架合同 2：子合同
      default: 0
    },
    
    contractId: {
      type: String,
      default: ''
    },
    dataSource: {
      type: Object,
      default: function (value) {
        return { value }
      }
    }
  },
  components: {
    employeeTree,
    cilentDialog,
    projectListDialog
  },
  data() {
    return {
      dbConn: new db(this.$apollo), //数据库操作,
      form: this.$form.createForm(this),
      nowStatus: '进行中',
      statusListShow: false,
      nowStatusColor: '#78bb61',
      nowBorderColor: '#78bb60',
      nowStatusIcon: 'clock-circle',
      newId:'', //手动创建合同Id
      statusArr: [
        {
          name: '进行中',
          value: 0,
          background: '#78bb61',
          border: '#78bb60',
          icon: 'clock-circle'
        },
        {
          name: '已完成',
          value: 1,
          background: '#5d9cec',
          border: '#8bb8f1',
          icon: 'check-circle'
        },
        {
          name: '暂停',
          value: 2,
          background: '#f19149',
          border: '#f09a5d',
          icon: 'pause-circle'
        }
      ],
      projectStatus: {
        '0': {
          name: '未开始',
          value: 0,
          background: '#78bb61',
          icon: 'minus-circle'
        }
        ,
        '1': {
          name: '进行中',
          value: 1,
          background: '#78bb61',
          icon: 'clock-circle'
        }
        ,
        '2': {
          name: '已完成',
          value: 2,
          background: '#5d9cec',
          icon: 'check-circle'
        }
        ,
        '3': {
          name: '已归档',
          value: 3,
          background: '#78bb61',
          icon: 'minus-circle'
        }
        ,
        '4': {
          name: '延期',
          value: 4,
          background: '#78bb61',
          icon: 'exclamation-circle'
        }
        ,
        '5': {
          name: '暂停',
          value: 5,
          background: '#78bb61',
          icon: 'pause-circle'
        }
        ,
        '6': {
          name: '延误',
          value: 6,
          background: '#78bb61',
          icon: 'exclamation-circle'
        }
      },
      loading: false,
      AreaData,
      ContractSource,
      ContractType,
      provices: [],
      cities: [],
      areas: [],
      selectProvice: '广东省', //项目地址 省
      selectCity: '汕头市', //项目地址 市
      selectArea: '龙湖区', //项目地址 区
      address: '', //项目地址 详细地址
      provices2: [],
      cities2: [],
      areas2: [],
      selectProvice2: '广东省', //委托人地址 省
      selectCity2: '汕头市', //委托人地址 市
      selectArea2: '龙湖区', //委托人地址 区
      address2: '', //委托人地址 详细地址
      // 对应字段
      BusinessType,
      contractNo: generateNo(codeRule), //合同编号
      company: null,  //所属公司
      name: '',       //合同名称
      type: '',       //合同类型
      source: '',      //合同来源
      businessType: [], //业务类型
      startDate: null,  //开始日期
      endDate: null,    //结束日期
      client: {}, //委托人
      clientChangeStatus: 0, //在修改模式下客户修改状态 0: 不变 1: 选择新客户 2: 新建新客户
      projectAddress: {}, //项目地址
      contractCount: 0, //合同份数
      contractAddress: '', //合同存在地址
      contacts: [{ name: '', phone: '', job: '', remark: '' }], //联系人
      principal: {}, //负责人
      estimatedAmount: 0, //合同预估金额
      signatory: {}, //签约人
      signDate: null,  //签约时间
      registrant: {}, //登记人
      regDate: null,    //登记时间
      calcMethod: '', //计价方式
      payMethod: '', //支付方式
      remark: '',     //合同备注
      status: 0, //状态
      sendedOut: false, //是否发出
      sendedDate: null, //发出日期
      returned: false, //是否收回
      returnedDate: null, //收回日期
      projects: [], //关联项目
      selectedProjectId: '',
      scans: [], //合同原件上传附件
      isShow: false,
      booleanFalse: true,
      visible: false,
      clientVisible: false,
      clientTitle: '选择委托方',
      employeeType: 1, //1显示员工2只显示部门
      emTitle: '添加人员',
      subType: 1,   //1 负责人 2 签约人 3 登记人,
      actionHref:'', //上传路劲,
      documents:[],
      projectTitle:'关联项目', 
      projectVisible:false,  //显示项目弹框
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  created() {
    //数据请求参数配置
    this.changeAreaData(0)
    this.changeAreaData2(0)
  },
  mounted() {
    document.removeEventListener('click', this.handleDocumentClick)
    document.addEventListener('click', this.handleDocumentClick)
    // console.log('mounted')
    
    //判断新增还是修改
    if(this.mode === 2){
      this.loadData(this.contractId)
      this.documentList(this.contractId)
      this.actionHref = `http://${location.hostname}:15050/upload?path=` + this.contractId
    }else{
      this.newId = uuid()
      this.actionHref = `http://${location.hostname}:15050/upload?path=` + this.newId
      if(this.catalog === 2){
        this.registrant = {
          id: this.userInfo.id,
          name: this.userInfo.name
        }
        this.regDate = moment()
        this.businessType = this.dataSource.businessType.split(',') //业务类型
        // 委托人地址
        this.client = this.dataSource.client
        this.form.setFieldsValue({
          // contractNo: generateNo(codeRule),
          businessType: this.dataSource.businessType,
          selectProvince: '广东省', //项目地址 省
          selectCity: '汕头市', //项目地址 市
          selectArea: '龙湖区', //项目地址 区
          address: '', //项目地址 详细地址
          client_name: this.dataSource.client.name,
          selectProvince2: this.dataSource.client.address.province, //委托人地址 省
          selectCity2: this.dataSource.client.address.city, //委托人地址 市
          selectArea2: this.dataSource.client.address.district, //委托人地址 区
          address2: this.dataSource.client.address.address
        })
      }else{
        this.form.setFieldsValue({
          // contractNo: generateNo(codeRule),
          selectProvince: '广东省', //项目地址 省
          selectCity: '汕头市', //项目地址 市
          selectArea: '龙湖区', //项目地址 区
          address: '', //项目地址 详细地址
          selectProvince2: '广东省', //委托人地址 省
          selectCity2: '汕头市', //委托人地址 市
          selectArea2: '龙湖区', //委托人地址 区
          address2: ''
        })
      }
      const _this = this
      getNo(this.$apollo, 1).then(function(result) {
        _this.form.setFieldsValue({
          contractNo: result
        })
      })
    }
  },
  methods: {
    //接口获取数据
    loadData(id) {
      const _this = this
      this.$apollo
        .query({
          query: gql`
            query {
              Contract(where: {id: {_eq: "${id}"}}) {
                id
                catalog
                contractNo
                name
                type
                source
                businessType
                startDate
                endDate
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
                projectAddress {
                  id
                  province
                  city
                  district
                  address
                }
                contacts {
                  contract_id
                  name
                  phone
                  job
                  remark
                }
                contractCount
                contractAddress
                principal {
                  id
                  name
                }
                estimatedAmount
                signatory {
                  id
                  name
                }
                signDate
                registrant {
                  id
                  name
                }
                regDate
                calcMethod
                payMethod
                remark
                status
                sendedOut
                sendedDate
                returned
                returnedDate
                projects {
                  id
                  name
                  status
                  principal {
                    id
                    name
                  }
                }
                scans {
                  id
                  name
                  url
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res, 'res')
          _this.initInfo(res.data.Contract)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStatusObject(status){
      let statusObject = {}
      for(var i = 0; i < this.statusArr.length; i++){
        if(this.statusArr[i].value === status){
          statusObject = this.statusArr[i]
          break
        }
      }
      return statusObject
    },
    initInfo(data) {
      const _data = data[0]
      console.log(_data)
      //表单字段
      this.form.setFieldsValue({
        contractNo: _data.contractNo,
        name: _data.name,
        type: _data.type||'',
        source: _data.source||'',
        client_name: _data.client.name,
        businessType: _data.businessType,
        selectProvince: _data.projectAddress.province,
        selectCity: _data.projectAddress.city,
        selectArea: _data.projectAddress.district,
        address: _data.projectAddress.address,
        selectProvince2: _data.client.address.province,
        selectCity2: _data.client.address.city,
        selectArea2: _data.client.address.district,
        address2: _data.client.address.address
      })

      //合同编号
      this.businessType = _data.businessType.split(',') //业务类型
      this.startDate = _data.startDate ? moment(_data.startDate): null
      this.endDate = _data.endDate ? moment(_data.endDate): null
      // 项目地址
      this.projectAddress =_data.projectAddress
      // 委托人地址
      this.client = _data.client
      this.contacts = _data.contacts //联系人
      this.contractCount = _data.contractCount || 0  //合同份数
      this.contractAddress = _data.contractAddress //合同存在地址
      this.principal = _data.principal || {name: ''}  //负责人
      this.estimatedAmount = _data.estimatedAmount //预估金额
      this.signatory = _data.signatory || {name: ''} //签约人
      this.signDate = _data.signDate ? moment(_data.signDate): null   //签约日期
      this.registrant = _data.registrant || {name: ''} //登记人
      this.regDate = _data.regDate ? moment(_data.regDate): null       //登记日期
      this.calcMethod = _data.calcMethod || ''  //计取方式
      this.payMethod = _data.payMethod || ''   //支付方式
      this.remark = _data.remark || ''         //备注
      this.status = _data.status         //状态
      const statusObject = this.getStatusObject(this.status)
      this.nowStatus = statusObject.name
      this.nowStatusColor = statusObject.background
      this.nowBorderColor = statusObject.border
      this.nowStatusIcon = statusObject.icon
      this.sendedOut = _data.sendedOut   //是否发出
      this.sendedDate = _data.sendedDate ? moment(_data.sendedDate): null  //发出日期
      this.returned = _data.returned      //是否收回
      this.returnedDate = _data.returnedDate ? moment(_data.returnedDate): null //收回日期
      this.projects = _data.projects || [] //关联合同
      this.scans = _data.scans         //合同扫描件
    },
    //添加联系人
    addContact() {
      if(this.mode === 2){ //修改模式
        this.contacts.push({ contract_id: this.contractId, name: '', phone: '', job: '', remark: '' })
      }else{
        this.contacts.push({ name: '', phone: '', job: '', remark: '' })
      }
    },
    //删除联系人
    delContact(index) {
      if(index > 0){
        this.contacts.splice(index, 1)
      }
    },
    //保存
    saveContract(formData, data) {
      const _this = data
      let _client = ''
      let _update = ''
      let _parent = ''
      const validField = (d) => {
        if(d){
          if(d instanceof moment){
            return `"${moment(d).format('YYYY-MM-DD HH:mm:ss')}"`
          }else{
            return `"${d}"`
          }
        }else{
          return `null`
        }
      }
      // 保存
      let _gql = ``
      if(_this.mode === 2){
        let id = ''
        switch (_this.clientChangeStatus){
          case 1: //选择新客户
            _client = `client_id: "${data.client.id}"`
            _update = `
              update_Address2: update_Address(where: {id: {_eq: "${data.client.address.id}"}}, _set: {
                province: "${formData.selectProvince2}"
                city: "${formData.selectCity2}"
                district: "${formData.selectArea2}"
                address: "${formData.address2}"
              }){
                returning {
                  id
                }
              }
            `
            break
          case 2: //新建客户
            id = uuid()
            _client = `client_id: "${id}"`
            _update = `
              insert_Client(objects: {
                id: "${id}"
                name: "${formData.client_name}"
                address: {
                  data: {
                    province: "${formData.selectProvince2}"
                    city: "${formData.selectCity2}"
                    district: "${formData.selectArea2}"
                    address: "${formData.address2}"
                  }
                }
              }){
                returning {
                  id
                }
              }
            `
            break
        }
        _gql = gql`
          mutation {
            update_Contract (where: {id: {_eq: "${_this.contractId}"}}, _set: {
              name: "${formData.name}"
              type: "${formData.type || ''}"
              source: "${formData.source || ''}"
              businessType: "${formData.businessType}"
              startDate: ${validField(data.startDate)}
              endDate: ${validField(data.endDate)}
              contractCount: ${data.contractCount || 0}
              contractAddress: "${data.contractAddress}"
              principal_id: ${validField(data.principal.id)}
              estimatedAmount: ${data.estimatedAmount}
              ${_client}
              signatory_id: ${validField(data.signatory.id)}
              signDate: ${validField(data.signDate)}
              registrant_id: ${validField(data.registrant.id)}
              regDate: ${validField(data.regDate)}
              calcMethod: "${data.calcMethod}"
              payMethod: "${data.payMethod}"
              remark: "${data.remark}"
              status: ${data.status}
              sendedOut: ${data.sendedOut}
              sendedDate: ${validField(data.sendedDate)}
              returned: ${data.returned}
              returnedDate: ${validField(data.returnedDate)}
              updatedBy_id: "${_this.userInfo.id}"
              updatedAt: "${moment().format('YYYY-MM-DD HH:mm:ss')}"
            }){
              returning{
                id
              }
            }

            delete_Contact (where: {contract_id: {_eq: "${_this.contractId}"}}){
              returning {
                id
              }
            }

            insert_Contact(objects: ${ArrayToString(_this.contacts)}){
              returning {
                id
              }
            }

            update_Address (where: {id: {_eq: "${_this.projectAddress.id}"}}, _set: {
              province: "${formData.selectProvince}"
              city: "${formData.selectCity}"
              district: "${formData.selectArea}"
              address: "${formData.address}"
            }){
              returning {
                id
              }
            }

            ${_update}
          }
          `
      }else{
        _parent = this.catalog === 2 ? `parent_id:"${this.contractId}"`:``
        if(data.client.id){
          _client = `client_id: "${data.client.id}"`
          _update = `
            update_Address(where: {id: {_eq: "${data.client.address.id}"}}, _set: {
              province: "${formData.selectProvince2}"
              city: "${formData.selectCity2}"
              district: "${formData.selectArea2}"
              address: "${formData.address2}"
            }){
              returning {
                id
              }
            }
          `
        }else{
          _client = `
            client: {
              data: {
                name:"${formData.client_name}"
                  address: {
                    data: {
                      province: "${formData.selectProvince2}"
                      city: "${formData.selectCity2}"
                      district: "${formData.selectArea2}"
                      address: "${formData.address2}"
                    }
                  }
              }
            }`
          _update = ``
        }
        _gql = gql`
          mutation {
            insert_Contract (objects: {
              id:"${_this.newId}"
              catalog: ${_this.catalog}
              ${_parent}
              company_id: "2c8356b2-a6a9-46d9-ad5b-f02337a5f53c"
              contractNo: "${formData.contractNo}"
              name: "${formData.name}"
              type: "${formData.type || ''}"
              source: "${formData.source || ''}"
              businessType: "${formData.businessType}"
              startDate: ${validField(data.startDate)}
              endDate: ${validField(data.endDate)}
              ${_client}
              projectAddress: {
                data: {
                      province: "${formData.selectProvince}"
                      city: "${formData.selectCity}"
                      district: "${formData.selectArea}"
                      address: "${formData.address}"
                }
              }
              contacts: {
                data: ${ArrayToString(data.contacts)}
              }
              contractCount: ${data.contractCount || 0}
              contractAddress: "${data.contractAddress}"
              principal_id: ${validField(data.principal.id)}
              estimatedAmount: ${data.estimatedAmount}
              signatory_id: ${validField(data.signatory.id)}
              signDate: ${validField(data.signDate)}
              registrant_id: ${validField(data.registrant.id)}
              regDate: ${validField(data.regDate)}
              calcMethod: "${data.calcMethod}"
              payMethod: "${data.payMethod}"
              remark: "${data.remark}"
              status: ${data.status}
              sendedOut: ${data.sendedOut}
              sendedDate: ${validField(data.sendedDate)}
              returned: ${data.returned}
              returnedDate: ${validField(data.returnedDate)}
              createdBy_id: "${_this.userInfo.id}"
              updatedBy_id: "${_this.userInfo.id}"
            }){
              returning{
                id
              }
            }

            ${_update}
          }
          `
      }

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
    validateFunction () {
      const _this = this
      return (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values, _this)
          _this.saveContract(values, _this)
        }else{
          for(const key in err){
            document.getElementById(key).focus()
            break
          }
        }
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(this.validateFunction())
    },
    //显示项目状态列表
    showStatusList() {
      this.statusListShow = true
    },
    //点击列表并隐藏
    StatusListClick(record) {
      this.status = record.value
      this.nowStatus = record.name
      this.nowStatusColor = record.background
      this.nowBorderColor = record.border
      this.nowStatusIcon = record.icon
      this.statusListShow = false
    },
    //显示人员或部门弹框
    //subType: 1 负责人 2 签约人 3 登记人
    showEModal(type, subType) {
      this.employeeType = type
      this.subType = subType
      this.visible = true
      switch (subType) {
        case 1:
          this.emTitle = '选择负责人'
          break
        case 2:
          this.emTitle = '选择签约人'
          break
        case 3:
          this.emTitle = '选择登记人'
          break
      }
    },
    //人员/部门弹框状态改变
    changeEMStatus(obj) {
      console.log(obj)
      this.visible = obj.visibled
      if (!obj.data.length) {
        return
      }
      switch (this.subType) {
        case 1:
          this.principal.id = obj.data[0].key
          this.principal.name = obj.data[0].title
          break
        case 2:
          this.signatory.id = obj.data[0].key
          this.signatory.name = obj.data[0].title
          break
        case 3:
          this.registrant.id = obj.data[0].key
          this.registrant.name = obj.data[0].title
          break
      }
    },
    //监视客户名称改变
    clientBlur(e) {
      if(this.mode === 2){
        console.log(e)
        const _this = this
        this.$apollo
          .query({
            query: gql`
            query {
              Client (where: {name: {_eq: "${e.target.value}"}}){
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
            }
          `,
            fetchPolicy: 'network-only'
          })
          .then(res => {
            console.log(res, 'res')
            if(res.data.Client.length > 0){
              _this.clientChangeStatus = _this.client.id === res.data.Client[0].id ? 0: 1
              _this.client = res.data.Client[0]
              _this.form.setFieldsValue({
                client_name: res.data.Client[0].name,
                selectProvice2: res.data.Client[0].address.province,
                selectCity2: res.data.Client[0].address.city,
                selectArea2: res.data.Client[0].address.district,
                address2: res.data.Client[0].address.address
              })
            }else{
              _this.clientChangeStatus = 2
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    //显示委托人弹框
    showClientDialog() {
      this.clientVisible = true
    },
    //委托人弹框状态改变
    changeClStatus(obj) {
      console.log(obj, 'change client!')
      this.clientVisible = obj.visibled

      if (obj.data) {
        this.clientChangeStatus = this.client.id === obj.data[0].id ? 0: 1
        this.client = obj.data[0]
        this.form.setFieldsValue({
          client_name: obj.data[0].name,
          selectProvice2: obj.data[0].address.province,
          selectCity2: obj.data[0].address.city,
          selectArea2: obj.data[0].address.district,
          address2: obj.data[0].address.address
        })
      }
    },
    //显示业务类型
    //业务类型的显示和隐藏
    handleDocumentClick(e) {
      if (!this.$refs.busDiv) {
        return
      }
      if (!this.$refs.busDiv.$el) {
        return
      }
      if (!this.$refs.busDiv.$el.contains(e.target)) {
        this.isShow = false
      }
      if (this.$refs.statusDiv) {
        this.statusListShow = false
      }
    },
    //显示业务类型
    showBusItem() {
      this.isShow = true
    },
    //业务类型多选函数
    busItemChange(checkedValues) {
      this.businessType = checkedValues
      this.form.setFieldsValue({businessType: checkedValues.join(',')})
    },
    //项目地址
    changeAreaData(type, val) {
      console.log(type)
      this.provices = []
      this.cities = []
      this.areas = []
      const _this = this
      this.AreaData.forEach(ele => {
        _this.provices.push(ele.name)
        const _province = type === 1 ? val: _this.form.getFieldValue('selectProvince') || '广东省'
        if (ele.name === _province) {
          if (type === 1) {
            // this.selectCity = ele.city[0].name
            _this.form.setFieldsValue({ selectCity: ele.city[0].name })
          }
          const _city = type === 1 && ele.city.length > 0 ? ele.city[0].name: val
          ele.city.forEach(cele => {
            _this.cities.push(cele.name)
            if (cele.name === _city) {
              if (type === 1 || type === 2) {
                // this.selectArea = cele.area[0]
                _this.form.setFieldsValue({ selectArea: cele.area[0] })
              }
              cele.area.forEach(aele => {
                _this.areas.push(aele)
              })
            }
          })
        }
      })
    },
    //委托方地址
    changeAreaData2(type, val) {
      console.log(type)
      this.provices2 = []
      this.cities2 = []
      this.areas2 = []
      const _this = this
      this.AreaData.forEach(ele => {
        _this.provices2.push(ele.name)
        const _province = type === 1 ? val: _this.form.getFieldValue('selectProvince2') || '广东省'
        if (ele.name === _province) {
          if (type === 1) {
            // _this.selectCity2 = ele.city[0].name
            _this.form.setFieldsValue({ selectCity2: ele.city[0].name })
          }
          const _city = type === 1 && ele.city.length > 0 ? ele.city[0].name: val
          ele.city.forEach(cele => {
            _this.cities2.push(cele.name)
            if (cele.name === _city) {
              if (type === 1 || type === 2) {
                // _this.selectArea2 = cele.area[0]
                _this.form.setFieldsValue({ selectArea2: cele.area[0] })
              }
              cele.area.forEach(aele => {
                _this.areas2.push(aele)
              })
            }
          })
        }
      })
    },
    //上传合同扫描件
    uploadScan(){

    },
    //取消
    CreateCancal() {
      this.reload()
    },
    //跳转到项目详细页
    goProjectDetail(item) {
      // alert('项目详情：' + id)
      // this.$router.push({ path:`/project?projectId=${id}`})
      let routeData = this.$router.resolve({
        name: "project",
        query:{projectId:item.id,name:item.name}
      });
      console.log(routeData.href)
      window.open(routeData.href, '_blank');
      // console.log(this.$router.go('/project'))
    },
    //取消项目关联
    async unbindProject(id) {
      // alert('取消关联：' + id)
      let _this = this
      this.$confirm({
        title: '删除关联项目',
        content: `你确定删除关联项目？`,
        async onOk() {
          var mutationString = `
            mutation{
              update_Project(where:{id:{_eq:"${id}"}},_set:{
                contract_id:null
              }){returning {id}}
            }
          `
          var res = await _this.dbConn.mutation(mutationString)
          _this.projectList()
          // console.log(res)
          
        },
        onCancel() {}
      })
      

      
    },
    projectMouseOver(id){
      // alert(id)
      this.selectedProjectId = id
    },
    projectMouseOut(){
      // alert(id)
      this.selectedProjectId = ''
    },

    //获取关联项目列表
    async projectList(){
      let _this = this
      var queryString = `query {
        Project(where:{contract_id:{_eq:"${_this.mode == 2? _this.contractId : _this.newId}"}}){
          id
          name
          status
          principal {
            id
            name
          }
        }
      }`
      var res2 = await _this.dbConn.query(queryString)
      // console.log(res2,queryString)
      _this.projects = res2.data.Project

    },


    showProjectList(){
      this.projectVisible = true
    },
    //关联合同
    async changePLStatus(obj) {
      console.log(obj)
      this.projectVisible = false
      if((obj.data||[]).length){
        
        var updateString = ``
        obj.data.forEach((ele,index) => {
          updateString += 
          `update_project${index}:update_Project(where:{id:{_eq:"${ele.id}"}},_set:{
              contract_id:"${this.mode == 2? this.contractId : this.newId}"
          }){returning {id}}`
        })
        var mutationString = `mutation{${updateString}}`

        var res = await this.dbConn.mutation(mutationString)
        this.projectList()
      }
    },
     //上传文件
    async handleChange(info) {
      let _this = this
      if (info.file.status == 'uploading') {
        //上传中
        console.log(info.file.name, 'uploading')
      }
      if (info.file.status == 'done') {
        //上传完成
        this.$message.success(`${info.file.name}上传完成`)
        console.log(info.file.name, 'done')
        var mutationString = `mutation {
          insert_Document(objects:[{
              url:"${this.mode == 2? this.contractId : this.newId}/",
              name: "${info.file.name}", 
              property:1,#文件属性 0:目录 1:文件
              type:0, #文件类型 0:合同文档 1:项目文档 2:公司文档 3:个人文档
              relatedId:"${this.mode == 2? this.contractId : this.newId}",
              projectFileType:0 #项目文件类型 0:项目资料 1:过程文件 2:成果文件
              fileSize:${info.file.size},
              parent_id:"${this.mode == 2? this.contractId : this.newId}",
              isLocked:false,
              createdBy_id:"${this.userInfo.id}"
            }]){returning{id}}
        }`
        let res = await this.dbConn.mutation(mutationString)
        this.documentList(this.mode == 2? this.contractId : this.newId)
      }
      if (info.file.status == 'error') {
        //失败
        this.$message.success(`${info.file.name}上传失败`)
      }
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
    async documentList(id){
      var queryString = `query {
        Document(where:{relatedId:{_eq:"${id}"},type:{_eq:0},}){
          name
          id
          url
        }
      }`
      let res = await this.dbConn.query(queryString)
      this.documents = res.data.Document
      // console.log(res,queryString,'Document_____')
    },

    async deleteDocument(id){
      var mutationString = `mutation {
        delete_Document(where:{id:{_eq:"${id}"}}){returning{id}}
      }`
      let res = await this.dbConn.mutation(mutationString)
      this.documentList(this.mode == 2? this.contractId : this.newId)
    }
  },
  watch: {}
}
</script>

<style>
.ant-form-item-required:before {
  display: inline-block;
  margin-right: 4px;
  content: '*';
  font-family: SimSun;
  line-height: 1;
  font-size: 14px;
  color: #f5222d;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ant-tabs-extra-content {
  line-height: 55px;
}

.divItem {
  padding: 10px 0;
}
table td {
  padding: 4px 0px;
}
table th {
  padding: 4px 0px;
  text-align: right;
}
.borderBottom {
  border-bottom: 1px solid #e8e8e8;
  margin-right: 20px;
}
.sameWidth {
  width: 260px;
}
.th-right {
  text-align: right;
}
.th-top {
  /* text-align: top !important; */
  padding-top: 9px !important;
  vertical-align: top;
}
.label-title {
  margin: 30px 0 10px 0;
  color: #555;
}
.contractInfo .bussT {
  position: absolute;
  width: 100%;
  z-index: 2;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 2px;
}
div.project-complete {
  background-color: #5d9cec;
}
.select-box {
  padding: 5px;
  border-radius: 2px;
}
div.project-complete .select-content {
  /*border-color: #8bb8f1;*/
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
  width: 237px;
  background: inherit;
  z-index: 2;
}

.new-project_item .project-name {
  float: left;
  display: inline;
  color: #555;
  margin-right: 5px;
  line-height: 26px;
  margin-right: 20px;
  font-size: 12px;
  vertical-align: top;
  overflow: hidden;
  width: 230px;
}
.contract-right_item .new-project_item .project-name i {
  margin-right: 5px;
}
.new-project_item {
  margin: 10px 0 50px 0;
  color: #ababab;
  padding-left: 0px;
  list-style-type: none;
  list-style-image: none;
  font-size: 12px
}
.new-project_item li:after {
  content: "";
  display: table;
  height: 0;
}
.new-project_item .project-name em {
  font-style: normal;
  max-width: 10em;
  vertical-align: -9px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.new-project_item .project-opt {
  float: left;
  display: inline;
  /*display: none;*/
  height: 26px;
  line-height: 26px;
}
.ant-form-item {
  margin-bottom: 0px;
}
a, a:visited {
  text-decoration: none;
  /* color: #555555; */
  background-color: transparent;
}
a:focus {
  text-decoration: none;
  color: #5b76c9;
}
</style>
