// pages/setCard/setCard.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");
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

      form: {
        customerName:"",
        position:"",
        customerTel:"",
        companyName:"",
        companyTypeID:-1,
        region: ""
      }
    },
    
    pageData:{
      cardInfo: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    

    
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
      [`setting.form.${field}`]:value
    });
  },
  onFieldChange(event){
    let dataset = event.currentTarget.dataset;
    let field = dataset.field;
    let value = event.detail.value;
    this.setData({
      [`setting.form.${field}`]: event.detail
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    Ajax.requestWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      response = await Ajax.getUserCollectInfo(memberInfo.memberID);
      let cardInfo = response.data.data.userInfo;

      let provinceList = [];
      let cityList = [];
      let countryList = [];
      if(cardInfo.addrInfo.provinceCode>0){
        response = await this.loadProvince();
        provinceList = response.data.data.provinceList;
      }
      if(cardInfo.addrInfo.cityCode>0){
        response = await this.loadCity(cardInfo.addrInfo.provinceCode);
        cityList = response.data.data.cityList;
      }
      if(cardInfo.addrInfo.countryCode>0){
        response = await this.loadCountry(cardInfo.addrInfo.cityCode);
        countryList = response.data.data.countryList;
      }

      let setting = this.data.setting;
      setting.provinceList = provinceList;
      setting.cityList = cityList;
      setting.countryList = countryList;
      // provinceList.forEach((item, index)=>{
      //   if(cardInfo.addrInfo.provinceCode == item.id){
      //     setting.provinceIndex = index;
      //   }
      // })
      // cityList.forEach((item, index)=>{
      //   if(cardInfo.addrInfo.cityCode == item.id){
      //     setting.cityIndex = index;
      //   }
      // })
      // countryList.forEach((item, index)=>{
      //   if(cardInfo.addrInfo.countryCode == item.id){
      //     setting.countryIndex = index;
      //   }
      // });
      
      
      this.setData({
        "setting": setting
      });
      return Promise.resolve(response);
    }, "加载中...");
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
    })
  },
  loadProvince: async function(){
    return Fai.promiseRequestPost({
      url: "/ajax/Common/GetCommData?cmd=getProvinceList"
    })
  },
  loadCity: async function(provinceCode){
    return Fai.promiseRequest({
      url: "/ajax/Common/GetCommData?cmd=getCityList",
      data: {
        provinceCode: provinceCode
      }
    })
  },
  loadCountry: async function(cityCode){
    return Fai.promiseRequest({
      url: "/ajax/Common/GetCommData?cmd=getCountryList",
      data: {
        cityCode: cityCode
      }
    })
  },
  onSelectProvince: async function(){
    let setting = this.data.setting;
    let provinceList = setting.provinceList;
    if(provinceList.length<=0){
      let response = await this.loadProvince();
      provinceList = response.data.data.provinceList;
      this.setData({
        "setting.provinceList": provinceList
      });
    }
    
    this.setData({
      "setting.areaPickerOpened": true,
      "setting.currAreaList": provinceList,
      "setting.currAreaType": "province",
      "setting.areaDefaultIndex": setting.provinceIndex
    });
  },
  onSelectCity: async function(){
    let setting = this.data.setting;
    let cityList = setting.cityList || [];
    if(cityList.length<=0){
      let response = await this.loadCity(setting.provinceList[setting.provinceIndex].id);
      cityList = response.data.data.cityList;
      this.setData({
        "setting.cityList": cityList
      });
    }
    
    this.setData({
      "setting.areaPickerOpened": true,
      "setting.currAreaList": cityList,
      "setting.currAreaType": "city",
      "setting.areaDefaultIndex": setting.cityIndex
    })
  },
  onSelectCountry: async function(){
    let setting = this.data.setting;
    let countryList = setting.countryList;
    if(countryList.length<=0){
      let response = await this.loadCountry(setting.cityList[setting.cityIndex].id);
      countryList = response.data.data.countryList;
      this.setData({
        "setting.countryList": countryList
      });
    }

    this.setData({
      "setting.areaPickerOpened": true,
      "setting.currAreaList": countryList,
      "setting.currAreaType": "country",
      "setting.areaDefaultIndex": setting.countryIndex
    })
  },

  onAreaPickerConfirm(event){
    const { index } = event.detail;
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
    
    let setting = this.data.setting;
    let form = Object.assign({}, this.data.setting.form);
    form.region = JSON.stringify({
      provinceCode: this.getAddrCode(setting.provinceList, setting.provinceIndex),
      cityCode: this.getAddrCode(setting.cityList, setting.cityIndex),
      countryCode: this.getAddrCode(setting.countryList, setting.countryIndex),
    });
    form.companyTypeID = parseInt(form.companyTypeID) || -1;
    Ajax.requestWithToast(async()=>{
      return Fai.promiseRequest({
        url: "/ajax/company/company?cmd=createCompany",
        method: "POST",
        data: form
      });
    },{
      tip4Success:true
    });

  },
  onUploadHeadImg(){
    wx.navigateTo({
      url: '/pages/cutFace/cutFace',
    });
    
  }
})