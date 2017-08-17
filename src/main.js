// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Element from 'element-ui'
import './assets/font/iconfont.css'
import router from './router/index.js'
import store from './store/store'
import Vuex from 'vuex'
import $ from 'jquery'
import request from 'superagent'
import  {host} from './config/index.js'
import {getCookie,setCookie,delCookie} from '../utils/index'
// const VueResourceProgressBarInterceptor = require('vue-resource-progressbar-interceptor')

// Vue.use(VueResourceProgressBarInterceptor)

Vue.directive('title', {
    inserted: function(el, binding) {
        document.title = el.innerText
        el.remove()
    }
})

// router.beforeEach((to, from, next) => {
//   if (to.path == '/login') {
//     localStorage.removeItem('userinfo');
//   }
//   let user = localStorage.getItem('userinfo') || '[]'
// //   if (!user && to.path != '/login' && user.length === 0 ) {
//   if (user.length === 0 || !user) {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })


Vue.config.productionTip = false
Vue.use(Element)
Vue.use(Vuex)

new Vue({
    store,
    el: '#app',
    router,
    render: h => h(App),
    methods:{
        checkInput(){
            var input = $('input.el-pagination__editor')
            if(input){
              input.prop('type','text')
            }
        },
        checkoutSeesion(){
                var cookie = getCookie('userInfo')||null
               if(cookie === null || cookie.trim().length === 0){
                   this.$router.push('/login')
               }else{
                    request
                        .post(host + 'beepartner/franchisee/Own/findFranchiseeUserOwn')
                        .withCredentials()
                        .set({
                        'content-type': 'application/x-www-form-urlencoded'
                        })
                        .send()
                        .end((err, res) => {
                        if (err) {
                            console.log('err2:' + err)
                            //this.$router.push({path:'/index/error'})
                        } else {
                            var message = JSON.parse(res.text).message
                            if(message === '用户登录超时'){
                                this.$router.push('/login')
                            }else{
                                return
                            }
                        }
                    })
               }
                 
        }
    },
    mounted () {
        this.checkInput()
        this.checkoutSeesion()
    },
    beforeUpdate:function(){
      // this.checkoutSeesion()
       //this.checkLogin()
    },
     watch: {
      '$route': 'checkoutSeesion'
    }
})