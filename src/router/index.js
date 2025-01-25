import { createRouter, createWebHashHistory } from "vue-router";

// 首页
import index from "../views/index.vue";

//数据源
import dataImage from "../views/dataSource/dataImage.vue";
import dataStream from "../views/dataSource/dataStream.vue";
import dataCamera from "../views/dataSource/dataCamera.vue";

//算法服务
import serviceManage from "../views/service/serviceManage.vue";

//任务
import taskManage from "../views/task/taskManage.vue";

// 算法仓库
import algorithmManage from "../views/algorithm/algorithmManage.vue";

//本地模型
import modelManage from "../views/model/modelManage.vue";

const routes = [
  {
    path: "/",
    redirect: "/index", // 设定根路径重定向到 index 页面
  },
  {
    path: "/index",
    component: index,
    name: "首页",
    hidden: true,
    meta: { title: "test" },
  },
  {
    path: "/index/dataSourece",
    hidden: false,
    // leaf: false,
    component: index,
    name: "数据源",
    children: [
      {
        path: "/index/dataImage",
        hidden: false,
        component: dataImage,
        name: "图片",
      },
      {
        path: "/index/dataStream",
        hidden: false,
        component: dataStream,
        name: "视频流",
      },
      {
        path: "/index/dataCamera",
        hidden: false,
        component: dataCamera,
        name: "工业相机",
      },
    ],
  },
  ,
  {
    path: "/index/service",
    hidden: false,
    component: index,
    name: "服务",
    children: [
      {
        path: "/index/service",
        hidden: false,
        component: serviceManage,
        name: "算法服务",
      },
    ],
  },
  {
    path: "/index/task",
    hidden: false,
    // leaf: false,
    component: index,
    name: "任务",
    children: [
      {
        path: "/index/task",
        hidden: false,
        component: taskManage,
        name: "处理任务",
      },
    ],
  },
  {
    path: "/index/algorithm",
    hidden: false,
    component: index,
    name: "算法",
    children: [
      {
        path: "/index/algorithm",
        hidden: false,
        component: algorithmManage,
        name: "算法仓库",
      },
    ],
  },
  {
    path: "/index/model",
    hidden: false,
    component: index,
    name: "模型",
    children: [
      {
        path: "/index/modelManage",
        hidden: false,
        component: modelManage,
        name: "本地模型",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
