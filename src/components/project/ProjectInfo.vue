<template>
  <div class="projectInfo">
    <a-row style="min-width: 1190px;">
      <!-- 左边 -->
      <a-col :span="24">
        <!-- 第一段 -->
        <div class="divItem borderBottom">
          <table class="form-table table-layout" width="870" cellspacing="0" border="0">
            <tbody>
              <tr>
                <th width="120" class="th-right">
                  <label title="业务类型" class="ant-form-item-required">业务类型：</label>
                </th>
                <td width="750" colspan="3" style="position:relative">
                  <a-input
                    type="text"
                    placeholder
                    readonly
                    maxlength="200"
                    @click="showBusItem"
                    :value="businessType.join(',')"
                  />
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
                    <!-- <a-col :span="8">2</a-col>
                    <a-col :span="8">3</a-col>-->
                  </a-row>
                </td>
              </tr>
              <tr>
                <th width="100" class="th-right">
                  <label title="项目编号" class="ant-form-item-required">项目编号：</label>
                </th>
                <td width="260">
                  <a-input type="text" class="sameWidth" v-model="projectNo" placeholder="请选择关联合同或业务类型，编号自动生成"/>
                </td>
                <th width="130" class="th-right">关联合同：</th>
                <td width="360">
                  <a-input
                    type="text"
                    class="sameWidth"
                    style="width: 360px;"
                    placeholder
                    readonly="readonly"
                  />
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="项目名称" class="ant-form-item-required">项目名称：</label>
                </th>
                <td width="750" colspan="3">
                  <a-input type="text" v-model="name" placeholder="项目名称为必填项目" maxlength="200"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">
                  <label title="项目地址">项目地址：</label>
                </th>
                <td width="750" colspan="3">
                  <a-select
                    v-model="selectProvice"
                    style="width: 120px;margin-right:5px"
                    @change="changeAreaData(1)"
                  >
                    <a-select-option
                      v-for="province in provices"
                      :key="province"
                      :value="province"
                    >{{ province }}</a-select-option>
                  </a-select>
                  <a-select
                    v-model="selectCity"
                    style="width: 120px;margin-right:5px"
                    @change="changeAreaData(2)"
                  >
                    <a-select-option v-for="city in cities" :key="city" :value="city">{{ city }}</a-select-option>
                  </a-select>
                  <a-select v-model="selectArea" style="width: 120px;margin-right:5px">
                    <a-select-option v-for="area in areas" :key="area" :value="area">{{ area }}</a-select-option>
                  </a-select>
                  <a-input type="text" placeholder="输入详细地址" v-model="address" style="width: 375px"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">工程类型：</th>
                <td width="260">
                  <!-- <a-date-picker class="sameWidth"/> -->
                  <a-select class="sameWidth" v-model="engineeringType">
                    <a-select-option
                      v-for="(item,index) in engineeringTypeArr"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                </td>
                <th width="100" class="th-right">结构类型：</th>
                <td width="360">
                  <a-select class="sameWidth" v-model="structureType" style="width: 360px;">
                    <a-select-option
                      v-for="(item,index) in struType"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                  <!-- <a-date-picker class="sameWidth"/> -->
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">项目类型：</th>
                <td width="260">
                  <a-input type="text" v-model="projectType"/>
                  <!-- <a-date-picker class="sameWidth"/> -->
                  <!-- <a-select class="sameWidth" :value="projectType[0]">
                    <a-select-option
                      v-for="(item,index) in projectType"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>-->
                </td>
                <th width="120" class="th-right">工程规模：</th>
                <td width="260">
                  <a-input
                    type="text"
                    placeholder
                    v-model="projectScale"
                    maxlength="200"
                    style="width: 255px;margin-right:5px"
                  />
                  <a-select style="width: 100px;" v-model="projectScaleUnit">
                    <a-select-option
                      v-for="(item,index) in measurArr"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">项目经理：</th>
                <td width="260">
                  <!-- <a-date-picker class="sameWidth"/> -->
                  <a-input type="text" placeholder readonly maxlength="200" @click="showEModal(1)"/>
                </td>
                <th width="120" class="th-right">项目归属部门：</th>
                <td width="260">
                  <a-input type="text" placeholder readonly maxlength="200" @click="showEModal(2)"/>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right">项目资金来源：</th>
                <td width="260">
                  <!-- <a-date-picker class="sameWidth"/> -->
                  <a-select style="width:130px;margin-right: 10px;" v-model="moneySource">
                    <a-select-option
                      v-for="(item,index) in moneySourceArr"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                </td>
                <th width="120" class="th-right">预估咨询费：</th>
                <td width="260">
                  <a-input
                    type="text"
                    placeholder
                    maxlength="200"
                    style="width: 255px;margin-right:5px"
                  />元
                </td>
              </tr>
              <tr>
                <th width="120" class="th-top">项目概况：</th>
                <td width="750" colspan="3">
                  <a-textarea
                    rows="54"
                    placeholder="最多1000字"
                    maxlength="1000"
                    style="height: 100px;"
                  ></a-textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 第二段 -->
        <div class="divItem">
          <table class="form-table table-layout" width="870" cellspacing="0" border="0">
            <tbody>
              <tr>
                <th width="120" class="th-right">
                  <label title="委托人" class="ant-form-item-required">委托人：</label>
                </th>
                <td width="750" colspan="3">
                  <a-input
                    type="text"
                    placeholder="委托人为必填项目"
                    maxlength="200"
                    style="width: 680px;margin-right: 5px;"
                  />
                  <a-button type="primary">选择</a-button>
                </td>
              </tr>

              <tr>
                <th width="120" class="th-right">
                  <label title="项目地址">委托方地址：</label>
                </th>
                <td width="750" colspan="3">
                  <a-select
                    v-model="selectProvice2"
                    style="width: 120px;margin-right:5px"
                    @change="changeAreaData2(1)"
                  >
                    <a-select-option
                      v-for="province in provices2"
                      :key="province"
                      :value="province"
                    >{{ province }}</a-select-option>
                  </a-select>
                  <a-select
                    v-model="selectCity2"
                    style="width: 120px;margin-right:5px"
                    @change="changeAreaData2(2)"
                  >
                    <a-select-option v-for="city in cities2" :key="city" :value="city">{{ city }}</a-select-option>
                  </a-select>
                  <a-select v-model="selectArea2" style="width: 120px;margin-right:5px">
                    <a-select-option v-for="area in areas2" :key="area" :value="area">{{ area }}</a-select-option>
                  </a-select>
                  <a-input type="text" placeholder="输入详细地址" style="width: 375px"/>
                </td>
              </tr>
              <tr v-for="(it,i) in organizations" :key="i">
                <th width="120" class="th-right">
                  <label title="项目地址">参与单位{{ i+1 }}：</label>
                </th>
                <td>
                  <a-select style="width:130px;margin-right: 10px;" v-model="it.type">
                    <a-select-option
                      v-for="(item,index) in deparArr"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                  <a-input
                    type="text"
                    style="width: 580px;margin-right: 10px;"
                    placeholder
                    class="sameWidth"
                    v-model="it.name"
                  />
                  <a-icon type="delete" style="cursor:pointer" @click="DelOrganizations(i)"></a-icon>
                </td>
              </tr>
              <tr>
                <th width="120" class="th-right"></th>
                <td>
                  <a @click="addOrganizations">
                    <a-icon type="plus"></a-icon>添加参与单位
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="text-align:center">
            <a-button type="primary" style="margin-right:10px">保存</a-button>
            <a-button type="default">取消</a-button>
          </div>
        </div>
        <!-- 第三段 -->
        <!-- 第四段 -->
      </a-col>
      <!-- 右边 -->
    </a-row>

    <!-- 人员弹框 -->
    <employee-tree
      :inititle="emTitle"
      :inivisible="visible"
      :type="employeeType"
      @changeStatus="changeEMStatus"
    />
  </div>
</template>

<script>
import { getServiceList } from '@/api/manage'

import employeeTree from '@/components/same/employeeTree'
import { AreaData } from '@/components/same/area'

var deparArr = ['施工单位', '监理单位', '编制单位', '项目业主', '设计单位', '咨询单位', '代建单位', '其他']
var moneySourceArr = ['内资项目', '外资项目', '港资项目', '其它']
var measurArr = ['平方米', '立方米', '公里', '米', '公斤', '吨', '工日', '其他']
var engineeringTypeArr = [
  '房屋建筑工程',
  '市政公用工程',
  '公路工程',
  '铁路工程',
  '水利水电工程',
  '通信工程',
  '化工石油工程',
  '电力工程',
  '农林工程',
  '冶炼工程',
  '机电安装工程',
  '港口与航道工程',
  '航天航空工程',
  '其他'
]
var struType = [
  '网架结构',
  '拱式结构',
  '膜结构',
  '砖混结构',
  '框架结构',
  '剪力墙结构',
  '框架-剪力墙结构',
  '筒体结构',
  '钢结构',
  '排架结构',
  '砖木结构',
  '轻钢结构',
  '重钢结构',
  '全现浇结构'
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

// const provinceData = ['Zhejiang', 'Jiangsu']
// const cityData = {
//   Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
//   Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']
// }

export default {
  name: 'ContractInfo',
  props: {
    type: {
      type: String,
      default: '1'
    },
    dataSource: {
      type: Object,
      default: function(value) {
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
      AreaData,

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
      selectArea2: '龙湖区',  //委托人地址 区
      address2: '', //委托人地址 详细地址
      // provinceData,
      engineeringTypeArr,
      struType,
      deparArr,
      moneySourceArr,
      measurArr,
      BusinessType,

      businessType: [], //业务类型
      projectNo: '', //项目编号
      name: '', //项目名称
      shortName: '', //项目简称
      engineeringType: '房屋建筑工程', //工程类型
      structureType: '', //结构类型
      projectType: '', //项目类型
      projectScale: '', //工程规模
      projectScaleUnit: '平方米', //工程规模计量单位
      principal: '', //项目经理
      moneySource: '其它', //项目资金来源
      status: 0, //项目状态
      commission: 0, //项目提成比例
      organizations: [{type:'施工单位',name:''}], //参与单位
      organizationsType:'施工单位',
      organizationsName:'',
      remark:'', //备注
    

      isShow: false,
      booleanFalse: true,
      visible: false,
      employeeType: 1, //1显示员工2只显示部门
      emTitle: '添加人员',

      data: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res, 'res')
          return res.result
        })
      },
      // depart: [{ value: 1, dd: 2 }]
    }
  },
  created() {
    //数据请求参数配置

    this.changeAreaData(0)
    this.changeAreaData2(0)
    // console.log('1====================================================')
    // console.log(this.AreaData,'area-------------------')
  },

  mounted() {
    document.addEventListener('click', this.handleDocumentClick)
    // document.addEventListener('touchstart', this.handleDocumentClick)
  },
  methods: {
    //接口获取数据
    loadData() {},

    //人员/部门弹框状态改变
    changeEMStatus(visible) {
      this.visible = visible
    },
    //显示人员或部门弹框
    showEModal(type) {
      this.employeeType = type
      this.visible = true
      if (type == 1) {
        this.emTitle = '添加人员'
      } else {
        this.emTitle = '选择项目归属部门'
      }
    },

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
    },

    showBusItem() {
      this.isShow = true
    },

    busItemChange(checkedValues) {
      this.businessType = checkedValues
      // this.businessType.
      // console.log(checkedValues)
    },
    // handleProvinceChange(value) {
    //   this.cities = cityData[value]
    //   this.secondCity = cityData[value][0]
    // },

    // openUploadModal() {
    //   console.log(this.$refs, 'd', this.dataSource)
    //   this.$refs.employeeTree.showModal()
    // },

    addOrganizations() {
      this.organizations.push({ type: '施工单位', name: '' })
    },
    DelOrganizations(index) {
      this.organizations.splice(index,1)
    },
    //项目地址
    changeAreaData(type) {
      console.log(type)
      this.provices = []
      this.cities = []
      this.areas = []
      this.AreaData.forEach(ele => {
        this.provices.push(ele.name)
        if (ele.name == this.selectProvice) {
          if (type == 1) {
            this.selectCity = ele.city[0].name
          }
          ele.city.forEach(cele => {
            this.cities.push(cele.name)
            if (cele.name == this.selectCity) {
              if (type == 1 || type == 2) {
                this.selectArea = cele.area[0]
              }
              cele.area.forEach(aele => {
                this.areas.push(aele)
              })
            }
          })
        }
      })
    },
    //委托方地址
    changeAreaData2(type) {
      console.log(type)
      this.provices2 = []
      this.cities2 = []
      this.areas2 = []
      this.AreaData.forEach(ele => {
        this.provices2.push(ele.name)
        if (ele.name == this.selectProvice2) {
          if (type == 1) {
            this.selectCity2 = ele.city[0].name
          }
          ele.city.forEach(cele => {
            this.cities2.push(cele.name)
            if (cele.name == this.selectCity2) {
              if (type == 1 || type == 2) {
                this.selectArea2 = cele.area[0]
              }
              cele.area.forEach(aele => {
                this.areas2.push(aele)
              })
            }
          })
        }
      })
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
.projectInfo .bussT {
  position: absolute;
  width: 100%;
  z-index: 2;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 2px;
}
</style>
