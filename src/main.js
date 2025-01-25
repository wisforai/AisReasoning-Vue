import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import locale from 'element-plus/lib/locale/lang/zh-cn'  //element-plus 使其组件中文化
import * as echarts from 'echarts' // 导入echart
import './assets/font_3907517_j3bfsd1zhzk/iconfont.css'
// import * as echarts from 'echarts';
// import '../node_modules/echarts/map/js/china';
// Vue.prototype.$echarts = echarts;


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$echarts = echarts
app.use(ElementPlus,{locale}).use(store).use(router).mount('#app')

// 路由守卫
// router.beforeEach((to, from, next) => {
//   // 路由守卫，加载路由之前做点什么
//   // to: 从哪个页面
//   // from: 到哪个页面
//   // next: 只有执行next()页面

//   //判断用户是否登录 // 同时限定权限树的路由跳转
//   console.log('id', sessionStorage.getItem('id'))
//   if (!sessionStorage.getItem('id')) {
//     // 未登录，跳转到login页面
//     console.log('未登录')
//     if (to.path === '/login') {
//       next()
//       return
//     }
//     next('/login')
//   } else {
//     console.log('已登录')
//     // 已登录
//     next()
//   }
// });
