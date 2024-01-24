<template>
  <div>
    <h2 class="username">ユーザーネーム: {{ username }}</h2>
    <p>※お題の上限は各1000文字まで</p>
    <div v-for="item in items" :key="item.id" class="item-box">
      <textarea v-model="item.text" @input="checkLength(item)" maxlength="1000"></textarea>
    <div class="button-container">
      <button @click="editItem(item)">保存</button>
      <button @click="deleteItem(item)">削除</button>
    </div>
</div>
  </div>
</template>


<script>
import { getDatabase, ref, set, remove, onValue } from "firebase/database";
import { getAuth,onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      username: '',
      items: [],
    };
  },
  methods: {
    editItem(item) {
  // 編集後のテキストが1000文字を超えていたら、それを切り詰めます
  if (item.text.length > 1000) {
    item.text = item.text.slice(0, 1000);
  }
  const auth = getAuth();
  const db = getDatabase();
  if (auth.currentUser) {
    set(ref(db, 'usernames/' + auth.currentUser.displayName + '/odai/' + item.id), { id: item.id, text: item.text })
      .then(() => {
        alert('保存完了'); // 保存が完了したことを通知
      });
  }
},

    deleteItem(item) {
      this.items = this.items.filter(i => i.id !== item.id);
      const auth = getAuth();
      const db = getDatabase();
      if (auth.currentUser) {
        remove(ref(db, 'usernames/' + auth.currentUser.displayName + '/odai/' + item.id));
      }
    },
    checkLength(item) {
      if (item.text.length > 1000) {
        item.text = item.text.slice(0, 1000);
      }
    }
  },
  created() {
    const auth = getAuth();
    const db = getDatabase();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        this.$router.push('/login-page');
      }
    });
    if (auth.currentUser) {
      this.username = auth.currentUser.displayName;
      const odaiRef = ref(db, 'usernames/' + this.username + '/odai');
      onValue(odaiRef, (snapshot) => {
        if (snapshot.exists()) {
          this.items = Object.values(snapshot.val());
        }
      });
    }
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

p {
  margin-bottom: 10px;
}

div[v-for] {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 80%;
}

button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: #fff;
  background-color: #333;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #555;
}

.username {
  font-size: 2em;
  margin-bottom: 30px;
}

.item-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 80%;
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: #fff;
  background-color: #333;
  cursor: pointer;
  margin-top: 10px;
  width: 45%; /* adjust as needed */
}

textarea {
  width: 90%; 
  height: 10vw;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size:20px
}

@media (max-width: 640px) {
  textarea{
    height: 35vw;
  }
}

</style>
