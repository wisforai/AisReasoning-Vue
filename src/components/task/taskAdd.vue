<template>
  <div class="flex-col" style="justfity-content: center; align-items: center">
    <el-form ref="myform" :model="form" :rules="rules" class="flex-form" style="width: 100%">
      <el-form-item label="任务名称:" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入任务名称" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="任务描述:" prop="taskDescription">
        <el-input v-model="form.taskDescription" placeholder="请输入任务描述" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item v-if="changeOrAdd === 0" label="任务数据:" prop="selectDataSource">
        <el-cascader v-model="form.selectDataSource" :options="dataSourceNames" style="width: 300px" placeholder="请选择数据源" :show-all-levels="true" />
      </el-form-item>
      <el-form-item v-show="isImage" label="结果地址:" prop="resultUrl">
        <el-input v-model="form.resultUrl" placeholder="请输入图片算法推理结果上传地址,未输入则为默认服务器" style="width: 300px" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"></el-input>
      </el-form-item>
      <el-form-item v-show="isStream" label="推流地址:" prop="pushStreamUrl">
        <el-input v-model="form.pushStreamUrl" placeholder="请输入视频流算法结果推流地址,未输入则为默认服务器" style="width: 300px" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"></el-input>
      </el-form-item>
      <div class="flex-container" style="width: 100%; align-items: center; justify-content: center">
        <el-form-item v-show="isStream" label="是否显示置信度:" prop="drawScore" style="width: 35%">
          <el-switch v-model="form.drawScore"></el-switch>
        </el-form-item>
        <el-form-item v-show="isStream" label="是否显示标签:" prop="drawCategory" style="width: 35%">
          <el-switch v-model="form.drawCategory"></el-switch>
        </el-form-item>
        <el-form-item v-show="isStream" label="抽帧频率:" prop="sampleRatio" style="width: 35%">
          <el-slider v-model="form.sampleRatio" :step="0.1" :min="0.1" :max="1" style="width: 65%" />
        </el-form-item>
        <el-form-item v-show="isStream" label="是否跟踪:" prop="enableTrack" style="width: 35%">
          <el-switch v-model="form.enableTrack" @change="handleTrackChange"></el-switch>
        </el-form-item>
        <el-form-item v-show="isTrack" label="是否计数:" prop="enableCount" style="width: 35%">
          <el-switch v-model="form.enableCount" @change="handleCountChange"></el-switch>
        </el-form-item>
        <el-form-item v-show="isCount" label="是否显示计数:" prop="drawCount" style="width: 35%">
          <el-switch v-model="form.drawCount"></el-switch>
        </el-form-item>
      </div>
      <el-form-item v-if="changeOrAdd === 0" label="模型/服务:" prop="selectProcessType">
        <el-cascader v-model="form.selectProcessType" :options="processTypeNames" style="width: 300px" placeholder="请选择模型/服务" :show-all-levels="true" />
      </el-form-item>
    </el-form>
    <div class="flex-row flex-center">
      <el-button type="primary" @click="add">确定</el-button>
      <el-button type @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as getData from "../../service/getData";

export default {
  components: {},
  props: ["changeOrAdd", "curTask"],
  setup(props, context) {
    let myform = ref(null);
    onMounted(() => {
      dataSourceList();
      processTypeList();
      console.log(props.changeOrAdd);
      if (props.changeOrAdd === 1) {
        state.form.taskUuid = props.curTask.taskUuid;
        state.form.taskName = props.curTask.taskName;
        state.form.streamUrl = props.curTask.streamUrl;
        state.form.taskDescription = props.curTask.taskDescription;
        state.form.sourceType = props.curTask.sourceType;
        state.form.pushStreamUrl = props.curTask.pushStreamUrl;

        state.form.sampleRatio = props.curTask.sampleRatio;
        state.form.enableTrack = props.curTask.enableTrack;
        state.form.enableCount = props.curTask.enableCount;

        state.form.drawCategory = props.curTask.drawCategory;
        state.form.drawScore = props.curTask.drawScore;
        state.form.drawCount = props.curTask.drawCount;
        // 回显数据源
        state.form.selectDataSource = [props.curTask.sourceType, props.curTask.sourceUuid];
        // 回显模型/服务
        state.form.selectProcessType = [props.curTask.taskProcessType, props.curTask.taskProcessUuid];
      }
    });

    const state = reactive({
      modelData: [],
      serviceData: [],
      streamData: [],
      form: {
        taskName: null,
        taskUuid: null,
        sourceType: null,
        taskDescription: null,
        selectDataSource: null,
        resultUrl: null,
        pushStreamUrl: null,
        enableTrack: false,
        sampleRatio: 0.5,
        drawScore: true,
        drawCategory: true,
        enableCount: false,
        drawCount: false,
      },
      dataSourceNames: [
        {
          label: "图片",
          value: "image",
          disabled: true,
          children: [],
        },
        {
          label: "视频流",
          value: "stream",
          disabled: true,
          children: [],
        },
        {
          label: "工业相机",
          value: "camera",
          disabled: true,
          children: [],
        },
      ],
      processTypeNames: [
        {
          label: "模型",
          value: "model",
          disabled: false,
          children: [],
        },
        {
          label: "服务",
          value: "service",
          disabled: true,
          children: [],
        },
        {
          label: "算法仓库",
          value: "algorithm",
          disabled: true,
          children: [],
        },
      ],
      rules: {
        taskName: [{ required: true, message: "请输入任务名称", trigger: ["blur"] }],
        taskDescription: [{ required: true, message: "请输入任务名称", trigger: ["blur"] }],
        selectDataSource: [{ required: true, message: "请选择数据源", trigger: "blur" }],
        selectProcessType: [{ required: true, message: "请选择模型/服务", trigger: "blur" }],
      },
    });
    const dataSourceList = () => {
      //获取图片集列表
      getData.imageList().then((res) => {
        state.imageData = res.data.data;
        state.dataSourceNames[0].children = [];
        if (state.imageData.length > 0) {
          state.imageData.forEach((item) => {
            state.dataSourceNames[0].children.push({
              value: item.imageUuid,
              label: item.imageName,
            });
          });
          state.dataSourceNames[0].disabled = false;
        }
      });

      // 获取视频流列表
      getData.streamList().then((res) => {
        state.streamData = res.data.data;
        state.dataSourceNames[1].children = [];
        if (state.streamData.length > 0) {
          state.streamData.forEach((item) => {
            state.dataSourceNames[1].children.push({
              value: item.streamUuid,
              label: item.streamName,
            });
          });
          state.dataSourceNames[1].disabled = false;
        }
      });
    };
    const processTypeList = () => {
      getData.modelList().then((res) => {
        state.modelData = res.data.data;
        if (state.modelData.length > 0) {
          state.processTypeNames[0].children = [];
          state.modelData.forEach((item) => {
            state.processTypeNames[0].children.push({
              value: item.modelUuid,
              label: item.modelName,
            });
          });
        } else {
          state.processTypeNames[0].disabled = true;
        }
      });
      getData.serviceList().then((res) => {
        console.log(res);
        state.serviceData = res.data.data;
        console.log(state.serviceData);
        if (state.serviceData.length > 0) {
          state.processTypeNames[1].children = [];
          state.serviceData.forEach((item) => {
            state.processTypeNames[1].children.push({
              value: item.serviceUuid,
              label: item.serviceName,
            });
          });
        } else {
          state.processTypeNames[1].disabled = true;
        }
      });
    };
    const isImage = computed(() => {
      return state.form.selectDataSource && state.form.selectDataSource[0] === "image";
    });
    const isStream = computed(() => {
      return state.form.selectDataSource && state.form.selectDataSource[0] === "stream";
    });
    const isTrack = computed(() => {
      return state.form.enableTrack === true;
    });

    const isCount = computed(() => {
      return state.form.enableCount === true;
    });

    const handleTrackChange = (value) => {
      if (!value) {
        state.form.enableCount = false;
        state.form.drawCount = false;
      }
    };

    const handleCountChange = (value) => {
      if (!value) {
        state.form.drawCount = false;
      }
    };
    // const
    const add = () => {
      console.log(" task add ");
      console.log(state.form);
      myform.value.validate((vaild) => {
        console.log(vaild);
        if (vaild) {
          // 调用 新增任务接口
          if (props.changeOrAdd === 0) {
            const curService = state.serviceData.find((item) => item.serviceName === state.form.serviceName);
            if (curService) {
              state.form.serviceUuid = curService.serviceUuid;
            }
            console.log(state.form.selectDataSource);
            getData.taskAdd(state.form).then((res) => {
              if (res.data.code === 200) {
                cancel();
                context.emit("init");
                ElMessage.success(res.data.msg);
              } else {
                ElMessage.error(res.data.msg);
              }
            });
          } else {
            getData.taskUpdate(state.form).then((res) => {
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
      context.emit("taskAddDialogClose");
    };
    const formReset = () => {
      console.log("表单重置");
      state.form.taskName = null;
      state.form.taskDescription = null;
      state.form.serviceName = null;
      state.form.selectDataSource = null;
    };
    return {
      ...toRefs(state),
      myform,
      isImage,
      isStream,
      isTrack,
      isCount,
      handleTrackChange,
      handleCountChange,
      add,
      cancel,
    };
  },
};
</script>

<style></style>
