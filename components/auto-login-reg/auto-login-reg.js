// components/auto-login/auto-login.js

const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Component({
  lifetimes:{
    async attached(){
      //初始化code
      this.setData({
        code: await Fai.getLoginCodeNullIsEmpty()
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
    async autoLoginReg(event){
      let url = this.data.url;
      if(event.detail.errMsg == "getUserInfo:ok"){
        // if(getApp().globalData.isLogin){
        //   this.triggerEvent("jump");
        // }else{
          let detail = event.detail;
          try{
            await Ajax.loginWithAutoReg({
              code: this.data.code,
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
          this.setData({
            code: await Fai.getLoginCodeNullIsEmpty()
          })
        // }
      }
    }
  }
})
