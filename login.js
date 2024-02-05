import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

      const site = 'https://vue3-course-api.hexschool.io/v2'

      const app = createApp({
        data() {
          return {
            user: {
              username: '',
              password: '',
            },
          };
        },
        methods: {
          // 登入
          login() {
            const api = `${site}/admin/signin`;
            // console.log(api)
            // console.log(axios)
            //以上確認 api路徑 和 axios 有沒有導入成功

            axios
              .post(api, this.user)
              //成功
              .then((res) => {
                console.log(res);
                // 從res 裡面知道很多訊息，其中把token和 expire 取出來，解構取得參數
                const { expired, token } = res.data;
                // console.log(expired, token);
                // 將Token寫入到cookie的方法（避免跨網域CORS問題）
                // expires 設置有效時間${new Date(expired)}
                document.cookie = `hexVueToken=${token}; expires=${new Date(
                  expired
                )};`;
                // 轉到商品頁(轉址)
                window.location = "products.html";
              })
              .catch((err) => {
                // console.log(‘err’, err.data.message);
                alert('登入失敗');
              });
          }, 
        },
        mounted(){

        }
      });
      
      app.mount("#app");