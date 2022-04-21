<template>
  <div :class="{'has-logo':showLogo}">
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <div
      v-show="!isCollapse&&access===0"
      class="store-wrapper"
    >
      <el-progress
        :percentage="storagePercentage"
        :color="storageColor"
        :show-text="false"
      />
      <div class="text">
        <div>存储</div>
        <!-- {{ storageUsedValue | storageTrans }} / {{ storageMaxValue | storageTrans(true) }} -->
        <div>{{ formatBytes(used) }} / {{ formatBytes(space) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data () {
    return {
      storagePercentage: 50,
      storageColor: 'skyblue'
      // logobig: require('@/assets/common/logobig.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'routes',
      'used',
      'space',
      'access'
    ]),
    // routes () {
    //   return this.$router.options.routes
    // },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  created () {
    this.updateStoragePercentage()
  },
  updated () {
    this.updateStoragePercentage()
  },
  methods: {
    formatBytes (size) {
      size = size || 0
      var units = [' B', ' KB', ' MB', ' GB', ' TB']
      for (var i = 0; size >= 1024 && i < 4; i++) { size /= 1024 }
      return size.toFixed(2) + units[i]
    },
    updateStoragePercentage () {
      this.storagePercentage = (this.used / this.space) * 100 || 50
    }
  }
}
</script>
<style lang="scss" scope>
#app .sidebar-container {
  background-color: #1f2d3d;
}
.store-wrapper {
  position: absolute;
  height: 9%;
  padding: 10px;
  background-color: #304156;
  bottom: 0;
  left: 0;
  right: 0;
  &:before {
    position: absolute;
    content: "";
    height: 9%;
    background-color: #686869;
    top: -9%;
    left: 0;
    right: 0;
    z-index: 2;
    opacity: 0.8;
  }
  .text {
    margin-top: 13px;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }
}
</style>
