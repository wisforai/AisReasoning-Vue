<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "assets/css/reset.scss";
#app {
  position: absolute;
  width: 100%;
  height: 100%;
  top:0px;
  left:0px;
  right:0px;
  bottom:0px;
  // margin-bottom: 0px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin: 0px auto;
  .el-table .cell{
       white-space: pre-wrap;
   }
}

// nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
