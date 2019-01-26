<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
    <a-modal
      :title="inititle"
      v-model="visibled"
      @ok="handleOk"
      @cancel="handleOk"
      :maskClosable="maskClosable"
      :width="550"
    >
      <a-row class="add-task_dialog">
        <a-col :span="24">
          <table class="form-table" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <th width="90" class="th-top">
                  <label class="ant-form-item-required">任务：</label>
                </th>
                <td colspan="3">
                  <a-textarea class rows="3" style="width:370px"></a-textarea>
                </td>
              </tr>
              <tr>
                <th width="90">
                  <label class="ant-form-item-required">负责人：</label>
                </th>
                <td>
                  <a-input type="text" style="width:120px" readonly="readonly" placeholder="负责人"/>
                </td>
                <th width="90">
                  <label class="ant-form-item-required">发起人：</label>
                </th>
                <td>
                  <a-input type="text" style="width:120px" readonly="readonly" placeholder="发起人"/>
                </td>
              </tr>
              <tr>
                <th width="90">开始日期：</th>
                <td>
                  <span class="ui-date">
                    <a-date-picker style="width:120px"/>
                  </span>
                </td>
                <th width="90">
                  <label class="ant-form-item-required">截止日期：</label>
                </th>
                <td>
                  <span class="ui-date">
                    <a-date-picker style="width:120px"/>
                  </span>
                </td>
              </tr>
              <tr>
                <th class="th-top" width="90">关联项目：</th>
                <td colspan="3">
                  <a-input type="text" style="width:370px" readonly="readonly" placeholder="所属项目"/>
                  <!--ms-if-->
                </td>
              </tr>
              <tr>
                <th class="th-top" width="90">备注：</th>
                <td colspan="3">
                  <a-textarea style="width:370px" rows="3" placeholder="任务描述"></a-textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    inititle: {
      type: String,
      default: ''
    },
    initvisibled: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    }
    
  },
  data() {
    return {
      visibled: this.initvisibled
    }
  },
  methods: {
    handleOk() {
      //   this.visibled = false
      this.toggle()
    },
    toggle() {
      this.$emit('toggle', false)
    }
  },
  watch: {
    initvisibled(newT, oldT) {
      console.log(newT, oldT, '-------')
      this.visibled = newT
    }
  }
}
</script>
<style>
.ui-w115 {
  width: 115px !important;
}
.form-table th,
.form-table td {
  padding: 5px 0;
  font-size: 14px;
  position: relative;
}
.th-right {
  text-align: right;
}
.th-top {
  padding-top: 9px !important;
  vertical-align: top;
}
.add-task_dialog th {
    text-align: right;
}
</style>

