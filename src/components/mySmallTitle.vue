<template>
  <div class="my-smalltitle">
    <div class="blue-box"></div>
    <span :style="{'font-size':fontSize+'px','color':color}">{{text}}</span>
  </div>
</template>

<script>
export default {
  props:{
    text:{
      type:String
    },
    fontSize:{
      type:String
    },
    color:{
      type:String
    }
  }
}
</script>

<style lang="scss" scoped>
.my-smalltitle{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.blue-box{
  width: 7px;
  height: 16px;
  background: #3667FF;
  border-radius: 4px;
  margin-right: 10px;
}
span{
  font-weight: 500;
  color: color;
}
</style>