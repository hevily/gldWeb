<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="title"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleOk"
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
              :defaultExpandedKeys="['0-0-0']"
              @select="onSelect"
            >
              <a-icon slot="home" type="home" style="color:#5873c9;font-weight: bolder;"/>
              <a-icon slot="team" type="team" style="color:#5873c9;font-weight: bolder;"/>
              <a-icon slot="male" type="user" style="color:#5873c9"/>
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
      default: 1
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      treeData:[],
      selectedData: []
    }
  },
  updated() {
    console.log(this.visibled)
    if (this.visibled) {
      // this.getEmployeeData()
    }
  },
  methods: {
    //父级调用
    // showModal() {
    //   this.visibled = true
    // },

    getEmployeeData() {
      var that = this
      this.$apollo
        .query({
          query: gql`
            query {
              departments(where: {}) {
                id
                name
                company {
                  id
                  name
                }
                employees {
                  id
                  name
                }
                parentNode {
                  id
                  name
                }
              }
            }
          `
          // // 初始变量
          // variables: {
          //   skip: 6,
          //   pageSize: 2,
          //   hasMore: false
          // }
        })
        .then(res => {
          var _data = res.data.departments
          var objArr = {}
          objArr = {
            title: _data[0].company.name,
            key: _data[0].company.id,
            type: 1,
            slots: { icon: 'home' },
            children: that.toTree(res.data.departments)
          }

          that.treeData = []
          that.treeData.push(objArr)
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
        // var iobj = {};
        item.title = item.name
        item.key = item.id
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
        item.parentNode = item.parentNode || {}
        var parent = map[item.parentNode.id]
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          ;(parent.children || (parent.children = [])).push(item)
          // debugger
          if (that.type == 1) {
            if (item.employees.length) {
              // debugger
              item.employees.forEach(ele => {
                // debugger
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
          // debugger
          if (that.type == 1) {
            //显示员工
            if (item.employees.length) {
              item.employees.forEach(ele => {
                var obj = {
                  title: ele.name,
                  key: ele.id,
                  type: 3,
                  slots: { icon: ele.sex == 1 ? 'male' : 'female' }
                }
                val.push(obj)
              })
            }
          }
        }
      })
      return val
    },
    handleOk(e) {
      console.log(e)
      this.visibled = false
      this.$emit('changeStatus', false)
    },
    onSelect(selectedKeys, info) {
      if(this.type == 1){ //员工
        if(info.node.dataRef.type != 3){
          return
        }
      }
      if(this.type == 2){ //员工
        if(info.node.dataRef.type != 2){
          return
        }
      }
      var newSelect = { key: selectedKeys[0], title: info.node.dataRef.title }
      if (this.isOne) {
        //单选
        this.selectedData.splice(0, 1, newSelect)
      } else {
        //多选
        this.selectedData.push(newSelect)
      }

      console.log('selected', selectedKeys, info, this.selectedData)
    },
    deleteSelectData(item,index) {
      this.selectedData.splice(index,1)
      console.log(item)
    }
  },
  watch: {
    inivisible(newT) {
      // console.log(newT,oldT)

      if (newT) {
        this.getEmployeeData()
      }
      this.visibled = newT
    },
    inititle(newT) {
      // console.log(newT)
      this.title = newT
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
