<template>
  <el-container class="home_container">
    <el-container class="outerContainer">
      <el-main class="outerMain">
        <el-container class="innerContainer">
          <el-header class="innerHeader">
            <el-image
              id="preview-picture"
              style="width: 55px; height: 55px;border-radius: 50%;"
              :src="require('@/assets/common/logo.png')"
              :preview-src-list="[url_picture]"
            />
          </el-header>
          <el-main class="innerMain">
            <el-table
              :data="userList"
              border
              style="width: 100%"
              max-height="510"
              stripe
              :default-sort="{prop: 'uploadtime', order: 'descending'}"
            >
              <el-table-column
                prop="username"
                label="用户名"
                min-width="16%"
                sortable
                align="center"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="nickname"
                label="昵称"
                min-width="16%"
                sortable
                align="center"
              />
              <el-table-column
                prop="email"
                label="邮箱"
                min-width="20%"
                sortable
                align="center"
              />
              <el-table-column
                prop="used"
                label="已使用"
                min-width="16%"
                sortable
                align="center"
              >
                <template v-slot:default="scope">
                  <span>{{ formatBytes(scope.row.used) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="space"
                label="储存空间"
                min-width="16%"
                sortable
                align="center"
              >
                <template v-slot:default="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="openSpaceDialog(scope.row)"
                  >
                    {{ formatBytes(scope.row.space) }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="16%"
                align="center"
              >
                <template v-slot:default="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="closeUser(scope.row)"
                  >注销</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-dialog
              :visible.sync="spaceDialog"
              title="修改存储空间"
              :destroy-on-close="true"
              center
            >
              <el-form
                ref="spaceForm"
                :inline="true"
                :model="spaceForm"
                :rules="spaceRules"
                class="demo-form-inline"
              >
                <el-form-item
                  label="大小："
                  prop="userSpace"
                >
                  <el-input
                    v-model.number="spaceForm.userSpace"
                    class="spaceipt"
                    placeholder="数值"
                    type="number"
                  />
                </el-form-item>
                <el-form-item prop="unit">
                  <el-select
                    v-model="spaceForm.unit"
                    class="unitselect"
                  >
                    <el-option
                      label="B"
                      :value="1"
                      default
                    />
                    <el-option
                      label="KB"
                      :value="1024"
                    />
                    <el-option
                      label="MB"
                      :value="1024*1024"
                    />
                    <el-option
                      label="GB"
                      :value="1024*1024*1024"
                    />
                    <el-option
                      label="TB"
                      :value="1024*1024*1024*1024"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="changeSpace"
                  >更改</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import { getAllUsers, changeSpace, closeUser } from '@/api/admin'
export default {
  data () {
    return {
      userList: [],
      url_picture: require('@/assets/common/bg.png'),
      spaceDialog: false,
      spaceForm: {
        userSpace: '',
        unit: 1
      },
      spaceRules: {
        userSpace: [
          { required: true, message: '请输入数值', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请选择单位', trigger: 'blur' }
        ]
      },
      used: '',
      username: ''
    }
  },
  computed: {
  },
  created () {
    this.getAllUsers()
  },
  methods: {
    async getAllUsers () {
      this.userList = await getAllUsers()
      // console.log(this.userList)
    },
    openSpaceDialog (row) {
      this.spaceDialog = true
      this.used = row.used
      this.username = row.username
    },
    changeSpace () {
      this.$refs.spaceForm.validate(async (ok) => {
        if (ok) {
          const newSpace = this.spaceForm.userSpace * this.spaceForm.unit
          // console.log(newSpace)
          if (newSpace < this.used) return this.$message.error('存储空间不能小于已使用空间！')
          await changeSpace({
            space: newSpace,
            username: this.username
          })
          this.$refs.spaceForm.resetFields()
          this.spaceDialog = false
          this.$message.success('更新存储空间成功！')
          this.getAllUsers()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async closeUser (row) {
      try {
        await this.$confirm('确定注销该用户吗？')
        localStorage.removeItem(row.username)
        localStorage.removeItem(row.username + 'Av')
        await closeUser({
          avatar: row.user_pic,
          username: row.username,
          u_id: row.u_id
        })
        this.$message.success('注销用户成功！')
        this.getAllUsers()
      } catch (err) {
        console.log(err)
      }
    },
    formatBytes (size) {
      var units = [' B', ' KB', ' MB', ' GB', ' TB']
      for (var i = 0; size >= 1024 && i < 4; i++) { size /= 1024 }
      return size.toFixed(2) + units[i]
    }
  }
}
</script>
<style lang="scss" scope>
.home_container {
  height: 100%;
  .outerMain {
    margin: 35px;
    border-radius: 10px;
    background-color: rgba(135, 132, 173, 0.7);
    .innerContainer {
      display: flex;
      height: 100%;
      flex-direction: column;
      .innerHeader {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}

.spaceipt {
  max-width: 90px;
}

.unitselect {
  max-width: 70px;
}

.demo-form-inline {
  width: 325px;
  margin-left: 50%;
  transform: translateX(-50%);
}

input[type="number"] {
  -moz-appearance: textfield;
  // display: inline-block
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
