<template>
  <div>
    <video class="video-box" ref="videoElement" controls autoplay style="width: 100%; height: 100%; object-fit: cover; background: black"></video>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, toRefs, reactive } from "vue";
import flvjs from "flv.js";

export default {
  props: ["curDstUrl"],
  setup(props, context) {
    const videoElement = ref(null);
    let player = null;
    const state = reactive({});
    onMounted(() => {
      console.log(videoElement);
      console.log(props.curDstUrl);
      if (flvjs.isSupported()) {
        player = flvjs.createPlayer({
          type: "flv",
          url: props.curDstUrl,
        });
        player.attachMediaElement(videoElement.value);
        player.load();
        player.play();
      }
    });

    // 在组件销毁时，停止播放并清理资源
    onUnmounted(() => {
      if (player) {
        player.pause();
        player.unload();
        player.detachMediaElement();
        player.destroy();
        player = null;
      }
    });
    return {
      ...toRefs(state),
      videoElement,
      player,
    };
  },
};
</script>

<style lang="scss" scoped></style>
