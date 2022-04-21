<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 标题区域 -->
      <div class="title_box">
        <h1>login</h1>
      </div>
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img :src="avatar||defaultimg">
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            clearable
            prefix-icon="el-icon-user-solid"
            @input="getAvatar"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            round
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            round
            @click="registerNow"
          >立即注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex' // 引入vuex的辅助函数
export default {
  data () {
    return {
      avatar: '',
      defaultimg: require('@/assets/common/tx.png'),
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created: function () {
    this.$notify.info({
      title: '消息',
      message: '现在是登录界面哦',
      duration: 3000
    })
  },
  methods: {
    ...mapActions(['user/login']),
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        await this['user/login'](this.loginForm)
        this.$message({
          message: `${this.loginForm.username} 欢迎回来~`,
          type: 'success'
        })
        this.$router.push('/')
      })
    },
    registerNow () {
      this.$router.push('/register')
    },
    getAvatar (value) {
      this.avatar = localStorage.getItem(value + 'Av')
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  height: 100%;
  background: url("~@/assets/common/bg.png") center / cover;
}
.login_box {
  width: 40%;
  height: 350px;
  background-color: rgba(75, 81, 95, 0.75);
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .title_box {
    position: absolute;
    left: 50%;
    top: -50%;
    transform: translateX(-50%);
    width: 150px;
    text-align: center;
    font-family: serif;
    color: #fff;
    font-size: 23px;
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    background-color: #eee;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login_form {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    width: 50%;
    bottom: 10%;
  }
  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>
