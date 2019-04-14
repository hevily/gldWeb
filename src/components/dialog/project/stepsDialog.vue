<template>
  <a-row>
    <a-modal
      :title="title"
      v-model="visibled"
      :maskClosable="maskClosable"
      :width="650"
      @cancel="cancel"
      class="ProjectType"
    >
      <a-row class="stepsTable">
        <a-col :span="24" style="margin-bottom:10px">
          <a-button type="primary" style="margin-right:10px">导入</a-button>
          <a-button type="default">导出</a-button>
        </a-col>
        <a-col :span="24">
          <a-table :columns="columns" :dataSource="data" :bordered="true" :pagination="false">
            <div slot="name" slot-scope="text,record,index">
              <a-input
                v-if="!record.name"
                class="borderHidden"
                :id="record.id"
                @blur="stepNameChange"
                @pressEnter="stepNameChange"
              />
              <span v-else>{{ text }}</span>
            </div>
            <div slot="type" slot-scope="text,record,index">
              <a-select :value="text" style="width: 120px" @change="typeChange(record,$event)">
                <a-select-option :value="2">开始节点</a-select-option>
                <a-select-option :value="0">普通节点</a-select-option>
                <a-select-option :value="1">完成节点</a-select-option>
              </a-select>
            </div>
            <div slot="property" slot-scope="text,record,index">
              <a-select :value="text" style="width: 120px" disabled @change="propertyChange(record,$event)">
                <a-select-option :value="0">项目节点</a-select-option>
                <a-select-option :value="1">财务节点</a-select-option>
              </a-select>
            </div>

            <div slot="action" slot-scope="text,record,index">
              <a @click="addStep(record)" style="margin-right: 3px;">
                <a-icon type="plus"/>
              </a>
              <a @click="moveStep(record,1,index)" style="margin-right: 3px;" v-if="record.order != 1">
                <a-icon type="arrow-up"/>
              </a>
              <a
                @click="moveStep(record,2,index)"
                style="margin-right: 3px;"
                v-if="record.order != data[data.length-1].order"
              >
                <a-icon type="arrow-down"/>
              </a>
              <a @click="deleteStep(record)">
                <a-icon type="delete"/>
              </a>
            </div>
          </a-table>
        </a-col>
      </a-row>
      <template slot="footer">
        <div></div>
      </template>
    </a-modal>
  </a-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'StepsDialog',
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
    projectId: {
      type: String,
      default: ''
    },
    stepType:{
      type:Number,
      default:0,
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      data: [],
      status: {
        0: '未开始',
        1: '进行中',
        2: '已完成',
        4: '暂停中'
      },
      columns: [
        { title: '序号', align: 'center', dataIndex: 'order' },
        {
          title: '节点名称',
          dataIndex: 'name',
          scopedSlots: {
            customRender: 'name'
          }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text, record, index) => {
            // console.log(text, this)
            return this.status[text]
          }
        },
        {
          title: '属性',
          align: 'center',
          dataIndex: 'property',
          scopedSlots: {
            customRender: 'property'
          }
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: {
            customRender: 'type'
          }
        },
        
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },

  methods: {
    loadData() {
      console.log(this.projectId)
      var _this = this
      this.$apollo
        .query({
          query: gql`
            query{
                Project(where:{id:{_eq:"${this.projectId}"}}){
                    id
                    name
                    steps(where:{property:{_eq:${this.stepType}}},order_by:[{order:asc}]){
                      id
                      name
                      order
                      status
                      property
                      type
                      summarys{
                        content
                        createdBy {
                          id
                          name
                        }
                        createdAt
                      }
                    }
                }
            }
            `,
          fetchPolicy: 'network-only'
        })
        .then(res => {
          console.log(res, 'stepsdialog result')
          _this.data = res.data.Project[0].steps

          _this.$emit('changeStatus', { steps: _this.data, visibled: true })
        })
        .catch(err => {
          console.log(err, 'stepDialog err')
        })
    },

    //添加节点
    addStep(record) {
      var _this = this
      var newStep = `{ name: "",property:${this.stepType}, order: ${parseInt(record.order) + 1}, status: 0,project_id:"${this.projectId}" }`
      var oldStepData = this.data.filter(ele => ele.order > record.order)
      var oldString = ''
      oldStepData.forEach((ele, index) => {
        oldString += `step${index}:update_Step(where: { id: {_eq:"${ele.id}"} }, _set: { order: ${ele.order + 1} }){returning {id}}  ` + '\n'
      })

      this.$apollo
        .mutate({
          mutation: gql`
          mutation {
            insert_Step(objects:[${newStep}]){
              returning{
                id
              }
            }
            ${oldString}
          }
        `
        })
        .then(res => {
          console.log(res, 'delete step success')
          _this.loadData()
        })
        .catch(err => {
          console.log(err, 'delete step fail')
        })
      console.log(newStep, oldStepData, oldString, 'addStep')
    },
    //上移下移节点
    moveStep(record, type,index) {
      var _this = this
      var _record = Object.assign({}, record)
      // var _record = record
      // var nextStep = this.data.filter(ele => parseInt(_record.order) + 1 == ele.order) //下一个节点
      // var preStep = this.data.filter(ele => parseInt(_record.order) - 1 == ele.order) //上一个节点
      
      var nextStep = [this.data[index + 1]]
      var preStep = [this.data[index - 1]]

      var updataString = ''

      if (type == 1) {
        if(index == 0) {
          return
        }
        //上移
        var preOrder = preStep[0].order
        preStep[0].order = _record.order
        _record.order = preOrder
        preStep.push(_record)
        this.data.splice(parseInt(_record.order) - 1, 1, _record)
        this.data.splice(parseInt(preStep[0].order) - 1, 1, preStep[0])
        preStep.forEach((ele, index) => {
          // updataString += `{ where: { id: "${ele.id}" }, data: { order: ${ele.order} } }`
          updataString += `step${index}:update_Step(where: { id: {_eq:"${ele.id}"} }, _set: { order: ${ele.order} }){returning {id}}  ` + '\n'
        })
      } else if (type == 2) {
        if(index == this.data.length -1){
          return
        }
        //下移
        var nextOrder = nextStep[0].order
        nextStep[0].order = _record.order
        _record.order = nextOrder
        nextStep.push(_record)
        this.data.splice(parseInt(_record.order) - 1, 1, _record)
        this.data.splice(parseInt(nextStep[0].order) - 1, 1, nextStep[0])
        nextStep.forEach((ele, index) => {
          // updataString += `{ where: { id: "${ele.id}" }, data: { order: ${ele.order} } }`
          updataString += `step${index}:update_Step(where: { id: {_eq:"${ele.id}"} }, _set: { order: ${ele.order} }){returning {id}}  ` + '\n'
        })
      }

      this.$apollo
        .mutate({
          mutation: gql`
          mutation {
           ${updataString}
          }
        `
        })
        .then(res => {
          console.log(res, 'delete step success')
          _this.loadData()
        })
        .catch(err => {
          console.log(err, 'delete step fail')
        })
    },
    //删除节点
    deleteStep(record) {
      var _this = this
      if(record.type == 1){ //不能删除类型为完成节点的节点
        return
      }
      var data = this.data.filter(ele => ele.order > record.order)
      var updataString = ''
      data.forEach((ele, index) => {
        // updataString += `{ where: { id: "${ele.id}" }, data: { order: ${index + 1} } }`
        updataString += `step${index}:update_Step(where: { id: {_eq:"${ele.id}"} }, _set: { order: ${ele.order -1} }){returning {id}}  ` + '\n'
      })
      this.$confirm({
        title: '删除节点',
        content: `你确定删除该节点？`,
        onOk() {
          // _this.changeProjectStatus(record.value, content)
          _this.$apollo
            .mutate({
              mutation: gql`
                mutation {
                  delete_Step(where:{id:{_eq:"${record.id}"}}){returning{id}}
                  ${updataString}
                }
              `
            })
            .then(res => {
              console.log(res, 'delete step success')
              _this.loadData()
            })
            .catch(err => {
              console.log(err, 'delete step fail')
            })
        },
        onCancel() {}
      })

      console.log(data, 'delete')
    },
    //修改节点名称
    stepNameChange(e) {
      console.log(e.target.id, e.target.value)
      var _this = this
      this.$apollo
        .mutate({
          mutation: gql`
            mutation {
              update_Step(
                _set: {
                  name:"${e.target.value}"
                }
                where: { id: {_eq:"${e.target.id}"} }
              ) {
                returning {
                  id
                }
              }
            }
          `
        })
        .then(res => {
          console.log(res, 'delete step success')
          _this.loadData()
        })
        .catch(err => {
          console.log(err, 'delete step fail')
        })
    },
    // handleOk() {
    //   this.$emit('changeStatus', { visibled: false, data: data })
    // },
    cancel() {
      this.$emit('changeStatus', { visibled: false })
    },
    //改变节点类型
    typeChange(record,e) {
      console.log(record,e)
      var updateStepString = ``
      if(e == 1 || e == 2){ //有且只有一个完成节点
        var updateArray = this.data.filter(ele => ele.type == e)
        updateArray.forEach((ele,index) => {
          updateStepString += `update_step${index}:update_Step(where:{id:{_eq:"${ele.id}"}},_set:{type:0}){returning{id}}`
        })
      }else { //不能将完成节点转换成普通节点
        return
      }
      // return
      let _this = this
      if(record.id){
        this.$apollo
          .mutate({
            mutation: gql`
              mutation {
                update_Step(
                  _set: {
                    type:${e}
                  }
                  where: { id: {_eq:"${record.id}"} }
                ) {
                  returning {
                    id
                  }
                }
                ${updateStepString}
              }
            `
          })
          .then(res => {
            console.log(res, 'delete step success')
            _this.loadData()
          })
          .catch(err => {
            console.log(err, 'delete step fail')
          })
        }
    },
    //改变节点类型
    propertyChange(record,e) {
      console.log(record,e)
      var updateStepString = ``
      // return
      let _this = this
      if(record.id){
        this.$apollo
          .mutate({
            mutation: gql`
              mutation {
                update_Step(
                  _set: {
                    property:${e}
                  }
                  where: { id: {_eq:"${record.id}"} }
                ) {
                  returning {
                    id
                  }
                }
                ${updateStepString}
              }
            `
          })
          .then(res => {
            console.log(res, 'delete step success')
            _this.loadData()
          })
          .catch(err => {
            console.log(err, 'delete step fail')
          })
        }
    }
  },
  watch: {
    inivisible(newT) {
      console.log(newT)
      this.visibled = newT
      if (newT) {
        this.loadData()
        // if(this.stepType == 1){
        //   this.columns
        // }
      }
    }
  }
}
</script>
<style>
.stepsTable .ant-table-thead > tr > th,
.stepsTable .ant-table-tbody > tr > td {
  padding: 8px 8px;
}
.ProjectType .borderHidden,
.ProjectType .borderHidden:hover,
.ProjectType .borderHidden:focus {
  border: 0;
  box-shadow: none;
  outline: none;
}
</style>


