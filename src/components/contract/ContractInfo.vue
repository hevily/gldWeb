<template>
  <div>
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
                  <a-input type="text" class="sameWidth" placeholder="合同编号为系统自动生成" maxlength="90"/>
                </td>
                <th width="120" class="th-right">
                  <!-- <i class="iconfont font-red"></i>所属公司： -->
                  <label title="所属公司" class="ant-form-item-required">所属公司：</label>
                </th>
                <td>
                  <a-select defaultValue="lucy" class="sameWidth">
                    <a-select-option value="lucy">广东恒正工程造价咨询有限公司预算部</a-select-option>
                    <a-select-option value="lucy">广东恒正工程造价咨询有限公司预算部</a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="合同名称" class="ant-form-item-required">合同名称：</label>
                </th>
                <td width="750" colspan="3">
                  <a-input type="text" placeholder="合同名称为必填项目" maxlength="200"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">合同类型：</th>
                <td width="390">
                  <a-select defaultValue="lucy" class="sameWidth">
                    <a-select-option value="lucy">造价咨询服务合同</a-select-option>
                    <a-select-option value="lucy">招标代理服务合同</a-select-option>
                  </a-select>
                </td>
                <th width="100" class="th-right">合同来源：</th>
                <td width="260">
                  <a-select defaultValue="1" class="sameWidth">
                    <a-select-option value="1">业主直接委托</a-select-option>
                    <a-select-option value="2">招标</a-select-option>
                    <a-select-option value="3">法院委托</a-select-option>
                    <a-select-option value="4">其他委托</a-select-option>
                    <a-select-option value="6">政府采购合同</a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <!-- <i class="iconfont font-red"></i>业务类型： -->
                  <label title="业务类型" class="ant-form-item-required">业务类型：</label>
                </th>
                <td width="750" colspan="3" class="select-sp" id="select1">
                  <div class="ui-input2 ui-w715" id="BusinesstypeShow">1232</div>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">开始日期：</th>
                <td width="390">
                  <a-date-picker class="sameWidth"/>
                </td>
                <th width="100" class="th-right">截止日期：</th>
                <td width="260">
                  <a-date-picker class="sameWidth"/>
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
                  <a-input
                    type="text"
                    placeholder="合同名称为必填项目"
                    maxlength="200"
                    style="width: 680px;margin-right: 5px;"
                  />
                  <a-button type="primary">选择</a-button>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="委托方地址">委托方地址：</label>
                </th>
                <td width="750" colspan="3">
                  <a-select
                    :defaultValue="provinceData[0]"
                    style="width: 120px;margin-right:5px"
                    @change="handleProvinceChange"
                  >
                    <a-select-option v-for="province in provinceData" :key="province">{{ province }}</a-select-option>
                  </a-select>
                  <a-select v-model="secondCity" style="width: 120px;margin-right:5px">
                    <a-select-option v-for="city in cities" :key="city">{{ city }}</a-select-option>
                  </a-select>
                  <a-select v-model="secondCity" style="width: 120px;margin-right:5px">
                    <a-select-option v-for="area in areas" :key="area">{{ area }}</a-select-option>
                  </a-select>
                  <a-input type="text" placeholder="输入详细地址" style="width: 375px"/>
                </td>
              </tr>

              <tr>
                <th width="120" class="th-right">
                  <label title="项目地址">委托方地址：</label>
                </th>
                <td width="750" colspan="3">
                  <a-select
                    :defaultValue="provinceData[0]"
                    style="width: 120px;margin-right:5px"
                    @change="handleProvinceChange"
                  >
                    <a-select-option v-for="province in provinceData" :key="province">{{ province }}</a-select-option>
                  </a-select>
                  <a-select v-model="secondCity" style="width: 120px;margin-right:5px">
                    <a-select-option v-for="city in cities" :key="city">{{ city }}</a-select-option>
                  </a-select>
                  <a-select v-model="secondCity" style="width: 120px;margin-right:5px">
                    <a-select-option v-for="area in areas" :key="area">{{ area }}</a-select-option>
                  </a-select>
                  <a-input type="text" placeholder="输入详细地址" style="width: 375px"/>
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
                  <a-input type="text" class="sameWidth" placeholder="合同份数" maxlength="90"/>
                </td>
                <th width="120" class="th-right">
                  <!-- <i class="iconfont font-red"></i>所属公司： -->
                  <label title="合同存放地址">所属公司：</label>
                </th>
                <td>
                  <a-input type="text" class="sameWidth" placeholder maxlength="90"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">负责人：</th>
                <td width="260">
                  <a-input
                    type="text"
                    class="sameWidth"
                    placeholder="点击选择人员"
                    readonly
                    @click="openUploadModal"
                  />
                </td>
                <th width="100" class="th-right">合同预估金额：</th>
                <td width="260">
                  <a-input type="text" class="sameWidth" placeholder="合同预估金额"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">签约人：</th>
                <td width="260">
                  <a-input
                    type="text"
                    class="sameWidth"
                    placeholder="点击选择人员"
                    readonly
                    @click="openUploadModal"
                  />
                </td>
                <th width="100" class="th-right">签约时间：</th>
                <td width="260">
                  <a-date-picker class="sameWidth"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">登记人：</th>
                <td width="260">
                  <a-input
                    type="text"
                    class="sameWidth"
                    placeholder="点击选择人员"
                    readonly
                    @click="openUploadModal"
                  />
                </td>
                <th width="100" class="th-right">登记时间：</th>
                <td width="260">
                  <a-date-picker class="sameWidth"/>
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
          <div></div>
          <div>
            <a-checkbox class="label-title">纸质合同已送出</a-checkbox>
            <div>
              <label title="送出时间">送出时间：</label>
              <a-date-picker/>
            </div>
          </div>
          <div>
            <a-checkbox class="label-title">纸质合同已收回</a-checkbox>
            <div>
              <label title="收回时间">收回时间：</label>
              <a-date-picker/>
            </div>
          </div>
        </div>
        <div class="divItem">
          <div class="label-title">合同原件：</div>
          <a-button icon="upload" @click="openUploadModal">上传原件</a-button>
        </div>
      </a-col>
    </a-row>

    <!-- 人员弹框 -->
    <employee-tree inititle="添加人员" :inivisible="visible" ref="employeeTree"/>
  </div>
</template>

<script>
import { getServiceList } from '@/api/manage'

import employeeTree from '@/components/same/employeeTree'

const provinceData = ['Zhejiang', 'Jiangsu']
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']
}

export default {
  name: 'ContractInfo',
  props: {
    type: {
      type: String,
      default: '1'
    },
    dataSource: {
      type: Object,
      default: function (value) {
        return { value }
      }
    }
  },
  components: {
    employeeTree
  },
  data() {
    return {
      loading: false,
      provinceData,
      cityData,
      areas: cityData[provinceData[0]],
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
      booleanFalse: true,
      visible: false,
      data: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res, 'res')
          return res.result
        })
      }
    }
  },
  created() {
    //数据请求参数配置
  },
  methods: {
    //接口获取数据
    loadData() {},
    handleProvinceChange(value) {
      this.cities = cityData[value]
      this.secondCity = cityData[value][0]
    },

    openUploadModal() {
      console.log(this.$refs,'d',this.dataSource)
      this.$refs.employeeTree.showModal()
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
</style>
