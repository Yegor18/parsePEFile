import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import AnalysisPage from '../views/AnalysisPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'MainPage',
    redirect: '/analysis'
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: AnalysisPage
  }
]

const router = new VueRouter({
  routes
})

export default router
