<template>
  <div>
    <a-modal :visible="visibled" :title="title" :footer="null" @cancel="editCancel" :width="650">
      <a-row>
        <!-- client -->
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">委托人：</a-col>
            <a-col :span="20">
              <a-input readonly @click="showClient" v-model="client.name"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">公司名称：</a-col>
            <a-col :span="20">
              <a-input v-model="client.licenseName"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">公司地址：</a-col>
            <a-col :span="20">
              <a-input v-model="client.licenseAddress"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">联系电话：</a-col>
            <a-col :span="7">
              <a-input v-model="client.phone"/>
            </a-col>
            <a-col :span="5" class="lh-30">纳税人识别号：</a-col>
            <a-col :span="8">
              <a-input v-model="client.taxNumber"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">开户行：</a-col>
            <a-col :span="20">
              <a-input v-model="client.bankName"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">帐号：</a-col>
            <a-col :span="20">
              <a-input v-model="client.account"/>
            </a-col>
          </a-row>
        </a-col>

        <!-- invoice -->
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">开票金额：</a-col>
            <a-col :span="7">
              <a-input v-model="amount"/>
            </a-col>
            <a-col :span="1" class="lh-30">元</a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">开票单位：</a-col>
            <a-col :span="20">
              <a-input v-model="issueOffice"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">开票人：</a-col>
            <a-col :span="7">
              <a-input readonly @click="showEmployee" :value="invoicePerson.name"/>
            </a-col>
            <a-col :span="5" class="lh-30">
              <a-checkbox @change="onChange" :checked="sendTask">发起开票任务</a-checkbox>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10" v-if="!sendTask">
          <a-row>
            <a-col :span="4" class="lh-30">发票号：</a-col>
            <a-col :span="20">
              <a-input v-model="invoiceNo"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10" v-if="!sendTask">
          <a-row>
            <a-col :span="4" class="lh-30">附件：</a-col>
            <a-col :span="7">
              <a-upload name="file" :multiple="true" action="//jsonplaceholder.typicode.com/posts/">
                <a-button>
                  <a-icon type="plus"/>上传附件
                </a-button>
              </a-upload>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" class="mb10">
          <a-row>
            <a-col :span="4" class="lh-30">备注：</a-col>
            <a-col :span="20">
              <a-textarea :rows="3" v-model="remark"></a-textarea>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <div :style="{textAlign:'center',marginTop:'10px'}">
        <a-button type="primary" :style="{marginRight:'10px'}" @click="invoiceOk">确定</a-button>
        <a-button type="default" @click="editCancel">取消</a-button>
      </div>
    </a-modal>
    <clientDialog :inivisible="cVisibled" :inititle="cTitle" @changeStatus="clientChange"/>
    <employeeTree :inivisible="eVisibled" :inititle="eTitle" @changeStatus="employeeChange"/>
  </div>
</template>

<script>
import { db } from '@/components/_util/db'
import { mapState } from 'vuex'
import clientDialog from '@/components/dialog/project/clientDialog'
import employeeTree from '@/components/same/employeeTree'

export default {
  name: 'ProjectInvoices',
  props: {
    iVisibled: {
      type: Boolean,
      default: false
    },
    iTitle: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    },
    invoiceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visibled: this.iVisibled,
      title: this.iTitle,
      cVisibled: false,
      cTitle: '选择委托方',
      eVisibled: false,
      eTitle: '添加人员',
      client: {}, //委托人
      sendTask: false, //是否发起开票任务
      invoicePerson: {}, //开票人
      remark: '', //备注
      amount: 0, //开票金额
      invoiceNo: '', //发票号
      issueOffice: '', //开票单位
      dbConn: new db(this.$apollo) //数据库操作
    }
  },
  components: {
    clientDialog,
    employeeTree
  },
  created() {},
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  methods: {
    loadData() {
      let _this = this

     const getData = async (projectId, invoiceId) => {
         var queryString = ''
         var invoice = {}
         var project = {}
         var company = {}
         var res = []
         if(invoiceId){
             queryString = `query {
                 Invoice(where:{id:{_eq:"${invoiceId}"}}){
                    invoiceNo
                    amount
                    client{
                        taxNumber
                        account
                        licenseAddress
                        licenseName
                        bankName
                        name
                        id
                    }
                    remark
                    issueOffice
                    invoicePerson{
                        id
                        name
                    }
                    fileUrl
                }
             }`                                                              
             res =await _this.dbConn.query(queryString)
            //  console.log(res.data.Invoice)
             invoice = res.data.Invoice[0] || {}
         }
         if(projectId){
            queryString = `query {
                Project(where:{id:{_eq:"${projectId}"}}){
                    company_id
                    client{
                        taxNumber
                        account
                        licenseAddress
                        licenseName
                        bankName
                        name
                        id
                    }
                }
            }` 
            res =await _this.dbConn.query(queryString)
            console.log(res.data.Project)
            project = res.data.Project[0] || {}
         }
         if(project.company_id){
            queryString = `query {
                Company(where:{id:{_eq:"${project.company_id}"}}){
                    name
                }
            }` 
            res = await _this.dbConn.query(queryString)
            console.log(res.data.Company)
            company = res.data.Company[0] || {}
         }
         console.log(invoice,company,'invoice,company')
         return {
            invoice,
            project,
            company
         }
     }
   
        getData(this.projectId,this.invoiceId).then(res => {
           console.log(res,'getData')
           _this.initInfo(res)
       })
    
    },
    initInfo(result) {
      console.log(result, this.userInfo,'init info')
      
      if(!this.invoiceId){
        this.issueOffice = result.company.name
        this.client = result.project.client || {}
      }else {
        var obj = result.invoice
        this.remark = obj.remark || ''
        this.issueOffice = obj.issueOffice || ''
        this.invoiceNo = obj.invoiceNo || ''
        this.invoicePerson = obj.invoicePerson || {}
        this.client = obj.client || {}
        this.amount = obj.amount
      }
    },
    //关闭弹框
    editCancel() {
      this.$emit('invoicesCancel', false)
    },

    //显示委托人表格
    showClient() {
      this.cVisibled = true
    },
    //委托人返回结果
    clientChange(obj) {
      console.log(obj, 'change client value')
      this.client = obj.data[0] || {}
      this.cVisibled = false
    },
    //显示开票人节点树
    showEmployee() {
      this.eVisibled = true
    },
    //开票人返回结果
    employeeChange(obj) {
      console.log(obj, 'change client value')
      if (obj.data[0]) {
        this.invoicePerson = {
          id: obj.data[0].key,
          name: obj.data[0].title
        }
      }
      this.eVisibled = false
    },
    //是否发起开票任务
    onChange(e) {
      console.log(e.target.checked)
      this.sendTask = e.target.checked
    },
    invoiceOk() {
      var mutationString = ''
      let _this = this
      if (this.invoiceId) {
        //编辑

        mutationString = `mutation {
            update_Invoice(where:{id:{_eq:"${this.invoiceId}"}},_set:{
                client_id:"${this.client.id || ''}",
                invoiceNo:"${this.invoiceNo}"
                amount:"${this.amount}"
                invoicePerson_id:"${this.invoicePerson.id || ''}"
                remark:"${this.remark}"
                issueOffice:"${this.issueOffice}"
                project_id:"${this.projectId}"
            }){returning {id}}
        }`
        console.log(mutationString)
      } else {
        //新增

        mutationString = `mutation{
            insert_Invoice(objects:[{
                client_id:"${this.client.id || ''}",
                invoiceNo:"${this.invoiceNo}"
                amount:"${this.amount}"
                invoicePerson_id:"${this.invoicePerson.id || ''}"
                remark:"${this.remark}"
                issueOffice:"${this.issueOffice || ''}"
                project_id:"${this.projectId}"
                createdBy_id:"${this.userInfo.id}"
            }]){returning{id}}
        }`
      }

      this.dbConn
        .mutation(mutationString)
        .then(res => {
            if(_this.invoiceId){
                _this.$message.success('编辑开票登记成功')
                _this.$emit('invoicesSave',false)
                console.log(res, 'update invoice success')
            }else {
                _this.$message.success('添加开票登记成功')
                _this.$emit('invoicesSave',false)
                console.log(res, 'add invoice success')
            }
          
        })
        .catch(err => {
           if(_this.invoiceId){
                _this.$message.error('编辑开票登记失败')
                console.log(res, 'update invoice fail')
            }else {
                _this.$message.error('添加开票登记失败')
                console.log(res, 'add invoice fail')
            }
        })
      console.log(mutationString, 'add invoice string')
    }
  },
  watch: {
    iVisibled(newT) {
      this.visibled = newT
      console.log(this.invoiceId, 'invoiceId')
      if (newT) {
        console.log(this.invoiceId, 'invoiceId2')
        this.loadData()
      }
    }
  }
}
</script>

<style>
.lh-30 {
  line-height: 30px;
  text-align: right;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
