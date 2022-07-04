<template>
  <div class="root">
    <div class="left">
      <div class="shower">
        <canvas class="canvas" ref="canvasRef" @click="getColor" :style="canvasStyle"></canvas>
      </div>
      <button class="select" @click="callImage" ref="dropRef">
        <span>{{ content }}</span> <span v-if="isTip" class="tip">选择的图片太小了</span>
        <input ref="fileRef" type="file" accept="image/*" @change="selectImage" />
      </button>
    </div>
    <div class="right">
      <div class="average">
        <div class="color" :style="genBgColor(average)"></div>
        <div class="hex">{{ average.hex }}</div>
        <div class="rgb">{{ average.rgb }}</div>
        <div class="tip">平均值</div>
      </div>
      <div class="history">
        <div v-for="(item, index) in colorList" :key="index" class="item">
          <div class="color" :style="genBgColor(item)"></div>
          <div class="hex">{{ item.hex }}</div>
          <div class="rgb">{{ item.rgb }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="version">
    <div>色值调试工具 - FOR 慧屏</div>
    <div>@美特互动大力</div>
  </div>
</template>

<script>
const Content = ['选择一个本地图片 ( 或将图片拖拽到这里 )', '放开自动上传']
import { ref, reactive, watch, computed, onBeforeMount, onMounted } from 'vue'

export default {
  setup() {
    let ctx = null
    const content = ref(Content[0])
    const isTip = ref(false)
    const dropRef = ref(null)
    const canvasRef = ref(null)
    const fileRef = ref(null)
    const sourceRef = ref(null)
    const position = reactive({
      width: 0,
      height: 0,
      x: 0,
      y: 0
    })

    const colorList = reactive([])
    const average = reactive({
      hex: '-',
      rgb: '-'
    })

    const clearColorList = () => {
      if (colorList.length) {
        colorList.shift()
        clearColorList()
      }
    }

    const setPosition = ({ width, height }) => {
      position.width = width
      position.height = height
    }

    const initCanvas = img => {
      if (!ctx) {
        const canvas = canvasRef.value
        ctx = canvas.getContext('2d')
      }
      let image = new Image()
      image.src = img
      image.onload = () => {
        const canvas = canvasRef.value
        let { width, height } = image
        if (width < 500 || height < 500) {
          return (isTip.value = true)
        }
        isTip.value = false
        if (width > height) {
          let rate = height / width
          width = 500
          height = 500 * rate
        } else if (height > width) {
          let rate = width / height
          height = 500
          width = 500 * rate
        } else {
          width = 500
          height = 500
        }
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
        ctx.drawImage(image, 0, 0, width, height)
        setPosition({ width, height })
      }
    }

    const getColor = event => {
      const x = event.x - canvasRef.value.offsetLeft
      const y = event.y - canvasRef.value.offsetTop
      var imageData = ctx.getImageData(x, y, 1, 1)
      var pixel = imageData.data
      var r = pixel[0]
      var g = pixel[1]
      var b = pixel[2]
      var a = pixel[3] / 255
      a = Math.round(a * 100) / 100
      var rHex = r.toString(16)
      r < 16 && (rHex = '0' + rHex)
      var gHex = g.toString(16)
      g < 16 && (gHex = '0' + gHex)
      var bHex = b.toString(16)
      b < 16 && (bHex = '0' + bHex)
      // var rgbaColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
      var rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')'
      var hexColor = '#' + rHex + gHex + bHex
      colorList.unshift({
        rgb: rgbColor,
        hex: hexColor,
        r: r,
        g: g,
        b: b,
        a: a
      })
    }

    const genBgColor = item => {
      const { hex } = item
      return {
        backgroundColor: hex
      }
    }

    const canvasStyle = computed(() => {
      return { width: position.width + 'px', height: position.height + 'px' }
    })

    watch(colorList, list => {
      const len = list.length
      if (!len) {
        average.hex = '-'
        average.rgb = '-'
        return
      }
      const rG = Math.floor(list.reduce((total, current) => total + current.r, 0) / len)
      const gG = Math.floor(list.reduce((total, current) => total + current.g, 0) / len)
      const bG = Math.floor(list.reduce((total, current) => total + current.b, 0) / len)
      let rHex = rG.toString(16)
      rG < 16 && (rHex = '0' + rHex)
      let gHex = gG.toString(16)
      rG < 16 && (gHex = '0' + gHex)
      let bHex = bG.toString(16)
      bG < 16 && (bHex = '0' + bHex)
      average.rgb = 'rgb(' + rG + ',' + gG + ',' + bG + ')'
      average.hex = '#' + rHex + gHex + bHex
    })

    const readFile = file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = img => {
        initCanvas(img.target.result)
        clearColorList()
      }
    }

    const selectImage = event => {
      let file = event.target.files[0]
      readFile(file)
    }
    const callImage = () => {
      fileRef.value.click()
    }
    const setSelectText = index => {
      content.value = Content[index]
    }

    onMounted(() => {
      const dropArea = dropRef.value
      dropArea.addEventListener(
        'drop',
        e => {
          e.stopPropagation()
          e.preventDefault()
          console.log(`e.dataTransfer.files 》 `, e.dataTransfer.files)
          readFile(e.dataTransfer.files[0])
          setSelectText(0)
        },
        false
      )
      dropArea.addEventListener('dragleave', e => {
        e.stopPropagation()
        e.preventDefault()
        setSelectText(0)
      })
      dropArea.addEventListener('dragenter', e => {
        e.stopPropagation()
        e.preventDefault()
        setSelectText(1)
      })
      dropArea.addEventListener('dragover', e => {
        e.stopPropagation()
        e.preventDefault()
        setSelectText(1)
      })
    })

    onBeforeMount(() => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      if (!userAgent.startsWith('mozilla') || userAgent.includes('mobile')) {
        location.href = './support.html'
      }
    })

    return {
      content,
      isTip,
      dropRef,
      fileRef,
      canvasRef,
      sourceRef,
      colorList,
      getColor,
      genBgColor,
      average,
      selectImage,
      callImage,
      canvasStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  margin: 10px auto;
  width: 1050px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .shower {
      margin-top: 20px;
      width: 500px;
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;
    }
    .select {
      margin-top: 20px;
      border: 1px solid #eee;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .tip {
        color: red;
      }
      input {
        height: 0;
        width: 0;
      }
    }
  }
  .right {
    .average {
      position: relative;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      margin-top: 20px;
      width: 480px;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      padding-right: 10px;

      .color {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: 1px solid #eee;
      }
      .hex {
        flex: 1;
        text-align: right;
      }
      .rgb {
        flex: 1;
        text-align: right;
      }
      .tip {
        position: absolute;
        width: 60px;
        left: 220px;
        text-align: center;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 10px;
        font-size: 12px;
        margin-top: -64px;
      }
    }

    .history {
      margin-top: 20px;
      width: 500px;
      height: 600px;
      border: 1px solid #eee;
      overflow-y: auto;
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding-left: 10px;
        padding-right: 10px;
        .color {
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }
        .hex,
        .rgb {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
.version {
  font-size: 14px;
  color: #888;
  margin-top: 20px;
  text-align: center;
}
</style>
