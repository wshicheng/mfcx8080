<template>
    <header>
        <el-row>
            <el-col :span="24">
                <h2>
                    <img src="../assets/header/logo.jpg" alt="logo">
                </h2>
                <h3>加盟商管理平台
                    <el-tooltip class="item" v-if='modelShow' :content="initCityName"  placement="bottom-end" :effect="light">
                        <span>{{cityName}}</span>
                    </el-tooltip>
                    <span v-else>{{cityName}}</span>
                </h3>
                <div class="admin">
                    <i v-show="isIconUrl" class="icon iconfont icon-touxiang"></i>
                    <img v-show="isImgShow" class="userIcon" :src="franchiseeUserIconUrl">
                    <span class="username">{{userName}}</span>
                    <i v-if="hidden" class="icon iconfont icon-xinfeng"></i>
                    <i class="icon iconfont icon-tuichu" @click="handleLoginOut"></i>
                </div>
            </el-col>
        </el-row>
    </header>
</template>
<script>
import request from 'superagent'
import {host} from '../config/index.js'
import {delCookie} from '../../utils/index'
import {mapActions, mapGetters } from 'vuex'  
export default {
    data () {
        return {
            hidden:false,
            isIconUrl:true,
            isImgShow:false,
            cityName: '',
            initCityName:'',
            light: 'light',
            modelShow: false
        }
    },
    computed:{
        ...mapGetters(['userName','franchiseeUserIconUrl'])
    },
  methods: {
    ...mapActions(['setUserName','setfranchiseeUserIconUrl']),
    handleLoginOut () {
        var that = this
      request.post(host + 'beepartner/system/login/removeFranchiseeSession')
        .withCredentials()
        .set({
            'content-type': 'application/x-www-form-urlencoded'
        })
        .end((err,res)=>{
            if(err){
                console.log(err)
            }else{
                var code = JSON.parse(res.text).resultCode
                var message = JSON.parse(res.text).message
                if(code === 1){
                  window.sessionStorage.clear()
                  this.setfranchiseeUserIconUrl('')
                   this.$router.push('/login') 
                }else{
                    that.$message({
                        type:'error',
                        message:message
                    })
                }
                
            }
        })
    }
  },
  mounted:function(){
      var url = sessionStorage.getItem('franchiseeUserIconUrl')
      if(url!='null'){
           this.isIconUrl = false
           this.isImgShow = true
      }else{
          this.isIconUrl = true
           this.isImgShow = false
      }
        var info = sessionStorage.getItem('franchiseeUser')
        var name = JSON.parse(info).name
        var userName = JSON.parse(info).userName
        if(name === 'null' || name === ''){
          
            this.setUserName(userName)
        }else{
           
             this.setUserName(name)
        }     

      

         var that = this
        setTimeout(function() {
             that.cityName = window.sessionStorage.getItem('cityName')
             that.initCityName = window.sessionStorage.getItem('cityName')
         var arr = that.cityName.split(',')
          if(arr.length>3){
              that.cityName = arr.slice(0,3).join() + '...'
          }
        if (arr.length > 3) {
            that.modelShow = true
        } else {
            that.modelShow = false
        }
        }, 200);
  },
  watch:{
    franchiseeUserIconUrl:{
        handler:function(n,o){
                console.log(n)
                if(n!='null'){
                    this.isIconUrl = false
                    this.isImgShow = true
                }else{
                    this.isIconUrl = true
                    this.isImgShow = false
                }
        },
        deep:true
    }  
  }
}
</script>
<style scoped>
img.userIcon{width: 30px;
    height: 30px;
    outline: none;
    border: none;
    float: left;
    margin-top: 20px;
    line-height: 0;
    border-radius: 30px;
    overflow: hidden;}
header {
    height: 65px;
    line-height: 65px;
    background: #4d4d4d;
    border-color: #e9ecf3;
    color: #fff;
}

header h2 {
    width: 120px;
    height: 65px;
    line-height: 65px;
    display:block;
    float: left;
    padding-left: 20px;
}

header h2 img {
    display: inline-block;
    margin-top: 10px;
    width: 100%;
    height: 42px;
}

header h3 {
    display: inline-block;
    padding-left: 20px;
    position: relative;
}

header h3>span {
    position: relative;
    display: block;
    top: -43px;
    width: 127px;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    right: -140px;
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
}

div.admin {
    float: right;
    float: right;
    margin-right: 28px;
}

div.admin span.username {
    font-size: 14px;
    margin-right: 15px;
    margin-left:5px;
}

div.admin i.iconfont {
    font-size: 30px;
    vertical-align: middle;
    margin-right: 0;
    cursor: pointer;
}

div.admin i.iconfont.icon-xinfeng,
div.admin i.iconfont.icon-tuichu {
    font-size: 24px;
}

div.admin i.iconfont.icon-tuichu:hover {
    color: yellow;
}
</style>

