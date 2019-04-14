<template>
  <a-row>
    <a-modal :title="title" v-model="visibled" :maskClosable="maskClosable" :width="550" @cancel="cancel" class="ProjectType">
      <a-row>
        <a-col :span="5" style="line-height: 31px;">
          <label title="项目名称" class="ant-form-item-required">档案号：</label>
        </a-col>
        <a-col :span="15">
          <a-input v-model="outcomeDocumentNo"/>
        </a-col>
      </a-row>
      <a-row style="margin-top:10px">
        <a-col :span="5" style="line-height: 31px;">成果文件编号：</a-col>
        <a-col :span="15">
          <a-input v-model="documentNo"/>
        </a-col>
      </a-row>
      <a-row style="margin-top:10px">
        <a-col :span="5">归档检查：</a-col>
        <a-col :span="15">
          <a-checkbox-group @change="finishCheck" :value="documentCheck">
            <a-checkbox value="合同文件">合同文件</a-checkbox>
            <a-checkbox value="成果文件">成果文件</a-checkbox>
            <a-checkbox value="项目资料">项目资料</a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>
      <a-row style="margin-top:20px">
        <h3>结项情况</h3>
        <a-table :columns="columns" :dataSource="data" size="small" :bordered="false"></a-table>
      </a-row>
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">确认</a-button>
        <a-button key="empty" @click="cancel">取消</a-button>
      </template>
    </a-modal>
  </a-row>
</template>
<script>



import { getNo } from '@/utils/code'


export default {
  name: 'FinishDialog',
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
    businessType: {
      type:String,
      default:'',
    }
  },
  data() {
    return {
      title: this.inititle,
      visibled: this.inivisible,
      data: [],
      documentCheck:[],
      outcomeDocumentNo:'',
      documentNo:'',
      columns: [
        { title: '子项目名称', dataIndex: 'name' },
        {
          title: '项目负责人',
          dataIndex: 'principal'
        },
        {
          title: '状态',
          dataIndex: 'status'
        }
      ]
    }
  },
  //   created() {},
  methods: {
    handleOk() {
      console.log(this.documentCheck)
      if(!this.documentNo){
        this.$message.warning('请输入档案号！')
        return
      }
      var data = {
        documentCheck:this.documentCheck.join(','),
        outcomeDocumentNo:this.outcomeDocumentNo,
        documentNo:this.documentNo
      }
      this.$emit('changeStatus', { visibled: false, data: [data] })
    },
    cancel() {
      this.$emit('changeStatus', { visibled: false })
    },
    finishCheck(e){
      console.log(e)
      this.documentCheck = e
    }
  },
  watch: {
    async inivisible(newT) {
      console.log(newT)
      this.visibled = newT
      if(newT){
        this.documentNo = ''
        this.outcomeDocumentNo = ''
        this.documentCheck = []
        var businessTypeArray = this.businessType.split(',')
        if(businessTypeArray.length == 1){
          this.documentNo = await getNo(this.$apollo,3,businessTypeArray[0])
          this.outcomeDocumentNo = await getNo(this.$apollo,4,businessTypeArray[0])
        }else {
          this.documentNo = await getNo(this.$apollo,3)
          this.outcomeDocumentNo = await getNo(this.$apollo,4)
        }
        
        console.log(this.documentNo,this.outcomeDocumentNo,'res,res')
      }

      

      //   if (newT) {
      //      this.value = -2
      //     this.loadData()
      //   }
    }
  }
}
</script>

