import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// axios.defaults.baseURL = 'http://' + config.":" + config.basePort
axios.defaults.baseURL = "http://192.168.21.82:5001";

axios.interceptors.request.use(
  function (config) {
    // config.hostUrl ="http://192.168.1.144:9000"
    // 在发送请求之前做些什么
    console.log(axios.defaults.baseURL);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // 在发送请求之后做些什么
    return response;
  },
  function (error) {
    console.log(error);
    // 提取请求的 URL
  }
);

// image

// 图片集新增
export let imageAdd = (data) => axios.post("/image/add", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 图片集删除
export let imageDelete = (imageUuid) => axios.get("/image/delete/" + imageUuid);

// 图片集修改
export let imageUpdate = (data) => axios.post("/image/update", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 图片分页
export let imagePageList = (filters) => axios.post("/image/pageList", JSON.stringify(filters), { headers: { "Content-Type": "application/json" } });

// 获取所有图片
export let imageList = () => axios.get("/image/getAllImages");

// 查看当前tupian
export let imageLook = (data) => axios.post("/image/look", JSON.stringify(data), { "Content-Type": "application/json" });

// steam

// 视频流新增
export let streamAdd = (data) => axios.post("/stream/add", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 视频流删除
export let streamDelete = (streamUuid) => axios.get("/stream/delete/" + streamUuid);

// 视频流修改
export let streamUpdate = (data) => axios.post("/stream/update", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 视频流分页
export let streamPageList = (filters) => axios.post("/stream/pageList", JSON.stringify(filters), { headers: { "Content-Type": "application/json" } });

// 获取所有视频流
export let streamList = () => axios.get("/stream/getAllStreams");

// camera

// 工业相机新增
export let cameraAdd = (data) => axios.post("/camera/add", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 相机删除
export let cameraDelete = (cameraUuid) => axios.get("/camera/delete/" + cameraUuid);

// 相机修改
export let cameraUpdate = (data) => axios.post("/camera/update", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 相机分页
export let cameraPageList = (filters) => axios.post("/camera/pageList", JSON.stringify(filters), { headers: { "Content-Type": "application/json" } });

// 获取所有相机
export let cameraList = () => axios.get("/camera/getAllCameras");

// service

// 服务新增
export let serviceAdd = (data) => axios.post("/service/add", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 服务开启
export let serviceStart = (serviceUuid) => axios.get("/service/start/" + serviceUuid);

// 服务关闭
export let serviceStop = (serviceUuid) => axios.get("/service/stop/" + serviceUuid);

// 服务分页
export let servicePageList = (filters) => axios.post("/service/pageList", JSON.stringify(filters), { headers: { "Content-Type": "application/json" } });

// 服务删除
export let serviceDelete = (serviceUuid) => axios.get("/service/delete/" + serviceUuid);

//服务修改
export let serviceUpdate = (data) => axios.post("/service/update", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 获取所有服务
export let serviceList = () => axios.get("/service/getAllServices");

// model

// 获取所有模型
export let modelList = () => axios.get("/model/getAllModels");

// 添加模型
export let modelAdd = (data) => axios.post("/model/add", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 模型删除
export let modelDelete = (modelUuid) => axios.get("/model/delete/" + modelUuid);

// 模型修改
export let modelUpdate = (data) => axios.post("/model/update", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 模型分页
export let modelPageList = (filters) => axios.post("/model/pageList", JSON.stringify(filters), { headers: { "Content-Type": "application/json" } });

// 模型下载
export let modelDownLoad = (modelUuid) => axios.get("/model/download/" + modelUuid);
// task

// 任务新增
export let taskAdd = (data) => axios.post("/task/add", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 任务开始
export let taskStart = (taskUuid) => axios.get("/task/start/" + taskUuid);

// 任务关闭
export let taskStop = (taskUuid) => axios.get("/task/stop/" + taskUuid);

// 任务结果查看
export let taskLook = (taskUuid) => axios.get("/task/look/" + taskUuid);

// 任务分页
export let taskPageList = (filters) => axios.post("/task/pageList", JSON.stringify(filters), { headers: { "Content-Type": "application/json" } });

// 任务删除
export let taskDelete = (taskUuid) => axios.get("/task/delete/" + taskUuid);

//任务修改
export let taskUpdate = (data) => axios.post("/task/update", JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

// 测试
export let test = () => axios.get(`/api/test/`);
