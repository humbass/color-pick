<template>
  <div class="root">
    <h3>{{ state.content }}</h3>
    <hr />
    <div v-if="state.download" class="download">
      <a href="https://webcdn.m.qq.com/spcmgr/download/102.0.5005.63_chrome_installer-win32.exe" target="_blank"> 下载 Chrome 浏览器</a>
      <a href="https://www.microsoft.com/zh-cn/edge?r=1" target="_blank"> 微软 Egde 浏览器 </a>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const state = reactive({
      content: '未支持当前浏览器',
      download: false
    })
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.includes('mobile')) {
      state.content = '不支持移动浏览器'
    } else if (!userAgent.startsWith('mozilla')) {
      state.download = true
    }

    return {
      state
    }
  }
})
</script>

<style lang="scss" scoped>
h3 {
  text-align: center;
  line-height: 100px;
}
hr {
  border: 1px solid #ddd;
}
.download {
  line-height: 100px;
  text-align: center;
  a {
    text-underline-position: below;
    margin-left: 20px;
    margin-right: 20px;
    color: #000;
  }
}
</style>
