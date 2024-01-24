<template>
  <div>
    <h2>お題メーカー</h2>
    <p>※お題の上限は各1000文字まで</p>
    <div class="category-box">
      <div v-for="(category, index) in categories" :key="index">
        <button :class="{ active: selectedCategories.includes(category.title) }" @click="toggleCategory(category.title)" class="category-btn">{{ category.title }}</button>
      </div>
    </div> 
    <button @click="generateOdai">ランダム</button>
    <div v-if="odai.length">
      <h3>生成されたお題:</h3>
      <div v-for="(o, index) in odai" :key="index" class="odai-box">
        <textarea v-model="odai[index]" @input="checkLength(index)" maxlength="1000"></textarea>
        <button @click="saveOdai(index)">保存</button>
      </div>

    </div>
  </div>
</template>

<script>
import { getDatabase, ref as dbRef, push, set } from "firebase/database";
import { getAuth,onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      categories: [
      { title: '天気', items: ['晴れている', '曇っている', '雨が降っている', '雪が降っている', '雷が鳴り響く', '霧のかかった'] },
      { title: '季節', items: ['春の', '夏の', '秋の', '冬の'] },
      { title: '時間', items: ['朝、', '昼、', '夕方、', '夜、', '夜明け前、', '深夜、', '早朝、'] },
      { title: '国など', items: ['古代の', '中世の', '現代の', '近未来の', '未来の', '東洋の', '西洋の', '日本の', '中国の', 'アメリカの', '北欧の', 'フランスの', 'イタリアの', 'ドイツの', 'ロシアの', 'ブラジルの', 'エジプトの', '南極の'] },
      { title: '場所', items: ['山で、', '海で、', '森で、', '川で、', '湖で、', '空で、', '砂漠で、', '都市で、', '田舎で、', '公園で、', '宇宙で、', '学校で、', 'オフィスで、', '家で、', 'カフェで、', 'ボーリング場で、', 'カラオケで、', '居酒屋で、', '地下街で、', '路地裏で、', '病院で、', 'カジノで、', '廃墟で、', 'ライブハウスで、', 'スタジオで、', '仮想空間で、', '空港で、', '駅で、', '図書館で、', '病院で、', 'スーパーマーケットで、', '映画館で、', '博物館で、', '遊園地で、', '動物園で、', '水族館で、', 'スポーツジムで、', 'プールで、', 'ビーチで、', '寺院で、', '教会で、', '城で、', '塔の上で、', '橋の上で、', '洞窟で、', '墓地で、'] },
      { title: '服装', items: ['制服を着た', 'スーツを着た', 'Tシャツを着た', 'スウェットを着た', 'パーカーを着た', 'フードを着た', 'メイド服を着た', 'チャイナ服を着た', '水着を着た', 'タンクトップを着た', 'Yシャツを着た', 'ブラウスを着た', 'カーディガンを着た', 'セーターを着た', 'パジャマを着た', 'バスローブを着た', '雨合羽を着た', 'ウェディングドレスを着た', 'エプロンを着た', 'ワンピースを着た', '着物を着た', '浴衣を着た', 'ナース服を着た', 'ウェイトレス服を着た', 'チアコスを着た', 'ゴスロリを着た', 'スク水を着た', 'スポーツウェアを着た', '巫女服を着た', '着ぐるみを着た', 'バニーガール服を着た', 'レザージャケットを着た', 'ジーンズを履いた', 'スカートを履いた', 'ドレスを着た', 'ユニフォームを着た', 'ジャージを着た', 'サリーを着た', 'トガを着た', 'アーマーを着た', 'スーツアーマーを着た', 'ローブを着た', 'マントを着た', 'タキシードを着た'] },
      { title: '年齢', items: ['5歳くらいで、', '10歳くらいで、', '15歳くらいで、', '20歳くらいで、', '25歳くらいで、', '30歳くらいで、', '小学生くらいで、', '中学生くらいで、', '高校生くらいで、', '大学生くらいで、', '社会人で、'] },
      { title: '身長', items: ['身長の低い', '一般的な身長の', '身長の高い'] },
      { title: '体重', items: ['体重の軽そうな', '普通の体型の', 'ちょっとぽっちゃりとした'] },
      { title: '髪色', items: ['黒髪の', '茶髪の', '白髪の', '銀髪の', '赤髪の', '青髪の', '緑髪の', '金髪の', '紫髪の', 'ピンク髪の', 'メッシュの'] },
      { title: '髪型', items: ['ロングヘアー（胸まで）で、', 'ロングヘアー（腰まで）で、', 'ロングヘアー（足まで）で、', 'ミディアムヘアーで、', 'ショートヘアーで、', 'ベリーショートヘアーで、', 'ポニーテールで、', 'おさげで、', '縦ロールで、', 'カーリーヘアーで、', 'ツインテールで、', 'お団子で、', 'サイドポニーで、', 'おかっぱで、', 'ボブカットで、', 'アシメで、', '姫カットで、', '三つ編みで、', '編み込みで、', 'ジャギーカットで、', 'アフロで、', '丸坊主で、', 'リーゼントで、', 'デコ出しで、'] },
      { title: '目の形', items: ['アーモンド形の', 'ツリ目の', 'タレ目の', '三白眼の', '四白眼の', '狐目の'] },
      { title: '目の色', items: ['黒目をした', '茶色い目をした', '赤い目をした', '青い目をした', '緑色の目をした', '黄色い目をした', '紫色の目をした', 'ピンク色の目をした', 'オッドアイの目をした'] },
      { title: 'バスト', items: ['胸の小さいキャラクターが、', '中くらいの胸のキャラクターが、', '胸の大きいキャラクターが、'] },
      { title: '表情', items: ['笑いながら', '怒りながら', 'ほほえみながら', '叱りながら', '困りながら', '泣きながら', '歌いながら', '考えながら', '驚きながら', 'ジト目をしながら', 'ウィンクしながら', '目を閉じながら', '妖しく笑いながら', '歯をむき出しにしながら', '嘲笑しながら', '口を開けながら', '照れながら', '興奮しながら', '混乱しながら', '集中しながら', '目蓋を擦りながら', 'リラックスしながら','疲れながら'] },
      {title: '動作', items: ['立っている','歩いている','走っている','地面に座っている','寝ている','食べている','ジャンプしている','殴っている','蹴っている','構えている','手を振っている','両手を上げている','手を広げている','見上げている','うずくまっている','椅子に座っている','ダンスしている','料理している','掃除している','勉強している','運転している','泳いでいる','ギターを弾いている','写真を撮っている','絵を描いている','ゲームをしている','瞑想している','ヨガをしている','ジョギングしている','サイクリングしている','ハイキングしている','キャンプしている','釣りをしている','庭いじりをしている','DIYをしている'] },
      {title: '構図', items: ['のを正面から見た絵','のを横側から見た絵','のを俯瞰で見た絵','のを煽り構図で見た絵','のを後ろから見た絵'] }
      ],
      selectedCategories: ['天気', '季節', '時間', '国など', '場所', '服装', '年齢', '身長', '体重', '髪色', '髪型', '目の形', '目の色', 'バスト', '表情', '動作', '構図'], 
      selectedItems: {},
      odai: [],
    };
  },

  methods: {
    generateOdai() {
      this.odai = [];
      for (let i = 0; i < 3; i++) {
        let odaiItems = [];
        for (let category of this.categories) {
          if (this.selectedCategories.includes(category.title)) {
            let randomItem = category.items[Math.floor(Math.random() * category.items.length)];
            odaiItems.push(randomItem);
          }
        }
        this.odai.push(odaiItems.join(''));
      }
    },
    saveOdai(index) {
      const auth = getAuth();
      const db = getDatabase();
      if (auth.currentUser) {
        const newOdaiRef = push(dbRef(db, 'usernames/' + auth.currentUser.displayName + '/odai'));
        set(newOdaiRef, { id: newOdaiRef.key, text: this.odai[index] });
        alert('保存完了');
      }
    },
    checkLength(index) {
      if (this.odai[index].length > 1000) {
        this.odai[index] = this.odai[index].slice(0, 1000);
      }
    },
    toggleCategory(category) {
      if (this.selectedCategories.includes(category)) {
        this.selectedCategories = this.selectedCategories.filter(c => c !== category);
      } else {
        this.selectedCategories.push(category);
      }
    },
  },

  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        this.$router.push('/login-page');
      }
    });
    for (let category of this.categories) {
      this.selectedItems[category.title] = [];
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

div[v-for] {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: #fff;
  background-color: #333;
  cursor: pointer;
  margin-top: 10px;
  font-size: larger;
}

button:hover {
  background-color: #555;
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

.odai-box{
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 540px;
}

.category-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%; 
}



.category-btn {
  padding: 10px;
  border-radius: 5px;
  border:solid 1px #000;
  cursor: pointer;
  margin: 3px;
  background-color: #fff;
  color: #000
}

.category-btn.active {
  background-color: #333;
  color: #fff;

}

@media (max-width: 640px) {
  .odai-box,.category-box {
    width: 90vw; 
  }
  textarea{
    height: 35vw;
  }
}
</style>
