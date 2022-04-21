<template>
  <div class="register_container">
    <div class="register_box">
      <!-- 标题区域 -->
      <div class="title_box">
        <h1>regist</h1>
      </div>
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/common/tx.png">
      </div>
      <!-- 注册表单区域 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerFormRules"
        label-width="0px"
        class="register_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            clearable
            prefix-icon="el-icon-user-solid"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
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
            @click="register"
          >注册</el-button>
          <el-button
            type="info"
            round
            @click="goBack"
          >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  data () {
    return {
      registerForm: {
        username: '',
        password: ''
      },
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' }
        ]
      }
    }
  },
  created: function () {
    this.$notify.info({
      title: '消息',
      message: '现在是注册界面哦',
      duration: 3000
    })
  },
  beforeCreate () { },
  methods: {
    goBack () {
      this.$router.push('/login')
    },
    register () {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        await register(this.registerForm)
        this.$message.success('注册成功 现在登录吧~')
        this.$router.push('/login')
      })
    }
  },
  beforeUnmount () { }
}
</script>

<style lang="scss" scoped>
.register_container {
  height: 100%;
  background: url("~@/assets/common/bg.png") center / cover;
}
.register_box {
  width: 40%;
  height: 350px;
  background-color: rgba(75, 81, 95, 0.75);
  box-shadow: 7px 7px 17px rgba(52, 66, 58, 0.5);
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

  .register_form {
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
