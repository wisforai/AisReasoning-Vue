<template>
  <div class="page-box" v-loading="mainBoxLoading">
    <div class="title-box flex-row" style="justify-content: space-between">
      <mySmallTitle text="处理任务" font-size="20"></mySmallTitle>
      <div class="flex-row">
        <el-button type="primary" @click="taskAddDialogVisible = true">新建任务</el-button>
      </div>
    </div>
    <div class="searchBar-box flex-row" style="justify-content: space-between">
      <div class="searchContent" style="margin-top: 20px">
        <el-form :model="filters" :rules="rules" :inline="true">
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-model="filters.taskName" />
          </el-form-item>
          <el-form-item label="数据源：" prop="dataSourceType">
            <el-select v-model="filters.dataSourceType" placeholder="请选择" style="width: 130px">
              <el-option v-for="(item, index) in dataSoureceTypes" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态：" prop="taskStatus">
            <el-select v-model="filters.taskStatus" placeholder="请选择" style="width: 130px">
              <el-option v-for="(taskStatus, index) in taskStatusOptions" :key="index" :label="taskStatus" :value="taskStatus" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="searchButton flex-row">
        <el-button @click="filtersClear">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="flex-direction-box">
      <div class="table-box">
        <el-table :data="taskData" stripe style="width: 100%" height="430">
          <el-table-column label="任务名称" prop="taskName"></el-table-column>
          <el-table-column label="任务描述" prop="taskDescription"></el-table-column>
          <el-table-column label="数据源" prop="dataSourceName">
            <template #default="scope">
              {{ getDataSourceName(scope.row) }}
            </template>
          </el-table-column>

          <el-table-column label="任务状态" prop="taskStatus">
            <template v-slot="scope">
              <span :style="{ color: scope.row.taskStatus === '运行完成' ? 'green' : 'red' }">
                {{ scope.row.taskStatus }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="任务创建时间" prop="taskCreateTime"></el-table-column>
          <el-table-column label="操作" width="250" align="center">
            <template #default="scope">
              <el-button v-if="enableStart(scope.row)" size="small" type="success" plain @click.stop="start(scope.row, scope.$taskUuid)">开始</el-button>
              <el-button v-if="enableLook(scope.row)" size="small" type="primary" plain @click.stop="look(scope.row, scope.$taskUuid)">查看</el-button>
              <el-button v-if="enableChange(scope.row)" size="small" type="primary" plain @click.stop="change(scope.row, scope.$taskUuid)">修改</el-button>
              <el-button v-if="enableStop(scope.row)" size="small" type="danger" plain @click.stop="stop(scope.row, scope.$taskUuid)">停止</el-button>
              <el-button v-if="enableDel(scope.row)" size="small" type="danger" plain @click.stop="del(scope.row, scope.$taskUuid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="toolbar">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          background
          :current-page="filters.pageIndex"
          :page-size="filters.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="filters.totalCount"
          style="float: right; margin-top: 0"
        >
        </el-pagination>
      </div>
    </div>

    <!--任务新增dialog -->
    <el-dialog v-model="taskAddDialogVisible" v-if="taskAddDialogVisible" center append-to-body :title="changeOrAdd === 0 ? '新建任务' : '修改任务'" width="550px" @close="taskAddDialogClose">
      <taskAdd @taskAddDialogClose="taskAddDialogClose" @init="init" :changeOrAdd="changeOrAdd" :curTask="curTask"></taskAdd>
    </el-dialog>

    <!--图片结果查看dialog -->
    <el-dialog v-model="imageViewDialogVisible" v-if="imageViewDialogVisible" center append-to-body title="图片集列表" width="800px" @close="imageViewDialogClose">
      <imageView @imageViewDialogClose="imageViewDialogClose" @init="init"></imageView>
    </el-dialog>

    <!--视频流查看ialog -->
    <el-dialog v-model="streamLookDialogVisible" v-if="streamLookDialogVisible" @close="streamLookDialogClose">
      <videoPlayer @streamLookDialogClose="streamLookDialogClose" :curDstUrl="curDstUrl"></videoPlayer>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import mySmallTitle from "../../components/mySmallTitle.vue";
import taskAdd from "../../components/task/taskAdd.vue";
import videoPlayer from "../../components/videoPlayer.vue";
import imageView from "../../components/imageView.vue";
import * as getData from "../../service/getData";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    mySmallTitle,
    taskAdd,
    videoPlayer,
    imageView,
  },
  setup() {
    onMounted(() => {
      init();
    });
    const state = reactive({
      filters: {
        taskName: null,
        dataSourceType: null,
        taskStatus: null,
        pageIndex: 1,
        pageSize: 10,
        totalCount: 10,
      },
      rules: {},
      dataSoureceTypes: [
        {
          value: "image",
          label: "图片",
        },
        {
          value: "stream",
          label: "视频流",
        },
        {
          value: "camera",
          label: "工业相机",
        },
      ],
      taskStatusOptions: ["运行中", "运行完成", "运行异常", "未开始"],
      taskData: [],
      changeOrAdd: 0,
      curTask: null,
      curDstUrl: null,
      mainBoxLoading: false,
      taskAddDialogVisible: false, // 控制服务新增dialog
      streamLookDialogVisible: false, //控制查看视频流dialog
      imageViewDialogVisible: false, // 控制查看图片dialog
    });
    const init = () => {
      getData.taskPageList(state.filters).then((res) => {
        console.log(res);
        state.taskData = res.data.data.items;
        state.filters.pageIndex = res.data.data.current_page;
        state.filters.pageSize = res.data.data.per_page;
        state.filters.totalCount = res.data.data.total;
      });
    };
    const getDataSourceName = (row) => {
      // 返回存在的字段
      return row.streamName || row.imageName || row.cameraName || "无数据";
    };
    const filtersClear = () => {
      state.filters = {
        taskName: null,
        dataSourceName: null,
        taskStatus: null,
        time: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 10,
      };
      init();
    };
    const search = () => {
      // 根据当前表单调用 分页搜索接口
      state.filters.pageIndex = 1;
      init();
    };
    const look = (row) => {
      // state.imageViewDialogVisible = true;
      getData.taskLook(row.taskUuid).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          state.curDstUrl = res.data.data.dstUrl;
          console.log(state.curDstUrl);
          state.streamLookDialogVisible = true;
          // ElMessage.success(res.data.msg);
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    };
    const enableLook = (row) => {
      if (row.sourceType === "image") {
        return row.taskStatus === "运行完成";
      } else if (row.sourceType === "stream") {
        return row.taskStatus === "运行中";
      }
    };
    const start = (row) => {
      state.mainBoxLoading = true;
      getData.taskStart(row.taskUuid).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          init();
          ElMessage.success(res.data.msg);
        } else {
          ElMessage.error(res.data.msg);
        }
        state.mainBoxLoading = false;
      });
    };
    const enableStart = (row) => {
      if (row.sourceType === "image") {
        return row.taskStatus === "未开始";
      } else if (row.sourceType === "stream") {
        return row.taskStatus === "未开始" || row.taskStatus === "运行完成";
      }
    };
    const change = (row, index) => {
      state.changeOrAdd = 1;
      state.curTask = row;
      state.taskAddDialogVisible = true;
    };
    const enableChange = (row) => {
      if (row.sourceType === "image") {
        return row.taskStatus === "未开始" || row.taskStatus === "运行完成";
      } else if (row.sourceType === "stream") {
        return row.taskStatus === "未开始" || row.taskStatus === "运行完成";
      }
    };
    const stop = (row) => {
      if (row.sourceType === "image") {
        ElMessageBox.confirm("当前任务尚未分析完成，是否确认停止", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() =>
          getData.taskStop(row.taskUuid).then((res) => {
            console.log(res);
            if (res.data.code === 200) {
              init();
              ElMessage.success(res.data.msg);
            } else {
              ElMessage.error(res.data.msg);
            }
          })
        );
      } else if (row.sourceType === "stream") {
        state.mainBoxLoading = true;
        getData.taskStop(row.taskUuid).then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            init();
            ElMessage.success(res.data.msg);
          } else {
            ElMessage.error(res.data.msg);
          }
          state.mainBoxLoading = false;
        });
      }
    };
    const enableStop = (row) => {
      return row.taskStatus === "运行中" || row.taskStatus === "运行异常";
    };
    const del = (row) => {
      ElMessageBox.confirm("是否删除该任务", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getData.taskDelete(row.taskUuid).then((res) => {
            if (res.data.code === 200) {
              init();
              ElMessage.success(res.data.msg);
            } else {
              ElMessage.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    };
    const enableDel = (row) => {
      return row.taskStatus === "未开始" || row.taskStatus === "运行完成";
    };
    const handleCurrentChange = (val) => {
      state.filters.pageIndex = val;
      init();
    };
    const handleSizeChange = (val) => {
      state.filters.pageIndex = 1;
      state.filters.pageSize = val;
      init();
    };
    const taskAddDialogClose = () => {
      state.taskAddDialogVisible = false;
      state.changeOrAdd = 0;
      state.curTask = null;
    };
    const streamLookDialogClose = () => {
      state.streamLookDialogVisible = false;
      state.curTask = null;
    };
    const imageViewDialogClose = () => {
      state.imageViewDialogVisible = false;
      state.curTask = null;
    };
    return {
      ...toRefs(state),
      init,
      filtersClear,
      search,
      look,
      enableLook,
      change,
      enableChange,
      del,
      enableDel,
      start,
      enableStart,
      stop,
      enableStop,
      handleCurrentChange,
      handleSizeChange,
      taskAddDialogClose,
      streamLookDialogClose,
      imageViewDialogClose,
      getDataSourceName,
    };
  },
};
</script>

<style lang="scss" scoped></style>
