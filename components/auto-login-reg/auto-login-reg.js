// components/auto-login/auto-login.js

const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Component({
  data:{
    setting:{
      isLogin: true
    }
  },
  lifetimes:{
    async attached(){//节点挂上页面的阶段

      // 两个阶段，open和created的时候要更新
      Fai.Waiter.then("onOpenIdLoaded", async()=>{

        this.init();

        // 监听onShow阶段
        let page = Fai.getCurrPage();
        let eventName = "onShow."+page.getPageId();
        Fai.Event.on(eventName, ()=>{
          this.init();
        });

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
    async init(){//这个方法可能会被执行多次，需要做延迟优化，批量收集回调
      let isLogin = await Ajax.checkLoginBoolean();
      if(!isLogin){//未登录的情况下尝试一次静默登录(如果还是登录失败的情况下，证明是没注册过)
        try{ await Ajax.loginByOpenId(getApp().globalData.openId); }catch(e){}
        isLogin = await Ajax.checkLoginBoolean();//判断是否登录成功。还是失败的情况下，就是没注册过
      }

      if(isLogin){//已经登录
        this.setData({
          "setting.isLogin": true
        });
        // console.log("setting success", new Date().getTime());
      }else{
        this.setData({
          "setting.isLogin": false
        });
        Ajax.delaySetCode();
      }
    },
    // 登录成功时所触发的回调
    async autoLoginReg4Logined(){
      this.triggerEvent("jump");
    },
    // 未登录注册时所触发的回调
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
            // if(response){//有时候会失败，把错误吞掉，点击多几次就好了
            //   Toast.fail(response.data.msg);
            // }else{
            //   Toast.fail("网络繁忙,请稍后重试");
            // }
          }
          //每次使用完，code会失效
          Ajax.delaySetCode(true);//强制刷新code，一般一瞬间只有一次触发
      }
    }
  }
})
