import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const site = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "owen-hexschool";

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imageUrl: [], //多圖
      },
      modalProduct: null, //給productModal 所使用的
      modalDel: null, // 給 delModal 所使用的
      isNew: false,
    }
  },
  methods: {
    getProducts(){
      const api = `${site}/api/${apiPath}/admin/products`; //products有分頁的，products/all 是全部且沒有分頁
      // console.log(api);

      axios.get(api)
        .then(res =>{
          console.log(res);  // 這api資料裡有 pagination
          this.products = res.data.products;
        })
    },
    openModal(status, product){
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl:[]
        };
        this.isNew = true; //是新的
        //賦予之後就可以使用實體後的方法
        this.modalProduct.show();
      }else if(status ==='edit'){
        this.tempProduct = {...product}
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl =[]
        }
        this.isNew = false; //不是新的
        this.modalProduct.show()
      } else if(status ==='delete') {
        this.tempProduct = {...product}
        this.modalDel.show()
      }
    },
    updateProduct(){
      //新增
      let api = `${site}/api/${apiPath}/admin/product`; 
      let method = 'post';
      //更新(不是新的就是編輯，編輯後就是更新)
      if (!this.isNew) {
        api = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`; 
        method = 'put';
      }

      axios[method](api, {data: this.tempProduct})
        .then(res =>{
          //console.log(res)  //在res.data.message 上 已建立產品
          //建立產品後 要再重新取得產品的內容
          this.getProducts();
          // 新增成功後要關掉modal頁面 
          this.modalProduct.hide();
          // 新增完要把輸入匡清除
          this.tempProduct={};
        });
    },
    delProduct(){
      const api = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`; 

      axios.delete(api)
        .then(res =>{

          //刪除產品後 要再重新取得產品的內容
          this.getProducts();

          this.modalDel.hide();
        });
    }
  },
  mounted(){
    //! 取得 在登入頁面寫入cookie的Token 這裡拿出來用
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // console.log(token);
    //因為登入的頁面是管理者登入的 而必須帶入 token，而這token 須帶在header裡面
    axios.defaults.headers.common["Authorization"] = token;
    this.getProducts();

    //! 用ref 來抓DOM 元素
    console.log(this.$refs) //確認有設定 ref的有在這裡面
    // new... > 建立實體 ，實體建立完後賦予到 this.modalProduct
    this.modalProduct =  new bootstrap.Modal(this.$refs.productModal);
    
    this.modalDel =  new bootstrap.Modal(this.$refs.delProductModal);
    
  }
})

app.mount('#app')



// const app = createApp({
//   data() {
//     return {
//       apiUrl: "https://vue3-course-api.hexschool.io/v2",
//       apiPath: "owen-hexschool",
//       isNew: false,
//       products: [],
//       productCheck: {
//         imagesUrl: [],
//       },
//     };
//   },
//   methods: {
//     // 確認登入
//     checkAdmin() {
//       axios
//         .post(`${this.apiUrl}/api/user/check`)
//         .then(() => {
//           this.getProducts();
//         })
//         .catch((err) => {
//           alert(err.response.data.message);
//           window.location = "login.html";
//         });
//     },

//     //取得後台產品列表
//     getProducts() {
//       axios
//         .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
//         .then((res) => {
//           console.log(res);
//           this.products = res.data.products;
//         })
//         .catch((err) => {
//           alert(err.response.data.message);
//         });
//     },

//     //modal
//     openModal(status, item){
//       if(status === 'new'){
//         this.productCheck = {
//           imagesUrl: [],
//         };
//         this.isNew = true;
//         productModal.show();
//       }else if (status === 'edit') {
//         this.productCheck = {...item};
//         this.isNew = false;
//         productModal.show();
//       }else if (status === 'delete'){
//         this.productCheck = {...item};
//         delProductModal.show()
//       }
//     },

//     updateProduct(){
//       let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productCheck.id}`;
//       http = 'put';
//       if (this.isNew) {
//         url = `${this.apiUrl}/api/${this.apiPath}/admin/product/`;
//         http = 'post'
//       }
//       axios[http](url, { data: this.productCheck })
//         .then((response) => {
//           alert(response.data.message);
//           productModal.hide();
//           this.getProducts();
//       }).catch((err) => {
//           alert(err.response.data.message);
//       })
//     },
//     delProduct() {
//       const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productCheck.id}`;

//       axios.delete(url)
//         .then((response) => {
//           alert(response.data.message);
//           delProductModal.hide();
//           this.getProducts();
//       }).catch((err) => {
//         alert(err.response.data.message);
//       })
//     },
//     createImages(){
//       this.productCheck.imagesUrl = [];
//       this.productCheck.imagesUrl.push('');
//     }

//   },
//   mounted() {
//     //在畫面完全生成之後再來重新擷取DOM 元素
//     productModal = new bootstrap.Modal(document.getElementById('productModal'),{
//       keyboard: false, //禁止使用者透過 Esc 按鍵來關閉 Modal 視窗
//       backdrop: 'static' //禁止使用者點擊 Modal 以外的地方來關閉視窗
//     });
    
//     delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'),{
//       keyboard: false,
//       backdrop: 'static'
//     });

//     // 取得cookie裡的Token
//     const token = document.cookie.replace(
//       /(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/,
//       "$1"
//     );
//     axios.defaults.headers.common["Authorization"] = token;
//     // 確認登入
//     this.checkAdmin();
//   },
// });

// app.mount('#app');
