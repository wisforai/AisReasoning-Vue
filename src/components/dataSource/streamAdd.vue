<template>
    <div class="flex-col" style="justfity-content:center;align-items:center;">
      <el-form ref="myform" :model="form" :rules="rules" class="flex-form">
        <el-form-item label="视频流名称:" prop="streamName">
          <el-input v-model="form.streamName" placeholder="请输入视频流名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="视频流描述:" prop="streamDescription">
          <el-input v-model="form.streamDescription" placeholder="请输入视频流描述" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="视频流地址:" prop="streamUrl">
          <el-input v-model="form.streamUrl" placeholder="请输入视频流地址" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
  
      <div class="flex-row flex-center">
        <el-button type="primary" @click="add">确定</el-button>
        <el-button type @click="cancel">取消</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, ref, toRefs, onMounted } from 'vue';
  import { ElMessage, ElMessageBox, ElTimeSelect } from 'element-plus'
  import * as getData from "../../service/getData";
  
  export default {
    components:{
    },
    props:[
      'changeOrAdd','curStream'
    ],
    setup(props, context){
      let myform = ref(null);
      let address = ref();
      onMounted(()=>{
        console.log(props.changeOrAdd);
        if(props.changeOrAdd === 1){
          console.log("回显");
          console.log(props.curStream)
          state.form.streamName = props.curStream.streamName;
          state.form.streamDescription = props.curStream.streamDescription;
          state.form.streamUrl = props.curStream.streamUrl;
        }
      })
      const state = reactive({
        form:{
          streamName: null,
          streamDescription:null,
          streamUrl:null
        },
        rules:{
          streamName: [
            { required: true, message: '请输入视频流名称', trigger: ['blur'] },
          ],
          streamDescription: [
            { required: true, message: '请输入视频流描述', trigger: ['blur'] },
          ],
          streamUrl: [
            { required: true, message: '请输入视频流地址', trigger: ['blur'] },
          ],
        }
      })
      const add = () => {
        console.log(' stream add ')
        console.log(state.form);
        myform.value.validate((vaild)=>{
          console.log(vaild)
          if(vaild){
            if(props.changeOrAdd === 0){
              // 调用 新增视频流接口
              getData.streamAdd(state.form).then((res)=>{
                console.log(res);
                if(res.data.code === 200){
                  cancel();
                  context.emit("init");
                  ElMessage.success(res.data.msg);
                }else{
                  ElMessage.error(res.data.msg)
                }
              })
            }else{
              state.form.streamUuid = props.curStream.streamUuid;
              getData.streamUpdate(state.form).then((res)=>{
                console.log(res);
                if(res.data.code === 200){
                  cancel();
                  context.emit("init");
                  ElMessage.success(res.data.msg);
                }else{
                  ElMessage.error(res.data.msg)
                }
              })
            }
          }
        })
        }
      const cancel = () => {
        formReset();
        context.emit('streamAddDialogClose');
      }
      const formReset = () => {
        console.log('表单重置');
        state.form.streamName = null;
        state.form.streamDescription = null;
        state.form.streamUrl = null;
      }
      return{
        ...toRefs(state), myform, address,
        add, cancel
      }
    }
  };
  </script>
  
  <style>
  </style>