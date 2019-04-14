<template>
  <div class="main">
    <a-form class="user-layout-login" ref="formLogin" :form="form" id="formLogin">
      <a-form-item hasFeedback>
        <a-input
          size="large"
          type="text"
          v-decorator="['username',{rules: [{ required: true, message: '请输入帐户名或邮箱地址' }]}]"
          placeholder="帐户名或邮箱地址"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item hasFeedback>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="密码"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }]}]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>
      <!-- <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登陆">
          <a-form-item
            fieldDecoratorId="username"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: this.handleUsernameOrEmail }], validateTrigger: 'change'}"
          >
            <a-input size="large" type="text" placeholder="帐户名或邮箱地址 / admin">
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item
            fieldDecoratorId="password"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}"
          >
            <a-input size="large" type="password" autocomplete="false" placeholder="密码 / admin">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登陆">
          <a-form-item
            fieldDecoratorId="mobile"
            :fieldDecoratorOptions="{rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}"
          >
            <a-input size="large" type="text" placeholder="手机号">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item
                fieldDecoratorId="captcha"
                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}"
              >
                <a-input size="large" type="text" placeholder="验证码">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>-->
      <a-form-item>
        <a-checkbox v-model="formLogin.rememberMe" @change="onChange">记住密码</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn"
        >确定</a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>其他登陆方式</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle"></a-icon>
        </a>
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>-->
    </a-form>

    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>-->
  </div>
</template>

<script>
import md5 from 'md5'
import api from '@/api'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions, mapState } from 'vuex'
import store from '@/store/'
import { timeFix } from '@/utils/util'

import gql from 'graphql-tag'

export default {
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 1,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '',
        mobile: '',
        rememberMe: true
      }
    }
  },
  computed: {
    ...mapState({
      isRemember: state => state.user.isRemember,
      account_password: state => state.user.account_password
    })
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    console.log(this.form, 'this.form this.form this.form ')
  },
  created() {
    console.log(this.isRemember, this.account_password, 'accountcreated')
    this.formLogin.rememberMe = this.isRemember
    // console.log(this.form)
    // this.autoFormCreate()
    setTimeout(this.autoFormCreate, 1000)

    this.$http
      .get('/auth/2step-code')
      .then(res => {
        // debugger
        this.requiredTwoStepCaptcha = res.result.stepCode
      })
      .catch(err => {
        console.log('2step-code:', err)
      })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    autoFormCreate() {
      // this.form = form
      if (this.formLogin.rememberMe) {
        this.form.setFieldsValue({ username: this.account_password.username })
        this.form.setFieldsValue({ password: this.account_password.password })
      } else {
        this.form.setFieldsValue({ username: '' })
        this.form.setFieldsValue({ password: '' })
      }
    },
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit() {
      // debugger
      const that = this
      let flag = false
      // let _this = this
      let loginParams = {
        remember_me: that.formLogin.rememberMe
      }

      // 使用账户密码登陆
      if (that.customActiveKey === 'tab1') {
        that.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
          if (!err) {
            flag = true
            loginParams[!that.loginType ? 'email' : 'username'] = values.username
            console.log(values)
            loginParams.password = md5(values.password)
            // console.log(store)
            store.commit('SET_REMEMBER', that.formLogin.rememberMe)
            store.commit('SET_ACCOUNT_PASSWORD', { username: values.username, password: values.password })
          }
        })
        // 使用手机号登陆
      } else {
        that.form.validateFields(['mobile', 'captcha'], { force: true }, (err, values) => {
          if (!err) {
            flag = true
            loginParams = Object.assign(loginParams, values)
          }
        })
      }

      if (!flag) return

      that.loginBtn = true

      loginParams.$apollo = this.$apollo
      that
        .Login(loginParams)
        .then(res => {
          // if (that.requiredTwoStepCaptcha) {
          if (res) {
            that.requestFailed({ response: { data: { message: '密码或账号错误' } } })
            return
          }

          that.stepCaptchaVisible = true
          // } else {
          that.loginSuccess()
          // }
        })
        .catch(err => {
          that.requestFailed(err)
        })
    },
    getCaptcha(e) {
      e.preventDefault()
      const that = this

      this.form.validateFields(['mobile'], { force: true }, err => {
        if (!err) {
          this.state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          this.$http
            .post(api.SendSms, { mobile: that.formLogin.mobile })
            .then(res => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              that.state.time = 60
              that.state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess() {
      this.loginBtn = false
      this.$router.push({ name: 'home' })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loginBtn = false
    },
    onChange(e) {
      console.log(this.isRemember, this.account_password, 'account')
      console.log(`checked = ${e.target.checked}`)
      console.log(this.form.getFieldValue('password'))
    }
  }
}
</script>

<style lang="scss" scoped>

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #5873c9;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>