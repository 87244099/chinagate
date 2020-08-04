// pages/newsDetail/newsDetail.js
//获取应用实例
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

Page(Fai.mixin(Fai.commPageConfig,{

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      newsId: -1,
      newsInfo: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.newsId": parseInt(options.id) || -1
    });
    this.loadArticle();
    
  },
  loadArticle: function(){
    // https://pf.86crk.com/ajax/article/article?cmd=getArticle&id=568
    
    Toast.loading({
      message: '加载中...',
      duration: 0
    });
    Fai.request({
      url: "/ajax/article/article?cmd=getArticle&id="+this.data.setting.newsId,
      beforeConsume(){
        Toast.clear();
      },
      success: (res)=>{
        let result = res.data;
        if(result.success){
          this.setData({
            "setting.newsInfo":result.data
          });
          wx.setNavigationBarTitle({
            title: this.data.setting.newsInfo.title,
          })
        }else{
          Toast.fail(result.msg || '网络繁忙，请稍后重试');
        }
      },
      fail:()=>{
        Toast.fail("网络繁忙，请稍后重试");
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapImg(event){

  },
  tapLink(event){
    let url = event.detail;
    console.log("url", url);
  }
}));