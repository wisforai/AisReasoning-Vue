<template>
  <div class="image-container">
    <div v-for="(image, index) in curImageUrls" :key="index" class="flex-container" style="width: 100%; align-items: center; justify-content: center">
      <el-image
        style="width: 100%; height: 100%"
        :src="image"
        :lazy="true"
        :preview-src-list="curImageUrls.map((img) => img)"
        :initial-index="index"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        fit="cover"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["curImageUrls"],
};
</script>

<style scoped></style>
