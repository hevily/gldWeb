<template>
  <div class="departManage">
    <a-row>
      <a-col :span="8" style="border-right: solid 0px #e8e8e8; padding-right: 20px">
        <div style="height:40px">
          <a-input-search type="text" placeholder="部门名称" style="width: 100%;" @search="onSearch"/>
        </div>
        <div class="treeDiv">
          <a-tree
            :treeData="departs"
            @select="onSelect"
            @expand="onExpand"
            defaultExpandAll
            :defaultSelectedKeys="selectedDepart"
            :selectedKeys="selectedDepart"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
          >
            <a-icon slot="home" type="home" style="color:#78bb60;font-weight: bolder;"/>
            <a-icon slot="team" type="team" style="color:#78bb60;font-weight: bolder;"/>
            <div slot="title" slot-scope="{title, key}" style="position:relative;float:right;width:200px">
              {{title}}
              <span style="position:absolute;right:10px;top:0px;color:#78bb60" v-if="key == id">
                <a-icon class="depart-button" type="plus" @click="createDepart()"/>
                <a-icon class="depart-button" type="edit" @click="editDepart()"/>
                <a-icon class="depart-button" type="delete" @click="deleteDepart(title)"/>
              </span>
            </div>
          </a-tree>
        </div>
      </a-col>
      <a-col :span="16">
        <!-- 操作栏 -->
        <a-row :style="{marginBottom: '12px'}">
          <a-col :span="11">
            <a-button class="ant-button" icon="plus" @click="createEmployee">添加员工</a-button>
          </a-col>
          <a-col :span="5" style="line-height: 32px">
            <a-checkbox v-model="includeChild">显示子部门</a-checkbox>
          </a-col>
          <a-col :span="8">
            <div :style="{float: 'right',width: '100%',maxWidth:'400px'}">
              <a-input-search
                placeholder="姓名"
                @search="onEmployeeSearch"
                enterButton="搜索"
              />
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-table
            :size="size"
            :bordered="bordered"
            :loading="loading"
            :columns="columns"
            :dataSource="current"
            :rowKey="record => record.id"
            :pagination="pagination"
            :customRow="changeRow"
            :rowSelection="rowSelection"
            :scroll="{ x: 910 }"
          >
            <div slot="action" slot-scope="text,record,index">
              <a @click="editEmployee(record)"><a-icon class="depart-button" type="edit"/></a>
              <a @click="deleteEmployee(record)"><a-icon class="depart-button" type="delete"/></a>
              <!--<a class="font-blue" style="margin-right:5px" @click="goContractFund(record)" v-if="$auth('contact-money')">编辑</a>-->
              <!--<a class="font-blue" style="margin-right:5px" @click="deleteContract(record)" v-if="$auth('delete-contract')">删除</a>-->
            </div>
          </a-table>
        </a-row>
      </a-col>
    </a-row>

    <!-- 新建部门弹框 -->
    <DepartCreate :inititle="departTitle" :initvisibled="openDepart" @addDepart="addDepart" @cancel="cancel" :name="departName"/>

    <!-- 新建员工弹框 -->
    <EmployeeCreate
      :inititle="employeeTitle"
      :treeData="departs"
      :departmentId="departmentId"
      :initvisibled="openEmployee"
      @addEmployee="addEmployee"
      @cancel="cancelEmployee"
      :name="employeeFields.name"
      :mobile="employeeFields.mobile"
      :sex="employeeFields.sex"
      :job="employeeFields.job"
      :title="employeeFields.title"
      :mode="employeeMode"
    />

  </div>
</template>

<script>
  // import { colorList } from '@/components/tools/setting'
  // import ASwitch from 'ant-design-vue/es/switch'
  // import AList from 'ant-design-vue/es/list'
  // import AListItem from 'ant-design-vue/es/list/Item'
  import DepartCreate from '@/components/dialog/account/setting/DepartCreateDialog'
  import EmployeeCreate from '@/components/dialog/account/setting/EmployeeCreateDialog'
  import { mixin } from '@/utils/mixin.js'
  // import moment from 'moment'
  import { db } from '@/utils/db.js'
  import { ArrayToString } from '@/utils/util.js'
  // import uuid from 'uuid'

  export default {
    components: {
      DepartCreate,
      EmployeeCreate
    },
    mixins: [mixin],
    props: {
    },
    data () {
      return {
        bordered: true,
        size: 'small',
        rowKey: 'no',
        filterWhere: '', //过滤条件
        searchWhere: '', //搜索条件
        where: '',       //最终查询条件
        loading: false, //加载动态
        pageSizeOptions: ['10', '20', '30'],
        total: 0,
        currentPageSize: 10,
        defaultCurrent: 1,
        sortParams: {}, //排序参数
        queryParam: {},
        columns: [
          {
            title: '姓名',
            width: 110,
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '性别',
            width: 60,
            dataIndex: 'sex',
            customRender: (value) => {
              let desc = ''
              switch (value) {
                case 0:
                  desc = '男'
                  break
                case 1:
                  desc = '女'
                  break
              }
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '职务',
            width: 140,
            dataIndex: 'job'
          },
          {
            title: '部门',
            width: 160,
            dataIndex: 'department.name'
          },
          {
            title: '角色',
            width: 120,
            align: 'center',
            dataIndex: 'roles',
            key: 'roles',
            customRender: (value) => {
              let desc = ''
              value.forEach(ele => {
                desc += ele.role.name + ','
              })
              if(desc !== ''){
                desc = desc.substr(0, desc.length - 1)
              }
              return {
                children: desc,
                attrs: {},
              }
            }
          },
          {
            title: '手机号',
            width: 180,
            align: 'center',
            dataIndex: 'mobile',
            key: 'mobile'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '50px',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        current: [],
        pagination: {},
        selectedDepart: [''],
        departRecord: {},
        autoExpandParent: true,
        expandedKeys: [],
        openDepart: false,
        openEmployee: false,
        visible: false,
        isOne: false,
        includeChild: true,
        employeeType: 1, //1显示员工 2只显示部门
        emTitle: '选择角色成员',
        departTitle: '新增部门',
        departMode: 1, //1新增 2编辑
        employeeTitle: '新增员工',
        employeeMode: 1, //1新增 2编辑
        employeeFields: {       //编辑字段
          name: {
            value: ''
          },
          mobile: {
            value: ''
          },
          sex: {
            value: ''
          },
          job: {
            value: ''
          },
          title: {
            value: ''
          }
        },
        defaultChecked: false,
        company: {},
        id: '',
        departmentId: '',
        employeeId: '',
        name: '',
        departName: {},
        allChildren: [],
        checkedList: [],
        dbConn: null,
        data: [],
        departs: [],
        departMap: {}
      }
    },
    created() {
      //初始化数据库连接
      this.dbConn = new db(this.$apollo)
      //加载角色列表
      this.loadAllDepart()
    },
    methods: {
      //显示人员或部门弹框
      showEModal() {
        this.visible = true
      },
      //人员/部门弹框状态改变
      changeEMStatus(obj) {
        console.log(obj)
        this.visible = obj.visibled
        this.members = obj.data
      },
      onChange (child, e) {
        console.log(child, e)
        if(child && child.children){
          const setCheck = (children, e) => {
            children.forEach(ele => {
              const p = this.checkedList.indexOf(ele.id)
              if(e.target.checked && p === -1){
                this.checkedList.push(ele.id)
              }else if(!e.target.checked && p > -1){
                this.checkedList.splice(p, 1)
              }
              if(ele.children && ele.children.length > 0){
                setCheck(ele.children, e)
              }
            })
          }
          setCheck(child.children, e)
        }
      },
      createDepart(){
        this.departMode = 1
        this.departTitle = '新增部门'
        this.openDepart = true
      },
      editDepart(){
        this.departMode = 2
        this.departTitle = '编辑部门'
        this.openDepart = true
      },
      createEmployee(){
        this.employeeMode = 1
        this.employeeTitle = '新增员工'
        this.openEmployee = true
      },
      editEmployee(record){
        this.employeeMode = 2
        this.employeeTitle = '编辑员工'
        this.employeeId = record.id
        this.departmentId = record.department_id
        this.employeeFields = {
          name: {
            value: record.name
          },
          mobile: {
            value: record.mobile
          },
          sex: {
            value: record.sex
          },
          job: {
            value: record.job
          },
          title: {
            value: (record.title||'').split(',')
          }
        }
        this.openEmployee = true
      },
      async addDepart(name){
        let gql = ``
        let id = ''
        let res
        if(this.departMode === 1){
          gql = `
            mutation {
              insert_Department(objects: {
                  name: "${name}"
                  parent_id: "${this.id}"
                  company_id: "${this.company.id}"
                }){
                  returning {
                    id
                  }
                }
              }
          `
          res = await this.dbConn.mutation(gql)
          id = res.data.insert_Department.returning[0].id
        }else{
          gql = `
            mutation {
              update_Department (where: {id: {_eq: "${this.id}"}}, _set: {
                name: "${name}"
              }){
                affected_rows
                returning {
                  id
                }
              }
            }
          `
          res = await this.dbConn.mutation(gql)
          id = res.data.update_Department.returning[0].id
        }

        if(res.data){
          this.loadAllDepart()
          this.selectedDepart = [`${id}`]
          this.id = id
          this.allChildren = []
          this.loadEmployeeList()
          this.openDepart = false
        }else{
          this.$message.error('保存失败，请重试')
        }
      },
      cancel(){
        this.openDepart = false
      },
      cancelEmployee(){
        this.openEmployee = false
      },
      async deleteDepart(name){
        const _this = this
        this.$confirm({
          title: '删除部门',
          content: `你确定删除部门【${name}】吗？`,
          async onOk() {
            const res = await _this.dbConn.mutation(`
              mutation {
                delete_Department(where: {id: {_eq: "${_this.id}"}}){
                  returning {
                    id
                  }
                }
              }
            `)

            if(res.data){
              _this.loadAllDepart()
            }else{
              _this.$message.error('删除失败，请重试')
            }
          },
          onCancel() {
          }
        })
      },
      async deleteEmployee(record){
        const _this = this
        this.$confirm({
          title: '删除员工',
          content: `你确定删除员工【${record.name}】吗？`,
          async onOk() {
            const res = await _this.dbConn.mutation(`
              mutation {
                delete_Employee(where: {id: {_eq: "${record.id}"}}){
                  returning {
                    id
                  }
                }
              }
            `)

            if(res.data){
              _this.loadEmployeeList()
            }else{
              _this.$message.error('删除失败，请重试')
            }
          },
          onCancel() {
          }
        })
      },
      async addEmployee(record){
        let gql = ''
        let res
        //新增员工
        if(this.employeeMode === 1){
          gql = `
            mutation {
              insert_Employee(objects: {
                  name: "${record.name}"
                  username: "${record.mobile}"
                  mobile: "${record.mobile}"
                  password: "e10adc3949ba59abbe56e057f20f883e"
                  sex: ${record.sex}
                  job: "${record.job}"
                  title: "${record.title.join(',')}"
                  department_id: "${record.departmentId}"
                }){
                  returning {
                    id
                  }
                }
              }
          `
          res = await this.dbConn.mutation(gql)
        }else{ //修改员工
          gql = `
            mutation {
              update_Employee(where: {id: {_eq: "${this.employeeId}"}}, _set: {
                  name: "${record.name}"
                  mobile: "${record.mobile}"
                  sex: ${record.sex}
                  job: "${record.job || ''}"
                  title: "${record.title.join(',')}"
                  department_id: "${record.departmentId}"
                }){
                  returning {
                    id
                  }
                }
              }
          `
          res = await this.dbConn.mutation(gql)
        }

        if(res.data){
          this.loadEmployeeList()
          this.openEmployee = false
        }else{
          this.$message.error('保存失败，请重试')
        }
      },
      // 加载角色列表
      async loadAllDepart(){
        const res = await this.dbConn.query(`
          query{
              Department(where: {}, order_by: [{name: asc}]) {
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
                parent {
                  id
                  name
                }
              }
          }
        `)
        var _data = res.data.Department
        this.company = _data[0].company
        this.departs = [{
          title: _data[0].company.name,
          key: _data[0].company.id,
          value: _data[0].company.id,
          type: 1,
          slots: { icon: 'home' },
          children: this.toTree(res.data.Department)
        }]
        this.departMap[_data[0].company.id] = this.departs[0]
      },
      //节点数据处理
      toTree(data) {
        // 删除 所有 children,以防止多次调用
        // var that = this
        // var _data = []
        data.forEach(function(item) {
          // var iobj = {};
          item.title = item.name
          item.key = item.id
          item.value = item.id
          item.slots = { icon: 'team' }
          item.scopedSlots = { title: 'title' }
          item.type = 2
          delete item.children
        })

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        const map = {}
        data.forEach(function(item) {
          // item.children = item.employees
          map[item.id] = item
        })
        this.departMap = map
        //        console.log(map);
        const val = []
        data.forEach(function(item) {
          // 以当前遍历项，的pid,去map对象中找到索引的id
          item.parent = item.parent || {}
          const parent = map[item.parent.id]
          if (parent) {
            (parent.children || (parent.children = [])).push(item)
          } else {
            val.push(item)
          }
        })
        return val
      },
      getAllChildren(node){
        const _this = this
        if (node && node.children) {
          node.children.forEach(ele => {
              _this.allChildren.push(ele.key)
              _this.getAllChildren(ele)
          })
        }
      },
      onSelect(selectedKeys, info) {
        console.log(selectedKeys, info)
        if(selectedKeys.length > 0){
          this.id = selectedKeys[0]
          this.departmentId = this.id
          this.name = info.node.dataRef.title
          this.departName = {
            value: info.node.dataRef.title
          }
          // this.departRecord = {
          //   id: selectedKeys[0],
          //   name: info.node.dataRef.title
          // }
          this.allChildren = []
          this.getAllChildren(this.departMap[selectedKeys[0]])
          this.loadEmployeeList()
        }
        this.selectedDepart = selectedKeys
      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      search(node, val){
        if (node && node.children) {
          for(var i = 0; i < node.children.length; i++){
            const ele = node.children[i]
            if(ele.title.indexOf(val) > -1){
              this.id = ele.key
              this.departmentId = this.id
              this.name = ele.title
              this.departName = {
                value: ele.title
              }
              this.selectedDepart = [ele.key]
              this.expandedKeys = [ele.key]
              this.autoExpandParent = true
              this.loadEmployeeList()
              break
            }
            this.search(ele, val)
          }
        }
      },
      onSearch (value) {
        console.log(value)
        const val = (value || '').trim()
        this.search(this.departs[0], val)
        // for(let i= 0; i < this.departs[0].children.length; i++){
        //   const ele = this.departs[0].children[i]
        //   if(ele.title.indexOf(val) > -1){
        //     this.id = ele.key
        //     this.selectedDepart = [ele.key]
        //     this.expandedKeys = [ele.key]
        //     this.autoExpandParent = true
        //     this.loadEmployeeList()
        //     break
        //   }
        // }
      },
      //接口获取数据
      async loadEmployeeList() {
        this.where = this.filterWhere + this.searchWhere
        const _this = this
        const skip = (this.defaultCurrent - 1) * this.currentPageSize
        const departs = this.includeChild ? this.allChildren: []
        departs.push(this.id)
        const gql = `
          query employeeList($skip: Int!, $pageSize: Int!) {
            Employee_aggregate(where: {department_id: {_in: ${ArrayToString(departs)}}, ${this.where}}) {
              aggregate {
                count
              }
            }

            Employee(where: {department_id: {_in: ${ArrayToString(departs)}}, ${this.where}}, offset: $skip, limit: $pageSize, order_by: []) {
              id
              name
              sex
              job
              title
              mobile
              department_id
              department {
                id
                name
              }
              roles {
                role {
                  id
                  name
                }
              }
            }
          }
          `
        const res = await this.dbConn.query(gql, {
          skip: parseInt(skip),
          pageSize: parseInt(this.currentPageSize)
        })
        if(res.data.Employee.length > 0){
          console.log(res,'res')
          _this.total = res.data.Employee_aggregate.aggregate.count
          _this.current = res.data.Employee
          _this.pagination = _this.pager()
          _this.loading = res.loading
        }else{
          _this.total = 0
          _this.defaultCurrent = 1
          _this.current = []
          _this.pagination = _this.pager()
          _this.loading = false
        }
      },
      onPagerChange(page, pageSize) {
        this.defaultCurrent = page
        this.currentPageSize = pageSize || 10
        this.loading = true
        this.loadEmployeeList()
      },
      onPagerSizeChange(current, size) {
        // console.log(current, size,'changeSize');
        // debugger
        this.defaultCurrent = current
        this.currentPageSize = size
        this.loading = true
        this.loadEmployeeList()
      },
      pager() {
        return {
          total: this.total,
          showTotal: total => `共有 ${total} 条`,
          showSizeChanger: true,
          pageSizeOptions: this.pageSizeOptions,
          pageSize: this.currentPageSize,
          defaultCurrent: this.defaultCurrent,
          // onChange: this.onPagerChange,
          onShowSizeChange: this.onPagerSizeChange
        }
      },
      onEmployeeSearch(value) {
        // alert(value)
        if(value !== ''){
          this.searchWhere = `
          _or: [
            {name: {_like: "%${value}%"}},
            {mobile: {_like: "%${value}%"}}
           ]
          `
        }else{
          this.searchWhere = ``
        }
        this.defaultCurrent = 1
        this.loadEmployeeList()
      },
      //表格单元格自定义函数
      changeRow(record, index) {
        return {
          props: {},
          style: {
            // backgroundColor:this.selectedIndex == index ? 'yellow':''
          },
          attrs: {
            id: record.id
          },
          ref: record.id,
          // refInFor: true,
          on: {
            // 事件
            click: () => {
              // 鼠标移入行,改变状态
              var allChildren = document.getElementById(record.id).parentNode.children
              for (var i = 0; i < allChildren.length; i++) {
                if (i == index) {
                  // console.log(allChildren[i].className = allChildren[i].className + ' dd' )
                  allChildren[i].style.backgroundColor = '#ffe48d'
                } else {
                  allChildren[i].style.backgroundColor = 'white'
                }
              }
            },
            mouseover: () => {
              // 鼠标移入行,改变状态
              // console.log(record,index,'index2')

              // this.moveStar = record.contractNo
              // console.log(this.dataset)
            },
            mouseout: () => {
              // 鼠标移入行,改变状态
              // console.log(record,index,'index3')
              // this.moveStar = false
            }
          }
        }
      },
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
  .treeDiv {
    height: 400px;
    border: 1px solid #e8e8e8;
    overflow: auto;
    padding: 5px;
    border-radius: 4px;
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
  .auth-div {
    margin-bottom: 10px;
  }
  .auth-title {
    padding-top: 5px;
    border-bottom: 1px solid rgb(233, 233, 233);
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .auth-parent {
    font-size: 13px;
    font-weight: bold;
  }
  .auth-item {
    font-size: 13px;
  }

  .ant-form-item {
    margin-bottom: 0px;
  }

  .fixWidth {
    width: 460px;
    font-size: 13px;
    /*padding-left: 10px;*/
    margin-top: 2px;
    margin-bottom: 5px;
  }

  .auth-item .ant-checkbox-wrapper  {
    margin-left: 0px;
  }

  .depart-button {
    color: #78bb60;
    padding-right: 3px;
  }
</style>