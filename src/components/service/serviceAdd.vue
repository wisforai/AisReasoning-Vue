<template>
    <div class="flex-col" style="justfity-content:center;align-items:center;">
      <el-form ref="myform" :model="form" :rules="rules" class="flex-form">
        <el-form-item label="名称:" prop="serviceName">
            <el-input v-model="form.serviceName" placeholder="请输入服务名称" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="serviceDescription">
            <el-input v-model="form.serviceDescription" placeholder="请输入服务描述" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="模型:" prop="modelName">
          <el-select v-model="form.modelName" placeholder="请选择模型" style="width:300px">
            <el-option v-for="(item,index) in modelData" :key="index" :label="item.modelName" :value="item.modelName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="端口:" prop="servicePort">
            <el-input v-model="form.servicePort" placeholder="请输入服务端口" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="路由:" prop="serviceRoute">
            <el-input v-model="form.serviceRoute" placeholder="请输入服务路由" style="width:300px;"></el-input>
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
      'changeOrAdd','curService'
    ],
    setup(props, context){
      let myform = ref(null);
      let address = ref();
      onMounted(()=>{
        console.log(props.changeOrAdd);
        modelList();
        if(props.changeOrAdd === 1){
          console.log("回显");
          state.form.serviceName = props.curService.serviceName;
          state.form.serviceDescription = props.curService.serviceDescription;
          state.form.servicePort = props.curService.servicePort;
          state.form.modelName = props.curService.modelName;
          state.form.serviceRoute = props.curService.serviceRoute;
          state.form.serviceName = props.curService.serviceName;
        }
      })
      const validatePort = (rule, value, callback) => {
        const port = Number(value);
        if (isNaN(port)) {
          callback(new Error('请输入有效端口'));
        } else if (port < 1 || port > 65535) {
          callback(new Error('端口号必须在 1 到 65535 之间'));
        } else {
          callback(); // 验证通过
        }
    };

      const state = reactive({
        modelData: [],
        form:{
          serviceName: null,
          serviceDescription:null,
          modelName:null,
          modelUuid:null,
          serviceIp:null,
          serviceRoute:null,
          servicePort:null,
          serviceType:'single_model_deploy'
        },
        rules:{
            serviceName: [
                { required: true, message: '请输入服务名称', trigger: ['blur'] },
            ],
            serviceDescription: [
                { required: true, message: '请输入服务描述', trigger: ['blur'] },
            ],
            modelName: [
                { required: true, message: '请选择模型', trigger: ['blur'] },
            ],
            serviceRoute: [
                { required: true, message: '请输入服务路由', trigger: ['blur'] },
            ],
            servicePort: [
                { required: true, message: '请输入服务端口', trigger: ['blur'] },
                { validator: validatePort, trigger: ['blur', 'change'] },
          ]
        }
      })

      const modelList = () =>{
        getData.modelList().then((res)=>{
          console.log(res)
          state.modelData = res.data.data;
        })
      }
      const add = () => {
        console.log('service add')
        console.log(state.form);
        myform.value.validate((vaild)=>{
          console.log(vaild)
          if(vaild){
            // 调用 新增服务接口
            console.log(props.changeOrAdd)
            if(props.changeOrAdd === 0){
              const curModel = state.modelData.find(item => item.modelName === state.form.modelName);
              console.log(curModel)
              if(curModel){
                state.form.modelUuid = curModel.modelUuid;
              }
              getData.serviceAdd(state.form).then((res)=>{
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
              state.form.id = props.curService.serviceUuid;
              getData.serviceUpdate(state.form).then((res)=>{
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
        context.emit('serviceAddDialogClose');
      }
      const formReset = () => {
        console.log('表单重置');
        state.form.serviceName = null;
        state.form.servicePlace = null;
        state.form.serviceContact = null;
        state.form.serviceChemical = null;
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