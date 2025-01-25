<template>
    <div class="model-card">
      <img :src="model.image" class="model-image" />
      <h3 class="model-name">{{ model.name }}</h3>
      <p class="model-description">{{ model.description }}</p>
      <button class="use-button" @click="$router.push({ name: '算法服务' })">去使用</button>
    </div>
  </template>
  
  <script>
import router from '@/router';
import { toRefs } from 'vue';
  
  export default({
    props: {
      model: {
        type: Object,
        required: true,
      },
    },
    setup(props, { emit }) {
      // 通过 toRefs 解构 props，以保持响应性
      
      const { model } = toRefs(props);
      const handleUse = () => {
        emit('use', model.value.id); // 使用 emit 发送事件
      };
  
      return {
        model,
        handleUse,
      };
    },
  });
  </script>
  
  <style scoped>
.model-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center; /* 使文本和按钮在卡片中居中 */
  width: 250px; /* 设置固定宽度 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; /* 底部间距 */
}

.model-image {
  width: 300px; /* 固定宽度 */
  height: 200px; /* 固定高度 */
  object-fit: cover; /* 保持图片比例并填充 */
  border-radius: 8px; /* 可选：为图片添加圆角 */
  display: block; /* 使图片为块级元素 */
  margin: 0 auto; /* 使图片水平居中 */
}

.model-name {
  font-size: 18px;
  margin: 10px 0;
  text-align: left; /* 文本左对齐 */
  padding-left: 10px; /* 添加左内边距以确保与图片左边距相等 */
}

.model-description {
  font-size: 14px;
  color: #666;
  text-align: left; /* 可选：使描述文本也靠左显示 */
  padding-left: 10px; /* 添加左内边距以确保与图片左边距相等 */
}

.use-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.use-button:hover {
  background-color: #0056b3;
}
  </style>