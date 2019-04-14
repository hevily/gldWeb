<template>
  <div class="page-header-index-wide">
    <div class="documentPage">
      <a-card :loading="loading" :bordered="false" :body-style="{padding: '0',minWidth:'1150px'}">
        <a-tabs
          default-active-key="1"
          size="large"
          :tab-bar-style="{marginBottom: '12px', paddingLeft: '0'}"
        >
          <!-- <template slot="tabBarExtraContent">
            <a-row>
              <a-col :span="8">
                <span>当前目录下：</span>
                <span>
                  <a-icon type="folder" style="color:#debd22" theme="filled"/>当前文件夹
                  <span style="color:#fa8564">5</span>个
                </span>
              </a-col>
              <a-col :span="8"></a-col>
              <a-col :span="8">
                <a-row style="font-size:12px;margin-top:10px">
                  <a-col
                    :span="24"
                    style="height:20px;line-height:20px"
                  >企业总容量：500.00G 已使用：0.67G 已使用历史：0.30G</a-col>
                  <a-col :span="21" style="height:20px;line-height:20px">
                    <a-progress :percent="50" status="active" :showInfo="false"/>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </template> -->
          <a-tab-pane loading="true" :tab="title" key="1">
            <a-row>
              <a-col :span="24">
                <a-tabs defaultActiveKey="3" tabPosition="left" :style="{ height: '400px'}">
                  <!-- <a-tab-pane key="1">
                    <div slot="tab">
                      <div>
                        <a-icon type="book" class="tabTitle"/>
                      </div>合同文件
                    </div>Content of tab 1
                  </a-tab-pane> -->
                  <!-- <a-tab-pane key="2">
                    <div slot="tab">
                      <div>
                        <a-icon type="folder-open" class="tabTitle"/>
                      </div>项目文件
                    </div>Content of tab 2
                  </a-tab-pane> -->
                  <a-tab-pane key="3">
                    <div slot="tab">
                      <div>
                        <a-icon type="copy" class="tabTitle"/>
                      </div>公司文件
                    </div>
                    <CompanyFile />
                  </a-tab-pane>
                  <!-- <a-tab-pane key="4">
                    <div slot="tab">
                      <div>
                        <a-icon type="solution" class="tabTitle"/>
                      </div>我的文档
                    </div>Content of tab 4
                  </a-tab-pane> -->
                </a-tabs>
              </a-col>
              <!-- <a-col :span="20">

              </a-col>-->
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import { mapState, mapMutation } from 'vuex'
import CompanyFile from '@/components/document/CompanyFile'

export default {
  name: 'DocumentManage',
  data() {
    return {
      title: '文档管理',
      loading: false
    }
  },
  components:{
    CompanyFile
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    })
  },
  
  created() {},
  methods: {}
}
</script>
<style>
.documentPage .ant-tabs-extra-content {
  width: 85%;
  line-height: 56px;
}

.documentPage .ant-tabs-nav .ant-tabs-tab .tabTitle {
  font-size: 45px;
  margin: 0 5px 5px;
  color: #b7b7b7;
}
.documentPage .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active .tabTitle{
  color: #5873c9;
}
.documentPage .ant-tabs-nav .ant-tabs-tab:hover .tabTitle{
  color: #8197d6;
}
.documentPage .ant-tabs .ant-tabs-left-bar .ant-tabs-nav-wrap{
    background:#f5f5f5
}
.documentPage .ant-tabs .ant-tabs-left-bar .ant-tabs-tab, 
.documentPage .ant-tabs .ant-tabs-right-bar .ant-tabs-tab {
    margin: 0 0 8px 0;
}
</style>


