<template>
  <div class="flex-col" style="justfity-content: center; align-items: center">
    <div class="image-container" style="width: 100%">
      <div v-for="(file, index) in fileList" :key="file.uid" class="flex-container" style="margin-top: 0px">
        <el-image
          style="width: 100%; height: 90%"
          v-if="file.url"
          :src="file.url"
          :lazy="true"
          :preview-src-list="fileList.map((file) => file.url)"
          :initial-index="index"
          :zoom-rate="1"
          :max-scale="7"
          :min-scale="0.2"
          fit="cover"
          @click.stop
        />
        <span class="delete-text" @click.stop="handleRemove(file)">删除</span>
      </div>
    </div>

    <el-upload ref="upload" accept="image/*" :file-list="fileList" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :on-remove="handleRemove" :multiple="true" :limit="1000">
      <div class="flex-container">
        <div class="flex-row flex-center" v-if="fileList.length === 0" style="width: 100%">
          <el-icon class="upload-icon" @click="handleSelect"><Plus /></el-icon>
        </div>
        <div class="flex-row flex-center" style="width: 100%">
          <el-button size="small" type="primary" @click="handleSelect">选择文件</el-button>
          <el-button size="small" type="success" @click.stop="handleUpload">上传文件</el-button>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props, { emit }) {
    const fileList = ref([]);
    const upload = ref(null);

    const handleChange = (file, newFileList) => {
      if (file.raw) {
        const reader = new FileReader();
        reader.onload = (e) => {
          file.url = e.target.result;
          console.log("before", fileList.value.length);
          console.log(newFileList);
          fileList.value.push(file);
          console.log("after", fileList.value.length);
        };
        console.log(file.raw);
        reader.readAsDataURL(file.raw);
      } else {
        console.error("上传的文件格式不正确或文件为空");
      }
    };

    const handleSelect = () => {
      if (upload.value) {
        upload.value.$el.querySelector('input[type="file"]').click();
      }
    };

    const handleRemove = (file) => {
      fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
    };

    const handleUpload = () => {
      emit("fileAdd", fileList.value);
      emit("imageUploadDialogClose");
    };

    return {
      fileList,
      handleChange,
      handleSelect,
      handleRemove,
      handleUpload,
    };
  },
};
</script>

<style scoped>
.upload-icon {
  border-radius: 2%;
  background: #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  margin-bottom: 10px;
}

.delete-text {
  display: block;
  color: #ff4d4f; /* 红色，易于区分 */
  font-size: 12px; /* 字体大小 */
  text-align: center; /* 居中对齐 */
  cursor: pointer; /* 鼠标悬停变为手型 */
  margin-top: 5px; /* 与图片间隔 */
  margin-bottom: 5px;
}

.delete-text:hover {
  text-decoration: underline; /* 鼠标悬停时下划线 */
}
</style>
