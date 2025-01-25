<template>
  <div class="flex-col" style="justfity-content: center; align-items: center">
    <el-form ref="myform" :model="form" :rules="rules" class="flex-form">
      <el-form-item label="图片集名称:" prop="imageName">
        <el-input v-model="form.imageName" placeholder="请输入图片集名称" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="图片集描述:" prop="imageDescription">
        <el-input v-model="form.imageDescription" placeholder="请输入图片集描述" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item v-if="changeOrAdd === 0" label="导入方式：" prop="imageImportMethod">
        <el-select v-model="form.imageImportMethod" placeholder="请选择导入图片方式" style="width: 300px">
          <el-option v-for="(item, index) in imageImportMethods" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="changeOrAdd === 0 && isLink" label="图片集路径:" prop="imageOssPath">
        <el-input v-model="form.imageOssPath" placeholder="请输入图片minio路径" style="width: 300px"></el-input>
      </el-form-item>
      <div class="flex-row" style="width: 100%; align-items: center">
        <el-form-item v-if="changeOrAdd === 0 && isLocal" label="本地文件:" prop="imageFileList">
          <el-button type="primary" @click="uploadImage" style="margin-left: 12px"
            ><el-icon><UploadFilled /></el-icon><span>{{ form.imageFileList.length > 0 ? "重新选择" : "上传图片" }}</span></el-button
          >
          <span v-if="form.imageFileList.length > 0">已上传 {{ form.imageFileList.length }} 张图片</span>
        </el-form-item>
      </div>
    </el-form>

    <div class="flex-row flex-center">
      <el-button type="primary" @click="add">确定</el-button>
      <el-button type @click="cancel">取消</el-button>
    </div>
    <el-dialog v-model="imageUploadDialogVisible" v-if="imageUploadDialogVisible" center append-to-body title="图片上传" width="800px" @close="imageUploadDialogClose">
      <imageUpload @imageUploadDialogClose="imageUploadDialogClose" @fileAdd="handleFileAdd"></imageUpload>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as getData from "../../service/getData";
import imageUpload from "../imgUpload.vue";
export default {
  components: { imageUpload },
  props: ["changeOrAdd", "curImage"],
  setup(props, context) {
    let myform = ref(null);
    let address = ref();
    onMounted(() => {
      console.log(props.changeOrAdd);
      if (props.changeOrAdd === 1) {
        console.log("回显");
        state.form.imageUuid = props.curImage.imageUuid;
        state.form.imageName = props.curImage.imageName;
        state.form.imageDescription = props.curImage.imageDescription;
      }
    });
    const state = reactive({
      imageImportMethods: [
        {
          label: "链接导入",
          value: "link",
        },
        {
          label: "本地上传",
          value: "local",
        },
      ],
      form: {
        imageUuid: null,
        imageName: null,
        imageDescription: null,
        imageOssPath: null,
        imageImportMethod: null,
        imageFileList: [],
      },
      rules: {
        imageName: [{ required: true, message: "请输入图片集名称", trigger: ["blur"] }],
        imageDescription: [{ required: true, message: "请输入图片集描述", trigger: ["blur"] }],
        imageOssPath: [{ required: true, message: "请输入图片路径", trigger: ["blur"] }],
        imageImportMethod: [{ required: true, message: "请选择导入图片方式", trigger: ["blur"] }],
        imageFileList: [{ required: true, message: "请选择上传图片", trigger: ["blur"] }],
      },
      imageUploadDialogVisible: false,
    });
    const add = () => {
      console.log(" image add ");
      console.log(state.form);
      myform.value.validate((vaild) => {
        console.log(vaild);
        if (vaild) {
          if (props.changeOrAdd === 0) {
            // 调用 新增图片集接口
            getData.imageAdd(state.form).then((res) => {
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
            getData.imageUpdate(state.form).then((res) => {
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
      context.emit("imageAddDialogClose");
    };
    const formReset = () => {
      console.log("表单重置");
    };
    const isLink = computed(() => {
      state.form.imageFileList = [];
      return state.form.imageImportMethod === "link";
    });
    const isLocal = computed(() => {
      return state.form.imageImportMethod === "local";
    });
    const uploadImage = () => {
      state.form.imageFileList = [];
      state.imageUploadDialogVisible = true;
    };
    const imageUploadDialogClose = () => {
      state.imageUploadDialogVisible = false;
    };
    const handleFileAdd = (files) => {
      state.form.imageFileList = files;
      console.log("Received file list:", state.form.imageFileList);
    };
    return {
      ...toRefs(state),
      myform,
      address,
      add,
      cancel,
      isLink,
      isLocal,
      uploadImage,
      imageUploadDialogClose,
      handleFileAdd,
    };
  },
};
</script>

<style></style>
