<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="基本信息">
            <el-form
              ref="infoForm"
              :model="infoForm"
              :rules="infoRules"
              label-width="100px"
              class="infoform"
            >
              <el-form-item
                label="昵称"
                prop="nickname"
              >
                <el-input
                  v-model="infoForm.nickname"
                  placeholder="请输入昵称"
                  style="width:300px"
                />
              </el-form-item>
              <el-form-item
                label="邮箱"
                prop="email"
              >
                <el-input
                  v-model="infoForm.email"
                  placeholder="请输入邮箱"
                  style="width:300px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click="updateInfo('infoForm')"
                >提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="重置密码">
            <el-form
              ref="pwdForm"
              :model="pwdForm"
              :rules="pwdRules"
              label-width="100px"
              class="infoform"
            >
              <el-form-item
                label="原密码"
                prop="oldPwd"
              >
                <el-input
                  v-model="pwdForm.oldPwd"
                  placeholder="请输入原密码"
                  type="password"
                  style="width:300px"
                  show-password
                />
              </el-form-item>
              <el-form-item
                label="新密码"
                prop="newPwd"
              >
                <el-input
                  v-model="pwdForm.newPwd"
                  placeholder="请输入新密码"
                  type="password"
                  style="width:300px"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click="updatePwd('pwdForm')"
                >重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="更新头像">
            <div class="uptx">
              <el-upload
                :action="myAction"
                :headers="headers"
                :limit="1"
                :class="{disabled: fileComputed}"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :on-success="success"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-button
                type="primary"
                size="small"
                class="txbtn"
                @click="updateAvatar"
              >
                保存
              </el-button>
              <el-dialog :visible.sync="dialogVisible">
                <img
                  width="100%"
                  :src="dialogImageUrl"
                  alt=""
                >
              </el-dialog>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { updateUserInfo, updatePassword, updateAvatar } from '@/api/user'
export default {
  data () {
    return {
      fileList: [],
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      headers: { Authorization: store.getters.token },
      infoForm: {
        nickname: '',
        email: ''
      },
      infoRules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: '请填写正确的邮箱格式', trigger: 'blur' }
        ]
      },
      pwdForm: {
        oldPwd: '',
        newPwd: ''
      },
      pwdRules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6~20位之间', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6~20位之间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    fileComputed () {
      return this.fileList.length
    },
    myAction () {
      return process.env.VUE_APP_BASE_API + '/my/uploadavatar'
    }
  },
  methods: {
    updateInfo (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await updateUserInfo(this.infoForm)
          this.$message.success('更新基本资料成功！')
          this.$store.dispatch('user/getUserInfo')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePwd (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.pwdForm.oldPwd === this.pwdForm.newPwd) return this.$message.error('新密码不能与原密码相同！')
          await updatePassword(this.pwdForm)
          this.$message.success('重置密码成功，即将退出重新登陆...')
          setTimeout(() => {
            this.$store.dispatch('user/logout')
            this.$router.push('/login')
          }, 1500)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      this.fileList.pop(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload (file) {
      const IMGlist = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      const isIMG = IMGlist.indexOf(file.type) > -1
      const isLt5M = file.size / 1024 / 1024 <= 5
      if (!isIMG) {
        this.$message.error('上传头像只能是 jpg 、png 、 gif 、bmp 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      this.fileList.push(file)
      return isIMG && isLt5M
    },
    success (res, file, fileList) {
      const url = `http://127.0.0.1:3000${res.data}`
      this.imageUrl = url
    },
    async updateAvatar () {
      // console.log(params)
      // console.log(this.imageUrl)
      await updateAvatar(this.imageUrl)
      localStorage.setItem(store.getters.name + 'Av', this.imageUrl)
      this.$message.success('更新头像成功！')
      this.$store.dispatch('user/getUserInfo')
    }
  }
}
</script>

<style lang="scss" scope>
.infoform {
  margin-top: 20px;
  margin-bottom: -20px;
}

.disabled .el-upload--picture-card {
  display: none;
}

.uptx {
  margin-left: 50px;
  // display: flex;
  .txbtn {
    margin-top: 10px;
    // margin-left: 30px;
    // width: 148px;
  }
}
</style>
