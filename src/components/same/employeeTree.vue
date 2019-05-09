<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="title"
      v-model="visibled"
      @ok="handleOk"
      @cancel="cancel"
      :maskClosable="maskClosable"
      :width="550"
    >
      <a-row>
        <a-col :span="14">
          <div style="height:40px" v-if="type == 1">
            <a-input type="text" placeholder="姓名" style="width: 74%;"/>
            <a-button type="primary" style="width: 22%;float: right;">搜索</a-button>
          </div>
          <div class="treeDiv">
            <a-tree
              :treeData="treeData"
              showIcon
              :expandedKeys="defaultExpandedKeys"
              :defaultExpandAll="true"
              @expand="changeExpand"
              @select="onSelect"
              
            >
              <a-icon slot="home" type="home" style="color:#78bb60;font-weight: bolder;"/>
              <a-icon slot="team" type="team" style="color:#78bb60;font-weight: bolder;"/>
              <a-icon slot="male" type="user" style="color:#78bb60"/>
              <a-icon slot="female" type="user" style="color:#fa8564"/>
            </a-tree>
          </div>
        </a-col>
        <a-col :span="2">
          <!-- <div style="height:340px"> -->
          <a-icon type="right" class="rightIcon"/>
          <!-- </div> -->
        </a-col>
        <a-col :span="8">
          <div :class="['treeDiv', type == 1 ?'selectDiv':'']">
            <a-list
              class="demo-loadmore-list"
              itemLayout="horizontal"
              :dataSource="selectedData"
              :split="false"
            >
              <a-list-item
                slot="renderItem"
                slot-scope="item, index"
                style="padding:0;padding-left:5px"
              >
                <a-icon slot="actions" type="delete" @click="deleteSelectData(item,index)"/>
                <div>{{ item.title }}</div>
              </a-list-item>
            </a-list>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import gql from 'graphql-tag'

// const treeData = [
//   {
//     title: '公司',
//     key: '1',
//     slots: {
//       icon: 'home'
//     },
//     children: [
//       {
//         title: '总部',
//         key: '2',
//         slots: { icon: 'team' },
//         children: [
//           { title: '章三', key: '3', slots: { icon: 'male' } },
//           { title: '李四', key: '4', slots: { icon: 'female' } }
//         ]
//       },
//       { title: '支部', key: '5', slots: { icon: 'team' } }
//     ]
//   }
// ]
export default {
  name: 'EmployeeTree',
  props: {
    inititle: {
      type: String,
      default: ''
    },
    inivisible: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      //点击蒙层是否允许关闭
      type: Boolean,
      default: false
    },
    isOne: {
      type: Boolean,
      default: true
    },
    type: {
      type: Number,
      default: 1 //1所有员工/2部门/
    },
    type2: {
      type:Number,
      default:0,//1专业负责人/2项目成员/3公司领导人/4外部
    },
    filterData: {
      type: Array,
      default: function () {
        return []
      }
    },
    initSelected: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      noMultiple:this.isOne,
      defaultExpandedKeys:[],
      treeData:[],
      employeeType:this.type2,
      filterDatas:["e0efba29-2432-4066-bd37-5d8ca8bd479d"].concat(this.filterData),
      selectedData: this.initSelected,
      whereString:'',
    }
  },
  created() {
    // this.selectedData = this.initSelected
  },
  methods: {


    getEmployeeData() {
      var that = this
      if(that.employeeType == 3){
        this.whereString = `roles:{role:{name:{_eq:"公司领导"}}}`
      }else if(that.employeeType == 4){
        this.whereString = `department:{name:{_eq:"外部"}}`
      }else {
        this.whereString = ``
      }
      this.$apollo
        .query({
          query: gql`
            query {
              Department(where: {}) {
                id
                name
                company {
                  id
                  name
                }
                employees(where:{${that.whereString}}) {
                  id
                  name
                  major
                  roles{
                    role {
                      id
                      name
                    }
                  }
                }
                parent {
                  id
                  name
                }
              }
            }
          `,
          fetchPolicy: 'network-only'
          // // 初始变量
          // variables: {
          //   skip: 6,
          //   pageSize: 2,
          //   hasMore: false
          // }
        })
        .then(res => {
          var _data = res.data.Department
          var objArr = {}
          that.defaultExpandedKeys = [_data[0].company.id]
          objArr = {
            title: _data[0].company.name,
            key: _data[0].company.id,
            type: 1,
            slots: { icon: 'home' },
            children: that.toTree(res.data.Department)
          }

          that.treeData = []
          that.treeData.push(objArr)
          // console.log(that.defaultExpandedKeys)
          // setTimeout(function(){},1000)
          
          console.log(objArr, '_data')
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    //节点数据处理
    toTree(data) {
      // 删除 所有 children,以防止多次调用
      var that = this;
      // var _data = []
      
      data.forEach(function(item) {
        item.title = item.name
        item.key = item.id
        that.defaultExpandedKeys.push(item.id)
        item.slots = { icon: 'team' }
        item.type = 2
        delete item.children
      })

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {}
      data.forEach(function(item) {
        // item.children = item.employees
        map[item.id] = item
      })
      //        console.log(map);
      var val = []
      data.forEach(function(item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        item.parent = item.parent || {}
        var parent = map[item.parent.id]
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          ;(parent.children || (parent.children = [])).push(item)
          if (that.type == 1) {
            if (item.employees.length) {
              var _employees = item.employees.filter(ele => that.filterDatas.indexOf(ele.id) == -1)
              if(that.employeeType == 1){ //专业负责人
                _employees = item.employees.filter(ele => ele.major && that.filterDatas.indexOf(ele.id) == -1)
              }else if(that.employeeType == 2){ //项目成员
                // _employees = item.employees.filter(ele => !ele.major && that.filterDatas.indexOf(ele.id) == -1)
              }
              _employees.forEach(ele => {
                var obj = {
                  title: ele.name,
                  key: ele.id,
                  type: 3,
                  slots: { icon: ele.sex == 1 ? 'male' : 'female' }
                }

                if (Object.prototype.toString.call(item.children).indexOf('Array') > -1) {
                  item.children.push(obj)
                } else {
                  item.children = [obj]
                }
              })
            }
          }
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          //  item.children = item.employees || []
          val.push(item)
          if (that.type == 1) {
            //显示员工
            if (item.employees.length) {
              var _employees = item.employees.filter(ele => that.filterDatas.indexOf(ele.id) == -1)
              if(that.employeeType == 1){ //专业负责人
                _employees = item.employees.filter(ele => ele.major && that.filterDatas.indexOf(ele.id) == -1)
              }else if(that.employeeType == 2){ //项目成员
                // _employees = item.employees.filter(ele => !ele.major && that.filterDatas.indexOf(ele.id) == -1)
              }
              _employees.forEach(ele => {
                var obj = {
                  title: ele.name,
                  key: ele.id,
                  type: 3,
                  slots: { icon: ele.sex == 1 ? 'male' : 'female' }
                }
                // val.push(obj)
                if (Object.prototype.toString.call(item.children).indexOf('Array') > -1) {
                  item.children.push(obj)
                } else {
                  item.children = [obj]
                }
              })
            }
          }
        }
      })
      return val
    },
    handleOk(e) {
      this.$emit('changeStatus', {visibled:false,data:this.selectedData,isCancel:false})
      this.selectedData = []
    },
    cancel(e){
      // console.log(chang)
      this.$emit('changeStatus', {visibled:false,data:this.selectedData,isCancel:true})
      this.selectedData = []
    },
    onSelect(selectedKeys, info) {
      // console.log(selectedKeys, info,'info')
      if(!selectedKeys.length){ //第二次点击没有key值
        return
      }
      if(this.type == 1){ //员工
        if(info.node.dataRef.type != 3){
          return
        }
      }
      if(this.type == 2){ //部门
        if(info.node.dataRef.type != 2){
          return
        }
      }
      var newSelect = { key: selectedKeys[0], title: info.node.dataRef.title }
      if (this.noMultiple) {
        //单选
        this.selectedData.splice(0, 1, newSelect)
      } else {
        //多选
        var filter = this.selectedData.filter(ele => ele.key == newSelect.key)
        if(filter.length){
          return
        }
        this.selectedData.push(newSelect)
      }

      // console.log('selected', selectedKeys, info, this.selectedData)
    },
    //删除已选
    deleteSelectData(item,index) {
      this.selectedData.splice(index,1)
      console.log(item)
    },
    //节点收起和展开
    changeExpand(expandedKeys, {expanded: bool, node}){
      this.defaultExpandedKeys = expandedKeys
      // console.log(expandedKeys)
    }

  },
  watch: {
    inivisible(newT) {
      // console.log(newT,oldT)
      let _this = this
      if (newT) {
        setTimeout(function(){
          _this.getEmployeeData()
        },100)
        // this.selectedData = []
        // this.selectedData = this.initSelected
      }
      this.visibled = newT
      // this.selectedData = []
    },
    inititle(newT) {
      // console.log(newT)
      this.title = newT
    },
    isOne(newT){
      console.log(newT,'project review employee isone')
      this.noMultiple = newT
    },
    type2(newT){
      this.employeeType = newT
      console.log(newT)
      // if(newT == 3){
      //   this.whereString = `roles:{role:{name:{_eq:"公司领导"}}}`
      // }else {
      //   this.whereString = ``
      // }
    },
    filterData(newT){
      this.filterDatas = newT
    },
    initSelected(newT){
      console.log(newT,'initSelected')
      this.selectedData = newT
    }
  }
}
</script>
<style>
/* .ant-form-item-required:before {
    display: inline-block;
    margin-right: 4px;
    content: "*";
    font-family: SimSun;
    line-height: 1;
    font-size: 14px;
    color: #f5222d;
} */
.ant-modal-header {
  background: #eee;
  color: #555;
  border-bottom: 1px solid #ddd;
}
.treeDiv {
  height: 300px;
  border: 1px solid #ccc;
  overflow: auto;
  padding: 5px;
  border-radius: 4px;
}
.selectDiv {
  margin-top: 40px;
}
.rightIcon {
  font-size: 30px;
  color: #e3e3e3;
  margin-top: 175px;
}
</style>
