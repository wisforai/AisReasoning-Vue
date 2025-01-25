<template>
  <div class="index">
    <el-container>
      <el-header class="flex-row" style="justify-content: space-between">
        <div class="title">推理平台</div>
        <div class="flex-row" style="justify-content: space-between">
          <div class="logout" @click="$router.push({ name: '用户登录' })">
            <el-icon><img src="../assets/img/index/logout.png" class="index-img" /></el-icon>
            <span></span>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="1" active-text-color="#0BACF7" background-color="#263238" text-color="#8a979e" :unique-opened="true">
            <el-menu-item index="1" @click="$router.push({ name: '首页' })">
              <el-icon><img src="../assets/img/index/index.png" class="index-img" /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-sub-menu index="2">
              <template #title>
                <el-icon><img src="../assets/img/index/datasource.png" class="index-img" /></el-icon>
                <span>数据源</span>
              </template>
              <el-menu-item index="2-1" class="my-menu-item" @click="$router.push({ name: '图片' })">图片</el-menu-item>
              <el-menu-item index="2-2" class="my-menu-item" @click="$router.push({ name: '视频流' })">视频流</el-menu-item>
              <el-menu-item index="2-3" class="my-menu-item" @click="$router.push({ name: '工业相机' })">工业相机</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="3" @click="$router.push({ name: '算法服务' })">
              <el-icon><img src="../assets/img/index/algorithmService.png" class="index-img" /></el-icon>
              <span>算法服务</span>
            </el-menu-item>

            <el-menu-item index="4" @click="$router.push({ name: '处理任务' })">
              <el-icon><img src="../assets/img/index/task.png" class="index-img" /></el-icon>
              <span>处理任务</span>
            </el-menu-item>
            <el-menu-item index="5" @click="$router.push({ name: '算法仓库' })">
              <el-icon><img src="../assets/img/index/warehouse.png" class="index-img" /></el-icon>
              <span>算法仓库</span>
            </el-menu-item>
            <el-menu-item index="6" @click="$router.push({ name: '本地模型' })">
              <el-icon><img src="../assets/img/index/model.png" class="index-img" /></el-icon>
              <span>本地模型</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view class="main-box"> </router-view>
          <div style="width: 100%; height: 100%" v-if="$route.path === '/index'">
            <div class="flex-row" style="width: 100%; height: 15%">
              <div class="chart-box flex-col" style="width: 19%; height: 70%; background-color: #5470c6">
                <mySmallTitle text="总数据源数目" font-size="18" color="white"></mySmallTitle>
                <span style="margin: 10px 0 0 20px; text-align: left; font-size: 30px; color: #ffffff">{{ chemicalCount }}</span>
              </div>
              <div class="chart-box flex-col" style="width: 19%; height: 70%; margin-left: 0.5%; background-color: #91cc75">
                <mySmallTitle text="总算法数量" font-size="18" color="white"></mySmallTitle>
                <span style="margin: 10px 0 0 20px; text-align: left; font-size: 30px; color: #ffffff">{{ warehouseCount }}</span>
              </div>
              <div class="chart-box flex-col" style="width: 19%; height: 70%; margin-left: 0.5%; background-color: #fac858">
                <mySmallTitle text="总任务量" font-size="18" color="white"></mySmallTitle>
                <span style="margin: 10px 0 0 20px; text-align: left; font-size: 30px; color: #ffffff">{{ stockCount }}</span>
              </div>
              <div class="chart-box flex-col" style="width: 19%; height: 70%; margin-left: 0.5%; background-color: #ee6666">
                <mySmallTitle text="当前算力" font-size="18" color="white"></mySmallTitle>
                <span style="margin: 10px 0 0 20px; text-align: left; font-size: 30px; color: #ffffff">{{ companyCount }}</span>
              </div>
              <div class="chart-box flex-col" style="width: 19%; height: 70%; margin-left: 0.5%; background-color: #73c0de">
                <mySmallTitle text="XXXX" font-size="18" color="white"></mySmallTitle>
                <span style="margin: 10px 0 0 20px; text-align: left; font-size: 30px; color: #ffffff">{{ alarmCount }}</span>
              </div>
            </div>
            <div class="flex-row" style="width: 100%; height: 80%">
              <div class="chart-box" style="width: 46.5%; height: 95%">
                <mySmallTitle text="" font-size="18"></mySmallTitle>
              </div>
              <div class="flew-col" style="width: 53.5%; height: 100%; margin-left: 0.5%">
                <div class="chart-box" style="position: relative; height: 45%">
                  <div class="flex-row" style="justify-content: space-between">
                    <mySmallTitle :text="radioText" font-size="24"></mySmallTitle>
                  </div>
                </div>
                <div class="flex-row" style="justify-content: space-between; width: 100%; height: 45%; margin-top: 3%">
                  <div class="chart-box" style="position: relative; width: 47.5%; height: 100%">
                    <mySmallTitle text="" font-size="18"></mySmallTitle>
                  </div>
                  <div class="chart-box" style="position: relative; width: 47.5%; height: 100%; margin-left: 0.5%">
                    <mySmallTitle text="" font-size="18"></mySmallTitle>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import router from "@/router/index.js";
import { ElMessage } from "element-plus";
import mySmallTitle from "../components/mySmallTitle.vue";
import * as echarts from "echarts";
import pieChart from "../components/pieChart.vue";
import pieChart2 from "../components/pieChart2.vue";
import rank from "../components/rank.vue";
import * as getData from "../service/getData.js";

export default {
  components: {
    mySmallTitle,
    pieChart,
    pieChart2,
    rank,
  },
  setup() {
    onMounted(() => {
      // 通过加载 调用数据的api 来获取 linechart的data
      state.lineDataX = ["1", "2", "3", "4", "5", "6", "7"];
      init();

      // console.log(state)
      state.name = sessionStorage.getItem("role");
    });
    const state = reactive({
      lineDataX: [],
      lineDataY: [],
      lineChartShow: false, // 加载linechart
      lineChartLoading: true, // 如果没获取到数据 先加载动画
      lineChartName: "预警数量",
      lineChartUnit: "(个)",
      radio: "1",
      radioText: "",

      addressData: [],
      name: null,

      mapChartShow: false,
    });

    const init = () => {};

    const lineChartLoadingClose = () => {
      state.lineChartLoading = false;
    };
    const pieChartLoadingClose = () => {
      state.pieChartLoading = false;
    };
    const pieChartLoadingClose2 = () => {
      state.pieChartLoading2 = false;
    };
    return {
      ...toRefs(state),
      lineChartLoadingClose,
      pieChartLoadingClose,
      pieChartLoadingClose2,
      init,
    };
  },
};
</script>

<style lang="scss" scoped>
.index {
  background-color: rgba($color: #e7e7e7, $alpha: 0.5);
  height: 100%;
  width: 100%;
  // overflow: hidden;
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #2e323f;
  padding: 10px;
  justify-content: space-between;
  .title {
    text-align: center;
    font-size: 28px;
    color: #0bacf8;
  }
  .user {
    width: 20px;
    height: 20px;
    /* float: right; */
  }
  .logout {
    width: 20px;
    height: 20px;
    float: right;
  }
  .index-img {
    width: 20px;
    height: 20px;
  }
}
.el-aside {
  background-color: #263238;
  color: white;
  .el-menu-item {
    text-align: center;
  }
  .my-menu-item {
    text-indent: 20px;
  }
  .index-img {
    width: 20px;
    height: 20px;
  }
}
.el-main {
  width: 100%;
  text-align: center;
  height: 100%;
}
</style>
