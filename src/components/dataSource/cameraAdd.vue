<template>
    <div class="flex-col" style="justfity-content:center;align-items:center;">
      <el-form ref="myform" :model="form" :rules="rules" class="flex-form">
        <el-form-item label="名称:" prop="cameraName">
          <el-input v-model="form.cameraName" placeholder="名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="cameraDescription">
          <el-input v-model="form.cameraDescription" placeholder="名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="设备:" prop="cameraDevice">
          <el-select v-model="form.cameraDevice" placeholder="请选择设备" style="width:300px">
              <el-option v-for="(item,index) in cameraDevice" :key="index" :label="item.cameraDevice" :value="item.cameraDevice"></el-option>
          </el-select>
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
  import { ElMessage, ElMessageBox } from 'element-plus'
  import * as getData from "../../service/getData";
  
  export default {
    components:{
    },
    props:[
      'changeOrAdd','curCamera'
    ],
    setup(props, context){
      let myform = ref(null);
      let address = ref();
      const validatePass = (rule, value, callback) => {
        console.log(address.value)
        if (address.value.form.province === ''|| address.value.form.city === '' || address.value.form.district === '') {
          callback(new Error('请输入完整企业地址'));
        }
        callback();
      } 
      onMounted(()=>{
        console.log(props.changeOrAdd);
        if(props.changeOrAdd === 1){
          console.log("回显");
          
        }
      })
      const state = reactive({
        form:{
          CameraName: null,
          CameraPlace:null,
          province:null,
          city:null,
          district:null,
          cameraDevice:null,
          CameraContact: null,
          CameraChemical: null,
        },
        rules:{
          cameraName: [
            { required: true, message: '请输入工业相机名称', trigger: ['blur'] },
          ],
          cameraDevice: [
            { required: true, message: '请选择相机设备', trigger: ['blur'] },
          ],
        }
      })
      const add = () => {
        console.log(' Camera add ')
        console.log(state.form);
        myform.value.validate((vaild)=>{
          console.log(vaild)
          if(vaild){
            // 调用 新增工业相机接口
            if(props.changeOrAdd === 0){
              getData.cameraAdd(state.form).then((res)=>{
                console.log(res);
                if(res.data.code === 200){
                  cancel();
                  context.emit("init");
                  ElMessage.success(res.data.msg);
                }else{
                  ElMessage.error(res.data.msg);
                }
              })
            }else{
              state.form.id = props.curCamera.id;
              getData.CameraUpdate(state.form).then((res)=>{
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
        context.emit('cameraAddDialogClose');
      }
      const formReset = () => {
        console.log('表单重置');
        state.form.CameraName = null;
        state.form.CameraPlace = null;
        state.form.CameraContact = null;
        state.form.CameraChemical = null;
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