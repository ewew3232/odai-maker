<template>
  <div>
    <h2>登録/ログイン</h2>
    <form>
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required>
      </div>
      <div>
        <label for="password">Password(6文字以上):</label>
        <input id="password" v-model="password" type="password" required>
      </div>
      <button @click.prevent="handleRegister">登録</button>
      <button @click.prevent="handleLogin">ログイン</button>
    </form>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
import { getDatabase, ref as dbRef, get, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$router.push('/odai-maker');
      }
    });
  },
  methods: {
    handleRegister() {
      const db = getDatabase();
      get(dbRef(db, 'usernames/' + this.username)).then((snapshot) => {
        if (snapshot.exists()) {
          this.message = 'その名前は登録済み';
        } else {
          const auth = getAuth();
          createUserWithEmailAndPassword(auth, this.username + '@example.com', this.password)
            .then((userCredential) => {
              updateProfile(userCredential.user, {
                displayName: this.username
              });
              set(dbRef(db, 'usernames/' + this.username), userCredential.user.uid);
              alert('登録完了。  '+'ユーザー名:'+ this.username + '　パスワード:' + this.password );
            })
            .catch((error) => {
              this.message = 'エラー: ' + error.message;
            });
        }
      });
    },
    handleLogin() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.username + '@example.com', this.password)
      .then(() => {
        this.$router.push('/odai-maker');
      })
      .catch((error) => {
        this.message = error;
      });
    },
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

h2 {
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: #fff;
  background-color: #333;
  cursor: pointer;
  font-size: larger;
}

button:hover {
  background-color: #555;
}

div[v-if="message"] {
  margin-top: 20px;
  color: red;
}
</style>
