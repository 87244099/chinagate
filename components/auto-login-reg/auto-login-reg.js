// components/auto-login/auto-login.js

const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Component({
  data:{
    setting:{
      isLogin: false
    }
  },
  lifetimes:{
    async attached(){
      let isLogin = await Ajax.checkLoginBoolean();
      Fai.Waiter.then("onOpenIdLoaded", ()=>{
          if(isLogin){//已经登录
            this.setData({
              "setting.isLogin": true
            });
          }else{
            Ajax.delaySetCode();
          }
      });
      
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

    url:{
      type:String,
      value: "/pages/personal/personal"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async autoLoginReg4Logined(){
      this.triggerEvent("jump");
    },
    async autoLoginReg(event){
      if(event.detail.errMsg == "getUserInfo:ok"){
          let detail = event.detail;
          try{
            await Ajax.loginWithAutoReg({
              code: Ajax.getLoginCode(),
              nickName: detail.userInfo.nickName,
              avatarPhoto: detail.userInfo.avatarUrl,
              iv:detail.iv,
              encryptedData: detail.encryptedData
            });
            this.triggerEvent("jump");
          }catch(response){
            if(response){
              Toast.fail(response.data.msg);
            }else{
              Toast.fail("网络繁忙,请稍后重试");
            }
          }
          //每次使用完，code会失效
          Ajax.delaySetCode(true);//强制刷新code，一般一瞬间只有一次触发
      }
    }
  }
})
