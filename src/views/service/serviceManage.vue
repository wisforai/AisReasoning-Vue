<template>
  <div class="page-box">
    <div class="title-box flex-row" style="justify-content: space-between">
      <mySmallTitle text="算法服务" font-size="20"></mySmallTitle>
      <div class="flex-row">
        <el-button type="primary" @click="serviceAddDialogVisible = true">新建服务</el-button>
      </div>
    </div>
    <div class="searchBar-box flex-row" style="justify-content: space-between">
      <div class="searchContent" style="margin-top: 20px">
        <el-form :model="filters" :rules="rules" :inline="true">
          <el-form-item label="服务名称：" prop="serviceName">
            <el-input v-model="filters.serviceName" style="width: 180px" />
          </el-form-item>
          <el-form-item label="服务状态：">
            <el-select v-model="filters.serviceStatus" placeholder="请选择" style="width: 130px">
              <el-option v-for="(serviceStatus, index) in serviceStatusOptions" :key="index" :label="serviceStatus" :value="serviceStatus" />
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
        <el-table :data="serviceData" stripe style="width: 100%" height="430">
          <el-table-column label="名称" prop="serviceName"></el-table-column>
          <el-table-column label="描述" prop="serviceDescription"></el-table-column>
          <el-table-column label="地址" prop="serviceUrl"></el-table-column>
          <el-table-column label="状态" prop="serviceStatus">
            <template v-slot="scope">
              <!-- <el-icon v-if="scope.row.streamStatus === '正常'" color="green">
                <CircleCheck />
              </el-icon>
              <el-icon v-else color="red">
                <CircleClose />
              </el-icon>
              <span >{{ scope.row.streamStatus }}</span> -->
              <span :style="{ color: scope.row.serviceStatus === '运行正常' ? 'green' : 'red' }">
                {{ scope.row.serviceStatus }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" prop="serviceCreateTime"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button v-if="scope.row.serviceStatus === '未运行'" size="small" type="success" plain @click.stop="start(scope.row, scope.$serviceUuid)">开启</el-button>
              <el-button v-if="scope.row.serviceStatus !== '未运行'" size="small" type="success" plain @click.stop="stop(scope.row, scope.$serviceUuid)">关闭</el-button>
              <el-button v-if="scope.row.serviceStatus === '未运行'" size="small" type="primary" plain @click.stop="change(scope.row, scope.$serviceUuid)">修改</el-button>
              <el-button v-if="scope.row.serviceStatus === '未运行'" size="small" type="danger" plain @click.stop="del(scope.row, scope.$serviceUuid)">删除</el-button>
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

    <!-- 新增/修改服务dialog -->
    <el-dialog v-model="serviceAddDialogVisible" v-if="serviceAddDialogVisible" center append-to-body :title="changeOrAdd === 0 ? '新建服务' : '修改服务'" width="550px" @close="serviceAddDialogClose">
      <serviceAdd @serviceAddDialogClose="serviceAddDialogClose" @init="init" :changeOrAdd="changeOrAdd" :curService="curService"></serviceAdd>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import mySmallTitle from "../../components/mySmallTitle.vue";
import serviceAdd from "../../components/service/serviceAdd.vue";
import * as getData from "../../service/getData";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    mySmallTitle,
    serviceAdd,
  },
  setup() {
    onMounted(() => {
      init();
    });
    const state = reactive({
      filters: {
        serviceName: null,
        serviceDescription: null,
        serviceUrl: null,
        serviceRoute: null,
        servicePort: null,
        serviceStatus: null,
        serviceCreateTime: null,
        time: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 10,
      },
      serviceStatusOptions: ["运行正常", "运行异常", "未运行"],
      serviceData: [],
      rules: {},
      serviceAddDialogVisible: false, // 控制服务新增dialog
      changeOrAdd: 0,
      curService: null,
    });
    const init = () => {
      console.log("init");
      getData.servicePageList(state.filters).then((res) => {
        console.log(res);
        state.serviceData = res.data.data.items;
        state.filters.pageIndex = res.data.data.current_page;
        state.filters.pageSize = res.data.data.per_page;
        state.filters.totalCount = res.data.data.total;
      });
    };
    const filtersClear = () => {
      state.filters = {
        serviceName: null,
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
    const start = (row, index) => {
      console.log("start service");
      getData.serviceStart(row.serviceUuid).then((res) => {
        if (res.data.code === 200) {
          init();
          ElMessage.success(res.data.msg);
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    };

    const stop = (row, index) => {
      console.log("stop service");
      getData.serviceStop(row.serviceUuid).then((res) => {
        if (res.data.code === 200) {
          init();
          ElMessage.success(res.data.msg);
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    };
    const change = (row, index) => {
      console.log("change service");
      state.changeOrAdd = 1;
      state.curService = row;
      state.serviceAddDialogVisible = true;
    };
    const look = (row, index) => {
      state.curService = row;
      // state.filters.pageIndex = 1;
      state.stockManageDialogVisible = true;
    };
    const del = (row, index) => {
      ElMessageBox.confirm("是否删除该服务", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("delete");
          getData.serviceDelete(row.serviceUuid).then((res) => {
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
    const handleCurrentChange = (val) => {
      state.filters.pageIndex = val;
      init();
    };
    const handleSizeChange = (val) => {
      state.filters.pageIndex = 1;
      state.filters.pageSize = val;
      init();
    };
    // 关闭新增服务dialog 方法
    const serviceAddDialogClose = () => {
      state.serviceAddDialogVisible = false;
      state.changeOrAdd = 0;
      state.curService = null;
    };
    return {
      ...toRefs(state),
      init,
      filtersClear,
      search,
      start,
      change,
      look,
      stop,
      del,
      handleCurrentChange,
      handleSizeChange,
      serviceAddDialogClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-number-range {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
