<template>
  <div class="page-box">
    <div class="title-box flex-row" style="justify-content: space-between;">
      <mySmallTitle text="视频流" font-size="20"></mySmallTitle>
      <div class="flex-row">
        <el-button type="primary" @click=" streamAddDialogVisible = true;" >新增视频流</el-button>
      </div>
    </div>
    <div class="searchBar-box flex-row" style="justify-content: space-between;">
      <div class="searchContent" style="margin-top:20px;">
        <el-form :model="filters" :rules="rules" :inline="true">
          <el-form-item label="视频流名称：" prop="streamName">
            <el-input v-model="filters.streamName" />
          </el-form-item>
          <el-form-item label="视频流地址：" prop="streamUrl">
            <el-input v-model="filters.streamUrl" />
          </el-form-item>
          <el-form-item label="视频流状态：" prop="streamStatus">
            <el-select v-model="filters.streamStatus" placeholder="视频流状态：" style="width:130px">
              <el-option v-for="(streamStatus,index) in streamStatusOptions" :key="index" :label="streamStatus" :value="streamStatus" />
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
        <el-table :data="streamData" stripe  style="width: 100%" height="430">
          <el-table-column label="名称" prop="streamName"></el-table-column>
          <el-table-column label="视频流地址" prop="streamUrl" ></el-table-column>
          <el-table-column label="视频流描述" prop="streamDescription"></el-table-column>
          <el-table-column label="视频流状态" prop="streamStatus">
            <template v-slot="scope">
              <!-- <el-icon v-if="scope.row.streamStatus === '正常'" color="green">
                <CircleCheck />
              </el-icon>
              <el-icon v-else color="red">
                <CircleClose />
              </el-icon>
              <span >{{ scope.row.streamStatus }}</span> -->
              <span :style="{ color: scope.row.streamStatus === '正常' ? 'green' : 'red' }">
                {{ scope.row.streamStatus }}
              </span>
            </template>
          </el-table-column> 
          <el-table-column label="数据创建时间" prop="streamCreateTime"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click.stop="change(scope.row,scope.$streamUuid)">修改</el-button>
              <el-button size="small" type="danger"  plain @click.stop="del(scope.row,scope.$streamUuid)">删除</el-button>
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

    <!-- 新增视频流dialog -->
    <el-dialog v-model="streamAddDialogVisible" v-if="streamAddDialogVisible" center append-to-body :title ="changeOrAdd === 0?'新增视频流':'修改视频流'" width="550px" @close="streamAddDialogClose">
      <streamAdd @streamAddDialogClose="streamAddDialogClose" @init="init" :changeOrAdd="changeOrAdd" :curStream="curStream" ></streamAdd>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import mySmallTitle from '../../components/mySmallTitle.vue';
import streamAdd from '../../components/dataSource/streamAdd.vue'
import * as getData from "../../service/getData";
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
  components:{
    mySmallTitle,  streamAdd,
  },
  setup() {
    onMounted(()=>{
      init();
    })
    const state = reactive({
      filters:{
        streamName: null,
        streamDescription:null,
        streamUrl: null,
        streamStatus:null,
        streamCreateTime:null,
        time: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount:10,
      },
      rules:{
      },
      streamStatusOptions:["正常","异常"],
      streamData: [],
      changeOrAdd:0,
      curStream:null,
      streamAddDialogVisible: false, // 控制视频流新增dialog
    });
    const init = () => {
      console.log('init')
      getData.streamPageList(state.filters).then((res)=>{
        console.log(res);
        state.loading = false;
        state.streamData = res.data.data.items;
        state.filters.pageIndex = res.data.data.current_page;
        state.filters.pageSize = res.data.data.per_page;
        state.filters.totalCount = res.data.data.total;
      })
    }
    const filtersClear = () => {
      state.filters = {
        streamName: null,
        streamUrl: null,
        streamStatus:null,
        time: [],
        curStream:null,
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
      state.curStream = row;
      state.streamAddDialogVisible = true;
    }
    const del = (row,index)=>{
      ElMessageBox.confirm(
          '是否删除该视频流源',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(()=>{
          console.log(row.streamUuid)
          getData.streamDelete(row.streamUuid).then((res)=>{
            console.log(res)
            if(res.data.code === 200){
              init();
              ElMessage.success(res.data.msg);
            }else{
              ElMessage.error(res.data.msg);
            }
          })
        }).catch(()=>{})
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
    const streamAddDialogClose = () => {
      state.streamAddDialogVisible = false;
      state.changeOrAdd = 0;
      state.curStream = null;
    }
    return {
      ...toRefs(state),
      init, filtersClear, search, change, del, handleCurrentChange, handleSizeChange,
      streamAddDialogClose
    };
  },
}
</script>

<style lang="scss" scoped>
</style>