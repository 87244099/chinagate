// components/auto-login/auto-login.js

const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Component({
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
        if(getApp().globalData.isLogin){
          this.triggerEvent("jump");
        }else{
          let detail = event.detail;
            let response;
            try{
              response = await Ajax.login(detail);
              this.triggerEvent("jump");
  
            }catch(response){
              console.log("response", response);
              if(response){
                let result = response.data;
                if(result.rt === 1){//不存在
                  Toast.loading("跳转中...");
                    //走注册流程
                    let code = await Fai.getLoginCodeNullIsEmpty();
                    response = await Ajax.reg(code, detail.userInfo.nickName, detail.userInfo.avatarUrl, detail);
                    response = await Ajax.login(detail);
                    this.triggerEvent("jump");
                    Toast.clear();
                    return;
                }
                Toast.fail(response.data.msg);
              }else{
                Toast.fail("网络繁忙,请稍后重试");
              }
            }
        }
      }
    }
  }
})
