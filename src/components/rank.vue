<template>
  <div class="wid-height-100">
    <ul class="flex-col wid-height-100 rank-ul">
      <li v-for="(item,index) in data" :key="index" class="rank-li flex-row">
        <span>No.{{index+1}}</span>
        <span class="rank-li-span">{{item.name}}</span>
        <span>{{item.times + '次'}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
export default {
  props:[
    'data'
  ],
  setup(props,context){
    onMounted(()=>{
      console.log(props.data);
      state.data = props.data;
    })
    const state = reactive({
      data:[],
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>