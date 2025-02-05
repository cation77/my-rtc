<template>
  <div class="meetingBox">
    <nav class="text-3xl text-blue-400">
      <RouterLink to="/">返回首页</RouterLink>
    </nav>
    <video class="videoBox" ref="videoRef" autoplay playsinline muted></video>

    <a-button @click="handleOpen">打开摄像头</a-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const constraints = {
  audio: true,
  video: true
}

const videoRef = ref<HTMLVideoElement>()

const handleOpen = () => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>

<style scoped lang="less">
.meetingBox {
  padding: 16px;

  .videoBox {
    width: 600px;
    height: 600px;
  }
}
</style>
