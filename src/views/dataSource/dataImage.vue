<template>
  <div class="page-box">
    <div class="title-box flex-row" style="justify-content: space-between">
      <mySmallTitle text="图片集" font-size="20"></mySmallTitle>
      <div class="flex-row">
        <el-button type="primary" @click="imageAddDialogVisible = true">新增图片集</el-button>
      </div>
    </div>
    <div class="searchBar-box flex-row" style="justify-content: space-between">
      <div class="searchContent" style="margin-top: 20px">
        <el-form :model="filters" :rules="rules" :inline="true">
          <el-form-item label="图片集名称：" prop="imageName">
            <el-input v-model="filters.imageName" style="width: 180px" />
          </el-form-item>
          <el-form-item label="图片集状态：" prop="imageStatus">
            <el-select v-model="filters.imageStatus" placeholder="请选择" style="width: 130px">
              <el-option v-for="(imageStatus, index) in imageStatusOptions" :key="index" :label="imageStatus" :value="imageStatus" />
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
        <el-table :data="imageData" stripe style="width: 100%" height="430">
          <el-table-column label="名称" prop="imageName"></el-table-column>
          <el-table-column label="描述" prop="imageDescription"></el-table-column>
          <el-table-column label="路径" prop="imageOssPath"></el-table-column>
          <el-table-column label="数量" prop="imageNum"></el-table-column>
          <el-table-column label="状态" prop="imageStatus">
            <template v-slot="scope">
              <!-- <el-icon v-if="scope.row.streamStatus === '正常'" color="green">
                <CircleCheck />
              </el-icon>
              <el-icon v-else color="red">
                <CircleClose />
              </el-icon>
              <span >{{ scope.row.streamStatus }}</span> -->
              <span :style="{ color: scope.row.imageStatus === '可用' ? 'green' : 'red' }">
                {{ scope.row.imageStatus }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" prop="imageCreateTime"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click.stop="look(scope.row, scope.$imageUuid)">查看</el-button>
              <el-button size="small" type="primary" plain @click.stop="change(scope.row, scope.$imageUuid)">修改</el-button>
              <el-button size="small" type="danger" plain @click.stop="del(scope.row, scope.$imageUuid)">删除</el-button>
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
    <!-- 新增/修改图片集dialog -->
    <el-dialog v-model="imageAddDialogVisible" v-if="imageAddDialogVisible" center append-to-body :title="changeOrAdd === 0 ? '新增图片集' : '修改图片集'" width="550px" @close="imageAddDialogClose">
      <imageAdd @imageAddDialogClose="imageAddDialogClose" @init="init" :changeOrAdd="changeOrAdd" :curImage="curImage"></imageAdd>
    </el-dialog>

    <el-dialog v-model="imageViewDialogVisible" v-if="imageViewDialogVisible" center append-to-body title="图片集列表" width="800px" @close="imageViewDialogClose">
      <imageView @imageViewDialogClose="imageViewDialogClose" @init="init" :curImageUrls="curImageUrls"></imageView>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import mySmallTitle from "../../components/mySmallTitle.vue";
import imageAdd from "../../components/dataSource/imageAdd.vue";
import imageView from "../../components/imageView.vue";
import * as getData from "../../service/getData";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  components: {
    mySmallTitle,
    imageAdd,
    imageView,
  },
  setup() {
    onMounted(() => {
      init();
    });
    const state = reactive({
      filters: {
        imageName: null,
        imageNum: null,
        imageOssPath: null,
        imageStatus: null,
        imageCreateTime: null,
        time: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 10,
      },
      numberRange: [],
      // curImageUrls: [
      //   "http://192.168.21.82:9000/test/2024-11-18-16-54-18-826819.jpg",
      //   "http://192.168.21.82:9000/test/2.jpg",
      //   "http://192.168.21.82:9000/test/3.jpg",
      //   "http://192.168.21.82:9000/test/1.jpg",
      //   "http://192.168.21.82:9000/test/2.jpg",
      //   "http://192.168.21.82:9000/test/1.jpg",
      //   "http://192.168.21.82:9000/test/2.jpg",
      //   "http://192.168.21.82:9000/test/3.jpg",
      //   "http://192.168.21.82:9000/test/2024-10-19-10-19-00-166596.jpg",
      //   "http://192.168.21.82:9000/test/2.jpg",
      //   "http://192.168.21.82:9000/test/3.jpg",
      // ],
      curImageUrls: [],
      // imageData: [],
      imageData: [
        {
          imageUuid: 1,
          imageName: "示例图片 1",
          imagePath: "http://192.168.21.82:9000/test",
          imageDescription: "这是第一张示例图片的描述。",
          imageNum: 5,
          imageStatus: "可用",
          createTime: "2023-01-15 10:00:00",
        },
        {
          imageUuid: 2,
          imageName: "示例图片 2",
          imagePath: "http://192.168.21.82:9000/test",
          imageDescription: "这是第二张示例图片的描述。",
          imageNum: 10,
          imageStatus: "不可用",
          createTime: "2023-02-20 14:30:00",
        },
      ],
      imageStatusOptions: ["上传中", "上传成功", "上传失败"],
      intensitys: [],
      tightnesss: [],
      rules: {},
      imageAddDialogVisible: false, // 控制图片新增dialog
      imageViewDialogVisible: false, // 控制查看图片dialog
      radio1: 1,
      changeOrAdd: 0,
      curImage: null,
    });
    const init = () => {
      console.log("init");
      getData.imagePageList(state.filters).then((res) => {
        console.log(res);
        state.loading = false;
        state.imageData = res.data.data.items;
        state.filters.pageIndex = res.data.data.current_page;
        state.filters.pageSize = res.data.data.per_page;
        state.filters.totalCount = res.data.data.total;
      });
    };
    const filtersClear = () => {
      state.filters = {
        imageName: null,
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
    const change = (row, index) => {
      state.changeOrAdd = 1;
      state.curImage = row;
      console.log(state.curImage);
      state.imageAddDialogVisible = true;
    };
    const look = (row, index) => {
      state.curImage = row;

      getData.imageLook({ imageOssPath: row.imageOssPath }).then((res) => {
        if (res.data.code === 200) {
          state.curImageUrls = res.data.data.imageUrlList;
        } else {
          ElMessage.error(res.data.msg);
        }
      });
      state.imageViewDialogVisible = true;
      // state.filters.pageIndex = 1;
    };
    const del = (row, index) => {
      ElMessageBox.confirm("是否删除该图片集", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getData.imageDelete(row.imageUuid).then((res) => {
            if (res.data.code === 200) {
              init();
              ElMessage.success("删除成功");
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
    // 关闭新增图片dialog 方法
    const imageAddDialogClose = () => {
      state.imageAddDialogVisible = false;
      state.changeOrAdd = 0;
      state.curImage = null;
    };
    const imageViewDialogClose = () => {
      state.imageViewDialogVisible = false;
    };
    return {
      ...toRefs(state),
      init,
      filtersClear,
      search,
      change,
      look,
      del,
      handleCurrentChange,
      handleSizeChange,
      imageAddDialogClose,
      imageViewDialogClose,
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
