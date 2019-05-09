<template>
  <div>
    <a-modal :visible="visible" :title="title" class="moveTemplate" :width="600" @cancel="cancel">
      <a-row :style="{height:'300px',border:'1px solid #ccc',overflow:'auto'}">
        <a-col :span="24">
          <a-tree
            :treeData="treeData"
            :expandedKeys="defaultExpandedKeys"
            :defaultExpandAll="true"
            showIcon
            @expand="changeExpand"
            @select="onSelect"
          >
            <a-icon slot="file" type="folder" theme="filled" style="color:#debd22"/>
          </a-tree>
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
// import Item from '@/components/same/item'

export default {
  name: 'MoveTemplate',
  props: {
    projectId: {
      type: String,
      default: ''
    },
    filterId:{
      type:Array,
      default:function(){
        return []
      }
    },
    mVisible: {
      type: Boolean,
      default: false
    },
    mTitle: {
      type: String,
      default: ''
    },
    mType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dbConn: null,
      visible: this.mVisible,
      title: this.mTitle,
      type: this.mType,
      treeData: [],
      defaultExpandedKeys: [],
      saveData:{},
    }
  },
  created() {
    this.dbConn = new db(this.$apollo)
  },
  components: {
    // Item
  },
  methods: {
    async loadTemplate() {
      let queryString = `query {
            Document(where:{projectFileType:{_eq:${this.type}},property:{_eq:0},relatedId:{_eq:"${this.projectId}"}}){
                id
                name
                url
                projectFileType
                property
                type
                parent_id
            }
          }`
      console.log(queryString)
      let res = await this.dbConn.query(queryString)
      this.defaultExpandedKeys = []
      res.data.Document.forEach(e => {
        e.slots = { icon: 'file' }
        e.title = e.name
        e.key = e.id
        this.defaultExpandedKeys.push(e.id)
        let child = res.data.Document.filter(c => c.parent_id == e.id && this.filterId.indexOf(c.id) == -1)
        if (child.length) {
          e.children = child
        }
      })

      this.treeData = res.data.Document.filter(e => !e.parent_id)
      console.log(this.treeData)

      //   console.log(res)
      //   this.templateData = res.data.Template
      //   this.nowKey = 0
      //   this.templateDetailData = (this.templateData[0] || {}).data || []
    },

    //取消
    cancel() {
      // debugger
      this.$emit('moveCancel')
    },
    //保存
    ok() {
      this.$emit('moveSave', this.saveData)
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, info, 'info')
      if (!selectedKeys.length) {
        //第二次点击没有key值
        return
      }
      this.saveData = info.node.dataRef
    },
    //节点收起和展开
    changeExpand(expandedKeys, { expanded: bool, node }) {
      this.defaultExpandedKeys = expandedKeys
      // console.log(expandedKeys)
    }
  },
  watch: {
    mVisible(newT) {
      this.visible = newT
      //   debugger
      if (newT) {
        this.loadTemplate()
      }
    },
    mType(newT) {
      this.type = newT
    },
    mTitle(newT) {
      this.title = newT
    }
  }
}
</script>

<style>
.moveTemplate .left-title {
  border-left: 3px solid #78bb60;
  padding-left: 5px;
  height: 10px;
  display: inline-block;
  line-height: 10px;
}
</style>
