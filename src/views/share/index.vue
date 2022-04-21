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
              :data="showFile"
              border
              style="width: 100%"
              max-height="510"
              stripe
              :default-sort="{prop: 'uploadtime', order: 'descending'}"
            >
              <el-table-column
                prop="filename"
                label="文件名"
                min-width="45%"
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
                min-width="30%"
                sortable
              />
              <el-table-column
                label="操作"
                min-width="25%"
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
            </div>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import ViewPDF from '@/components/ViewPDF'
import { getShareList, shareDownload, sharePreview } from '@/api/file'
export default {
  components: {
    ViewPDF
  },
  data () {
    return {
      fileList: [],
      allRawFile: [],
      imgList: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'ico'],
      docList: ['docx', 'pptx', 'doc', 'ppt', 'txt', 'md', 'xlsx', 'xls', 'pdf'],
      videoList: ['mp4', 'mkv'],
      musicList: ['mp3', 'flac', 'm4a'],
      torrentList: ['torrent'],
      url_picture: require('@/assets/common/bg.png'),
      url_video: '',
      url_pdf: '',
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
    shareFile () {
      var array = []
      for (var i = 0; i < this.allRawFile.length; i++) {
        var file = this.allRawFile[i]
        file.size = this.formatBytes(Number(file.size))
        file.type = file.filename.split('.').pop()
        array.push(file)
      }
      return array
    },
    showFile () {
      return this.shareFile
    }
  },
  created () {
    this.fresh()
  },
  beforeCreate () {
    document.querySelector('body').classList.add('Bg_Leaf')
  },
  methods: {
    async fresh () {
      const Fname = JSON.parse(localStorage.getItem(this.$route.params.username))
      const filename = Fname[this.$route.params.filename]
      const res = await getShareList({
        username: this.$route.params.username,
        filename
      })
      this.allRawFile = res
    },
    formatBytes (size) {
      var units = [' B', ' KB', ' MB', ' GB', ' TB']
      for (var i = 0; size >= 1024 && i < 4; i++) { size /= 1024 }
      return size.toFixed(2) + units[i]
    },
    downloadFile (row) {
      const filename = row.filename
      shareDownload({ username: this.$route.params.username, filename }, 'blob').then(res => {
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
      const res = await sharePreview({ username: this.$route.params.username, filename })
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
    }
  },
  beforeUnmount () {
    document.querySelector('body').classList.remove('Bg_Leaf')
  }
}
</script>
<style>
.Bg_Leaf {
  background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg9.51tietu.net%2Fpic%2F2019-091203%2Fmpv2bq44pwimpv2bq44pwi.jpg&refer=http%3A%2F%2Fimg9.51tietu.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650699364&t=27c5c05eb5b4d701c387b2907c63e8f6")
    no-repeat center / cover;
  overflow: hidden;
}
</style>
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

.music_box {
  margin-left: 50%;
  transform: translateX(-50%);
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
