import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js' // router.jsをインポート

// Firebaseの設定をインポート
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC476FupjT-PaYO7x4JZ_IbX9EXi0UZdq4",
  authDomain: "odai-e957c.firebaseapp.com",
  databaseURL: "https://odai-e957c-default-rtdb.firebaseio.com",
  projectId: "odai-e957c",
  storageBucket: "odai-e957c.appspot.com",
  messagingSenderId: "88282423460",
  appId: "1:88282423460:web:7c334de5ea55ced2440631",
  measurementId: "G-JXM45BQPDW"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

console.log(auth, db);


createApp(App)
  .use(router) // Vueインスタンスにrouterを登録
  .mount('#app')
