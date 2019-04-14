<template>
  <div>
    <a-modal
      :visible="visibled"
      @cancel="cancel"
      :footer="null"
      :width="800"
      class="projectMoneyDialog"
    >
      <div slot="title" class="slot-title">
        <a-icon type="calculator"/>
        {{title}}
      </div>
      <a-row>
        <a-col :span="13" :style="{padding:'10px'}">
          <a-row>
            <a-col :span="6" class="tr lh">项目：</a-col>
            <a-col :span="17">
              <a-input v-model="projectName" disabled/>
            </a-col>
          </a-row>
          <a-row class="m10">
            <a-col :span="6" class="tr lh">地区：</a-col>
            <a-col :span="17">
              <a-input value="广东省" disabled/>
            </a-col>
          </a-row>
          <a-row class="m10">
            <a-col :span="6" class="tr lh">计取标准：</a-col>
            <a-col :span="17">
              <a-select @change="selectChange" :value="calculateType" :style="{width:'100%'}">
                <a-select-option key="1" value="广东省造价咨询服务标准">广东省造价咨询服务标准</a-select-option>
                <a-select-option key="2" value="按单位量计取标准">按单位量计取标准</a-select-option>
                <a-select-option key="3" value="包干价">包干价</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row class="m10" v-if="calculateType != '包干价'">
            <a-col :span="6" class="tr lh">计取项：</a-col>
            <a-col :span="17">
              <a-select @change="selectChange2" :style="{width:'100%'}" :value="accrualItem">
                <a-select-option v-for="item in accrualItemArray" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <!-- 广东省造价咨询服务标准 -->
          <div class="m10 other-row" v-if="calculateType == '广东省造价咨询服务标准'">
            <a-row class="p5" v-for="(item,index) in tableItem.feeItem" :key="index">
              <a-col :span="6" class="tr lh ellipsis" :title="item.item">{{item.item}}：</a-col>
              <a-col :span="10">
                <a-input-number
                  :style="{width:'70%'}"
                  v-model="item.price"
                  @change="princeChange(tableItem.feeItem)"
                />元
                <a @click="editFamule(item)">
                  <a-icon type="form"/>
                </a>
              </a-col>
              <a-col :span="8">折扣：
                <a-input-number
                  :style="{width:'42%'}"
                  v-model="item.discount"
                  @change="discountChange(tableItem.feeItem)"
                />%
              </a-col>
            </a-row>
            <!-- <a-row class="p5">
              <a-col :span="6" class="tr lh">估算价：</a-col>
              <a-col :span="10">
                <a-input :style="{width:'70%'}"/>元
                <a>
                  <a-icon type="form"/>
                </a>
              </a-col>
              <a-col :span="8">折扣：
                <a-input :style="{width:'42%'}"/>%
              </a-col>
            </a-row>-->
          </div>
          <!-- 按单位量计取标准 -->
          <div class="m10 other-row" v-if="calculateType == '按单位量计取标准'">
            <a-row class="p5" v-for="(item,index) in tableItem.feeItem" :key="index">
              <a-col :span="6" class="tr lh ellipsis">{{item.item}}：</a-col>
              <a-col :span="9">
                <a-input-number
                  :style="{width:'70%'}"
                  v-model="item.price"
                  @change="princeChange(tableItem.feeItem)"
                />
                {{item.unit}}
              </a-col>
              <a-col :span="9">
                {{item.item2}}：
                <a-input-number
                  :style="{width:'35%'}"
                  v-model="item.formula"
                  @change="princeChange(tableItem.feeItem)"
                />
                {{item.unit2}}
              </a-col>
              <a-col :span="24" class="m10">
                <a-row>
                  <a-col :span="6" class="tr lh ellipsis">折扣：</a-col>
                  <a-col :span="8">
                    <a-input-number
                      :style="{width:'42%'}"
                      v-model="item.discount"
                      @change="discountChange(item)"
                    />%
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
          <!-- 包干价 -->
          <div class="m10 other-row" v-if="calculateType == '包干价'">
            <a-row class="p5"  v-for="(item,index) in tableItem.feeItem" :key="index">
              <a-col :span="6" class="tr lh ellipsis">{{item.item}}：</a-col>
              <a-col :span="10">
                <a-input-number :style="{width:'70%'}" v-model="item.price" />元
              </a-col>
              <a-col :span="8">折扣：
                <a-input-number :style="{width:'42%'}"  v-model="item.discount"/>%
              </a-col>
            </a-row>
          </div>
          <div class="m10 tr">
            <a-button type="primary" @click="calculator">计算</a-button>
          </div>
        </a-col>
        <a-col :span="11" :style="{padding:'10px',borderLeft:'1px solid #DDD'}">
          <a-row class="mb10" v-for="(item,index) in tableItem.feeItem" :key="index">
            <a-col :span="12" :style="{textAlign:'right'}">{{item.otherName||'基本费'}}：</a-col>
            <a-col :span="12">
              <span :style="{color:'#fa8564'}">{{item.value || 0}}</span>元
            </a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="12" :style="{textAlign:'right'}">折后合计费：</a-col>
            <a-col :span="12">
              <span :style="{color:'#fa8564'}">{{total}}</span>元
            </a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="12" :style="{textAlign:'right'}">计算过程：</a-col>
          </a-row>
          <div class="mb10">
            <a-textarea :rows="6" :value="textAreaValue"></a-textarea>
          </div>
          <div class :style="{textAlign:'right'}">
            <a-button type="primary" @click="addToProject">添加到项目</a-button>
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <a-modal :visible="eVisibled" title="修改计算公式" @cancel="editCancel" :width="900" :footer="null">
      <a-table
        :columns="columns"
        :dataSource="editTableData"
        bordered
        :pagination="false"
        v-if="Object.keys(editTableData[0]||{}).length"
      >
        <template slot="index" slot-scope="text,record,index">{{index + 1}}</template>

        <template v-for="(col, i) in formulaArray" :slot="col" slot-scope="text, record, index">
          <a-input :key="i" v-if="Object.keys(record).indexOf(col) > -1" v-model="record[col]"/>
        </template>
      </a-table>
      <div v-else :style="{textAlign:'center',border: '1px solid #ddd',padding: '5px 0'}">
        <a-input v-model="editTableData[0]" :style="{width:'50px'}"/>
      </div>
      <div :style="{textAlign:'center',marginTop:'10px'}">
        <a-button type="primary" :style="{marginRight:'10px'}">确定</a-button>
        <a-button type="default" @click="editCancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { db } from '@/components/_util/db'
import { mapState } from 'vuex'
import { ArrayToString,ObjectToString  } from '@/components/_util/StringUtil'

var data = [
  {
    feeName: '投资估算的编制或审核',
    feeItem: [
      {
        item: '估算价(元)',
        value: 0,
        formula: {
          '≤1000000': 0.0013,
          '≤5000000': 0.0011,
          '≤10000000': 0.0009,
          '≤50000000': 0.0007,
          '≤100000000': 0.0005,
          '>100000000': 0.0004
        },
        price: 0
      }
    ]
  },
  {
    feeName: '工程概算的编制或审核',
    feeItem: [
      {
        item: '概算价(元)',
        value: 0,
        formula: {
          '≤1000000': 0.002,
          '≤5000000': 0.0018,
          '≤10000000': 0.0016,
          '≤50000000': 0.0013,
          '≤100000000': 0.0012,
          '>100000000': 0.0011
        },
        price: 0
      }
    ]
  },
  {
    feeName: '工程预算的编制或审核',
    feeItem: [
      {
        item: '预算造价(单独编制或审核工程量清单合并)(元)',
        value: 0,
        formula: {
          '≤1000000': 0.0048,
          '≤5000000': 0.0041,
          '≤10000000': 0.0038,
          '≤50000000': 0.0034,
          '≤100000000': 0.0029,
          '>100000000': 0.0026
        },
        price: 0
      },
      // {
      //   item: '预算造价(单独编制或审核预算造价)(元)',
      //   value: 0,
      //   formula: {
      //     '≤1000000': 0.0018,
      //     '≤5000000': 0.0016,
      //     '≤10000000': 0.0014,
      //     '≤50000000': 0.0012,
      //     '≤100000000': 0.0009,
      //     '>100000000': 0.0008
      //   },
      //   price: 0
      // },
      {
        item: '预算造价(编制或审核预算造价)(元)',
        value: 0,
        formula: {
          '≤1000000': 0.0035,
          '≤5000000': 0.003,
          '≤10000000': 0.0028,
          '≤50000000': 0.0027,
          '≤100000000': 0.0024,
          '>100000000': 0.002
        },
        price: 0
      }
    ]
  },
  {
    feeName: '工程结算的编制',
    feeItem: [
      {
        item: '概算价(元)',
        value: 0,
        formula: {
          '≤1000000': 0.0045,
          '≤5000000': 0.004,
          '≤10000000': 0.0035,
          '≤50000000': 0.0033,
          '≤100000000': 0.003,
          '>100000000': 0.0025
        },
        price: 0
      }
    ]
  },
  {
    feeName: '工程结算审核',
    feeItem: [
      {
        item: '送审结算价(元)',
        value: 0,
        formula: {
          '≤1000000': 0.0028,
          '≤5000000': 0.0025,
          '≤10000000': 0.0022,
          '≤50000000': 0.0016,
          '≤100000000': 0.0013,
          '>100000000': 0.001
        },
        price: 0
      },
      {
        item: '核增减额(元)',
        value: 0,
        formula: 0.05,
        price: 0,
        otherName: '效益费'
      }
    ]
  },
  {
    feeName: '施工阶段全过程造价控制',
    feeItem: [
      {
        item: '概算价(元)',
        value: 0,
        formula: {
          '≤1000000': 0.012,
          '≤5000000': 0.011,
          '≤10000000': 0.01,
          '≤50000000': 0.009,
          '≤100000000': 0.008,
          '>100000000': 0.007
        },
        price: 0
      }
    ]
  },
  {
    feeName: '工程造价纠纷鉴证',
    feeItem: [
      {
        item: '鉴定后标的额(元)',
        value: 0,
        formula: {
          '≤1000000': 0.012,
          '≤5000000': 0.01,
          '≤10000000': 0.008,
          '≤50000000': 0.007,
          '≤100000000': 0.006,
          '>100000000': 0.005
        },
        price: 0
      },
      {
        item: '争议差额(元)',
        value: 0,
        formula: {
          '≤1000000': 0.05,
          '≤5000000': 0.04
        },
        price: 0,
        otherName: '效益费'
      }
    ]
  },
  {
    feeName: '钢筋及预埋件计算',
    feeItem: [
      {
        item: '钢筋使用量(吨)',
        value: 0,
        formula: 12,
        price: 0
      }
    ]
  },
  {
    feeName: '工程造价咨询工日收费标准',
    feeItem: [
      {
        item: '高级注册造价师(工时)',
        value: 0,
        formula: 190,
        price: 0
      },
      {
        item: '注册造价师(工时)',
        value: 0,
        formula: 150,
        price: 0
      },
      {
        item: '中级资格专业人员(工时)',
        value: 0,
        formula: 100,
        price: 0
      },
      {
        item: '初级资格人员(工时)',
        value: 0,
        formula: 60,
        price: 0
      }
    ]
  }
]

var data2 = [
  {
    feeName: '按费率计算',
    feeItem: [
      {
        item: '工程造价',
        unit: '元',
        item2: '费率',
        unit2: '%',
        value: 0,
        formula: 12,
        price: 0
      }
    ]
  },
  {
    feeName: '按面积计算',
    feeItem: [
      {
        item: '面积',
        unit: 'm2',
        item2: '单价',
        unit2: '元/㎡',
        value: 0,
        formula: 12,
        price: 0
      }
    ]
  },
  {
    feeName: '按延长米计算',
    feeItem: [
      {
        item: '延长米',
        unit: 'm',
        item2: '单价',
        unit2: '元/m',
        value: 0,
        formula: 12,
        price: 0
      }
    ]
  },
  {
    feeName: '按钢筋重量计算',
    feeItem: [
      {
        item: '钢重量',
        unit: 't',
        item2: '单价',
        unit2: '元/t',
        value: 0,
        formula: 12,
        price: 0
      }
    ]
  }
]
export default {
  name: 'ProjectMoney',
  props: {
    projectId: {
      type: String,
      default: ''
    },
    mVisibled: {
      type: Boolean,
      default: false
    },
    mTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visibled: this.mVisibled,
      title: this.mTitle,
      eVisibled: false,
      projectName: '',
      calculateType: '广东省造价咨询服务标准', //计取标准
      accrualItemArray: [], //计取项数组
      accrualItem: '', //计取项
      tableItem: {}, //计取项表格
      feeItem: [],
      editTableData: [], //修改公式数据
      formulaArray: ['≤1000000', '≤5000000', '≤10000000', '≤50000000', '≤100000000', '>100000000'],
      data, //咨询服务计取项
      data2, //单位计量计取项
      dbConn: new db(this.$apollo), //数据库操作
      total: 0,
      textAreaValue: '',
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 70,
          align: 'center',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '≤1000000',
          dataIndex: '≤1000000',
          align: 'center',
          scopedSlots: { customRender: '≤1000000' }
        },
        {
          title: '≤5000000',
          dataIndex: '≤5000000',
          align: 'center',
          scopedSlots: { customRender: '≤5000000' }
        },
        {
          title: '≤10000000',
          dataIndex: '≤10000000',
          align: 'center',
          scopedSlots: { customRender: '≤10000000' }
        },
        {
          title: '≤50000000',
          dataIndex: '≤50000000',
          align: 'center',
          scopedSlots: { customRender: '≤50000000' }
        },
        {
          title: '≤100000000',
          dataIndex: '≤100000000',
          align: 'center',
          scopedSlots: { customRender: '≤100000000' }
        },
        {
          title: '>100000000',
          dataIndex: '>100000000',
          align: 'center',
          scopedSlots: { customRender: '>100000000' }
        }
      ]
    }
  },
  created() {
    this.init()
  },
  computed:{
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  methods: {
    ArrayToString,
    ObjectToString,
    loadData(){
      let _this = this
      // console.log(`query{
      //   Project(where:{id:{_eq:"${_this.projectId}"}}){
      //     name
      //   }
      // }`)
      this.dbConn.query(`query{
        Project(where:{id:{_eq:"${_this.projectId}"}}){
          name
        }
      }`).then(res => {
        console.log(res,'get project name')
        _this.projectName = res.data.Project[0].name
      }).catch(err => {
        console.log(err,'get project name error')
      })
    },
    init() {
      this.loadData()
      this.calculateType = '广东省造价咨询服务标准'
      this.accrualItemArray = []
      this.data.forEach(ele => {
        this.accrualItemArray.push(ele.feeName)
      })
      this.accrualItem = this.accrualItemArray[0]
      this.getTableItem()
    },
    cancel() {
      this.$emit('moneyCancel', false)
    },
    //计取标准选择
    selectChange(e) {
      this.calculateType = e
      this.accrualItemArray = []

      if(e == '包干价'){
        this.tableItem = {feeItem:[{item:"咨询费",price:0}]}
        return
      }

      if (e == '广东省造价咨询服务标准') {
        this.data.forEach(ele => {
          this.accrualItemArray.push(ele.feeName)
        })
      } else if(e == '按单位量计取标准'){
        this.data2.forEach(ele => {
          this.accrualItemArray.push(ele.feeName)
        })
      }
      this.accrualItem = this.accrualItemArray[0]
      this.getTableItem()
      console.log( this.accrualItem)
    },
    //计取项选择
    selectChange2(e) {
      // debugger

      this.accrualItem = e
      this.getTableItem()
      // console.log(e, this.tableItem, 'selectChange 2')
    },
    getTableItem() {
      if (this.calculateType == '广东省造价咨询服务标准') {
        this.tableItem = this.data.filter(ele => ele.feeName == this.accrualItem)[0]
      } else if (this.calculateType == '按单位量计取标准') {
        this.tableItem = this.data2.filter(ele => ele.feeName == this.accrualItem)[0]
      }
      console.log(this.tableItem, 'item')
    },
    editFamule(record) {
      this.eVisibled = true
      this.editTableData = [record.formula]
      console.log(record, 'editFalumle')
      // console.log()
      // async (function (params) {
      //
      //   return res
      // }).then(res => {console.log(res)})
      var _this = this
      // async function name() {
      //    let res = await _this.dbConn.query(`query{ Money(where:{}){
      //       id
      //       feeItem
      //     }}`)
      //    console.log(res,'dfdf')
      //    return res
      // }
      // name().then(res => {
      //   console.log(res,'res')
      // })
      // _this.dbConn.query(`query{ Money(where:{}){
      //       id
      //       feeItem
      //     }}`).then(res => {console.log(res)})

      // console.log()
    },
    editCancel() {
      this.eVisibled = false
    },
    princeChange(item) {
      console.log(item, 'discount')
    },
    discountChange(item) {
      console.log(item, 'discount')
    },
    //计算
    calculator() {
      // console.log(this.tableItem.feeItem)
      this.total = 0
      this.textAreaValue = ''
      this.tableItem.feeItem.forEach(ele => {
        console.log(ele)
        if (Object.keys(ele.formula || {}).length) {
          ele.value = this.formulaCalculate(ele.formula, ele.price).total.toFixed(2)
          ele.disCountValue = ele.value * ((ele.discount || 100) * 0.01)
          this.textAreaValue += this.formulaCalculate(ele.formula, ele.price)._formulaString + '\n'
        } else {
          if (ele.item2 == '费率') {
            ele.value = (ele.price * (ele.formula || 0) * 0.01).toFixed(2)
            ele.disCountValue = ele.value * ((ele.discount || 100) * 0.01)
            this.textAreaValue += `${ele.price} * ${(ele.formula || 0) * 0.01} * ${(ele.discount || 100) * 0.01}` + '\n'
          } else {
            ele.value = (ele.price * (ele.formula != null ? (ele.formula || 0) : 1)).toFixed(2)
            ele.disCountValue = ele.value * ((ele.discount || 100) * 0.01)
            this.textAreaValue += `${ele.price} * ${ele.formula != null ? (ele.formula || 0) : 1} * ${(ele.discount || 100) * 0.01}` + '\n'
          }
        }
        this.total += ele.disCountValue
      })
      this.total = this.total.toFixed(2)
    },
    //获取公式总额和计算过程
    formulaCalculate(formula, price) {
      let _price = price
      let _formulaArray = Object.keys(formula)
      let total = 0
      // console.log(_formulaArray)
      let _formulaString = ``
      let _formulaIndex = 0
      _formulaArray.forEach((ele, index) => {
        let _value = ele.slice(1)
        let preValue = (_formulaArray[index - 1]||'').slice(1) || 0

        //当前值减去上一个的值且不能为零 少于已减去的金额  且不能是最后一个
        if ((_value-preValue) <= _price && _value-preValue != 0 && index != _formulaArray.length - 1) {
          if (index == 0) {
            //第一个
            _price -= _value
            total += _value * formula[_formulaArray[index]]
            if(_price == 0){
              _formulaString += `${_value}*${formula[_formulaArray[index]]}`
            }else {
              _formulaString += `${_value}*${formula[_formulaArray[index]]}+`
            }
          } else {
            _price -= _value - preValue
            total += (_value - preValue) * formula[_formulaArray[index]]
            if(_price == 0){
               _formulaString += `${_value - preValue}*${formula[_formulaArray[index]]}`
            }else {
              _formulaString += `${_value - preValue}*${formula[_formulaArray[index]]}+`
            }
          }
         
        } else if(_price != 0){ //小于第一个或大于最后一个
           
           total += _price * formula[_formulaArray[index]]
          _formulaString += `${_price}*${formula[_formulaArray[index]]}`
          _price -=_price
        }
      })

      // if(_formulaIndex == 0){
      //   _formulaString +=`${_price} * ${formula[_formulaArray[0]]}`
      // }
      console.log(_formulaString,total)
      return {
        _formulaString,
        total
      }
      
      // console.log(formula,price)
      // for(k in formula){
      //   console.log(k)
      // }
    },
    addToProject() {
      var _item = []
      let _this = this
      console.log(this.ObjectToString)
      this.tableItem.feeItem.forEach(ele => {
        var obj = Object.assign({},ele)
        if(Object.keys(obj.formula||{}).length){
          
          obj.formula = this.ObjectToString(obj.formula,1) 
           _item.push(obj)
        }else {
           _item.push(obj)
        }
       
      })
       var mutationString = 
       `mutation {
         insert_Money(objects:[{
          feeItem:${this.ArrayToString(_item)}
          feeName:"${this.tableItem.feeName||''}"
          total:${this.total}
          feeStandard:"${this.calculateType}",
          project_id:"${this.projectId}"
          createdBy_id:"${this.userInfo.id}"
          updatedBy_id:"${this.userInfo.id}"
        }]){returning{id}}
       }
      `
      console.log(mutationString)
      this.dbConn.mutation(mutationString)
      .then(res => {
        console.log(res,'add money success')
        _this.$emit('moneySave')
      }).catch(err => {
        console.log(err,'add money fail')
      })
      // console.log(this.ArrayToString(this.tableItem.feeItem))
    }
  },
  watch: {
    mVisibled(newT) {
      this.visibled = newT
      if (newT) {
        this.init()
      }
    },
    mTitle(newT) {
      this.mTitle = newT
    }
  }
}
</script>
<style>
.projectMoneyDialog .m10 {
  margin-top: 10px;
}
.projectMoneyDialog .mb10 {
  margin-bottom: 10px;
}
.projectMoneyDialog .p5 {
  padding: 5px 0;
}
.projectMoneyDialog .tr {
  text-align: right;
}
.projectMoneyDialog .lh {
  height: 30px;
  line-height: 30px;
}

.projectMoneyDialog .ant-modal-header {
  background-color: #518ef0;
  padding: 0 0 0 10px;
}
.projectMoneyDialog .ant-modal-title,
.projectMoneyDialog .ant-modal-close {
  color: #fff;
}

.projectMoneyDialog .slot-title {
  height: 54px;
  line-height: 54px;
}
.projectMoneyDialog .slot-title i {
  font-size: 30px;
  position: relative;
  top: 5px;
  margin-right: 10px;
}
.projectMoneyDialog .other-row {
  padding: 5px;
  border: 1px solid #d5e6ef;
  background-color: #f3f7fc;
}
.projectMoneyDialog .ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

