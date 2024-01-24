// router.js
import { createRouter, createWebHistory } from 'vue-router'
import RegisterLogin from '../components/RegisterLogin.vue'
import OdaiMaker from '../components/OdaiMaker.vue'
import MyPage from '../components/MyPage.vue'

const routes = [
  {
    path: '/login-page',
    component: RegisterLogin
  },
  {
    path: '/odai-maker',
    component: OdaiMaker
  },
  {
    path: '/my-page',
    component: MyPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
