<template>
  <el-container class="home_container">
    <el-container class="outerContainer">
      <el-main class="outerMain">
        <el-container class="innerContainer">
          <el-header class="innerHeader">
            <el-upload
              ref="upload_demo"
              class="upload-demo"
              :action="uplaod_action"
              :on-preview="handlePreview"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              multiple
              :headers="myHeaders"
              :limit="30"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :show-file-list="true"
            >
              <!-- 如果指定了一定按钮为trigger，那么剩下的按钮将不会有trigger的作用 -->
              <el-button
                slot="trigger"
                type="primary"
                class="uploadButton"
              ><i class="el-icon-upload el-icon--left" />点击上传</el-button>
              <el-button
                v-if="buttonShow"
                type="success"
                @click="clearFiles"
              ><i class="el-icon-upload el-icon--left" />清空列表</el-button>
              <el-button
                v-if="buttonShow"
                @click="showFileList"
              ><i class="el-icon-upload el-icon--left" />隐藏列表</el-button>
            </el-upload>
            <div class="searchBox">
              <div>
                <el-input
                  v-model="search"
                  placeholder="请输入内容"
                  clearable
                  @clear="backSearch"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="searchFile"
                  />
                </el-input>
              </div>
              <div class="sLogoBox">
                <el-image
                  id="preview-picture"
                  style="width: 55px; height: 55px;border-radius: 50%;"
                  :src="require('@/assets/common/logo.png')"
                  :preview-src-list="[url_picture]"
                />
              </div>
            </div>
          </el-header>
          <el-main class="innerMain">
            <el-table
              :data="showFiles"
              border
              style="width: 100%"
              max-height="510"
              stripe
              :default-sort="{prop: 'uploadtime', order: 'descending'}"
            >
              <el-table-column
                prop="filename"
                label="文件名"
                min-width="50%"
                sortable
                :show-overflow-tooltip="true"
              >
                <template v-slot:default="scope">
                  <svg
                    v-if="imgList.indexOf(scope.row.type) != -1"
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-picture" />
                  </svg>
                  <svg
                    v-else-if="docList.indexOf(scope.row.type) != -1"
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-document" />
                  </svg>
                  <svg
                    v-else-if="videoList.indexOf(scope.row.type) != -1"
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-video" />
                  </svg>
                  <svg
                    v-else-if="torrentList.indexOf(scope.row.type) != -1"
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-torrent" />
                  </svg>
                  <svg
                    v-else-if="musicList.indexOf(scope.row.type) != -1"
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-music" />
                  </svg>
                  <svg
                    v-else
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-other" />
                  </svg>
                  <span style="margin-left: 10px">{{ scope.row.filename }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="size"
                label="大小"
                min-width="17.5%"
                sortable
              />
              <el-table-column
                prop="uploadtime"
                label="上传日期"
                min-width="17.5%"
                sortable
              />
              <el-table-column
                label="操作"
                min-width="15%"
              >
                <template v-slot:default="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="previewFile(scope.row)"
                  >查看</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="downloadFile(scope.row)"
                  >下载</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="shareFile(scope.row)"
                  >分享</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteFile(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <!-- 存一些dialog，防止破坏布局 -->
            <el-dialog
              :visible.sync="dialogVideoVisible"
              :title="video_title"
              :destroy-on-close="true"
            >
              <!-- 设置关闭dialog时自动删除内部元素，这样视频就不会再播放了 -->
              <video-player
                ref="videoPlayer"
                class="video-player vjs-custom-skin"
                :playsinline="true"
                :options="playerOptions"
              />
            </el-dialog>
            <div
              class="div_pdf"
              style="display:fixed"
            >
              <!-- 套一层div为给不同dialog写不同的css做做准备 -->
              <el-dialog
                :visible.sync="dialogPdfVisible"
                :destroy-on-close="true"
                :fullscreen="true"
                :modal="true"
              >
                <ViewPDF :pdf-url="url_pdf" />
              </el-dialog>
            </div>
            <div class="div_music">
              <el-dialog
                :visible.sync="dialogAudioVisible"
                :title="music_title"
                :destroy-on-close="true"
                center
              >
                <audio
                  class="music_box"
                  :src="url_music"
                  type="audio/mpeg"
                  controls="controls"
                />
              </el-dialog>
              <el-dialog
                :visible.sync="dialogShareVisible"
                title="共享链接"
                :destroy-on-close="true"
                width="50%"
                center
                class="share_box"
              >
                <!-- 设置关闭dialog时自动删除内部元素，这样视频就不会再播放了 -->
                <span class="share_link">{{ url_share }}</span>
                <el-button
                  type="text"
                  @click="copy"
                >点击复制链接</el-button>
              </el-dialog>
            </div>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import { mapGetters } from 'vuex'
import ViewPDF from '@/components/ViewPDF'
import store from '@/store'
import { getFile, deleteFile, downloadFile, previewFile, shareFile } from '@/api/file'
const shareUrl = 'http://127.0.0.1:9000'
export default {
  components: {
    ViewPDF
  },
  data () {
    return {
      showFiles: [],
      search: '',
      fileList: [],
      myHeaders: { Authorization: store.getters.token },
      show: true,
      buttonShow: false,
      allRawFile: [],
      imgList: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'ico'],
      docList: ['docx', 'pptx', 'doc', 'ppt', 'txt', 'md', 'xlsx', 'xls', 'pdf'],
      videoList: ['mp4', 'mkv'],
      musicList: ['mp3', 'flac', 'm4a'],
      torrentList: ['torrent'],
      url_picture: require('@/assets/common/bg.png'),
      url_video: '',
      url_pdf: 'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf',
      url_share: '',
      url_music: '',
      video_title: 'video-preview',
      music_title: 'music_preview',
      dialogVideoVisible: false,
      dialogPdfVisible: false,
      dialogAudioVisible: false,
      dialogShareVisible: false,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          // 全屏按钮
          fullscreenToggle: true
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'used',
      'space'
    ]),
    // eslint-disable-next-line vue/return-in-computed-property
    uplaod_action () {
      return process.env.VUE_APP_BASE_API + '/my/upload'
    },
    allFile () {
      var array = []
      for (var i = 0; i < this.allRawFile.length; i++) {
        var file = this.allRawFile[i]
        file.size = this.formatBytes(Number(file.size))
        file.type = file.filename.split('.').pop()
        array.push(file)
      }
      // console.log(array)
      return array
    },
    showFile () {
      if (String(this.$route.path).substr(1) === 'all') return this.allFile // all页面不能用allList直接处理，因为allList中没有other文件的后缀，会导致文件显示不全
      if (String(this.$route.path).substr(1) === 'other') { // 如果是other页面需要单独处理，如果后缀名不在allList中，则加入arrayOther中
        var arrayOther = []
        for (var i = 0; i < this.allFile.length; i++) {
          var fileOther = this.allFile[i]
          if (this.allList.indexOf(fileOther.type) === -1) {
            arrayOther.push(fileOther)
          }
        }
        return arrayOther
      }
      var array = [] // 不是other的情况，List做为一个computed变量已经做出了处理，指向了相应的列表，直接使用即可
      for (var j = 0; j < this.allFile.length; j++) {
        var file = this.allFile[j]
        if (this.List.indexOf(file.type) !== -1) {
          array.push(file)
        }
      }
      // console.log(array)
      return array
    },
    allList () {
      return this.imgList.concat(this.docList).concat(this.musicList).concat(this.torrentList).concat(this.videoList) // concat用来连接两个列表
    },
    List () { // List用来选择哪个文件列表，比如在picture页面时就需要选择imgList
      var type = String(this.$route.path).substr(1)
      if (type === 'all') return this.allList
      if (type === 'picture') return this.imgList
      if (type === 'document') return this.docList
      if (type === 'video') return this.videoList
      if (type === 'torrent') return this.torrentList
      if (type === 'music') return this.musicList
      return null
    }
  },
  created () {
    this.fresh()
  },
  methods: {
    beforeUpload (file) {
      // console.log(file)
      if ((Number(this.used) + file.size) > Number(this.space)) {
        this.$message.error('存储空间不足，文件无法上传！')
        return false
      }
      this.buttonShow = true
    },
    clearFiles () {
      this.$refs.upload_demo.clearFiles()
      this.buttonShow = false
    },
    showFileList () {
      this.show = !this.show
    },
    async handleSuccess (response, file, fileList) {
      if (response.status === 0) {
        await this.fresh()
        this.$store.dispatch('user/getUserInfo')
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
      return file + fileList + response
    },
    handleRemove (file, fileList) {
      return file + fileList
    },
    handlePreview (file) {
      return file
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 30 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    async fresh () {
      const res = await getFile()
      this.allRawFile = res
      this.showFiles = this.showFile
    },
    formatBytes (size) {
      var units = [' B', ' KB', ' MB', ' GB', ' TB']
      for (var i = 0; size >= 1024 && i < 4; i++) { size /= 1024 }
      return size.toFixed(2) + units[i]
    },
    async deleteFile (row) {
      await this.$confirm('确定删除该文件吗？')
      await deleteFile(row.filename)
      this.$message({ message: '删除成功！', type: 'success' })
      await this.fresh()
      this.$store.dispatch('user/getUserInfo')
    },
    downloadFile (row) {
      const filename = row.filename
      downloadFile({ filename }, 'blob').then(res => {
        // console.log(res)
        const blob = new Blob([res])
        const link = document.createElement('a')// 创建a标签
        link.download = filename// a标签添加属性
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()// 执行下载
        URL.revokeObjectURL(link.href) // 释放url
        document.body.removeChild(link)// 释放标签
      }, err => {
        console.log(err)
      })
    },
    async previewFile (row) {
      const filename = row.filename
      const res = await previewFile({ filename })
      // console.log(res)
      if (row.type === 'jpg' || row.type === 'png' || row.type === 'gif' || row.type === 'ico') {
        this.url_picture = process.env.VUE_APP_BASE_API + res
        const link = document.getElementById('preview-picture')
        link.click()
      } else if (row.type === 'mp4') {
        this.playerOptions.sources[0].src = process.env.VUE_APP_BASE_API + res // vue-video-player需要这样动态绑定src，直接在里面用变量不行
        this.video_title = row.filename
        this.dialogVideoVisible = true
      } else if (row.type === 'pdf') {
        this.dialogPdfVisible = true
        this.url_pdf = process.env.VUE_APP_BASE_API + res
      } else if (row.type === 'mp3' || row.type === 'm4a') {
        this.dialogAudioVisible = true
        this.music_title = row.filename
        this.url_music = process.env.VUE_APP_BASE_API + res
      } else {
        this.$message({ message: '该文件暂时不支持预览哦~', type: 'error' })
      }
      // console.log(res)
    },
    async shareFile (row) {
      const filename = row.filename
      const res = await shareFile({ filename })
      this.url_share = shareUrl + res
      this.dialogShareVisible = true
      const Fname = res.substr(store.getters.name.length + 8)
      const shareF = {}
      shareF[Fname] = filename
      // console.log(shareF)
      localStorage.setItem(store.getters.name, JSON.stringify(shareF))
      // console.log(this.url_share)
    },
    copy () {
      var tag = document.createElement('input')
      tag.setAttribute('id', 'cp_input')
      tag.value = this.url_share
      document.getElementsByTagName('body')[0].appendChild(tag)
      document.getElementById('cp_input').select()
      document.execCommand('copy')
      document.getElementById('cp_input').remove()
      this.$message.success('复制成功，快向朋友分享吧！')
      this.dialogShareVisible = false
    },
    searchFile () {
      var reg = new RegExp(this.search, 'i')
      var arr = []
      for (var i = 0; i < this.allFile.length; i++) {
        if (reg.test(this.allFile[i].filename)) {
          arr.push(this.allFile[i])
        }
      }
      this.showFiles = arr
    },
    backSearch () {
      this.showFiles = this.showFile
    }
  }
}
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
}
.outerContainer {
  overflow: hidden;
}

.outerMain .innerContainer[data-v-333ea9dc] {
  height: 110%;
}
::v-deep .outerMain {
  height: 92.5%;
  border-radius: 10px;
  background-color: rgba(135, 132, 173, 71%);
  overflow: hidden;
  .innerContainer {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    .innerHeader {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .upload-demo {
        display: flex;
        align-self: flex-start;
        position: relative;
        z-index: 1;
        .uploadButton {
          // display: block;
          margin-right: 10px;
        }
        .el-upload-list {
          position: absolute;
          top: 40px;
        }
      }
    }
    .innerMain {
      width: 100%;
      height: 10%;
      overflow: hidden;
    }
  }
}

.music_box {
  margin-left: 50%;
  transform: translateX(-50%);
}

::v-deep .share_box {
  .el-dialog--center .el-dialog__body {
    text-align: center !important;
    padding-top: 15px;
  }
}

.share_link {
  margin-right: 7px;
}

.left-bb {
  margin-left: 9px;
}

.searchBox {
  display: flex;
  align-items: center;
  .sLogoBox {
    margin-left: 30px;
  }
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  margin-left: 13px;
}
</style>
