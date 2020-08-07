//index.js
//获取应用实例
const Card = require("../../templates/card/card");
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
// pages/card/card.js
Page(Fai.mixin(Fai.commPageConfig, Card, {
  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      shared: true,
      shareMaskVisible: false,
      memberId: -1
    },
    pageData:{
      memberInfo:{},
      cardInfo:{}
    },
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   "setting.shareImgUrl": this.data.staticDomain+""
    // });

    Ajax.requestWithToast(async()=>{
      this.setData({
        "setting.memberId":parseInt(options.id)||-1
      });
      let response = await Ajax.getMemberInfo(this.data.setting.memberId);
      this.setData({
        "pageData.memberInfo": response.data.data
      });
      this.loadData();
      return Promise.resolve(response);
    })
    
  },
  onWantShare(){
    Toast("点击右上角...进行转发")
  }
}));