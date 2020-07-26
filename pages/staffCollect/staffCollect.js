const app = getApp();
const Fai = require("../../utils/util");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      pageNo: 0,
      pageSize: 10,
      companyList: []
    },
    config: config,
    staticDomain: config.staticDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadStaffCollections();
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
  loadStaffCollections: function(){
    let setting = this.data.setting;
    if(setting.totalSize>=0 && setting.companyList.length>=setting.totalSize){
      return;
    }

    Toast.loading({
      message: "加载中...",
      duration: 0
    });
    Fai.request({
      url: "/ajax/user/userCollection?cmd=getCollectionList",
      data: {
        pageNo: setting.pageNo+1,
        pageSize: setting.pageSize
      },
      beforeConsume: Toast.clear,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          console.log("result", result);
          setting.companyList.push(...result.data.companyList)
          this.setData({
            "setting.pageNo": setting.pageNo+1,
            "setting.companyList": setting.companyList,
            "setting.totalSize": result.data.totalSize
          })
        }else{
          Toast.fail(result.msg || "网络繁忙，请稍后重试");
        }
      },
      fail:()=>{
        Toast.fail( "网络繁忙，请稍后重试");
      }
    })
  
  },
  onCancelStaffCollect: function(event){
    let item = event.currentTarget.dataset.item;
    let index = event.currentTarget.dataset.index;

    if(item.collectSubTypeID == 1){//个人名片
      this.setCardCollectCancel4Normal(item, index);
    }else{//员工名片
      this.setCardCollectCancel4Staff(item, index);
    }
  },
  //取消个人名片收藏
  setCardCollectCancel4Normal(item, index){
    let id = item.id;
    Fai.request({
      url:"/ajax/user/userCollection?cmd=setUserCollectCancel",
      method:"POST",
      data: {
        id:id
      },
      success: (response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
          this.removeCard(index);
        }else{
          Toast.fail(result.msg || "网络繁忙,请稍后重试");
        }
      }
    })
  },
  removeCard(index){
    this.data.setting.companyList.splice(index, 1);
    this.setData({
      "setting.companyList": this.data.setting.companyList
    });
  },
  //取消员工名片收藏
  setCardCollectCancel4Staff(item, index){
    let id = item.id;
    let staffId = item.staffId;

    Fai.request({
      url:"/ajax/user/userCollection?cmd=setUserCollectCancel4Staff",
      method:"POST",
      data: {
        id,
        staffId
      },
      success: (response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
          this.removeCard(index);
        }else{
          Toast.fail(result.msg || "网络繁忙,请稍后重试");
        }
      }
    })

  },
  //跳转到对应的名片
  onJumpCard(event){
    let item = event.currentTarget.dataset.item;
    if(item.collectSubTypeID == 1){//个人名片
      wx.navigateTo({
        url: '/pages/card/card',
      });
    }else{//企业员工名片
      wx.navigateTo({
        url: '/pages/indexStaff/indexStaff',
      });
    }
  }
})