<template>
  <div class="flex-col" style="justfity-content: center; align-items: center">
    <el-form ref="myform" :model="form" :rules="rules" class="flex-form">
      <el-form-item label="名称:" prop="modelName">
        <el-input v-model="form.modelName" placeholder="请输入模型名称" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="modelDescription">
        <el-input v-model="form.modelDescription" placeholder="请输入模型描述" style="width: 300px"></el-input>
      </el-form-item>
      <div class="flex-row" v-if="changeOrAdd === 0" style="width: 100%; align-items: center">
        <el-form-item label="模型:" prop="modelFileName">
          <el-upload ref="uploadRef" class="upload-demo" :limit="1" :auto-upload="false" :on-exceed="handleExceed" :on-change="beforeUpload">
            <el-button type="primary">选择模型</el-button>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item label="类别:" v-if="changeOrAdd === 0" prop="modelType">
        <el-select v-model="form.modelType" placeholder="请选择模型类别" style="width: 300px">
          <el-option v-for="(modelType, index) in modelTypes" :key="index" :label="modelType" :value="modelType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="大小:" v-if="changeOrAdd === 0" prop="modelSize">
        <el-input v-model="form.modelSize" placeholder="请输入模型大小" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="版本:" v-if="changeOrAdd === 0" prop="modelVersion">
        <el-input v-model="form.modelVersion" placeholder="请输入模型版本" style="width: 300px"></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row flex-center">
      <el-button type="primary" @click="add">确定</el-button>
      <el-button type @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as getData from "../../service/getData";
import SparkMD5 from "spark-md5";

export default {
  components: {},
  props: ["changeOrAdd", "curModel"],
  setup(props, context) {
    let myform = ref(null);
    let address = ref();
    onMounted(() => {
      console.log(props.changeOrAdd);
      if (props.changeOrAdd === 1) {
        console.log("回显");
        state.form.modelName = props.curModel.modelName;
        state.form.modelDescription = props.curModel.modelDescription;
        state.form.modelType = props.curModel.modelType;
        state.form.modelSize = props.curModel.modelSize;
        state.form.modelVersion = props.curModel.modelVersion;
        state.form.modelPath = props.curModel.modelPath;
        state.form.modelMd5 = props.curModel.modelMd5;
      }
    });
    const state = reactive({
      modelTypes: ["目标检测", "实例分割", "旋转检测"],
      form: {
        modelUuid: null,
        modelName: null,
        modelDescription: null,
        modelType: null,
        modelSize: null,
        modelVersion: null,
        modelPath: null,
        modelMd5: null,
        modelFileName: null,
      },
      rules: {
        modelFileName: [{ required: true, message: "请选择模型文件", trigger: ["blur"] }],
        modelName: [{ required: true, message: "请输入模型名称", trigger: ["blur"] }],
        modelDescription: [{ required: true, message: "请输入模型描述", trigger: ["blur"] }],
        modelType: [{ required: true, message: "请选择模型类别", trigger: "blur" }],
        modelVersion: [{ required: true, message: "请输入模型版本", trigger: ["blur"] }],
        modelSize: [{ required: true, message: "请输入模型大小", trigger: ["blur"] }],
        modelMd5: [{ required: true, message: "请输入模型Md5值", trigger: ["blur"] }],
      },
    });
    const add = () => {
      myform.value.validate((vaild) => {
        if (vaild) {
          // 调用 新增服务接口
          console.log(props.changeOrAdd);
          if (props.changeOrAdd === 0) {
            getData.modelAdd(state.form).then((res) => {
              console.log(state.form);
              console.log(res);
              if (res.data.code === 200) {
                cancel();
                context.emit("init");
                ElMessage.success(res.data.msg);
              } else {
                ElMessage.error(res.data.msg);
              }
            });
          } else {
            state.form.modelUuid = props.curModel.modelUuid;
            console.log(state.form);
            getData.modelUpdate(state.form).then((res) => {
              console.log();
              console.log(res);
              if (res.data.code === 200) {
                cancel();
                context.emit("init");
                ElMessage.success(res.data.msg);
              } else {
                ElMessage.error(res.data.msg);
              }
            });
          }
        }
      });
    };
    const cancel = () => {
      formReset();
      context.emit("modelAddDialogClose");
    };
    const formReset = () => {
      console.log("表单重置");
      state.form.serviceName = null;
      state.form.servicePlace = null;
      state.form.serviceContact = null;
      state.form.serviceChemical = null;
    };
    const uploadRef = ref(null);

    const handleExceed = (files) => {
      uploadRef.value.clearFiles();
      const file = files[0];
      file.uid = genFileId();
      uploadRef.value.handleStart(file);

      state.form.modelFile = file;
    };

    const genFileId = () => {
      return Date.now(); // 生成唯一 ID（示例）
    };

    const beforeUpload = (response, file) => {
      console.log(response);
      console.log(file);
      // console.log(state.fileList);
      // state.resultImage = response.url
      const isAism = file[0].name.endsWith(".aism");
      if (!isAism) {
        ElMessage.error("仅支持 .aism 文件格式!");
        uploadRef.value.clearFiles();
        return false;
      }
      state.form.modelFileName = file[0].name;
      convertToBase64(response.raw).then((base64) => {
        state.form.modelBase64 = base64;
      });

      calculateMD5(response.raw).then((md5) => {
        state.form.modelMd5 = md5;
      });
      console.log(state.form.modelFile);
      return true;
    };

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = (event) => {
          const base64 = event.target.result;
          resolve(base64);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const calculateMD5 = (file) => {
      return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          const arrayBuffer = event.target.result;
          spark.append(arrayBuffer); // 计算 MD5
          const md5 = spark.end(); // 获取 MD5 值
          resolve(md5);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };

        fileReader.readAsArrayBuffer(file); // 读取为 ArrayBuffer
      });
    };
    // const beforeUpload = (file) => {
    //   const isAism = file.name.endsWith(".aism");
    //   if (!isAism) {
    //     ElMessage.error("仅支持 .aism 文件格式!");
    //     uploadRef.value.clearFiles();
    //   }
    //   console.log(file instanceof File); // 检查是否为 File 对象
    //   console.log(file.name); // 文件名
    //   console.log(file.size); // 文件大小
    //   console.log(file.type); // MIME 类型

    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const modelByte = new Uint8Array(e.target.result);
    //     state.form.modelFile = file;
    //     state.form.modelFile.modelByte = modelByte;
    //     console.log(state.form.modelFile);
    //   };

    //   reader.readAsArrayBuffer(file);
    //   return isAism;
    // };
    return {
      ...toRefs(state),
      myform,
      address,
      add,
      cancel,
      uploadRef,
      beforeUpload,
      handleExceed,
      genFileId,
    };
  },
};
</script>

<style></style>
