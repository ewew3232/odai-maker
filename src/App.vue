<template>
  <div id="app">
    <nav>
      <router-link to="/odai-maker">お題メーカー</router-link> |
      <router-link to="/my-page">マイページ</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { createRouter, createWebHistory } from 'vue-router'
import RegisterLogin from './components/RegisterLogin.vue'
import OdaiMaker from './components/OdaiMaker.vue'
import MyPage from './components/MyPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RegisterLogin }, // この行を追加
    { path: '/register-login', component: RegisterLogin },
    { path: '/odai-maker', component: OdaiMaker },
    { path: '/my-page', component: MyPage }
  ]
})


export default {
  name: 'App',
  setup() {
    return { router }
  }
}
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  background-color: #f5f5f5;
}

nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 20px 0;
}

#app, nav {
  max-width: 640px;
  width: 100%;
}


a:link,
a:visited {
  color: #fff;
}

@media (max-width: 640px) {
  body,#app {
    width: 100%; 
  }
}

</style>
