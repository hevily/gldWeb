<template>
  <div>
    <a-modal :visible="visible" :title="title" class="importTemplate" :width="800" @cancel="cancel">
      <a-row :style="{height:'300px',border:'1px solid #ccc'}">
        <a-col
          :span="10"
          :style="{height:'100%',backgroundColor: '#f8f8f8',borderRight: '1px solid #DDD'}"
        >
          <div :style="{height:'30px',lineHeight:'30px',marginLeft:'10px'}">
            <span class="left-title"></span>选择模板
          </div>
          <div :style="{height:'270px',overflow:'auto'}">
            <a-row
              v-for="(item,index) in templateData"
              :key="index"
              :style="{lineHeight:'30px'}"
              
            >
              <a-col
                :span="24"
                v-if="index == nowKey"
                style="padding: 0px 10px;background: #d4e5f4;color: #78bb60;"
                @click="toggleClick(item,index)"
              >
                <a-col :span="22">{{item.name}}</a-col>
                <a-col :span="2" style="cursor:pointer;text-align: center;" title="删除" >
                  <a-icon type="delete" @click="deleteTemplate(item,index)"></a-icon>
                </a-col>
              </a-col>
              <a-col :span="24" v-else style="padding: 0px 10px;" @click="toggleClick(item,index)">
                <a-col :span="22">{{item.name}}</a-col>
                <a-col :span="2" style="cursor:pointer;text-align: center;" title="删除"  >
                  <a-icon type="delete" @click="deleteTemplate(item,index)"></a-icon>
                </a-col>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="14" :style="{height:'100%'}">
          <div :style="{height:'30px',lineHeight:'30px',marginLeft:'10px'}">
            <span class="left-title"></span>预览
          </div>
          <div :style="{height:'270px',overflow:'auto'}">
            <a-row
              v-for="(item,index) in templateDetailData"
              :key="index"
              :style="{lineHeight:'30px'}"
            >
              <Item :model="item" :isFirst="true"/> 
              <!-- <a-col :span="24" style="padding: 0px 10px;border-bottom: 1px solid #eee;">
                {{item.name}}
              </a-col>
              <a-col :span="24" v-if="item.child">{{showChild(item.child)}}</a-col> -->
            </a-row>
          </div>
        </a-col>
      </a-row>
      <div slot="footer" style="text-align:center">
        <a-button type="primary" @click="ok">确定</a-button>
        <a-button type="default" @click="cancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { db } from '@/utils/db'
import Item from '@/components/same/item'

export default {
  name: 'ImportTemplate',
  props: {
    iVisible: {
      type: Boolean,
      default: false
    },
    iTitle: {
      type: String,
      default: ''
    },
    iType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dbConn: null,
      visible: this.iVisible,
      title: this.iTitle,
      type: this.iType,
      templateData: [],
      templateDetailData: [],
      activeKey: 0,
      nowKey: 0
    }
  },
  created() {
    this.dbConn = new db(this.$apollo)
  },
  components: {
    Item
  },
  methods: {
    async loadTemplate() {
      let queryString = `query {
              Template(where:{type:{_eq:${this.type}}}){
                  data,
                  id,
                  type,
                  name
              }
          }`

      let res = await this.dbConn.query(queryString)
      this.templateData = res.data.Template
      this.nowKey = 0
      this.templateDetailData = (this.templateData[0] || {}).data || []
    },
    toggleClick(item, index) {
        console.log('toggle')
      this.nowKey = index
      this.templateDetailData = item.data
    },
    async deleteTemplate(item,index){
        let deleteString = `mutation {
            delete_Template(where:{id:{_eq:"${item.id}"}}){
                returning{id}
            }
        }`
        let res = this.dbConn.mutation(deleteString)
        this.loadTemplate()
        
        // // debugger
        // if(index == this.nowKey && index == 0){
        //     this.nowKey = 0
        // }else if(index <= this.nowKey){
        //     this.nowKey = this.nowKey - 1
        // }
        // this.templateData.splice(index,1)
        // this.templateDetailData = this.templateData[this.nowKey]
    },
    //取消
    cancel() {
      // debugger
      this.$emit('templateCancel')
    },
    //保存
    ok() {
      this.$emit('templateSave', this.templateDetailData)
    },

    showChild(data) {
      // data.forEach(ele => {

      // })
      // let _this = this
      console.log(data)
      return(<div>{data.map(function(item){
          
        // item.child ? item.child.map(function(item2, index2) {
        //   return _this.showChild(item.child)
        // }):''
         <div>{item.name}</div>
      })}</div>)
    },
  },
  watch: {
    iVisible(newT) {
      this.visible = newT
      if (newT) {
        this.loadTemplate()
      }
    },
    iType(newT) {
      this.type = newT
    },
    iTitle(newT) {
      this.title = newT
    }
  }
}
</script>

<style>
.importTemplate .left-title {
  border-left: 3px solid #78bb60;
  padding-left: 5px;
  height: 10px;
  display: inline-block;
  line-height: 10px;
}
</style>
