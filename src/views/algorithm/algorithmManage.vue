<template>
  <div class="page-box">
    <div class="title-box flex-row" style="justify-content: space-between">
      <mySmallTitle text="算法仓库" font-size="20"></mySmallTitle>
    </div>
    <el-tabs v-model="activeTab" type="border-card" style="border-radius: 10px">
      <div class="model-cards">
        <modelCard v-for="model in models" :key="model.id" :model="model" @use="useAlgorithm" />
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
    </el-tabs>
    <el-dialog v-model="modelAddDialogVisible" v-if="modelAddDialogVisible" center append-to-body :title="changeOrAdd === 0 ? '新建模型' : '修改模型'" width="550px" @close="modelAddDialogClose">
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
        {
          id: 3,
          name: "未戴安全帽检测算法",
          description: "这是算法三的描述。",
          image: require("../../assets/img/model/helmet.jpg"),
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

    const change = (row) => {
      state.changeOrAdd = 1;
      state.curModel = row;
      state.modelAddDialogVisible = true;
    };

    const dowload = (row) => {};
    const handleCurrentChange = (val) => {
      state.filters.pageIndex = val;
      init();
    };
    const handleSizeChange = (val) => {
      state.filters.pageIndex = 1;
      state.filters.pageSize = val;
      init();
    };
    return {
      ...toRefs(state),
      init,
      change,
      dowload,
      handleCurrentChange,
      handleSizeChange,
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
