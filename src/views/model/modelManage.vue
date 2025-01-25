<template>
  <div class="page-box">
    <div class="title-box flex-row" style="justify-content: space-between">
      <mySmallTitle text="本地模型" font-size="20"></mySmallTitle>
      <div class="flex-row">
        <el-button type="primary" @click="modelAddDialogVisible = true">导入模型</el-button>
      </div>
    </div>
    <div class="searchBar-box flex-row" style="justify-content: space-between">
      <div class="searchContent" style="margin-top: 20px">
        <el-form :model="filters" :rules="rules" :inline="true">
          <el-form-item label="模型名称：" prop="modelName">
            <el-input v-model="filters.modelName" style="width: 180px" />
          </el-form-item>
          <el-form-item label="模型类别：">
            <el-select v-model="filters.modelType" placeholder="请选择" style="width: 130px">
              <el-option v-for="(modelType, index) in modelTypes" :key="index" :label="modelType" :value="modelType" />
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
        <el-table :data="modelData" stripe style="width: 100%" height="430">
          <el-table-column label="名称" prop="modelName"></el-table-column>
          <el-table-column label="描述" prop="modelDescription"></el-table-column>
          <el-table-column label="类别" prop="modelType"></el-table-column>
          <el-table-column label="大小" prop="modelSize"></el-table-column>
          <el-table-column label="版本" prop="modelVersion"></el-table-column>
          <el-table-column label="Md5" prop="modelMd5"></el-table-column>
          <el-table-column label="创建时间" prop="modelCreateTime"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click.stop="download(scope.row, scope.$modelUuid)">下载</el-button>
              <el-button size="small" type="primary" plain @click.stop="change(scope.row, scope.$modelUuid)">修改</el-button>
              <el-button size="small" type="danger" plain @click.stop="del(scope.row, scope.$modelUuid)">删除</el-button>
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
    <el-dialog v-model="modelAddDialogVisible" v-if="modelAddDialogVisible" center append-to-body :title="changeOrAdd === 0 ? '导入模型' : '修改模型'" width="550px" @close="modelAddDialogClose">
      <modelAdd @modelAddDialogClose="modelAddDialogClose" @init="init" :changeOrAdd="changeOrAdd" :curModel="curModel"></modelAdd>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import mySmallTitle from "../../components/mySmallTitle.vue";
import * as getData from "../../service/getData";
import { ElMessage, ElMessageBox } from "element-plus";
import modelCard from "../../components/model/modelCard.vue";
import modelAdd from "../../components/model/modelAdd.vue";
export default {
  components: {
    mySmallTitle,
    modelCard,
    modelAdd,
  },
  setup() {
    onMounted(() => {
      init();
    });
    const state = reactive({
      activeTab: "card",
      modelTypes: ["目标检测", "实例分割", "旋转检测"],
      filters: {
        modelName: null,
        startTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10,
        totalCount: 10,
      },
      time: null,
      changeOrAdd: 0,
      curModel: null,
      modelAddDialogVisible: false,
      rules: {},
      modelData: [],
      models: [
        {
          id: 1,
          name: "机动车检测算法",
          description: "这是算法一的描述。",
          image: require("../../assets/img/model/car.jpg"),
        },
        {
          id: 2,
          name: "人体检测算法",
          description: "这是算法二的描述。",
          image: require("../../assets/img/model/person.png"),
        },
      ],
    });
    const init = () => {
      console.log("init");
      getData.modelPageList(state.filters).then((res) => {
        console.log(res);
        state.modelData = res.data.data.items;
        state.filters.pageIndex = res.data.data.current_page;
        state.filters.pageSize = res.data.data.per_page;
        state.filters.totalCount = res.data.data.total;
      });
    };

    const del = (row) => {
      ElMessageBox.confirm("是否删除该模型", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("delete");
          getData.modelDelete(row.modelUuid).then((res) => {
            if (res.data.code === 200) {
              init();
              ElMessage.success("删除成功");
            } else if (res.data.code === 203) {
              ElMessage.error(res.data.msg);
            } else if (res.data.code === 404) {
              ElMessage.error("删除失败");
            }
          });
        })
        .catch(() => {});
    };
    const change = (row) => {
      state.changeOrAdd = 1;
      state.curModel = row;
      state.modelAddDialogVisible = true;
    };

    const download = (row) => {
      getData.modelDownLoad(row.modelUuid, { responseType: "blob" }).then((res) => {
        console.log(res);
        if (res.data && typeof res.data === "object") {
          if ("code" in res.data) {
            if (res.data.code === 404) {
              ElMessage.error(res.data.msg);
            } else {
              ElMessage.error(res.data.msg);
            }
          }
        } else {
          const blob = new Blob([res.data], { type: "application/octet-stream" }); // 根据实际文件类型调整
          const url = window.URL.createObjectURL(blob); // 创建一个指向 Blob 对象的 URL
          const modelName = row.modelName + ".aism"; // 设置文件名

          const link = document.createElement("a");
          link.href = url;
          link.download = modelName; // 设置下载文件名
          document.body.appendChild(link);
          link.click(); // 模拟点击
          document.body.removeChild(link); // 清理

          // 释放 URL 对象
          window.URL.revokeObjectURL(url);
          ElMessage.success("模型下载成功");
        }
      });
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

    const modelAddDialogClose = () => {
      state.modelAddDialogVisible = false;
      state.changeOrAdd = 0;
      state.curModel = null;
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
    return {
      ...toRefs(state),
      init,
      filtersClear,
      search,
      change,
      del,
      download,
      handleCurrentChange,
      handleSizeChange,
      modelAddDialogClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.model-cards {
  display: flex; /* 启用 Flexbox 布局 */
  flex-wrap: wrap; /* 允许换行 */
  justify-content: flex-start; /* 从左到右排列 */
  gap: 20px; /* 卡片之间的间距 */
  margin-top: 20px; /* 顶部间距 */
}

.model-card {
  flex: 1 1 200px; /* 每个卡片的基础宽度为 200px，并可缩放 */
  max-width: 300px; /* 最大宽度限制 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}
</style>
