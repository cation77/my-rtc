<template>
  <div class="meetingBox">
    <nav class="text-3xl text-blue-400">
      <RouterLink to="/">返回首页</RouterLink>
    </nav>

    <div class="meetingContent">
      <video
        @click="changePlay('local')"
        class="videoBox"
        :class="{ positionVideo: playType === 'remote' }"
        ref="localVideoRef"
        autoplay
        playsinline
        muted
      ></video>
      <video
        @click="changePlay('remote')"
        class="videoBox"
        :class="{ positionVideo: playType === 'local' }"
        ref="remoteVideoRef"
        autoplay
        playsinline
        muted
      ></video>
    </div>

    <a-button @click="handleOpen">打开摄像头</a-button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

type IPlayType = 'local' | 'remote'

const constraints = {
  audio: true,
  video: true
}

const roomName = 'room1' // 创建 PeerConnection

const peerConnection = new RTCPeerConnection()
const socketRef = ref<any>(null)
const playType = ref<IPlayType>('local')
const localVideoRef = ref<HTMLVideoElement>()
const remoteVideoRef = ref<HTMLVideoElement>()

const handleOpen = () => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (localVideoRef.value) {
        localVideoRef.value.srcObject = stream
        createOffer()
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const changePlay = (type: IPlayType) => {
  if (type !== playType.value) {
    playType.value = type
  }
}

const wsConnect = () => {
  const socket = io('ws://localhost:6055', {
    transports: ['websocket']
  })

  // 加入房间
  socket.emit('joinRoom', roomName)

  // 监听房间更新
  socket.on('roomUpdate', (data) => {
    console.log('Room updated:', data.clients)
  })

  // 处理信令消息
  socket.on('signal', async (data) => {
    if (data.signal) {
      if (data.signal.type === 'offer') {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.signal)
        )
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        socket.emit('signal', { roomName, signal: answer })
      } else if (data.signal.type === 'answer') {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.signal)
        )
      } else if (data.signal.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.signal))
      }
    }
  })

  socketRef.value = socket
}

// ICE 候选者处理
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socketRef.value.emit('signal', { roomName, signal: event.candidate })
  }
}

// 显示远程视频
peerConnection.ontrack = (event) => {
  if (remoteVideoRef.value) {
    remoteVideoRef.value.srcObject = event.streams[0]
  }
}

const createOffer = async () => {
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socketRef.value.emit('signal', { roomName, signal: offer })
}

onMounted(() => {
  wsConnect()
})
</script>

<style scoped lang="less">
.meetingBox {
  width: 100vw;
  height: 100vh;
  padding: 16px;
  overflow: hidden;

  .videoBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .meetingContent {
    position: relative;
    width: 300px;
    height: 300px;

    .positionVideo {
      width: 80px;
      height: 80px;
      top: 20px;
      left: 200px;
      z-index: 11;
      cursor: pointer;
    }
  }
}
</style>
