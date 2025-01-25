<template>
  <div class="page-box">
    <div class="title-box flex-row" style="justify-content: space-between;">
      <mySmallTitle text="工业相机" font-size="20"></mySmallTitle>
      <div class="flex-row">
        <el-button type="primary" @click=" cameraAddDialogVisible = true;" >新增工业相机</el-button>
      </div>
    </div>
    <div class="searchBar-box flex-row" style="justify-content: space-between;">
      <div class="searchContent" style="margin-top:20px;">
        <el-form :model="filters" :rules="rules" :inline="true">
          <el-form-item label="名称：" prop="cameraName">
            <el-input v-model="filters.cameraName" />
          </el-form-item>
          <el-form-item label="设备名称：" prop="cameraDevice">
            <el-select v-model="filters.cameraDevice" placeholder="设备选择" style="width:130px">
              <el-option v-for="(item,index) in cameraDevices" :key="index" :label="item.cameraDevice" :value="item.cameraDevice" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="searchButton flex-row">
        <el-button  @click="filtersClear">重置</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="flex-direction-box">
      <div class="table-box">
        <el-table :data="cameraData" stripe  style="width: 100%" height="430">
          <el-table-column label="名称" prop="cameraName"></el-table-column>
          <el-table-column label="设备名称" prop="cameraDevice"></el-table-column>
          <el-table-column label="任务创建时间" prop="creatTime"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click.stop="change(scope.row,scope.$index)">修改</el-button>
              <el-button size="small" type="danger"  plain @click.stop="del(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="toolbar">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                        background
                        :current-page="filters.pageIndex" :page-size="filters.pageSize"
                        layout="total, prev, pager, next, sizes, jumper" :total="filters.totalCount"
                        style="float:right;margin-top: 0;">
        </el-pagination>
      </div>
    </div>

    <!-- 工业相机新增dialog -->
    <el-dialog v-model="cameraAddDialogVisible" v-if="cameraAddDialogVisible" center append-to-body title="新增工业相机" width="550px" @close="cameraAddDialogClose">
      <cameraAdd @cameraAddDialogClose="cameraAddDialogClose" @init="init" :changeOrAdd="changeOrAdd" :curCamera="curCamera" ></cameraAdd>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import mySmallTitle from '../../components/mySmallTitle.vue';
import cameraAdd from '../../components/dataSource/cameraAdd.vue'
import * as getData from "../../service/getData";
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
  components:{
    mySmallTitle,  cameraAdd,
  },
  setup() {
    onMounted(()=>{
      init();
    })
    const state = reactive({
      filters:{
        time: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount:10,
      },
      rules:{
      },
      cameraData: [],
      changeOrAdd:0,
      curCamera:null,
      cameraAddDialogVisible: false, // 控制企业新增dialog
    });
    const init = () => {
      console.log('init')
    }
    const filtersClear = () => {
      state.filters = {
        time: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount:10,
      }
      init();
    }
    const search = () => {
      // 根据当前表单调用 分页搜索接口
      state.filters.pageIndex = 1;
      init();
    }
    const change = (row,index)=>{
      state.changeOrAdd = 1;
      state.curCamera = row;
      state.cameraAddDialogVisible = true;
    }
    const del = (row,index)=>{
      // ElMessageBox.confirm(
      //     '是否删除该企业',
      //     '提示',
      //     {
      //       confirmButtonText: '确认',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //     }
      //   ).then(()=>{
      //     getData.cameraDelete(row.id).then((res)=>{
      //       if(res.data.code === 200){
      //         init();
      //         ElMessage.success("删除成功");
      //       }else if(res.data.code === 203){
      //         ElMessage.error(res.data.msg);
      //       }else if(res.data.code === 404){
      //         ElMessage.error("删除失败");
      //       }
      //     })
      //   }).catch(()=>{})
    }
    const handleCurrentChange = (val) => {
      state.filters.pageIndex = val;
      init();
    }
    const handleSizeChange = (val) =>{
      state.filters.pageIndex = 1;
      state.filters.pageSize = val;
      init();
    }
    const cameraAddDialogClose = () => {
      state.cameraAddDialogVisible = false;
      state.changeOrAdd = 0;
      state.curCamera = null;
    }
    return {
      ...toRefs(state),
      init, filtersClear, search, change, del, handleCurrentChange, handleSizeChange,
      cameraAddDialogClose
    };
  },
}
</script>

<style lang="scss" scoped>
</style>