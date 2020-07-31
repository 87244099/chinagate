// pages/setCard/setCard.js
const app = getApp();
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
const config = require("../../utils/config");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      

      provinceList: [],
      cityList: [],
      countryList: [],
      "areaPickerOpened": false,
      "currAreaList": [],
      areaDefaultIndex:  -1,
      "currAreaType": "",

      provinceIndex:-1,
      cityIndex:-1,
      countryIndex: -1,

      avatarPhotoPath: "",

    },
    
    pageData:{
      cardInfo: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast.loading({
      message:"加载中...",
      duration: 0
    });
    (async ()=>{
      try{
        let res = await Ajax.getMemberInfo();
        let memberInfo = res.data.data;
        res = await Ajax.getUserCollectInfo(memberInfo.memberID);
        this.setData({
          "pageData.cardInfo":res.data.data.userInfo
        });
        Toast.clear();
      }catch(errorResponse){
        Toast.fail(errorResponse.msg);
      }
    })();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  onFieldBlur(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`pageData.cardInfo.${field}`]:value
    });
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
  
  reback(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  loadProvince: async function(){

    if(this.data.setting.provinceList.length>0){
      return Promise.resolve();
    }

    return new Promise((resolve, reject)=>{
      Toast.loading({
        message:"加载中...",
        duration: 0
      });
      Fai.request({
        url: "/ajax/Common/GetCommData?cmd=getProvinceList",
        beforeConsume:Toast.clear,
        success:(res)=>{
          let result = res.data;
          if(result.success){
            this.setData({
              "setting.provinceList":result.data.provinceList
            });
            resolve();
          }else{
            Toast.fail(result.msg || "网络繁忙，请稍后重试");
            reject();
          }
        },
        fail:()=>{
          Toast.fail("网络繁忙，请稍后重试");
          reject();
        }
      })
    })
  },
  loadCity: async function(){
    if(this.data.setting.cityList.length>0){
      return Promise.resolve();
    }
    return new Promise((resolve, reject)=>{
      let setting = this.data.setting;
      let provinceCode = setting.provinceList[ setting.provinceIndex ].id;

      Toast.loading({
        message:"加载中...",
        duration: 0
      });
      Fai.request({
        url: "/ajax/Common/GetCommData?cmd=getCityList",
        data: {
          provinceCode: provinceCode
        },
        beforeConsume:Toast.clear,
        success:(res)=>{
          let result = res.data;
          if(result.success){
            this.setData({
              "setting.cityList":result.data.cityList
            });
            resolve();
          }else{
            Toast.fail(result.msg || "网络繁忙，请稍后重试");
            reject();
          }
        },
        fail:()=>{
          Toast.fail("网络繁忙，请稍后重试");
          reject();
        }
      })
    })
  },
  loadCountry: async function(){
    if(this.data.setting.countryList.length>0){
      return Promise.resolve();
    }
    return new Promise((resolve, reject)=>{
      let setting = this.data.setting;
      let cityCode = setting.cityList[ setting.cityIndex ].id;
      Toast.loading({
        message:"加载中...",
        duration: 0
      });
      Fai.request({
        url: "/ajax/Common/GetCommData?cmd=getCountryList",
        data: {
          cityCode: cityCode
        },
        beforeConsume:Toast.clear,
        success:(res)=>{
          let result = res.data;
          if(result.success){
            console.log(1111111111);
            this.setData({
              "setting.countryList":result.data.countryList
            });
            resolve();

          }else{
            Toast.fail(result.msg || "网络繁忙，请稍后重试");
            reject();
          }
        },
        fail:()=>{
          Toast.fail("网络繁忙，请稍后重试");
          reject();
        }
      })
    })
  },
  onSelectProvince: async function(){
    await this.loadProvince().catch((err)=>{
      console.log("err", err);
    });
    let setting = this.data.setting;
    this.setData({
      "setting.areaPickerOpened": true,
      "setting.currAreaList": setting.provinceList,
      "setting.currAreaType": "province",
      "setting.areaDefaultIndex": setting.provinceIndex
    });
  },
  onSelectCity: async function(){
    await this.loadCity();
    let setting = this.data.setting;
    this.setData({
      "setting.areaPickerOpened": true,
      "setting.currAreaList": setting.cityList,
      "setting.currAreaType": "city",
      "setting.areaDefaultIndex": setting.cityIndex
    })
  },
  onSelectCountry: async function(){
    await this.loadCountry();
    let setting = this.data.setting;
    console.log("setting.countryList",  setting.countryList);
    this.setData({
      "setting.areaPickerOpened": true,
      "setting.currAreaList": setting.countryList,
      "setting.currAreaType": "country",
      "setting.areaDefaultIndex": setting.countryIndex
    })
  },

  onAreaPickerConfirm(event){
    const { picker, value, index } = event.detail;
    let setting = this.data.setting;
    if(setting.currAreaType == "province"){
      let finalData = {
        "setting.areaPickerOpened": false,
        "setting.currAreaType":"",
        "setting.provinceIndex":index
      };

      if(index!=setting.provinceIndex){
        finalData = Object.assign(finalData, {
          "setting.cityList": [],
          "setting.cityIndex": -1,
          "setting.countryList": [],
          "setting.countryIndex": -1,
        });
      }
      this.setData(finalData);
    }else if(setting.currAreaType == "city"){
      let finalData ={
        "setting.areaPickerOpened": false,
        "setting.currAreaType":"",
        "setting.cityIndex":index
      };
      if(index!=setting.cityIndex){
        finalData = Object.assign(finalData, {
          "setting.countryList": [],
          "setting.countryIndex": -1,
        });
      }
      this.setData(finalData);
    }else if(setting.currAreaType == "country"){
      let finalData ={
        "setting.areaPickerOpened": false,
        "setting.currAreaType":"",
        "setting.countryIndex":index
      };
      this.setData(finalData);
    }
  },
  onAreaPickerCancel(){
    this.setData({
      "setting.areaPickerOpened": false,
      "setting.currAreaList": [],
      "setting.currAreaType": "",
      "setting.areaDefaultIndex": -1
    });

  },
  onAreaPickerChange(){},
  onAreaPopupClose(){
    this.setData({
      "setting.areaPickerOpened": false
    })
  },
  getAddrCode(addrList, index){
    return (addrList.length>0 && addrList[index] ? addrList[index] : {}).id || -1
  },
  onCardFormSubmit(){
    
    let cardInfo = this.data.pageData.cardInfo;
    let setting = this.data.setting;
    let data = {
      region: JSON.stringify({
        provinceCode: this.getAddrCode(setting.provinceList, setting.provinceIndex),
        cityCode: this.getAddrCode(setting.cityList, setting.cityIndex),
        countryCode: this.getAddrCode(setting.countryList, setting.countryIndex),
      }),
      id: cardInfo.memberID,
      memberName: cardInfo.memberName,
      address: cardInfo.address,
      weChat: cardInfo.weChat,
      memberEmail: cardInfo.memberEmail,
      qq: cardInfo.qq,
      personalIntroduction: cardInfo.personalIntroduction,
    };
    Ajax.requestWithToast(async()=>{
      return Fai.promiseRequest({
        url: "/ajax/user/userCollection?cmd=setUserCollectInfo",
        method: "POST",
        data: data
      });
    })

    
  },
  onUploadHeadImg(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success :(res) =>{
        const tempFilePaths = res.tempFilePaths;
        Fai.uploadFile({
          url:'/ajax/user/userInfo?cmd=uploadHeadImg',
          filePath: tempFilePaths[0],
          name: 'avatarPhotoFile',
          beforeConsume:Toast.clear,
          success:(response)=>{
            let result = response.data;
            if(result.success){
              //do something
              this.setData({
                "pageData.cardInfo.avatarPhoto": result.data.avatarPhotoPath
              });
              Toast.success(result.msg);
            }else{
              Toast.fail(result.msg);
            }
          },
          onProgressUpdate: (progress)=>{
            console.log('progress', progress);
            Toast.loading({
              message:`图片正在上传...${progress.progress}%`,
              duration: 0
            });
          }
        })

      }
    })
  }
})